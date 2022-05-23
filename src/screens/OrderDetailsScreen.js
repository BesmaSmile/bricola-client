import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import colors from 'src/constants/colors';
import sizes from 'src/constants/sizes';
import Icon from 'src/components/Icon';
// import Loading from 'src/components/Loading';
// import Toast from 'react-native-tiny-toast';
import {connect} from 'react-redux';
// import {bindActionCreators} from 'redux';
import {getOrders} from 'src/store/reducers/orderReducer';
import {getAuth} from 'src/store/reducers/userReducer';
import {format} from 'date-fns';
import {formatPhone} from 'src/helpers/handlePhoneNumber';
// import {useRequestState} from 'src/tools/hooks';
// import orderService from 'src/services/order.service';
import _ from 'lodash';

const OrderDetailsScreen = props => {
  const {orderId} = props.route.params;
  const order = props.orders.find(ord => ord._id === orderId) ?? {};
  const orderStatus = {
    finished: 'Terminée',
    pending: 'En attente',
    accepted: 'Acceptée',
    ongoing: 'En cours',
    not_satisfied: 'Non satisfaite',
    canceled: 'Annulée',
    not_completed: 'Non complétée',
    expired: 'Expirée',
  };

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
  // const orderRequest = useRequestState();

  /* const handleCancel = () => {
    orderRequest.sendRequest(
      () => props.cancelOrder(props.auth, order._id),
      () =>
        Toast.show('La commande a été annulée', {
          animationDuration: 1000,
        }),
      error =>
        Toast.show(error, {
          animationDuration: 1000,
        }),
    );
  }; */
  const status =
    order.expireAt && new Date(order.expireAt) <= new Date()
      ? 'expired'
      : order.status.state;

  return (
    <View style={styles.main}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.borderedContainer, styles.statusContainer]}>
          <Text style={styles.text}>Statut</Text>
          <Text style={styles.statusText}>{orderStatus[status]}</Text>
        </View>
        <View style={[styles.borderedContainer, styles.positionContainer]}>
          <Icon
            viewBox="0 0 25 25"
            width="25px"
            height="25px"
            name="maps"
            fill={colors.position}
          />
          <Text style={styles.text}>
            {order.position.name} {order.position.province}
          </Text>
        </View>
        {order.destination && (
          <View style={[styles.borderedContainer, styles.positionContainer]}>
            <Icon
              viewBox="0 0 25 25"
              width="25px"
              height="25px"
              name="maps"
              fill={colors.destination}
            />
            <Text style={styles.text}>
              {order.destination.name} {order.destination.province}
            </Text>
          </View>
        )}
        <View style={styles.borderedContainer}>
          <Text style={styles.text}>Commande N° {order.reference}</Text>
          <Text style={styles.text}>
            {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
          </Text>
          <Text style={styles.text}>{_.get(order, 'service.name')}</Text>
          {order.message && <Text style={styles.text}>{order.message}</Text>}
        </View>
        {order.partner && (
          <View style={[styles.borderedContainer, styles.partnerContainer]}>
            <Text style={styles.text}>{order.partner.firstname}</Text>
            <Text style={styles.text}>
              +213 {formatPhone(order.partner.phoneNumber.slice(4))}
            </Text>
          </View>
        )}
        <View style={styles.borderedContainer}>
          <View style={styles.priceContainer}>
            <View style={styles.rowContainer}>
              <Icon
                viewBox="0 0 25 25"
                width="40px"
                height="40px"
                name="cost"
                fill={colors.red}
              />
              <Text style={styles.titleText}>À payer</Text>
            </View>
            <Text style={styles.priceText}>
              {toPay ?? '---'}{' '}
              <Text style={{fontSize: sizes.smallText}}>DA</Text>
            </Text>
          </View>
          <View style={styles.borderedContainer}>
            <View style={styles.priceContainer}>
              <Text style={styles.text}>Prix du service</Text>
              <Text style={[styles.text, styles.priceDetail]}>
                {order.cost?.variable ?? '---'}
                <Text style={{fontSize: sizes.smallText}}> DA</Text>
              </Text>
            </View>
            {order.cost?.deplacement && (
              <>
                <View style={styles.divider} />
                <View style={styles.priceContainer}>
                  <Text style={styles.text}>Déplacement/diagnostic</Text>
                  <Text style={[styles.text, styles.priceDetail]}>
                    {order.cost?.deplacement}
                    <Text style={{fontSize: sizes.smallText}}>DA</Text>
                  </Text>
                </View>
              </>
            )}
            {order.cost?.loadingPrice && (
              <>
                <View style={styles.divider} />
                <View style={styles.priceContainer}>
                  <Text style={styles.text}>Chargement</Text>
                  <Text style={[styles.text, styles.priceDetail]}>
                    {order.cost?.loadingPrice}
                    <Text style={{fontSize: sizes.smallText}}>DA</Text>
                  </Text>
                </View>
              </>
            )}
            {order.cost?.unloadingPrice && (
              <>
                <View style={styles.divider} />
                <View style={styles.priceContainer}>
                  <Text style={styles.text}>Déchargement</Text>
                  <Text style={[styles.text, styles.priceDetail]}>
                    {order.cost?.unloadingPrice}
                    <Text style={{fontSize: sizes.smallText}}>DA</Text>
                  </Text>
                </View>
              </>
            )}

            {order.cost?.assemblyPrice && (
              <>
                <View style={styles.divider} />
                <View style={styles.priceContainer}>
                  <Text style={styles.text}>Montage</Text>
                  <Text style={[styles.text, styles.priceDetail]}>
                    {order.cost?.assemblyPrice}
                    <Text style={{fontSize: sizes.smallText}}>DA</Text>
                  </Text>
                </View>
              </>
            )}

            {order.cost?.disassemblyPrice && (
              <>
                <View style={styles.divider} />
                <View style={styles.priceContainer}>
                  <Text style={styles.text}>Démontage</Text>
                  <Text style={[styles.text, styles.priceDetail]}>
                    {order.cost?.disassemblyPrice}
                    <Text style={{fontSize: sizes.smallText}}>DA</Text>
                  </Text>
                </View>
              </>
            )}
            {!!reduction && (
              <>
                <View style={styles.divider} />
                <View style={styles.priceContainer}>
                  <Text style={styles.text}>Réduction coupon</Text>
                  <Text style={[styles.text, styles.priceDetail]}>
                    {reduction}
                    <Text style={{fontSize: sizes.smallText}}>DA</Text>
                  </Text>
                </View>
              </>
            )}
          </View>
          {order.promoCode && (
            <View style={styles.borderedContainer}>
              <View style={styles.priceContainer}>
                <Text style={styles.text}>Coupon</Text>
                <Text style={[styles.text, styles.priceDetail]}>
                  {order.promoCode.reduction}{' '}
                  <Text style={{fontSize: sizes.smallText}}>
                    {order.promoCode.unity === 'amount' ? 'DA' : '%'}
                  </Text>
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      {/* order.status.state === 'accepted' && (
        <View style={styles.actions_container}>
          <TouchableOpacity style={styles.button} onPress={handleCancel}>
            {orderRequest.pending && <Loading size={25} color="#fff" />}
            {!orderRequest.pending && (
              <Text style={styles.button_text}>Annuler la commande </Text>
            )}
          </TouchableOpacity>
        </View>
            ) */}
    </View>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  borderedContainer: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.grey,
    padding: 10,
    marginTop: 10,
  },
  positionContainer: {
    flexDirection: 'row',
    height: 45,
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusText: {
    fontWeight: 'bold',
  },
  priceContainer: {
    borderColor: colors.red,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  partnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleText: {
    marginLeft: 5,
    color: colors.stronggrey,
  },
  text: {
    marginHorizontal: 10,
    fontSize: sizes.defaultTextSize,
  },
  priceText: {
    fontWeight: 'bold',
    color: colors.red,
    fontSize: sizes.mediumText,
  },
  divider: {
    height: 1,
    backgroundColor: colors.grey,
    marginVertical: 5,
  },
  priceDetail: {
    fontWeight: 'bold',
  },
  actions_container: {
    height: 50,
    backgroundColor: colors.red,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    alignItems: 'center',
  },
  button_text: {
    color: '#fff',
  },
});

/* const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      cancelOrder: orderService.cancelOrder,
    },
    dispatch,
  ); */

const mapStateToProps = state => ({
  auth: getAuth(state.user),
  orders: getOrders(state.order),
});

export default connect(
  mapStateToProps,
  // mapDispatchToProps,
)(OrderDetailsScreen);
