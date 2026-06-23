import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';

const TestimonialCard = ({ testimonial, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-muted rounded-xl p-6 hover:bg-muted/80 transition-all duration-200"
    >
      <div className="flex items-center space-x-1 mb-4">
        {[...Array(testimonial.rating)].map((_, i) => (
          <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
        ))}
      </div>

      <p className="text-foreground leading-relaxed mb-6 italic">
        "{testimonial.review}"
      </p>

      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <span className="text-lg font-semibold text-primary">
            {testimonial.name.split(' ').map(n => n[0]).join('')}
          </span>
        </div>
        <div>
          <p className="font-semibold text-foreground">{testimonial.name}</p>
          <p className="text-sm text-muted-foreground">{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default TestimonialCard;