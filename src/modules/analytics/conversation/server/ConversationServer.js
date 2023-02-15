import { backendURL } from "../../../../variables/appVariables.jsx";
import { api, cancelToken } from "../../../../js/api.js";


export function getAnalyticsConversationList(params, success, error) {
  api.get(`${backendURL}admin/conversationlist?${params}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch(function (err) {
      if (err.response)
        error(err.response.data || {});
      else
        error(err);
    });
}

let ajaxRequest = null;
export function getConversationSearchList(params, success, error) {

  if (ajaxRequest) {
    ajaxRequest.cancel();
  }
  ajaxRequest = cancelToken();

  return api.get(`${backendURL}admin/conversationsearchlist?${params}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    cancelToken: ajaxRequest.token,
  })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch(function (err) {
      if (err.response)
        error(err.response.data || {});
      else
        error(err);
    });
}

export function getReferFriendList(params, success, error) {
  api.get(`${backendURL}admin/referfrienddashboard?${params}`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch(function (err) {
      if (err.response)
        error(err.response.data || {});
      else
        error(err);
    });
}

export function getAnalyticsConversationDownloadReport(params, success, error) {
  api
    .get(`${backendURL}admin/conversationlistall?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch(function (err) {
      if (err.response)
        error(err.response.data || {});
      else
        error(err);
    });
}
export function getChatDetailsList(params, success, error) {
  api
    .get(`${backendURL}admin/chatdetails?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch(function (err) {
      if (err.response)
        error(err.response.data || {});
      else
        error(err);
    });
}
export function getSingleVisitorInfo(params, success, error) {
  api
    .get(`${backendURL}admin/visitordetails?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch(function (err) {
      if (err.response)
        error(err.response.data || {});
      else
        error(err);
    });
}


export function getMeetChatInfo(params, success, error) {
  api
    .get(`${backendURL}admin/meetchatdetails?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch(function (err) {
      if (err.response)
        error(err.response.data || {});
      else
        error(err);
    });
}