import {constants} from './actions';

function favoriteReducer(state = {favorite: []}, action) {
  switch (action.type) {
    case constants.LOAD_FAVORITE:
      return {
        ...state,
        favorite: action.favorite,
      };
    case constants.ADD_TO_FAVORITE:
      return {
        ...state,
        favorite: [...state.favorite, action.service],
      };
    case constants.REMOVE_FROM_FAVORITE:
      return {
        ...state,
        favorite: state.favorite.filter(
          service => service._id !== action.service._id,
        ),
      };
    default:
      return state;
  }
}

export const getFavorite = state => state.favorite;

export default favoriteReducer;
