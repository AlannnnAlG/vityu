import React from 'react';
import { Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ArticleCard = ({ article }) => {
  return (
    <div className="rounded-2xl border bg-card overflow-hidden hover:shadow-lg transition-all duration-200 flex flex-col h-full">
      <div className="aspect-video overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
          <Clock className="h-4 w-4" />
          <span>{article.readTime}</span>
        </div>
        
        <h3 className="text-xl font-semibold mb-3 leading-snug">
          {article.title}
        </h3>
        
        <p className="text-muted-foreground leading-relaxed mb-4 flex-1">
          {article.excerpt}
        </p>
        
        <Button variant="ghost" className="w-full justify-between group mt-auto">
          Read article
          <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default ArticleCard;