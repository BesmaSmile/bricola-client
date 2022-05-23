import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';

import ServiceList from 'src/components/ServicesList';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import favoriteService from 'src/services/favorite.service';
import {getFavorite} from 'src/store/reducers/favoriteReducer';
import {getAuth} from 'src/store/reducers/userReducer';
import {useRequestState} from 'src/tools/hooks';

const FavoriteScreen = props => {
  const favoriteRequest = useRequestState();
  const {auth, favorite, loadFavorite} = props;

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = () => {
    favoriteRequest.sendRequest(() => loadFavorite(auth));
  };

  return (
    <View style={styles.container}>
      <ServiceList
        services={favorite}
        reload={loadData}
        pending={favoriteRequest.pending}
        error={favoriteRequest.error}
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

const mapStateToProps = state => ({
  favorite: getFavorite(state.favorite),
  auth: getAuth(state.user),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      loadFavorite: favoriteService.loadFavorite,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FavoriteScreen);
