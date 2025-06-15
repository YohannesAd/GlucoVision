import "./global.css";
import React from 'react';
import { AuthProvider } from './src/context/AuthContext';
import { UserProvider } from './src/context/UserContext';
import { GlucoseProvider } from './src/context/GlucoseContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <AuthProvider>
      <UserProvider>
        <GlucoseProvider>
          <RootNavigator />
        </GlucoseProvider>
      </UserProvider>
    </AuthProvider>
  );
}
