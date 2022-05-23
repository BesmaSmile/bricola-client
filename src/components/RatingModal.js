import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {format} from 'date-fns';
import Icon from 'src/components/Icon';
import Loading from 'src/components/Loading';
import colors from '../constants/colors';
import orderService from 'src/services/order.service';
import {connect} from 'react-redux';
import {getAuth} from 'src/store/reducers/userReducer';
import {useRequestState} from 'src/tools/hooks';
import StarsRating from './StarsRating';

const RatingModal = ({auth, order, close}) => {
  const [rating, setRating] = useState(0);
  const ratingRequest = useRequestState();
  const sendRating = () => {
    ratingRequest.sendRequest(
      () => orderService.rateOrder(auth, order._id, rating),
      () => close(),
    );
  };

  const handleRatingChange = ratingValue => {
    setRating(ratingValue);
  };
  return (
    <Modal
      isVisible={true}
      hasBackdrop={false}
      style={styles.rating_modal}
      swipeDirection="right"
      propagateSwipe
      onSwipeComplete={close}>
      <View style={styles.modal_container}>
        <View style={styles.modal_content}>
          <View style={styles.row_container}>
            <Icon
              style={styles.icon}
              viewBox="0 0 32 32"
              width="25px"
              height="25px"
              name="avatar"
              fill={colors.darkColor}
            />
            <Text style={styles.detail_text}>
              {order.service} : {order.partner}
            </Text>
          </View>
          <Text>Commande N° {order.reference}</Text>
          <Text>
            Effectuée le {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
          </Text>
          <View style={styles.rating_container}>
            <StarsRating
              backgroundColor="#fff"
              rating={rating}
              onRating={handleRatingChange}
              size={30}
            />
          </View>
        </View>
        <TouchableOpacity style={styles.button} onPress={sendRating}>
          {ratingRequest.pending ? <Loading size={25} /> : <Text>Envoyer</Text>}
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  rating_modal: {
    justifyContent: 'flex-start',
  },
  modal_container: {
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
  },
  modal_content: {
    padding: 20,
    width: '100%',
  },
  row_container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    margin: 10,
  },
  detail_text: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  rating_container: {
    marginTop: 20,
  },
  button: {
    backgroundColor: '#fff',
    height: 50,
    borderTopWidth: 1,
    borderColor: colors.disabledColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

const mapStateToProps = state => ({
  auth: getAuth(state.user),
});

export default connect(mapStateToProps)(RatingModal);
