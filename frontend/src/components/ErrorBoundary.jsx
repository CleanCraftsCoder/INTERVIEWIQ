import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-4xl mx-auto py-24 px-6 text-center">
          <h2 className="text-2xl font-semibold text-red-700 dark:text-red-300 mb-4">
            Something went wrong while uploading your resume.
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please try again or refresh the page. If the error persists, contact support.
          </p>
          <pre className="text-xs text-left whitespace-pre-wrap bg-gray-100 dark:bg-gray-800 rounded-lg p-4 overflow-x-auto text-red-600 dark:text-red-300">
            {this.state.error?.toString()}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
