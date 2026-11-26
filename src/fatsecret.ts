import { signedUrl, type OAuthConfig, type Token } from './oauth.js';

export type Entry = {
  id: string;
  name: string;
  description: string;
  meal: string;
  calories: number;
  protein: number;
  fat: number;
  carbohydrate: number;
  fiber: number | null;
  sugar: number | null;
  saturatedFat: number | null;
};

const number = (v: unknown): number => Number.isFinite(Number(v)) ? Number(v) : 0;
const optional = (v: unknown): number | null => v === undefined || v === null || v === '' ? null : number(v);

export function epochDay(date: string): number {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error('Use YYYY-MM-DD');
  const ms = Date.parse(`${date}T00:00:00Z`);
  if (!Number.isFinite(ms) || new Date(ms).toISOString().slice(0, 10) !== date) throw new Error('Invalid date');
  return ms / 86400000;
}

export async function diary(date: string, config: OAuthConfig, token: Token) {
  const url = signedUrl('GET', 'https://platform.fatsecret.com/rest/food-entries/v2', config, token, {
    date: String(epochDay(date)), format: 'json'
  });
  const response = await fetch(url, { signal: AbortSignal.timeout(15000) });
  const body = await response.text();
  if (!response.ok) throw new Error(`FatSecret HTTP ${response.status}: ${body.slice(0, 250)}`);
  const json = JSON.parse(body);
  if (json.error) throw new Error(`FatSecret API error: ${JSON.stringify(json.error).slice(0, 250)}`);
  const raw = json.food_entries?.food_entry;
  const array: Record<string, unknown>[] = raw ? (Array.isArray(raw) ? raw : [raw]) : [];
  const entries: Entry[] = array.map(e => ({
    id: String(e.food_entry_id ?? ''),
    name: String(e.food_entry_name ?? ''),
    description: String(e.food_entry_description ?? ''),
    meal: String(e.meal ?? ''),
    calories: number(e.calories),
    protein: number(e.protein),
    fat: number(e.fat),
    carbohydrate: number(e.carbohydrate),
    fiber: optional(e.fiber),
    sugar: optional(e.sugar),
    saturatedFat: optional(e.saturated_fat)
  }));
  const sum = (key: 'calories' | 'protein' | 'fat' | 'carbohydrate') => Math.round(entries.reduce((a, e) => a + e[key], 0) * 100) / 100;
  const optionalSum = (key: 'fiber' | 'sugar' | 'saturatedFat') => entries.some(e => e[key] != null)
    ? Math.round(entries.reduce((a, e) => a + (e[key] ?? 0), 0) * 100) / 100 : null;
  return { date, entries, totals: { calories: sum('calories'), protein: sum('protein'), fat: sum('fat'), carbohydrate: sum('carbohydrate'), fiber: optionalSum('fiber'), sugar: optionalSum('sugar'), saturatedFat: optionalSum('saturatedFat') }, note: 'Null micronutrient totals mean none were reported. Partial optional nutrient coverage may underestimate totals.' };
}
