import { ActionTypes } from "../constants/action-types";

export const setInnerSideBar = (data) => {
  return {
    type: ActionTypes.set_innerChatSidebar,
    payload: data,
  };
};

// export const setNewVisitor = (data) => {
//   return {
//     type: ActionTypes.set_webchat,
//     payload: data
//   };
// };

export const setNewVisitor = (data) => (dispatch) => {
  dispatch({
    type: ActionTypes.set_webchat,
    payload: data,
  });
  return Promise.resolve();
};

export const setUnreadCount = (data) => {
  return {
    type: ActionTypes.set_unread_count,
    payload: data,
  };
};

export const setVideoChatLink = (data) => {
  return {
    type: ActionTypes.set_video_chat,
    payload: data,
  };
};

export const setSelectBotDetails = (data) => (dispatch) => {
  dispatch({
    type: ActionTypes.set_select_botId,
    payload: data,
  });
  return Promise.resolve();
};
export const setActiveVisitor = (data) => (dispatch) => {
  dispatch({
    type: ActionTypes.ACTIVE_VISITOR,
    payload: data,
  });
  return Promise.resolve();
};

export const setBuilderComponent = (data) => (dispatch) => {
  dispatch({
    type: ActionTypes.set_component,
    payload: data,
  });
  return Promise.resolve();
};

export const setUserProfile = (data) => {
  return {
    type: ActionTypes.SET_USER_PROFILE,
    payload: data,
  };
};

export const setAgentStatus = (data) => {
  return {
    type: ActionTypes.SET_AGENT_STATUS,
    payload: data,
  };
};

export const setTestMode = (data) => {
  return {
    type: ActionTypes.SET_TEST_MODE,
    payload: data,
  };
};

export const setSettings = (data) => {
  return {
    type: ActionTypes.SET_SETTINGS,
    payload: data,
  };
};

export const setActiveCalls = (data) => {
  return {
    type: ActionTypes.SET_ACTIVE_CALL,
    payload: data,
  };
};

export const setActiveRaibuNotify = (data) => {
  return {
    type: ActionTypes.SET_ACTIVE_RAIBU_NOTIFY,
    payload: data,
  };
};

export const setActiveNotify = (data) => {
  return {
    type: ActionTypes.SET_ACTIVE_NOTIFY,
    payload: data,
  };
};

export const setLeadsTestMode = (data) => {
  return {
    type: ActionTypes.SET_LEADS_TEST_MODE,
    payload: data,
  };
};

export const setNewFeatures = (data) => {
  return {
    type: ActionTypes.SET_NEW_FEATURES,
    payload: data,
  };
};

export const setKnowledgeCategory = (data) => {
  return {
    type: ActionTypes.SET_KNWOELDGE_CATEGORY,
    payload: data,
  };
};

export const setKnowledgeCategoryList = (data) => {
  return {
    type: ActionTypes.SET_KNWOELDGE_CATEGORYLIST,
    payload: data,
  };
};

export const setKnowledgeArticle = (data) => {
  return {
    type: ActionTypes.SET_KNWOELDGE_ARTICLE,
    payload: data,
  };
};

export const setKnowledgeArticleList = (data) => {
  return {
    type: ActionTypes.SET_KNWOELDGE_ARTILCELIST,
    payload: data,
  };
};

export const setKnowledgeArticleForm = (data) => {
  return {
    type: ActionTypes.SET_KNWOELDGE_ARTICLE_FORM,
    payload: data,
  };
};

export const setKnowledgeCategoryForm = (data) => {
  return {
    type: ActionTypes.SET_KNWOELDGE_CATEGORY_FORM,
    payload: data,
  };
};

export const setOfflineMessageList = (data) => {
  return {
    type: ActionTypes.SET_OFFLINEFORM_MESSAGES_LIST,
    payload: data,
  };
};

export const setUpdateNotification = (data) => {
  return {
    type: ActionTypes.SET_UPDATE_NOTIFICATION,
    payload: data,
  };
};

export const setOfflineUnread = (data) => {
  return {
    type: ActionTypes.SET_OFFLINEFORM_UNREAD_COUNT,
    payload: data,
  };
};

export const setOfflineMessages = (data) => {
  return {
    type: ActionTypes.SET_OFFLINEFORM_MESSAGES,
    payload: data,
  };
};

export const setOfflineSelectedMessage = (data) => {
  return {
    type: ActionTypes.SET_OFFLINEFORM_SELECTED_MESSAGE,
    payload: data,
  };
};

export const setChatPreview = (data) => {
  return {
    type: ActionTypes.SET_CHAT_PREVIEW,
    payload: data,
  };
};
