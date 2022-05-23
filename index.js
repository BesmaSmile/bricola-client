/**
 * @format
 */
import React from 'react';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-gesture-handler';
import messaging from '@react-native-firebase/messaging';
import {EventRegister} from 'react-native-event-listeners';

messaging().setBackgroundMessageHandler(remoteMessage => {
  notificationActionHandler(remoteMessage);
});

const notificationActionHandler = async remoteMessage => {
  if (
    ['rating_request', 'partner_response', 'partner_price_suggestion'].some(
      type => type === remoteMessage.data.type,
    )
  ) {
    setTimeout(() => {
      EventRegister.emit(
        remoteMessage.data.type,
        JSON.parse(remoteMessage.data.content),
      );
    }, 5000);
  }
};

AppRegistry.registerHeadlessTask(
  'ReactNativeFirebaseMessagingHeadlessTask',
  () => notificationActionHandler,
);

AppRegistry.registerComponent(appName, () => App);
