export const calculateStreak = (cravings) => {
  if (!cravings || cravings.length === 0) return 0;

  // Extract unique dates (YYYY-MM-DD) from cravings, sorted descending
  const dates = [...new Set(cravings.map(c => new Date(c.timestamp).toISOString().split('T')[0]))]
    .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

  if (dates.length === 0) return 0;

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // If latest log isn't today or yesterday, streak is broken (0)
  if (dates[0] !== todayStr && dates[0] !== yesterdayStr) {
    return 0;
  }

  let streak = 1;
  let currentDate = new Date(dates[0]);

  for (let i = 1; i < dates.length; i++) {
    const prevDate = new Date(dates[i]);
    const diffTime = Math.abs(currentDate - prevDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streak++;
      currentDate = prevDate;
    } else {
      break;
    }
  }

  return streak;
};