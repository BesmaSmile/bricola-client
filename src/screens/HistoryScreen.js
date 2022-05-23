import React, {useEffect} from 'react';
import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {useRequestState} from 'src/tools/hooks';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getAuth} from 'src/store/reducers/userReducer';
import {getOrders} from 'src/store/reducers/orderReducer';
import orderService from 'src/services/order.service';
import {format} from 'date-fns';
import Empty from 'src/components/Empty';
import colors from 'src/constants/colors';
import sizes from 'src/constants/sizes';
import {useNavigation} from '@react-navigation/native';
import _ from 'lodash';

const Tab = createMaterialTopTabNavigator();

const OrderItem = props => {
  const {order} = props;
  const navigation = useNavigation();

  const openOrderDetails = () => {
    navigation.navigate('OrderDetails', {orderId: order._id});
  };
  return (
    <TouchableOpacity style={styles.item_container} onPress={openOrderDetails}>
      <View style={styles.row_container}>
        <Text style={styles.orderNumber}>Commande N° {order.reference}</Text>
      </View>
      <View style={styles.row_container}>
        <View>
          <Text style={styles.orderDate}>
            {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
          </Text>
          <Text style={styles.orderService}>
            {_.get(order, 'service.name')}
          </Text>
        </View>
        {order.toPay !== undefined && (
          <Text style={styles.orderCost}>{order.toPay} DA</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const OrdersList = props => {
  const {pending, error, orders, loadOrders} = props;
  return (
    <View style={styles.main_container}>
      {error && (
        <View style={styles.centeredAbsoluteContainer}>
          <Text style={styles.resultText}>{props.error}</Text>
        </View>
      )}
      <FlatList
        onRefresh={loadOrders}
        refreshing={pending}
        data={props.orders}
        keyExtractor={item => item._id}
        renderItem={({item}) => <OrderItem order={item} />}
      />
      {orders.length === 0 && !error && !pending && (
        <Empty message="Aucune commande !" />
      )}
    </View>
  );
};

const HistoryScreen = props => {
  const {auth, orders, loadOrders} = props;
  const ordersRequest = useRequestState();
  const ordersList = orders?.map(order => {
    let reduction, toPay;
    if (
      order.status.state === 'finished' ||
      order.status.state === 'not_completed'
    ) {
      reduction = 0;
      const cost = Object.values(order.cost)
        .filter(price => price)
        .reduce((p1, p2) => p1 + p2, 0);
      if (order.promoCode) {
        if (order.promoCode.unity === 'amount') {
          reduction = Math.min(order.promoCode.reduction, cost);
        } else {
          reduction = Math.round((cost * order.promoCode.reduction) / 100);
        }
      }
      toPay = Math.max(0, cost - (reduction || 0));
    }
    return {
      ...order,
      reduction,
      toPay,
    };
  });
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = () => {
    ordersRequest.sendRequest(() => loadOrders(auth));
  };

  const historyTab = () => (
    <OrdersList
      pending={ordersRequest.pending}
      error={ordersRequest.error}
      loadOrders={load}
      orders={ordersList || []}
    />
  );
  const currentOrderTab = () => {
    const currentOrder = ordersList?.find(
      order =>
        order.status.state === 'ongoing' || order.status.state === 'accepted',
    );
    if (!currentOrder) {
      return <Empty message="Aucune commande !" />;
    }
    return (
      <OrdersList
        pending={ordersRequest.pending}
        error={ordersRequest.error}
        loadOrders={load}
        orders={currentOrder ? [currentOrder] : []}
      />
    );
  };

  return (
    <View style={styles.main_container}>
      <Tab.Navigator>
        <Tab.Screen name="En cours" component={currentOrderTab} />
        <Tab.Screen name="Tout" component={historyTab} />
      </Tab.Navigator>
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
  },
  item_container: {
    padding: 15,
    borderBottomWidth: 2,
    borderColor: colors.grey,
  },
  row_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderNumber: {
    fontSize: sizes.defaultTextSize,
    color: colors.blue,
    fontWeight: 'bold',
  },
  orderCost: {
    fontSize: sizes.smallText,
    color: colors.lightblue,
    fontWeight: 'bold',
  },
  orderDate: {
    fontSize: sizes.smallText,
    color: colors.stronggrey,
  },
  orderService: {
    fontSize: sizes.smallText,
    color: colors.stronggrey,
  },
  centeredAbsoluteContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultText: {
    color: colors.stronggrey,
    fontSize: sizes.defaultTextSize,
    marginTop: 10,
  },
});

const mapStateToProps = state => ({
  auth: getAuth(state.user),
  orders: getOrders(state.order),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadOrders: orderService.loadOrders,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HistoryScreen);
