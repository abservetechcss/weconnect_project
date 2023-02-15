import { backendURL } from "../../../../variables/appVariables.jsx";
import { api } from "../../../../js/api.js";
import {warningAlert}from "../../../../js/alerts.js"
export function getUserBasicInfoList(params, success, error) {
  api
    .get(`${backendURL}basicaccount`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch((err) => {
      if(err.response)
 error(err.response.data || {});
      else
error(err);
    });
}
export function getAvailabilityList(params, success, error) {
  api
    .get(`${backendURL}availability`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch((err) => {
      if(err.response)
 error(err.response.data || {});
      else
error(err);
    });
}
export function updateUserBasicInfo(_this, data, success, error) {
  api
    .post(`${backendURL}updateraibubasicaccount`, data, {
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
      if (err.response && err.response.status === 422) {
        let data = err.response.data;
        let Msg = "";
        if (Object.keys(data) && Object.keys(data).length > 1) {
          Object.keys(data) &&
            Object.keys(data).map((prop, key) => {
              if (key === 0) warningAlert(`${data[prop][0]}`, _this);
            });
          Msg = data[Object.keys(data)];
        } else {
          Msg = data[Object.keys(data)][0];
          warningAlert(`${Msg}`, _this);
        }
      } else {
        if(err.response)
 error(err.response.data || {});
      else
error(err);
      }
    });
}

export function updateAvailability(data, success, error) {
  api
    .post(`${backendURL}updateavailability`, data, {
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
      if(err.response)
 error(err.response.data || {});
      else
error(err);
    });
}