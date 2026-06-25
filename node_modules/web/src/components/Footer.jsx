import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-foreground text-background border-t border-border/10 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand & Identity */}
          <div className="space-y-6">
            <div className="bg-background/5 p-4 rounded-2xl inline-block backdrop-blur-sm border border-background/10">
              <img 
                src="https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/456510c1e5fc5030feef0a6f70003395.png" 
                alt="Vityuu Logo" 
                className="h-12 w-auto object-contain brightness-0 invert drop-shadow-[0_0_15px_rgba(164,198,57,0.5)]"
              />
            </div>
            <p className="text-background/80 leading-relaxed text-sm max-w-[280px]">
              Vityuu adalah ekosistem diet gula pertama di Indonesia. Membantu Anda meredakan kecanduan gula harian dengan solusi praktis dan komunitas suportif.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <span className="font-bold text-background tracking-wider text-sm uppercase mb-6 block">Tautan Cepat</span>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="text-background/70 hover:text-primary transition-colors duration-200 text-sm font-medium">Beranda</Link>
              </li>
              <li>
                <Link to="/about" className="text-background/70 hover:text-primary transition-colors duration-200 text-sm font-medium">Tentang Vityuu</Link>
              </li>
              <li>
                <Link to="/shop" className="text-background/70 hover:text-primary transition-colors duration-200 text-sm font-medium">Katalog Produk</Link>
              </li>
              <li>
                <Link to="/blog" className="text-background/70 hover:text-primary transition-colors duration-200 text-sm font-medium">Artikel & Wawasan</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <span className="font-bold text-background tracking-wider text-sm uppercase mb-6 block">Hubungi Kami</span>
            <ul className="space-y-5">
              <li className="flex items-start gap-3 text-sm text-background/80 group">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                <span className="mt-1.5 hover:text-primary transition-colors cursor-pointer">halo@vityuu.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-background/80 group">
                <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center flex-shrink-0 group-hover:bg-accent/30 transition-colors">
                  <Phone className="h-4 w-4 text-accent" />
                </div>
                <span className="mt-1.5 hover:text-accent transition-colors cursor-pointer">+62 811 1234 5678</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-background/80 group">
                <div className="w-8 h-8 rounded-lg bg-background/10 flex items-center justify-center flex-shrink-0 group-hover:bg-background/20 transition-colors">
                  <MapPin className="h-4 w-4 text-background" />
                </div>
                <span className="mt-1.5 leading-relaxed">
                  <strong>Surabaya, Indonesia</strong><br />
                  PT Visi Menyehatkan Nusantara
                </span>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <span className="font-bold text-background tracking-wider text-sm uppercase mb-6 block">Komunitas Vityuu</span>
            <p className="text-sm text-background/70 mb-6 leading-relaxed">
              Bergabunglah dengan ribuan pejuang diet gula lainnya di media sosial kami.
            </p>
            <div className="flex flex-wrap gap-3">
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/vityuu.id" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center hover:bg-[#E4405F] hover:text-white hover:-translate-y-1 transition-all duration-300" 
                aria-label="Instagram Vityuu"
              >
                <Instagram className="h-5 w-5" />
              </a>
              
              {/* TikTok */}
              <a 
                href="https://www.tiktok.com/@vityuu.official" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center hover:bg-[#000000] hover:text-white hover:-translate-y-1 transition-all duration-300" 
                aria-label="TikTok Vityuu"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              
              {/* Shopee */}
              <a 
                href="https://shopee.co.id/vityuu" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center hover:bg-[#EE4D2D] hover:text-white hover:-translate-y-1 transition-all duration-300" 
                aria-label="Shopee Vityuu"
              >
                <ShoppingBag className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-background/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-background/60">
            © {new Date().getFullYear()} PT Visi Menyehatkan Nusantara. Hak Cipta Dilindungi.
          </p>
          <div className="flex gap-6 text-sm text-background/60">
            <Link to="/privacy" className="hover:text-primary transition-colors duration-200">
              Kebijakan Privasi
            </Link>
            <Link to="/terms" className="hover:text-primary transition-colors duration-200">
              Syarat & Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;