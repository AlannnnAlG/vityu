import express from 'express';
import crypto from 'crypto';
import pb from '../utils/pocketbaseClient.js';
import logger from '../utils/logger.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const MIDTRANS_IS_PRODUCTION = process.env.MIDTRANS_IS_PRODUCTION === 'true';
const MIDTRANS_SNAP_URL = MIDTRANS_IS_PRODUCTION
  ? 'https://app.midtrans.com/snap/v1/transactions'
  : 'https://app.sandbox.midtrans.com/snap/v1/transactions';
const MIDTRANS_API_URL = MIDTRANS_IS_PRODUCTION
  ? 'https://api.midtrans.com/v2'
  : 'https://api.sandbox.midtrans.com/v2';

const encodedKey = () => Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString('base64');

// ─── Helper: Potong nama produk ──────────────────────────────────────────────
const truncateName = (name, maxLength = 50) => {
  if (!name) return 'Produk';
  return name.length > maxLength ? name.substring(0, maxLength - 3) + '...' : name;
};

// ─── POST /payment/create-transaction ────────────────────────────────────────
router.post('/create-transaction', authMiddleware, async (req, res) => {
  try {
    const { order_id, amount, payment_method, customer_details, item_details, shipping_data } = req.body;
    const userId = req.user.id;

    if (!order_id || !amount || !payment_method) {
      return res.status(400).json({ success: false, error: 'order_id, amount, payment_method wajib diisi' });
    }

    // ── SIMPAN SHIPPING DATA KE DATABASE ──
    if (shipping_data) {
      try {
        let existingOrder = null;
        const orders = await pb.collection('orders').getList(1, 1, {
          filter: `nomor_pesanan = "${order_id}"`,
          $autoCancel: false,
        });
        if (orders.items.length > 0) {
          existingOrder = orders.items[0];
        }

        const fullAddress = [
          shipping_data.alamat || '',
          shipping_data.kota || '',
          shipping_data.provinsi || '',
          shipping_data.kode_pos || ''
        ].filter(Boolean).join(', ');

        const orderPayload = {
          nomor_pesanan: order_id,
          user_id: userId,
          nama_penerima: shipping_data.nama || shipping_data.nama_lengkap || '',
          alamat_pengiriman: fullAddress || shipping_data.alamat || '',
          nomor_telepon_penerima: shipping_data.telepon || shipping_data.nomor_telepon || '',
          total_harga: amount,
          status_pembayaran: 'pending',
          status_pesanan: 'pending',
          items: JSON.stringify(item_details || [])
        };

        if (existingOrder) {
          await pb.collection('orders').update(existingOrder.id, orderPayload, { $autoCancel: false });
          logger.info(`✅ Shipping data updated for order ${order_id}`);
        } else {
          await pb.collection('orders').create(orderPayload, { $autoCancel: false });
          logger.info(`✅ New order created for ${order_id}`);
        }
      } catch (dbErr) {
        logger.error('Gagal simpan shipping data:', dbErr.message);
      }
    }

    if (payment_method === 'cod') {
      await pb.collection('payment_transactions').create({
        order_id,
        user_id: userId,
        amount,
        payment_method: 'cod',
        status: 'pending',
        midtrans_order_id: order_id,
      }, { $autoCancel: false }).catch(e => logger.warn('Gagal simpan transaksi COD:', e.message));

      await updateOrderStatus(order_id, 'pending', 'processing');
      return res.json({ success: true, payment_type: 'cod' });
    }

    const enabledPayments = getEnabledPayments(payment_method);

    // ── FIX: Hitung ulang total & potong nama produk ──
    let totalFromItems = 0;
    const fixedItemDetails = (item_details || []).map(item => {
      const price = Math.round(item.price || 0);
      const qty = item.quantity || 1;
      totalFromItems += price * qty;
      
      // 🔥 POTONG NAMA PRODUK MAKS 50 KARAKTER
      const shortName = truncateName(item.name || 'Produk', 50);
      
      return {
        id: item.id || 'item_' + Date.now(),
        price: price,
        quantity: qty,
        name: shortName
      };
    });

    // ── TAMBAHKAN ONGKIR ──
    const shippingCost = 15000;
    fixedItemDetails.push({
      id: 'shipping_cost',
      price: shippingCost,
      quantity: 1,
      name: 'Ongkos Kirim'
    });
    totalFromItems += shippingCost;

    // ── PASTIKAN AMOUNT SAMA ──
    const finalAmount = Math.round(amount);
    const grossAmount = Math.round(totalFromItems);

    logger.info(`💰 Amount from request: ${finalAmount}, Total from items: ${totalFromItems}, Gross amount: ${grossAmount}`);

    // ── FIX: Kalau gak sama, pake yang dari items ──
    const finalGrossAmount = grossAmount;

    const snapPayload = {
      transaction_details: {
        order_id,
        gross_amount: finalGrossAmount,
      },
      customer_details: {
        first_name: customer_details?.first_name || 'Pelanggan',
        last_name: customer_details?.last_name || '',
        email: customer_details?.email || 'customer@vityuu.com',
        phone: customer_details?.phone || '08123456789',
      },
      item_details: fixedItemDetails,
      enabled_payments: enabledPayments,
      callbacks: {
        finish: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/success`,
        error: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/payment`,
        pending: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/checkout/success`,
      },
    };

    if (payment_method === 'cc') {
      snapPayload.credit_card = { secure: true };
    }

    logger.info(`📦 Snap payload:`, JSON.stringify(snapPayload, null, 2));

    const snapRes = await fetch(MIDTRANS_SNAP_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Basic ${encodedKey()}`,
      },
      body: JSON.stringify(snapPayload),
    });

    const snapData = await snapRes.json();

    if (!snapRes.ok) {
      logger.error('Midtrans error:', JSON.stringify(snapData));
      return res.status(502).json({ success: false, error: 'Gagal membuat transaksi Midtrans', details: snapData });
    }

    try {
      await pb.collection('payment_transactions').create({
        order_id,
        user_id: userId,
        amount: finalGrossAmount,
        payment_method,
        status: 'pending',
        midtrans_order_id: order_id,
        snap_token: snapData.token,
        redirect_url: snapData.redirect_url,
      }, { $autoCancel: false });
    } catch (dbErr) {
      logger.warn('Gagal simpan payment_transactions:', dbErr.message);
    }

    logger.info(`✅ Snap token created for order ${order_id}`);

    res.json({
      success: true,
      snap_token: snapData.token,
      redirect_url: snapData.redirect_url,
    });

  } catch (error) {
    logger.error('create-transaction error:', error.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ─── POST /payment/notification ───────────────────────────────────────────────
router.post('/notification', express.json(), async (req, res) => {
  try {
    const notif = req.body;
    logger.info('Midtrans notification:', JSON.stringify(notif));

    const { order_id, status_code, gross_amount, signature_key, transaction_status, fraud_status, payment_type } = notif;

    const expected = crypto
      .createHash('sha512')
      .update(`${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`)
      .digest('hex');

    if (signature_key !== expected) {
      logger.warn(`Signature tidak valid untuk order ${order_id}`);
      return res.status(403).json({ error: 'Signature tidak valid' });
    }

    let paymentStatus = 'pending';
    let orderStatus = 'pending';
    let orderPesanan = 'pending';

    if (transaction_status === 'capture' && fraud_status === 'accept') {
      paymentStatus = 'paid'; orderStatus = 'processing'; orderPesanan = 'processing';
    } else if (transaction_status === 'settlement') {
      paymentStatus = 'paid'; orderStatus = 'processing'; orderPesanan = 'processing';
    } else if (['cancel', 'deny'].includes(transaction_status)) {
      paymentStatus = 'failed'; orderStatus = 'cancelled'; orderPesanan = 'cancelled';
    } else if (transaction_status === 'expire') {
      paymentStatus = 'expired'; orderStatus = 'cancelled'; orderPesanan = 'cancelled';
    }

    try {
      const txList = await pb.collection('payment_transactions').getList(1, 1, {
        filter: `midtrans_order_id = "${order_id}"`,
        $autoCancel: false,
      });
      if (txList.items.length > 0) {
        await pb.collection('payment_transactions').update(txList.items[0].id, {
          status: paymentStatus,
          payment_type: payment_type || '',
        }, { $autoCancel: false });
        logger.info(`payment_transactions updated: ${txList.items[0].id} → ${paymentStatus}`);
      } else {
        await pb.collection('payment_transactions').create({
          order_id,
          midtrans_order_id: order_id,
          amount: parseFloat(gross_amount),
          payment_method: payment_type || 'unknown',
          payment_type: payment_type || '',
          status: paymentStatus,
        }, { $autoCancel: false });
        logger.info(`payment_transactions dibuat baru untuk order ${order_id}`);
      }
    } catch (err) {
      logger.error('Gagal update payment_transactions:', err.message);
    }

    await updateOrderStatus(order_id, orderStatus, orderPesanan);

    res.json({ success: true });
  } catch (error) {
    logger.error('Notification error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── GET /payment/status/:orderId ────────────────────────────────────────────
router.get('/status/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    let localStatus = null;
    let orderData = null;
    
    try {
      const txList = await pb.collection('payment_transactions').getList(1, 1, {
        filter: `midtrans_order_id = "${orderId}"`,
        $autoCancel: false,
      });
      if (txList.items.length > 0) localStatus = txList.items[0].status;
    } catch (e) {
      logger.warn('Gagal ambil status lokal:', e.message);
    }

    try {
      const orders = await pb.collection('orders').getList(1, 1, {
        filter: `nomor_pesanan = "${orderId}"`,
        $autoCancel: false,
      });
      if (orders.items.length > 0) {
        const o = orders.items[0];
        orderData = {
          nama_penerima: o.nama_penerima || '',
          alamat_pengiriman: o.alamat_pengiriman || '',
          nomor_telepon_penerima: o.nomor_telepon_penerima || '',
          total_harga: o.total_harga || 0,
          status_pembayaran: o.status_pembayaran || '',
          status_pesanan: o.status_pesanan || '',
        };
      }
    } catch (e) {
      logger.warn('Gagal ambil order data:', e.message);
    }

    let midtransStatus = null;
    try {
      const mtRes = await fetch(`${MIDTRANS_API_URL}/${orderId}/status`, {
        headers: { Authorization: `Basic ${encodedKey()}` },
      });
      if (mtRes.ok) {
        const mtData = await mtRes.json();
        midtransStatus = mtData.transaction_status;
      }
    } catch (e) {
      logger.warn('Gagal ambil status Midtrans:', e.message);
    }

    res.json({ 
      order_id: orderId, 
      local_status: localStatus, 
      midtrans_status: midtransStatus,
      order_data: orderData
    });
  } catch (error) {
    logger.error('Status check error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ─── GET /payment/order/:orderId ─────────────────────────────────────────────
router.get('/order/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;

    const orders = await pb.collection('orders').getList(1, 1, {
      filter: `nomor_pesanan = "${orderId}"`,
      $autoCancel: false,
    });

    if (orders.items.length === 0) {
      return res.status(404).json({ success: false, error: 'Order tidak ditemukan' });
    }

    const o = orders.items[0];
    res.json({
      success: true,
      order: {
        id: o.id,
        nomor_pesanan: o.nomor_pesanan,
        nama_penerima: o.nama_penerima || '',
        alamat_pengiriman: o.alamat_pengiriman || '',
        nomor_telepon_penerima: o.nomor_telepon_penerima || '',
        total_harga: o.total_harga || 0,
        status_pembayaran: o.status_pembayaran || '',
        status_pesanan: o.status_pesanan || '',
        items: o.items || '[]',
        created: o.created,
      }
    });
  } catch (error) {
    logger.error('Get order error:', error.message);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ─── Helper: Update status order ─────────────────────────────────────────────
async function updateOrderStatus(nomorPesanan, statusPembayaran, statusPesanan) {
  try {
    const orders = await pb.collection('orders').getList(1, 1, {
      filter: `nomor_pesanan = "${nomorPesanan}"`,
      $autoCancel: false,
    });
    if (orders.items.length > 0) {
      const updateData = {};
      if (statusPembayaran) updateData.status_pembayaran = statusPembayaran;
      if (statusPesanan) updateData.status_pesanan = statusPesanan;
      await pb.collection('orders').update(orders.items[0].id, updateData, { $autoCancel: false });
      logger.info(`Order ${nomorPesanan} updated → pembayaran: ${statusPembayaran}, pesanan: ${statusPesanan}`);
    } else {
      logger.warn(`Order tidak ditemukan: ${nomorPesanan}`);
    }
  } catch (err) {
    logger.error(`Gagal update order ${nomorPesanan}:`, err.message);
  }
}

// ─── Helper: Enabled payments Midtrans ───────────────────────────────────────
function getEnabledPayments(method) {
  const map = {
    qris: ['gopay', 'shopeepay', 'other_qris'],
    va_bca: ['bca_va'],
    va_mandiri: ['echannel'],
    va_bni: ['bni_va'],
    va_bri: ['bri_va'],
    gopay: ['gopay'],
    shopeepay: ['shopeepay'],
    dana: ['shopeepay'],
    ovo: ['shopeepay'],
    cc: ['credit_card'],
  };
  return map[method] || ['gopay', 'shopeepay', 'other_qris', 'bca_va', 'bni_va', 'bri_va', 'echannel', 'credit_card'];
}

export default router;