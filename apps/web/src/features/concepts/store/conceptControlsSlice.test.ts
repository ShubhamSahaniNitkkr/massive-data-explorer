import { describe, expect, it } from 'vitest';

import conceptReducer, {
  closeConceptDetail,
  disableAllConcepts,
  enableAllConcepts,
  openConceptDetail,
  pulseConceptActivity,
  releaseConceptActivity,
  setConceptEnabled,
  toggleConcept,
} from './conceptControlsSlice';

describe('conceptControlsSlice', () => {
  it('toggles individual concepts', () => {
    let state = conceptReducer(undefined, toggleConcept('virtualization'));
    expect(state.enabled.virtualization).toBe(false);
    expect(state.lastDisabledConcept).toBe('virtualization');
  });

  it('disables and enables all concepts', () => {
    let state = conceptReducer(undefined, disableAllConcepts());
    expect(Object.values(state.enabled).every((v) => !v)).toBe(true);

    state = conceptReducer(state, enableAllConcepts());
    expect(Object.values(state.enabled).every((v) => v)).toBe(true);
    expect(state.lastDisabledConcept).toBeNull();
  });

  it('marks last toggled concept for highlight pulse', () => {
    const state = conceptReducer(
      undefined,
      setConceptEnabled({ id: 'useMemo', enabled: false }),
    );
    expect(state.lastToggledConcept).toBe('useMemo');
    expect(state.highlightGeneration).toBe(1);
  });

  it('opens and closes concept detail modal', () => {
    let state = conceptReducer(undefined, openConceptDetail('useMemo'));
    expect(state.selectedConceptId).toBe('useMemo');
    state = conceptReducer(state, closeConceptDetail());
    expect(state.selectedConceptId).toBeNull();
  });

  it('tracks in-use activity and fade generation', () => {
    let state = conceptReducer(undefined, pulseConceptActivity('infiniteScroll'));
    expect(state.conceptsInUse.infiniteScroll).toBe(true);

    state = conceptReducer(state, releaseConceptActivity('infiniteScroll'));
    expect(state.conceptsInUse.infiniteScroll).toBeUndefined();
    expect(state.conceptFading.infiniteScroll).toBe(1);
  });

  it('bumps cache when rtk cache disabled', () => {
    const initial = conceptReducer(undefined, { type: 'init' });
    const state = conceptReducer(
      initial,
      setConceptEnabled({ id: 'rtkQueryCache', enabled: false }),
    );
    expect(state.cacheBust).toBeGreaterThan(0);
  });
});
