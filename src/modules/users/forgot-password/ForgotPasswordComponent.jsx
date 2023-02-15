import React, { Component, Fragment } from "react";
import { Grid } from "@mui/material";
import { FloatingLabel, Form } from "react-bootstrap";
import "../../../assets/scss/main.scss";
import quote from "../../../assets/images/quote.png";
import user from "../../../assets/images/user.png";
import logo from "../../../assets/images/Group 970.svg";
import SimpleReactValidator from "simple-react-validator";
import { Link } from "react-router-dom";
import LoadingButton from "react-bootstrap-button-loader";
import { successAlert, errorAlert } from "../../../js/alerts.js";
import { backendURL } from "../../../variables/appVariables.jsx";
import { api } from "../../../js/api.js";

export class ForgotPasswordComponent extends Component {
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
      email: "",
    };
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  onSubmit = () => {
    let _this = this;
    let tempObj = {};
    tempObj.email = _this.state.email;

    if (_this.validator.allValid()) {
      _this.setState({ loading: true });
      api
        .post(backendURL + "forgotpassword", tempObj)
        .then(function (res) {
          if (res.status === 200) {
            if(res.data.status==="True") {
              _this.validator.hideMessages();
            _this.setState({
              email: "",
              loading: false,
            });
            successAlert(
              res.data.message || "Reset Email Is Sent Successfully, Please Check Your Inbox!",
              _this
            );
            } else {
              _this.setState({
                loading: false,
                activeButton: true,
              });
              errorAlert(
                res.data.message || "This email does not exist in our records! Please check your email and try again.",
                _this
              );
            }
            
          } else {
            _this.setState({
              loading: false,
              activeButton: true,
            });
            errorAlert(
              res.message || "This email does not exist in our records! Please check your email and try again.",
              _this
            );
          }
        })
        .catch(function (error) {
          _this.setState({
            loading: false,
            redirectHomePage: false,
            activeButton: true,
          });
          errorAlert(
            "This email does not exist in our records! Please check your email and try again.",
            _this
          );
        });
    } else {
      _this.validator.showMessages();
      this.forceUpdate();
    }
  };

  render() {
    let _this = this;
    let form = (
      <Fragment>
        <div className="login_section">
          <Grid container>
            <Grid item sm={12} xs={12} md={6}>
              <div className="login_left_section password-left-section">
                <p className="login_heading">Lost your password?</p>
                <p className="login_subheading">
                  Please enter your email address
                  <br />
                  You will receive a link to create a new password via email
                </p>

                <div>
                  <FloatingLabel
                    className="login_label"
                    controlId="floatingPassword"
                    label="Email Id"
                  >
                    <Form.Control
                      className="login_input"
                      type="email"
                      placeholder="Email ID"
                      name="email"
                      value={_this.state.email}
                      onChange={(e) => {
                        _this.setState({
                          email: e.target.value,
                        });
                      }}
                      onKeyPress={(event) => {
                        if (event.key === "Enter") {
                          _this.onSubmit();
                        }
                      }}
                    />
                    <div className="errorMsg">
                      {_this.validator.message(
                        "Email",
                        _this.state.email,
                        "required|email"
                      )}
                    </div>
                  </FloatingLabel>
                  <LoadingButton
                    type="button"
                    loading={_this.state.loading}
                    variant="contained"
                    className="green_btn forgot_btn"
                    style={{ color: "#ffff" }}
                    onClick={() => _this.onSubmit()}
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
                  ‘Do you know? 
                  Responding to leads within 5 minutes improves the lead-to-sale ratio with 21x !'
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

export default ForgotPasswordComponent;
