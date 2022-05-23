import React from 'react';
import FavoriteScreen from 'src/screens/FavoriteScreen';
import BricolaLogo from 'src/components/BricolaLogo';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

function FavoriteStack() {
  return (
    <Stack.Navigator
      initialRouteName="Favorite"
      screenOptions={{headerShown: false}}>
      <Stack.Screen name="Favorite" component={FavoriteScreen} />
    </Stack.Navigator>
  );
}

export default FavoriteStack;
