import {constants} from './actions';

function publicationReducer(state = {}, action) {
  switch (action.type) {
    case constants.LOAD_PUBLICATIONS:
      return {
        ...state,
        pending: false,
        publications: action.publications,
      };

    default:
      return state;
  }
}

export const getPublications = state => state.publications;
export default publicationReducer;
