import React, {useState, useRef, useEffect} from 'react';
import {View, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import colors from 'src/constants/colors';
import sizes from 'src/constants/sizes';
import Icon from 'src/components/Icon';
import AuthLayout from 'src/layouts/AuthLayout';
import SelectPicker from 'src/components/SelectPicker';
import {containers, inputs} from 'src/assets/styles';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import userService from 'src/services/user.service';
import referentialService from 'src/services/referential.service';
import {getProvinces} from 'src/store/reducers/referentialReducer';
import {useRequestState} from 'src/tools/hooks';

const CompleteInformationsScreen = props => {
  const firstnameInput = useRef();
  const lastnameInput = useRef();
  const passwordInput = useRef();
  const passwordConfirmationInput = useRef();

  const {phoneNumber, idToken} = props.route.params;
  const {provinces, loadProvinces} = props;
  const provincesList = (provinces || [])
    .map(province => ({
      value: province._id,
      label: province.name,
    }))
    .sort((p1, p2) => (p1.label < p2.label ? -1 : 1));

  const [userInfos, setUserInfos] = useState({
    phoneNumber: phoneNumber.value,
    idToken,
  });

  const signUpRequest = useRequestState();

  const [passwordVisible, setPasswordVisible] = useState(false);

  useEffect(() => {
    if (!provinces) {
      loadProvinces();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function _handleChange(key, value) {
    setUserInfos({
      ...userInfos,
      [key]: value,
    });
  }

  function togglePasswordVisibility() {
    setPasswordVisible(!passwordVisible);
  }

  function _sendOnClick(e) {
    signUpRequest.sendRequest(() => props.signUp(userInfos));
  }

  const form = (
    <>
      <View
        style={[containers.input_container, containers.light_shadow_container]}>
        <TextInput
          style={inputs.default}
          value={userInfos.lastname}
          ref={lastnameInput}
          placeholder="Nom"
          onChangeText={value => _handleChange('lastname', value)}
          onSubmitEditing={() => firstnameInput.current.focus()}
        />
      </View>
      <View
        style={[containers.input_container, containers.light_shadow_container]}>
        <TextInput
          style={inputs.default}
          value={userInfos.firstname}
          ref={firstnameInput}
          placeholder="Prénom"
          onChangeText={value => _handleChange('firstname', value)}
          onSubmitEditing={() => passwordInput.current.focus()}
        />
      </View>

      <View
        style={[containers.input_container, containers.light_shadow_container]}>
        <TextInput
          style={inputs.default}
          value={userInfos.password}
          secureTextEntry={!passwordVisible}
          ref={passwordInput}
          placeholder="Mot de passe"
          onChangeText={value => _handleChange('password', value)}
          onSubmitEditing={() => passwordConfirmationInput.current.focus()}
        />
        <TouchableOpacity
          style={styles.show_password_button}
          disabled={signUpRequest.pending}
          onPress={togglePasswordVisibility}>
          <Icon
            viewBox="0 0 24 24"
            width="30px"
            height="25px"
            name={passwordVisible ? 'hide' : 'show'}
            fill={colors.blue}
          />
        </TouchableOpacity>
      </View>
      <View
        style={[containers.input_container, containers.light_shadow_container]}>
        <TextInput
          style={inputs.default}
          value={userInfos.password_confirmation}
          secureTextEntry={!passwordVisible}
          ref={passwordConfirmationInput}
          placeholder="Confirmer le mot de passe"
          onChangeText={value => _handleChange('password_confirmation', value)}
          onSubmitEditing={_sendOnClick}
        />
      </View>
      <View
        style={[containers.input_container, containers.light_shadow_container]}>
        <SelectPicker
          onChange={value => _handleChange('province', value)}
          items={provincesList}
          placeholder="Wilaya"
          selectedValue={userInfos.province}
        />
      </View>
    </>
  );
  return (
    <AuthLayout
      title="Complétez votre inscription"
      form={form}
      sendButton={{text: 'Envoyer', onClick: _sendOnClick}}
      pending={signUpRequest.pending}
      pendingMessage="Inscription en cours..."
      errorMessage={signUpRequest.error}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    marginLeft: 5,
    fontSize: sizes.defaultTextSize,
    textAlignVertical: 'center',
    padding: 0,
  },
});

const mapStateToProps = state => ({
  provinces: getProvinces(state.referential),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      signUp: userService.signUp,
      loadProvinces: referentialService.loadProvinces,
    },
    dispatch,
  );
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CompleteInformationsScreen);
