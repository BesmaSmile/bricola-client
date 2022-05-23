import React from 'react';
import {
  View,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
} from 'react-native';

import logo from 'src/assets/images/logo.png';
import Loading from 'src/components/Loading';
import colors from 'src/constants/colors';
import sizes from 'src/constants/sizes';
import {buttons, containers, fonts} from 'src/assets/styles';

const AuthLayout = props => {
  const {
    title,
    subtitle,
    form,
    sendButton,
    link,
    pending,
    pendingMessage,
    errorMessage,
  } = props;
  return (
    <View style={styles.main_container}>
      <ScrollView contentContainerStyle={styles.scroll_content}>
        <Image
          style={styles.background_top}
          source={require('src/assets/images/background_top.png')}
        />
        <Image
          style={styles.background_bottom}
          source={require('src/assets/images/background_bottom.png')}
        />

        <View style={styles.logo_container}>
          <Image style={styles.logo} source={logo} />
          <Text style={styles.bricola_text}>Bricola DZ</Text>
        </View>

        <View style={styles.head_container}>
          <Text style={styles.head_text}>{title}</Text>
          {subtitle && <Text style={styles.head_subtext}>{subtitle}</Text>}
        </View>

        <View style={styles.response_container}>
          {errorMessage && (
            <Text style={styles.error_message}>{errorMessage}</Text>
          )}
          {pending && (
            <Text style={styles.pending_message}>{pendingMessage}</Text>
          )}
        </View>
        <View style={styles.form_container}>
          {form}
          <TouchableHighlight
            style={[buttons.primary, containers.strong_shadow_container]}
            onPress={sendButton.onClick}
            disabled={pending}>
            <>
              {pending && <Loading size={25} />}
              {!pending && (
                <Text style={styles.button_text}>{sendButton.text}</Text>
              )}
            </>
          </TouchableHighlight>
          {link && (
            <View style={[containers.link_container, styles.bottom_container]}>
              <Text style={fonts.simple}>{link.description} </Text>
              <TouchableOpacity onPress={link.onClick}>
                <Text
                  style={[
                    fonts.underline,
                    fonts.clightblue,
                    fonts.bold,
                    styles.link_text,
                  ]}>
                  {link.text}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: '#fff',
    flex: 1,
  },
  scroll_content: {
    paddingLeft: 30,
    paddingRight: 30,
    flexGrow: 1,
  },
  head_container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  head_text: {
    fontSize: sizes.mediumText,
    color: colors.blue,
  },
  head_subtext: {
    fontSize: sizes.defaultTextSize,
    color: colors.stronggrey,
    textAlign: 'center',
    marginTop: sizes.smallSpace,
  },
  logo_container: {
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 40,
  },
  bricola_text: {
    fontSize: 20,
    marginTop: 10,
    color: colors.blue,
    fontFamily: 'segoe_ui_bold_italic',
  },
  logo: {
    width: 100,
    height: 100,
    margin: 5,
  },
  response_container: {
    margin: sizes.mediumSpace,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pending_message: {
    fontSize: sizes.smallText,
    color: colors.stronggrey,
  },
  error_message: {
    color: 'red',
    textAlign: 'center',
    lineHeight: 20,
    fontSize: sizes.smallText,
  },
  form_container: {
    marginTop: sizes.mediumSpace,
    flex: 1,
  },
  bottom_container: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 100,
    marginTop: sizes.mediumSpace,
  },
  country_code: {
    color: colors.grey,
    fontSize: sizes.defaultTextSize,
  },
  input: {
    flex: 1,
    marginLeft: 5,
    fontSize: sizes.defaultTextSize,
    textAlignVertical: 'center',
    padding: 0,
  },
  button_text: {
    fontSize: sizes.defaultTextSize,
    color: colors.light,
  },
  link_text: {
    marginTop: 5,
  },
  background_top: {
    position: 'absolute',
    top: 0,
    width: 150,
    height: 250,
    right: 0,
  },

  background_bottom: {
    position: 'absolute',
    bottom: -10,
    width: 250,
    height: 110,
    left: -10,
  },
});

export default AuthLayout;
