import { backendURL } from "../../../../variables/appVariables.jsx";
import { api } from "../../../../js/api.js";


export function getAllIndicatorsList(_this, params, success, error) {
  api.get(`${backendURL}admin/indicators?${params}`, {
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
      _this.setState({
        loading: false,
        conversionList: [],
        answerList: [],
        questionsList: [],
        activeTab: 0
      });
      if (err.response)
        error(err.response.data || {});
      else
        error(err);
    });
}


export function getAllTopSourceList(params, success, error) {
  api.get(`${backendURL}admin/topsources?${params}`, {
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
      if (err.response)
        error(err.response.data || {});
      else
        error(err);
    });
}
