import { GET_ERRORS } from "../actions/type";
const initial_State = {};
export default function(state = initial_State, action) {
  switch (action.type) {
    case GET_ERRORS:
      return action.payload;
    default:
      return state;
  }
}