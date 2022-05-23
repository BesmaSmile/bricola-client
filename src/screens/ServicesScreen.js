import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import CategoryHeader from 'src/components/CategoryHeader';
import ServicesList from 'src/components/ServicesList';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import servicesService from 'src/services/services.service';
import favoriteService from 'src/services/favorite.service';
import {getFavorite} from 'src/store/reducers/favoriteReducer';
import {getAuth} from 'src/store/reducers/userReducer';
import {useRequestState} from 'src/tools/hooks';
import _ from 'lodash';

const ServicesScreen = props => {
  const servicesRequest = useRequestState();
  const {serviceCategory} = props.route.params;
  const {loadServices, auth, services, loadFavorite, favorite} = props;
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = () => {
    servicesRequest.sendRequest(() => loadServices(auth));
    loadFavorite(auth);
  };

  return (
    <View style={styles.container}>
      <CategoryHeader title={serviceCategory} />
      <ServicesList
        services={_.sortBy(services, 'placement')}
        reload={loadData}
        pending={servicesRequest.pending}
        error={servicesRequest.error}
        navigate={props.navigation.navigate}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = (state, props) => ({
  auth: getAuth(state.user),
  favorite: getFavorite(state.favorite),
  services:
    state.service.services &&
    state.service.services.filter(
      service => service.category === props.route.params.serviceCategory,
    ),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadFavorite: favoriteService.loadFavorite,
      loadServices: servicesService.loadServices,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ServicesScreen);
