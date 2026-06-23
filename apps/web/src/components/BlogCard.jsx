import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const BlogCard = ({ article, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative overflow-hidden bg-accent h-48">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-3">
          <Calendar className="h-3 w-3" />
          <span>{article.date}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>

        <h3 className="text-xl font-semibold text-foreground mb-3 leading-snug" style={{ letterSpacing: '-0.01em' }}>
          {article.title}
        </h3>

        <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-grow">
          {article.excerpt}
        </p>

        <Link
          to={`/blog/${article.slug}`}
          className="inline-flex items-center space-x-2 text-sm font-medium text-primary hover:text-primary/80 transition-all duration-200 mt-auto"
        >
          <span>Read more</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </motion.div>
  );
};

export default BlogCard;