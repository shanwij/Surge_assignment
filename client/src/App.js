import React from "react";
import { BrowserRouter as Router, Route, Switch} from "react-router-dom";

import './App.css';

import jwt_decode from "jwt-decode"; 
import setAuthToken from "./authToken/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import Navbar from "./components/layout/Navbar";
import Landing from "./components/layout/Landing";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Update from "./components/auth/Update";
import Password from "./components/auth/Password";

import { Provider } from "react-redux";
import store from "./store";
import PrivateRoute from "./components/PRoute";
import Dashboard from "./components/layout/Dashboard";


function App() {

  if (localStorage.jwtToken) {
  
    const token = localStorage.jwtToken;
    setAuthToken(token);
    const decoded = jwt_decode(token);
    store.dispatch(setCurrentUser(decoded));
    const currentTime = Date.now() / 1000; 
    
    if (decoded.exp < currentTime) {
      // Logout user
      store.dispatch(logoutUser());
      // Redirect to login
      window.location.href = "./login";
    }
  }

    return (
      <Provider store={store}>
      <Router>
        <div className="App">
          <Navbar/>
          <Route path="/" component = {Landing} exact />
          <Route path="/register" component = {Register} exact/>
          <Route path="/login" component={Login} exact/>
          <Route path="/update" component={Update} exact/>
          <Route path="/psswrd" component={Password} exact/>
          <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
          </Switch>
        </div>
      </Router>
      </Provider>
    );
  }
export default App;