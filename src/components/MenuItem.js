import React from 'react';
import {View, Text, StyleSheet, TouchableHighlight} from 'react-native';
import Icon from 'src/components/Icon';
import colors from 'src/constants/colors';
import ServiceCategoryThemes from 'src/constants/ServiceCategoryThemes';

const MenuItem = props => {
  const {title, displayServicesOfCategory} = props;
  const theme = ServiceCategoryThemes[title];
  return (
    <View style={styles.container}>
      <View style={styles.menu_item}>
        <TouchableHighlight
          style={[styles.icon_container, {backgroundColor: theme.color}]}
          onPress={() => displayServicesOfCategory(title)}>
          <Icon
            viewBox="0 0 25 25"
            width="35px"
            height="25px"
            name={theme.iconName}
            fill={colors.lightColor}
          />
        </TouchableHighlight>
        <Text style={styles.title_text}>{title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  menu_item: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
  },
  icon_container: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  title_text: {
    textAlign: 'center',
    color: colors.textColorDefault,
    fontSize: 12,
  },
});

export default MenuItem;
