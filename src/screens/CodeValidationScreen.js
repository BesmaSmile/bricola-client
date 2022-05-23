import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableHighlight,
} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {getConfirmationResult} from 'src/store/reducers/userReducer';
import auth from '@react-native-firebase/auth';

import Loading from 'src/components/Loading';
import colors from 'src/constants/colors';
import sizes from 'src/constants/sizes';
import Icon from 'src/components/Icon';
import userService from 'src/services/user.service';

const CodeValidationScreen = props => {
  const [code, setCode] = useState({
    value: [undefined, undefined, undefined, undefined, undefined, undefined],
    validated: false,
    invalid: false,
    automaticallyVerified: true,
  });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState();
  const {phoneNumber} = props.route.params;

  useEffect(() => {
    const authUnsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        auth()
          .currentUser.getIdTokenResult()
          .then(idTokenResult => {
            setCode({
              ...code,
              validated: true,
            });
            auth()
              .signOut()
              .then(() => {
                setTimeout(() => {
                  //props.signIn( ()=>{
                  props.navigation.replace('CompleteInformations', {
                    phoneNumber,
                    idToken: idTokenResult.token,
                  });
                  //})
                }, 2000);
              });
          });
      }
    });
    return authUnsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  let codeInputs = [];

  const inputBorderStyle = code.validated
    ? {
        borderColor: 'green',
        borderWidth: 2,
      }
    : code.invalid && !pending
    ? {
        borderColor: 'red',
        borderWidth: 2,
      }
    : {
        borderColor: '#eee',
      };

  function _handleCodeChange(value, index) {
    const cleaned = value.replace(/\D/g, '');
    setCode({
      ...code,
      value: _updateCode(index, cleaned),
    });

    if (cleaned.length === 1 && index !== 5) {
      codeInputs[index + 1].focus();
    }
  }

  function _updateCode(index, value) {
    return code.value.map((item, i) => (index === i ? value : item));
  }

  function _sendOnClick() {
    setPending(true);
    setError(undefined);
    setCode({
      ...code,
      automaticallyVerified: false,
    });

    props.confirmation
      .confirm(code.value.join(''))
      .then(user => {
        setPending(false);
        setCode({
          ...code,
          validated: true,
        });
      })
      .catch(err => {
        console.log(err);
        let message = '';
        let invalidCode = false;
        switch (err.code) {
          case 'auth/invalid-verification-code':
            message = 'Code de vérification invalide';
            invalidCode = true;
            break;
          case 'auth/session-expired':
            message =
              'Le code de validation a expiré ! Veuillez renvoyer le code de validation';
            invalidCode = true;
            break;
          default:
            message = 'Echec de vérification !';
            break;
        }
        setPending(false);
        setError(message);
        setCode({
          ...code,
          invalid: invalidCode,
        });
      });
  }

  return (
    <View style={styles.main_container}>
      <View style={styles.logo_container}>
        <Text style={styles.logo_text}>Bricola</Text>
      </View>

      <View style={styles.response_container}>
        {error && <Text style={styles.error_message}>{error}</Text>}
        {pending && (
          <>
            <Loading />
            <Text style={styles.pending_message}>
              Vérification en cours du code
            </Text>
          </>
        )}
        {code.validated && (
          <View style={styles.validated_code_container}>
            <View style={styles.validated_code}>
              <Icon
                viewBox="0 0 32 32"
                width="25px"
                height="25px"
                name="correct"
                fill="green"
              />
            </View>
          </View>
        )}
      </View>
      <View style={styles.form_container}>
        <View style={styles.text_container}>
          <Text style={styles.text}>Entrez le code</Text>
          <Text style={styles.phone_text}>+213 {phoneNumber.text}</Text>
        </View>
        <View style={styles.input_container}>
          <TextInput
            style={[styles.text_input, styles.margin_input, inputBorderStyle]}
            keyboardType={'number-pad'}
            maxLength={1}
            ref={input => {
              codeInputs[0] = input;
            }}
            value={code.value[0]}
            onChangeText={value => _handleCodeChange(value, 0)}
            onSubmitEditing={() => {}}
          />
          <TextInput
            style={[styles.text_input, styles.margin_input, inputBorderStyle]}
            keyboardType={'number-pad'}
            maxLength={1}
            ref={input => {
              codeInputs[1] = input;
            }}
            value={code.value[1]}
            onChangeText={value => _handleCodeChange(value, 1)}
            onSubmitEditing={() => {}}
          />
          <TextInput
            style={[styles.text_input, styles.margin_input, inputBorderStyle]}
            keyboardType={'number-pad'}
            maxLength={1}
            ref={input => {
              codeInputs[2] = input;
            }}
            value={code.value[2]}
            onChangeText={value => _handleCodeChange(value, 2)}
            onSubmitEditing={() => {}}
          />
          <TextInput
            style={[styles.text_input, styles.margin_input, inputBorderStyle]}
            keyboardType={'number-pad'}
            maxLength={1}
            ref={input => {
              codeInputs[3] = input;
            }}
            value={code.value[3]}
            onChangeText={value => _handleCodeChange(value, 3)}
            onSubmitEditing={() => {}}
          />
          <TextInput
            style={[styles.text_input, styles.margin_input, inputBorderStyle]}
            keyboardType={'number-pad'}
            maxLength={1}
            ref={input => {
              codeInputs[4] = input;
            }}
            value={code.value[4]}
            onChangeText={value => _handleCodeChange(value, 4)}
            onSubmitEditing={() => {}}
          />
          <TextInput
            style={[styles.text_input, inputBorderStyle]}
            keyboardType={'number-pad'}
            maxLength={1}
            ref={input => {
              codeInputs[5] = input;
            }}
            value={code.value[5]}
            onChangeText={value => _handleCodeChange(value, 5)}
            onSubmitEditing={_sendOnClick}
          />
        </View>

        <TouchableHighlight style={styles.send_button} onPress={_sendOnClick}>
          <Text style={styles.send_text}>Envoyer</Text>
        </TouchableHighlight>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  main_container: {
    backgroundColor: colors.backgroundColor,
    flex: 1,
  },
  logo_container: {
    flex: 1,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
  logo_text: {
    fontSize: sizes.largeText,
    fontWeight: 'bold',
    color: colors.darkColor,
  },
  phone_text: {
    marginTop: sizes.mediumSpace,
    color: colors.mainColor,
    fontSize: sizes.mediumText,
    fontWeight: 'bold',
  },
  response_container: {
    flex: 1,
    margin: sizes.mediumSpace,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pending_message: {
    fontSize: sizes.smallText,
    color: colors.disabledColor,
  },
  error_message: {
    color: 'red',
    fontSize: sizes.smallText,
  },
  form_container: {
    marginTop: sizes.mediumSpace,
    flex: 5,
  },
  text_container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: sizes.largSpace,
  },
  validated_text: {
    fontSize: sizes.defaultTextSize,
    color: colors.greenColor,
    textAlign: 'center',
  },
  text: {
    fontSize: sizes.defaultTextSize,
    color: colors.disabledColor,
    textAlign: 'center',
  },
  input_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 42,
    margin: sizes.smallSpace,
  },
  text_input: {
    flex: 1,
    backgroundColor: '#fff',
    fontSize: sizes.defaultTextSize,
    fontWeight: 'bold',
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#eee',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  margin_input: {
    marginRight: sizes.smallSpace,
  },
  validated_code_container: {
    margin: sizes.mediumSpace,
    justifyContent: 'center',
    alignItems: 'center',
  },
  validated_code: {
    height: 50,
    width: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'green',
  },

  send_button: {
    backgroundColor: colors.darkColor,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: 45,
    margin: 10,
  },
  send_text: {
    fontSize: sizes.defaultTextSize,
    color: colors.lightColor,
  },
});

const mapStateToProps = state => ({
  confirmation: getConfirmationResult(state.user),
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      signIn: userService.signIn,
      signOut: userService.signOut,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CodeValidationScreen);
