import {actions} from 'src/store/reducers/actions';
import api from 'src/constants/api';
import handleResponse from 'src/helpers/handleResponse';

export default {
  loadProvinces,
};

function loadProvinces() {
  const requestUrl = `${api.bricolaApiUrl}/public/provinces`;
  return dispatch => {
    return fetch(requestUrl)
      .then(handleResponse)
      .then(result => dispatch(actions.loadProvinces(result.provinces)))
      .catch(error => {
        console.log(error);
        throw 'Echec de chargement de la liste des wilayas !';
      });
  };
}
