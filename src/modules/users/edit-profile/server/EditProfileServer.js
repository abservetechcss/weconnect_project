import { backendURL } from "../../../../variables/appVariables.jsx";
import { api } from "../../../../js/api.js";
// all onload api are provided in only one file

import { warningAlert } from "../../../../js/alerts";
export function getUserBasicInfoList(history, success, error) {
  api.get(`${backendURL}basicaccount`, {
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
      if (err.response && err.response.status === 401) {
        if (err.response && err.response.data.error) {
           if (localStorage.getItem("id") && localStorage.getItem("email")) {
            console.log("Edit Profile API NOT WORKING")
            localStorage.clear();
            localStorage.setItem("loginStatus", false);
            history.replace("/login");
          }
        }
      } else {
        if(err.response)
 error(err.response.data || {});
      else
error(err);
      }
    });
}

export function getUserLoginStatus(history, success, error) {
  api.get(`${backendURL}settings/userstatus`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      if (res.status === 200) {
        if(res.data.status==="True") {
          success();
        } else {
          localStorage.clear();
          localStorage.setItem("loginStatus", false);
          history.replace("/login");
        }
      } else {
          success();
      }
    })
    .catch((error) => {
      success();
    });
}

export function getActiveCalls(success, error) {
  api.get(`${backendURL}settings/activenoftication`, {
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
      let Msg = "Get Active call failed";
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

export async function getServerNotifications(success, error) {
  return api
    .get(`${backendURL}agent/raibunotificationlist`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    }).then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    })
    .catch((err) => {
      let Msg = "Get Active call failed";
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

export function getServerAgentStatus(success, error) {
  api.get(`${backendURL}settings/agentstatus`, {
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
      let Msg = "Get Agent Status failed";
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

export function getServerTestMode(params,success, error) {
  api.get(`${backendURL}admin/getmodetype${params}`, {
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
      let Msg = "Get TestMode Status failed";
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

export function setServerAgentStatus(param, success, error) {
  const status = param ? 'online':'away';
  api.get(`${backendURL}settings/agentstatusupdate?login_status=${status}`, {
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
      let Msg = "Set Agent Status failed";
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


export function getDeskopSettings(success, error) {
  api
    .get(`${backendURL}admin/desktopsettings`, {
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

export function importBot(data, success, error) {
  api
    .post(`${backendURL}bot/importbot`, data, {
      headers: { 
        Authorization: "Bearer " + localStorage.getItem("token"),
        'Content-Type': 'multipart/form-data'
      }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
        localStorage.setItem("userBots", parseInt(localStorage.getItem("userBots") || 0) +1)
      } else {
        error(res.data);
      }
    })
    .catch((err) => {
      let Msg = "Import Bot failed";
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

export function getCompanyDetailsList(params, success, error) {
  api
    .get(`${backendURL}companydetails`, {
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
export function updateUserBasicInfo(_this, data, success, error) {
  api
    .post(`${backendURL}updatekaiwabasicaccount`, data, {
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
      if (err.response && err.response.status === 422) {
        let data = err.response.data;
        let Msg = "";
        if (Object.keys(data) && Object.keys(data).length > 1) {
          Object.keys(data) &&
            Object.keys(data).map((prop, key) => {
              if (key === 0) warningAlert(`${data[prop][0]}`, _this);
            });
          Msg = data[Object.keys(data)];
        } else {
          Msg = data[Object.keys(data)][0];
          warningAlert(`${Msg}`, _this);
        }
      } else {
        if(err.response)
 error(err.response.data || {});
      else
error(err);
      }
    });
}
export function updateCompanyDetails(_this, data, success, error) {
  api
    .post(`${backendURL}updatecompanydetails`, data, {
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
      let Msg = "Company Detail update failed";
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

export function setServerTestMode(data, success, error) {
  api.post(`${backendURL}admin/updatemodetype`, data, {
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
      let Msg = "Set Test Mode failed";
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

export function getNewFeatures(success, error) {
  api
    .get(`${backendURL}admin/newfeatures`, {
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