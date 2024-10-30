import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-gradient-to-b from-indigo-900 to-purple-900 flex items-center justify-center">
          <div className="bg-white/10 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">Bir şeyler yanlış gitti</h2>
            <p className="text-purple-200">Lütfen sayfayı yenileyin veya daha sonra tekrar deneyin.</p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}