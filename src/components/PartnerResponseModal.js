import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableHighlight,
  Linking,
} from 'react-native';
import Modal from 'react-native-modal';
import colors from 'src/constants/colors';
import Icon from 'src/components/Icon';
import {formatPhone} from 'src/helpers/handlePhoneNumber';

const PartnerResponseModel = ({response, handleOkClick}) => {
  const vehicle = response.providedServices?.find(
    s => s.service === response.service._id,
  )?.vehicle;
  const handleCallClick = phoneNumber => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  return (
    <Modal
      isVisible={true}
      swipeDirection={['up', 'left', 'right', 'down']}
      style={styles.response_modal}>
      <View style={styles.modal_container}>
        <View style={styles.modal_content}>
          <Icon
            style={styles.response_icon}
            viewBox="0 0 32 32"
            width="70px"
            height="70px"
            name="smile"
            fill={colors.disabledColor}
          />
          <Text style={styles.top_text}>Vous avez de la chance !!!</Text>
          <Text style={styles.bottom_text}>
            Un de nos Partenaires vient d'accepter votre commande du service
            {' "'}
            {response.service.name}
            {'"'}. Restez joignable pour répondre à son appel dans un instant
          </Text>
          <View style={styles.details_container}>
            <View style={styles.row_container}>
              <Icon
                style={styles.response_icon}
                viewBox="0 0 32 32"
                width="25px"
                height="25px"
                name="avatar"
                fill={colors.darkColor}
              />
              <Text style={styles.detail_text}>{response.firstname}</Text>
            </View>
            <View style={styles.row_container}>
              <Icon
                style={styles.response_icon}
                viewBox="0 0 32 32"
                width="25px"
                height="25px"
                name="phone"
                fill={colors.darkColor}
              />
              <Text style={styles.detail_text_bordered}>
                +213 {formatPhone(response.phoneNumber.slice(4))}
              </Text>
              <TouchableOpacity
                onPress={() => handleCallClick(response.phoneNumber)}>
                <Icon
                  style={styles.response_icon}
                  viewBox="0 0 32 32"
                  width="35px"
                  height="35px"
                  name="call"
                  fill={colors.green}
                />
              </TouchableOpacity>
            </View>
            {vehicle && (
              <>
                <Text>Véhicule</Text>
                <View style={styles.row_container}>
                  <Icon
                    style={styles.response_icon}
                    viewBox="0 0 32 32"
                    width="25px"
                    height="25px"
                    name="vehicle"
                    fill={colors.darkColor}
                  />
                  <Text style={styles.detail_text}>{vehicle.brand}</Text>
                </View>
                <View style={styles.row_container}>
                  <Icon
                    style={styles.response_icon}
                    viewBox="0 0 32 32"
                    width="25px"
                    height="25px"
                    name="licensePlate"
                    fill={colors.darkColor}
                  />
                  <Text
                    style={[
                      styles.detail_text_bordered,
                      styles.registration_container,
                    ]}>
                    {vehicle.registration}
                  </Text>
                </View>
                <View style={styles.row_container}>
                  <Text>Modèle : </Text>
                  <Text style={styles.detail_text}>{vehicle.color}</Text>
                </View>
              </>
            )}
          </View>
        </View>
        <TouchableHighlight
          underlayColor={colors.disabledColor}
          style={styles.button}
          onPress={handleOkClick}>
          <Text style={styles.text_button}>Ok</Text>
        </TouchableHighlight>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  detail_text_bordered: {
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.disabledColor,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 10,
    paddingRight: 10,
    marginVertical: 10,
    fontSize: 20,
    fontWeight: 'bold',
  },
  registration_container: {
    borderColor: 'red',
    backgroundColor: '#ea981e93',
  },
  response_modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modal_container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.7,
    shadowRadius: 5,
    elevation: 8,
  },
  modal_content: {
    backgroundColor: 'white',
    padding: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  top_text: {
    margin: 5,
    fontSize: 25,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  bottom_text: {
    fontSize: 15,
    lineHeight: 25,
    textAlign: 'center',
  },
  response_icon: {
    margin: 10,
  },
  details_container: {
    width: '100%',
  },
  detail_text: {
    fontSize: 15,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  row_container: {
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#fff',
    height: 50,
    borderWidth: 1,
    borderColor: colors.disabledColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
export default PartnerResponseModel;
