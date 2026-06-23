import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AnimatedProductShowcase = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const products = [
    {
      name: 'Sweet Block Spray',
      description: 'Instantly reduce sugar cravings with our natural peppermint and Gymnema Sylvestre spray. Just a few sprays before meals help you resist sweet temptations.',
      image: 'https://horizons-cdn.hostinger.com/2b565e51-18ea-4df3-a1d9-7a52c6aa74b4/7a0ed40b1022ff79d7139c69b52500f3.png',
      features: ['Fast-acting formula', 'Portable design', 'Natural ingredients'],
    },
    {
      name: 'Miracle Tea',
      description: 'A soothing herbal blend that helps balance blood sugar levels and reduce cravings throughout the day. Perfect for your daily wellness routine.',
      image: 'https://via.placeholder.com/400x400/A4C639/ffffff?text=Miracle+Tea',
      features: ['Daily wellness support', 'Calming blend', 'Sugar balance'],
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [products.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent via-background to-muted p-8 md:p-12">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
          >
            {/* Product Image */}
            <div className="flex justify-center">
              <motion.div
                initial={{ scale: 0.8, rotate: -5 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl blur-2xl" />
                <img
                  src={products[currentIndex].image}
                  alt={products[currentIndex].name}
                  className="relative w-full max-w-sm h-auto object-contain animate-float"
                />
              </motion.div>
            </div>

            {/* Product Info */}
            <div>
              <motion.h3
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-3xl md:text-4xl font-bold text-foreground mb-4 leading-tight"
                style={{ letterSpacing: '-0.02em' }}
              >
                {products[currentIndex].name}
              </motion.h3>

              <motion.p
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-base text-muted-foreground leading-relaxed mb-6"
              >
                {products[currentIndex].description}
              </motion.p>

              <motion.ul
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-2 mb-8"
              >
                {products[currentIndex].features.map((feature, idx) => (
                  <li key={idx} className="flex items-center space-x-2 text-sm text-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    <span>{feature}</span>
                  </li>
                ))}
              </motion.ul>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex items-center space-x-4"
              >
                <Button className="btn-primary">
                  Shop now
                </Button>
                <div className="flex space-x-2">
                  {products.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-all duration-200 ${
                        idx === currentIndex ? 'bg-primary w-8' : 'bg-muted-foreground/30'
                      }`}
                      aria-label={`Go to product ${idx + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="absolute top-1/2 -translate-y-1/2 left-4 right-4 flex justify-between pointer-events-none">
          <button
            onClick={handlePrevious}
            className="pointer-events-auto p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-200 shadow-lg"
            aria-label="Previous product"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={handleNext}
            className="pointer-events-auto p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-200 shadow-lg"
            aria-label="Next product"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnimatedProductShowcase;