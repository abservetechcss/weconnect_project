import { backendURL } from "../../../../variables/appVariables.jsx";
import { api } from "../../../../js/api.js";

import { successAlert, errorAlert } from "../../../../js/alerts.js";
import { emitter } from "../../../../modules/common/WebSocketComponent";

// Global Login Function
export const setLoginUser = (res) => {
  if (res.status === 200 && res.data.status) {
    let userInfo = res.data.userInfo;
    emitter.emit("login", userInfo);
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("userBots", res.data.userBots);
    localStorage.setItem("id", userInfo.id);
    localStorage.setItem("admin_type", userInfo.admin_type);
    localStorage.setItem("api_key", userInfo.api_key);
    localStorage.setItem("email", userInfo.email);
    localStorage.setItem("ref_key", userInfo.ref_key);
    localStorage.setItem("company_id", userInfo.company_id);
    localStorage.setItem("name", userInfo.name);
    localStorage.setItem("timezone", userInfo.timezone);
    localStorage.setItem("plan", userInfo.plan);
    localStorage.setItem("picture", userInfo.profile_picture);
    localStorage.setItem("builderMainMenu", 0);
    localStorage.setItem("builderSubMenu", 0);
    localStorage.setItem("loginStatus", true);
    localStorage.setItem("verified", userInfo.verified);
    localStorage.setItem("session", true);
    if (localStorage.getItem("checkCondition")) {
      const d = new Date();
      d.setDate(d.getDate() + 60);
      // d.setMinutes(d.getMinutes() + 1);
      localStorage.setItem("expiry", d);
      localStorage.removeItem("checkCondition");
    }

    const message = (res.data && res.data.message) || "You are successfully login!";
    emitter.emit("showAlert", { type: "success", message: message });
    if (userInfo.admin_type === "agent") {
      emitter.emit("pushRoute", "/agent/dashboard");
    } else {
      emitter.emit("pushRoute", "/user/dashboard");
    }
  } else {
    emitter.emit("showAlert", { type: "success", message: res.data.message || "Login Failed" });
  }
}
// Global Logout Function

export function userLogin(data, _this, context) {
  context.showLoading(true);
  api
    .post(backendURL + "login", data)
    .then(function (res) {
      context.showLoading(false);
      setLoginUser(res);
    })
    .catch((err) => {
      const message = (err.response.data && err.response.data.message) || "Login Failed";
      context.showAlert({ type: "error", message: message });
    });
}
export function loginWithGoogle(_this, data, success, error) {
  api
    .post(backendURL + "register", data)
    .then((res) => {
      console.log("googleres124", res);
      if (res.status === 200) {
        success(res);
      } else {
        error(res.data);
      }
    })
    .catch((error) => {
      if (error.response !== undefined) {
        errorAlert(error.response.data && error.response.data, _this);
        _this.setState({ loading: false });
        success(error);
      }
    });
}

export function getGoogleLoginInfo(token, success, error) {
  api
    .get(
      `https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=${token}`
    )
    .then((res) => {
      console.log("googleres", res);
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    });
}

export function userLogout(data, history, success, error) {
  emitter.emit("sendMessage", {
    type: "logout",
    user_id: localStorage.getItem("id")
  });

}
export function verifyEmail(data, success, error) {
  api
    .post(`${backendURL}verifyemail`, data, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res);
      } else {
        error(res.data);
      }
    })
    .catch((err) => {
      if (err.response)
        error(err.response.data || {});
      else
        error(err);
    });
}
