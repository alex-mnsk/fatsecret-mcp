import { z } from 'zod';
import { epochDay } from '../fatsecret.js';
import type { ApiMethod, ApiParameter } from './types.js';

const identifier = z.union([z.string().regex(/^\d{1,20}$/), z.number().int().nonnegative().safe()]);
const meals = ['breakfast', 'lunch', 'dinner', 'other'] as const;
const date = z.string().refine(value => {
  try { epochDay(value); return true; } catch { return false; }
}, 'Use a valid YYYY-MM-DD date in the diary timezone');

const eatenFood = z.strictObject({
  food_id: identifier,
  food_name: z.string().min(1).max(1000),
  food_brand: z.string().max(1000).nullable().optional(),
  serving_description: z.string().max(1000).optional(),
  serving_size: z.union([z.string().max(1000), z.number().finite().nonnegative()]).optional()
});

const parameterSchema = (method: ApiMethod, parameter: ApiParameter): z.ZodType => {
  const [name, type] = parameter;
  if (['date', 'from_date', 'to_date'].includes(name)) return date;
  if (name === 'eaten_foods') return z.array(eatenFood).max(100);
  if (name === 'barcode') return z.string().regex(/^\d{8,14}$/);
  if (name === 'meal') return z.enum(meals);
  if (name === 'meals') return z.string().refine(value => value.split(',').every(meal => meals.includes(meal.trim() as typeof meals[number])), 'Use comma-separated meal names: breakfast, lunch, dinner, other');
  if (name === 'food_type') return z.enum(['none', 'generic', 'brand']);
  if (name === 'brand_type') return z.enum(['manufacturer', 'restaurant', 'supermarket']);
  if (name === 'serving_amount_unit') return z.enum(['g', 'ml', 'oz']);
  if (name === 'weight_type') return z.enum(['kg', 'lb']);
  if (name === 'height_type') return z.enum(['cm', 'inch']);
  if (name === 'sort_by') return z.enum(['newest', 'oldest', 'caloriesPerServingAscending', 'caloriesPerServingDescending']);
  if (name === 'issue_type_id') return z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(99)]);
  if (name === 'image_file_extension') return z.enum(['jpg', 'jpeg', 'png', 'tiff']);
  if (name === 'image_b64') return z.string().min(1).max(999982).regex(/^[A-Za-z0-9+/]+={0,2}$/);
  if (type === 'Bool' || type === 'Boolean') return z.boolean();
  if (type === 'Long' || (type === 'Int' && name.endsWith('_id'))) {
    if (name.includes('percentage.') || name.startsWith('calories.') || name.startsWith('prep_time.')) {
      return z.number().int().nonnegative().max(name.includes('percentage.') ? 100 : Number.MAX_SAFE_INTEGER);
    }
    return identifier;
  }
  if (type === 'Int') {
    if (name === 'max_results') return z.number().int().min(1).max(method.name === 'foods.autocomplete' ? 10 : 50);
    if (name === 'days') return z.number().int().min(0).max(128);
    if (name === 'minutes') return z.number().int().min(1).max(1440);
    return z.number().int().nonnegative().safe();
  }
  if (type === 'Decimal') {
    const value = z.number().finite().nonnegative();
    return ['number_of_units', 'current_weight_kg', 'goal_weight_kg', 'current_height_cm'].includes(name) ? value.positive() : value;
  }
  if (type === 'Array') throw new Error(`Unsupported array parameter: ${name}`);
  let value = z.string().max(name === 'user_input' ? 1000 : 4000);
  if (name.endsWith('_name') || name === 'user_input') value = value.min(1);
  return value;
};

export const createInputSchema = (method: ApiMethod) => {
  const shape: Record<string, z.ZodType> = {};
  for (const parameter of method.parameters) {
    const [name, , required, description] = parameter;
    if (method.encoding === 'json' && name.includes('.')) continue;
    const input = parameterSchema(method, parameter).describe(
      ['date', 'from_date', 'to_date'].includes(name) ? 'Explicit YYYY-MM-DD date in the diary timezone; converted to FatSecret epoch days.' : description
    );
    shape[name] = required ? input : input.optional();
  }
  if (method.name === 'feedback') {
    shape.returned_food = z.strictObject({ food_id: identifier, serving_id: identifier.optional() }).optional();
  }
  return z.strictObject(shape).superRefine((input, ctx) => {
    const issue = (message: string) => ctx.addIssue({ code: 'custom', message });
    if (method.name === 'food_entries.get' && (input.date === undefined) === (input.food_entry_id === undefined)) {
      issue('Provide exactly one of date or food_entry_id');
    }
    const primaryId = method.parameters.find(([name, , required]) => required && name.endsWith('_id'))?.[0];
    if (method.name.endsWith('.edit') && !Object.keys(input).some(name => name !== primaryId && name !== 'date')) {
      issue('Provide at least one field to change');
    }
    if (method.name === 'exercise_entry.edit') {
      if (String(input.shift_to_id) === '0' && (!input.shift_to_name || input.kcal === undefined)) issue('Custom target activity requires shift_to_name and kcal');
      if (String(input.shift_from_id) === '0' && !input.shift_from_name) issue('Custom source activity requires shift_from_name');
    }
    if (method.name === 'feedback') {
      const returned = input.returned_food as { food_id?: unknown; serving_id?: unknown } | undefined;
      if (input.issue_type_id === 1 && !input.barcode) issue('Wrong name/brand feedback requires barcode');
      if ([1, 2, 3].includes(Number(input.issue_type_id)) && returned?.food_id === undefined) issue('This feedback type requires returned_food.food_id');
      if ([2, 3].includes(Number(input.issue_type_id)) && returned?.serving_id === undefined) issue('This feedback type requires returned_food.serving_id');
      if (input.issue_type_id === 99 && !input.issue_type) issue('Other feedback requires issue_type');
    }
  });
};
