import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ShoppingCart as CartIcon, Star, Package, Search, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { addToCart } from '@/lib/cartUtils.js';
import { toast } from 'sonner';

const CATEGORIES = [
  { value: 'all', label: 'Semua' },
  { value: 'skincare', label: 'Skincare' },
  { value: 'makeup', label: 'Makeup' },
  { value: 'haircare', label: 'Haircare' },
  { value: 'bodycare', label: 'Bodycare' },
];

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

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

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    // Konversi format PocketBase ke format cart
    const cartItem = {
      id: product.id,
      name: product.nama_produk,
      price: product.harga_diskon || product.harga,
      image: product.gambar_produk
        ? pb.files.getURL(product, product.gambar_produk)
        : null,
    };
    addToCart(cartItem, 1);
    toast.success(`${product.nama_produk} ditambahkan ke keranjang`);
  };

  const filtered = products.filter((p) => {
    const matchSearch = p.nama_produk.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'all' || p.kategori === activeCategory;
    return matchSearch && matchCat;
  });

  return (
    <>
      <Helmet>
        <title>Toko Vityuu - Produk Pengendali Gula Alami</title>
        <meta
          name="description"
          content="Katalog resmi produk Vityuu. Dapatkan Diet Sugar Spray, Miracle Tea, dan Paket Reseller."
        />
      </Helmet>

      <div className="min-h-screen bg-background pb-20 font-sans">
        <Header />

        {/* Hero Section */}
        <section className="py-20 bg-gradient-to-b from-muted/50 to-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <h1
                className="text-4xl md:text-5xl font-bold text-foreground mb-6"
                style={{ letterSpacing: '-0.02em' }}
              >
                Katalog <span className="text-primary">Produk Vityuu</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Solusi terlengkap untuk membantu rutinitas diet gula harian Anda.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter & Search */}
        <section className="py-6 border-b border-border bg-card/50 sticky top-0 z-10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari produk..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-background"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 w-full sm:w-auto">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setActiveCategory(cat.value)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
                    activeCategory === cat.value
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Loading Skeleton */}
            {loading && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-card rounded-2xl border border-border overflow-hidden animate-pulse">
                    <div className="aspect-square bg-muted" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-full" />
                      <div className="h-6 bg-muted rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && filtered.length === 0 && (
              <div className="text-center py-24">
                <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Produk tidak ditemukan</h3>
                <p className="text-muted-foreground">
                  {search || activeCategory !== 'all'
                    ? 'Coba ubah filter atau kata kunci pencarian.'
                    : 'Belum ada produk yang ditambahkan oleh admin.'}
                </p>
              </div>
            )}

            {/* Product Cards */}
            {!loading && filtered.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
                {filtered.map((product, index) => {
                  const imageUrl = product.gambar_produk
                    ? pb.files.getURL(product, product.gambar_produk)
                    : null;
                  const hasDiscount = product.harga_diskon && product.harga_diskon < product.harga;

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.05 }}
                    >
                      <Link
                        to={`/shop/${product.id}`}
                        className="group flex flex-col h-full bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                      >
                        {/* Image */}
                        <div className="relative aspect-square bg-muted/30 p-6 flex items-center justify-center overflow-hidden">
                          {hasDiscount && (
                            <div className="absolute top-3 left-3 z-10 bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                              Diskon
                            </div>
                          )}
                          {imageUrl ? (
                            <img
                              src={imageUrl}
                              alt={product.nama_produk}
                              className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
                            />
                          ) : (
                            <Package className="w-16 h-16 text-muted-foreground" />
                          )}
                        </div>

                        {/* Info */}
                        <div className="p-4 md:p-5 flex flex-col flex-grow">
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-bold text-foreground">4.9</span>
                            <span className="text-xs text-muted-foreground capitalize ml-1">· {product.kategori}</span>
                          </div>

                          <h3 className="font-bold text-foreground text-base mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                            {product.nama_produk}
                          </h3>

                          {product.deskripsi && (
                            <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                              {product.deskripsi}
                            </p>
                          )}

                          <div className="mt-auto space-y-3">
                            <div className="flex flex-col">
                              <span className="text-xl font-extrabold text-foreground">
                                Rp {(product.harga_diskon || product.harga).toLocaleString('id-ID')}
                              </span>
                              {hasDiscount && (
                                <span className="text-sm text-muted-foreground line-through decoration-destructive/50">
                                  Rp {product.harga.toLocaleString('id-ID')}
                                </span>
                              )}
                            </div>

                            <div className="grid grid-cols-1 gap-2">
                              <Button
                                onClick={(e) => handleAddToCart(e, product)}
                                className="w-full btn-primary group-hover:bg-primary/90 transition-colors"
                              >
                                <CartIcon className="w-4 h-4 mr-2" /> Tambah
                              </Button>
                              <Button variant="outline" className="w-full border-2 hover:bg-muted">
                                Lihat Detail
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ShopPage;