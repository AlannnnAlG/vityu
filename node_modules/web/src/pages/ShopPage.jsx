import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart as CartIcon, Star, Package, Search,
  Tag, X, Plus, Minus,
  ShoppingBag, Zap,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { addToCart } from '@/lib/cartUtils.js';
import { toast } from 'sonner';

const CATEGORIES = [
  { value: 'all', label: 'Semua' },
  { value: 'skincare', label: '🍵 Teh Herbal' },
  { value: 'bodycare', label: '🌿 Minuman Herbal' },
  { value: 'makeup', label: '💄 Makeup' },
  { value: 'haircare', label: '💇 Haircare' },
];

const getCategoryLabel = (kategori) => {
  const map = {
    skincare: '🍵 Teh Herbal',
    bodycare: '🌿 Minuman Herbal',
    makeup: '💄 Makeup',
    haircare: '💇 Haircare',
  };
  return map[kategori] || kategori || 'Produk';
};

// ─── Product Modal ─────────────────────────────────────────────────────────────
const ProductQtyModal = ({ product, mode, onClose, onConfirm }) => {
  const [qty, setQty] = useState(1);
  const imageUrl = product.gambar_produk
    ? pb.files.getURL(product, product.gambar_produk)
    : null;
  const hasDiscount = product.harga_diskon && product.harga_diskon < product.harga;
  const finalPrice = product.harga_diskon || product.harga;
  const discountPct = hasDiscount
    ? Math.round(((product.harga - product.harga_diskon) / product.harga) * 100)
    : 0;
  const maxQty = product.stok || 99;

  const handleQty = (val) => setQty(Math.max(1, Math.min(maxQty, val)));

  const isBuyNow = mode === 'buynow';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
        style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="relative w-full sm:max-w-md bg-white dark:bg-gray-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
        >
          <div className="flex justify-center pt-3 pb-1 sm:hidden">
            <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-gray-700" />
          </div>

          <div className={`h-1 hidden sm:block ${isBuyNow ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-emerald-400 to-teal-400'}`} />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </button>

          <div className="px-5 pt-4 pb-0">
            <span className={`inline-block text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
              isBuyNow
                ? 'bg-emerald-500 text-white'
                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400'
            }`}>
              {isBuyNow ? '⚡ Beli Sekarang' : '🛒 Tambah ke Keranjang'}
            </span>
          </div>

          <div className="flex items-start gap-4 px-5 pt-3 pb-5 border-b border-gray-100 dark:border-gray-800">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-50 to-emerald-50 dark:from-gray-800 dark:to-emerald-950/30 flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-100 dark:border-gray-700">
              {imageUrl
                ? <img src={imageUrl} alt={product.nama_produk} className="w-full h-full object-contain p-1" />
                : <Package className="w-8 h-8 text-gray-300" />}
            </div>
            <div className="flex-1 min-w-0 pr-8">
              <p className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                {getCategoryLabel(product.kategori)}
              </p>
              <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 mb-2">
                {product.nama_produk}
              </h3>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400">
                  Rp {(finalPrice * qty).toLocaleString('id-ID')}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-gray-400 line-through">
                    Rp {(product.harga * qty).toLocaleString('id-ID')}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <span className="inline-block mt-1 text-[10px] font-bold bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400 px-2 py-0.5 rounded-full">
                  Hemat {discountPct}%
                </span>
              )}
            </div>
          </div>

          <div className="px-5 py-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Stok tersedia</span>
              <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{maxQty} pcs</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Jumlah</span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleQty(qty - 1)}
                  disabled={qty <= 1}
                  className="w-9 h-9 rounded-xl border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all hover:border-emerald-400 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <input
                  type="number"
                  value={qty}
                  min={1}
                  max={maxQty}
                  onChange={(e) => handleQty(parseInt(e.target.value) || 1)}
                  className="w-14 text-center font-bold text-lg text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-xl py-1.5 focus:outline-none focus:border-emerald-400 transition-colors"
                />
                <button
                  onClick={() => handleQty(qty + 1)}
                  disabled={qty >= maxQty}
                  className="w-9 h-9 rounded-xl border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all hover:border-emerald-400 hover:text-emerald-600 disabled:opacity-30 disabled:cursor-not-allowed active:scale-90"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-2xl p-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">
                  Rp {finalPrice.toLocaleString('id-ID')} × {qty}
                </span>
                <span className="font-extrabold text-emerald-700 dark:text-emerald-400 text-base">
                  Rp {(finalPrice * qty).toLocaleString('id-ID')}
                </span>
              </div>
              {hasDiscount && (
                <div className="flex justify-between items-center text-xs mt-1.5 text-gray-400">
                  <span>Harga asli</span>
                  <span className="line-through">Rp {(product.harga * qty).toLocaleString('id-ID')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="px-5 pb-6">
            {isBuyNow ? (
              <button
                onClick={() => onConfirm(qty)}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3.5 rounded-2xl transition-all active:scale-95 shadow-md shadow-emerald-200 dark:shadow-emerald-900/30"
              >
                <Zap className="w-4 h-4" />
                Lanjut ke Checkout
              </button>
            ) : (
              <button
                onClick={() => onConfirm(qty)}
                className="w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3.5 rounded-2xl transition-all active:scale-95 shadow-md shadow-emerald-200 dark:shadow-emerald-900/30"
              >
                <CartIcon className="w-4 h-4" />
                Tambah ke Keranjang
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ product, index, onOpenCartModal, onOpenBuyNowModal }) => {
  const imageUrl = product.gambar_produk
    ? pb.files.getURL(product, product.gambar_produk)
    : null;
  const hasDiscount = product.harga_diskon && product.harga_diskon < product.harga;
  const discountPct = hasDiscount
    ? Math.round(((product.harga - product.harga_diskon) / product.harga) * 100)
    : 0;
  const finalPrice = product.harga_diskon || product.harga;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      className="group flex flex-col bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-xl hover:shadow-gray-200/60 dark:hover:shadow-black/40 hover:-translate-y-1 transition-all duration-300"
    >
      <div
        className="relative bg-gradient-to-br from-gray-50 to-emerald-50/40 dark:from-gray-800 dark:to-emerald-950/20 overflow-hidden"
        style={{ paddingTop: '100%' }}
      >
        <div className="absolute inset-0 flex items-center justify-center p-4">
          {hasDiscount && (
            <span className="absolute top-2.5 left-2.5 z-10 bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <Tag className="w-2.5 h-2.5" /> -{discountPct}%
            </span>
          )}
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.nama_produk}
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500 drop-shadow-md"
            />
          ) : (
            <Package className="w-14 h-14 text-gray-300" />
          )}
        </div>
      </div>

      <div className="flex flex-col flex-grow p-3.5">
        <div className="flex items-center justify-between gap-1 mb-2">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full truncate max-w-[70%]">
            {getCategoryLabel(product.kategori)}
          </span>
          <div className="flex items-center gap-0.5 flex-shrink-0">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="text-[11px] font-bold text-gray-700 dark:text-gray-200">4.9</span>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 dark:text-white text-sm leading-snug line-clamp-2 mb-1">
          {product.nama_produk}
        </h3>

        {product.deskripsi && (
          <p className="text-[11px] text-gray-400 dark:text-gray-500 line-clamp-2 mb-2 leading-relaxed flex-grow">
            {product.deskripsi}
          </p>
        )}

        <div className="mt-auto space-y-2.5">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-base font-extrabold text-gray-900 dark:text-white">
              Rp {finalPrice.toLocaleString('id-ID')}
            </span>
            {hasDiscount && (
              <span className="text-[11px] text-gray-400 line-through">
                Rp {product.harga.toLocaleString('id-ID')}
              </span>
            )}
          </div>

          {/* 🔥 TOMBOL: MOBILE = ATAS BAWAH, DESKTOP = SAMPINGAN */}
          <div className="flex flex-col sm:flex-row gap-1.5">
            <button
              onClick={() => onOpenCartModal(product)}
              className="flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 font-semibold py-2.5 px-2 rounded-xl transition-all active:scale-95 border border-emerald-200 dark:border-emerald-800 text-xs w-full sm:w-auto sm:flex-1 whitespace-nowrap"
            >
              <CartIcon className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Keranjang</span>
            </button>
            <button
              onClick={() => onOpenBuyNowModal(product)}
              className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold py-2.5 px-2 rounded-xl transition-all active:scale-95 text-xs w-full sm:w-auto sm:flex-1 whitespace-nowrap"
            >
              <Zap className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Beli Sekarang</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
const ShopPage = () => {
  const navigate = useNavigate();
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartItems, setCartItems]       = useState([]);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const records = await pb.collection('products').getFullList({
          filter: 'status = "published" && (is_deleted = false || is_deleted = null)',
          sort: '-created',
          $autoCancel: false,
        });
        setProducts(records);
      } catch (err) {
        console.error(err);
        toast.error('Gagal memuat produk');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = useCallback((product, qty = 1) => {
    const item = {
      id:    product.id,
      name:  product.nama_produk,
      price: product.harga_diskon || product.harga,
      image: product.gambar_produk ? pb.files.getURL(product, product.gambar_produk) : null,
    };
    addToCart(item, qty);
    setCartItems((prev) => {
      const exist = prev.find((i) => i.id === item.id);
      if (exist) return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...item, qty }];
    });
  }, []);

  const handleBuyNow = useCallback((product, qty = 1) => {
    const item = {
      id:    product.id,
      name:  product.nama_produk,
      price: product.harga_diskon || product.harga,
      image: product.gambar_produk ? pb.files.getURL(product, product.gambar_produk) : null,
      _direct: true,
    };
    addToCart(item, qty);
    navigate(`/checkout?items=${product.id}`);
  }, [navigate]);

  const handleModalConfirm = useCallback((qty) => {
    if (!modal) return;
    const { product, mode } = modal;

    setModal(null);

    if (mode === 'buynow') {
      handleBuyNow(product, qty);
    } else {
      handleAddToCart(product, qty);
      toast.success(`${product.nama_produk} ditambahkan ke keranjang!`);
      window.dispatchEvent(new Event('vityuu_cart_updated'));
    }
  }, [modal, handleAddToCart, handleBuyNow]);

  const filtered = products.filter((p) => {
    const matchSearch = p.nama_produk.toLowerCase().includes(search.toLowerCase());
    const matchCat    = activeCategory === 'all' || p.kategori === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <>
      <Helmet>
        <title>Toko Vityuu - Produk Pengendali Gula Alami</title>
        <meta name="description" content="Katalog resmi produk Vityuu." />
      </Helmet>

      <div className="min-h-screen bg-[#f7f8fa] dark:bg-gray-950 pb-20 font-sans">
        <Header />

        <section className="py-12 md:py-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 px-4 py-1.5 rounded-full mb-4">
                Koleksi Terlengkap
              </span>
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-3" style={{ letterSpacing: '-0.02em' }}>
                Katalog{' '}
                <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">
                  Produk Vityuu
                </span>
              </h1>
              <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                Solusi terlengkap untuk membantu rutinitas diet gula harian Anda.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="sticky top-0 z-30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3 mb-3">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <Input
                  placeholder="Cari produk..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 h-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-0.5 scrollbar-none -mx-1 px-1">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0 ${
                    activeCategory === cat.value
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-sm'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {!loading && filtered.length > 0 && (
              <p className="text-xs text-gray-400 mb-5">
                Menampilkan <span className="font-bold text-gray-700 dark:text-gray-200">{filtered.length}</span> produk
              </p>
            )}

            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800" />
                    <div className="p-3.5 space-y-2.5">
                      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-2/5" />
                      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-4/5" />
                      <div className="h-5 bg-gray-100 dark:bg-gray-800 rounded-full w-1/2" />
                      <div className="flex flex-col sm:flex-row gap-1.5">
                        <div className="flex-1 h-9 bg-gray-100 dark:bg-gray-800 rounded-xl w-full" />
                        <div className="flex-1 h-9 bg-gray-100 dark:bg-gray-800 rounded-xl w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="text-center py-20 flex flex-col items-center gap-4">
                <div className="w-16 h-16 rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Package className="w-8 h-8 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">Produk tidak ditemukan</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  {search || activeCategory !== 'all'
                    ? 'Coba ubah filter atau kata kunci pencarian.'
                    : 'Belum ada produk yang tersedia.'}
                </p>
                {(search || activeCategory !== 'all') && (
                  <button
                    onClick={() => { setSearch(''); setActiveCategory('all'); }}
                    className="text-sm font-semibold text-emerald-600 hover:underline"
                  >
                    Reset filter
                  </button>
                )}
              </div>
            )}

            {!loading && filtered.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-5">
                {filtered.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onOpenCartModal={(p) => setModal({ product: p, mode: 'cart' })}
                    onOpenBuyNowModal={(p) => setModal({ product: p, mode: 'buynow' })}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>

      {modal && (
        <ProductQtyModal
          product={modal.product}
          mode={modal.mode}
          onClose={() => setModal(null)}
          onConfirm={handleModalConfirm}
        />
      )}
    </>
  );
};

export default ShopPage;