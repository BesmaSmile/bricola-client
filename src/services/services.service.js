import {actions} from 'src/store/reducers/actions';
import api from 'src/constants/api';
import handleResponse from 'src/helpers/handleResponse';

export default {
  loadServices,
  getServiceImage,
};

function loadServices(auth) {
  const requestUrl = `${api.bricolaApiUrl}/service/get_all`;
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
        dispatch(actions.loadServices(data));
        return data;
      })
      .catch(error => {
        console.log(error);
        throw 'Echec de chargement de données !';
      });
  };
}

function getServiceImage(imageName) {
  return `${api.bricolaApiUrl}/service/image/${imageName}`;
}
