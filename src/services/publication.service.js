import {actions} from 'src/store/reducers/actions';
import api from 'src/constants/api';
import handleResponse from 'src/helpers/handleResponse';

export default {
  loadPublications,
  getPublicationImage,
};

function loadPublications(auth) {
  const requestUrl = `${api.bricolaApiUrl}/publication/get_all`;
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
        dispatch(actions.loadPublications(data));
        return data;
      })
      .catch(error => {
        console.log(error);
        throw 'Echec de chargement de données !';
      });
  };
}

function getPublicationImage(imageName) {
  return `${api.bricolaApiUrl}/publication/image/${imageName}`;
}
