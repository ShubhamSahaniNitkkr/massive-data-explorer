import { Alert, Button, Stack, Text } from '@mantine/core';
import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
  children: ReactNode;
  featureName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class FeatureErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo): void {
    // Feature-level boundary — root boundary still available for uncaught errors.
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      return (
        <Alert color="red" title={`${this.props.featureName ?? 'Feature'} error`} role="alert">
          <Stack gap="sm">
            <Text size="sm">
              This section failed without taking down the whole app. The error boundary kept the
              control panel and header usable.
            </Text>
            <Text size="xs" c="dimmed">
              {this.state.error.message}
            </Text>
            <Button size="xs" variant="light" onClick={this.handleReset}>
              Try again
            </Button>
          </Stack>
        </Alert>
      );
    }

    return this.props.children;
  }
}
