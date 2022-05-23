import React from 'react';
import HomeScreen from 'src/screens/HomeScreen';
import ServicesScreen from 'src/screens/ServicesScreen';
import BricolaLogo from 'src/components/BricolaLogo';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

function HomeStack() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Services" component={ServicesScreen} />
    </Stack.Navigator>
  );
}

export default HomeStack;
