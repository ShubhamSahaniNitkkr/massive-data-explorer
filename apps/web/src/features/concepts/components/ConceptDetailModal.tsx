import {
  Badge,
  Button,
  Code,
  Group,
  Modal,
  Stack,
  Switch,
  Text,
  Title,
} from '@mantine/core';

import {
  closeConceptDetail,
  setConceptEnabled,
} from '@/features/concepts/store/conceptControlsSlice';
import { useAppDispatch, useAppSelector } from '@/shared/hooks/useAppDispatch';

import { CONCEPT_IMPLEMENTATION_GUIDE } from '../constants/conceptImplementationGuide';
import { CONCEPT_DEFINITIONS, type ConceptDefinition } from '../constants/concepts';
import { useConceptEnabled } from '../hooks/useConceptEnabled';

const CATEGORY_COLORS: Record<string, string> = {
  Performance: 'blue',
  Network: 'teal',
  Architecture: 'violet',
  Browser: 'orange',
};

function ConceptDetailBody({ concept }: { concept: ConceptDefinition }) {
  const dispatch = useAppDispatch();
  const enabled = useConceptEnabled(concept.id);
  const guide = CONCEPT_IMPLEMENTATION_GUIDE[concept.id];

  return (
    <Stack gap="md">
      <Group justify="space-between" align="flex-start" wrap="nowrap">
        <Stack gap={6}>
          <Group gap="sm">
            <Title order={3}>{concept.name}</Title>
            <Badge variant="light" color={CATEGORY_COLORS[concept.category]}>
              {concept.category}
            </Badge>
          </Group>
          <Text size="sm" c="dimmed">
            {concept.shortDescription}
          </Text>
        </Stack>
        <Switch
          size="md"
          checked={enabled}
          onChange={(e) =>
            dispatch(setConceptEnabled({ id: concept.id, enabled: e.currentTarget.checked }))
          }
          aria-label={`${enabled ? 'Disable' : 'Enable'} ${concept.name}`}
          label={enabled ? 'On' : 'Off'}
        />
      </Group>

      <div className="concept-detail concept-detail--benefit">
        <Text size="xs" fw={700} tt="uppercase" c="teal" mb={4}>
          What it is
        </Text>
        <Text size="sm">{concept.whatItIs}</Text>
      </div>

      <div className="concept-detail concept-detail--steps">
        <Text size="xs" fw={700} tt="uppercase" c="violet" mb={8}>
          How to trigger
        </Text>
        <ol className="concept-detail-steps">
          {concept.triggerSteps.map((step) => (
            <li key={step}>
              <Text size="sm">{step}</Text>
            </li>
          ))}
        </ol>
      </div>

      <div className="concept-detail concept-detail--implement">
        <Text size="xs" fw={700} tt="uppercase" c="indigo" mb={8}>
          Simplest implementation
        </Text>
        <Code block className="concept-detail-code">
          {guide.simplestImplementation}
        </Code>
      </div>

      <div className="concept-detail concept-detail--refs">
        <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb={8}>
          In this codebase
        </Text>
        <Stack gap={8}>
          {guide.codeReferences.map((ref) => (
            <div key={`${ref.path}-${ref.lines}`} className="concept-code-ref">
              <Text size="sm" fw={600} className="concept-code-ref__path">
                {ref.path}
              </Text>
              <Text size="xs" c="violet" className="concept-code-ref__lines">
                Lines {ref.lines}
              </Text>
              <Text size="xs" c="dimmed">
                {ref.note}
              </Text>
            </div>
          ))}
        </Stack>
      </div>

      <div className="concept-detail concept-detail--benefit">
        <Text size="xs" fw={700} tt="uppercase" c="teal" mb={4}>
          With this concept
        </Text>
        <Text size="sm">{concept.benefit}</Text>
      </div>

      <div className="concept-detail concept-detail--risk">
        <Text size="xs" fw={700} tt="uppercase" c="red" mb={4}>
          Without this concept
        </Text>
        <Text size="sm">{concept.withoutIt}</Text>
      </div>

      <div>
        <Text size="xs" fw={700} tt="uppercase" c="dimmed" mb={6}>
          Used in
        </Text>
        <Group gap={6}>
          {concept.usedIn.map((loc) => (
            <Badge key={loc} size="sm" variant="dot">
              {loc}
            </Badge>
          ))}
        </Group>
      </div>

      <Text size="sm" c="dimmed" fs="italic">
        Tip: {concept.tryIt}
      </Text>

      <Text size="sm" role="status">
        <strong>Right now:</strong>{' '}
        {enabled ? concept.effectWhenOn : concept.effectWhenOff}
      </Text>
    </Stack>
  );
}

export function ConceptDetailModal() {
  const dispatch = useAppDispatch();
  const selectedId = useAppSelector((state) => state.conceptControls.selectedConceptId);
  const concept = CONCEPT_DEFINITIONS.find((c) => c.id === selectedId);

  return (
    <Modal
      opened={!!concept}
      onClose={() => dispatch(closeConceptDetail())}
      title={concept ? concept.name : 'Concept'}
      size="lg"
      radius="lg"
      centered
      classNames={{ content: 'concept-detail-modal', body: 'concept-detail-modal__body' }}
    >
      {concept && <ConceptDetailBody concept={concept} />}
      <Group justify="flex-end" mt="lg">
        <Button variant="light" onClick={() => dispatch(closeConceptDetail())}>
          Close
        </Button>
      </Group>
    </Modal>
  );
}
