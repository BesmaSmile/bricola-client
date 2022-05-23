import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import AuthLayout from 'src/layouts/AuthLayout';

import colors from 'src/constants/colors';
import Sizes from 'src/constants/sizes';
import Icon from 'src/components/Icon';
import {containers, inputs} from 'src/assets/styles';

import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import userService from 'src/services/user.service';
import {formatPhone, clean} from 'src/helpers/handlePhoneNumber';
import {useRequestState} from 'src/tools/hooks';

const SignInScreen = props => {
  const phoneInput = useRef();
  const passwordInput = useRef();
  const [_credentials, _setCredentials] = useState({});
  const [_passwordVisible, _setPasswordVisible] = useState(false);

  const signInRequest = useRequestState();

  const handlePhoneNumberChange = text => {
    signInRequest.clearError();
    let formattedNumber;
    if (text && text.length > 0) {
      formattedNumber = formatPhone(text);
    } else {
      phoneInput.current.clear();
    }
    _setCredentials({
      ..._credentials,
      phoneNumber: formattedNumber,
    });
  };

  const handlePasswordChange = password => {
    signInRequest.clearError();
    _setCredentials({
      ..._credentials,
      password,
    });
  };

  const togglePasswordVisibility = () => _setPasswordVisible(!_passwordVisible);

  const sendOnClick = e => {
    const cleaned = clean(_credentials.phoneNumber);
    const phone = `+213${cleaned}`;
    signInRequest.sendRequest(() => props.signIn(phone, _credentials.password));
  };

  const linkOnClick = e => {
    props.navigation.navigate('SignUp');
  };

  const isPhoneNumberValid = () => {
    return _credentials.phoneNumber?.length === 12;
  };

  const form = (
    <>
      <View
        style={[containers.input_container, containers.light_shadow_container]}>
        <Text style={inputs.country_code}>+213</Text>
        <TextInput
          style={inputs.default}
          value={_credentials.phoneNumber}
          ref={phoneInput}
          placeholder="Téléphone"
          keyboardType={'number-pad'}
          maxLength={12}
          onChangeText={handlePhoneNumberChange}
          onSubmitEditing={() => passwordInput.current.focus()}
        />
      </View>
      <View
        style={[containers.input_container, containers.light_shadow_container]}>
        <TextInput
          style={inputs.default}
          value={_credentials.password}
          secureTextEntry={!_passwordVisible}
          ref={passwordInput}
          placeholder="Mot de passe"
          onChangeText={handlePasswordChange}
          onSubmitEditing={sendOnClick}
        />
        <TouchableOpacity
          style={styles.show_password_button}
          disabled={signInRequest.pending || !isPhoneNumberValid()}
          onPress={togglePasswordVisibility}>
          <Icon
            viewBox="0 0 24 24"
            width="30px"
            height="25px"
            name={_passwordVisible ? 'hide' : 'show'}
            fill={colors.blue}
          />
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <AuthLayout
      title="Connectez vous à Bricola"
      form={form}
      sendButton={{text: 'Se connecter', onClick: sendOnClick}}
      link={{
        text: "S'inscrire",
        description: "Vous n'avez pas un compte ?",
        onClick: linkOnClick,
      }}
      pending={signInRequest.pending}
      pendingMessage="Connexion en cours..."
      errorMessage={signInRequest.error}
    />
  );
};

const styles = StyleSheet.create({
  country_code: {
    color: colors.grey,
    fontSize: Sizes.defaultTextSize,
  },
  input: {
    flex: 1,
    marginLeft: 5,
    fontSize: Sizes.defaultTextSize,
    textAlignVertical: 'center',
    padding: 0,
  },
});
const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      confirmPhoneNumber: userService.confirmPhoneNumber,
      signIn: userService.signIn,
    },
    dispatch,
  );

export default connect(
  () => {
    return {};
  },
  mapDispatchToProps,
)(SignInScreen);
