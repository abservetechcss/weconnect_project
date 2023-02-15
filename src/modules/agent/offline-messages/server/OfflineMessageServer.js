import { backendURL } from "../../../../variables/appVariables.jsx";
import { api } from "../../../../js/api.js";
import { useContext } from "react";
import { AlertContext } from "../../../common/Alert.jsx";


export function getAllOfflineMsgList(params, success, error) {
  api
    .get(`${backendURL}agent/offlinemsglist?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

export function getSingleOfflineMsgInfo(params, success, error) {
  api
    .get(`${backendURL}agent/viewofflinemessage?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

function imageUpload(data, success, error) {
  api
    .post(`${backendURL}bot/fileUpload/`, data, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
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

export function uploadImageCallBack(file, filetype) {
  return new Promise((resolve, reject) => {
    var formData = new FormData();
    formData.append("file", file);
    formData.append("type", filetype);
    imageUpload(formData, (data) => {
      resolve({ data: { link: data.file } });
    },
      (error) => {
        console.log(error);
        reject();
      }
    )
  });
}

export function replySingleMessage(data, success, error) {
  api
    .post(`${backendURL}agent/replyemail`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

export function replyAllMessage(data, success, error) {
  api
    .post(`${backendURL}agent/email`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

export function starredEmail(data, success, error) {
  api
    .post(`${backendURL}agent/starredemail`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

export function updateThread(data, success, error) {
  api
    .post(`${backendURL}agent/updatethread`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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

export function leadEmail(data, success, error) {
  api
    .post(`${backendURL}agent/leademail`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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


export function saveDraft(data, success, error) {
  api
    .post(`${backendURL}agent/savedraft`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
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