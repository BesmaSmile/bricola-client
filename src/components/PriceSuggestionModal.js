import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';

import Icon from '../components/Icon';
import Loading from 'src/components/Loading';
import colors from '../constants/colors';
import orderService from 'src/services/order.service';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {getAuth} from 'src/store/reducers/userReducer';
import {useRequestState} from 'src/tools/hooks';

const PriceSuggestionModal = ({auth, suggestion, close, loadOrders}) => {
  const sendResponseRequest = useRequestState();

  const handleSendResponse = accepted => {
    sendResponseRequest.sendRequest(
      () =>
        orderService.respondToSuggestion(
          auth,
          suggestion.order._id,
          suggestion.price,
          accepted,
        ),
      () => {
        close();
        loadOrders(auth);
      },
    );
  };

  return (
    <Modal isVisible={true} style={styles.modal_container}>
      <View style={styles.modal_content}>
        <View style={styles.content}>
          <Text>
            {suggestion.order.service.name} - commande N°{' '}
            {suggestion.order.reference}
          </Text>
          <Text>Le partenaire vous suggère ce prix</Text>
          <View style={styles.inner_container}>
            <Icon
              viewBox="0 0 25 25"
              width="25px"
              height="25px"
              name="cost"
              fill={colors.darkColor}
            />
            <Text style={styles.price_text}>{suggestion.price}</Text>
            <Text>DA</Text>
          </View>
        </View>
        <View style={styles.actions_container}>
          {sendResponseRequest.pending ? (
            <Loading size={25} />
          ) : (
            <>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSendResponse(false)}>
                <Text>Rejeter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button}
                onPress={() => handleSendResponse(true)}>
                <Text>Accepter</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal_container: {
    overflow: 'hidden',
    alignItems: 'center',
  },
  modal_content: {
    borderRadius: 5,
    backgroundColor: 'white',
    paddingBottom: 0,
  },
  row_container: {
    display: 'flex',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  content: {
    margin: 20,
  },
  inner_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  price_text: {
    width: 200,
    marginLeft: 5,
    fontSize: 16,
    textAlignVertical: 'center',
    padding: 10,
    borderWidth: 0.8,
    borderRadius: 5,
    borderColor: colors.grey,
    marginRight: 5,
  },
  actions_container: {
    height: 50,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    flex: 1,
    alignItems: 'center',
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
)(PriceSuggestionModal);
