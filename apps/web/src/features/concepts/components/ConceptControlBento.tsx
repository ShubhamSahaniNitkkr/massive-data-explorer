import { Box, Button, Group, Switch, Text, UnstyledButton } from '@mantine/core';
import { useState } from 'react';
import { shallowEqual } from 'react-redux';

import {
  disableAllConcepts,
  enableAllConcepts,
  openConceptDetail,
  resetApiCalls,
  setConceptEnabled,
} from '@/features/concepts/store/conceptControlsSlice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppDispatch';

import {
  CONCEPT_DEFINITIONS,
  type ConceptCategory,
  type ConceptDefinition,
} from '../constants/concepts';
import { useConceptEnabled } from '../hooks/useConceptEnabled';
import { useConceptHighlight } from '../hooks/useConceptHighlight';
import { ConceptDetailModal } from './ConceptDetailModal';
import { PerformanceStatsModal } from './PerformanceStatsModal';

const TILE_ICONS: Record<string, string> = {
  virtualization: '▦',
  debouncing: '◷',
  abortController: '⊘',
  reactMemo: '◆',
  useCallback: 'ƒ',
  useMemo: '∑',
  useTransition: '⇄',
  useDeferredValue: '⧖',
  throttling: '⊞',
  codeSplitting: '◫',
  suspense: '…',
  webWorkers: '⚙',
  rtkQueryCache: '◉',
  prefetching: '⇢',
  keepPreviousData: '⟲',
  infiniteScroll: '↓',
  intersectionObserver: '◎',
  indexedDB: '▣',
  errorBoundary: '⚠',
  selectiveSubscription: '⊂',
  autoRetry: '↻',
};

const CATEGORY_FLASH: Record<ConceptCategory, string> = {
  Performance: 'concept-flash--blue',
  Network: 'concept-flash--teal',
  Architecture: 'concept-flash--violet',
  Browser: 'concept-flash--orange',
};

function BentoTile({ className = '', children }: { className?: string; children: React.ReactNode }) {
  return <div className={`premium-bento-tile ${className}`.trim()}>{children}</div>;
}

function ConceptTile({ concept }: { concept: ConceptDefinition }) {
  const dispatch = useAppDispatch();
  const enabled = useConceptEnabled(concept.id);
  const highlighted = useConceptHighlight(concept.id);

  const highlightClass =
    !enabled
      ? ''
      : highlighted === 'active'
        ? `concept-in-use ${CATEGORY_FLASH[concept.category]}`
        : highlighted === 'fading'
          ? `concept-fading-out ${CATEGORY_FLASH[concept.category]}`
          : highlighted === 'toggle'
            ? `concept-flash ${CATEGORY_FLASH[concept.category]}`
            : '';

  const tileClass = [
    'premium-bento-tile--concept',
    'concept-tile-btn',
    enabled ? 'premium-bento-tile--on' : 'premium-bento-tile--off',
    highlightClass,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <BentoTile className={tileClass}>
      <UnstyledButton
        className="concept-tile-hit"
        onClick={() => dispatch(openConceptDetail(concept.id))}
        aria-label={`Open ${concept.name} details`}
      >
        {enabled && highlighted !== 'none' && (
          <span
            className={highlighted === 'active' ? 'concept-in-use-chip' : 'concept-flash-chip'}
            aria-live="polite"
          >
            Using {concept.name}
          </span>
        )}
        <div className="premium-bento-tile__top">
          <span className="premium-bento-tile__icon" aria-hidden="true">
            {TILE_ICONS[concept.id]}
          </span>
          <div
            className="concept-tile-switch"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <Switch
              size="md"
              checked={enabled}
              onChange={(e) =>
                dispatch(setConceptEnabled({ id: concept.id, enabled: e.currentTarget.checked }))
              }
              aria-label={`${enabled ? 'Disable' : 'Enable'} ${concept.name}`}
              classNames={{ track: 'premium-switch-track', thumb: 'premium-switch-thumb' }}
            />
          </div>
        </div>
        <Text
          className={`premium-bento-tile__title ${enabled && (highlighted === 'active' || highlighted === 'fading') ? 'premium-tile-label--highlighted' : ''}`}
        >
          {concept.name}
        </Text>
        <Text
          size="xs"
          className={`premium-bento-tile__effect ${enabled ? 'premium-bento-tile__effect--on' : 'premium-bento-tile__effect--off'}`}
          role="status"
        >
          {enabled ? concept.effectWhenOn : concept.effectWhenOff}
        </Text>
        <Text size="xs" className="concept-tile-hint">
          Tap — steps + code refs
        </Text>
      </UnstyledButton>
    </BentoTile>
  );
}

interface ConceptControlBentoProps {
  compact?: boolean;
}

export function ConceptControlBento({ compact = false }: ConceptControlBentoProps) {
  const dispatch = useAppDispatch();
  const [performanceOpen, setPerformanceOpen] = useState(false);
  const selectiveSubscriptionEnabled = useConceptEnabled('selectiveSubscription');
  const enabled = useAppSelector(
    (state) => state.conceptControls.enabled,
    selectiveSubscriptionEnabled ? shallowEqual : undefined,
  );

  const enabledCount = Object.values(enabled).filter(Boolean).length;
  const total = CONCEPT_DEFINITIONS.length;
  const healthPercent = Math.round((enabledCount / total) * 100);

  return (
    <>
      <Box className="premium-control-center" aria-label="Control Center">
        <div className="premium-control-center__glow premium-control-center__glow--1" aria-hidden="true" />
        <div className="premium-control-center__glow premium-control-center__glow--2" aria-hidden="true" />

        <div className="premium-control-center__mirror">
          <div className="premium-control-center__head">
            <Text className="premium-control-center__title">Control Center</Text>
            <Text className="premium-control-center__subtitle">
              Toggle switches · tap a card for full explanation
            </Text>
          </div>

          <div className="premium-bento-grid premium-bento-grid--metrics">
            <BentoTile className="premium-bento-tile--hero premium-bento-tile--span-full">
              <div className="premium-bento-hero">
                <div className="premium-bento-hero__logo">MDE</div>
                <div className="premium-bento-hero__stats">
                  <Text className="premium-metric-xl">
                    {enabledCount}
                    <span className="premium-metric-xl__unit">/{total}</span>
                  </Text>
                  <Text className="premium-metric-caption">concepts active</Text>
                  <div className="premium-health-track">
                    <div className="premium-health-fill" style={{ width: `${healthPercent}%` }} />
                  </div>
                </div>
              </div>
            </BentoTile>
          </div>

          <div className={`premium-bento-scroll ${compact ? 'premium-bento-scroll--compact' : ''}`}>
            <div className="premium-bento-grid">
              {CONCEPT_DEFINITIONS.map((concept) => (
                <ConceptTile key={concept.id} concept={concept} />
              ))}
            </div>
          </div>

          <div className="premium-control-center__footer">
            <Group grow gap="sm">
              <Button className="premium-btn premium-btn--on" size="xs" onClick={() => dispatch(enableAllConcepts())}>
                Enable all
              </Button>
              <Button className="premium-btn premium-btn--off" size="xs" onClick={() => dispatch(disableAllConcepts())}>
                Disable all
              </Button>
            </Group>
            <div className="premium-control-center__footer-links">
              <UnstyledButton className="premium-reset-link" onClick={() => dispatch(resetApiCalls())}>
                Reset counters
              </UnstyledButton>
              <UnstyledButton
                className="premium-performance-link"
                onClick={() => setPerformanceOpen(true)}
              >
                Performance
              </UnstyledButton>
            </div>
          </div>
        </div>
      </Box>

      <ConceptDetailModal />
      <PerformanceStatsModal opened={performanceOpen} onClose={() => setPerformanceOpen(false)} />
    </>
  );
}
