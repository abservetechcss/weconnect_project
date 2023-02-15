import { backendURL } from "../../../../variables/appVariables.jsx";
import { api, cancelToken } from "../../../../js/api.js";


let ajaxRequest = null;
let ajaxRequest1 = null;
let ajaxRequest2 = null;
export async function getAllVisitorList(params, success, error) {
  // Cancel previous request
  if (ajaxRequest) {
    ajaxRequest.cancel();
  }
  ajaxRequest = cancelToken();
  return api
    .get(`${backendURL}agent/visitorlist?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      cancelToken: ajaxRequest.token,
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    })
    .catch(function (err) {
      if (err.response)
        error(err.response.data || {});
      else
        error(err);
    });
}

export function getVisitorSearchList(params, success, error) {
  // Cancel previous request
  if (ajaxRequest1) {
    ajaxRequest1.cancel();
  }
  ajaxRequest1 = cancelToken();
  return api
    .get(`${backendURL}agent/visitorsearchlist?${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      cancelToken: ajaxRequest1.token,
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

export async function getOpenedVisitorList() {
  if (ajaxRequest2) {
    ajaxRequest2.cancel();
  }
  ajaxRequest2 = cancelToken();
  return api
    .get(`${backendURL}agent/raibunotificationlist`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      cancelToken: ajaxRequest2.token,
    });
}

export function getSingleVisitorInfo(params, success, error) {
  api
    .get(`${backendURL}agent/visitordetail?${params}`, {
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
export function updateVisitorNameInfo(data, success, error) {
  api
    .post(`${backendURL}agent/visitorupdatename`, data, {
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

export function uploadAttachment(data, success, error) {
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

export function updateVisitorNotes(data, success, error) {
  api
    .post(`${backendURL}agent/visitornotes`, data, {
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

export function createMarkLeadVisitor(data, success, error) {
  api
    .post(`${backendURL}agent/marklead`, data, {
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
export function fetchLeadsDetails(params, success, error) {
  api
    .get(`${backendURL}agent/editleadinformation?${params}`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
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
export function updateLeadsInfo(params, data, success, error) {
  api
    .post(`${backendURL}agent/updateleadinformation?visitorid=${params}`, data, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch((err) => {
      let Msg = "Lead Update failed";
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