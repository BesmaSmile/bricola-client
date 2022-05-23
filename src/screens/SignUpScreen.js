import React, {useState, useRef} from 'react';
import {View, Text, TextInput} from 'react-native';
import AuthLayout from 'src/layouts/AuthLayout';
import {containers, inputs} from 'src/assets/styles';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import userService from 'src/services/user.service';
import {formatPhone, clean} from 'src/helpers/handlePhoneNumber';
import {useRequestState} from 'src/tools/hooks';

const SignUpScreen = props => {
  const phoneInput = useRef();

  const [_phoneNumber, _setPhoneNumber] = useState();
  const signUpRequest = useRequestState();

  const handlePhoneNumberChange = text => {
    signUpRequest.clearError();
    let formattedNumber;
    if (text && text.length > 0) {
      formattedNumber = formatPhone(text);
    } else {
      phoneInput.current.clear();
    }
    _setPhoneNumber(formattedNumber);
  };

  const sendOnClick = e => {
    const cleaned = clean(_phoneNumber);
    const phone = `+213${cleaned}`;
    const connectedUser = userService.getCurrentUser();
    if (connectedUser) {
      connectedUser.signOut();
    }
    signUpRequest.sendRequest(
      () => props.confirmPhoneNumber(phone),
      conf => {
        setTimeout(() => {
          const user = userService.getCurrentUser();
          if (!user) {
            props.navigation.replace('CodeValidation', {
              phoneNumber: {text: _phoneNumber, value: phone},
            });
          } else {
            console.log('user connected!');
          }
        }, 3000);
      },
    );
  };

  const linkOnClick = e => {
    props.navigation.goBack();
  };

  const isPhoneNumberValid = () => {
    return _phoneNumber?.length === 12;
  };

  const form = (
    <View
      style={[containers.input_container, containers.light_shadow_container]}>
      <Text style={inputs.country_code}>+213</Text>
      <TextInput
        style={inputs.default}
        value={_phoneNumber}
        ref={phoneInput}
        placeholder="Téléphone"
        keyboardType={'number-pad'}
        maxLength={12}
        onChangeText={handlePhoneNumberChange}
        onSubmitEditing={sendOnClick}
      />
    </View>
  );
  return (
    <AuthLayout
      title="Inscription à Bricola"
      subtitle="Aidez nous à vérifier votre numéro de téléphone"
      form={form}
      sendButton={{text: "S'inscrire", onClick: sendOnClick}}
      link={{
        text: 'Se connecter',
        description: 'Vous avez un compte ?',
        onClick: linkOnClick,
      }}
      pending={signUpRequest.pending}
      pendingMessage="Validation en cours..."
      errorMessage={signUpRequest.error}
    />
  );
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      confirmPhoneNumber: userService.confirmPhoneNumber,
    },
    dispatch,
  );

export default connect(
  () => {
    return {};
  },
  mapDispatchToProps,
)(SignUpScreen);
