import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";
const thunkMiddleware = require("redux-thunk").default;

const initial_State = {};
const middleware = [thunk];

const store = createStore(
  rootReducer,
  initial_State,
  applyMiddleware(thunkMiddleware)
);

export default store;