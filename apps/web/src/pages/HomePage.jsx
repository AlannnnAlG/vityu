import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Activity, Target, Clock, ShieldCheck, CheckCircle2, Smartphone, TrendingUp, Bell, Star, Shield, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PopupPromotion from '@/components/PopupPromotion.jsx';

const HomePage = () => {
  const stats = [
    { title: "20,4 Juta", subtitle: "Orang dewasa (20-79 tahun) hidup dengan diabetes di Indonesia (2024)" },
    { title: "28,6 Juta", subtitle: "Proyeksi kasus diabetes di Indonesia pada tahun 2050" },
    { title: "#5 di Dunia", subtitle: "Peringkat Indonesia untuk penderita diabetes terbanyak" },
    { title: "61,27%", subtitle: "Penduduk usia 3+ mengonsumsi minuman manis >1 kali per hari" },
    { title: "50 g/hari", subtitle: "Batas maksimum gula harian dari Kemenkes (setara 4 sendok makan)" },
    { title: "2x Lipat", subtitle: "Rata-rata asupan konsumsi gula di Indonesia dibandingkan batas WHO" }
  ];

  const benefits = [
    {
      icon: ShieldCheck,
      title: "Redakan Kecanduan Gula",
      desc: "Membantu mengurangi dorongan konsumsi makanan dan minuman manis secara instan."
    },
    {
      icon: Activity,
      title: "Bantu Turunkan Gula Darah",
      desc: "Mendukung kontrol asupan gula harian agar kadar gula dalam tubuh lebih terjaga."
    },
    {
      icon: Clock,
      title: "Praktis untuk Daily Use",
      desc: "Format oral spray yang mudah dibawa dan sangat cepat digunakan kapan saja."
    },
    {
      icon: Target,
      title: "Herbal & Mudah Diadopsi",
      desc: "Solusi sederhana, nyaman dipakai, dan sangat relevan untuk rutinitas sibuk harian."
    }
  ];

  const ingredients = [
    {
      name: "Gymnema Sylvestre",
      desc: "Dikenal sebagai 'gurmar' (penghancur gula), herbal Ayurveda ini membantu memblokir reseptor manis pada lidah, mengurangi daya tarik makanan dan minuman manis secara efektif.",
      image: "https://images.unsplash.com/photo-1660273289603-56035c18426b?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Peppermint",
      desc: "Memberikan sensasi segar instan yang membantu mengalihkan pikiran dari craving, sekaligus mendukung kesehatan pencernaan setelah makan.",
      image: "https://images.unsplash.com/photo-1559936493-2e06a0b6ec71?auto=format&fit=crop&q=80&w=800"
    },
    {
      name: "Stevia",
      desc: "Ekstrak daun pemanis alami dengan nol kalori yang menjaga profil rasa produk tetap nikmat tanpa menyebabkan lonjakan gula darah sedikitpun.",
      image: "https://images.unsplash.com/photo-1602424847622-dc0a4a938b2b?auto=format&fit=crop&q=80&w=800"
    }
  ];

  return (
    <>
      <Helmet>
        <title>Vityuu - Ekosistem Diet Gula Pertama di Indonesia</title>
        <meta name="description" content="Vityuu membantu meredakan kecanduan gula dan mendukung kontrol kadar gula darah dengan solusi praktis dan komunitas suportif." />
      </Helmet>

      <div className="min-h-screen bg-background font-sans overflow-x-hidden relative">
        <Header />
        <PopupPromotion />

        {/* HERO SECTION */}
        <section className="relative min-h-[90dvh] flex items-center pt-10 pb-20">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-secondary/10" />
            <div className="absolute top-20 right-0 w-[50vw] h-[50vw] max-w-3xl bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] max-w-2xl bg-secondary/10 rounded-full blur-[100px] pointer-events-none" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl"
              >
                <div className="inline-flex items-center space-x-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full mb-8">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-sm font-semibold tracking-wide uppercase">Ekosistem Diet Gula #1 di Indonesia</span>
                </div>

                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-[1.1]" style={{ letterSpacing: '-0.02em' }}>
                  Bebaskan Dirimu dari <span className="text-secondary">Kecanduan Gula</span> Harian
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-10 max-w-[60ch]">
                  Vityuu hadir sebagai ekosistem lengkap untuk membantu meredakan dorongan konsumsi manis secara praktis. Solusi harian on-the-go untuk mendukung gaya hidup sehat Anda.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to="/shop">
                    <Button className="btn-primary w-full sm:w-auto text-base px-8 py-6 h-auto">
                      Lihat Produk Kami
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="outline" className="w-full sm:w-auto border-2 hover:bg-muted text-base px-8 py-6 h-auto transition-all duration-300">
                      Tentang Vityuu
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative hidden md:block"
              >
                <div className="relative aspect-square max-w-lg mx-auto">
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

        {/* NEW FEATURED PRODUCT SECTION */}
        <section className="py-24 bg-card border-y border-border/50 relative overflow-hidden">
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col-reverse lg:grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Text Content (Left on Desktop, Bottom on Mobile) */}
              <motion.div
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="space-y-8"
              >
                <div className="inline-block bg-primary/10 text-primary font-bold px-4 py-1.5 rounded-full text-sm">
                  Produk Unggulan
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight" style={{ letterSpacing: '-0.02em' }}>
                  Sweet Block Spray - Solusi Praktis Atasi <span className="text-primary">Kecanduan Gula</span>
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Diformulasikan dengan ekstrak <strong>Gymnema Sylvestre</strong>, herbal Ayurveda kuno yang terbukti secara ilmiah mampu memblokir reseptor rasa manis pada lidah, membantu Anda meredam hasrat ngemil manis seketika.
                </p>
                <ul className="space-y-4 pt-4">
                  {[
                    "Praktis digunakan kapan saja, di mana saja",
                    "Formula herbal alami tanpa efek samping",
                    "Hasil cepat memblokir craving dalam hitungan menit",
                    "Cocok untuk mendukung daily routine diet Anda"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-foreground font-medium">
                      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <Link to="/shop">
                    <Button className="btn-primary text-base px-8 h-14 w-full sm:w-auto">
                      Beli Sekarang <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/about">
                    <Button variant="outline" className="text-base px-8 h-14 w-full sm:w-auto border-2 hover:bg-muted">
                      Pelajari Lebih Lanjut
                    </Button>
                  </Link>
                </div>
              </motion.div>

              {/* Image Content (Right on Desktop, Top on Mobile) */}
              <motion.div
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                className="relative w-full max-w-md mx-auto lg:max-w-none"
              >
                {/* Decorative Leaves */}
                <motion.div 
                  className="absolute -top-10 -left-10 w-24 h-24 opacity-60 z-0 animate-float-delayed"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23A4C639\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z\'/%3E%3Cpath d=\'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12\'/%3E%3C/svg%3E")', backgroundSize: 'contain', backgroundRepeat: 'no-repeat' }}
                />
                <motion.div 
                  className="absolute -bottom-10 -right-10 w-32 h-32 opacity-40 z-0 animate-float"
                  style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%23A4C639\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3E%3Cpath d=\'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z\'/%3E%3Cpath d=\'M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12\'/%3E%3C/svg%3E")', backgroundSize: 'contain', backgroundRepeat: 'no-repeat', transform: 'rotate(120deg)' }}
                />
                
                <div className="relative z-10 aspect-square bg-gradient-to-tr from-primary/5 to-transparent rounded-full p-8 flex items-center justify-center">
                  <motion.img 
                    src="https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/1d0d5ed5b2efc499e516b122cd88c2e9.png" 
                    alt="Sweet Block Spray" 
                    className="w-full h-full object-contain drop-shadow-[0_20px_30px_rgba(164,198,57,0.3)]"
                    animate={{ 
                      y: [0, -15, 0],
                      rotate: [0, 2, -2, 0]
                    }}
                    transition={{ 
                      duration: 6, 
                      repeat: Infinity,
                      ease: "easeInOut" 
                    }}
                  />
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* TRUST BADGES SECTION */}
        <section className="py-12 bg-muted/30 border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 divide-y md:divide-y-0 md:divide-x divide-border/50">
              <div className="flex flex-col items-center text-center pt-4 md:pt-0 px-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-bold text-foreground mb-1">Dipercaya oleh 2,847+ pelanggan</h4>
                <p className="text-sm text-muted-foreground">Komunitas pejuang diet gula terbesar</p>
              </div>
              <div className="flex flex-col items-center text-center pt-8 md:pt-0 px-4">
                <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-secondary fill-secondary" />
                </div>
                <h4 className="font-bold text-foreground mb-1">Rating 4.8/5 dari 1,200+ review</h4>
                <p className="text-sm text-muted-foreground">Terbukti efektif oleh pengguna nyata</p>
              </div>
              <div className="flex flex-col items-center text-center pt-8 md:pt-0 px-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h4 className="font-bold text-foreground mb-1">Produk original 100% bergaransi</h4>
                <p className="text-sm text-muted-foreground">Kualitas bahan baku terjamin aman</p>
              </div>
            </div>
          </div>
        </section>

        {/* PROBLEM STATEMENT SECTION */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6 leading-snug" style={{ letterSpacing: '-0.02em' }}>
                Masalahnya bukan sekadar diabetes — masalah utamanya adalah <span className="text-secondary">kecanduan gula harian</span> yang belum terselesaikan.
              </h2>
            </motion.div>

            {/* Bento Grid Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-card p-8 rounded-3xl shadow-sm border border-border/50 hover:shadow-md transition-shadow"
                >
                  <p className="text-3xl font-extrabold text-primary mb-3">{stat.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{stat.subtitle}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* INGREDIENT SHOWCASE SECTION */}
        <section className="py-24 bg-foreground text-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Bahan Baku Berkualitas</span>
              <h2 className="text-3xl md:text-4xl font-bold text-background mb-4" style={{ letterSpacing: '-0.02em' }}>Formula Utama Vityuu</h2>
              <p className="text-background/70 max-w-2xl mx-auto text-lg">Kekuatan alam yang diformulasikan khusus untuk menjinakkan hasrat gula Anda secara instan dan aman.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {ingredients.map((ing, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  className="bg-background/5 rounded-3xl overflow-hidden border border-background/10 hover:bg-background/10 transition-colors group"
                >
                  <div className="h-56 w-full overflow-hidden relative">
                    <img 
                      src={ing.image} 
                      alt={`Gambar bahan ${ing.name}`} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent pointer-events-none" />
                  </div>
                  <div className="p-8 relative -mt-8">
                    <h3 className="text-2xl font-bold text-primary mb-4">{ing.name}</h3>
                    <p className="text-background/80 leading-relaxed text-sm">{ing.desc}</p>
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