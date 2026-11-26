import { epochDay } from '../fatsecret.js';
import { readRange } from './nutrition.js';
import type { NutritionEnv } from '../fatsecretApi/types.js';

type PeriodRequest = {
  from: string;
  to: string;
  cursor?: string;
  pageSize?: number;
  includeEntries?: boolean;
};

const dateFromDay = (day: number) => new Date(day * 86400000).toISOString().slice(0, 10);

export const readPeriod = async (request: PeriodRequest, env: NutritionEnv) => {
  const { from, to, cursor, pageSize = 7, includeEntries = false } = request;
  const start = epochDay(from);
  const end = epochDay(to);
  const pageStart = cursor === undefined ? start : epochDay(cursor);
  if (end < start) throw new Error('End date must not precede start date');
  if (pageStart < start || pageStart > end) throw new Error('Cursor must be within the requested period');
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 31) {
    throw new Error('Page size must be 1 to 31 days');
  }
  const pageEnd = Math.min(pageStart + pageSize - 1, end);
  const page = await readRange(dateFromDay(pageStart), dateFromDay(pageEnd), env);
  const complete = pageEnd === end;
  const nextCursor = complete ? null : dateFromDay(pageEnd + 1);
  return {
    from,
    to,
    totalDays: end - start + 1,
    pageFrom: page.from,
    pageTo: page.to,
    returnedDays: page.days.length,
    includeEntries,
    days: includeEntries ? page.days : page.days.map(({ date, entries, totals, note }) => ({
      date, entryCount: entries.length, totals, note
    })),
    complete,
    nextCursor,
    nextRequest: nextCursor === null ? null : { from, to, cursor: nextCursor, pageSize, includeEntries },
    note: 'This response covers pageFrom through pageTo only. Follow nextRequest until complete is true before reporting on the full requested period. Missing optional nutrients are unknown; partially reported totals may underestimate intake.'
  };
};
