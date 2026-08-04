import { Component } from "react";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // ✅ Auto-reload on chunk load failures — happens after every new deploy
    // when the browser has old JS chunk URLs cached from previous version.
    const isChunkError =
      error?.message?.includes("Failed to fetch dynamically imported module") ||
      error?.message?.includes("Importing a module script failed") ||
      error?.message?.includes("Unable to preload CSS");

    if (isChunkError) {
      window.location.reload();
      return;
    }

    console.error("App error caught by ErrorBoundary:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
          <div className="bg-gray-800 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl border border-gray-700">
            <p className="text-5xl mb-4">⚠️</p>
            <h1 className="text-2xl font-bold text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              An unexpected error occurred. Your data is safe — this is just a
              display issue.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors"
              >
                Reload app
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = "/";
                }}
                className="bg-gray-600 hover:bg-gray-500 text-white px-6 py-2.5 rounded-xl font-semibold transition-colors"
              >
                Go home
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="text-xs text-gray-500 cursor-pointer">
                  Error details (dev only)
                </summary>
                <pre className="text-xs text-red-400 mt-2 overflow-auto max-h-40 bg-gray-900 p-3 rounded-lg">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
