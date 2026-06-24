export const educationCategories = [
  {
    id: 'nutrition',
    name: 'Nutrition',
    icon: 'Apple',
    articles: [
      {
        id: 1,
        title: 'Understanding sugar cravings and blood glucose',
        excerpt: 'Learn how blood sugar fluctuations trigger cravings and what you can do to maintain stable levels throughout the day.',
        category: 'nutrition',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop'
      },
      {
        id: 2,
        title: 'Protein-rich foods that reduce sugar cravings',
        excerpt: 'Discover how incorporating more protein into your meals can naturally decrease your desire for sugary foods.',
        category: 'nutrition',
        readTime: '4 min read',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop'
      },
      {
        id: 3,
        title: 'The role of fiber in managing cravings',
        excerpt: 'Fiber slows digestion and helps you feel fuller longer, reducing the likelihood of sugar cravings.',
        category: 'nutrition',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'wellness',
    name: 'Wellness',
    icon: 'Heart',
    articles: [
      {
        id: 4,
        title: 'Sleep quality and sugar cravings connection',
        excerpt: 'Poor sleep increases cravings for high-sugar foods. Learn strategies to improve your sleep and reduce cravings.',
        category: 'wellness',
        readTime: '7 min read',
        image: 'https://images.unsplash.com/photo-1511688878353-3a2f5be94cd7?w=800&auto=format&fit=crop'
      },
      {
        id: 5,
        title: 'Stress management techniques for craving control',
        excerpt: 'Stress is a major trigger for sugar cravings. Discover mindfulness and relaxation techniques that help.',
        category: 'wellness',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop'
      },
      {
        id: 6,
        title: 'Hydration and its impact on cravings',
        excerpt: 'Dehydration can be mistaken for hunger or cravings. Learn how proper hydration supports your goals.',
        category: 'wellness',
        readTime: '4 min read',
        image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'recipes',
    name: 'Recipes',
    icon: 'ChefHat',
    articles: [
      {
        id: 7,
        title: 'Low-sugar breakfast ideas to start your day',
        excerpt: 'Fuel your morning with these delicious, satisfying breakfast recipes that keep blood sugar stable.',
        category: 'recipes',
        readTime: '8 min read',
        image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&auto=format&fit=crop'
      },
      {
        id: 8,
        title: 'Healthy snacks that satisfy sweet cravings',
        excerpt: 'Enjoy naturally sweet snacks that provide nutrients without the sugar crash.',
        category: 'recipes',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=800&auto=format&fit=crop'
      },
      {
        id: 9,
        title: 'Sugar-free dessert alternatives',
        excerpt: 'Indulge your sweet tooth with these creative dessert recipes using natural sweeteners.',
        category: 'recipes',
        readTime: '7 min read',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop'
      }
    ]
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle',
    icon: 'Sparkles',
    articles: [
      {
        id: 10,
        title: 'Building sustainable low-sugar habits',
        excerpt: 'Small, consistent changes lead to lasting results. Learn how to create habits that stick.',
        category: 'lifestyle',
        readTime: '6 min read',
        image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop'
      },
      {
        id: 11,
        title: 'Social situations and sugar temptations',
        excerpt: 'Navigate parties, restaurants, and social gatherings while staying true to your health goals.',
        category: 'lifestyle',
        readTime: '5 min read',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop'
      },
      {
        id: 12,
        title: 'Mindful eating practices',
        excerpt: 'Develop awareness around your eating habits and learn to distinguish true hunger from cravings.',
        category: 'lifestyle',
        readTime: '7 min read',
        image: 'https://images.unsplash.com/photo-1490818387583-1baba5e638af?w=800&auto=format&fit=crop'
      }
    ]
  }
];

export function getAllArticles() {
  return educationCategories.flatMap(cat => cat.articles);
}

export function getArticlesByCategory(categoryId) {
  const category = educationCategories.find(cat => cat.id === categoryId);
  return category ? category.articles : [];
}