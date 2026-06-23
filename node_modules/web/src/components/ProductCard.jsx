import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const ProductCard = ({ product, onAddToCart }) => {
  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative overflow-hidden bg-accent">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
        />
        {product.badge && (
          <div className="absolute top-4 right-4 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold">
            {product.badge}
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-foreground mb-2" style={{ letterSpacing: '-0.01em' }}>
          {product.name}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-grow">
          {product.description}
        </p>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-4">
            <span className="text-2xl font-bold text-primary">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            className="w-full btn-primary flex items-center justify-center space-x-2"
          >
            <ShoppingCart className="h-4 w-4" />
            <span>Add to cart</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;