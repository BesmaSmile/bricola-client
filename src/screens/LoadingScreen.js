import React from 'react';
import {StyleSheet, Image} from 'react-native';

import colors from 'src/constants/colors';

const LoadingScreen = () => (
  <Image
    source={require('src/assets/images/load_bricola.png')}
    style={styles.image}
  />
);

const styles = StyleSheet.create({
  main_container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.backgroundColor,
  },
  image: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
});

export default LoadingScreen;
