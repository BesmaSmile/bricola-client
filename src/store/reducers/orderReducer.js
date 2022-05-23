import {constants} from './actions';

function orderReducer(state = {}, action) {
  switch (action.type) {
    case constants.LOAD_ORDERS:
      return {
        ...state,
        orders: action.orders,
      };
    /* case constants.CANCEL_ORDER:
      return {
        ...state,
        orders: state.orders.map(order =>
          order._id === action.order._id ? action.order : order,
        ),
      }; */
    default:
      return state;
  }
}

export const getOrders = state => state.orders;

export default orderReducer;
