export function generateAIInsights(cravings) {
  if (!cravings || cravings.length === 0) {
    return {
      summary: "Start logging your cravings to receive personalized insights.",
      recommendations: [],
      patterns: {},
      peakTimes: []
    };
  }

  const triggerCounts = {};
  const hourCounts = {};
  const intensitySum = cravings.reduce((sum, c) => sum + c.intensity, 0);
  const avgIntensity = intensitySum / cravings.length;

  cravings.forEach(craving => {
    triggerCounts[craving.trigger] = (triggerCounts[craving.trigger] || 0) + 1;
    
    const hour = new Date(craving.timestamp).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });

  const topTrigger = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0];
  const peakHours = Object.entries(hourCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([hour]) => parseInt(hour));

  const recommendations = [];

  if (topTrigger && topTrigger[0] === 'stress') {
    recommendations.push({
      title: "Manage stress triggers",
      description: "Your cravings are often linked to stress. Try deep breathing exercises or a 5-minute walk when you feel stressed.",
      icon: "Brain"
    });
  }

  if (topTrigger && topTrigger[0] === 'boredom') {
    recommendations.push({
      title: "Combat boredom mindfully",
      description: "Keep healthy snacks nearby and engage in activities you enjoy when boredom strikes.",
      icon: "Sparkles"
    });
  }

  if (avgIntensity > 7) {
    recommendations.push({
      title: "High intensity patterns detected",
      description: "Your cravings tend to be intense. Consider meal planning to maintain stable blood sugar levels throughout the day.",
      icon: "TrendingUp"
    });
  }

  if (peakHours.some(h => h >= 14 && h <= 16)) {
    recommendations.push({
      title: "Afternoon energy dip",
      description: "You experience cravings in the afternoon. Try a protein-rich lunch and stay hydrated to maintain energy.",
      icon: "Coffee"
    });
  }

  if (cravings.length >= 5) {
    const recentCravings = cravings.slice(-5);
    const recentAvg = recentCravings.reduce((sum, c) => sum + c.intensity, 0) / 5;
    const overallAvg = avgIntensity;
    
    if (recentAvg < overallAvg - 1) {
      recommendations.push({
        title: "You're making progress",
        description: "Your recent cravings are less intense than before. Keep up the great work with your healthy habits.",
        icon: "Award"
      });
    }
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: "Build consistent habits",
      description: "Continue tracking your cravings to identify patterns and develop strategies that work for you.",
      icon: "Target"
    });
  }

  return {
    summary: `You've logged ${cravings.length} cravings with an average intensity of ${avgIntensity.toFixed(1)}/10. Your most common trigger is ${topTrigger ? topTrigger[0] : 'unknown'}.`,
    recommendations,
    patterns: {
      topTrigger: topTrigger ? topTrigger[0] : null,
      triggerCount: topTrigger ? topTrigger[1] : 0,
      averageIntensity: avgIntensity,
      totalCravings: cravings.length
    },
    peakTimes: peakHours
  };
}