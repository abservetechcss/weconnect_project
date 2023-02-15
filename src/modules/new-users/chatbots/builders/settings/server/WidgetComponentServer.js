import { backendURL } from "../../../../../../variables/appVariables.jsx";
import { api } from "../../../../../../js/api.js";


import { errorAlert } from "../../../../../../js/alerts.js";

export function getWidgetSettingList(params, success, error) {
  api
    .get(`${backendURL}admin/widgetsetting?${params}`, {
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
export function createUpdateWidgetSetting(_this,params, data, success, error, progressFn) {
  api.post(`${backendURL}admin/updatewidgetsetting`, data, {
      headers: { 
        Authorization: "Bearer " + localStorage.getItem("token"),
        'Content-Type': 'multipart/form-data'
       },
       onUploadProgress: data => {
        //Set the progress value to show the progress bar
        const progress = Math.round((100 * data.loaded) / data.total);
        console.log("progress", progress);
        progressFn(progress);
      },
    })
    .then((res) => {
      if (res.status === 200) {
        success(res);
      } else {
        error(res.data);
      }
    })
    .catch((err) => {
      let Msg = "Widget settings update Failed!";
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
