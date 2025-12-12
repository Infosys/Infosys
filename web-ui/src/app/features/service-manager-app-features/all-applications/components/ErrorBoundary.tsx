
// ErrorBoundary is a React class component that catches JavaScript errors in its child component tree
// and displays a fallback UI instead of crashing the whole app.
import React, { Component, type ReactNode } from 'react';
import { Box, Typography, Button } from '@mui/material';


// Props for ErrorBoundary:
// - children: React nodes to render inside the boundary
// - fallback: Optional custom fallback UI to display on error
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}


// State for ErrorBoundary:
// - hasError: Whether an error has been caught
// - error: The error object, if any
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}


// ErrorBoundary class component implementation
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    // Initialize state
    this.state = { 
      hasError: false,
      error: null 
    };
  }


  // Update state so the next render will show the fallback UI
  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { 
      hasError: true,
      error 
    };
  }


  // Log error details for debugging or reporting
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Error caught by ErrorBoundary:', error);
    console.error('Component Stack:', info.componentStack);
    // Optional: Log to an error reporting service
    // logErrorToMyService(error, info.componentStack);
  }


  // Reset error state to allow retrying rendering
  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };


  render() {
    if (this.state.hasError) {
      // Render custom fallback UI if provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI for errors
      return (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 3,
            backgroundColor: '#FFF3CD',
            borderRadius: 2,
            border: '1px solid #FFE69C',
          }}
        >
          <Typography variant="h6" sx={{ color: '#664D03', mb: 1 }}>
            Something went wrong
          </Typography>
          <Typography variant="body2" sx={{ color: '#664D03', mb: 2 }}>
            {this.state.error?.message || 'An unexpected error occurred'}
          </Typography>
          <Button
            variant="contained"
            onClick={this.handleReset}
            sx={{
              backgroundColor: '#C84C0E',
              '&:hover': { backgroundColor: '#A03C0A' },
            }}
          >
            Try Again
          </Button>
        </Box>
      );
    }

    // Render children if no error
    return this.props.children;
  }
}

export default ErrorBoundary;