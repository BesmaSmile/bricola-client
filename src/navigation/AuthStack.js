import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SignInScreen from 'src/screens/SignInScreen';
import SignUpScreen from 'src/screens/SignUpScreen';
import CodeValidationScreen from 'src/screens/CodeValidationScreen';
import CompleteInformationsScreen from 'src/screens/CompleteInformationsScreen';

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator
      initialRouteName="SignIn"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="CodeValidation" component={CodeValidationScreen} />
      <Stack.Screen
        name="CompleteInformations"
        component={CompleteInformationsScreen}
      />
    </Stack.Navigator>
  );
}

export default AuthStack;
