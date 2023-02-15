import { backendURL } from "../../../variables/appVariables.jsx";
import { api } from "../../../js/api.js";


export function createBot(data, success, error) {
  api
    .post(`${backendURL}bot/createbot`, data, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
        localStorage.setItem("userBots", parseInt(localStorage.getItem("userBots") || 0) +1)
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
