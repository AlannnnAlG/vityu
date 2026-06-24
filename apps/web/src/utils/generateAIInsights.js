export const generateAIInsights = (cravings) => {
  if (!cravings || cravings.length === 0) {
    return {
      title: "Start Tracking",
      insight: "Log your first craving to unlock personalized AI insights."
    };
  }

  const triggers = cravings.map(c => c.trigger);
  const triggerCounts = triggers.reduce((acc, trigger) => {
    acc[trigger] = (acc[trigger] || 0) + 1;
    return acc;
  }, {});

  const topTrigger = Object.keys(triggerCounts).reduce((a, b) => 
    triggerCounts[a] > triggerCounts[b] ? a : b
  );

  const insightsMap = {
    stress: "Stress is your top trigger. Try a 5-minute deep breathing exercise when cravings hit.",
    boredom: "Boredom often leads to cravings. Keep your hands busy with a quick puzzle or walk.",
    habit: "You're fighting a habitual pattern. Try changing your environment during high-risk times.",
    social: "Social situations trigger your cravings. Plan ahead by bringing a healthy alternative.",
    emotional: "Emotions are driving your cravings. Journaling your feelings might help decouple them from food.",
    other: "Notice a pattern? Try adding more detailed notes to your next log to help identify the root cause."
  };

  return {
    title: "Insight of the Day",
    insight: insightsMap[topTrigger] || "Consistency is key. Keep logging to build a clearer picture of your habits."
  };
};