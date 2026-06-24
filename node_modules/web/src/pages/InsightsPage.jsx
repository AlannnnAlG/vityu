import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Brain, Lightbulb } from 'lucide-react';
import { useLocalStorage } from '@/hooks/useLocalStorage.js';
import { generateAIInsights } from '@/utils/mockAIInsights.js';
import StatCard from '@/components/StatCard.jsx';
import CravingTrendChart from '@/components/CravingTrendChart.jsx';
import TriggerAnalysisChart from '@/components/TriggerAnalysisChart.jsx';
import LoadingSpinner from '@/components/LoadingSpinner.jsx';

const InsightsPage = () => {
  const [cravings] = useLocalStorage('vityu_cravings', []);
  const [insights, setInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setInsights(generateAIInsights(cravings));
      setIsLoading(false);
    };
    loadInsights();
  }, [cravings]);

  return (
    <>
      <Helmet>
        <title>Insights - Vityu</title>
      </Helmet>

      <div className="w-full flex flex-col p-4 gap-6">
        <div>
          <h1 className="text-2xl font-bold mb-1">AI Insights</h1>
          <p className="text-muted-foreground text-sm">
            Personalized patterns and recommendations.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <LoadingSpinner count={2} type="card" />
          </div>
        ) : cravings.length === 0 ? (
          <div className="rounded-2xl border bg-card p-8 text-center flex flex-col items-center">
            <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-lg mb-2">No insights yet</h3>
            <p className="text-muted-foreground text-sm">
              Log your cravings first to unlock AI-powered insights here.
            </p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-6"
          >
            {/* AI Summary Card */}
            <div className="rounded-2xl bg-primary/10 p-5 border border-primary/20">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center flex-shrink-0">
                  <Brain className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-lg font-bold mb-1">Your Summary</h2>
                  <p className="text-sm leading-relaxed opacity-90">{insights.summary}</p>
                </div>
              </div>
            </div>

            {/* Vertically Stacked Stats */}
            <div className="flex flex-col gap-3">
              <StatCard
                icon="Activity"
                label="Total cravings"
                value={insights.patterns.totalCravings}
              />
              <StatCard
                icon="TrendingUp"
                label="Avg. intensity"
                value={insights.patterns.averageIntensity.toFixed(1)}
              />
              <StatCard
                icon="Tag"
                label="Top trigger"
                value={insights.patterns.topTrigger || 'N/A'}
              />
            </div>

            {/* Horizontally scrollable charts */}
            <div className="flex flex-col gap-6 w-full">
              <h2 className="text-xl font-bold">Trends</h2>
              
              <div className="w-full overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
                <div className="min-w-[420px]">
                  <CravingTrendChart cravings={cravings} />
                </div>
              </div>

              <div className="w-full overflow-x-auto no-scrollbar -mx-4 px-4 pb-2">
                <div className="min-w-[420px]">
                  <TriggerAnalysisChart cravings={cravings} />
                </div>
              </div>
            </div>

            {/* Recommendations */}
            <div className="flex flex-col gap-4">
              <h2 className="text-xl font-bold">Action Plan</h2>
              {insights.recommendations.map((rec, index) => (
                <div key={index} className="rounded-2xl border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="h-8 w-8 rounded-lg bg-secondary/20 flex items-center justify-center">
                      <Lightbulb className="h-4 w-4 text-secondary" />
                    </div>
                    <h3 className="font-semibold text-base">{rec.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed pl-11">
                    {rec.description}
                  </p>
                </div>
              ))}
            </div>

          </motion.div>
        )}
      </div>
    </>
  );
};

export default InsightsPage;