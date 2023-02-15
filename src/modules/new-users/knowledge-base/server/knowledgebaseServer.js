import { backendURL } from "../../../../variables/appVariables.jsx";
import { api } from "../../../../js/api.js";

export function createAndUpdateCategory(params, success, error) {
  api
    .post(`${backendURL}admin/category`, params, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch((err) => {
      let Msg = "Component create failed";
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


export function searchArticleList(param1, param2, success, error) {
  api
    .get(`${backendURL}admin/searchknowledgebase?value=${param1}Description&bot_id=${param2}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      if (res.status === "True") {
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
    })
}

export function getCatList(params, success, error) {
  api
    .get(`${backendURL}admin/catlist`, {
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
      if (err.response)
        error(err.response.data || {});
      else
        error(err);
    })
}

export function getCategoryList(params, success, error) {
  api
    .get(`${backendURL}admin/botlistarticle${params}`, {
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
      if (err.response)
        error(err.response.data || {});
      else
        error(err);
    })
}

export function deleteAndEditCategory(params, success, error) {
  api
    .get(`${backendURL}admin/cateditdel/${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch((err) => {
      let Msg = "Component create failed";
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

export function createAndUpdateArticle(params, success, error) {
  api
    .post(`${backendURL}admin/article`, params, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch((err) => {
      let Msg = "Component create failed";
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


export function listArticle(params, success, error) {
  api
    .get(`${backendURL}admin/listarticle${params}`, {
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

export function fetchAndDeleteArticle(params, success, error) {
  api
    .get(`${backendURL}admin/articleeditdel${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch((err) => {
      let Msg = "Component create failed";
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

export function duplicateArticle(params, success, error) {
  api
    .post(`${backendURL}admin/articleduplicate`, params, {
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


export function deleteArticle(params, success, error) {
  api
    .get(`${backendURL}admin/articleeditdel${params}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      if (res.status === 200) {
        success(res.data);
      } else {
        error(res.data);
      }
    }).catch((err) => {
      let Msg = "Article delete failed";
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