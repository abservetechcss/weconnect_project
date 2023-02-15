import { backendURL } from "../../../../../../variables/appVariables.jsx";
import { api } from "../../../../../../js/api.js";

export function zapierLink(success, error) {
  api
    .get(`${backendURL}admin/zapier`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch((err) => {
      if (err.response)
        error(err.response.data || {});
      else
        error(err);
    });
}

export function tokenGeneratorLink(params, success, error) {
  api
    .post(`${backendURL}admin/getIntegrationAppToken`, params, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch((err) => {
      if (err.response)
        error(err.response.data || {});
      else
        error(err);
    });
}

