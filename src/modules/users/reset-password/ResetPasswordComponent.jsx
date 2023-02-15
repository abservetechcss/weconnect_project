import React, { Component, Fragment } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
} from "@mui/material";
import { FloatingLabel, Form } from "react-bootstrap";
import "../../../assets/scss/main.scss";
import google from "../../../assets/images/google.png";
import quote from "../../../assets/images/quote.png";
import user from "../../../assets/images/user.png";
import logo from "../../../assets/images/Group 970.svg";
import SimpleReactValidator from "simple-react-validator";
import { Link } from "react-router-dom";
import LoadingButton from "react-bootstrap-button-loader";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { successAlert, errorAlert } from "../../../js/alerts.js";
import { backendURL } from "../../../variables/appVariables.jsx";
import { api } from "../../../js/api.js";
import "../../../assets/scss/main.scss";

export class ResetPasswordComponent extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {
        email: "Invalid email address",
      },
    });
    this.state = {
      alert: null,
      loading: false,
      passwordToggle: true,
      passwordToggle1: true,
      user: {
        new_password: "",
        confirm_password: "",
        user_id: "",
      },
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  handleSave = () => {
    var _this = this;
    let temObj = JSON.parse(JSON.stringify(_this.state.user));
    if (window.location.href.includes("/reset-password/")) {
      let linkUrl = window.location.href.split("/reset-password/");
      let data = linkUrl && linkUrl.length > 0 && linkUrl[1].split("/");
      temObj.user_id = data[data.length - 1];
      var url = `${backendURL}resetpassword`;
      if (_this.validator.allValid()) {
        _this.setState({ loading: true });
        api
          .post(url, temObj)
          .then(function (res) {
            if (res.status === 200) {
              _this.validator.hideMessages();
              successAlert(
                "Your password has been changed successfully!",
                _this
              );
              _this.setState({ loading: false });
              setTimeout(() => _this.props.history.push("/login"), 4000);
            } else {
              _this.setState({ loading: false });
            }
          })
          .catch(function (error) {
            errorAlert(
              "Invalid token, please request a new link by clicking on forgot password in login window.",
              _this
            );
          });

        _this.setState({ loading: false });
      } else {
        _this.validator.showMessages();
        this.forceUpdate();
      }
    }
  };
  handleInputChange = (e) => {
    var newObj = this.state.user;
    newObj[e.target.name] = (e.target && e.target.value).trim();
    this.setState({ user: newObj });
  };
  render() {
    let _this = this;
    let form = (
      <Fragment>
        <div className="login_section">
          <Grid container>
            <Grid item sm={12} xs={12} md={6}>
              <div className="login_left_section password-left-section">
                <p className="login_heading">Reset Password</p>
                <div>
                  <FloatingLabel
                    controlId="floatingPassword"
                    label="New Password"
                    className="password-floating mb-3"
                  >
                    <Form.Control
                      placeholder="New Password"
                      type={this.state.passwordToggle ? "password" : "text"}
                      name="new_password"
                      value={_this.state.user && _this.state.user.new_password}
                      onChange={this.handleInputChange}
                    />
                    <span
                      role="button"
                      onClick={() => {
                        this.setState({
                          passwordToggle: !this.state.passwordToggle,
                        });
                      }}
                    >
                      {this.state.passwordToggle ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </span>
                  </FloatingLabel>
                  <div className="errorMsg">
                    {_this.validator.message(
                      "password",
                      _this.state.user && _this.state.user.new_password,
                      "required|min:6"
                    )}
                  </div>
                  <FloatingLabel
                    controlId="floatingPassword"
                    label="Confirm Password"
                    className="password-floating"
                  >
                    <Form.Control
                      placeholder="Confirm Password"
                      type={this.state.passwordToggle1 ? "password" : "text"}
                      name="confirm_password"
                      value={
                        _this.state.user && _this.state.user.confirm_password
                      }
                      onChange={this.handleInputChange}
                    />
                    <span
                      role="button"
                      onClick={() => {
                        this.setState({
                          passwordToggle1: !this.state.passwordToggle1,
                        });
                      }}
                    >
                      {this.state.passwordToggle1 ? (
                        <VisibilityOffIcon />
                      ) : (
                        <VisibilityIcon />
                      )}
                    </span>
                  </FloatingLabel>
                  <div className="errorMsg">
                    {_this.validator.message(
                      "confirm password",
                      _this.state.user.confirm_password,
                      `required|min:6|in:${_this.state.user.new_password}`
                    )}
                  </div>
                  <LoadingButton
                    type="button"
                    loading={_this.state.loading}
                    variant="contained"
                    className="green_btn forgot_btn"
                    style={{ color: "#ffff" }}
                    onClick={() => {
                      _this.handleSave();
                    }}
                  >
                    Submit
                  </LoadingButton>

                  <p className="signin_link">
                    Don’t have an account?
                    <Link role="button" to="/registration">
                      <span> Sign up here</span>
                    </Link>
                  </p>
                </div>
              </div>
            </Grid>
            <Grid item sm={12} xs={12} md={6}>
              <div className="login_right_section reg_right">
                <div className="logininfo_text">
                  <p className="review_text">
                    ‘Do you know? Responding to leads within 5 minutes improves
                    the lead-to-sale ratio with 21x !'
                  </p>
                  {/* <p className="review_name">- Rachel W. Lewis</p>
                  <p className="review_design">Social media influencer</p> */}
                  <img className="quote_img" src={quote} />
                  {/* <img className="user_img" src={user} /> */}
                </div>
                <img className="logo_img" src={logo} />
              </div>
            </Grid>
          </Grid>
        </div>
      </Fragment>
    );
    return (
      <Fragment>
        {this.state.alert}
        {form}
      </Fragment>
    );
  }
}

export default ResetPasswordComponent;
