"use client";

import React from "react";
import Link from "next/link";
import PageSection from "@/components/PageSection";

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error | null;
  errorInfo?: React.ErrorInfo | null;
}

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (error.message.includes("Loading chunk")) {
      window.location.reload();
      return;
    }
    this.setState({ hasError: true, error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <PageSection title="Oops, there is an error!">
          <p className="mb-8 text-center text-lg font-normal text-black dark:text-white">
            Please report this issue on{" "}
            <Link href="https://github.com/nbwzx/blddb/issues/new">
              <span className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                GitHub
              </span>
            </Link>
            , thank you!
          </p>
          <p className="text-black dark:text-white">
            Current URL: {window.location.href}
          </p>
          <p className="text-black dark:text-white">
            User-Agent: {navigator.userAgent}
          </p>
          <p className="text-black dark:text-white">
            Error Message: {this.state.error?.message}
          </p>
          <p className="text-black dark:text-white">
            Local Storage Data: {JSON.stringify(localStorage, null, 2)}
          </p>
          {this.state.errorInfo && (
            <>
              <p className="text-black dark:text-white">Error Stack:</p>
              <pre className="whitespace-pre-wrap text-black dark:text-white">
                {this.state.error?.stack}
              </pre>
            </>
          )}
        </PageSection>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
