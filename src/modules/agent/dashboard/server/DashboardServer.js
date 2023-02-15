import { backendURL } from "../../../../variables/appVariables.jsx";
import { api, cancelToken } from "../../../../js/api.js";

let getChatBotListCancelToken = null;
export function getChatBotList(_this, params, success, error) {
  let url = `${backendURL}agent/chatbotlist/${params}`;
  // Cancel previous request
  if (getChatBotListCancelToken) {
    getChatBotListCancelToken.cancel();
  }
  getChatBotListCancelToken = cancelToken();

  api
    .get(`${url}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      cancelToken: getChatBotListCancelToken.token,
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
    });
    return getChatBotListCancelToken;
}

let getAllChatBotListCancelToken = null;

export function getAllChatBotList(_this, params, success, error) {
  // Cancel previous request
  if (getAllChatBotListCancelToken) {
    getAllChatBotListCancelToken.cancel();
  }
  getAllChatBotListCancelToken = cancelToken();

  api
    .get(`${backendURL}agent/chatbotlist`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      cancelToken: getAllChatBotListCancelToken.token,
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
    });
    return getAllChatBotListCancelToken;
}

let getAdminChatBotListCancelToken = null;
export function getAdminChatBotList(_this, params, success, error) {

  // Cancel previous request
if (getAdminChatBotListCancelToken) {
  getAdminChatBotListCancelToken.cancel();
}
getAdminChatBotListCancelToken = cancelToken();

  api
    .get(`${backendURL}admin/chatbotlistall`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      cancelToken: getAdminChatBotListCancelToken.token,
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
    });
    return getAdminChatBotListCancelToken;
}

let getOfflineMesCountCancelTokoen = null;

export function getOfflineMesCount(params, success, error) {

    // Cancel previous request
if (getOfflineMesCountCancelTokoen) {
  getOfflineMesCountCancelTokoen.cancel();
}
getOfflineMesCountCancelTokoen = cancelToken();

  api
    .get(`${backendURL}agent/offlinemsgCount/${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      cancelToken: getOfflineMesCountCancelTokoen.token,
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
    return getOfflineMesCountCancelTokoen;
}


let getTotalAvgResponseCountCancelToken = null;
export function getTotalAvgResponseCount(params, success, error) {

      // Cancel previous request
if (getTotalAvgResponseCountCancelToken) {
  getTotalAvgResponseCountCancelToken.cancel();
}
getTotalAvgResponseCountCancelToken = cancelToken();

  api
    .get(`${backendURL}agent/totalavgresponse/${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      cancelToken: getTotalAvgResponseCountCancelToken.token,
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
    return getTotalAvgResponseCountCancelToken;
}


let getAppointmentListCancelToken = null;
export function getAppointmentList(params, success, error) {


        // Cancel previous request
if (getAppointmentListCancelToken) {
  getAppointmentListCancelToken.cancel();
}
getAppointmentListCancelToken = cancelToken();

  api
    .get(`${backendURL}agent/appointment/${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      cancelToken: getAppointmentListCancelToken.token,
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

    return getAppointmentListCancelToken;
}

let getBarChartListCancelToken = null;
export function getBarChartList(params, success, error) {

          // Cancel previous request
if (getBarChartListCancelToken) {
  getBarChartListCancelToken.cancel();
}
getBarChartListCancelToken = cancelToken();

  api
    .get(`${backendURL}agent/graphrecord/${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      cancelToken: getBarChartListCancelToken.token,
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
    return getBarChartListCancelToken;
}
