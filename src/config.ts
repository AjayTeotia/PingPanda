export const FREE_QUOTA = {
  maxEventsPerMonth: 100,
  maxEventsCount: 3,
} as const;

export const PRO_QUOTA = {
  maxEventsPerMonth: 1000,
  maxEventsCount: 10,
} as const;
