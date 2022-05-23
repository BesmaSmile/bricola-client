import React from 'react';
import {View, StyleSheet} from 'react-native';
import {BallIndicator} from 'react-native-indicators';

import colors from 'src/constants/colors';

const Loading = props => {
  return (
    <View style={styles.loading_container}>
      <BallIndicator color={colors.lightblue} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  loading_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Loading;
