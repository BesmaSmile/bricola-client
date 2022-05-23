import {actions} from 'src/store/reducers/actions';
import api from 'src/constants/api';

export default {
  loadServices,
  getServiceImage,
};

export function loadServices(category) {
  const requestUrl = `${api.bricolaApiUrl}/api/services?category=${category}`;
  return dispatch => {
    fetch(requestUrl)
      .then(response => response.json())
      .then(response => {
        if (response.error) {
          console.log(response.error);
          throw response.error;
        }
        dispatch(actions.loadServices(response));
        return response;
      })
      .catch(error => {
        throw 'Echec de chargement de données !';
      });
  };
}

export function getServiceImage(imageName) {
  return api.bricolaApiUrl + '/api/images/' + imageName;
}
