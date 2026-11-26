import { diary, epochDay } from '../fatsecret.js';
import type { NutritionEnv } from '../fatsecretApi/types.js';

export const readDiary = async (date: string, env: NutritionEnv) => {
  epochDay(date);
  if (!env.FATSECRET_CONSUMER_KEY || !env.FATSECRET_CONSUMER_SECRET ||
      !env.FATSECRET_ACCESS_TOKEN || !env.FATSECRET_ACCESS_SECRET) {
    throw new Error('FatSecret is not configured');
  }
  return diary(date,
    { key: env.FATSECRET_CONSUMER_KEY, secret: env.FATSECRET_CONSUMER_SECRET },
    { token: env.FATSECRET_ACCESS_TOKEN, secret: env.FATSECRET_ACCESS_SECRET });
};

export const readRange = async (from: string, to: string, env: NutritionEnv) => {
  const start = epochDay(from);
  const end = epochDay(to);
  if (end < start || end - start > 30) throw new Error('Range must be 1 to 31 days');
  const days = [];
  for (let day = start; day <= end; day += 4) {
    const dates = Array.from({ length: Math.min(4, end - day + 1) }, (_, offset) =>
      new Date((day + offset) * 86400000).toISOString().slice(0, 10));
    days.push(...await Promise.all(dates.map(date => readDiary(date, env))));
  }
  return { from, to, days };
};
