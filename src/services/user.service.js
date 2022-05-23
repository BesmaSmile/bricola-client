import api from 'src/constants/api';
import handleResponse from 'src/helpers/handleResponse';
import {actions} from 'src/store/reducers/actions';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

export default {
  confirmPhoneNumber,
  getCurrentUser,
  signIn,
  signUp,
  signOut,
  storeToken,
  getInfos,
};

function _checkPhoneNumber(phoneNumber) {
  const requestUrl = `${api.bricolaApiUrl}/user/check_phone`;
  return fetch(requestUrl, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({phoneNumber, role: 'Client'}),
  })
    .then(handleResponse)
    .catch(error => {
      console.log(error);
      throw 'Echec de vérification de votre numéro de téléphone';
    });
}
function confirmPhoneNumber(phoneNumber) {
  return dispatch => {
    return _checkPhoneNumber(phoneNumber).then(result => {
      if (result.exists) {
        throw 'Un compte existe déja avec ce numéro de téléphone';
      } else {
        return auth()
          .signInWithPhoneNumber(phoneNumber)
          .then(confirmation => {
            dispatch(actions.confirmPhoneNumber(confirmation));
            return confirmation;
          })
          .catch(error => {
            console.log(error);
            throw 'Echec de connexion !';
          });
      }
    });
  };
}

function getCurrentUser() {
  return auth().currentUser;
}

function signIn(phoneNumber, password) {
  const requestUrl = `${api.bricolaApiUrl}/user/login`;
  return dispatch => {
    return fetch(requestUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({phoneNumber, password, role: 'Client'}),
    })
      .then(handleResponse)
      .then(data => {
        dispatch(actions.signIn(data));
        return data;
      })
      .catch(error => {
        console.log(error);
        let message = '';
        switch (error.field) {
          case 'phoneNumber':
            switch (error.code) {
              case 'invalid_phone_number':
                message = 'Numéro de téléphone invalide';
                break;
              default:
                message = 'Ehec de connexion';
            }
            break;
          default:
            switch (error.code) {
              case 'incorrect_credentials':
                message = 'Numéro de téléphone ou mot de passe incorrecte';
                break;
              default:
                message = 'Ehec de connexion';
            }
        }
        throw message;
      });
  };
}

function signUp(userInfos) {
  const requestUrl = `${api.bricolaApiUrl}/client/register`;
  return dispatch => {
    return fetch(requestUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userInfos),
    })
      .then(handleResponse)
      .then(data => {
        dispatch(actions.signIn(data));
        return data;
      })
      .catch(error => {
        console.log(error);
        let message = '';
        switch (error.field) {
          case 'phoneNumber':
            switch (error.code) {
              case 'invalid_phoneNumber':
                message = 'Numéro de téléphone invalide';
                break;
              case 'existing_phoneNumber':
                message = 'Le numéro de téléphone est utilisé';
                break;
              default:
                message = "Ehec d'inscription";
            }
            break;
          case 'password':
            switch (error.code) {
              case 'mismatched_password':
                message = 'Le mot de passe ne correspond pas';
                break;
              case 'short_password':
                message = 'Le mot de passe require 8 caractère';
                break;
              case 'weak_password':
                message = 'Mot de passe faible';
                break;
              default:
                message = "Ehec d'inscription";
            }
            break;
          default:
            switch (error.code) {
              case 'invalid_token':
                message = 'La validation de votre numéro de téléphone a échoué';
                break;
              default:
                message = "Ehec d'inscription";
            }
        }
        throw message;
      });
  };
}

function _dispatchSignOut(dispatch) {
  if (auth().currentUser) {
    auth()
      .signOut()
      .then(() => {
        dispatch(actions.signOut());
      });
  } else {
    dispatch(actions.signOut());
  }
}
function signOut() {
  return dispatch => {
    _dispatchSignOut(dispatch);
  };
}

function storeToken(userAuth) {
  messaging()
    .getToken()
    .then(async fcmToken => {
      if (fcmToken) {
        await _storeToken(userAuth, fcmToken);
      }
    });

  return messaging().onTokenRefresh(token => {
    _storeToken(userAuth, token).then(() => console.log('token stored'));
  });
}

function _storeToken(userAuth, token) {
  const requestUrl = `${api.bricolaApiUrl}/user/token`;
  const requestOptions = {
    method: 'POST',
    headers: {
      authorization: `Bearer ${userAuth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({token}),
  };
  return fetch(requestUrl, requestOptions)
    .then(handleResponse)
    .then(response => {
      return response;
    })
    .catch(error => {
      console.log(error);
    });
}

function getInfos(userAuth) {
  const requestUrl = `${api.bricolaApiUrl}/user/get_infos`;
  return dispatch => {
    return fetch(requestUrl, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        authorization: `Bearer ${userAuth.token}`,
      },
    })
      .then(handleResponse)
      .then(data => {
        dispatch(actions.getInfos(data));
        return data;
      })
      .catch(error => {
        console.log(error);
        if (error.code === 'unauthorized') {
          _dispatchSignOut(dispatch);
        } else {
          throw 'Echec de chargement des données utilisateurs';
        }
      });
  };
}
