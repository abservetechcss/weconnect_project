import { backendURL } from "../../../../variables/appVariables.jsx";
import { api, cancelToken } from "../../../../js/api.js";


let ajaxRequest = null;
export function getAllChatBotList(params, success, error) {
  if (ajaxRequest) {
    ajaxRequest.cancel();
  }
  ajaxRequest = cancelToken();
  return api
    .get(`${backendURL}admin/chatbotlist?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      cancelToken: ajaxRequest.token,
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

export function getOverViewList(params, success, error) {
  api
    .get(`${backendURL}admin/overview?${params}`, {
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

export function getAllChatBotWithOutPaginationList(params, success, error) {
  api
    .get(`${backendURL}admin/chatbotlistall`, {
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
export function updateBotName(data, success, error) {
  api
    .post(`${backendURL}bot/updatebot`, data, {
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
      if (err.response)
        error(err.response.data || {});
      else
        error(err);
    });
}
export function ActiveDeactiveBot(data, success, error) {
  api
    .post(`${backendURL}bot/activedeactivebot`, data, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
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
export function deleteChatBotId(data, success, error) {
  api
    .post(`${backendURL}bot/deletebot`, data, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res);
        const chatBot = parseInt(localStorage.getItem("userBots") || 0) - 1;
        console.log("newChat bot count", chatBot);
        localStorage.setItem("userBots", chatBot);
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

export function duplicateBot(data, success, error) {
  api
    .post(`${backendURL}bot/duplicatebot`, data, {
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
      let Msg = "Component copy failed";
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

export function exportbotUrl(params, success, error) {
  var config = {
    method: 'get',
    'content-type': 'application/json',
    url: `${backendURL}bot/exportbot?bot_id=` + params,
    headers: {
      'Authorization': `Bearer ${localStorage.getItem("token")}`
    }
  };

  api(config)
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