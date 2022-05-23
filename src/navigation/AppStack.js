import React, {useEffect} from 'react';
import {Text} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import MainTabNavigator from './MainTabNavigator';
import OrderScreen from 'src/screens/OrderScreen';
import ServiceDetailsScreen from 'src/screens/ServiceDetailsScreen';
import OrderDetailsScreen from 'src/screens/OrderDetailsScreen';
import Loading from 'src/components/Loading';
import BricolaLogo from 'src/components/BricolaLogo';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getAuth, getUser} from '../store/reducers/userReducer';
import userService from 'src/services/user.service';
import {useRequestState} from 'src/tools/hooks';

const Stack = createStackNavigator();

function AppStack(props) {
  const userRequest = useRequestState();

  useEffect(() => {
    if (props.auth) {
      userRequest.sendRequest(() => props.getInfos(props.auth));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.auth]);

  useEffect(() => {
    if (props.user?.status?.state === 'disabled') {
      props.signOut();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.user]);

  return (
    <>
      {userRequest.pending && <Loading />}
      {props.user && !userRequest.pending && (
        <Stack.Navigator
          initialRouteName="Tab"
          screenOptions={{
            headerShown: true,
            headerTitle: props => <BricolaLogo />,
          }}>
          <Stack.Screen name="Tab" component={MainTabNavigator} />
          <Stack.Screen name="Order" component={OrderScreen} />
          <Stack.Screen
            options={{
              headerTitle: props => <Text>Commande</Text>,
            }}
            name="OrderDetails"
            component={OrderDetailsScreen}
          />
          <Stack.Screen
            name="ServiceDetails"
            component={ServiceDetailsScreen}
          />
        </Stack.Navigator>
      )}
    </>
  );
}

const mapStateToProps = state => ({
  auth: getAuth(state.user),
  user: getUser(state.user),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getInfos: userService.getInfos,
      signOut: userService.signOut,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppStack);
