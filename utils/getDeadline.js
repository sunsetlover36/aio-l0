// Get deadline timestamp (10 minutes by default)
export const getDeadline = () => Math.round((Date.now() + 600000) / 1000);
