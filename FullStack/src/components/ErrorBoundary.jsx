import React from 'react';
import { AlertCircle } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 text-white p-4">
          <div className="bg-neutral-800 p-8 rounded-2xl shadow-xl border border-neutral-700 max-w-md w-full text-center">
            <AlertCircle className="w-16 h-16 text-error-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-error-400 mb-2">Oops! Terjadi Kesalahan</h1>
            <p className="text-neutral-400 mb-6">
              Maaf, aplikasi mengalami masalah yang tidak terduga. Silakan muat ulang halaman ini.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors w-full"
            >
              Muat Ulang Halaman
            </button>
            {process.env.NODE_ENV !== 'production' && (
              <div className="mt-6 text-left bg-neutral-900 p-4 rounded-lg overflow-x-auto text-sm text-error-300">
                <pre>{this.state.error?.toString()}</pre>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
