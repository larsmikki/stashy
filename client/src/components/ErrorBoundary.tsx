import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-bg text-text px-4">
          <div
            className="max-w-md text-center p-8 rounded-2xl"
            style={{ background: 'var(--theme-surface)', border: '1px solid var(--theme-border)', boxShadow: 'var(--shadow-card)' }}
          >
            <h1 className="text-2xl font-extrabold tracking-tight text-text mb-2">Something went wrong</h1>
            <p className="text-sm text-text2 mb-6">
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false, error: null });
                window.location.href = '/';
              }}
              className="inline-flex h-9 items-center justify-center rounded-lg px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ background: 'var(--brand-gradient)' }}
            >
              Go home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
