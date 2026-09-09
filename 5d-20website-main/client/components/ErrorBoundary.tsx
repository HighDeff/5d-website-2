import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
  retryCount: number;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      retryCount: 0
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      retryCount: 0
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Log to external service if available
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.message,
        fatal: true
      });
    }
  }

  handleRetry = () => {
    this.setState(prevState => ({
      hasError: false,
      error: undefined,
      errorInfo: undefined,
      retryCount: prevState.retryCount + 1
    }));
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
          <Card className="w-full max-w-2xl bg-slate-800 border-slate-700">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-red-400">
                <AlertTriangle className="h-6 w-6" />
                Something went wrong
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-slate-300">
                <p className="mb-4">
                  We apologize for the inconvenience. An unexpected error occurred while loading this component.
                </p>
                
                {this.state.error && (
                  <div className="bg-slate-900 border border-slate-600 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-red-400 mb-2">Error Details:</h4>
                    <p className="text-sm text-slate-400 font-mono break-all">
                      {this.state.error.message}
                    </p>
                    
                    {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
                      <details className="mt-4">
                        <summary className="cursor-pointer text-sm text-slate-500 hover:text-slate-400">
                          Stack Trace (Development)
                        </summary>
                        <pre className="mt-2 text-xs text-slate-500 overflow-auto max-h-48">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </details>
                    )}
                  </div>
                )}

                <div className="text-sm text-slate-400">
                  <h4 className="font-semibold mb-2">What you can try:</h4>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Refresh the page or try again</li>
                    <li>Check your internet connection</li>
                    <li>Clear your browser cache and cookies</li>
                    <li>Try accessing the page from a different browser</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={this.handleRetry}
                  className="flex items-center gap-2"
                  variant="default"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                  {this.state.retryCount > 0 && (
                    <span className="text-xs opacity-75">
                      (Attempt {this.state.retryCount + 1})
                    </span>
                  )}
                </Button>
                
                <Button
                  onClick={this.handleGoHome}
                  variant="outline"
                  className="flex items-center gap-2 bg-slate-700 border-slate-600 text-white"
                >
                  <Home className="h-4 w-4" />
                  Go to Homepage
                </Button>
              </div>

              {this.state.retryCount >= 3 && (
                <div className="p-4 bg-orange-900/20 border border-orange-600/30 rounded-lg">
                  <p className="text-orange-300 text-sm">
                    <strong>Persistent Issue:</strong> If the problem continues after multiple attempts, 
                    please contact support or try accessing the site later.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
