import React, { Component, Fragment } from "react";
import { Checkbox, FormControlLabel, FormGroup, Grid } from "@mui/material";
import { FloatingLabel, Form } from "react-bootstrap";
import "../../../assets/scss/main.scss";
import quote from "../../../assets/images/quote.png";
import user from "../../../assets/images/user.png";
import logo from "../../../assets/images/Group 970.svg";
import SimpleReactValidator from "simple-react-validator";
import { userLogin } from "./server/LoginServer.js";
import { Link } from "react-router-dom";
import LoadingButton from "react-bootstrap-button-loader";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { loginWithGoogle, setLoginUser } from "../login/server/LoginServer.js";
import { google_client_id } from "../../../variables/appVariables.jsx";
import { successAlert } from "../../../js/alerts";
import { AlertContext } from "../../common/Alert";
import GoogleLogin from "./googleLogin";

export class LoginPage extends Component {
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
      passwordToggle: true,
      user: {
        verify_email: false,
        checkCondition: true,
        email: "",
        password: "",
      },
    };
  }

  componentDidMount() {
    this.context.showLoading(false);
    let _this = this;
    window.scrollTo(0, 0);
    if (
      window.location.href.includes("/forgot-password") ||
      window.location.href.includes("/reset-password/") ||
      window.location.href.includes("/terms-condition") ||
      window.location.href.includes("/privacy-policy") ||
      window.location.href.includes("verifyemail")
    ) {
      console.log("no redirect");
    } else {
      console.log("redirect working");
      if (
        localStorage.getItem("id") &&
        localStorage.getItem("admin_type") &&
        localStorage.getItem("email")
      ) {
        if (localStorage.getItem("loginStatus") === "true") {
          console.log("redirect to inside page");
          if (localStorage.getItem("admin_type") === "agent") {
            _this.props.history.push("/agent/dashboard");
          } else {
            _this.props.history.push("/user/dashboard");
          }
        } else {
          console.log(
            "redirect to login1",
            localStorage.getItem("loginStatus")
          );
          // _this.props.history.push("/login");
        }
      } else {
        console.log("redirect to login2", localStorage.getItem("id"));
        // _this.props.history.push("/login");
      }
    }
  }

  onLogin = () => {
    let _this = this;
    let tempUser = JSON.parse(JSON.stringify(this.state.user));
    if (tempUser.checkCondition == true) {
      localStorage.setItem("checkCondition", true);
    } else {
      localStorage.removeItem("checkCondition");
    }
    delete tempUser.checkCondition;
    if (_this.validator.allValid()) {
      userLogin(tempUser, _this, this.context);
    } else {
      _this.validator.showMessages();
      this.forceUpdate();
    }
  };
  responseGoogle = (res) => {
    console.log(res);
    let _this = this;
    console.log("google login", res);

    if (res.email_verified) {
      // _this.setState({ loading: true });
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
    newObj[e.target.name] = (e.target && e.target.value).trim();
    this.setState({ user: newObj });
  };
  render() {
    let _this = this;
    let form = (
      <Fragment>
        <div className="login_section">
          <Grid
            container
            direction="row"
            justifyContent="center"
            alignItems="center"
          >
            <Grid className="login_left_scroll" item sm={12} xs={12} md={6}>
              <div className="login_left_section">
                <p className="login_heading">Login to WeConnect.chat</p>
                <div>
                  <FloatingLabel className="login_label" label="Email Id">
                    <Form.Control
                      className="login_input"
                      type="email"
                      placeholder="Email ID"
                      name="email"
                      value={_this.state.user && _this.state.user.email}
                      onChange={this.handleInputChange}
                      onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          _this.onLogin();
                        }
                      }}
                    />
                    <div className="errorMsg">
                      {_this.validator.message(
                        "Email",
                        _this.state.user && _this.state.user.email,
                        "required|email"
                      )}
                    </div>
                  </FloatingLabel>

                  <FloatingLabel
                    label="Password"
                    className="password-floating"
                    style={{ textAlign: "left" }}
                  >
                    <Form.Control
                      placeholder="Password"
                      type={this.state.passwordToggle ? "password" : "text"}
                      name="password"
                      value={_this.state.user && _this.state.user.password}
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
                      _this.state.user && _this.state.user.password,
                      "required|min:6"
                    )}
                  </div>
                  <div className="forgot_pass_block">
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox />}
                        label="Remember me"
                        checked={this.state.user.checkCondition}
                        value={this.state.user.checkCondition}
                        onChange={(e) => {
                          let temp = _this.state.user;
                          temp.checkCondition = temp.checkCondition
                            ? false
                            : true;
                          _this.setState({ user: temp });
                        }}
                      />
                    </FormGroup>
                    <div className="forgot_link">
                      <Link role="button" to="/forgot-password">
                        Forgot Password
                      </Link>
                    </div>
                  </div>
                  <LoadingButton
                    type="button"
                    loading={_this.state.loading}
                    onClick={() => {
                      _this.onLogin();
                    }}
                    onKeyPress={(event) => {
                      if (event.key === "Enter") {
                        _this.onLogin();
                      }
                    }}
                    variant="contained"
                    className="green_btn"
                    style={{ color: "#ffff" }}
                  >
                    Login
                  </LoadingButton>

                  <p className="signin_link">
                    Don’t have an account?
                    <Link role="button" to="/registration">
                      <span> Sign up here</span>
                    </Link>
                  </p>
                  <p className="or_text">
                    <span>or</span>
                  </p>
                  <GoogleLogin
                    clientId={google_client_id}
                    onSuccess={this.responseGoogle}
                    onFailure={() => {
                      this.context.showAlert({
                        type: "error",
                        message: "Google Login Failed!",
                      });
                    }}
                  />
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
                  <img className="quote_img" src={quote} alt="" />
                  {/* <img className="user_img" src={user} /> */}
                </div>
                <img className="logo_img" src={logo} alt="" />
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

export default LoginPage;
