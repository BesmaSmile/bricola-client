import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'src/components/Icon';
import colors from 'src/constants/colors';
import sizes from 'src/constants/sizes';

const Empty = ({message}) => (
  <View style={styles.container}>
    <Icon
      viewBox="0 0 35 35"
      width="50px"
      height="50px"
      name="empty"
      fill={colors.red}
    />
    <Text style={styles.text}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  text: {
    color: colors.stronggrey,
    fontSize: sizes.defaultTextSize,
    marginTop: 10,
    textAlign: 'center',
  },
});

export default Empty;
