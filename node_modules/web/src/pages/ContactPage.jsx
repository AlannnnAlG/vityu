import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Mohon isi semua kolom yang tersedia');
      return;
    }

    if (!formData.email.includes('@')) {
      toast.error('Mohon masukkan alamat email yang valid');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const submissions = JSON.parse(localStorage.getItem('vityuu_contact_submissions') || '[]');
      submissions.push({
        ...formData,
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem('vityuu_contact_submissions', JSON.stringify(submissions));

      toast.success('Pesan Anda berhasil dikirim! Kami akan segera merespons.');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <>
      <Helmet>
        <title>Hubungi Kami - Vityuu Indonesia</title>
        <meta name="description" content="Punya pertanyaan seputar produk Vityuu? Hubungi tim dukungan kami. Kami siap membantu perjalanan bebas gula Anda." />
      </Helmet>

      <div className="min-h-screen bg-background">
        <Header />

        <section className="py-20 bg-muted/40 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6" style={{ letterSpacing: '-0.02em' }}>
                Mari <span className="text-primary">Berbincang</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Punya pertanyaan soal produk, program kerja sama, atau sekadar ingin berbagi cerita kesuksesan Anda? Tim kami siap mendengarkan.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
              
              {/* Info Column */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl font-bold text-foreground mb-8">Informasi Kontak</h2>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div className="pt-1">
                      <h4 className="font-semibold text-foreground mb-1">Email</h4>
                      <p className="text-muted-foreground">halo@vityuu.com</p>
                      <p className="text-sm text-muted-foreground/80 mt-1">Kami merespons dalam 1x24 jam</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-accent" />
                    </div>
                    <div className="pt-1">
                      <h4 className="font-semibold text-foreground mb-1">Telepon / WhatsApp</h4>
                      <p className="text-muted-foreground">+62 811 1234 5678</p>
                      <p className="text-sm text-muted-foreground/80 mt-1">Senin - Jumat, 09:00 - 17:00 WIB</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-foreground/5 rounded-2xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-foreground" />
                    </div>
                    <div className="pt-1">
                      <h4 className="font-semibold text-foreground mb-1">Kantor Pusat</h4>
                      <p className="text-muted-foreground leading-relaxed">
                        Gedung Vityuu Sejahtera<br />
                        Jl. Kesehatan Raya No. 123<br />
                        Jakarta Selatan, 12345
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Form Column */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-card border border-border rounded-3xl p-8 md:p-10 shadow-lg"
              >
                <h3 className="text-2xl font-bold text-foreground mb-6">Kirim Pesan</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Budi Santoso"
                      value={formData.name}
                      onChange={handleChange}
                      className="h-12 bg-background"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Alamat Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="budi@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="h-12 bg-background"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subjek Pesan</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="Pertanyaan seputar produk..."
                      value={formData.subject}
                      onChange={handleChange}
                      className="h-12 bg-background"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Detail Pesan</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tuliskan pertanyaan atau pesan Anda di sini..."
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="bg-background resize-none"
                      required
                    />
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="w-full btn-primary h-14 text-base"
                  >
                    {isSubmitting ? 'Mengirim...' : (
                      <span className="flex items-center gap-2">
                        Kirim Sekarang <Send className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                </form>
              </motion.div>

            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  );
};

export default ContactPage;