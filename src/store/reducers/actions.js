export const constants = {
  CONFIRM_PHONE_NUMBER: 'CONFIRM_PHONE_NUMBER',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT',

  GET_INFOS: 'GET_INFOS',
  LOAD_SERVICES: 'LOAD_SERVICES',
  LOAD_FAVORITE: 'LOAD_FAVORITE',
  ADD_TO_FAVORITE: 'ADD_TO_FAVORITE',
  REMOVE_FROM_FAVORITE: 'REMOVE_FROM_FAVORITE',

  LOAD_ORDERS: 'LOAD_ORDERS',
  LOAD_PROVINCES: 'LOAD_PROVINCES',

  // CANCEL_ORDER: 'CANCEL_ORDER',

  LOAD_PUBLICATIONS: 'LOAD_PUBLICATIONS',
};

export const actions = {
  confirmPhoneNumber,
  signIn,
  getInfos,
  signOut,
  loadServices,
  loadFavorite,
  addToFavorite,
  removeFromFavorite,
  loadOrders,
  loadProvinces,
  // cancelOrder,
  loadPublications,
};

function confirmPhoneNumber(confirmationResult) {
  return {
    type: constants.CONFIRM_PHONE_NUMBER,
    confirmationResult: confirmationResult,
  };
}

function signIn(auth) {
  return {
    type: constants.SIGN_IN,
    auth,
  };
}

function getInfos(user) {
  return {
    type: constants.GET_INFOS,
    user,
  };
}

function signOut() {
  return {
    type: constants.SIGN_OUT,
  };
}

function loadServices(services) {
  return {
    type: constants.LOAD_SERVICES,
    services: services,
  };
}

function loadFavorite(favorite) {
  return {
    type: constants.LOAD_FAVORITE,
    favorite,
  };
}

function addToFavorite(service) {
  return {
    type: constants.ADD_TO_FAVORITE,
    service,
  };
}

function removeFromFavorite(service) {
  return {
    type: constants.REMOVE_FROM_FAVORITE,
    service,
  };
}

function loadOrders(orders) {
  return {
    type: constants.LOAD_ORDERS,
    orders,
  };
}

function loadProvinces(provinces) {
  return {
    type: constants.LOAD_PROVINCES,
    provinces,
  };
}

/* function cancelOrder(order) {
  return {
    type: constants.CANCEL_ORDER,
    order,
  };
} */

function loadPublications(publications) {
  return {
    type: constants.LOAD_PUBLICATIONS,
    publications,
  };
}
