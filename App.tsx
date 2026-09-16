import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { RootNavigator } from './src/navigation/RootNavigator';
import { WebContainer } from './src/components/common/WebContainer';
import { SosModal } from './src/components/common/SosModal';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <WebContainer>
          <StatusBar style="auto" />
          <RootNavigator />
          <SosModal />
        </WebContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}
