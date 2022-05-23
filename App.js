import React, {useState} from 'react';
import {Platform, StatusBar, StyleSheet, View} from 'react-native';
import {Provider} from 'react-redux';
import {store, persistor} from './src/store/configureStore';
import {PersistGate} from 'redux-persist/integration/react';
import AppNavigator from 'src/navigation/AppNavigator';
import LoadingScreen from 'src/screens/LoadingScreen';
import messaging from '@react-native-firebase/messaging';

const registerAppWithFCM = () => {
  return messaging().registerDeviceForRemoteMessages();
};

const App = props => {
  registerAppWithFCM().then(result => {
    console.log('registred with FCM');
  });

  return (
    <Provider store={store}>
      <PersistGate loading={<LoadingScreen />} persistor={persistor}>
        <View style={styles.container}>
          {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
          <AppNavigator />
        </View>
      </PersistGate>
    </Provider>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;
