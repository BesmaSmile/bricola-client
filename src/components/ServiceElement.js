import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import numeral from 'numeral';

import Icon from './Icon';
import colors from 'src/constants/colors';
import servicesService from 'src/services/services.service';
import favoriteService from 'src/services/favorite.service';
import {getFavorite} from 'src/store/reducers/favoriteReducer';
import {getAuth} from 'src/store/reducers/userReducer';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {useRequestState} from 'src/tools/hooks';

const ServiceElement = props => {
  const {service, isItem} = props;
  const contentStyle = isItem ? itemStyles : detailStyles;
  const updateFavoiteRequest = useRequestState();

  const updateFavorite = () => {
    const {addToFavorite, removeFromFavorite, auth} = props;
    if (isInFavorite() !== undefined) {
      if (isInFavorite()) {
        updateFavoiteRequest.sendRequest(() =>
          removeFromFavorite(auth, service),
        );
      } else {
        updateFavoiteRequest.sendRequest(() => addToFavorite(auth, service));
      }
    }
  };

  const displayImageContent = () => {
    return (
      <Image
        style={contentStyle.image}
        source={{uri: servicesService.getServiceImage(service.image)}}
      />
    );
  };

  const displayPrice = () => {
    if (service.category !== 'Transport') {
      let prices = service?.prices?.timeslotPrices?.map(
        timeslotPrice => timeslotPrice.price,
      );
      const minPrice = prices?.length > 0 ? Math.min(...prices) : 0;
      const maxPrice = prices?.length > 0 ? Math.max(...prices) : 0;
      const pricePhrase =
        minPrice === maxPrice
          ? `${numeral(minPrice).format('0,0[.]00')} DA`
          : `${numeral(minPrice).format('0,0[.]00')} - ${numeral(
              maxPrice,
            ).format('0,0[.]00')} DA`;
      return (
        <View style={styles.price_container}>
          <View style={styles.price_bordered_container}>
            <Text style={styles.price_description_text}>
              Déplacement/Diagnostic
            </Text>
            <Text style={styles.price_value_text}>{pricePhrase}</Text>
          </View>
        </View>
      );
    }
  };

  const displayImageContainer = () => {
    if (isItem) {
      const {displayServiceDetails} = props;
      return (
        <TouchableOpacity
          style={contentStyle.image_container}
          onPress={() => displayServiceDetails(service)}>
          {displayImageContent()}
          {displayPrice()}
        </TouchableOpacity>
      );
    } else {
      return (
        <View style={contentStyle.image_container}>
          {displayImageContent()}
          {displayPrice()}
        </View>
      );
    }
  };

  const displayDescription = () => {
    if (isItem) {
      return (
        <View style={contentStyle.description_container}>
          <Text style={styles.description_text} numberOfLines={2}>
            {service.description}
          </Text>
        </View>
      );
    } else {
      const keywords = [];

      for (let i = 0; i < service.keywords.length; i++) {
        keywords.push(
          <Text style={contentStyle.keyword_text} key={'mot_' + i}>
            {' '}
            {service.keywords[i]}{' '}
          </Text>,
        );
      }

      return (
        <View style={contentStyle.description_container}>
          <Text style={styles.description_text}>{service.description}</Text>
          <View style={contentStyle.keywords_container}>{keywords}</View>
          {/*service.category === 'Transport' ? (
            <Text>Prix du kilométrage</Text>
          ) : (
            <Text>Prix de déplaceent/diagnostic</Text>
          )*/}
          {/*service.prices.timeslotPrices.map((timeslotPrice, i) => (
            <View key={i}>
              <Text>
                De {timeslotPrice.from} à {timeslotPrice.to} :{' '}
                {timeslotPrice.price} DA
              </Text>
            </View>
          ))*/}
        </View>
      );
    }
  };

  const isInFavorite = () => {
    const {favorite} = props;
    if (favorite !== undefined) {
      return favorite.some(srvc => props.service._id === srvc._id);
    } else {
      return undefined;
    }
  };

  const displayfavoriteButton = () => {
    return (
      <TouchableOpacity
        style={styles.action_button}
        onPress={() => updateFavorite()}>
        <Icon
          viewBox="0 0 25 25"
          width="25px"
          height="25px"
          name={
            !updateFavoiteRequest.pending && isInFavorite()
              ? 'bookmark'
              : 'bookmarkEmpty'
          }
          fill={colors.darkColor}
        />
      </TouchableOpacity>
    );
  };

  const displayNewOrder = () => {
    const {navigate} = props;
    navigate('Order', {service: service});
  };

  return (
    <View style={contentStyle.container}>
      {displayImageContainer()}
      <View style={contentStyle.header_container}>
        <View style={styles.title_container}>
          <Text style={styles.title_text}>{service.name}</Text>
        </View>
        <View style={styles.action_container}>
          <TouchableOpacity
            style={styles.action_button}
            onPress={() => displayNewOrder()}>
            <Icon
              viewBox="0 0 25 25"
              width="25px"
              height="25px"
              name="forward"
              fill={colors.darkColor}
            />
          </TouchableOpacity>
          {displayfavoriteButton()}
        </View>
      </View>
      {displayDescription()}
    </View>
  );
};

const styles = StyleSheet.create({
  title_container: {
    flex: 2,
  },
  title_text: {
    flexWrap: 'wrap',
    fontWeight: 'bold',
    fontSize: 15,
  },
  action_container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },

  price_container: {
    position: 'absolute',
    left: 0,
    right: 10,
    top: 0,
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  price_bordered_container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    opacity: 0.8,
    borderRadius: 5,
    borderColor: '#E74804',
    backgroundColor: '#FFF',
  },
  price_description_text: {
    fontSize: 12,
  },
  price_value_text: {
    fontWeight: 'bold',
    color: 'green',
    marginLeft: 5,
    marginRight: 5,
  },
  action_button: {
    marginLeft: 20,
  },
  description_text: {
    flex: 1,
    fontSize: 12,
  },
});

const itemStyles = StyleSheet.create({
  container: {
    height: 300,
    margin: 10,
    borderRadius: 5,
    backgroundColor: '#F6F4F4',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
  },
  image_container: {
    flex: 5,
  },
  image: {
    flex: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  header_container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 5,
    marginBottom: 5,
    marginLeft: 15,
    marginRight: 15,
  },
  description_container: {
    flex: 1,
    flexDirection: 'row',
    marginBottom: 5,
    marginLeft: 15,
    marginRight: 15,
  },
});

const detailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6F4F4',
  },
  scroll: {
    flex: 1,
    backgroundColor: 'yellow',
  },
  image_container: {
    height: Dimensions.get('window').height / 2 - 50,
  },
  image: {
    flex: 1,
  },
  header_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    marginBottom: 15,
    marginLeft: 20,
    marginRight: 20,
  },
  description_container: {
    marginBottom: 10,
    marginLeft: 20,
    marginRight: 20,
  },
  keywords_container: {
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  keyword_text: {
    borderWidth: 1,
    borderColor: colors.disabledColor,
    borderRadius: 10,
    backgroundColor: '#fff',
    height: 25,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 10,
    paddingRight: 10,
    margin: 5,
    textAlign: 'center',
  },
  text_button: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.darkColor,
  },
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      addToFavorite: favoriteService.addToFavorite,
      removeFromFavorite: favoriteService.removeFromFavorite,
    },
    dispatch,
  );

const mapStateToProps = state => ({
  favorite: getFavorite(state.favorite),
  auth: getAuth(state.user),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServiceElement);
