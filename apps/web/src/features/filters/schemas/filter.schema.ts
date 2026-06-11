import { filterConditionSchema } from '@mde/shared';
import { z } from 'zod';

export const filterFormSchema = z.object({
  field: z.string().min(1, 'Field is required'),
  operator: z.enum([
    'eq',
    'neq',
    'gt',
    'gte',
    'lt',
    'lte',
    'contains',
    'startsWith',
    'endsWith',
    'between',
    'in',
  ]),
  value: z.string().min(1, 'Value is required'),
  valueTo: z.string().optional(),
});

export type FilterFormValues = z.infer<typeof filterFormSchema>;

export const savedFilterSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
});

export type SavedFilterFormValues = z.infer<typeof savedFilterSchema>;

export { filterConditionSchema };
