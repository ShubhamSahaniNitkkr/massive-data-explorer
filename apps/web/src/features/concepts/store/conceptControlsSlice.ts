import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import {
  CONCEPT_DEFINITIONS,
  DEFAULT_CONCEPT_STATE,
  type ConceptId,
} from '../constants/concepts';

interface ConceptControlsState {
  enabled: Record<ConceptId, boolean>;
  panelOpen: boolean;
  apiCallsThisSession: number;
  renderCount: number;
  cacheBust: number;
  lastDisabledConcept: ConceptId | null;
  /** Concept just toggled — drives highlight pulse in control panel */
  lastToggledConcept: ConceptId | null;
  highlightGeneration: number;
  /** Concepts currently in active use (scroll, fetch, debounce, etc.) */
  conceptsInUse: Partial<Record<ConceptId, true>>;
  /** Bumped when use ends — drives slow fade-out highlight */
  conceptFading: Partial<Record<ConceptId, number>>;
  /** Concept detail modal on explorer page */
  selectedConceptId: ConceptId | null;
}

const initialState: ConceptControlsState = {
  enabled: { ...DEFAULT_CONCEPT_STATE },
  panelOpen: false,
  apiCallsThisSession: 0,
  renderCount: 0,
  cacheBust: 0,
  lastDisabledConcept: null,
  lastToggledConcept: null,
  highlightGeneration: 0,
  conceptsInUse: {},
  conceptFading: {},
  selectedConceptId: null,
};

function markConceptToggled(state: ConceptControlsState, id: ConceptId) {
  state.lastToggledConcept = id;
  state.highlightGeneration += 1;
}

const conceptControlsSlice = createSlice({
  name: 'conceptControls',
  initialState,
  reducers: {
    setConceptEnabled(state, action: PayloadAction<{ id: ConceptId; enabled: boolean }>) {
      state.enabled[action.payload.id] = action.payload.enabled;
      markConceptToggled(state, action.payload.id);
      if (!action.payload.enabled) {
        state.lastDisabledConcept = action.payload.id;
      }
      if (action.payload.id === 'rtkQueryCache' && !action.payload.enabled) {
        state.cacheBust += 1;
      }
    },
    toggleConcept(state, action: PayloadAction<ConceptId>) {
      const id = action.payload;
      state.enabled[id] = !state.enabled[id];
      markConceptToggled(state, id);
      if (!state.enabled[id]) {
        state.lastDisabledConcept = id;
      }
      if (id === 'rtkQueryCache' && !state.enabled[id]) {
        state.cacheBust += 1;
      }
    },
    clearConceptHighlight(state) {
      state.lastToggledConcept = null;
    },
    pulseConceptActivity(state, action: PayloadAction<ConceptId>) {
      const id = action.payload;
      state.conceptsInUse[id] = true;
      delete state.conceptFading[id];
    },
    releaseConceptActivity(state, action: PayloadAction<ConceptId>) {
      const id = action.payload;
      if (!state.conceptsInUse[id]) return;
      delete state.conceptsInUse[id];
      state.conceptFading[id] = (state.conceptFading[id] ?? 0) + 1;
    },
    clearConceptFade(state, action: PayloadAction<ConceptId>) {
      delete state.conceptFading[action.payload];
    },
    openConceptDetail(state, action: PayloadAction<ConceptId>) {
      state.selectedConceptId = action.payload;
    },
    closeConceptDetail(state) {
      state.selectedConceptId = null;
    },
    enableAllConcepts(state) {
      state.enabled = { ...DEFAULT_CONCEPT_STATE };
      state.lastDisabledConcept = null;
    },
    disableAllConcepts(state) {
      for (const concept of CONCEPT_DEFINITIONS) {
        state.enabled[concept.id] = false;
      }
      state.lastDisabledConcept = 'virtualization';
      state.cacheBust += 1;
    },
    setPanelOpen(state, action: PayloadAction<boolean>) {
      state.panelOpen = action.payload;
    },
    togglePanel(state) {
      state.panelOpen = !state.panelOpen;
    },
    incrementApiCalls(state, action: PayloadAction<number | undefined>) {
      state.apiCallsThisSession += action.payload ?? 1;
    },
    resetApiCalls(state) {
      state.apiCallsThisSession = 0;
    },
    incrementRenderCount(state) {
      state.renderCount += 1;
    },
    bumpCacheBust(state) {
      state.cacheBust += 1;
    },
  },
});

export const {
  setConceptEnabled,
  toggleConcept,
  enableAllConcepts,
  disableAllConcepts,
  setPanelOpen,
  togglePanel,
  incrementApiCalls,
  resetApiCalls,
  incrementRenderCount,
  bumpCacheBust,
  clearConceptHighlight,
  pulseConceptActivity,
  releaseConceptActivity,
  clearConceptFade,
  openConceptDetail,
  closeConceptDetail,
} = conceptControlsSlice.actions;

export default conceptControlsSlice.reducer;
