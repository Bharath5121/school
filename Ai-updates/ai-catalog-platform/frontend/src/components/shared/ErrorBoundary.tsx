'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '../ui/Card';
import { logger } from '@/lib/logger';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    logger.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <Card className="m-4 border-red-500/50 bg-red-500/10">
          <h2 className="text-red-400 font-heading text-xl mb-2">Something went wrong</h2>
          <p className="text-black/70 dark:text-white/70 text-sm">{this.state.error?.message}</p>
        </Card>
      );
    }

    return this.props.children;
  }
}
