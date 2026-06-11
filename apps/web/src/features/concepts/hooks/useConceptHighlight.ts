import { useEffect, useState } from 'react';

import {
  clearConceptFade,
  clearConceptHighlight,
} from '@/features/concepts/store/conceptControlsSlice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppDispatch';

import type { ConceptId } from '../constants/concepts';

const TOGGLE_HIGHLIGHT_MS = 2200;
const FADE_OUT_MS = 2600;

export type ConceptHighlightState = 'none' | 'toggle' | 'active' | 'fading';

/**
 * Drives control-panel tile highlight: toggle flash, sustained in-use glow, or slow fade-out.
 */
export function useConceptHighlight(conceptId: ConceptId): ConceptHighlightState {
  const dispatch = useAppDispatch();
  const inUse = useAppSelector((state) => !!state.conceptControls.conceptsInUse[conceptId]);
  const fadeGen = useAppSelector((state) => state.conceptControls.conceptFading[conceptId] ?? 0);
  const lastToggled = useAppSelector((state) => state.conceptControls.lastToggledConcept);
  const toggleGen = useAppSelector((state) => state.conceptControls.highlightGeneration);
  const [toggleFlash, setToggleFlash] = useState(false);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (lastToggled !== conceptId) return;

    setToggleFlash(true);
    const timer = window.setTimeout(() => {
      setToggleFlash(false);
      dispatch(clearConceptHighlight());
    }, TOGGLE_HIGHLIGHT_MS);

    return () => window.clearTimeout(timer);
  }, [lastToggled, toggleGen, conceptId, dispatch]);

  useEffect(() => {
    if (!fadeGen) return;

    setFading(true);
    const timer = window.setTimeout(() => {
      setFading(false);
      dispatch(clearConceptFade(conceptId));
    }, FADE_OUT_MS);

    return () => window.clearTimeout(timer);
  }, [fadeGen, conceptId, dispatch]);

  if (inUse) return 'active';
  if (fading) return 'fading';
  if (toggleFlash) return 'toggle';
  return 'none';
}
