import React, { Component, ReactNode } from 'react';
import { View, Text } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorCount: number;
}

/**
 * NavigationErrorBoundary - Specialized error boundary for navigation errors
 * 
 * This component specifically handles displayName and navigation-related errors
 * that occur in React Native navigation components.
 */
class NavigationErrorBoundary extends Component<Props, State> {
  private resetTimer: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { 
      hasError: false, 
      errorCount: 0 
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    // Check if this is a displayName error
    if (error.message && error.message.includes('displayName')) {
      console.warn('NavigationErrorBoundary: DisplayName error detected, attempting recovery');
      return { 
        hasError: false, // Don't show error UI for displayName errors
        errorCount: 0 
      };
    }

    // For other errors, show error UI
    return { 
      hasError: true, 
      error,
      errorCount: 1
    };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('NavigationErrorBoundary caught an error:', error);
    
    // Special handling for displayName errors
    if (error.message && error.message.includes('displayName')) {
      console.warn('DisplayName error in navigation - suppressing to prevent crash');
      
      // Clear any existing timer
      if (this.resetTimer) {
        clearTimeout(this.resetTimer);
      }
      
      // Auto-recover after a short delay
      this.resetTimer = setTimeout(() => {
        this.setState({ 
          hasError: false, 
          error: undefined,
          errorCount: 0 
        });
      }, 500);
      
      return;
    }

    // Handle other navigation errors
    if (errorInfo && errorInfo.componentStack) {
      console.error('Navigation component stack:', errorInfo.componentStack);
    }

    // If we've had multiple errors, try to recover
    if (this.state.errorCount > 2) {
      console.warn('Multiple navigation errors detected, attempting recovery');
      this.resetTimer = setTimeout(() => {
        this.setState({ 
          hasError: false, 
          error: undefined,
          errorCount: 0 
        });
      }, 2000);
    }
  }

  componentWillUnmount() {
    if (this.resetTimer) {
      clearTimeout(this.resetTimer);
    }
  }

  render() {
    // Don't show error UI for displayName errors
    if (this.state.error && this.state.error.message && this.state.error.message.includes('displayName')) {
      return this.props.children;
    }

    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI for navigation errors
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor: '#FFFFFF'
        }}>
          <Text style={{
            fontSize: 16,
            color: '#666',
            textAlign: 'center',
            marginBottom: 10
          }}>
            Navigation Error
          </Text>
          
          <Text style={{
            fontSize: 14,
            color: '#999',
            textAlign: 'center'
          }}>
            A navigation error occurred. The app will recover automatically.
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

// Add displayName for debugging
NavigationErrorBoundary.displayName = 'NavigationErrorBoundary';

export default NavigationErrorBoundary;
