import React from 'react';
import {View, StyleSheet, FlatList, Text} from 'react-native';

import Empty from 'src/components/Empty';
import ServiceElement from './ServiceElement';
import colors from 'src/constants/colors';
import sizes from 'src/constants/sizes';

const ServicesList = props => {
  const {pending, error, services, navigate, reload} = props;

  const displayServiceDetails = service => {
    navigate('ServiceDetails', {service: service});
  };

  return (
    <View style={styles.container}>
      {!pending && !error && services?.length === 0 && (
        <Empty message="Aucun services n'est disponible dans cette catégorie !" />
      )}
      {error && (
        <View style={styles.centeredAbsoluteContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
      <FlatList
        onRefresh={reload}
        refreshing={pending}
        data={services}
        keyExtractor={item => item._id}
        renderItem={({item}) => (
          <ServiceElement
            isItem={true}
            service={item}
            displayServiceDetails={displayServiceDetails}
            navigate={navigate}
          />
        )}
      />
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
  centeredAbsoluteContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.stronggrey,
    fontSize: sizes.defaultTextSize,
    marginTop: 10,
  },
});

export default ServicesList;
