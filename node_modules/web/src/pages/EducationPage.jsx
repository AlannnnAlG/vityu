import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { educationCategories, getAllArticles } from '@/utils/mockEducationData.js';
import ArticleCard from '@/components/ArticleCard.jsx';

const EducationPage = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const displayArticles = selectedCategory === 'all' 
    ? getAllArticles() 
    : educationCategories.find(cat => cat.id === selectedCategory)?.articles || [];

  return (
    <>
      <Helmet>
        <title>Learn - Vityu</title>
      </Helmet>

      <div className="w-full flex flex-col p-4 gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">Education Hub</h1>
          <p className="text-muted-foreground text-sm">
            Science-backed tips for a healthier you.
          </p>
        </div>

        {/* Scrollable Horizontal Tabs */}
        <div className="w-full overflow-x-auto no-scrollbar -mx-4 px-4 pb-1">
          <div className="flex items-center gap-2 bg-muted/40 p-1.5 rounded-xl w-max">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`min-h-[44px] px-5 rounded-lg text-sm font-medium transition-all ${
                selectedCategory === 'all' ? 'bg-background shadow text-foreground' : 'text-muted-foreground'
              }`}
            >
              All
            </button>
            {educationCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`min-h-[44px] px-5 rounded-lg text-sm font-medium transition-all ${
                  selectedCategory === cat.id ? 'bg-background shadow text-foreground' : 'text-muted-foreground'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Stacked Articles */}
        <div className="flex flex-col gap-6">
          {displayArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ArticleCard article={article} />
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
};

export default EducationPage;