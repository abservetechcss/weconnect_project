import { backendURL } from "../../../../variables/appVariables.jsx";
import { api } from "../../../../js/api.js";


export function getTemplateList(params, success, error) {
  api
    .get(`${backendURL}admin/templatemanagerlist?${params}`, {
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

export function getCategoryCountList(params, success, error) {
  api
    .get(`${backendURL}admin/categorycount${params}`, {
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
export function getSingleTemplate(params, success, error) {
  api
    .get(`${backendURL}admin/edittemplate?${params}`, {
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
export function templateActiveStatus(data, success, error) {
  api
    .post(`${backendURL}admin/activedeactivetemplate`, data, {
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

export function createTemplate(data, success, error) {
  api
    .post(`${backendURL}admin/createtemplate`, data, {
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
export function updateTemplate(data, success, error) {
  api
    .post(`${backendURL}admin/updatetemplate`, data, {
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
export function deleteTemplate(data, success, error) {
  api
    .post(`${backendURL}admin/deletetemplate`, data, {
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

export function getTemplateFilterList(params, success, error) {
  api
    .get(`${backendURL}admin/templatelist${params}`, {
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
export function templateLikeStatus(data,_this, success, error) {
  api
    .post(`${backendURL}admin/templatelikedislike`, data, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
    .then((res) => {
     _this.fetchDataFromServer();
      if (res.data) {
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
export function CreateUseTemplate(data, success, error) {
  api
    .post(`${backendURL}admin/usetemplate`, data, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
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
      if(err.response)
 error(err.response.data || {});
      else
error(err);
    });
}