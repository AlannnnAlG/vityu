import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Star, Minus, Plus, ShoppingCart, ArrowLeft, CheckCircle2, ShieldCheck, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { getProductById } from '@/lib/products.js';
import { addToCart } from '@/lib/cartUtils.js';
import { toast } from 'sonner';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const foundProduct = getProductById(productId);
    if (foundProduct) {
      setProduct(foundProduct);
    } else {
      navigate('/shop');
    }
    window.scrollTo(0, 0);
  }, [productId, navigate]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity}x ${product.name} ditambahkan ke keranjang`);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate('/cart');
  };

  const dummyReviews = [
    { id: 1, name: 'Siti R.', rating: 5, date: '12 Jun 2026', comment: 'Sangat membantu mengurangi keinginan ngemil manis di sore hari. Rasanya mint segar.', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=100' },
    { id: 2, name: 'Budi S.', rating: 5, date: '05 Jun 2026', comment: 'Pengiriman cepat, packing aman. Produknya original dan beneran works buat saya yang lagi diet gula.', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100' },
    { id: 3, name: 'Anita W.', rating: 4, date: '28 Mei 2026', comment: 'Praktis dibawa kemana-mana. Cukup semprot 2x langsung hilang rasa pengen manisnya.', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100' }
  ];

  return (
    <>
      <Helmet>
        <title>{product.name} | Vityuu</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-grow py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            {/* Breadcrumb */}
            <div className="mb-8">
              <Link to="/shop" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Katalog
              </Link>
            </div>

            {/* Product Top Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              
              {/* Image Gallery */}
              <div className="space-y-4">
                <div 
                  className={`relative aspect-square bg-muted/30 rounded-3xl border border-border overflow-hidden cursor-zoom-in ${isZoomed ? 'cursor-zoom-out' : ''}`}
                  onClick={() => setIsZoomed(!isZoomed)}
                >
                  {product.badge && (
                    <div className="absolute top-6 left-6 z-10 bg-secondary text-secondary-foreground px-4 py-1.5 rounded-full text-sm font-bold shadow-md">
                      {product.badge}
                    </div>
                  )}
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className={`w-full h-full object-contain p-8 transition-transform duration-500 ${isZoomed ? 'scale-150' : 'hover:scale-105'}`}
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="flex flex-col">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4" style={{ letterSpacing: '-0.02em' }}>
                  {product.name}
                </h1>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-foreground">{product.rating}</span>
                  <span className="text-sm text-muted-foreground underline cursor-pointer">({product.reviewsCount} Ulasan)</span>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-4">
                    <span className="text-4xl font-extrabold text-foreground">
                      Rp {product.price.toLocaleString('id-ID')}
                    </span>
                    {product.originalPrice && (
                      <span className="text-xl text-muted-foreground line-through decoration-destructive/50">
                        Rp {product.originalPrice.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                  {product.description}
                </p>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-sm text-foreground">
                    <ShieldCheck className="w-5 h-5 text-primary" /> 100% Original & Aman
                  </div>
                  <div className="flex items-center gap-3 text-sm text-foreground">
                    <Truck className="w-5 h-5 text-primary" /> Pengiriman ke seluruh Indonesia
                  </div>
                </div>

                <div className="mt-auto space-y-6 border-t border-border pt-8">
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-foreground">Kuantitas:</span>
                    <div className="flex items-center border border-border rounded-xl bg-background">
                      <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                        className="p-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-12 text-center font-bold text-foreground">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(quantity + 1)} 
                        className="p-3 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Button 
                      onClick={handleAddToCart}
                      className="btn-primary h-14 text-base w-full"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" /> Tambah ke Keranjang
                    </Button>
                    <Button 
                      onClick={handleBuyNow}
                      className="btn-secondary h-14 text-base w-full"
                    >
                      Beli Sekarang
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs Section */}
            <div className="mt-16">
              <Tabs defaultValue="description" className="w-full">
                <TabsList className="w-full justify-start border-b border-border rounded-none bg-transparent h-auto p-0 space-x-8 overflow-x-auto flex-nowrap">
                  <TabsTrigger value="description" className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none px-0 py-4 text-base font-semibold">
                    Deskripsi
                  </TabsTrigger>
                  <TabsTrigger value="specs" className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none px-0 py-4 text-base font-semibold">
                    Spesifikasi
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none px-0 py-4 text-base font-semibold">
                    Ulasan ({product.reviewsCount})
                  </TabsTrigger>
                  <TabsTrigger value="faq" className="data-[state=active]:border-primary data-[state=active]:text-primary border-b-2 border-transparent rounded-none px-0 py-4 text-base font-semibold">
                    FAQ
                  </TabsTrigger>
                </TabsList>
                
                <div className="py-8">
                  <TabsContent value="description" className="space-y-6 text-muted-foreground leading-relaxed max-w-3xl">
                    <p>{product.description}</p>
                    <h4 className="text-lg font-bold text-foreground mt-6 mb-2">Komposisi Utama:</h4>
                    <p>{product.ingredients}</p>
                    <h4 className="text-lg font-bold text-foreground mt-6 mb-2">Cara Penggunaan:</h4>
                    <p>{product.usage}</p>
                  </TabsContent>
                  
                  <TabsContent value="specs" className="max-w-2xl">
                    <div className="border border-border rounded-2xl overflow-hidden">
                      {product.specifications.map((spec, idx) => (
                        <div key={idx} className={`flex p-4 ${idx !== product.specifications.length - 1 ? 'border-b border-border' : ''} ${idx % 2 === 0 ? 'bg-muted/30' : 'bg-background'}`}>
                          <div className="w-1/3 font-medium text-foreground">{spec.label}</div>
                          <div className="w-2/3 text-muted-foreground">{spec.value}</div>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="reviews" className="space-y-8 max-w-4xl">
                    <div className="flex items-center gap-6 mb-8 p-6 bg-muted/30 rounded-2xl border border-border">
                      <div className="text-center">
                        <div className="text-5xl font-extrabold text-foreground">{product.rating}</div>
                        <div className="flex items-center justify-center gap-1 my-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                          ))}
                        </div>
                        <div className="text-sm text-muted-foreground">Dari {product.reviewsCount} ulasan</div>
                      </div>
                      <div className="flex-grow border-l border-border pl-6">
                        <p className="text-foreground font-medium mb-2">98% pembeli merekomendasikan produk ini</p>
                        <Button variant="outline">Tulis Ulasan</Button>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {dummyReviews.map(review => (
                        <div key={review.id} className="border-b border-border pb-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <img src={review.photo} alt={review.name} className="w-12 h-12 rounded-full object-cover" />
                              <div>
                                <h5 className="font-bold text-foreground flex items-center gap-2">
                                  {review.name} <CheckCircle2 className="w-4 h-4 text-primary" />
                                </h5>
                                <span className="text-xs text-muted-foreground">{review.date}</span>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'}`} />
                              ))}
                            </div>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="faq" className="max-w-3xl space-y-6">
                    <div>
                      <h4 className="font-bold text-foreground mb-2">Apakah produk ini aman untuk penderita diabetes?</h4>
                      <p className="text-muted-foreground">Ya, produk kami diformulasikan khusus tanpa gula tambahan dan menggunakan pemanis alami Stevia yang tidak memicu lonjakan gula darah.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-2">Berapa kali sehari saya bisa menggunakan spray ini?</h4>
                      <p className="text-muted-foreground">Anda dapat menggunakannya kapan saja saat dorongan makan manis muncul. Disarankan maksimal 5-6 kali penggunaan dalam sehari untuk hasil optimal.</p>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground mb-2">Apakah ada efek samping?</h4>
                      <p className="text-muted-foreground">Produk kami terbuat dari 100% bahan herbal alami. Efek yang dirasakan hanyalah berkurangnya sensitivitas lidah terhadap rasa manis selama beberapa waktu.</p>
                    </div>
                  </TabsContent>
                </div>
              </Tabs>
            </div>

          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default ProductDetailPage;