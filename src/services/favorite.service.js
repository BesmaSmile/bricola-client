import {actions} from 'src/store/reducers/actions';
import api from 'src/constants/api';
import handleResponse from 'src/helpers/handleResponse';

export default {
  loadFavorite,
  addToFavorite,
  removeFromFavorite,
};

function loadFavorite(auth) {
  const requestUrl = `${api.bricolaApiUrl}/favorite/get`;
  const requestOptions = {
    method: 'GET',
    headers: {
      authorization: `Bearer ${auth.token}`,
    },
  };
  return dispatch => {
    return fetch(requestUrl, requestOptions)
      .then(handleResponse)
      .then(data => {
        dispatch(actions.loadFavorite(data));
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  };
}

function addToFavorite(auth, service) {
  const requestUrl = `${api.bricolaApiUrl}/favorite/add`;
  const requestOptions = {
    method: 'POST',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({serviceId: service._id}),
  };
  return dispatch => {
    return fetch(requestUrl, requestOptions)
      .then(handleResponse)
      .then(response => {
        dispatch(actions.addToFavorite(service));
        return response;
      })
      .catch(error => {
        console.log(error);
      });
  };
}

function removeFromFavorite(auth, service) {
  const requestUrl = `${api.bricolaApiUrl}/favorite/delete`;
  const requestOptions = {
    method: 'POST',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({serviceId: service._id}),
  };
  return dispatch => {
    return fetch(requestUrl, requestOptions)
      .then(handleResponse)
      .then(data => {
        dispatch(actions.removeFromFavorite(service));
        return data;
      })
      .catch(error => {
        console.log(error);
      });
  };
}
