import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  ShoppingCart as CartIcon, Star, Package, Search,
  SlidersHorizontal, Tag, CheckCircle2, X,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { addToCart } from '@/lib/cartUtils.js';
import { toast } from 'sonner';

// 🔥 KATEGORI - LABEL SUDAH DISESUAIKAN UNTUK VITYUU
const CATEGORIES = [
  { value: 'all', label: '📦 Semua' },
  { value: 'skincare', label: '🍵 Teh Herbal' },
  { value: 'bodycare', label: '🌿 Minuman Herbal' },
  { value: 'makeup', label: '💄 Makeup' },
  { value: 'haircare', label: '💇 Haircare' },
];

// 🔥 FUNGSI MAPPING KATEGORI KE LABEL
const getCategoryLabel = (kategori) => {
  const map = {
    'skincare': '🍵 Teh Herbal',
    'bodycare': '🌿 Minuman Herbal',
    'makeup': '💄 Makeup',
    'haircare': '💇 Haircare'
  };
  return map[kategori] || kategori || 'Produk';
};

// ─── Mini Cart Drawer ─────────────────────────────────────────────────────────
const CartDrawer = ({ items, onClose, onCheckout }) => {
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex justify-end"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
        onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      >
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 280 }}
          className="w-full max-w-sm bg-white dark:bg-gray-900 h-full flex flex-col shadow-2xl"
        >
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <CartIcon className="w-5 h-5 text-emerald-500" /> Keranjang
            </h2>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <CartIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Keranjang masih kosong</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden border border-gray-100 dark:border-gray-700">
                    {item.image
                      ? <img src={item.image} alt={item.name} className="w-full h-full object-contain p-1" />
                      : <Package className="w-6 h-6 text-gray-300" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">{item.name}</p>
                    <p className="text-xs text-gray-400">x{item.qty}</p>
                  </div>
                  <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex-shrink-0">
                    Rp {(item.price * item.qty).toLocaleString('id-ID')}
                  </p>
                </div>
              ))
            )}
          </div>

          {items.length > 0 && (
            <div className="px-6 py-5 border-t border-gray-100 dark:border-gray-800 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-xl font-extrabold text-gray-900 dark:text-white">
                  Rp {total.toLocaleString('id-ID')}
                </span>
              </div>
              <button
                onClick={onCheckout}
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md active:scale-[0.98]"
              >
                Lanjut ke Checkout →
              </button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// ─── Product Card ─────────────────────────────────────────────────────────────
const ProductCard = ({ product, index, onAddToCart, onCheckout }) => {
  const [added, setAdded] = useState(false);
  const imageUrl = product.gambar_produk
    ? pb.files.getURL(product, product.gambar_produk)
    : null;
  const hasDiscount = product.harga_diskon && product.harga_diskon < product.harga;
  const discountPct = hasDiscount
    ? Math.round(((product.harga - product.harga_diskon) / product.harga) * 100)
    : 0;

  const handleAdd = (e) => {
    e.preventDefault();
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.05 }}
      className="group flex flex-col bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/60 dark:hover:shadow-black/40 hover:-translate-y-1.5 transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-emerald-50/30 dark:from-gray-800 dark:to-emerald-950/20 flex items-center justify-center p-6 overflow-hidden">
        {hasDiscount && (
          <span className="absolute top-3 left-3 z-10 bg-rose-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
            <Tag className="w-2.5 h-2.5" /> -{discountPct}%
          </span>
        )}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.nama_produk}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-lg"
          />
        ) : (
          <Package className="w-16 h-16 text-gray-300" />
        )}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-grow p-4">
        <div className="flex items-center justify-between mb-2">
          {/* 🔥 PAKE getCategoryLabel BIAR TAMPIL BAGUS */}
          <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-full">
            {getCategoryLabel(product.kategori)}
          </span>
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-xs font-bold text-gray-700 dark:text-gray-200">4.9</span>
          </div>
        </div>

        <h3 className="font-bold text-gray-900 dark:text-white text-sm mb-1 line-clamp-2 leading-snug">
          {product.nama_produk}
        </h3>

        {product.deskripsi && (
          <p className="text-xs text-gray-400 dark:text-gray-500 line-clamp-2 mb-3 leading-relaxed flex-grow">
            {product.deskripsi}
          </p>
        )}

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-lg font-extrabold text-gray-900 dark:text-white">
              Rp {(product.harga_diskon || product.harga).toLocaleString('id-ID')}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                Rp {product.harga.toLocaleString('id-ID')}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAdd}
              className={`flex items-center justify-center gap-1.5 font-bold py-2.5 rounded-xl transition-all active:scale-95 text-xs ${
                added
                  ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-sm shadow-emerald-200 dark:shadow-emerald-900/20'
              }`}
            >
              {added
                ? <><CheckCircle2 className="w-3.5 h-3.5" /> Ditambahkan!</>
                : <><CartIcon className="w-3.5 h-3.5" /> Keranjang</>
              }
            </button>
            <button
              onClick={(e) => { e.preventDefault(); handleAdd(e); onCheckout(); }}
              className="flex items-center justify-center gap-1.5 font-bold py-2.5 rounded-xl transition-all active:scale-95 text-xs bg-gray-900 dark:bg-white hover:bg-gray-700 dark:hover:bg-gray-100 text-white dark:text-gray-900 shadow-sm"
            >
              Checkout →
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
  const [products, setProducts]             = useState([]);
  const [loading, setLoading]               = useState(true);
  const [search, setSearch]                 = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [cartItems, setCartItems]           = useState([]);
  const [cartOpen, setCartOpen]             = useState(false);

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

  const handleAddToCart = useCallback((product) => {
    const item = {
      id:    product.id,
      name:  product.nama_produk,
      price: product.harga_diskon || product.harga,
      image: product.gambar_produk ? pb.files.getURL(product, product.gambar_produk) : null,
    };
    addToCart(item, 1);
    setCartItems((prev) => {
      const exist = prev.find((i) => i.id === item.id);
      if (exist) return prev.map((i) => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    toast.success(`${product.nama_produk} ditambahkan!`, {
      action: { label: 'Lihat Keranjang', onClick: () => setCartOpen(true) },
    });
  }, []);

  const filtered = products.filter((p) => {
    const matchSearch = p.nama_produk.toLowerCase().includes(search.toLowerCase());
    const matchCat    = activeCategory === 'all' || p.kategori === activeCategory;
    return matchSearch && matchCat;
  });

  const totalCartQty = cartItems.reduce((s, i) => s + i.qty, 0);

  return (
    <>
      <Helmet>
        <title>Toko Vityuu - Produk Pengendali Gula Alami</title>
        <meta name="description" content="Katalog resmi produk Vityuu." />
      </Helmet>

      <div className="min-h-screen bg-[#f8f9fb] dark:bg-gray-950 pb-20 font-sans">
        <Header />

        {/* Hero */}
        <section className="py-16 bg-gradient-to-b from-white dark:from-gray-900 to-transparent border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="inline-block text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 dark:bg-emerald-950/50 dark:text-emerald-400 px-4 py-1.5 rounded-full mb-4">
                Koleksi Terlengkap
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4" style={{ letterSpacing: '-0.02em' }}>
                Katalog <span className="bg-gradient-to-r from-emerald-500 to-teal-400 bg-clip-text text-transparent">Produk Vityuu</span>
              </h1>
              <p className="text-base text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
                Solusi terlengkap untuk membantu rutinitas diet gula harian Anda.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter & Search */}
        <section className="py-4 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 sticky top-0 z-30 backdrop-blur-md shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
              <div className="flex items-center gap-2 overflow-x-auto">
                <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat.value}
                    onClick={() => setActiveCategory(cat.value)}
                    className={`px-4 py-1.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${
                      activeCategory === cat.value
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-white border-transparent shadow-sm'
                        : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-emerald-400 hover:text-emerald-600'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Cart button — muncul kalau ada item */}
              {totalCartQty > 0 && (
                <button
                  onClick={() => setCartOpen(true)}
                  className="flex-shrink-0 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-full transition-all shadow-md"
                >
                  <CartIcon className="w-4 h-4" />
                  <span className="text-sm">{totalCartQty}</span>
                  <span className="hidden sm:inline text-sm">Checkout</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* Products */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {!loading && filtered.length > 0 && (
              <p className="text-sm text-gray-400 mb-6">
                Menampilkan <span className="font-bold text-gray-700 dark:text-gray-200">{filtered.length}</span> produk
              </p>
            )}

            {/* Skeleton */}
            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-pulse">
                    <div className="aspect-square bg-gray-100 dark:bg-gray-800" />
                    <div className="p-4 space-y-3">
                      <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full w-1/3" />
                      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-3/4" />
                      <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-full w-1/2" />
                      <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty */}
            {!loading && filtered.length === 0 && (
              <div className="text-center py-24 flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-3xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Package className="w-10 h-10 text-gray-300 dark:text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">Produk tidak ditemukan</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  {search || activeCategory !== 'all'
                    ? 'Coba ubah filter atau kata kunci pencarian.'
                    : 'Belum ada produk yang ditambahkan oleh admin.'}
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

            {/* Grid */}
            {!loading && filtered.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {filtered.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={index}
                    onAddToCart={handleAddToCart}
                    onCheckout={() => { handleAddToCart(product); navigate('/checkout'); }}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>

      {/* Mini Cart Drawer */}
      {cartOpen && (
        <CartDrawer
          items={cartItems}
          onClose={() => setCartOpen(false)}
          onCheckout={() => { setCartOpen(false); navigate('/checkout'); }}
        />
      )}
    </>
  );
};

export default ShopPage;