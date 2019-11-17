import React from 'react';
import { Snackbar } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    console.log('getDerivedStateFromError');
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log('componentDidCatch');
    // You can also log the error to an error reporting service
    console.log(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

export const withErrorHandling = (Component) => {
  return () => {
    return <ErrorBoundary>
      <Component/>
    </ErrorBoundary>;
  };
};
