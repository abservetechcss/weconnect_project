import { backendURL } from "../../../../../../variables/appVariables.jsx";
import { api } from "../../../../../../js/api.js";

export function getTrackersList(params, success, error) {
  api
    .get(`${backendURL}admin/trackers?${params}`, {
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
export function createTrackers(params, data, success, error) {
  api
    .post(`${backendURL}admin/updatetrackers?${params}`, data, {
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
