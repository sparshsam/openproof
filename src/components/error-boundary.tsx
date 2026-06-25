"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import { ShieldQuestion } from "lucide-react";

type Props = {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
};

type State = {
  hasError: boolean;
  error: Error | null;
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="mx-auto max-w-xl px-6 py-20 text-center">
          <div className="flex flex-col items-center gap-6">
            <ShieldQuestion className="size-16 text-error shrink-0" />
            <div>
              <h1 className="text-3xl font-black sm:text-4xl">Something went wrong</h1>
              <p className="mt-3 text-base text-text-secondary">
                OpenProof encountered an unexpected error. The page needs to reload.
              </p>
              {this.state.error && (
                <p className="mt-4 font-mono text-xs text-text-muted break-all">
                  {this.state.error.message}
                </p>
              )}
            </div>
            <button
              className="rounded-full bg-accent px-8 py-4 text-sm font-semibold text-white transition-all hover:bg-[#0099ee] cursor-pointer"
              onClick={() => window.location.reload()}
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
