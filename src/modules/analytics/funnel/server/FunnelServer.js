import { backendURL } from "../../../../variables/appVariables.jsx";
import { api } from "../../../../js/api.js";


export function getAllFunnelList(_this, params, success, error) {
  api
    .get(`${backendURL}admin/funnel?${params}`, {
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
      if(err.response)
 error(err.response.data || {});
      else
error(err);
    });
}

export function getCreateFunnelList(_this, params, success, error) {
  api
    .get(`${backendURL}admin/createfunnel?${params}`, {
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
        conversation_rate: 0,
        final_funnel: [],
        percentage: [],
        total_conversation: 0,
        total_leads: 0
      });
      if(err.response)
 error(err.response.data || {});
      else
error(err);
    });
}
