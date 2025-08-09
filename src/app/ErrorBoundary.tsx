"use client";

import React from "react";
import Link from "next/link";

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
        <section className="pt-[100px] pb-[120px]">
          <div className="container">
            <div className="-mx-4 flex flex-wrap justify-center">
              <div className="w-full px-4 lg:w-10/12">
                <div>
                  <h2 className="mb-8 text-center text-3xl leading-tight font-bold text-black sm:text-4xl sm:leading-tight dark:text-white">
                    Oops, there is an error!
                  </h2>
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
                  {this.state.errorInfo && (
                    <>
                      <p className="text-black dark:text-white">Error Stack:</p>
                      <pre className="whitespace-pre-wrap text-black dark:text-white">
                        {this.state.error?.stack}
                      </pre>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
