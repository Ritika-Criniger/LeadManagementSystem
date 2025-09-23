import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/app/navigation/AppNavigator';
import { UserProvider } from './src/context/UserContext.jsx';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App = () => {
  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" translucent={false} />
      <SafeAreaProvider>
        <UserProvider>
          <AppNavigator />
        </UserProvider>
      </SafeAreaProvider>
    </>
  );
};

export default App;