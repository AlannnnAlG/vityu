import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const PopupPromotion = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasSeenPromo = sessionStorage.getItem('vityuu_promo_seen');
    
    if (!hasSeenPromo) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 3000);

      const handleScroll = () => {
        if (window.scrollY > 300 && !isVisible) {
          setIsVisible(true);
          window.removeEventListener('scroll', handleScroll);
        }
      };

      window.addEventListener('scroll', handleScroll);

      return () => {
        clearTimeout(timer);
        window.removeEventListener('scroll', handleScroll);
      };
    }
  }, [isVisible]);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem('vityuu_promo_seen', 'true');
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-background/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ 
              opacity: 1, 
              scale: 1, 
              y: 0,
              transition: { type: "spring", damping: 20, stiffness: 300 }
            }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-card rounded-3xl p-8 shadow-2xl border border-border z-10 overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-[40px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 rounded-full blur-[40px] pointer-events-none" />
            
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors"
              aria-label="Tutup"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mb-6 shadow-lg shadow-primary/20">
                <Gift className="w-8 h-8 text-primary-foreground" />
              </div>
              
              <h3 className="text-2xl font-bold text-foreground mb-3" style={{ letterSpacing: '-0.02em' }}>
                Penawaran Spesial!
              </h3>
              
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Dapatkan <strong>Sweet Block Spray</strong> sekarang! <span className="text-accent font-semibold">Gratis ongkir</span> untuk pembelian hari ini!
              </p>

              <div className="flex flex-col w-full gap-3">
                <Link to="/shop" onClick={handleClose} className="w-full">
                  <Button className="w-full btn-primary h-14 text-base">
                    Klaim Promo Sekarang
                  </Button>
                </Link>
                <button 
                  onClick={handleClose}
                  className="text-sm text-muted-foreground hover:text-foreground font-medium transition-colors py-2"
                >
                  Mungkin Nanti
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PopupPromotion;