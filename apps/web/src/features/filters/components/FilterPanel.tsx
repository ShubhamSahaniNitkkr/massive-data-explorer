import type { EntityType } from '@mde/shared';
import { ENTITY_FIELD_META } from '@mde/shared';
import {
  Button,
  Drawer,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import { useConceptEnabled } from '@/features/concepts/hooks/useConceptEnabled';
import { touchConceptActivity } from '@/features/concepts/utils/conceptActivity';
import {
  clearFilters,
  setActiveFilter,
  setPanelOpen,
} from '@/features/filters/store/filtersUiSlice';
import { saveFilterToDb } from '@/services/indexeddb/savedFiltersRepo';
import { useFocusTrap } from '@/shared/hooks/useFocusTrap';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppDispatch';

import { filterFormSchema, savedFilterSchema, type FilterFormValues, type SavedFilterFormValues } from '../schemas/filter.schema';
import { SavedFiltersMenu } from './SavedFiltersMenu';

interface FilterPanelProps {
  entity: EntityType;
}

export function FilterPanel({ entity }: FilterPanelProps) {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.filtersUi.isPanelOpen);
  const activeFilter = useAppSelector((state) => state.filtersUi.activeFilter);
  const codeSplittingEnabled = useConceptEnabled('codeSplitting');
  const drawerRef = useFocusTrap<HTMLDivElement>(isOpen);

  useEffect(() => {
    if (isOpen && codeSplittingEnabled) {
      touchConceptActivity(dispatch, 'codeSplitting');
    }
  }, [isOpen, codeSplittingEnabled, dispatch]);

  const filterableFields = ENTITY_FIELD_META[entity].fields.filter((f) => f.filterable);

  const form = useForm<FilterFormValues>({
    resolver: zodResolver(filterFormSchema),
    defaultValues: { field: filterableFields[0]?.key ?? '', operator: 'contains', value: '', valueTo: '' },
  });

  const saveForm = useForm<SavedFilterFormValues>({
    resolver: zodResolver(savedFilterSchema),
    defaultValues: { name: '' },
  });

  const operator = form.watch('operator');
  const showValueTo = operator === 'between';

  const handleApply = form.handleSubmit((values) => {
    const condition = {
      field: values.field,
      op: values.operator,
      value:
        values.operator === 'between' && values.valueTo
          ? [values.value, values.valueTo]
          : !Number.isNaN(Number(values.value)) && values.value.trim() !== ''
            ? Number(values.value)
            : values.value,
    };

    const newFilter = activeFilter
      ? { op: 'and' as const, conditions: [...activeFilter.conditions, condition] }
      : { op: 'and' as const, conditions: [condition] };

    dispatch(setActiveFilter(newFilter));
    form.reset({ field: filterableFields[0]?.key ?? '', operator: 'contains', value: '', valueTo: '' });
  });

  const handleSave = saveForm.handleSubmit(async (values) => {
    if (!activeFilter) return;
    await saveFilterToDb(values.name, activeFilter, entity);
    saveForm.reset();
  });

  return (
    <Drawer
      opened={isOpen}
      onClose={() => dispatch(setPanelOpen(false))}
      title="Filters"
      position="right"
      size="md"
      aria-labelledby="filter-panel-title"
    >
      <div ref={drawerRef}>
        <Stack gap="md">
          <SavedFiltersMenu entity={entity} />

          <form onSubmit={handleApply}>
            <Stack gap="sm">
              <Text id="filter-panel-title" fw={600}>
                Add Filter
              </Text>
              <Select
                label="Field"
                data={filterableFields.map((f) => ({ value: f.key, label: f.label }))}
                {...form.register('field')}
                value={form.watch('field')}
                onChange={(v) => form.setValue('field', v ?? '')}
              />
              <Select
                label="Operator"
                data={[
                  { value: 'eq', label: 'Equals' },
                  { value: 'neq', label: 'Not equals' },
                  { value: 'contains', label: 'Contains' },
                  { value: 'startsWith', label: 'Starts with' },
                  { value: 'endsWith', label: 'Ends with' },
                  { value: 'gt', label: 'Greater than' },
                  { value: 'gte', label: 'Greater or equal' },
                  { value: 'lt', label: 'Less than' },
                  { value: 'lte', label: 'Less or equal' },
                  { value: 'between', label: 'Between' },
                ]}
                value={form.watch('operator')}
                onChange={(v) => form.setValue('operator', (v ?? 'contains') as FilterFormValues['operator'])}
              />
              <TextInput
                label="Value"
                {...form.register('value')}
                error={form.formState.errors.value?.message}
              />
              {showValueTo && (
                <TextInput
                  label="Value (to)"
                  {...form.register('valueTo')}
                />
              )}
              <Button type="submit">Apply Filter</Button>
            </Stack>
          </form>

          {activeFilter && (
            <Stack gap="sm">
              <Text size="sm" fw={500}>
                Active: {activeFilter.conditions.length} condition(s)
              </Text>
              <form onSubmit={handleSave}>
                <Group>
                  <TextInput
                    placeholder="Filter name"
                    style={{ flex: 1 }}
                    {...saveForm.register('name')}
                    error={saveForm.formState.errors.name?.message}
                  />
                  <Button type="submit" variant="light">
                    Save
                  </Button>
                </Group>
              </form>
              <Button variant="subtle" color="red" onClick={() => dispatch(clearFilters())}>
                Clear All Filters
              </Button>
            </Stack>
          )}
        </Stack>
      </div>
    </Drawer>
  );
}
