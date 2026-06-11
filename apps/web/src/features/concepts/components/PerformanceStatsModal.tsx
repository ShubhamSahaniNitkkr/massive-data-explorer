import { Badge, Group, Modal, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { useEffect, useMemo, useState } from 'react';

import { CONCEPT_DEFINITIONS } from '@/features/concepts/constants/concepts';
import { resetApiCalls } from '@/features/concepts/store/conceptControlsSlice';
import { performanceMetrics } from '@/store/api/baseApi';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppDispatch';
import { formatNumber } from '@/shared/utils/format';

interface PerformanceStatsModalProps {
  opened: boolean;
  onClose: () => void;
}

function percentile(values: number[], p: number): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[index] ?? 0;
}

function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="performance-stat-card">
      <Text className="performance-stat-card__label">{label}</Text>
      <Text className="performance-stat-card__value">{value}</Text>
      {hint && (
        <Text size="xs" c="dimmed" mt={4}>
          {hint}
        </Text>
      )}
    </div>
  );
}

export function PerformanceStatsModal({ opened, onClose }: PerformanceStatsModalProps) {
  const dispatch = useAppDispatch();
  const apiCallsThisSession = useAppSelector((state) => state.conceptControls.apiCallsThisSession);
  const renderCount = useAppSelector((state) => state.conceptControls.renderCount);
  const enabled = useAppSelector((state) => state.conceptControls.enabled);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!opened) return;
    const id = window.setInterval(() => setTick((t) => t + 1), 750);
    return () => window.clearInterval(id);
  }, [opened]);

  const enabledCount = Object.values(enabled).filter(Boolean).length;
  const totalConcepts = CONCEPT_DEFINITIONS.length;

  const stats = useMemo(() => {
    void tick;
    const { requestCount, cacheHits, networkRequests, totalLatency, latencies } = performanceMetrics;
    const avgLatency = requestCount > 0 ? totalLatency / requestCount : 0;
    const cacheHitRate = requestCount > 0 ? (cacheHits / requestCount) * 100 : 0;
    const p95 = percentile(latencies, 95);

    return {
      requestCount,
      cacheHits,
      networkRequests,
      avgLatency,
      cacheHitRate,
      p95,
      minLatency: latencies.length > 0 ? Math.min(...latencies) : 0,
      maxLatency: latencies.length > 0 ? Math.max(...latencies) : 0,
    };
  }, [tick]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Performance"
      size="lg"
      radius="lg"
      centered
      classNames={{ content: 'performance-stats-modal' }}
    >
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <div>
            <Title order={4}>Live session statistics</Title>
            <Text size="sm" c="dimmed">
              RTK Query, render, and concept metrics for this tab
            </Text>
          </div>
          <Badge variant="light" color="violet">
            {enabledCount}/{totalConcepts} concepts on
          </Badge>
        </Group>

        <SimpleGrid cols={{ base: 1, xs: 2 }} spacing="sm">
          <StatCard label="Session API calls" value={formatNumber(apiCallsThisSession)} />
          <StatCard label="Table renders" value={formatNumber(renderCount)} />
          <StatCard label="RTK requests" value={formatNumber(stats.requestCount)} />
          <StatCard label="Network requests" value={formatNumber(stats.networkRequests)} />
          <StatCard
            label="Cache hits"
            value={formatNumber(stats.cacheHits)}
            hint={`${stats.cacheHitRate.toFixed(1)}% hit rate`}
          />
          <StatCard
            label="Avg latency"
            value={`${stats.avgLatency.toFixed(1)} ms`}
            hint={`p95 ${stats.p95.toFixed(1)} ms`}
          />
          <StatCard
            label="Min / max latency"
            value={`${stats.minLatency.toFixed(0)} / ${stats.maxLatency.toFixed(0)} ms`}
          />
          <StatCard
            label="Concepts health"
            value={`${Math.round((enabledCount / totalConcepts) * 100)}%`}
            hint={`${enabledCount} of ${totalConcepts} enabled`}
          />
        </SimpleGrid>

        <Group justify="space-between" mt="xs">
          <UnstyledReset onReset={() => dispatch(resetApiCalls())} />
          <Text size="xs" c="dimmed">
            Updates while this dialog is open
          </Text>
        </Group>
      </Stack>
    </Modal>
  );
}

function UnstyledReset({ onReset }: { onReset: () => void }) {
  return (
    <button type="button" className="premium-reset-link premium-reset-link--inline" onClick={onReset}>
      Reset counters
    </button>
  );
}
