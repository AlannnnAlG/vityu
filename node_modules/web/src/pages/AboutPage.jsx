import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Leaf, Target, Users, Shield, BookOpen, Coffee, MonitorSmartphone } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const AboutPage = () => {
  return (
    <>
      <Helmet>
        <title>Tentang Kami | Vityuu - Ekosistem Diet Gula #1 di Indonesia</title>
        <meta name="description" content="Pelajari cerita, misi, dan produk Vityuu. Kami adalah ekosistem diet gula pertama di Indonesia yang bernaung di bawah PT Visi Menyehatkan Nusantara." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        {/* Hero Section */}
        <section className="py-24 bg-gradient-to-br from-primary/5 via-background to-accent/5 relative overflow-hidden border-b border-border/50">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-accent font-bold tracking-widest uppercase text-sm mb-4 block">Company Profile</span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight" style={{ letterSpacing: '-0.02em' }}>
                PT VISI MENYEHATKAN NUSANTARA
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                Rumah bagi <strong className="text-primary font-bold">Vityuu</strong>, pionir ekosistem kesehatan khusus manajemen dan diet gula di Indonesia.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Visual & Intro */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative rounded-3xl overflow-hidden shadow-2xl"
              >
                <img 
                  src="https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/bd537aab44243bf5ef977058cf5577f9.png" 
                  alt="Vityuu Company Profile" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-8">
                  <h3 className="text-white text-2xl font-bold">Vityuu by PT Visi Menyehatkan Nusantara</h3>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-12"
              >
                {/* Who Are We */}
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center gap-3">
                    <Users className="text-primary w-8 h-8" /> Who Are We
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Vityuu adalah perusahaan & brand kesehatan pertama di Indonesia yang bergerak di niche market diet gula, yang pertama diinisiasi pada Februari 2025. Kami hadir menjawab krisis kecanduan konsumsi manis yang terus meningkat di tengah masyarakat modern.
                  </p>
                </div>

                {/* Our Activity */}
                <div>
                  <h2 className="text-3xl font-bold text-foreground mb-4 flex items-center gap-3">
                    <Target className="text-accent w-8 h-8" /> Our Activity
                  </h2>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Vityuu tumbuh menjadi lebih dari sekadar brand, namun juga <strong>ekosistem dan platform diet gula pertama dan nomor satu di Indonesia</strong>, yang tidak hanya sekadar menjual produk namun juga aktif membangun komunitas, mengedukasi, dan menyediakan tempat diskusi serta support system bagi siapapun di luar sana yang telah sadar dan memutuskan untuk merubah pola hidup mereka.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Our Products */}
        <section className="py-24 bg-muted/30 border-y border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-3xl mx-auto mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6" style={{ letterSpacing: '-0.02em' }}>
                Our Products
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Sebagai ekosistem diet gula pertama dan nomor 1 di Indonesia, Vityuu bertekad untuk menyediakan solusi dari segala kebutuhan pejuang diet gula, mulai dari produk fisik, hingga produk digital.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {/* Product 1 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-card p-8 rounded-3xl shadow-sm border border-border flex items-start gap-5 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Diet Sugar Spray</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">Inovasi oral spray pertama yang diformulasikan untuk menekan rasa craving seketika.</p>
                </div>
              </motion.div>

              {/* Product 2 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card p-8 rounded-3xl shadow-sm border border-border flex items-start gap-5 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Miracle Tea</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">Teh herbal alami pendamping rutinitas harian untuk mendukung stabilitas gula darah.</p>
                </div>
              </motion.div>

              {/* Product 3 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card p-8 rounded-3xl shadow-sm border border-border flex items-start gap-5 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-foreground/5 flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-6 h-6 text-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">Your 3in1 Diet Master Plan</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">Panduan komprehensif edukasi diet gula, nutrisi, dan habit-building.</p>
                </div>
              </motion.div>

              {/* Product 4 */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-card p-8 rounded-3xl shadow-sm border border-border flex items-start gap-5 hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MonitorSmartphone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">30 Hari Diet Tracker & Vision Board</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">Tools digital interaktif untuk mencatat progress harian dan menjaga motivasi tetap tinggi.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default AboutPage;