/**
 * React Native App with Atomic Design Architecture
 *
 * @format
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { store } from '@store';
import { AppNavigator } from '@navigation';

function App(): React.JSX.Element {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StatusBar barStyle="light-content" backgroundColor="#007AFF" />
        <AppNavigator />
      </SafeAreaProvider>
    </Provider>
  );
}

export default App;
