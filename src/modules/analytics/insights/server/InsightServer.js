import { backendURL } from "../../../../variables/appVariables.jsx";
import { api } from "../../../../js/api.js";


export function getAllInsightList(_this,params, success, error) {
  api
    .get(`${backendURL}admin/insights?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch((err) => {
      _this.setState({
        loading: false,
        conversionList: [],
        answerList: [],
        questionsList:[],
        activeTab: 0
      });
      if(err.response)
 error(err.response.data || {});
      else
error(err);
    })
}
