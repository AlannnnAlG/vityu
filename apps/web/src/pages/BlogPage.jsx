import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, ArrowLeft, ArrowRight, Tag, Loader2, BookOpen } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import pb from '@/lib/pocketbaseClient.js';

const CATEGORY_LABELS = {
  tips: 'Tips',
  tutorial: 'Tutorial',
  news: 'Berita',
  review: 'Review',
};

const CATEGORIES = [
  { value: 'all', label: 'Semua' },
  { value: 'tips', label: 'Tips' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'news', label: 'Berita' },
  { value: 'review', label: 'Review' },
];

const formatDate = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
};

const estimateReadTime = (text = '') => {
  const words = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} mnt baca`;
};

const BlogPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const records = await pb.collection('blog').getFullList({
          filter: 'status = "published" && (is_deleted = false || is_deleted = null)',
          sort: '-created',
          $autoCancel: false,
        });
        setArticles(records);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const filtered = articles.filter(
    (a) => activeCategory === 'all' || a.kategori === activeCategory
  );

  const handleSelectArticle = (article) => {
    setSelectedArticle(article);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedArticle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getImageUrl = (article) => {
    if (article.featured_image) {
      return pb.files.getURL(article, article.featured_image);
    }
    return `https://images.unsplash.com/photo-1559936493-2e06a0b6ec71?auto=format&fit=crop&q=80&w=800`;
  };

  // ── ARTICLE DETAIL VIEW ─────────────────────────────────────────────────────
  if (selectedArticle) {
    return (
      <>
        <Helmet>
          <title>{selectedArticle.judul} | Blog Vityuu</title>
          <meta name="description" content={selectedArticle.meta_description || selectedArticle.excerpt} />
        </Helmet>
        <div className="min-h-screen bg-background font-sans pb-20">
          <Header />
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {/* Article Header */}
              <section className="py-12 bg-background border-b border-border">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  <button
                    onClick={handleBack}
                    className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium mb-10 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Artikel
                  </button>

                  {selectedArticle.kategori && (
                    <div className="inline-block bg-primary/10 text-primary font-bold px-4 py-1.5 rounded-full text-sm mb-6">
                      {CATEGORY_LABELS[selectedArticle.kategori] || selectedArticle.kategori}
                    </div>
                  )}

                  <h1
                    className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-6"
                    style={{ letterSpacing: '-0.02em' }}
                  >
                    {selectedArticle.judul}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-muted-foreground font-medium pb-8 border-b border-border/50">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {formatDate(selectedArticle.created)}
                    </div>
                    <div>•</div>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      {estimateReadTime(selectedArticle.konten)}
                    </div>
                    {selectedArticle.tags && (
                      <>
                        <div>•</div>
                        <div className="flex items-center gap-1 flex-wrap">
                          <Tag className="w-3 h-3" />
                          {selectedArticle.tags.split(',').map((tag) => (
                            <span
                              key={tag}
                              className="text-xs bg-muted px-2 py-0.5 rounded-full"
                            >
                              {tag.trim()}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </section>

              {/* Article Body */}
              <section className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                  {/* Featured Image */}
                  <div className="w-full h-[40vh] md:h-[60vh] rounded-3xl overflow-hidden mb-12 shadow-md">
                    <img
                      src={getImageUrl(selectedArticle)}
                      alt={selectedArticle.judul}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Excerpt / intro */}
                  {selectedArticle.excerpt && (
                    <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-8 border-l-4 border-primary pl-6 italic">
                      {selectedArticle.excerpt}
                    </p>
                  )}

                  {/* Content — split paragraphs by newline */}
                  <article className="space-y-6">
                    {selectedArticle.konten.split('\n').filter(Boolean).map((paragraph, i) => (
                      <p key={i} className="text-lg text-muted-foreground leading-relaxed">
                        {paragraph}
                      </p>
                    ))}
                  </article>

                  {/* Back button */}
                  <div className="mt-16 pt-8 border-t border-border">
                    <button
                      onClick={handleBack}
                      className="inline-flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all"
                    >
                      <ArrowLeft className="w-4 h-4" /> Kembali ke Semua Artikel
                    </button>
                  </div>
                </div>
              </section>
            </motion.div>
          </AnimatePresence>
          <Footer />
        </div>
      </>
    );
  }

  // ── ARTICLE LIST VIEW ───────────────────────────────────────────────────────
  return (
    <>
      <Helmet>
        <title>Blog & Wawasan Vityuu - Referensi Diet Gula</title>
        <meta
          name="description"
          content="Baca artikel lengkap seputar bahaya kecanduan gula, panduan produk, serta khasiat Gymnema Sylvestre dari tim Vityuu."
        />
      </Helmet>

      <div className="min-h-screen bg-background font-sans pb-20">
        <Header />

        {/* Hero */}
        <section className="py-20 bg-gradient-to-b from-muted/50 to-background border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1
                className="text-4xl md:text-5xl font-bold text-foreground mb-6"
                style={{ letterSpacing: '-0.02em' }}
              >
                Wawasan <span className="text-primary">Kesehatan</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Edukasi terpercaya, tips praktis, dan berita terbaru seputar pengelolaan konsumsi gula harian Anda.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <div className="border-b border-border bg-card/50 sticky top-0 z-10 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex gap-2 overflow-x-auto">
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

        {/* Content */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-32 gap-4 text-muted-foreground">
                <Loader2 className="w-8 h-8 animate-spin" />
                <p>Memuat artikel...</p>
              </div>
            )}

            {/* Empty */}
            {!loading && filtered.length === 0 && (
              <div className="text-center py-32">
                <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Belum ada artikel</h3>
                <p className="text-muted-foreground">
                  {activeCategory !== 'all'
                    ? 'Tidak ada artikel untuk kategori ini.'
                    : 'Admin belum menambahkan artikel.'}
                </p>
              </div>
            )}

            {/* Articles Grid */}
            {!loading && filtered.length > 0 && (
              <AnimatePresence>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {filtered.map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.08 }}
                      className={`bg-card rounded-3xl overflow-hidden border border-border hover:shadow-xl transition-all duration-300 flex flex-col group cursor-pointer hover:-translate-y-1 ${
                        index === 0 ? 'md:col-span-2 lg:col-span-2' : ''
                      }`}
                      onClick={() => handleSelectArticle(article)}
                    >
                      {/* Image */}
                      <div className={`relative overflow-hidden ${index === 0 ? 'h-72 md:h-80' : 'h-56'}`}>
                        <div className="absolute top-4 left-4 z-10 bg-background/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-bold text-foreground shadow-sm">
                          {CATEGORY_LABELS[article.kategori] || article.kategori || 'Artikel'}
                        </div>
                        <img
                          src={getImageUrl(article)}
                          alt={article.judul}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Body */}
                      <div className="p-8 flex flex-col flex-grow">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4 font-medium">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(article.created)}</span>
                          <span className="mx-1">•</span>
                          <span>{estimateReadTime(article.konten)}</span>
                        </div>

                        <h3
                          className={`font-bold text-foreground mb-4 leading-snug group-hover:text-primary transition-colors ${
                            index === 0 ? 'text-2xl md:text-3xl' : 'text-xl'
                          }`}
                        >
                          {article.judul}
                        </h3>

                        {article.excerpt && (
                          <p className="text-muted-foreground leading-relaxed mb-6 flex-grow line-clamp-3">
                            {article.excerpt}
                          </p>
                        )}

                        <div className="inline-flex items-center gap-2 text-primary font-bold group-hover:gap-3 transition-all mt-auto">
                          Baca Artikel <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default BlogPage;