import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import ServiceCategoryThemes from 'src/constants/ServiceCategoryThemes';
import Icon from './Icon';
import colors from 'src/constants/colors';

const CategoryHeader = props => {
  const {title} = props;
  const theme = ServiceCategoryThemes[title];
  return (
    <View style={styles.header}>
      <View style={[styles.icon_container, {backgroundColor: theme.color}]}>
        <Icon
          viewBox="0 0 25 25"
          width="35px"
          height="25px"
          name={theme.iconName}
          fill={colors.lightColor}
        />
      </View>
      <Text style={styles.category_text}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#F6F4F4',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 3,
    overflow: 'hidden',
  },
  icon_container: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    padding: 15,
    left: -40,
    top: -20,
  },
  category_text: {
    left: -30,
    color: colors.textColorDefault,
  },
});

export default CategoryHeader;
