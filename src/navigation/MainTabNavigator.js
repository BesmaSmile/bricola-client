import React, {useEffect, useState} from 'react';
import {StyleSheet, Alert} from 'react-native';

import HomeStack from './HomeStack';
import FavoriteStack from './FavoriteStack';
import HistoryScreen from 'src/screens/HistoryScreen';
import TabBarIcon from 'src/components/TabBarIcon';
import RatingModal from 'src/components/RatingModal';
import PriceSuggestionModal from 'src/components/PriceSuggestionModal';
import PartnerResponseModal from 'src/components/PartnerResponseModal';
import colors from 'src/constants/colors';
import userService from 'src/services/user.service';
import {getAuth} from 'src/store/reducers/userReducer';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import orderService from 'src/services/order.service';
import NotificationService from 'src/services/notification.service';

import {EventRegister} from 'react-native-event-listeners';
import messaging from '@react-native-firebase/messaging';

const Tab = createMaterialBottomTabNavigator();

const MainTabNavigator = props => {
  const [ratingModal, setRatingModal] = useState({open: false});
  const [partnerResponseModal, setPartnerResponseModal] = useState({
    open: false,
  });

  const [priceSuggestionModal, setPriceSuggestionModal] = useState({
    open: false,
  });

  const onNotif = notif => {
    Alert.alert(notif.title, notif.message);
  };

  const notif = new NotificationService(() => {}, onNotif);

  useEffect(() => {
    if (props.auth) {
      const unsubscribe = userService.storeToken(props.auth);
      return unsubscribe;
    }
  }, [props.auth]);
  useEffect(() => {
    requestNotifPermissions();
    notif.createOrUpdateChannel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestNotifPermissions = async () => {
    await notif.requestPermissions();
  };

  useEffect(() => {
    EventRegister.on('rating_request', ratingRequest => {
      setRatingModal({open: true, content: ratingRequest});
    });
    EventRegister.on('partner_price_suggestion', content => {
      setPriceSuggestionModal({open: true, content});
    });
    EventRegister.on('partner_response', content => {
      setPartnerResponseModal({open: true, response: content});
    });
  });
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(
        'A new FCM message arrived!',
        JSON.parse(remoteMessage.data.content),
      );
      if (
        ['partner_response', 'partner_price_suggestion', 'rating_request'].some(
          type => type === remoteMessage.data.type,
        )
      ) {
        const notification = remoteMessage.notification;
        notif.localNotif({
          title: notification.title,
          message: notification.body,
          largeIconUrl: notification.android.imageUrl,
        });
        props.loadOrders(props.auth);
      }
      const content = JSON.parse(remoteMessage.data.content);
      switch (remoteMessage.data.type) {
        case 'rating_request':
          setRatingModal({
            open: true,
            content,
          });
          break;
        case 'partner_price_suggestion':
          setPriceSuggestionModal({open: true, content});
          break;
        case 'partner_response':
          setPartnerResponseModal({
            open: true,
            response: JSON.parse(remoteMessage.data.content),
          });
          break;
      }
    });
    return unsubscribe;
  });

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (
          remoteMessage &&
          [
            'rating_request',
            'partner_response',
            'partner_price_suggestion',
          ].some(type => type === remoteMessage.data.type)
        ) {
          setTimeout(() => {
            EventRegister.emit(
              remoteMessage.data.type,
              JSON.parse(remoteMessage.data.content),
            );
          }, 3000);
        }
      });
  });

  const closeRatingModal = () => {
    setRatingModal({open: false});
  };

  const closePriceSuggestionModal = () => {
    setPriceSuggestionModal({open: false});
  };

  const handleOkClick = () => {
    setPartnerResponseModal({open: false});
    props.loadOrders(props.auth);
    props.navigation.navigate('History');
  };

  return (
    <>
      {ratingModal.open && (
        <RatingModal
          order={ratingModal.content.order}
          close={closeRatingModal}
        />
      )}
      {partnerResponseModal.open && (
        <PartnerResponseModal
          response={partnerResponseModal.response}
          handleOkClick={handleOkClick}
        />
      )}
      {priceSuggestionModal.open && (
        <PriceSuggestionModal
          suggestion={priceSuggestionModal.content}
          close={closePriceSuggestionModal}
        />
      )}
      <Tab.Navigator
        barStyle={styles.bar}
        activeColor={colors.darkColor}
        inactiveColor={colors.disabledColor}>
        <Tab.Screen
          name="Home"
          options={{
            tabBarLabel: 'Accueil',
            tabBarIcon: ({color}) => <TabBarIcon name="home" color={color} />,
          }}
          component={HomeStack}
        />
        <Tab.Screen
          name="History"
          options={{
            tabBarLabel: 'Historique',
            tabBarIcon: ({color}) => <TabBarIcon name="clock" color={color} />,
          }}
          component={HistoryScreen}
        />
        <Tab.Screen
          name="Favorite"
          options={{
            tabBarLabel: 'Favoris',
            tabBarIcon: ({color}) => (
              <TabBarIcon name="bookmark" color={color} />
            ),
          }}
          component={FavoriteStack}
        />
      </Tab.Navigator>
    </>
  );
};

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#eee',
  },
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadOrders: orderService.loadOrders,
    },
    dispatch,
  );

const mapStateToProps = state => ({
  auth: getAuth(state.user),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainTabNavigator);
