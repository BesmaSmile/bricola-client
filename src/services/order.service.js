import api from 'src/constants/api';
import handleResponse from 'src/helpers/handleResponse';
import {actions} from 'src/store/reducers/actions';
import _ from 'lodash';

export default {
  getNearestPartners,
  checkPromoCode,
  requestPartner,
  loadOrders,
  respondToSuggestion,
  rateOrder,
  // cancelOrder,
};

function getNearestPartners(auth, coordinates, serviceId) {
  const requestUrl = `${api.bricolaApiUrl}/partner/nearest`;
  const requestOptions = {
    method: 'POST',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...coordinates,
      serviceId,
    }),
  };

  return fetch(requestUrl, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error);
      throw 'Echec de chargement les partenaires proches de vous !';
    });
}

function checkPromoCode(auth, code, serviceId) {
  const requestUrl = `${api.bricolaApiUrl}/promocode/check/${code}`;
  const requestOptions = {
    method: 'POST',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({serviceId}),
  };
  return fetch(requestUrl, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error);
      let message = '';
      switch (error.code) {
        case 'not_found':
          message = "Votre code n'est pas valide !";
          break;
        case 'expired':
          message = 'Le code que vous voulez utiliser a expiré !';
          break;
        default:
          message = 'Une erreur est survenue !';
      }
      throw message;
    });
}

async function requestPartner(auth, request) {
  const requestUrl = `${api.bricolaApiUrl}/order/request`;
  const toSend = _.cloneDeep(request);

  toSend.position.coordinate = [
    toSend.position.coordinate.longitude,
    toSend.position.coordinate.latitude,
  ];
  if (toSend.destination) {
    toSend.destination.coordinate = [
      toSend.destination.coordinate.longitude,
      toSend.destination.coordinate.latitude,
    ];
  }
  const body = {
    ...toSend,
    client: auth._id,
  };
  const requestOptions = {
    method: 'POST',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  };
  return fetch(requestUrl, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error);
      throw 'Une erreur est survenue ! ';
    });
}

function loadOrders(auth) {
  const requestUrl = `${api.bricolaApiUrl}/order/get_own`;
  const requestOptions = {
    method: 'GET',
    headers: {
      authorization: `Bearer ${auth.token}`,
    },
  };
  return dispatch => {
    return fetch(requestUrl, requestOptions)
      .then(handleResponse)
      .then(orders => {
        dispatch(
          actions.loadOrders(
            orders.sort(
              (o1, o2) => new Date(o2.createdAt) - new Date(o1.createdAt),
            ),
          ),
        );
        return orders;
      })
      .catch(error => {
        console.log(error);
        throw 'Echec de chargement des commandes';
      });
  };
}

function respondToSuggestion(auth, orderId, price, accepted) {
  const requestUrl = `${
    api.bricolaApiUrl
  }/order/respond_to_suggestion/${orderId}`;
  const requestOptions = {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      price,
      accepted,
    }),
  };

  return fetch(requestUrl, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error);
      throw "Echec d'envoi de votre réponse!";
    });
}

function rateOrder(auth, orderId, rating) {
  const requestUrl = `${api.bricolaApiUrl}/order/rate/${orderId}`;
  const requestOptions = {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      rating,
    }),
  };

  return fetch(requestUrl, requestOptions)
    .then(handleResponse)
    .catch(error => {
      console.log(error);
      throw "Echec d'envoi de la note d'évaluation!";
    });
}

/* function cancelOrder(auth, orderId) {
  const requestUrl = `${api.bricolaApiUrl}/order/cancel_by_client/${orderId}`;
  const requestOptions = {
    method: 'PUT',
    headers: {
      authorization: `Bearer ${auth.token}`,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  return dispatch => {
    return fetch(requestUrl, requestOptions)
      .then(handleResponse)
      .then(order => {
        dispatch(actions.cancelOrder(order));
      })
      .catch(error => {
        console.log(error);
        throw "Echec d'annulation de la commande!";
      });
  };
}
*/
