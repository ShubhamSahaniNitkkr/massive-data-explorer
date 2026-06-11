import { useAppSelector } from '@/shared/hooks/useAppDispatch';

import type { ConceptId } from '../constants/concepts';

export function useConceptEnabled(id: ConceptId): boolean {
  return useAppSelector((state) => state.conceptControls.enabled[id]);
}

export function useConceptControls() {
  return useAppSelector((state) => state.conceptControls);
}

export function useDisabledConceptCount(): number {
  const enabled = useAppSelector((state) => state.conceptControls.enabled);
  return Object.values(enabled).filter((v) => !v).length;
}
