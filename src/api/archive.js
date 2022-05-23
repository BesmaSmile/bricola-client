import {actions} from 'src/store/reducers/actions';
import api from 'src/constants/api';

export function loadArchivedServices(phoneNumber) {
  const requestUrl =
    api.bricolaApiUrl + '/api/archive?numeroTelephone=' + phoneNumber;
  return dispatch => {
    dispatch(actions.loadArchivedServicesPending());
    fetch(requestUrl)
      .then(response => response.json())
      .then(response => {
        if (response.error) {
          throw response.error;
        }
        dispatch(actions.loadArchivedServicesSuccess(response));
        return response;
      })
      .catch(error => {
        console.log(error);
        dispatch(actions.loadArchivedServicesError(error));
      });
  };
}

export function addToArchive(phoneNumber, service) {
  const requestUrl =
    api.bricolaApiUrl + '/api/archive?numeroTelephone=' + phoneNumber;
  return dispatch => {
    dispatch(actions.updateArchivePending());
    fetch(requestUrl, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({serviceId: service._id}),
    })
      .then(response => {
        if (response.error) {
          throw response.error;
        }
        if (response.ok) {
          dispatch(actions.addToArchiveSuccess(service));
          return response;
        }
      })
      .catch(error => {
        console.log(error);
        dispatch(actions.updateArchiveError(error));
      });
  };
}

export function removeFromArchive(phoneNumber, service) {
  const requestUrl =
    api.bricolaApiUrl + '/api/archive?numeroTelephone=' + phoneNumber;
  return dispatch => {
    dispatch(actions.updateArchivePending());
    fetch(requestUrl, {
      method: 'DELETE',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({serviceId: service._id}),
    })
      .then(response => response)
      .then(response => {
        if (response.error) {
          throw response.error;
        }
        if (response.ok) {
          dispatch(actions.removeFromArchiveSuccess(service));
          return response;
        }
      })
      .catch(error => {
        dispatch(actions.updateArchiveError(error));
      });
  };
}
