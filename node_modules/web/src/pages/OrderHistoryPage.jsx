import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, ArrowLeft } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';

const OrderHistoryPage = () => {
  const [orders] = useLocalStorage('vityu_orders', []);

  return (
    <>
      <Helmet>
        <title>Riwayat Pesanan - Vityu</title>
      </Helmet>

      <div className="w-full flex flex-col p-4 gap-6 pb-8">
        <div className="flex items-center gap-3">
          <Link to="/profile" className="p-2 -ml-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Riwayat Pesanan</h1>
        </div>

        {orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center gap-4">
            <div className="h-16 w-16 bg-muted rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Belum ada pesanan.</p>
            <Link to="/shop" className="text-primary font-bold mt-2">Mulai Belanja</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {orders.map((order, index) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-card border rounded-2xl p-4 shadow-sm flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-mono text-sm font-bold">{order.id}</p>
                    <p className="text-xs text-muted-foreground">{new Date(order.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-wider rounded-full">
                    {order.status}
                  </span>
                </div>
                
                <div className="h-px w-full bg-border" />
                
                <div className="flex flex-col gap-1">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm">
                      <span className="text-muted-foreground truncate pr-4">{item.quantity}x {item.name}</span>
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-between items-center mt-2 pt-2 border-t">
                  <span className="text-sm font-bold">Total</span>
                  <span className="font-bold text-primary">Rp {order.total.toLocaleString('id-ID')}</span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default OrderHistoryPage;