import type { AppDispatch } from '@/store';

import type { ConceptId } from '../constants/concepts';
import { pulseConceptActivity, releaseConceptActivity } from '../store/conceptControlsSlice';

const IDLE_MS = 900;
const timers = new Map<ConceptId, ReturnType<typeof setTimeout>>();

/** Mark a concept as actively in use; auto-releases after idle period for fade-out UI. */
export function touchConceptActivity(dispatch: AppDispatch, id: ConceptId) {
  dispatch(pulseConceptActivity(id));

  const existing = timers.get(id);
  if (existing) clearTimeout(existing);

  timers.set(
    id,
    setTimeout(() => {
      dispatch(releaseConceptActivity(id));
      timers.delete(id);
    }, IDLE_MS),
  );
}
