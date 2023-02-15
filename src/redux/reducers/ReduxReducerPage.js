import { ActionTypes } from "../constants/action-types";
export const getInnerSideBarChat = (state = {}, { type, payload }) => {
  switch (type) {
    case ActionTypes.set_innerChatSidebar:
      return { ...state, sideBar: payload };
    default:
      return state;
  }
};

export const webchat = (state = { newVisitor: [], chatPreviewType: "desktop" }, { type, payload }) => {
  switch (type) {
    case ActionTypes.set_webchat:
      return { ...state, newVisitor: payload };
    case ActionTypes.set_unread_count:
      return { ...state, unReadCount: payload };
    // as video chat message comes on accept response, I have to store & insert later
    case ActionTypes.set_video_chat:
      return { ...state, videoChat: payload };
    case ActionTypes.ACTIVE_VISITOR:
      return { ...state, activeVisitor: payload };
    case ActionTypes.SET_CHAT_PREVIEW:
      return { ...state, chatPreviewType: payload };


    default:
      return state;
  }
};

export const builder = (state = { botId: 0 }, { type, payload }) => {
  switch (type) {
    case ActionTypes.set_component:
      return {
        ...state,
        questionId: payload.questionId,
        type: payload.type,
      };
    default:
      return state;
  }
};

export const getSelectBotIdDetails = (state = {}, { type, payload }) => {
  switch (type) {
    case ActionTypes.set_select_botId:
      return { ...state, selectBotList: payload };
    default:
      return state;
  }
};

export const getUserProfile = (state = {
  userData: {},
  agentStatus: true,
  activeCall: [],
  notify: [],
  raibuNotify: [],
  features: [],
  setting: {}
}, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_USER_PROFILE:
      return { ...state, userData: payload };
    case ActionTypes.SET_AGENT_STATUS:
      return { ...state, agentStatus: payload };
    case ActionTypes.SET_TEST_MODE:
      return { ...state, testMode: payload };
    case ActionTypes.SET_ACTIVE_CALL:
      return { ...state, activeCall: payload };
    case ActionTypes.SET_ACTIVE_RAIBU_NOTIFY:
      return { ...state, raibuNotify: payload };
    case ActionTypes.SET_ACTIVE_NOTIFY:
      return { ...state, notify: payload };
    case ActionTypes.SET_SETTINGS:
      return { ...state, settings: payload };
    case ActionTypes.SET_NEW_FEATURES:
      return { ...state, features: payload };
    default:
      return state;
  }
};

export const getModes = (state = {
  leads: "live",
}, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_LEADS_TEST_MODE:
      return { ...state, leads: payload };
    default:
      return state;
  }
};

export const knowledgeBase = (state = {
  article: [],
  category: [],
  categorylist: [],
  articlelist: [],
  categoryForm: {
    type: "create",
    name: "",
    id: ""
  },
  articleForm: {
    messageText: "",
    slug: "",
    subtype: "",
    newtab: 0,
    category_id: "",
    tags: "",
    title: "",
    description: "",
    type: "create",
  }
}, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_KNWOELDGE_CATEGORY:
      return { ...state, category: payload };
    case ActionTypes.SET_KNWOELDGE_CATEGORYLIST:
      return { ...state, categorylist: payload };
    case ActionTypes.SET_KNWOELDGE_ARTICLE:
      return { ...state, article: payload };
    case ActionTypes.SET_KNWOELDGE_ARTILCELIST:
      return { ...state, articlelist: payload };
    case ActionTypes.SET_KNWOELDGE_CATEGORY_FORM:
      return { ...state, categoryForm: payload };
    case ActionTypes.SET_KNWOELDGE_ARTICLE_FORM:
      return { ...state, articleForm: payload };

    default:
      return state;
  }
}

export const offlineForm = (state = {
  unReadCount: {},
  MessageList: [],
  messages: {},
  selectedMessage: [],
}, { type, payload }) => {
  switch (type) {
    case ActionTypes.SET_OFFLINEFORM_UNREAD_COUNT:
      return {
        ...state, unReadCount: {
          ...state.unReadCount,
          ...payload
        }
      };
    case ActionTypes.SET_OFFLINEFORM_MESSAGES:
      return {
        ...state, messages: {
          ...state.messages,
          ...payload
        }
      };
    case ActionTypes.SET_OFFLINEFORM_MESSAGES_LIST:
      return {
        ...state, MessageList: [
          ...state.MessageList,
          ...payload
        ]
      };
    case ActionTypes.SET_OFFLINEFORM_SELECTED_MESSAGE:
      return {
        ...state, selectedMessage: [
          ...state.selectedMessage,
          ...payload
        ]
      };
    default:
      return state;
  }
}

