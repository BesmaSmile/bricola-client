import React from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {connect} from 'react-redux';

import AppStack from './AppStack';
import AuthStack from './AuthStack';

import {getAuth} from 'src/store/reducers/userReducer';

const Stack = createStackNavigator();

function AppNavigator(props) {
  const {auth} = props;
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {auth ? (
          <Stack.Screen name="App" component={AppStack} />
        ) : (
          <Stack.Screen name="Auth" component={AuthStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const mapStateToProps = state => ({
  auth: getAuth(state.user),
});

export default connect(mapStateToProps)(AppNavigator);
