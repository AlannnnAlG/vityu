import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Activity, Target, Clock, ShieldCheck, CheckCircle2, Star, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PopupPromotion from '@/components/PopupPromotion.jsx';

const HomePage = () => {
  const stats = [
    { title: "20,4 Juta", subtitle: "Orang dewasa (20–79 tahun) hidup dengan diabetes di Indonesia (2024)" },
    { title: "28,6 Juta", subtitle: "Proyeksi kasus diabetes di Indonesia pada tahun 2050" },
    { title: "#5 di Dunia", subtitle: "Peringkat Indonesia untuk penderita diabetes terbanyak" },
    { title: "61,27%", subtitle: "Penduduk usia 3+ mengonsumsi minuman manis >1 kali per hari" },
    { title: "50 g/hari", subtitle: "Batas maksimum gula harian dari Kemenkes (setara 4 sendok makan)" },
    { title: "2× Lipat", subtitle: "Rata-rata asupan gula di Indonesia dibandingkan batas WHO" },
  ];

  const benefits = [
    { icon: ShieldCheck, title: "Redakan Kecanduan Gula", desc: "Membantu mengurangi dorongan konsumsi makanan dan minuman manis secara instan." },
    { icon: Activity, title: "Bantu Turunkan Gula Darah", desc: "Mendukung kontrol asupan gula harian agar kadar gula dalam tubuh lebih terjaga." },
    { icon: Clock, title: "Praktis untuk Daily Use", desc: "Format oral spray yang mudah dibawa dan cepat digunakan kapan saja." },
    { icon: Target, title: "Herbal & Mudah Diadopsi", desc: "Solusi sederhana, nyaman dipakai, relevan untuk rutinitas sibuk harian." },
  ];

  const ingredients = [
    {
      name: "Gymnema Sylvestre",
      desc: "Dikenal sebagai 'gurmar' (penghancur gula), herbal Ayurveda ini memblokir reseptor manis pada lidah, mengurangi daya tarik makanan manis secara efektif.",
      image: "https://images.unsplash.com/photo-1660273289603-56035c18426b?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Peppermint",
      desc: "Memberikan sensasi segar instan yang membantu mengalihkan craving, sekaligus mendukung kesehatan pencernaan setelah makan.",
      image: "https://images.unsplash.com/photo-1559936493-2e06a0b6ec71?auto=format&fit=crop&q=80&w=800",
    },
    {
      name: "Stevia",
      desc: "Ekstrak daun pemanis alami nol kalori yang menjaga rasa produk tetap nikmat tanpa menyebabkan lonjakan gula darah.",
      image: "https://images.unsplash.com/photo-1602424847622-dc0a4a938b2b?auto=format&fit=crop&q=80&w=800",
    },
  ];

  const productChecklist = [
    "Praktis digunakan kapan saja, di mana saja",
    "Formula herbal alami tanpa efek samping",
    "Hasil cepat memblokir craving dalam hitungan menit",
    "Cocok untuk mendukung daily routine diet Anda",
  ];

  return (
    <>
      <Helmet>
        <title>Vityuu - Ekosistem Diet Gula Pertama di Indonesia</title>
        <meta name="description" content="Vityuu membantu meredakan kecanduan gula dan mendukung kontrol kadar gula darah dengan solusi praktis." />
      </Helmet>

      <div className="min-h-screen bg-background font-sans overflow-x-hidden">
        <Header />
        <PopupPromotion />

        {/* ── HERO ─────────────────────────────────────────────────────────── */}
        <section className="relative min-h-[88dvh] flex items-center pt-8 pb-16 md:pt-12 md:pb-24">
          {/* Background blobs */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-secondary/10" />
            <div className="absolute top-16 right-0 w-[60vw] h-[60vw] max-w-2xl bg-primary/10 rounded-full blur-[120px]" />
            <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] max-w-xl bg-secondary/10 rounded-full blur-[100px]" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-6">
                  <Sparkles className="h-4 w-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase">Ekosistem Diet Gula #1 di Indonesia</span>
                </div>

                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-5 leading-[1.1]" style={{ letterSpacing: '-0.02em' }}>
                  Bebaskan Dirimu dari{' '}
                  <span className="text-secondary">Kecanduan Gula</span>{' '}
                  Harian
                </h1>

                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed mb-8 max-w-[55ch]">
                  Vityuu hadir sebagai ekosistem lengkap untuk membantu meredakan dorongan konsumsi manis secara praktis — solusi harian on-the-go untuk gaya hidup sehat Anda.
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link to="/shop">
                    <Button className="btn-primary w-full sm:w-auto text-sm sm:text-base px-6 sm:px-8 py-3 h-auto">
                      Lihat Produk Kami
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="outline" className="w-full sm:w-auto border-2 hover:bg-muted text-sm sm:text-base px-6 sm:px-8 py-3 h-auto transition-all">
                      Tentang Vityuu
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Product image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative hidden lg:flex justify-center"
              >
                <div className="relative w-full max-w-sm xl:max-w-md aspect-square">
                  <img
                    src="https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/d5bb27a6a983611b13c5e7d4e9398ee9.png"
                    alt="Vityuu Diet Sugar Spray"
                    className="w-full h-full object-contain animate-float drop-shadow-2xl"
                  />
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── FEATURED PRODUCT ─────────────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-card border-y border-border/50 relative overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">

              {/* Image — top on mobile, right on desktop */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="order-1 lg:order-2 flex justify-center"
              >
                <div className="relative w-full max-w-xs sm:max-w-sm aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent rounded-full" />
                  <motion.img
                    src="https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/1d0d5ed5b2efc499e516b122cd88c2e9.png"
                    alt="Sweet Block Spray"
                    className="relative z-10 w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(164,198,57,0.3)]"
                    animate={{ y: [0, -12, 0], rotate: [0, 1.5, -1.5, 0] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>
              </motion.div>

              {/* Text — bottom on mobile, left on desktop */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="order-2 lg:order-1 space-y-6"
              >
                <div className="inline-block bg-primary/10 text-primary font-bold px-4 py-1.5 rounded-full text-xs sm:text-sm">
                  Produk Unggulan
                </div>

                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight" style={{ letterSpacing: '-0.02em' }}>
                  Sweet Block Spray — Solusi Praktis Atasi{' '}
                  <span className="text-primary">Kecanduan Gula</span>
                </h2>

                <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                  Diformulasikan dengan ekstrak <strong>Gymnema Sylvestre</strong>, herbal Ayurveda kuno yang terbukti secara ilmiah mampu memblokir reseptor rasa manis pada lidah.
                </p>

                <ul className="space-y-3">
                  {productChecklist.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm sm:text-base text-foreground">
                      <div className="w-5 h-5 mt-0.5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <Link to="/shop">
                    <Button className="btn-primary text-sm sm:text-base px-6 sm:px-8 h-12 w-full sm:w-auto">
                      Beli Sekarang <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="outline" className="text-sm sm:text-base px-6 sm:px-8 h-12 w-full sm:w-auto border-2 hover:bg-muted">
                      Pelajari Lebih Lanjut
                    </Button>
                  </Link>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── TRUST BADGES ──────────────────────────────────────────────────── */}
        <section className="py-10 md:py-12 bg-muted/30 border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4">
              {[
                { icon: Users, color: 'primary', title: 'Dipercaya 2,847+ pelanggan', sub: 'Komunitas pejuang diet gula terbesar' },
                { icon: Star, color: 'secondary', title: 'Rating 4.8/5 dari 1.200+ review', sub: 'Terbukti efektif oleh pengguna nyata' },
                { icon: Shield, color: 'primary', title: 'Produk original 100% bergaransi', sub: 'Kualitas bahan baku terjamin aman' },
              ].map(({ icon: Icon, color, title, sub }, i) => (
                <div key={i} className="flex items-center sm:flex-col sm:text-center gap-4 sm:gap-3 p-4 sm:p-0">
                  <div className={`w-11 h-11 sm:w-12 sm:h-12 bg-${color}/10 rounded-full flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-5 h-5 sm:w-6 sm:h-6 text-${color} ${color === 'secondary' ? 'fill-secondary' : ''}`} />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm sm:text-base mb-0.5">{title}</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROBLEM STATEMENT + STATS ─────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
            >
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground leading-snug" style={{ letterSpacing: '-0.02em' }}>
                Masalahnya bukan sekadar diabetes — masalah utamanya adalah{' '}
                <span className="text-secondary">kecanduan gula harian</span>{' '}
                yang belum terselesaikan.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                  className="bg-card p-6 md:p-8 rounded-2xl shadow-sm border border-border/50 hover:shadow-md transition-shadow"
                >
                  <p className="text-2xl md:text-3xl font-extrabold text-primary mb-2">{stat.title}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{stat.subtitle}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── INGREDIENTS ───────────────────────────────────────────────────── */}
        <section className="py-16 md:py-24 bg-foreground text-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10 md:mb-16">
              <span className="text-primary font-bold tracking-widest uppercase text-xs sm:text-sm mb-3 block">
                Bahan Baku Berkualitas
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-background mb-3" style={{ letterSpacing: '-0.02em' }}>
                Formula Utama Vityuu
              </h2>
              <p className="text-background/70 max-w-xl mx-auto text-sm sm:text-base md:text-lg">
                Kekuatan alam yang diformulasikan khusus untuk menjinakkan hasrat gula Anda secara instan dan aman.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 md:gap-8 lg:gap-12">
              {ingredients.map((ing, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="bg-background/5 rounded-2xl overflow-hidden border border-background/10 hover:bg-background/10 transition-colors group"
                >
                  <div className="relative h-44 sm:h-52 overflow-hidden">
                    <img
                      src={ing.image}
                      alt={ing.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent pointer-events-none" />
                  </div>
                  <div className="p-5 md:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-primary mb-2 md:mb-3">{ing.name}</h3>
                    <p className="text-background/80 leading-relaxed text-xs sm:text-sm">{ing.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;