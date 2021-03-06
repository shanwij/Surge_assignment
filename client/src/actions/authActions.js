import axios from "axios";
import setAuthToken from "../authToken/setAuthToken";
import jwt_decode from "jwt-decode";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  USER_LOADING
} from "./type";

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("http://localhost:5000/users/register", userData)
    .then(res => history.push("/login")) 
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//update user
export const updateUser = (userData, history) => dispatch => {
  axios
    .post("http://localhost:5000/users/update", userData)
    .then(res => history.push("/dashboard")) 
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const updatePassword = (userData, history) => dispatch => {
  axios
    .post("http://localhost:5000/users/psswrd", userData)
    .then(res => history.push("/dashboard")) 
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

export const loginUser = userData => dispatch => {
  axios
    .post("http://localhost:5000/users/login", userData)
    .then(res => {
      
      const { token } = res.data;
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decoded = jwt_decode(token);
      // Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
// Set log in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};
//load user
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
};

export const logoutUser = () => dispatch => {
  // Remove token from local storage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  dispatch(setCurrentUser({}));
};