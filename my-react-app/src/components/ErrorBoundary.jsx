import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Error aate hi state update hogi
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // Error aur info ko console me dekh sakte ho
    console.error("ErrorBoundary caught an error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      // Error aane par ye render hoga
      return (
        <div className="p-10 text-center bg-red-100 rounded">
          <h2 className="text-red-600 text-xl font-bold">
            Something went wrong in this component.
          </h2>
        </div>
      );
    }

    // Normal render
    return this.props.children;
  }
}

export default ErrorBoundary;
