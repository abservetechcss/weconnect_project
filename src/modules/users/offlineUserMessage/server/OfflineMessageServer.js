import { backendURL } from "../../../../variables/appVariables.jsx";
import { api } from "../../../../js/api.js";


export function getAllOfflineMsgList(params, success, error) {
  api
    .get(`${backendURL}getmail?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch(function (err) {
      if(err.response)
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
      if(err.response)
 error(err.response.data || {});
      else
error(err);
    });
}

export function uploadImageCallBack(file, botId, questionId) {
  return new Promise((resolve, reject) => {
    
      var formData = new FormData();
      formData.append("file", file);

      imageUpload(formData, (data)=>{
        resolve({ data: { link: data.file } });
      },
      (error)=>{
        console.log(error);
        reject();
      });

    });
}

export function replySingleMessage(data, success, error) {
  api
    .post(`${backendURL}sendmail`, data, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch(function (err) {
      if(err.response)
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
      if(err.response)
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
      if(err.response)
 error(err.response.data || {});
      else
error(err);
    });
}