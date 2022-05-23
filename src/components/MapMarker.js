import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Marker} from 'react-native-maps';
import serviceService from 'src/services/services.service';
import SvgUri from 'react-native-svg-uri';

const MapMarker = props => {
  const {theme, coordinate} = props;
  return (
    <Marker coordinate={coordinate}>
      <View style={[styles.container, {backgroundColor: theme.color}]}>
        <SvgUri
          source={{uri: serviceService.getServiceImage(theme.iconName)}}
          width="15"
          height="15"
          fill="#fff"
          fillAll={true}
        />
      </View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 30,
    height: 30,
    borderWidth: 2,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#fff',
  },
  image: {
    width: 30,
    height: 30,
  },
});

export default MapMarker;
