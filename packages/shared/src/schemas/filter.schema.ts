import { z } from 'zod';

export const filterOperators = [
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
] as const;

export type FilterOperator = (typeof filterOperators)[number];

export const filterConditionSchema = z.object({
  field: z.string().min(1),
  op: z.enum(filterOperators),
  value: z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.array(z.union([z.string(), z.number()])),
    z.null(),
  ]),
});

export type FilterCondition = z.infer<typeof filterConditionSchema>;

export const filterAstSchema: z.ZodType<FilterAst> = z.lazy(() =>
  z.object({
    op: z.enum(['and', 'or']),
    conditions: z.array(z.union([filterConditionSchema, filterAstSchema])),
  }),
);

export interface FilterAst {
  op: 'and' | 'or';
  conditions: Array<FilterCondition | FilterAst>;
}

export function parseFilterAst(input: string): FilterAst | null {
  try {
    const parsed = JSON.parse(input) as unknown;
    const result = filterAstSchema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}
