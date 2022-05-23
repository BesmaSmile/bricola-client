import {constants} from './actions';

function referentialReducer(state = {}, action) {
  switch (action.type) {
    case constants.LOAD_PROVINCES:
      return {
        ...state,
        provinces: action.provinces,
      };

    default:
      return state;
  }
}

export const getProvinces = state => state.provinces;
export default referentialReducer;
