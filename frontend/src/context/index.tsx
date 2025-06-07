import React, { ReactNode } from 'react';
import { AuthProvider } from './AuthContext';
import { GlucoseProvider } from './GlucoseContext';
import { AppProvider } from './AppContext';

/**
 * Context Providers Index - Combines all context providers
 * 
 * This file provides a single wrapper component that includes all
 * context providers in the correct order. This ensures proper
 * dependency management and clean app setup.
 * 
 * Provider hierarchy:
 * 1. AppProvider - App-wide settings and preferences
 * 2. AuthProvider - Authentication state
 * 3. GlucoseProvider - Glucose data management
 * 
 * Usage in App.tsx:
 * <ContextProviders>
 *   <AppNavigation />
 * </ContextProviders>
 */

interface ContextProvidersProps {
  children: ReactNode;
}

export function ContextProviders({ children }: ContextProvidersProps) {
  return (
    <AppProvider>
      <AuthProvider>
        <GlucoseProvider>
          {children}
        </GlucoseProvider>
      </AuthProvider>
    </AppProvider>
  );
}

// Export individual providers for specific use cases
export { AuthProvider, useAuth } from './AuthContext';
export { GlucoseProvider, useGlucose } from './GlucoseContext';
export { AppProvider, useApp } from './AppContext';
