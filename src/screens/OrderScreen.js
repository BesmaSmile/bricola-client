/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  TouchableHighlight,
  ScrollView,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {format, parse} from 'date-fns';
import MapView, {PROVIDER_GOOGLE, Marker, Polyline} from 'react-native-maps';
import {BallIndicator} from 'react-native-indicators';
import Modal from 'react-native-modal';
import numeral from 'numeral';
import Geolocation from 'react-native-geolocation-service';
//import MapboxGL from '@react-native-mapbox-gl/maps';
import Toast from 'react-native-tiny-toast';
//import MapViewDirections from 'react-native-maps-directions';

import {searchDirection, reverseGeocode} from 'src/api/maps';
import orderService from 'src/services/order.service';

import colors from 'src/constants/colors';
import Icon from 'src/components/Icon';
import MapMarker from 'src/components/MapMarker';
import Loading from 'src/components/Loading';
import ServiceCategoryThemes from 'src/constants/ServiceCategoryThemes';
import PlacesSearch from 'src/components/PlacesSearch';
import checkLocationPermission from 'src/helpers/checkLocationPermission';
import {connect} from 'react-redux';
import {getAuth} from 'src/store/reducers/userReducer';

const OrderScreen = props => {
  let service = props.route.params.service;
  let theme = {
    iconName: service.icon,
    color: ServiceCategoryThemes[service.category].color,
  };

  const map = useRef();
  const [mapReady, setMapReady] = useState(false);
  const [nearbyPartners, setNearbyPartners] = useState([]);
  const [myLocation, setMyLocation] = useState();
  const [pendingMyLocation, setPendingMyLocation] = useState(true);
  const [fromMyPosition, setFromMyPosition] = useState(true);
  const initialRequestValues = {
    service: service._id,
    position: undefined,
    destination: undefined,
    message: undefined,
    cost: {},
    duration: undefined,
    distance: undefined,
  };
  if (service.category !== 'Transport') {
    initialRequestValues.cost.deplacement = getCurrentTimePrice();
  }
  const [promoCode, setPromoCode] = useState({});
  const [serviceRequest, setServiceRequest] = useState(initialRequestValues);

  const [pendingPrice, setPendingPrice] = useState(false);
  const [pendingDuration, setPendingDuration] = useState(false);
  const [pendingReduction, setPendingReduction] = useState(false);
  const [showCost, setShowCost] = useState(false);
  const [pendingValidation, setPendingValidation] = useState(false);

  const [failureModalVisible, setFailureModalVisible] = useState(false);
  const [placesSearchModal, setPlacesSearchModal] = useState({
    target: 'position',
    visible: false,
    onMapMode: true,
  });
  const [mapsDirection, setMapsDirection] = useState();

  useEffect(() => {
    getCurrentLocation();
  }, []);

  function getCurrentTimePrice() {
    const now = new Date(Date.now());
    let price = 0;
    service.prices.timeslotPrices.forEach(timeslotPrice => {
      const startDate = parse(
        `${format(now, 'yyyy-MM-dd')} ${timeslotPrice.from}`,
        'yyyy-MM-dd HH:mm',
        new Date(),
      );

      const endDate = parse(
        `${format(now, 'yyyy-MM-dd')} ${timeslotPrice.to}`,
        'yyyy-MM-dd HH:mm',
        new Date(),
      );
      if (startDate > endDate) {
        endDate.setDate(endDate.getDate() + 1);
        const supposedNow = now;
        if (supposedNow < startDate) {
          supposedNow.setDate(supposedNow.getDate() + 1);
        }
        if (supposedNow >= startDate && supposedNow <= endDate) {
          price = timeslotPrice.price;
        }
      } else if (now >= startDate && now <= endDate) {
        price = timeslotPrice.price;
        return;
      }
    });
    return price;
  }

  async function getCurrentLocation() {
    const permission = await checkLocationPermission();
    if (permission) {
      Geolocation.getCurrentPosition(
        position => {
          reverseGeocode(position.coords).then(place => {
            let myLoc = {
              latitude: place.coordinate.latitude,
              longitude: place.coordinate.longitude,
              name: place.name,
              province: place.province,
              latitudeDelta: 0.0165,
              longitudeDelta: 0.0105,
            };
            setMyLocation(myLoc);
          });
        },
        error => {
          setPendingMyLocation(false);
          console.log(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 50,
          forceRequestLocation: true,
        },
      );
    } else {
      setPendingMyLocation(false);
    }
  }

  //use current location as position
  useEffect(() => {
    if (myLocation) {
      setPendingMyLocation(false);
      setupMyLocation();
    }
  }, [myLocation]);

  // load nearestby partners when position updated
  useEffect(() => {
    let stopRefresh = () => {};
    if (serviceRequest.position) {
      loadNearestPartners();
      const interval = setInterval(() => {
        loadNearestPartners();
      }, 30000);
      stopRefresh = () => clearInterval(interval);
    }
    return stopRefresh;
  }, [serviceRequest.position]);

  //update map direction when position or destination updated
  useEffect(() => {
    if (serviceRequest.position && serviceRequest.destination) {
      calculateOrder();
    }
  }, [serviceRequest.position, serviceRequest.destination]);

  //animate to position
  useEffect(() => {
    if (serviceRequest.position && mapReady) {
      map.current.animateToRegion(
        {
          ...serviceRequest.position.coordinate,
          latitudeDelta: 0.0165,
          longitudeDelta: 0.0105,
        },
        1000,
      );
    }
  }, [serviceRequest.position, mapReady]);

  function showServiceCost() {
    if (true /*vérifier départ et arrivée*/) {
      setShowCost(true);
    }
  }

  function handlePromoCodeChange(name) {
    setPromoCode({
      ...promoCode,
      name,
    });
  }

  function validateServiceRequest() {
    setPendingValidation(true);
    orderService.requestPartner(props.auth, serviceRequest).then(res => {
      if (!res.success) {
        setFailureModalVisible(true);
        setPendingValidation(false);
      } /*else {
        setTimeout(() => {
          setFailureModalVisible(true);
          setPendingValidation(false);
        }, 120000);
      }*/
    });
    /*setTimeout(() => {
      setValidationProgress(0.5)
      setTimeout(() => {
        setValidationProgress(0.8)
        setTimeout(() => {
          setValidationProgress(1)
          setTimeout(() => {
            setPendingValidation(false)
            setValidationProgress(0)
            setResponseModalVisible(true)
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);*/
  }

  function checkPromoCode() {
    if (true /*vérifier que le coup à été estimé et le code a été saisi*/) {
      setPendingPrice(true);
      setPendingReduction(true);
      setPromoCode({});
      orderService
        .checkPromoCode(props.auth, promoCode.name, service._id)
        .then(code => {
          let reduction = 0;
          if (service.params.withDestination) {
            reduction = {
              value: calculateReduction(code),
              unit: 'DA',
            };
          } else {
            reduction = {
              value: code.reduction,
              unit: code.unity === 'amount' ? 'DA' : '%',
            };
          }
          setPromoCode({
            ...promoCode,
            reduction,
          });
          setServiceRequest({
            ...serviceRequest,
            promoCode: code._id,
          });
          setPendingPrice(false);
          setPendingReduction(false);
        })
        .catch(error => {
          Toast.show(error, {
            animationDuration: 1000,
          });
          setPendingPrice(false);
          setPendingReduction(false);
        });
    }
  }

  function displayLoading() {
    if (pendingMyLocation) {
      return <Loading />;
    }
  }

  function displayPending(color) {
    return (
      <View style={styles.cost_view}>
        <BallIndicator size={25} color={color || colors.mainColor} />
      </View>
    );
  }

  function displayPrice() {
    if (pendingPrice) {
      return displayPending();
    } else {
      const priceToShow = serviceRequest.cost.variable
        ? numeral(
            serviceRequest.cost.variable +
              (serviceRequest.cost.loadingPrice || 0) +
              (serviceRequest.cost.unloadingPrice || 0) +
              (serviceRequest.cost.assemblyPrice || 0) +
              (serviceRequest.cost.disassemblyPrice || 0) -
              (promoCode.reduction ? promoCode.reduction.value : 0),
          ).format('0 0[.]00') + ' DA'
        : '---';
      return <Text style={styles.cost_view}>{priceToShow}</Text>;
    }
  }

  function formatDuration(secondsDuration) {
    const hours = Math.floor(secondsDuration / 3600);
    secondsDuration %= 3600;
    const minutes = Math.floor(secondsDuration / 60);
    return (hours > 0 ? `${hours} h ` : '') + `${minutes} min`;
  }

  function displayDuration() {
    if (pendingDuration) {
      return displayPending();
    } else {
      return (
        <Text style={styles.cost_view}>
          {serviceRequest.duration
            ? formatDuration(serviceRequest.duration)
            : '---'}
        </Text>
      );
    }
  }

  function displayReduction() {
    if (pendingReduction) {
      return displayPending();
    } else {
      return (
        <Text style={styles.cost_view}>
          {promoCode.reduction
            ? `${numeral(promoCode.reduction.value).format('0,0[.]00')} ${
                promoCode.reduction.unit
              }`
            : '---'}
        </Text>
      );
    }
  }

  function displayCalculatedCost() {
    if (
      service.params.withDestination &&
      showCost /*||
            state.pendingDuration || state.pendingPrice || state.pendingReduction*/
    ) {
      return (
        <View style={[styles.element_container, styles.input_container]}>
          <View style={styles.row_input_container}>
            <Icon
              viewBox="0 0 25 25"
              width="25px"
              height="25px"
              name="cost"
              fill={colors.mainColor}
            />
            <Text style={styles.row_center_text}>Prix</Text>
            {displayPrice()}
          </View>
          <View style={styles.line} />
          <View style={styles.row_input_container}>
            <Icon
              viewBox="0 0 25 25"
              width="25px"
              height="25px"
              name="hourglass"
              fill={colors.mainColor}
            />
            <Text style={styles.row_center_text}>Temps estimé</Text>
            {displayDuration()}
          </View>
        </View>
      );
    }
  }

  function displayDeplacementCost() {
    if (service.category !== 'Transport') {
      return (
        <View style={[styles.element_container, styles.input_container]}>
          <View style={styles.row_input_container}>
            <Icon
              viewBox="0 0 25 25"
              width="25px"
              height="25px"
              name="cost"
              fill={colors.mainColor}
            />
            <Text style={styles.row_center_text}>Déplacement/diagnostic</Text>
            <Text style={styles.cost_view}>
              {`${numeral(getCurrentTimePrice()).format('0,0[.]00')} DA`}
            </Text>
          </View>
          <View style={styles.line} />
          <View style={styles.row_input_container}>
            <Icon
              viewBox="0 0 25 25"
              width="25px"
              height="25px"
              name="giftbox"
              fill={colors.mainColor}
            />
            <Text style={styles.row_center_text}>Réduction par code promo</Text>
            {displayReduction()}
          </View>
        </View>
      );
    }
  }

  function displayPositions() {
    if (service.params.withDestination) {
      return (
        <View style={[styles.element_container, styles.input_container]}>
          <View style={styles.row_input_container}>
            <Icon
              viewBox="0 0 25 25"
              width="25px"
              height="25px"
              name="maps"
              fill={colors.position}
            />
            <TouchableOpacity
              style={styles.position_input_container}
              onPress={() => showPlacesSearchModal('position')}>
              <TextInput
                style={styles.position_textinput}
                placeholder="Départ"
                value={
                  fromMyPosition
                    ? 'Ma Position'
                    : `${serviceRequest.position?.name} ${
                        serviceRequest.position?.province
                      }`
                }
                editable={false}
                onSubmitEditing={() => {}}
              />
            </TouchableOpacity>

            <TouchableHighlight
              style={styles.rounded_button}
              underlayColor={colors.disabledColor}
              onPress={setupMyLocation}>
              <Icon
                viewBox="0 0 25 25"
                width="25px"
                height="25px"
                name="gpsIndicator"
                fill={colors.darkColor}
              />
            </TouchableHighlight>
          </View>
          <View style={styles.line} />
          <View style={styles.row_input_container}>
            <Icon
              viewBox="0 0 25 25"
              width="25px"
              height="25px"
              name="maps"
              fill={colors.destination}
            />
            <TouchableOpacity
              style={styles.position_input_container}
              onPress={() => showPlacesSearchModal('destination')}>
              <TextInput
                style={styles.position_textinput}
                placeholder="Arrivée"
                value={
                  serviceRequest.destination
                    ? `${serviceRequest.destination?.name} ${
                        serviceRequest.destination?.province
                      }`
                    : ''
                }
                editable={false}
              />
            </TouchableOpacity>

            <TouchableHighlight
              style={styles.rounded_button}
              underlayColor={colors.disabledColor}
              onPress={clearDestination}>
              <Icon
                viewBox="0 0 25 25"
                width="25px"
                height="25px"
                name="cross"
                fill={colors.darkColor}
              />
            </TouchableHighlight>
          </View>
        </View>
      );
    } else {
      return (
        <View style={[styles.position_container, styles.input_container]}>
          <Icon
            viewBox="0 0 25 25"
            width="25px"
            height="25px"
            name="maps"
            fill={colors.position}
          />
          <TouchableOpacity
            style={styles.position_input_container}
            onPress={() => showPlacesSearchModal('position')}>
            <TextInput
              style={styles.position_textinput}
              placeholder="Position"
              value={
                fromMyPosition
                  ? 'Ma Position'
                  : `${serviceRequest.position?.name} ${
                      serviceRequest.position?.province
                    }`
              }
              editable={false}
            />
          </TouchableOpacity>

          <TouchableHighlight
            style={styles.rounded_button}
            underlayColor={colors.disabledColor}
            onPress={setupMyLocation}>
            <Icon
              viewBox="0 0 25 25"
              width="25px"
              height="25px"
              name="gpsIndicator"
              fill={colors.darkColor}
            />
          </TouchableHighlight>
        </View>
      );
    }
  }

  function displayMessage() {
    if (service.params.withDescription) {
      return (
        <View style={[styles.message_container, styles.input_container]}>
          <TextInput
            style={styles.message_textinput}
            placeholder="Description de votre besoin"
            multiline={true}
            numberOfLines={2}
            value={serviceRequest.message}
            onChangeText={message =>
              setServiceRequest({...serviceRequest, message})
            }
          />
          <TouchableHighlight
            underlayColor={colors.disabledColor}
            onPress={() => setServiceRequest({...serviceRequest, message: ''})}>
            <Icon
              viewBox="0 0 25 25"
              width="25px"
              height="25px"
              name="cross"
              fill={colors.darkColor}
            />
          </TouchableHighlight>
        </View>
      );
    }
  }

  function displayPromoCode() {
    if (
      (service.params.withDestination && showCost) ||
      !service.params.withDestination
    ) {
      return (
        <View style={styles.reduction_container}>
          <View style={[styles.content, styles.input_container]}>
            <TextInput
              style={styles.code_textinput}
              placeholder="Code promo"
              onChangeText={handlePromoCodeChange}
              onSubmitEditing={checkPromoCode}
            />
          </View>
          <TouchableHighlight
            underlayColor={colors.disabledColor}
            style={styles.activate_code_button}
            onPress={checkPromoCode}>
            <Text style={styles.activate_code_text}>Activer</Text>
          </TouchableHighlight>
        </View>
      );
    }
  }

  function handleValueChange(key, value) {
    let request = {...serviceRequest};
    if (value) {
      request.cost[key] = service.prices[key];
    } else {
      delete request.cost[key];
    }
    setServiceRequest(serviceRequest);
  }

  function displayOtherServices() {
    if (showCost) {
      const otherServicesPrices = {
        loadingPrice: 'Chargement',
        unloadingPrice: 'Déchargement',
        assemblyPrice: 'Montage',
        disassemblyPrice: 'Démontage',
      };
      return (
        <View style={styles.other_services_container}>
          {Object.keys(otherServicesPrices).map(
            key =>
              service.prices[key] && (
                <View key={key} style={styles.row_input_container}>
                  <CheckBox
                    value={serviceRequest.cost?.[key] > 0}
                    onValueChange={value => handleValueChange(key, value)}
                  />
                  <Text>
                    {' '}
                    {otherServicesPrices[key]} {service.prices[key]} DA
                  </Text>
                </View>
              ),
          )}
        </View>
      );
    }
  }

  function displayAction() {
    if (service.params.withDestination && !showCost) {
      return (
        <TouchableHighlight
          underlayColor={colors.disabledColor}
          style={[styles.button, styles.validate_button]}
          onPress={() => showServiceCost()}>
          <Text style={[styles.text_button, styles.validate_text]}>
            Calculer
          </Text>
        </TouchableHighlight>
      );
    } else {
      return (
        <TouchableHighlight
          underlayColor={colors.disabledColor}
          style={[styles.button, styles.validate_button]}
          onPress={() => validateServiceRequest()}>
          {!pendingValidation ? (
            <Text style={[styles.text_button, styles.validate_text]}>
              Valider
            </Text>
          ) : (
            displayPending('#fff')
          )}
        </TouchableHighlight>
      );
    }
  }

  function updateRegion(e) {
    //console.log(e)
  }

  function displayForm() {
    if (!pendingMyLocation) {
      return (
        <View style={styles.container}>
          <ScrollView
            style={styles.form_container}
            contentContainerStyle={styles.scroll_content}>
            {
              <MapView
                style={styles.map}
                ref={map}
                provider={PROVIDER_GOOGLE}
                onRegionChangeComplete={updateRegion}
                onMapReady={() => setMapReady(true)}
                initialRegion={
                  myLocation
                    ? myLocation
                    : {
                        latitude: 36.752887,
                        longitude: 3.042048,
                        latitudeDelta: 11,
                        longitudeDelta: 11,
                      }
                }
                onPress={chooseOnMap}>
                {nearbyPartners?.map(partner => (
                  <MapMarker
                    key={partner._id}
                    coordinate={{
                      longitude: partner.location[0],
                      latitude: partner.location[1],
                    }}
                    theme={theme}
                  />
                ))}
                {mapsDirection &&
                  serviceRequest.position &&
                  serviceRequest.destination && (
                    <Polyline
                      coordinates={mapsDirection}
                      strokeWidth={5}
                      strokeColor={colors.route}
                    />
                  )}
                {(serviceRequest.position || myLocation) && (
                  <Marker
                    style={styles.topMarker}
                    coordinate={
                      serviceRequest.position
                        ? serviceRequest.position.coordinate
                        : myLocation
                    }>
                    <Icon
                      viewBox="0 0 25 25"
                      width="35px"
                      height="35px"
                      name="maps"
                      fill={colors.position}
                    />
                  </Marker>
                )}
                {serviceRequest.destination && (
                  <Marker
                    coordinate={serviceRequest.destination.coordinate}
                    style={styles.topMarker}>
                    <Icon
                      viewBox="0 0 25 25"
                      width="35px"
                      height="35px"
                      name="maps"
                      fill={colors.destination}
                    />
                  </Marker>
                )}
              </MapView>
            }
            {displayPositions()}
            {displayMessage()}
            {displayDeplacementCost()}
            {displayCalculatedCost()}
            {displayPromoCode()}
            {displayOtherServices()}
          </ScrollView>
          {displayAction()}
        </View>
      );
    }
  }

  const displayFailureModal = response => {
    return (
      <Modal
        isVisible={failureModalVisible}
        hasBackdrop={false}
        swipeDirection={['up', 'left', 'right', 'down']}
        style={styles.response_modal}>
        <View style={styles.modal_container}>
          <View style={styles.modal_content}>
            <Icon
              style={styles.response_icon}
              viewBox="0 0 32 32"
              width="70px"
              height="70px"
              name="sad"
              fill={colors.red}
            />
            <Text style={styles.top_text}>Pas de chance cette fois !!!</Text>
            <Text style={styles.bottom_text}>
              Un de nos partenaires vous répondra aussitôt que possible
            </Text>
          </View>
          <TouchableHighlight
            underlayColor={colors.disabledColor}
            style={styles.button}
            onPress={() => {
              setFailureModalVisible(false);
              props.navigation.goBack();
            }}>
            <Text style={styles.text_button}>Ok</Text>
          </TouchableHighlight>
        </View>
      </Modal>
    );
  };

  function displayPlacesSearchModal() {
    return (
      <Modal
        isVisible={placesSearchModal.visible}
        hasBackdrop={false}
        style={styles.places_search_modal}>
        <PlacesSearch
          hidePlacesSearchModal={hidePlacesSearchModal}
          selectPlace={selectPlace}
          setupMyLocation={setupMyLocation}
          addMyLocationChoice={placesSearchModal.target === 'position'}
        />
      </Modal>
    );
  }

  function clearDestination() {
    setMapsDirection(undefined);
    setServiceRequest({
      ...serviceRequest,
      destination: undefined,
      distance: undefined,
      duration: undefined,
      cost: {
        variable: undefined,
      },
    });
    setShowCost(false);
  }

  function showPlacesSearchModal(target) {
    setPlacesSearchModal({
      ...placesSearchModal,
      target: target,
      visible: true,
    });
  }

  function hidePlacesSearchModal(useOnMapMode) {
    setPlacesSearchModal({
      ...placesSearchModal,
      onMapMode:
        useOnMapMode !== undefined ? useOnMapMode : placesSearchModal.onMapMode,
      visible: false,
    });
  }

  function selectPlace(place) {
    setServiceRequest({
      ...serviceRequest,
      [placesSearchModal.target]: place,
    });
    if (placesSearchModal.target === 'position') {
      setFromMyPosition(false);
    }
  }

  function setupMyLocation() {
    setPlacesSearchModal({
      ...placesSearchModal,
      target: 'position',
    });

    if (myLocation) {
      setServiceRequest({
        ...serviceRequest,
        position: {
          coordinate: {
            longitude: myLocation.longitude,
            latitude: myLocation.latitude,
          },
          name: myLocation.name,
          province: myLocation.province,
        },
      });
      setFromMyPosition(true);
    } else {
      getCurrentLocation();
    }
  }

  function loadNearestPartners() {
    orderService
      .getNearestPartners(
        props.auth,
        serviceRequest.position.coordinate,
        service._id,
      )
      .then(result => {
        setNearbyPartners(result);
      })
      .catch(error => console.log(error));
  }

  function chooseOnMap(e) {
    if (placesSearchModal.onMapMode) {
      reverseGeocode(e.nativeEvent.coordinate).then(place => {
        selectPlace(place);
      });
    }
  }

  function calculateOrder() {
    clearMapsDirection();
    setMapsDirection(undefined);
    setServiceRequest({
      ...serviceRequest,
      distance: undefined,
      duration: undefined,
      cost: {
        variable: undefined,
      },
    });
    setPendingDuration(true);
    setPendingPrice(true);

    searchDirection(
      serviceRequest.position.coordinate,
      serviceRequest.destination.coordinate,
    ).then(result => {
      setMapsDirection(result.direction);
      setServiceRequest({
        ...serviceRequest,
        duration: result.duration,
        distance: Math.round(result.distance / 1000),
        cost: {
          variable: Math.round(
            (result.distance / 1000) * getCurrentTimePrice(),
          ),
        },
      });
      setPendingDuration(false);
      setPendingPrice(false);
    });
  }

  function calculateReduction(code) {
    let reduction = 0;
    switch (code.unity) {
      case 'percentage': //%
        reduction = Math.round(
          ((serviceRequest.cost.variable +
            (serviceRequest.cost.deplacement || 0)) *
            code.reduction) /
            100,
        );
        break;
      case 'amount': //DA
        reduction = Math.min(
          code.reduction,
          serviceRequest.cost.variable + (serviceRequest.cost.deplacement || 0),
        );
        break;
    }
    return reduction;
  }

  function clearMapsDirection() {
    setMapsDirection(undefined);
  }

  return (
    <View style={styles.container}>
      {displayLoading()}
      {displayForm()}
      {displayPlacesSearchModal()}
      {displayFailureModal()}
      {/*<Toast position='bottom'
        fadeInDuration={1000}
        fadeOutDuration={2000}
        opacity={0.8}
  style={{ backgroundColor: 'red' }} />*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  other_services_container: {
    borderRadius: 3,
    backgroundColor: 'white',
  },
  map: {
    flex: 1,
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  form_container: {
    position: 'absolute',
    bottom: 50,
    right: 0,
    left: 0,
    top: 0,
  },
  scroll_content: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    padding: 10,
  },
  scroll_container: {
    flex: 1,
  },
  input_container: {
    borderColor: colors.disabledColor,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    height: 45,
    padding: 10,
    marginBottom: 5,
    alignItems: 'flex-end',
  },
  message_container: {
    flexDirection: 'row',
    marginBottom: 5,
    alignItems: 'flex-start',
    padding: 10,
  },
  element_container: {
    marginBottom: 5,
  },
  details_container: {
    width: '100%',
  },
  row_container: {
    flexDirection: 'row',
    padding: 5,
    alignItems: 'center',
  },
  row_input_container: {
    flexDirection: 'row',
    height: 45,
    padding: 10,
    alignItems: 'center',
  },
  reduction_container: {
    flexDirection: 'row',
  },
  row_center_text: {
    color: colors.darkColor,
    flex: 3,
    fontSize: 12,
    marginLeft: 10,
    marginRight: 10,
    textAlignVertical: 'center',
    padding: 0,
  },
  cost_view: {
    flex: 2,
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'right',
    alignItems: 'flex-end',
    color: colors.mainColor,
  },
  line: {
    borderBottomColor: colors.disabledColor,
    borderBottomWidth: 1,
    marginRight: 15,
    marginLeft: 15,
  },
  position_container: {
    flexDirection: 'row',
    height: 45,
    padding: 10,
    marginBottom: 5,
    alignItems: 'center',
  },
  position_input_container: {
    flex: 1,
  },
  position_textinput: {
    color: colors.darkColor,
    fontWeight: 'bold',
    fontSize: 15,
    marginLeft: 10,
    marginRight: 10,
    textAlignVertical: 'center',
    padding: 0,
    flex: 4,
  },

  code_textinput: {
    flex: 1,
    fontSize: 15,
    textAlignVertical: 'center',
    padding: 0,
  },
  activate_code_button: {
    height: 45,
    width: 130,
    marginLeft: 5,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.mainColor,
  },
  activate_code_text: {
    color: colors.lightColor,
    fontSize: 15,
    fontWeight: 'bold',
  },
  message_textinput: {
    flex: 1,
    textAlignVertical: 'top',
    fontSize: 15,
    padding: 0,
  },
  button: {
    backgroundColor: '#fff',
    height: 50,
    borderWidth: 1,
    borderColor: colors.disabledColor,
    justifyContent: 'center',
    alignItems: 'center',
  },
  validate_button: {
    position: 'absolute',
    right: 0,
    left: 0,
    bottom: 0,
    backgroundColor: colors.green,
  },
  text_button: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.darkColor,
  },
  validate_text: {
    color: '#fff',
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
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
  contact_container: {
    margin: 10,
  },
  detail_text: {
    fontSize: 15,
    fontWeight: 'bold',
    marginHorizontal: 10,
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
  ok_button: {
    backgroundColor: colors.disabledColor,
  },
  places_search_modal: {
    flex: 1,
    margin: 0,
    padding: 0,
  },
  rounded_button: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topMarker: {
    zIndex: 1,
  },
});

const mapStateToProps = state => ({
  auth: getAuth(state.user),
});

export default connect(mapStateToProps)(OrderScreen);
