import type { FilterAst, FilterCondition } from '@mde/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { setActiveFilter } from '@/features/filters/store/filtersUiSlice';
import { useAppDispatch } from '@/shared/hooks/useAppDispatch';

import { filterFormSchema, type FilterFormValues } from '../schemas/filter.schema';

function buildCondition(values: FilterFormValues): FilterCondition {
  if (values.operator === 'between' && values.valueTo) {
    return {
      field: values.field,
      op: values.operator,
      value: [values.value, values.valueTo],
    };
  }

  const numValue = Number(values.value);
  const value = !Number.isNaN(numValue) && values.value.trim() !== '' ? numValue : values.value;

  return {
    field: values.field,
    op: values.operator,
    value,
  };
}

export function useFilterForm(existingFilter?: FilterAst | null) {
  const dispatch = useAppDispatch();

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: {
      field: '',
      operator: 'contains',
      value: '',
      valueTo: '',
    },
  });

  const applyFilter = form.handleSubmit((values) => {
    const condition = buildCondition(values);
    const newFilter: FilterAst = existingFilter
      ? { op: 'and', conditions: [...existingFilter.conditions, condition] }
      : { op: 'and', conditions: [condition] };
    dispatch(setActiveFilter(newFilter));
    form.reset();
  });

  return { form, applyFilter };
}
