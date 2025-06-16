import React, { Component, ReactNode } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * ErrorBoundary - Catches JavaScript errors in component tree
 * 
 * Features:
 * - Prevents app crashes from unhandled errors
 * - Shows user-friendly error message
 * - Provides retry functionality
 * - Logs errors for debugging
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    // Log the error for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          padding: 20,
          backgroundColor: '#FFFFFF'
        }}>
          <Text style={{
            fontSize: 24,
            fontWeight: 'bold',
            color: '#333',
            marginBottom: 10,
            textAlign: 'center'
          }}>
            Oops! Something went wrong
          </Text>
          
          <Text style={{
            fontSize: 16,
            color: '#666',
            textAlign: 'center',
            marginBottom: 20,
            lineHeight: 24
          }}>
            We encountered an unexpected error. Please try again.
          </Text>

          <TouchableOpacity
            onPress={this.handleRetry}
            style={{
              backgroundColor: '#007AFF',
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8,
              marginBottom: 10
            }}
          >
            <Text style={{
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: '600'
            }}>
              Try Again
            </Text>
          </TouchableOpacity>

          {__DEV__ && this.state.error && (
            <View style={{
              marginTop: 20,
              padding: 15,
              backgroundColor: '#F5F5F5',
              borderRadius: 8,
              maxWidth: '100%'
            }}>
              <Text style={{
                fontSize: 12,
                color: '#666',
                fontFamily: 'monospace'
              }}>
                {this.state.error.toString()}
              </Text>
            </View>
          )}
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
