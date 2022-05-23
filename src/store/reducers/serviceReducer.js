import {constants} from './actions';

function serviceReducer(state = {}, action) {
  switch (action.type) {
    case constants.LOAD_SERVICES:
      return {
        ...state,
        pending: false,
        services: action.services,
      };

    default:
      return state;
  }
}

export const getServices = state => state.services;
export default serviceReducer;
