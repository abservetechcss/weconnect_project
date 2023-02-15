// Inorder to define custom styles, hooks needed to bring inside selfhosted
import { useEffect, useMemo, useReducer, useRef, useState } from "react";

import { COLORS, WEBCHAT, MODES } from "../constants";
import { scrollToBottom } from "../util/dom";
import {
  ADD_MESSAGE,
  ADD_MESSAGE_COMPONENT,
  CLEAR_MESSAGES,
  SET_CURRENT_ATTACHMENT,
  SET_ERROR,
  SET_ONLINE,
  TOGGLE_COVER_COMPONENT,
  TOGGLE_EMOJI_PICKER,
  TOGGLE_PERSISTENT_MENU,
  TOGGLE_WEBCHAT,
  UPDATE_DEV_SETTINGS,
  UPDATE_HANDOFF,
  UPDATE_JWT,
  UPDATE_LAST_MESSAGE_DATE,
  UPDATE_LAST_ROUTE_PATH,
  UPDATE_LATEST_INPUT,
  UPDATE_MESSAGE,
  UPDATE_REPLIES,
  UPDATE_SESSION,
  UPDATE_THEME,
  UPDATE_TYPING,
  UPDATE_WEBVIEW,
  UPDATE_MESSAGE_COMPONENT,
  UPDATE_LAST_MESSAGE_COMPONENT,
  SET_WEBSOCKET_ACTIVE,
  UPDATE_READ_MESSAGE
} from "./actions";
import { webchatReducer } from "./webchat-reducer";

export const webchatInitialState = {
  width: WEBCHAT.DEFAULTS.WIDTH,
  height: WEBCHAT.DEFAULTS.HEIGHT,
  mode: MODES.WIDGET,
  messagesJSON: [],
  messagesComponents: [],
  replies: [],
  latestInput: {},
  profile: process.env.REACT_APP_LOGO,
  avatar: process.env.REACT_APP_LOGO,
  typing: false,
  webview: null,
  webviewParams: null,
  bot: {}, //on fetching first question
  environment: {}, //on fetching first question
  session_id: 0, //first question response
  questionStep: 0, // for progress bar
  botId: 0, //on loading
  session: { user: null },
  lastRoutePath: null,
  handoff: false,
  unreadCount: 0,
  previewMode: false,
  modal: {
    open: false,
    type: "continue", //feedback, continue are possible values
  },
  theme: {
    typing: "loader1",
    delay: 0,
    headerTitle: WEBCHAT.DEFAULTS.TITLE,
    brandColor: COLORS.BOTONIC_BLUE,
    brandImage: WEBCHAT.DEFAULTS.LOGO,
    progress_bar: 0,
    avatarScale: 50,
    opacity: 100,
    triggerButtonImage: undefined,
    textPlaceholder: WEBCHAT.DEFAULTS.PLACEHOLDER,
    style: {
      fontFamily: WEBCHAT.DEFAULTS.FONT_FAMILY,
    },
    header: {},
    headerStyle: {},
    widgetStyle: {},
    chatStyle: {},
  },
  metaProperties: {
    title: "WeConnect",
    description: "WeConnect",
  },
  chatsettings: {},
  themeUpdates: {},
  error: {},
  uploading: false,
  online: true,
  socket: false,
  devSettings: { keepSessionOnReload: false },
  isWebchatOpen: false,
  isEmojiPickerOpen: false,
  isPersistentMenuOpen: false,
  isCoverComponentOpen: false,
  lastMessageUpdate: undefined,
  currentAttachment: undefined,
  jwt: null,
  agent_sla_time_livechat: 30,
  agent_sla_time_videocall: 30,
  currentQuestionId: 0
};
export function useWebchat(RuntimeInitialState) {
  const initialstate = { ...webchatInitialState, ...RuntimeInitialState };
  const [webchatState, webchatDispatch] = useReducer(
    webchatReducer,
    initialstate
  );

  const addMessage = (message) =>
    webchatDispatch({ type: ADD_MESSAGE, payload: message });
  const addMessageComponent = (message) =>
    webchatDispatch({ type: ADD_MESSAGE_COMPONENT, payload: message });

  const updateMessageComponent = (message) =>
    webchatDispatch({ type: UPDATE_MESSAGE_COMPONENT, payload: message });

  const updateReadStatus = (message) =>
    webchatDispatch({ type: UPDATE_READ_MESSAGE, payload: message });


  const updateLastMessage = (message) =>
    webchatDispatch({ type: UPDATE_LAST_MESSAGE_COMPONENT, payload: message });

  const updateMessage = (message) =>
    webchatDispatch({ type: UPDATE_MESSAGE, payload: message });
  const updateReplies = (replies) =>
    webchatDispatch({ type: UPDATE_REPLIES, payload: replies });
  const updateLatestInput = (input) =>
    webchatDispatch({ type: UPDATE_LATEST_INPUT, payload: input });
  const updateTyping = (typing) =>
    webchatDispatch({ type: UPDATE_TYPING, payload: typing });
  const updateWebview = (webview, params) =>
    webchatDispatch({
      type: UPDATE_WEBVIEW,
      payload: { webview, webviewParams: params },
    });
  const updateSession = (session) => {
    console.log('updateSession', session);
    webchatDispatch({
      type: UPDATE_SESSION,
      payload: session,
    });
  };

  const updateLastRoutePath = (path) =>
    webchatDispatch({
      type: UPDATE_LAST_ROUTE_PATH,
      payload: path,
    });
  const updateHandoff = (handoff) =>
    webchatDispatch({
      type: UPDATE_HANDOFF,
      payload: handoff,
    });
  const updateTheme = (theme, themeUpdates = undefined) => {
    const payload =
      themeUpdates !== undefined ? { theme, themeUpdates } : { theme };
    webchatDispatch({
      type: UPDATE_THEME,
      payload,
    });
  };

  const updateChatSettings = (chatSettings) => {
    webchatDispatch({
      type: UPDATE_THEME,
      payload: chatSettings,
    });
  };
  const updateDevSettings = (settings) =>
    webchatDispatch({
      type: UPDATE_DEV_SETTINGS,
      payload: settings,
    });
  const toggleWebchat = (toggle) =>
    webchatDispatch({
      type: TOGGLE_WEBCHAT,
      payload: toggle,
    });
  const toggleEmojiPicker = (toggle) =>
    webchatDispatch({
      type: TOGGLE_EMOJI_PICKER,
      payload: toggle,
    });
  const togglePersistentMenu = (toggle) =>
    webchatDispatch({
      type: TOGGLE_PERSISTENT_MENU,
      payload: toggle,
    });
  const toggleCoverComponent = (toggle) =>
    webchatDispatch({
      type: TOGGLE_COVER_COMPONENT,
      payload: toggle,
    });
  const setError = (error) =>
    webchatDispatch({
      type: SET_ERROR,
      payload: error,
    });
  const setOnline = (online) =>
    webchatDispatch({
      type: SET_ONLINE,
      payload: online,
    });

  const setSocket = (online) =>
    webchatDispatch({
      type: SET_WEBSOCKET_ACTIVE,
      payload: online,
    });

  const clearMessages = () => {
    webchatDispatch({
      type: CLEAR_MESSAGES,
    });
  };
  const updateLastMessageDate = (date) => {
    webchatDispatch({
      type: UPDATE_LAST_MESSAGE_DATE,
      payload: date,
    });
  };
  const setCurrentAttachment = (attachment) => {
    webchatDispatch({
      type: SET_CURRENT_ATTACHMENT,
      payload: attachment,
    });
  };

  const updateJwt = (jwt) => {
    webchatDispatch({
      type: UPDATE_JWT,
      payload: jwt,
    });
  };

  return {
    webchatState,
    updateReadStatus,
    updateChatSettings,
    webchatDispatch,
    addMessage,
    addMessageComponent,
    updateMessage,
    updateReplies,
    updateLatestInput,
    updateTyping,
    updateWebview,
    updateSession,
    updateLastRoutePath,
    updateHandoff,
    updateTheme,
    updateDevSettings,
    toggleWebchat,
    toggleEmojiPicker,
    togglePersistentMenu,
    toggleCoverComponent,
    setError,
    setOnline,
    setSocket,
    clearMessages,
    updateLastMessageDate,
    setCurrentAttachment,
    updateJwt,
    updateMessageComponent,
    updateLastMessage,
  };
}

export function updateSendStatus({ webchatState, updateMessage, msgId }) {
  if (webchatState.messagesJSON) {
    const nextMsg = webchatState.messagesJSON.filter((m) => m.readStatus === 0 && m.id === msgId)[0];
    console.log("nextMsg", nextMsg);
    if (nextMsg)
      updateMessage({ ...nextMsg, readStatus: 1 });
  }
}

export function updateReadStatus({ webchatState, updateMessage }) {
  if (webchatState.messagesJSON) {
    const nextMsg = webchatState.messagesJSON.filter((m) => m.readStatus === 1);
    console.log("nextMsg", nextMsg);
    if (nextMsg)
      updateMessage({ ...nextMsg, readStatus: 1 });
  }
}

export function useTyping({ webchatState, updateTyping, updateMessage, host }) {
  useEffect(() => {
    let delayTimeout, typingTimeout;
    const lastRoutePath = webchatState.lastRoutePath;
    scrollToBottom({ host });
    if (
      lastRoutePath === null ||
      lastRoutePath === "message" ||
      lastRoutePath === "text_question" ||
      lastRoutePath === "knowledge_transfer" ||
      lastRoutePath === "multi_choice" ||
      lastRoutePath === "welcome_card" ||
      lastRoutePath === "opinion_scale" ||
      lastRoutePath === "number" ||
      lastRoutePath === "phone_number" ||
      lastRoutePath === "email" ||
      lastRoutePath === "range" ||
      lastRoutePath === "date" ||
      lastRoutePath === "multi_select" ||
      lastRoutePath === "file_upload" ||
      lastRoutePath === "rating" ||
      lastRoutePath === "carousal" ||
      lastRoutePath === "appointment" ||
      lastRoutePath === "links"
    ) {
      try {
        const nextMsg = webchatState.messagesJSON.filter((m) => !m.display)[0];
        if (nextMsg.delay && nextMsg.typing) {
          delayTimeout = setTimeout(
            () => updateTyping(true),
            nextMsg.delay * 1000
          );
        } else if (nextMsg.typing) updateTyping(true);
        const totalDelay = nextMsg.delay + nextMsg.typing;
        if (totalDelay) {
          typingTimeout = setTimeout(() => {
            updateMessage({ ...nextMsg, display: true });
            updateTyping(false);
          }, totalDelay * 1000);
        }
      } catch (e) { }
    } else {
      const nextMsg = webchatState.messagesJSON.filter((m) => !m.display)[0];
      if (nextMsg) {
        updateMessage({ ...nextMsg, display: true });
        updateTyping(false);
      }
    }
    return () => {
      clearTimeout(delayTimeout);
      clearTimeout(typingTimeout);
    };
  }, [webchatState.messagesJSON, webchatState.typing]);
}


export function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export function useComponentVisible(initialIsVisible, onClickOutside) {
  const [isComponentVisible, setIsComponentVisible] =
    useState(initialIsVisible);
  const ref = useRef(null);
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
      onClickOutside();
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleClickOutside, false);
    return () => {
      document.removeEventListener("click", handleClickOutside, false);
    };
  }, []);
  return { ref, isComponentVisible, setIsComponentVisible };
}

export const useComponentWillMount = (func) => {
  useMemo(func, []);
};
