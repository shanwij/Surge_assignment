import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { updatePassword } from "../../actions/authActions";
import classnames from "classnames";

class Password extends Component {
  constructor() {
    super();
    this.state = {
      password: "",
      password2: "",
      errors: {}
    };
  }

componentDidMount() {
  if (this.props.auth.isAuthenticated) {
    this.props.history.push("/psswrd");
  }
} 

componentWillReceiveProps(nextProps) {
if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

onChange = e => {
    this.setState({ [e.target.id]: e.target.value });
  };
onSubmit = e => {
    e.preventDefault();
const userData = {
      password: this.state.password
    };
console.log(userData);
this.props.updatePassword(userData);
};

render() {
    const { errors } = this.state;
return (
      <div className="container">
        <div style={{ marginTop: "4rem" }} className="row">
          <div className="col s8 offset-s2">
            <Link to="/dashboard" className="btn-flat waves-effect white-text">
              <i className="material-icons left">keyboard_backspace</i>home
            </Link>
            <div className="col s12" style={{ paddingLeft: "250px" }}>
              <h4>
                <b>Change Password</b>
              </h4>
            </div>
            <form noValidate onSubmit={this.onSubmit}>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.password}
                  error={errors.password}
                  id="password"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password || errors.passwordincorrect
                  })}
                />
                <label htmlFor="password">Password</label>
                <span className="red-text">
                  {errors.password}
                  {errors.passwordincorrect}
                </span>
              </div>
              <div className="input-field col s12">
                <input
                  onChange={this.onChange}
                  value={this.state.password2}
                  error={errors.password2}
                  id="password2"
                  type="password"
                  className={classnames("", {
                    invalid: errors.password || errors.passwordincorrect
                  })}
                />
                <label htmlFor="password2">Comfirm Password</label>
                <span className="red-text">
                  {errors.password}
                  {errors.passwordincorrect}
                </span>
              </div>
              <div className="col s12" style={{ paddingLeft: "11.250px" }}>
                <button
                  style={{
                    width: "150px",
                    borderRadius: "3px",
                    letterSpacing: "1.5px",
                    marginTop: "1rem"
                  }}
                  type="submit"
                  className="btn btn-large waves-effect waves-light hoverable green accent-3"
                >
                  Change
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}
Password.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});

export default connect(
  mapStateToProps,
  { updatePassword }
)(Password);