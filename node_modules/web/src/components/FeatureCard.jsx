import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ feature, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="flex flex-col md:flex-row items-center gap-8"
    >
      {index % 2 === 0 ? (
        <>
          <div className="flex-1">
            <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-accent">
              <img
                src={feature.image}
                alt={feature.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 leading-snug" style={{ letterSpacing: '-0.01em' }}>
              {feature.name}
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              {feature.benefit}
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="flex-1 order-2 md:order-1">
            <h3 className="text-2xl md:text-3xl font-semibold text-foreground mb-4 leading-snug" style={{ letterSpacing: '-0.01em' }}>
              {feature.name}
            </h3>
            <p className="text-base text-muted-foreground leading-relaxed">
              {feature.benefit}
            </p>
          </div>
          <div className="flex-1 order-1 md:order-2">
            <div className="relative w-full h-64 rounded-2xl overflow-hidden bg-accent">
              <img
                src={feature.image}
                alt={feature.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default FeatureCard;