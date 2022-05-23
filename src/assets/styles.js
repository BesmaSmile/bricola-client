import {StyleSheet} from 'react-native';
import colors from 'src/constants/colors';
import sizes from 'src/constants/sizes';

const containers = StyleSheet.create({
  input_container: {
    flexDirection: 'row',
    backgroundColor: colors.light,
    alignItems: 'center',
    borderRadius: 5,
    height: 45,
    padding: sizes.smallSpace,
    margin: sizes.smallSpace,
  },
  link_container: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: sizes.smallSpace,
  },
  strong_shadow_container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    elevation: 8,
  },
  light_shadow_container: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
});

const buttons = StyleSheet.create({
  primary: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: 45,
    margin: sizes.smallSpace,
    backgroundColor: colors.blue,
  },
});

const fonts = StyleSheet.create({
  big: {
    fontSize: sizes.largeText,
  },
  large: {
    fontSize: sizes.mediumText,
  },
  default: {
    fontSize: sizes.defaultTextSize,
  },
  small: {
    fontSize: sizes.smallText,
  },
  light: {
    fontWeight: '300',
  },
  medium: {
    fontWeight: '500',
  },
  bold: {
    fontWeight: 'bold',
  },
  cblack: {
    color: colors.black,
  },
  cblue: {
    color: colors.blue,
  },
  clightblue: {
    color: colors.lightblue,
  },
  cred: {
    color: colors.red,
  },
  cwhite: {
    color: '#fff',
  },
  clight: {
    color: colors.light,
  },
  clightgrey: {
    color: colors.lightgrey,
  },
  cstronggrey: {
    color: colors.stronggrey,
  },

  bblack: {
    backgroundColor: colors.black,
  },
  bblue: {
    backgroundColor: colors.blue,
  },
  blightblue: {
    backgroundColor: colors.lightblue,
  },
  bred: {
    backgroundColor: colors.red,
  },
  bwhite: {
    backgroundColor: '#fff',
  },
  blight: {
    backgroundColor: colors.light,
  },
  blightgrey: {
    backgroundColor: colors.lightgrey,
  },
  bstronggrey: {
    backgroundColor: colors.stronggrey,
  },
  underline: {
    textDecorationLine: 'underline',
  },
});

const inputs = StyleSheet.create({
  country_code: {
    color: colors.grey,
    fontSize: sizes.defaultTextSize,
  },
  default: {
    flex: 1,
    marginLeft: 5,
    fontSize: sizes.defaultTextSize,
    textAlignVertical: 'center',
    padding: 0,
    color: colors.textColorDefault,
  },
});

export {containers, buttons, fonts, inputs};
