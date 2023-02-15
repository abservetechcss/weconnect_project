import { backendURL } from "../../../../variables/appVariables.jsx";
import { api } from "../../../../js/api.js";

export function getDashboardList(params, success, error) {
  api
    .get(`${backendURL}admin/dashboard${params}`, {
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
export function getLineChatData(params, success, error) {
  api
    .get(`${backendURL}admin/total_vs_new_conversation${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    })
    .catch((err) => {
      if(err.response)
 error(err.response.data || {});
      else
error(err);
    })
}

export function getAppointmentList(params, success, error) {
  api
    .get(`${backendURL}admin/appointmentlist/${params}`, {
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


export function getNewFeatures(success, error) {
  api
    .get(`${backendURL}admin/newfeatures`, {
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
