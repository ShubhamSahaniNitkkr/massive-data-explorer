import type { FilterAst, FilterCondition } from '@mde/shared';
import { ENTITY_FIELD_META } from '@mde/shared';

import type { EntityRecord, EntityType } from '../types/index.js';

function getFieldValue(record: EntityRecord, field: string): unknown {
  return (record as unknown as Record<string, unknown>)[field];
}

function isFilterCondition(item: FilterCondition | FilterAst): item is FilterCondition {
  return 'field' in item;
}

function evaluateCondition(record: EntityRecord, condition: FilterCondition): boolean {
  const value = getFieldValue(record, condition.field);
  const filterValue = condition.value;

  switch (condition.op) {
    case 'eq':
      return String(value).toLowerCase() === String(filterValue).toLowerCase();
    case 'neq':
      return String(value).toLowerCase() !== String(filterValue).toLowerCase();
    case 'gt':
      return Number(value) > Number(filterValue);
    case 'gte':
      return Number(value) >= Number(filterValue);
    case 'lt':
      return Number(value) < Number(filterValue);
    case 'lte':
      return Number(value) <= Number(filterValue);
    case 'contains':
      return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
    case 'startsWith':
      return String(value).toLowerCase().startsWith(String(filterValue).toLowerCase());
    case 'endsWith':
      return String(value).toLowerCase().endsWith(String(filterValue).toLowerCase());
    case 'between': {
      if (!Array.isArray(filterValue) || filterValue.length !== 2) return false;
      const [min, max] = filterValue;
      const numValue = Number(value);
      if (!Number.isNaN(numValue)) {
        return numValue >= Number(min) && numValue <= Number(max);
      }
      const dateValue = new Date(String(value)).getTime();
      const minDate = new Date(String(min)).getTime();
      const maxDate = new Date(String(max)).getTime();
      return dateValue >= minDate && dateValue <= maxDate;
    }
    case 'in': {
      if (!Array.isArray(filterValue)) return false;
      return filterValue.map(String).includes(String(value));
    }
    default:
      return false;
  }
}

function evaluateAst(record: EntityRecord, ast: FilterAst): boolean {
  if (ast.op === 'and') {
    return ast.conditions.every((c) =>
      isFilterCondition(c) ? evaluateCondition(record, c) : evaluateAst(record, c),
    );
  }
  return ast.conditions.some((c) =>
    isFilterCondition(c) ? evaluateCondition(record, c) : evaluateAst(record, c),
  );
}

export function applyFilters(
  records: EntityRecord[],
  entity: EntityType,
  filterAst: FilterAst | null,
): EntityRecord[] {
  if (!filterAst) return records;

  const validFields = new Set(ENTITY_FIELD_META[entity].fields.filter((f) => f.filterable).map((f) => f.key));

  function validateAst(ast: FilterAst): boolean {
    return ast.conditions.every((c) => {
      if (!isFilterCondition(c)) {
        return validateAst(c);
      }
      return validFields.has(c.field);
    });
  }

  if (!validateAst(filterAst)) {
    return records;
  }

  return records.filter((record) => evaluateAst(record, filterAst));
}
