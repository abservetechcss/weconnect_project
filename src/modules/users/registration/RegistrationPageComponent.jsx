import React, { Component, Fragment, createRef } from "react";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
} from "@mui/material";
import { FloatingLabel, Form } from "react-bootstrap";
import "../../../assets/scss/main.scss";
import google from "../../../assets/images/google.png";
import quote from "../../../assets/images/quote.png";
// import user from "../../../assets/images/user.png";
import logo from "../../../assets/images/Group 970.svg";

import SimpleReactValidator from "simple-react-validator";
import { Link, withRouter } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { userRegistration } from "./server/RegistrationServer.js";
import { successAlert, errorAlert } from "../../../js/alerts.js";
import LoadingButton from "react-bootstrap-button-loader";

import { loginWithGoogle, setLoginUser } from "../login/server/LoginServer.js";
import {
  google_client_id,
  google_captcha_id,
} from "../../../variables/appVariables.jsx";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";
import CaptchaButton from "./captchaButton";
import { AlertContext } from "../../common/Alert";
import GoogleLogin from "../login/googleLogin";

export class RegistrationPageComponent extends Component {
  static contextType = AlertContext;
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
      user: {
        coupon_code: props.match.params.id,
        referred_by: props.match.params.referer,
        login_platform: "weconnect",
        fullname: "",
        email: "",
        phone: "",
        password: "",
        company_name: "",
        termsAndConditions: false,
      },
      passwordToggle: true,
    };
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
  }
  onSubmit = (token) => {
    var _this = this;
    if (!_this.state.user.fullname.match(/^[ a-zA-Z]+$/)) {
      this.context.showAlert({
        type: "error",
        message: "Invalid Fullname!, provide alphabets only",
      });
      return false;
    }

    const emailRegex = /^[\w.]+@([\w-]+\.)+[\w-]+$/;
    if (!_this.state.user.email.match(emailRegex)) {
      this.context.showAlert({
        type: "error",
        message: "Invalid Email Id",
      });
      return false;
    }
    const nospecialCharacterRegEx = /^[\w.-]+@([\w-]+\.)+[\w-]+$/;
    if (!_this.state.user.email.match(nospecialCharacterRegEx)) {
      this.context.showAlert({
        type: "error",
        message: "Special characters are not allowed",
      });
      return false;
    }

    const noCaptailFirst = /^[^0-9A-Z]+/;
    if (!_this.state.user.email.match(noCaptailFirst)) {
      this.context.showAlert({
        type: "error",
        message: "Email should not start with capital or Number",
      });
      return false;
    }

    if (
      _this.state.user.company_name !== "" &&
      !_this.state.user.company_name.match(/^[ a-zA-Z]+$/)
    ) {
      this.context.showAlert({
        type: "error",
        message: "Invalid Company Name!, provide alphabets only",
      });
      return false;
    }

    if (_this.state.user.password.length < 5) {
      this.context.showAlert({
        type: "error",
        message: "Password Length should not be less than 6 characters",
      });
      return false;
    }

    if (/[a-zA-Z]/.test(_this.state.user.password) === false) {
      this.context.showAlert({
        type: "error",
        message: "Password Should atleast contain one alphabet",
      });
      return false;
    }

    if (/[0-9]/.test(_this.state.user.password) === false) {
      this.context.showAlert({
        type: "error",
        message: "Password Should atleast contain one number",
      });
      return false;
    }

    if (!_this.state.user.termsAndConditions) {
      this.context.showAlert({
        type: "error",
        message: "Please check  Terms and Privacy",
      });
      return false;
    }

    let tempUser = JSON.parse(JSON.stringify(_this.state.user));
    delete tempUser.termsAndConditions;
    tempUser.recaptcha_token = token;
    if (window.location.href.includes("referer")) {
      tempUser.referred_by = window.location.pathname.split("/").pop();
    } else {
      tempUser.referred_by = "";
    }
    console.log("tempUser", tempUser);
    this.context.showLoading(true);
    userRegistration(
      _this,
      tempUser,
      (res) => {
        this.context.showLoading(false);
        successAlert("You are successfully login!", _this);
        const expires = new Date(Date.now() + 1000 * 60 * 60 * 96);
        let userInfo = res.data.userInfo;
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userBots", res.data.userBots);
        localStorage.setItem("id", userInfo.id);
        localStorage.setItem("admin_type", userInfo.admin_type);
        localStorage.setItem("api_key", userInfo.api_key);
        localStorage.setItem("email", userInfo.email);
        localStorage.setItem("expiry_date", userInfo.expiry_date);
        localStorage.setItem("name", userInfo.name);
        localStorage.setItem("profile_picture", userInfo.profile_picture);
        // localStorage.setItem("industry_type", value); what is this??
        localStorage.setItem("ref_key", userInfo.ref_key);
        localStorage.setItem("company_id", userInfo.company_id);
        localStorage.setItem("timezone", userInfo.timezone);
        localStorage.setItem("plan", userInfo.plan);
        localStorage.setItem("verified", userInfo.verified);
        //always set login Status as last one to avoid possible errors in redirect
        localStorage.setItem("loginStatus", true);
        console.log("localstorage setItem", localStorage.getItem("id"));
        if (userInfo.admin_type === "agent") {
          _this.props.history.push("/agent/dashboard");
        } else {
          _this.props.history.push("/user/dashboard");
        }
      },
      (res) => {
        this.context.showLoading(false);
        if (res.message) errorAlert(`${res.message}!`, _this);
      }
    );
  };

  responseGoogle = (res) => {
    console.log(res);
    let _this = this;
    // console.log("google login",res)
    if (res.email_verified) {
      _this.setState({ loading: true });
      let tempObj = {};
      tempObj.name = res.name;
      tempObj.email = res.email;
      tempObj.googleId = res.sub;
      tempObj.profile_picture = res.picture;
      tempObj.login_platform = "Google";
      loginWithGoogle(
        _this,
        tempObj,
        (data) => {
          _this.setState({ loading: false });
          setLoginUser(data);
        },
        (res) => {
          _this.setState({ loading: false });
        }
      );
    }
  };

  handleInputChange = (e) => {
    var newObj = this.state.user;
    newObj[e.target.name] = e.target.value;
    this.setState({ user: newObj });
  };
  handleContactChange = (e) => {
    var newObj = this.state.user;
    newObj.phone = e;
    this.setState({ user: newObj });
  };

  render() {
    let _this = this;
    let form = (
      <Fragment>
        <GoogleReCaptchaProvider reCaptchaKey={google_captcha_id}>
          <div className="login_section">
            <Grid
              container
              direction="row"
              justifyContent="center"
              alignItems="center"
            >
              <Grid className="login_left_scroll" item sm={12} xs={12} md={6}>
                <div className="login_left_section">
                  <p className="login_heading">Sign up to WeConnect.chat</p>
                  <div>
                    <FloatingLabel
                      className="login_label"
                      controlId="floatingInput"
                      label="Full Name"
                    >
                      <Form.Control
                        className="login_input"
                        type="text"
                        placeholder="Full Name"
                        name="fullname"
                        value={_this.state.user && _this.state.user.fullname}
                        onChange={this.handleInputChange}
                      />
                      <div className="errorMsg">
                        {_this.validator.message(
                          "full Name",
                          _this.state.user && _this.state.user.fullname,
                          "required"
                        )}
                      </div>
                    </FloatingLabel>
                    <FloatingLabel
                      className="login_label"
                      controlId="floatingEmail"
                      label="Email Id"
                    >
                      <Form.Control
                        className="login_input"
                        type="email"
                        placeholder="Email Id"
                        name="email"
                        value={_this.state.user && _this.state.user.email}
                        onChange={this.handleInputChange}
                      />
                      <div className="errorMsg">
                        {_this.validator.message(
                          "email id",
                          _this.state.user && _this.state.user.email,
                          "required|email"
                        )}
                      </div>
                    </FloatingLabel>

                    <div className="login_label">
                      <FloatingLabel
                        controlId="floatingPassword"
                        label="Password"
                        className="password-floating"
                      >
                        <Form.Control
                          // type="password"
                          placeholder="Password"
                          type={this.state.passwordToggle ? "password" : "text"}
                          name="password"
                          value={_this.state.user && _this.state.user.password}
                          onChange={this.handleInputChange}
                        />
                        <span
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
                          _this.state.user && _this.state.user.password,
                          "required|min:6"
                        )}
                      </div>
                    </div>
                    <div className="block input-block">
                      <FloatingLabel
                        className="floating-input-field-block-cust"
                        controlId="floatingCompanyname"
                        label="Company"
                        style={{ textAlign: "left" }}
                      >
                        <Form.Control
                          type="text"
                          placeholder="Company name"
                          name="company_name"
                          value={
                            _this.state.user && _this.state.user.company_name
                          }
                          onChange={this.handleInputChange}
                        />
                        <div className="errorMsg">
                          {_this.validator.message(
                            "company name",
                            _this.state.user && _this.state.user.company_name,
                            "required"
                          )}
                        </div>
                      </FloatingLabel>
                    </div>
                    <FormGroup className="checkbox_formgroup">
                      <FormControlLabel
                        control={<Checkbox />}
                        label={
                          <div>
                            I agree with{" "}
                            <Link to="/terms-privacy">Terms and Privacy</Link>
                          </div>
                        }
                        checked={
                          _this.state.user &&
                          _this.state.user.termsAndConditions
                        }
                        onChange={(e) => {
                          let temp = _this.state.user;
                          temp.termsAndConditions = e.target.checked;
                          _this.setState({ user: temp });
                        }}
                      />
                      <div className="errorMsg">
                        {_this.validator.message(
                          "terms and condition",
                          _this.state.user &&
                            _this.state.user.termsAndConditions,
                          "required|accepted"
                        )}
                      </div>
                      <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="I would like to receive product information, offers and tips from WeConnect.Chat"
                      />
                    </FormGroup>
                    <CaptchaButton
                      loading={_this.state.loading}
                      onSubmit={_this.onSubmit}
                    ></CaptchaButton>
                    {/* <LoadingButton
                    type="button"
                    loading={_this.state.loading}
                    onClick={() => {
                      _this.onSubmit();
                    }}
                    variant="contained"
                    className="green_btn registration_btn"
                    style={{ color: "#ffff" }}
                  >
                    Start using WeConnect.chat
                  </LoadingButton> */}

                    <p className="signin_link">
                      Don’t have an account?
                      <Link role="button" to="/login">
                        <span> Sign in here</span>
                      </Link>
                    </p>
                    <p className="or_text">
                      <span>or</span>
                    </p>
                    <GoogleLogin
                      clientId={google_client_id}
                      onSuccess={this.responseGoogle}
                      onFailure={() => {
                        errorAlert(`"Google Login Failed!"`, _this);
                      }}
                    />
                  </div>
                </div>
              </Grid>
              <Grid item sm={12} xs={12} md={6}>
                <div className="login_right_section">
                  <div className="logininfo_text">
                    <p className="review_text">
                      ‘Do you know? Responding to leads within 5 minutes
                      improves the lead-to-sale ratio with 21x !'
                    </p>
                    {/* <p className="review_name">- Rachel W. Lewis</p>
                  <p className="review_design">Social media influencer</p> */}
                    <img className="quote_img" src={quote} alt="" />
                    {/* <img className="user_img" src={user} /> */}
                  </div>
                  <img className="logo_img" src={logo} alt="" />
                </div>
              </Grid>
            </Grid>
          </div>
        </GoogleReCaptchaProvider>
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

export default withRouter(RegistrationPageComponent);
