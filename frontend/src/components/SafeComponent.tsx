import React, { Component, ReactNode } from 'react';
import { View, Text } from 'react-native';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  componentName?: string;
}

interface State {
  hasError: boolean;
  error?: Error;
}

/**
 * SafeComponent - Wrapper to prevent component crashes
 * 
 * This component wraps other components to catch errors
 * and prevent the entire app from crashing due to
 * displayName or other component-related errors.
 */
class SafeComponent extends Component<Props, State> {
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
    console.error(`SafeComponent (${this.props.componentName || 'Unknown'}) caught an error:`, error);
    
    // Special handling for displayName errors
    if (error.message && error.message.includes('displayName')) {
      console.error('DisplayName error detected in component:', this.props.componentName);
    }
    
    // Log component stack for better debugging
    if (errorInfo && errorInfo.componentStack) {
      console.error('Component stack:', errorInfo.componentStack);
    }
  }

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
            fontSize: 16,
            color: '#666',
            textAlign: 'center',
            marginBottom: 10
          }}>
            Component Error
          </Text>
          
          <Text style={{
            fontSize: 14,
            color: '#999',
            textAlign: 'center'
          }}>
            {this.props.componentName || 'A component'} encountered an error
          </Text>
        </View>
      );
    }

    return this.props.children;
  }
}

// Add displayName for debugging
SafeComponent.displayName = 'SafeComponent';

export default SafeComponent;
