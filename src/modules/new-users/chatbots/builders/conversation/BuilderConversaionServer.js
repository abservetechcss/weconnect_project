import { backendURL } from "../../../../../variables/appVariables.jsx";
import { api } from "../../../../../js/api.js";

import { EditorState, AtomicBlockUtils} from 'draft-js';

export function createComponent(data, success, error) {
  api
    .post(`${backendURL}bot/createcomponent`, data, {
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

export function copyComponent(data, success, error) {
  api
    .post(`${backendURL}bot/copycomponent`, data, {
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
    }).catch((err) => {
      error(err.message);
    });
}

export function uploadImageCallBack(file, botId, questionId) {
  return new Promise((resolve, reject) => {
      var formData = new FormData();
      formData.append("bot_id", botId);
      formData.append("question_id", questionId);
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

const insertImage = ( url, editorState) => {
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
      `IMAGE`,
      `IMMUTABLE`,
      { src: url },)
const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
const newEditorState = EditorState.set( editorState, { currentContent: contentStateWithEntity });
return AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ` `);
};

export function handlePastedFiles(file, botId, questionId, editorState, setEditorState) {
  return new Promise((resolve, reject) => {
      var formData = new FormData();

      formData.append("bot_id", botId);
      formData.append("question_id", questionId);
      formData.append("file", file);

      imageUpload(formData, (data)=>{
        
        setEditorState(insertImage(data.file, editorState));

        resolve(data.file); //image is directly resolved for pasted image
      },
      (error)=>{
        console.log(error);
        reject();
      });
      
    });
}


export function updateComponent(data, success, error) {
  api
    .post(`${backendURL}bot/updatecomponent`, data, {
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
      let Msg = "Component update failed";
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

export function listComponent(params, success, error) {
  api
    .get(`${backendURL}bot/listcomponent/?${params}`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
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

export function getSavedComponent(params, success, error) {
  api
    .get(`${backendURL}bot/editcomponent/?${params}`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
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

export function deleteComponent(params, success, error) {
  api
    .get(`${backendURL}bot/deletecomponent?` + params, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
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

export function getLogicalJumpComp(params, success, error) {
  api
    .get(`${backendURL}bot/editlogicaljump?${params}`, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") },
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

export function createLogicalJumpComp(params, data, success, error) {
  api
    .post(`${backendURL}bot/updatelogicaljump?${params}`, data, {
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
      if (err.response && err.response.status === 422) {
        let data = err.response.data;
        let Msg = "";
        if (Object.keys(data) && Object.keys(data).length > 1) {
          Object.keys(data) &&
            Object.keys(data).map((prop, key) => {
              if (key === 0) alert(`${data[prop][0]}`);
            });
          Msg = data[Object.keys(data)];
        } else {
          Msg = data[Object.keys(data)][0];
          alert(`${Msg}`);
        }
      } else {
        if(err.response)
 error(err.response.data || {});
      else
error(err);
      }
    });
}

export function updateSequence(data, success, error) {
  api
    .post(`${backendURL}bot/updateSequence`, data, {
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
      if (err.response && err.response.status === 422) {
        let data = err.response.data;
        let Msg = "";
        if (Object.keys(data) && Object.keys(data).length > 1) {
          Object.keys(data) &&
            Object.keys(data).map((prop, key) => {
              if (key === 0) alert(`${data[prop][0]}`);
            });
          Msg = data[Object.keys(data)];
        } else {
          Msg = data[Object.keys(data)][0];
          alert(`${Msg}`);
        }
      } else {
        if(err.response)
 error(err.response.data || {});
      else
error(err);
      }
    });
}

export function deleteLogicalJumpComponent(params,data, success, error) {
  api
    .post(`${backendURL}bot/deletelogicaljump?${params}`, data, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
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

export function skipComponent(data, success, error) {
  api
    .post(`${backendURL}bot/enablebot`, data, {
      headers: { Authorization: "Bearer " + localStorage.getItem("token") }
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

/**
* Insert In Middle Component Logic
* Get Sequence
* Change Sequence & make empty slot in middle
* Create Component
*/

export function insertComponent(param, success, error) {
  const botId = param.bot_id;
 const params = "bot_id=" + botId;
 listComponent(params,
  (res)=>{
   if(res.status==="True") {
     const newList = res.list.filter(item=>{
       if(item.question_id===param.question_id)
       return false;
       return true;
     });
     newList.splice(param.orderNo, 0, param);
     const myData = new FormData();
                           myData.append("bot_id", botId);
                           newList.forEach((item) => {
                             myData.append(
                               "question_id[]",
                               item.question_id
                             );
                           });
                           updateSequence(myData, (res) => {
                             if (res.status === "True") {
                              success(res);
                             } else {
                              error(res);
                             }
                           },(err)=>{
                             error(err);
                           });
   } else {
    error(res);
   }

 },
 (err)=>{
   error(err)
 })
}