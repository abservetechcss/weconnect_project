import React, { Component, Fragment } from 'react'
import LoginPage from "./LoginPage.jsx"
import { userLogin, verifyEmail } from "./server/LoginServer.js";
import { AlertContext } from "../../common/Alert";

export class LoginWithVerifyEmailComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
      this.state = {
        user: {
          verify_email: true,
          email: "",
          password: ""
        },
        decEmail: ""
      };
  }
  componentDidMount() {
    let _this = this;
    if (window.location.href.includes("verifyemail")) {
      localStorage.clear();
      localStorage.setItem("loginStatus", "false");

      let data = [];
      if (window.location.href.includes("verifyemail?email=")) {
         data = window.location.href.split("verifyemail?email=");
      }else if (window.location.href.includes("verifyemail/?email=")) {
        data = window.location.href.split("verifyemail/?email=");
      }
     
      let data1 = data && data.length > 0 && data[1].split("password=");
      _this.setState({
        decEmail: data1[0],
        user: {
          verify_email: true,
          email: data1[0],
          password: data1[1]
        }
      },()=>{
        _this.onLogin();
        _this.verifyEmailAddress();
      });
    }
  }
  onLogin = () => {
    let _this = this;
    let tempUser = JSON.parse(JSON.stringify(this.state.user));
      userLogin(tempUser, this, this.context);
    };
    verifyEmailAddress = () => {
        let _this = this
        let temp = {}
        temp.email=_this.state.decEmail
          verifyEmail(
            temp,
            (res) => {
     localStorage.setItem('verified', 1);
            },
            (res) => {}
          );
    }
  render() {
    return (
      <Fragment>
        <LoginPage {...this.props} />
      </Fragment>
    );
  }
}

export default LoginWithVerifyEmailComponent
