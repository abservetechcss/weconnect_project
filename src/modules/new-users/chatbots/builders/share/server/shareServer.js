import { backendURL } from "../../../../../../variables/appVariables.jsx";
import { api } from "../../../../../../js/api.js";


export function emailtodeveloper(data, success, error) {
  api
    .post(`${backendURL}admin/emailtodeveloper`, data, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    })
    .catch((err) => {
      let Msg = "Component create failed";
      if (err.response && err.response.status === 422) {
        let data = err.response.data;
        if (Object.keys(data) && Object.keys(data).length > 0) {
          const mapErrors = Object.keys(data).map((prop, key) => {
            return data[prop][0];
          });

          Msg = mapErrors.join("\n\r");
        }
        error({ message: Msg });
      } else {
        error({ message: Msg });
      }
    });
}