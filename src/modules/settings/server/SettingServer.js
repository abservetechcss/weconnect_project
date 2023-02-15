import { backendURL } from "../../../variables/appVariables.jsx";
import { api } from "../../../js/api.js";


export function getNotificationSoundList(params, success, error) {
  api
    .get(`${backendURL}settings/notificationsound`, {
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
export function getTypingAnimationSettingList(params, success, error) {
  api
    .get(`${backendURL}settings/typinganimation`, {
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
export function getLiveChatSettingList(params, success, error) {
  api
    .get(`${backendURL}settings/livechatsettings`, {
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
export function getUserManagementList(params, success, error) {
  api
    .get(`${backendURL}settings/usermanagement`, {
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
export function getSetupHumanList(params, success, error) {
  api
    .get(`${backendURL}settings/setuphumantakeover`, {
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
export function updateNotificationSound( data, success, error) {
  api
    .post(`${backendURL}settings/updatenotificationsound`, data, {
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
      if(err.response)
 error(err.response.data || {});
      else
error(err);
    });
}
export function updateLiveChatSetting(data, success, error) {
  api
    .post(`${backendURL}settings/updatelivechatsettings`, data, {
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
      if(err.response)
 error(err.response.data || {});
      else
error(err);
    });
}

export function updateAnimationSetting(data, success, error) {
  api
    .post(`${backendURL}settings/updatetypinganimation`, data, {
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
      if(err.response)
 error(err.response.data || {});
      else
error(err);
    });
}

export function createUserManagement(data, success, error) {
  api.post(`${backendURL}settings/addusermanagement`, data, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
    .then((res) => {
      if (res.status === "True") {
        success(res);
      } else {
        success(res);
      }
    })
    .catch((err) => {
      if(err.response)
 error(err.response.data || {});
      else
error(err);
    });
}
export function updateUserManagement(data, success, error) {
  api
    .post(`${backendURL}settings/updateusermanagement`, data, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
    .then((res) => {
      if (res.status === "True") {
        success(res);
      } else {
        success(res);
      }
    })
    .catch((err) => {
      if(err.response)
 error(err.response.data || {});
      else
error(err);
    });
}
export function updateSetupHuman(data, success, error) {
  api
    .post(`${backendURL}settings/updatehumantakeover`, data, {
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
      if(err.response)
 error(err.response.data || {});
      else
error(err);
    });
}

export function deleteUserMgt(data, success, error) {
  api
    .post(`${backendURL}settings/deleteusermanagement`, data, {
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
      if(err.response)
 error(err.response.data || {});
      else
error(err);
    });
}

export function deleteSetupHuman(data, success, error) {
  api
    .post(`${backendURL}settings/deletehumantakeover`, data, {
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
      if(err.response)
 error(err.response.data || {});
      else
error(err);
    });
}