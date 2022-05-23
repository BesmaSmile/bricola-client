import {constants} from './actions';

const initialState = {
  loading: true,
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case constants.CONFIRM_PHONE_NUMBER:
      return {
        ...state,
        confirmationResult: action.confirmationResult,
      };
    case constants.SIGN_IN:
      return {
        ...state,
        auth: action.auth,
        loading: false,
      };
    case constants.SIGN_OUT:
      return {};
    case constants.GET_INFOS:
      return {
        ...state,
        user: action.user,
        loading: false,
      };
    default:
      return state;
  }
}

export const getConfirmationResult = state => state.confirmationResult;
export const getUser = state => state.user;
export const getAuth = state => state.auth;
export const isLoading = state => state.loading;
export default userReducer;
