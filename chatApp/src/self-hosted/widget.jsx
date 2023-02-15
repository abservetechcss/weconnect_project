import { INPUT, params2queryString } from "@botonic/core";
import { isMobile } from "./lib";
import { motion } from "framer-motion";
import merge from "lodash.merge";
import React, {
  forwardRef,
  lazy,
  Suspense,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Textarea from "react-textarea-autosize";

import RiDeleteBin7Line from "../assets/react-icons/RiDeleteBin7Line";
import BsMic from "../assets/react-icons/BsMic";
import ImAttachment from "../assets/react-icons/ImAttachment";

import styled, { createGlobalStyle } from "styled-components";
import { v4 as uuidv4 } from "uuid";
import { useRecorder } from "../hooks/useRecorder";
import send1 from "../assets/send1.png";
import send from "../assets/send.png";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import doc from "../assets/botonic/file.svg";
import image from "../assets/botonic/image (1).svg";
import map from "../assets/botonic/pin.png";
import headphone from "../assets/botonic/headphones (1).svg";
import {
  Text,
  Image,
  GifImage,
  Audio,
  Document,
  Video,
  Location,
} from "../components";
import AudioPlayer from "../components/audioPlayer";
import IconButton from "@mui/material/IconButton";
// import { Handoff } from '../components/handoff'
import { normalizeWebchatSettings } from "../components/webchat-settings";
import {
  COLORS,
  MAX_ALLOWED_SIZE_MB,
  SENDERS,
  WEBCHAT,
  MIME_WHITELIST,
} from "../constants";
import { RequestContext, WebchatContext } from "../contexts";

import {
  getMediaType,
  isAllowedSize,
  isAudio,
  isDocument,
  isImage,
  isMedia,
  isText,
  isVideo,
  readDataURL,
  isLocation,
  isOfType,
} from "./message-utils";
import "yet-another-abortcontroller-polyfill";
import { fetch } from "whatwg-fetch";
import defaultTheme from "../defaultTheme";
import Slider from "@mui/material/Slider";
import { scrollToBottom } from "../util/dom";
import { ConditionalWrapper } from "../util/react";
import { deserializeRegex, stringifyWithRegexs } from "../util/regexs";
import { getServerErrorMessage, initSession } from "../util/webchat";
import { ReactComponent as SmileSvg } from "../assets/smile (2).svg";
import { ReactComponent as GifPickerSvg } from "../assets/Group 19616.svg";
import { ReactComponent as EndSvg } from "../assets/Group 20355.svg";
import { getProperty } from "../util/objects";
import { OpenedPersistentMenu } from "../webchat/components/persistent-menu";
import { TypingIndicator } from "../webchat/components/typing-indicator";
import { DeviceAdapter } from "../webchat/devices/device-adapter";
import {
  useComponentWillMount,
  useWebchat,
  updateSendStatus,
} from "../webchat/hooks";
import { WebchatMessageList } from "../webchat/message-list";
import { useStorageState } from "../webchat/use-storage-state-hook";
import { WebviewContainer } from "./webview";
import { WebchatReplies } from "../components/WebchatReplies";
import { Attachment } from "../webchat/components/attachment";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import { WidgetWrapper } from "./widgetWrapper";
import { LandingWrapper } from "./landingWrapper";
import { EmbedWrapper } from "./embedWrapper";

import Covercomponent1 from "../webchat/covercomponent";
import Covercomponent2 from "../webchat/covercomponent2";
import Covercomponent3 from "../webchat/covercomponent3";
import Modal from "./modal";
import Backdrop from "./BackDrop";
import Tooltip from "@mui/material/Tooltip";

const OpenedEmojiPicker = lazy(() =>
  import("../webchat/components/emoji-picker")
);

const OpenedGiphyPicker = lazy(() =>
  import("../webchat/components/giphy-picker")
);

function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}
function getColorJson(json, defaultStyle) {
  let color = json;
  if (isJsonString(color)) {
    const obj = JSON.parse(json);
    if (obj.style) {
      color = obj.style;
    } else if (defaultStyle) {
      color = defaultStyle;
    }
  } else if (defaultStyle) {
    color = defaultStyle;
  }

  return color;
}

const Htmlcontainerstyle = createGlobalStyle`
html.weconnecthtmlcontainer,html.weconnecthtmlcontainer > body
{overflow:hidden !important;}
html.weconnecthtmlcontainer,html.weconnecthtmlcontainer > body
{position:static !important;transform:none !important;}
html.weconnecthtmlcontainer > body
{height:0 !important;margin:0 !important;}
html.weconnecthtmlcontainer > body
{height:100vh !important;}
`;

const WIDGETGLOBALSTYLE = createGlobalStyle`
.MuiTooltip-popperInteractive {
  z-index: 99999999999 !important;
}
[data-weconnect-simplebar] {
  position: relative;
  flex-direction: column;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-content: flex-start;
  align-items: flex-start;
}

.weconnect-simplebar-wrapper {
  overflow: hidden;
  width: inherit;
  height: inherit;
  max-width: inherit;
  max-height: inherit;

  /* height: calc(100vh - 160px)!important; */

}

.weconnect-simplebar-mask {
  direction: inherit;
  position: absolute;
  overflow: hidden;
  padding: 0;
  margin: 0;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  width: auto !important;
  height: auto !important;
  z-index: 0;
}

.weconnect-simplebar-offset {
  direction: inherit !important;
  box-sizing: inherit !important;
  resize: none !important;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  padding: 0;
  margin: 0;
  -webkit-overflow-scrolling: touch;
}

.weconnect-simplebar-content-wrapper {
  direction: inherit;
  box-sizing: border-box !important;
  position: relative;
  display: block;
  height: 100%; /* Required for horizontal native scrollbar to not appear if parent is taller than natural height */
  width: auto;
  max-width: 100%; /* Not required for horizontal scroll to trigger */
  max-height: 100%; /* Needed for vertical scroll to trigger */
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.weconnect-simplebar-content-wrapper::-webkit-scrollbar,
.weconnect-simplebar-hide-scrollbar::-webkit-scrollbar {
  width: 0;
  height: 0;
}

.weconnect-simplebar-content:before,
.weconnect-simplebar-content:after {
  content: ' ';
  display: table;
}

.weconnect-simplebar-placeholder {
  max-height: 100%;
  max-width: 100%;
  width: 100%;
  pointer-events: none;
}

.weconnect-simplebar-height-auto-observer-wrapper {
  box-sizing: inherit !important;
  height: 100%;
  width: 100%;
  max-width: 1px;
  position: relative;
  float: left;
  max-height: 1px;
  overflow: hidden;
  z-index: -1;
  padding: 0;
  margin: 0;
  pointer-events: none;
  flex-grow: inherit;
  flex-shrink: 0;
  flex-basis: 0;
}

.weconnect-simplebar-height-auto-observer {
  box-sizing: inherit;
  display: block;
  opacity: 0;
  position: absolute;
  top: 0;
  left: 0;
  height: 1000%;
  width: 1000%;
  min-height: 1px;
  min-width: 1px;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}

.weconnect-simplebar-track {
  z-index: 1;
  position: absolute;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

[data-weconnect-simplebar].weconnect-simplebar-dragging .weconnect-simplebar-content {
  pointer-events: none;
  user-select: none;
  -webkit-user-select: none;
}

[data-weconnect-simplebar].weconnect-simplebar-dragging .weconnect-simplebar-track {
  pointer-events: all;
}

.weconnect-simplebar-scrollbar {
  position: absolute;
  left: 0;
  right: 0;
  min-height: 10px;
}

.weconnect-simplebar-scrollbar:before {
  position: absolute;
  content: '';
  background: black;
  border-radius: 7px;
  left: 2px;
  right: 2px;
  opacity: 0;
  transition: opacity 0.2s linear;
}

.weconnect-simplebar-scrollbar.weconnect-simplebar-visible:before {
  /* When hovered, remove all transitions from drag handle */
  opacity: 0.5;
  transition: opacity 0s linear;
}

.weconnect-simplebar-track.weconnect-simplebar-vertical {
  top: 0;
  width: 11px;
}

.weconnect-simplebar-track.weconnect-simplebar-vertical .weconnect-simplebar-scrollbar:before {
  top: 2px;
  bottom: 2px;
}

.weconnect-simplebar-track.weconnect-simplebar-horizontal {
  left: 0;
  height: 11px;
}

.weconnect-simplebar-track.weconnect-simplebar-horizontal .weconnect-simplebar-scrollbar:before {
  height: 100%;
  left: 2px;
  right: 2px;
}

.weconnect-simplebar-track.weconnect-simplebar-horizontal .weconnect-simplebar-scrollbar {
  right: auto;
  left: 0;
  top: 2px;
  height: 7px;
  min-height: 0;
  min-width: 10px;
  width: auto;
}

/* Rtl support */
[data-weconnect-simplebar-direction='rtl'] .weconnect-simplebar-track.weconnect-simplebar-vertical {
  right: auto;
  left: 0;
}

.hs-dummy-scrollbar-size {
  direction: rtl;
  position: fixed;
  opacity: 0;
  visibility: hidden;
  height: 500px;
  width: 500px;
  overflow-y: hidden;
  overflow-x: scroll;
}

.weconnect-simplebar-hide-scrollbar {
  position: fixed;
  left: 0;
  visibility: hidden;
  overflow-y: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}
.weconnect-simplebar-content-wrapper::-webkit-scrollbar {
  display: none;
}
#botonic-scrollable-content > div.weconnect-simplebar-wrapper > div.weconnect-simplebar-mask > div > div ::-webkit-scrollbar {
  display: none;
}
#botonic-scrollable-content
  > div.weconnect-simplebar-wrapper
  > div.weconnect-simplebar-mask
  > div
  > div ::-webkit-scrollbar {
    // https://github.com/Grsmto/simplebar/issues/445#issuecomment-586902814
    display: none;
  }
  #botonic-scrollable-content
  > div.weconnect-simplebar-wrapper
  > div.weconnect-simplebar-mask
  > div
  > div {
  overscroll-behavior: contain; // https://css-tricks.com/almanac/properties/o/overscroll-behavior/
  -webkit-overflow-scrolling: touch;
}
`;

const asyncLoadGa = async (trackerId) =>
  import("./loadGa.js").then((js) => js.loadGa(trackerId));

const asyncLoadFb = async (trackerId) =>
  import("./loadFb.js").then((js) => js.loadFb(trackerId));

const asyncLoadHj = async (trackerId) =>
  import("./loadHj.js").then((js) => js.loadHj(trackerId));

function formatAMPM() {
  const date = new Date();
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

const mobileBreakpoint = 600;
const isGif = (msg) => isOfType(msg.type, "gif");

const WebFont = require("webfontloader");
let CoverComponent = Covercomponent1;

let savedResponse = {
  widget: {},
  landing: {},
  embed: {},
};

let abortFileUpload;

let savedEnvironment = {};

export const getParsedAction = (botonicAction) => {
  const splittedAction = botonicAction.split("create_case:");
  if (splittedAction.length <= 1) return undefined;
  return JSON.parse(splittedAction[1]);
};

const MessageContainer = styled.div`
  padding-left: ${(props) =>
    props.deviceMode === "mobile"
      ? "50px"
      : props.deviceMode === "tablet"
      ? "50px"
      : "50px"};
`;

const StyledDate = styled.div`
  text-align: center;
  color: #787878;
  font-family: inherit;
  font-size: 13px;
  margin: 10px 0 5px 0 !important;
`;

const UserInputContainer = styled.div`
  min-height: 43px;
  display: flex;
  position: relative;
  margin-right: 15px;
  margin-bottom: 23px;
  // border-top: 1px solid ${COLORS.SOLID_BLACK_ALPHA_0_5};
`;

const TextAreaContainer = styled.div`
  display: flex;
  flex: 1 1 auto;
  align-items: center;
`;

const FeaturesWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
`;

const ErrorMessageContainer = styled.div`
  position: relative;
  display: flex;
  z-index: 1;
  justify-content: center;
  width: 100%;
`;

const ErrorMessage = styled.div`
  position: absolute;
  top: 80px;
  font-size: 14px;
  line-height: 20px;
  padding: 4px 11px;
  display: flex;
  background-color: ${COLORS.ERROR_RED};
  color: ${COLORS.CONCRETE_WHITE};
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  font-family: inherit;
`;

const DarkBackgroundMenu = styled.div`
  background: ${COLORS.SOLID_BLACK};
  opacity: 0.3;
  z-index: 1;
  right: 0;
  bottom: 0;
  border-radius: 10px;
  position: absolute;
  width: 100%;
  height: 100%;
`;
const CopyRightContainer = styled.a`
  color: rgba(0, 0, 0, 0.87);
  text-decoration: none;
  font-size: 12px;
  font-weight: normal;
  display: flex;
  padding-bottom: 20px;
  font-family: Nunito;
  justify-content: center;
  align-items: center;
`;

// const actions = [
//   { icon: <img src={gif_picker} />, name: "GifPicker", type: "gif" },
//   { icon: <img src={smile} />, name: "EmojiPicker", type: "emoji" },
//   { icon: <img src={end} />, name: "EndChat", type: "endchat" },
// ];

let afterScrollPercent = 0;
let launchCriteriaWelcomeMessagePercent = 0;
let proacativeMessages = [];
let scrollParam = {
  showOnScroll: false,
  welcomeMessage: false,
};
let chatbotlist = {};
let chatStyle = {
  background: "rgba(255, 255, 255)", // default background of chat is constant & white
};
let pageStyle = {};
let proactiveStyle = {};
let controllerGetSettings = null;
// eslint-disable-next-line complexity
export const Webchat = forwardRef((props, ref) => {
  const initialState = {
    botId: props.botId,
    mode: props.mode,
    messagesComponents: [],
    isCoverComponentOpen: false,
    socket: props.socket,
  };
  const {
    webchatState,
    addMessage,
    addMessageComponent,
    updateMessage,
    updateReplies,
    updateLatestInput,
    updateReadStatus,
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
    doRenderCustomComponent,
    setError,
    setOnline,
    setSocket,
    clearMessages,
    openWebviewT,
    closeWebviewT,
    updateLastMessageDate,
    updateMessageComponent,
    updateLastMessage,
    updateChatSettings,
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = props.webchatHooks || useWebchat(initialState);

  const firstUpdate = useRef(true);
  const scrollContainer = useRef(null);
  let [audioURL, isRecording, startRecording, stopRecording, setAudioURL] =
    useRecorder();
  const isOnline = () => webchatState.online;
  const currentDateString = () => new Date().toISOString();
  const theme = merge(defaultTheme, webchatState.theme);
  const { initialSession, initialDevSettings, onStateChange } = props;
  // const getThemeProperty = _getThemeProperty(theme)
  const getThemeProperty = (property, defaultValue = undefined) => {
    const value = getProperty(theme, property);
    if (value !== undefined) return value;
    return defaultValue;
  };
  // const [scrollPercentage] = useScrollPercentage();
  const [chatSettings, setChatSettings] = useState({ load: false });
  const [Wrapper, setWrapper] = useState(WidgetWrapper);
  const [customComponent, setCustomComponent] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [giphyPickerOpen, setGiphyPickerOpen] = useState(false);
  const [emojiOpen, setemojiOpen] = useState(false);
  const [chatText, setChatText] = useState("");

  const storage = props.storage === undefined ? localStorage : props.storage;
  const storageKey =
    typeof props.storageKey === "function"
      ? props.storageKey()
      : props.storageKey;
  const [botonicState, saveState] = useStorageState(
    storage,
    storageKey || WEBCHAT.DEFAULTS.STORAGE_KEY
  );

  const host = props.host || document.body;
  const openAttach = Boolean(anchorEl);
  const deviceAdapter = new DeviceAdapter();

  const widgetThemeStyle = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.widgetStyle
  );

  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(!open);
  };
  const handleClickAttach = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseAttach = () => {
    setAnchorEl(null);
  };
  const saveWebchatState = (webchatState) => {
    storage &&
      saveState(
        JSON.parse(
          stringifyWithRegexs({
            messages: webchatState.messagesJSON,
            session: webchatState.session,
            lastMessageUpdate: webchatState.lastMessageUpdate,
            // lastRoutePath: webchatState.lastRoutePath,
            // devSettings: webchatState.devSettings,
            // themeUpdates: webchatState.themeUpdates,
          })
        )
      );
  };

  const handleAttachment = (event) => {
    if (!isAllowedSize(event.target.files[0].size)) {
      throw new Error(
        `The file is too large. A maximum of ${MAX_ALLOWED_SIZE_MB}MB is allowed.`
      );
    }
    handleCloseAttach();
    let a = {
      loading: true,
    };
    const merged = merge(webchatState, a);
    updateChatSettings(merged);
    const filename = event.target.files[0].name;
    const extension = filename.split(".").pop();
    const flieType = event.target.files[0].type;

    var formData = new FormData();
    formData.append("bot_id", webchatState.session.bot.id);
    formData.append("question_id", webchatState.currentQuestionId);
    formData.append("client_id", webchatState.session.bot.client_id);
    formData.append("file", event.target.files[0]);
    if (abortFileUpload) {
      abortFileUpload.abort();
    }
    const abortableFetch = "signal" in new Request("") ? window.fetch : fetch;
    abortFileUpload = new AbortController();

    abortableFetch(`${process.env.REACT_APP_ENV_API_URL}websocket/fileUpload`, {
      method: "post",
      signal: abortFileUpload.signal,
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .then(async (res) => {
        let a = {
          loading: false,
        };
        const merged = merge(webchatState, a);
        updateChatSettings(merged);
        if (res.status === "True") {
          let type = getMediaType(flieType);
          if (
            [
              "pdf",
              "doc",
              "docx",
              "xls",
              "xlsx",
              "ppt",
              "pptx",
              "rtf",
              "odt",
              "odp",
              "ods",
            ].includes(extension)
          ) {
            type = "document";
          }
          await sendInput({
            type: type,
            src: res.file,
            data: res.file,
            extension: extension,
            item: {
              btn_text: extension,
            },
          });
        } else {
          alert("upload failed!");
        }
      })
      .catch((err) => {
        alert("upload failed!");
        let a = {
          loading: false,
        };
        const merged = merge(webchatState, a);
        updateChatSettings(merged);
      });
  };

  const handleLocation = () => {
    handleCloseAttach();
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(async (location) => {
        const coords = location.coords;
        await sendInput({
          from: "user",
          type: "location",
          data: JSON.stringify({
            lat: coords.latitude,
            long: coords.longitude,
          }),
          extension: "location",
          item: {
            btn_text: "location",
          },
        });
      }, console.log);
    }
  };

  const handleAudio = () => {
    if (audioURL) {
      // todo: upload audio with extension
      if (audioURL.size && !isAllowedSize(audioURL.size)) {
        throw new Error(
          `The file is too large. A maximum of ${MAX_ALLOWED_SIZE_MB}MB is allowed.`
        );
      }
      const filename = "audio.webm";
      const extension = filename.split(".").pop();
      const flieType = "audio/webm";
      var formData = new FormData();
      formData.append("bot_id", webchatState.session.bot.id);
      formData.append("question_id", webchatState.currentQuestionId);
      formData.append("client_id", webchatState.session.bot.client_id);
      formData.append("file", audioURL);
      if (abortFileUpload) {
        abortFileUpload.abort();
      }
      const abortableFetch = "signal" in new Request("") ? window.fetch : fetch;
      abortFileUpload = new AbortController();

      abortableFetch(
        `${process.env.REACT_APP_ENV_API_URL}websocket/fileUpload`,
        {
          method: "post",
          signal: abortFileUpload.signal,
          body: formData,
        }
      )
        .then((response) => {
          return response.json();
        })
        .then(async (res) => {
          if (res.status === "True") {
            await sendInput({
              type: getMediaType(flieType),
              src: res.file,
              data: res.file,
              extension: extension,
              item: {
                btn_text: extension,
              },
            });
            handleCloseAttach();
          }
        });
      setAudioURL(null);
    }
  };

  const sendUserInput = async (input) => {
    props.onUserInput &&
      props.onUserInput({
        input: input,
        user: webchatState.session.user,
        session: webchatState.session,
        webchatState: webchatState,
        lastRoutePath: webchatState.lastRoutePath,
      });
  };

  // Load styles stored in window._botonicInsertStyles by Webpack
  useComponentWillMount(() => {
    if (window._botonicInsertStyles && window._botonicInsertStyles.length) {
      for (const botonicStyle of window._botonicInsertStyles) {
        // Injecting styles at head is needed even if we use shadowDOM
        // as some dependencies like simplebar rely on creating ephemeral elements
        // on document.body and assume styles will be available globally
        document.head.appendChild(botonicStyle);

        // injecting styles in host node too so that shadowDOM works
        if (props.shadowDOM) host.appendChild(botonicStyle.cloneNode(true));
      }
      delete window._botonicInsertStyles;
    }

    if (props.shadowDOM) {
      // emoji-picker-react injects styles in head, so we need to
      // re-inject them in our host node to make it work with shadowDOM
      for (const style of document.querySelectorAll("style")) {
        if (
          style.textContent &&
          style.textContent.includes("emoji-picker-react")
        )
          host.appendChild(style.cloneNode(true));
      }
    }
  });

  // useEffect(() => {
  //   if (!webchatState.isWebchatOpen) return;
  //   if (host.querySelector(`#${WEBCHAT.DEFAULTS.ID}`)) {
  //     deviceAdapter.init(host);
  //     scrollToBottom({ behavior: "auto", host });
  //   }
  // }, [webchatState.isWebchatOpen]);

  useEffect(() => {
    // if (onStateChange && typeof onStateChange === "function")
    // onStateChange(webchatState);
    saveWebchatState(webchatState);
  }, [
    webchatState.messagesJSON,
    webchatState.session,
    webchatState.lastRoutePath,
    webchatState.devSettings,
    webchatState.lastMessageUpdate,
  ]);

  useEffect(() => {
    scrollToBottom({ elem: scrollContainer });
    const lastMessage =
      webchatState.messagesJSON[webchatState.messagesJSON.length - 1];
    // if(lastMessage && lastMessage.from==='bot') {
    //   const chatActive = (webchatState.lastRoutePath === "connected" ||
    //   webchatState.lastRoutePath === "human_takeover" ||
    //   webchatState.lastRoutePath === "videochatlink" ||
    //   webchatState.lastRoutePath === "assign_to_me");
    // }
  }, [webchatState.messagesJSON]);

  const setTyping = (typing) => {
    let a = {
      typing: typing,
    };
    const merged = merge(webchatState, a);
    updateChatSettings(merged);
  };

  useEffect(() => {
    updateTheme(webchatState.theme);
  }, [webchatState.theme]);

  const openWebview = (webviewComponent, params) =>
    updateWebview(webviewComponent, params);

  const handleSelectedEmoji = (event, emojiObject) => {
    textArea.current.value += emojiObject.emoji;
    textArea.current.focus();
    setChatText(textArea.current.value);
    setOpen(false);
  };

  const closeWebview = (options) => {
    updateWebview();
    if (userInputEnabled) {
      textArea.current.focus();
    }
    if (options && options.payload) {
      sendPayload(options.payload);
    } else if (options && options.path) {
      let params = "";
      if (options.params) params = params2queryString(options.params);
      sendPayload(`__PATH_PAYLOAD__${options.path}?${params}`);
    }
  };

  const handleMenu = () => {
    togglePersistentMenu(!webchatState.isPersistentMenuOpen);
  };

  const handleEmojiClick = () => {
    setemojiOpen(!emojiOpen);
    // toggleEmojiPicker(!webchatState.isEmojiPickerOpen);
  };

  const handleGiphyPick = () => {
    setGiphyPickerOpen(!giphyPickerOpen);
  };

  const handleSpeedDialClick = (action) => {
    if (action === "emoji") {
      setGiphyPickerOpen(false);
      handleEmojiClick();
    } else if (action === "endchat") {
      props.closeBrowser();
    } else {
      // toggleEmojiPicker(false);
      setemojiOpen(false);
      handleGiphyPick();
    }
  };

  const animationsEnabled = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.enableAnimations,
    props.enableAnimations !== undefined ? props.enableAnimations : true
  );

  const persistentMenuOptions = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.persistentMenu,
    props.persistentMenu
  );

  const darkBackgroundMenu = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.darkBackgroundMenu,
    false
  );

  const progressStyle = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.progressStyle
  );

  const getBlockInputs = (rule, inputData) => {
    const processedInput = rule.preprocess
      ? rule.preprocess(inputData)
      : inputData;

    return rule.match.some((regex) => {
      if (typeof regex === "string") regex = deserializeRegex(regex);
      return regex.test(processedInput);
    });
  };

  const checkBlockInput = (input) => {
    // if is a text we check if it is a serialized RE
    const blockInputs = getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.blockInputs,
      props.blockInputs
    );
    updateLastMessage({
      reply: true,
    });

    if (!Array.isArray(blockInputs)) return false;
    for (const rule of blockInputs) {
      if (getBlockInputs(rule, input.data)) {
        addMessageComponent(
          <Text
            id={input.id}
            from={SENDERS.user}
            blob={false}
            style={{
              backgroundColor: COLORS.SCORPION_GRAY,
              borderColor: COLORS.SCORPION_GRAY,
              padding: "8px 12px",
            }}
          >
            {rule.message}
          </Text>
        );
        updateReplies(false);
        return true;
      }
    }
    return false;
  };

  const closeMenu = () => {
    togglePersistentMenu(false);
  };

  const persistentMenu = () => {
    return (
      <OpenedPersistentMenu
        onClick={closeMenu}
        options={persistentMenuOptions}
        borderRadius={webchatState.theme.style.borderRadius || "10px"}
      />
    );
  };

  // const getCoverComponent = () => {
  //   return getThemeProperty(
  //     WEBCHAT.CUSTOM_PROPERTIES.coverComponent,
  //     props.coverComponent &&
  //       (props.coverComponent.component || props.coverComponent)
  //   );
  // };
  // const CoverComponent = getCoverComponent();

  const closeCoverComponent = () => {
    toggleCoverComponent(false);
  };

  const openCoverComponent = () => {
    toggleCoverComponent(true);
  };

  const getOsName = () => {
    var OSName = "Unknown OS";
    if (navigator.userAgent.indexOf("Win") !== -1) OSName = "Windows";
    if (navigator.userAgent.indexOf("Mac") !== -1) OSName = "Macintosh";
    if (navigator.userAgent.indexOf("Linux") !== -1) OSName = "Linux";
    if (navigator.userAgent.indexOf("Android") !== -1) OSName = "Android";
    if (navigator.userAgent.indexOf("like Mac") !== -1) OSName = "iOS";
    return OSName;
  };

  const getBrowserName = () => {
    if (
      (navigator.userAgent.indexOf("Opera") ||
        navigator.userAgent.indexOf("OPR")) !== -1
    ) {
      return "Opera";
    } else if (navigator.userAgent.indexOf("Edg") !== -1) {
      return "Edge";
    } else if (navigator.userAgent.indexOf("Chrome") !== -1) {
      return "Google Chrome";
    } else if (navigator.userAgent.indexOf("Safari") !== -1) {
      return "Safari";
    } else if (navigator.userAgent.indexOf("Firefox") !== -1) {
      return "Firefox";
    } else if (
      navigator.userAgent.indexOf("MSIE") !== -1 ||
      !!document.documentMode === true
    ) {
      //IF IE > 10
      return "IE";
    } else {
      return "unknown";
    }
  };

  const processSettings = async (result) => {
    chatbotlist = result.bot_onload_settings;
    const live_chat_settings = result.live_chat_settings;
    console.log(result);
    const articles = Array.isArray(result.article_details)
      ? result.article_details
      : [];
    chatbotlist.articles = articles;
    chatbotlist.botId = props.botId;
    if (props.mode === "widget" && props.editMode !== "design") {
      /** Allowed Devices */
      if (chatbotlist.show_on_device !== "all") {
        if (chatbotlist.show_on_device == "mobile") {
          if (!isMobile(mobileBreakpoint)) {
            return;
          }
        } else if (chatbotlist.show_on_device === "desktop") {
          if (isMobile(mobileBreakpoint)) {
            return;
          }
        }
      }
      /** Block Widget here */
      if (
        chatbotlist.hide_chatbot_on_url &&
        chatbotlist.hide_chatbot_on_url !== ""
      ) {
        const domains = chatbotlist.hide_chatbot_on_url.split(",");
        const blocked = domains.some((url) => {
          if (typeof url == "string")
            return url.trim() === window.location.href.substring(0, url.length);
          return false;
        });
        if (blocked) {
          console.log("url blocked-weconnect");
          return;
        }
      }
      /** Allowed Url */
      if (
        chatbotlist.show_chatbot_on_url &&
        chatbotlist.show_chatbot_on_url !== ""
      ) {
        const domains = chatbotlist.show_chatbot_on_url.split(",");
        const canLoad = domains.some((url) => {
          return url === window.location.href.substring(0, url.length);
        });
        if (canLoad === false) {
          return;
        }
      }
    }
    // enable Bot
    if (chatbotlist.enable_bot !== 1 && props.editMode !== "design") {
      const currentAgentId = parseInt(localStorage.getItem("id"));
      if (
        chatbotlist.bot_live_agents &&
        Array.isArray(chatbotlist.bot_live_agents) &&
        chatbotlist.bot_live_agents.includes(currentAgentId)
      ) {
      } else {
        return;
      }
    }

    let { session, devSettings, lastMessageUpdate } = botonicState || {};
    session = initSession(session);

    updateSession(session);

    // get environment
    const os = getOsName();
    const browser = getBrowserName();

    let isEnvironmentLoaded = false;
    if (
      session &&
      session.environment &&
      session.environment["ip"] &&
      session.environment["country"]
    ) {
      isEnvironmentLoaded = true;
    } else {
      if (Object.keys(savedEnvironment).length > 0) {
        session.environment = savedEnvironment;
        isEnvironmentLoaded = true;
      }
    }
    if (isEnvironmentLoaded === false) {
      const abortableFetch = "signal" in new Request("") ? window.fetch : fetch;
      let resu = {};

      let ip = "122.165.182.177";
      let country = "India";
      let country_code = "In";

      try {
        const url =
          "https://geolocation-db.com/json/86f5f280-f4eb-11ec-8676-4f4388bc6daa";
        const fres = await abortableFetch(url);
        if (!fres.ok) {
          console.log("provide failed environment here");
        }
        resu = await fres.json();
        ip = resu.IPv4;
        country = resu.country_name;
        country_code = resu.country_code;
      } catch (err) {
        console.log("Geo Location API error", err);
      }

      const time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      console.log("time_zone", time_zone);

      session.environment = {
        browser: browser,
        operating_sys: os,
        ip: ip,
        country: country,
        time_zone,
        country_code: country_code,
      };
      savedEnvironment = session.environment;
    }

    if (props.mode === "widget" && props.editMode !== "design") {
      const ip = session.environment.ip;
      // Block Ip Address
      if (chatbotlist.block_ip_address && chatbotlist.block_ip_address !== "") {
        const blockedIp = chatbotlist.block_ip_address.split(",");
        const blocked = blockedIp.some((myip) => {
          return myip === ip.substring(0, myip.length);
        });
        if (blocked) {
          console.log("block Ip");
          return;
        }
      }
    }

    let backgroundStyle = {};
    let positionStyle = {};
    let triggetStyle = {};

    updateSession(merge(initialSession, session));
    if (devSettings) updateDevSettings(devSettings);
    else if (initialDevSettings) updateDevSettings(initialDevSettings);
    if (lastMessageUpdate) updateLastMessageDate(lastMessageUpdate);

    if (props.mode === "widget") {
      if (chatbotlist.welcome_screen_checkbox === 1) {
        if (chatbotlist.welcome_screen_layout === "layout_1") {
          CoverComponent = Covercomponent1;
        } else if (chatbotlist.welcome_screen_layout === "layout_2") {
          CoverComponent = Covercomponent2;
        } else if (chatbotlist.welcome_screen_layout === "layout_3") {
          CoverComponent = Covercomponent3;
        }
      }
      try {
        const widgetMessage1 =
          chatbotlist.widget_message_1 !== ""
            ? JSON.parse(chatbotlist.widget_message_1)
            : {};
        const widgetMessage2 =
          chatbotlist.widget_message_2 !== ""
            ? JSON.parse(chatbotlist.widget_message_2)
            : {};
        const widgetMessage3 =
          chatbotlist.widget_message_3 !== ""
            ? JSON.parse(chatbotlist.widget_message_3)
            : {};
        const widgetMessage4 =
          chatbotlist.widget_message_4 !== ""
            ? JSON.parse(chatbotlist.widget_message_4)
            : {};
        proacativeMessages = [
          widgetMessage1,
          widgetMessage2,
          widgetMessage3,
          widgetMessage4,
        ];
      } catch (error) {
        console.log("Error", error);
      }
      chatbotlist.proacativeMessages = proacativeMessages;
      if (chatbotlist.launch_criteria_welcome_message_percent === 0) {
        chatbotlist.showWelcomeMessage = true;
        scrollParam.welcomeMessage = true;
      } else {
        launchCriteriaWelcomeMessagePercent =
          chatbotlist.launch_criteria_welcome_message_percent;
      }
      if (chatbotlist.page_url && chatbotlist.page_url.trim() === "") {
        chatbotlist.domainWelcome = true;
      } else {
        const domains = chatbotlist.page_url.split(",");
        chatbotlist.domainWelcome = domains.some((url) => {
          return url === window.location.href.substring(0, url.length);
        });
      }
      if (chatbotlist.welcome_message_checkbox === 0) {
        chatbotlist.showWelcomeMessage = false;
      }
      const position = chatbotlist.position;
      if (position === "right") {
        positionStyle = {
          left: "auto",

          overflow: "hidden",
        };
        triggetStyle = {
          bottom: "25px",
          right: "25px",
        };
        proactiveStyle = {
          right: "10px",
          alignItems: "end",
        };
      } else if (position === "left") {
        positionStyle = {};
        triggetStyle = {
          right: "auto",
          bottom: "25px",
          left: "25px",
        };
        proactiveStyle = {
          left: "10px",
          alignItems: "start",
        };
      } else if (position === "center") {
        positionStyle = {
          bottom: "50%",
          top: "50%",
        };
        triggetStyle = {
          right: "0px",
          bottom: "50%",
          top: "50%",
        };
        proactiveStyle = {
          left: "10px",
          alignItems: "start",
        };
      }
      if (props.editMode !== "design") {
        if (isMobile(mobileBreakpoint)) {
          if (chatbotlist.widget_launch_criteria_checkbox_mobile === 1) {
            setTimeout(() => {
              if (chatbotlist.load === false) {
                chatbotlist.load = true;
                setChatSettings({
                  ...chatbotlist,
                  load: true,
                });
              }
            }, 1000 * chatbotlist.show_after_sec_mobile);

            if (chatbotlist.open_after_sec_mobile > 0)
              setTimeout(() => {
                if (!webchatState.isWebchatOpen) toggleWebchat(true);
              }, 1000 * chatbotlist.open_after_sec_mobile);

            afterScrollPercent = chatbotlist.after_scroll_percent_mobile;
          } else {
            chatbotlist.load = true;
          }
        } else {
          if (chatbotlist.widget_launch_criteria_checkbox === 1) {
            setTimeout(() => {
              if (chatbotlist.load === false) {
                chatbotlist.load = true;
                setChatSettings({
                  ...chatbotlist,
                  load: true,
                });
              }
            }, 1000 * chatbotlist.show_after_sec);

            if (chatbotlist.open_after_sec > 0)
              setTimeout(() => {
                if (!webchatState.isWebchatOpen) toggleWebchat(true);
              }, 1000 * chatbotlist.open_after_sec);

            afterScrollPercent = chatbotlist.after_scroll_percent;
          } else {
            chatbotlist.load = true;
          }
        }
      } else {
        chatbotlist.load = true;
      }
    } else if (props.mode === "landing") {
      pageStyle = {};
      if (chatbotlist.bg_type === "color") {
        pageStyle.background = chatbotlist.bg_value;
      }

      chatbotlist.load = true;
    } else if (props.mode === "embed") {
      // embed
      chatbotlist.load = true;
      pageStyle = {
        background: chatbotlist.bg_value,
      };
      chatbotlist.load = true;
    } else {
      chatbotlist.load = true;
    }
    let widgetStyle = {
      color: "#fff",
      background: "rgb(0, 67, 79)",
    };
    if (chatbotlist.chatbox_text_color && chatbotlist.chatbox_theme_color) {
      widgetStyle = {
        color: chatbotlist.chatbox_text_color,
        background: chatbotlist.chatbox_theme_color,
      };
    }
    let responseStyle = widgetStyle;
    if (
      chatbotlist.user_response_msg_text_color &&
      chatbotlist.user_response_msg_background_color
    ) {
      responseStyle = {
        color: chatbotlist.user_response_msg_text_color,
        background: chatbotlist.user_response_msg_background_color,
      };
    }

    if (chatbotlist.avatar == null) {
      chatbotlist.avatar = process.env.REACT_APP_LOGO;
    }

    if (chatbotlist.profile == null) {
      chatbotlist.profile = process.env.REACT_APP_LOGO;
    }
    if (
      chatbotlist.welcome_screen_profile_picture === null ||
      chatbotlist.welcome_screen_profile_picture === ""
    ) {
      chatbotlist.welcome_screen_profile_picture =
        chatbotlist.profile == null
          ? chatbotlist.profile
          : process.env.REACT_APP_LOGO;
    }
    updateFont(chatbotlist.font_family);

    const fontStyle = {
      fontFamily: chatbotlist.font_family,
      fontSize:
        parseInt(chatbotlist.font_size) > 0
          ? chatbotlist.font_size + "px"
          : "16px",
    };

    if (chatbotlist.font_weight === 1) {
      fontStyle.fontWeight = "bold";
    } else {
      fontStyle.fontWeight = "normal";
    }
    let delay = 0;
    let typing = "Groovy CSS Spinner";
    if (
      result.typing_animation_settings &&
      result.typing_animation_settings.delay_time_checkbox === 1 &&
      result.typing_animation_settings.delay_time_value
    ) {
      delay = result.typing_animation_settings.delay_time_value;
    }
    if (
      result.typing_animation_settings &&
      result.typing_animation_settings.anime_value
    ) {
      typing = result.typing_animation_settings.anime_value;
    }
    // if(typing==="dotted-lines") {
    //   typing = "Groovy CSS Spinner";
    // }
    // fetch widget colors

    chatbotlist.chat_now_icon_color = getColorJson(
      chatbotlist.chat_now_icon_color,
      "rgb(75,94,201)"
    );
    chatbotlist.whatsapp_icon_color = getColorJson(
      chatbotlist.whatsapp_icon_color,
      "rgb(75,200,89)"
    );
    chatbotlist.email_icon_color = getColorJson(
      chatbotlist.email_icon_color,
      "rgb(0,172,139)"
    );
    chatbotlist.knowledge_base_icon_color = getColorJson(
      chatbotlist.knowledge_base_icon_color,
      "rgb(119,75,201)"
    );

    let deviceMode = "desktop";

    // let deviceMode = "mobile";

    if (isMobile(600)) {
      deviceMode = "mobile";
    } else if (isMobile(900)) {
      deviceMode = "tablet";
    }

    if (props.editMode === "design") {
      deviceMode = props.deviceMode;
    }

    console.log("style", positionStyle, backgroundStyle);
    const saveChatSettings = {
      feedback: {
        rate_conversation_agent_checkbox:
          live_chat_settings.rate_conversation_agent_checkbox !== 0
            ? true
            : false,
        rate_1: live_chat_settings.rate_1,
        rate_2: live_chat_settings.rate_2,
        rate_3: live_chat_settings.rate_3,
        rate_4: live_chat_settings.rate_4,
        rate_5: live_chat_settings.rate_5,

        feedback_chat_ends_checkbox:
          live_chat_settings.feedback_chat_ends_checkbox !== 0 ? true : false,
        feedback_question_title: live_chat_settings.feedback_question_title,
      },
      articles: Array.isArray(chatbotlist.article_details)
        ? chatbotlist.article_details
        : [],
      gdpr: chatbotlist.enable_gdpr,
      gdprMessage: chatbotlist.gdpr_text,
      fontFamily: chatbotlist.font_family,
      theme: {
        deviceMode: deviceMode,
        profileScale: chatbotlist.profile_picture_scale + "%",
        coverScale: chatbotlist.welcome_screen_profile_pic_scale + "%",
        welcomeImg: chatbotlist.welcome_screen_profile_picture,
        delay: delay,
        typing: typing,
        bubbleAnimation: {
          enable: chatbotlist.widget_animation_checkbox,
          type: chatbotlist.widget_animation_type,
        },
        typingColor: chatbotlist.typing_color,
        opacity:
          chatbotlist.opacity > 100
            ? chatbotlist.opacity / 1000
            : chatbotlist.opacity / 100,
        progress_bar: chatbotlist.progress_bar,
        progressStyle:
          chatbotlist.progress_bar_color === ""
            ? { ...widgetStyle }
            : {
                background: chatbotlist.progress_bar_color,
                color: chatbotlist.progress_bar_color,
              },
        backSkipStyle: {
          background: chatbotlist.back_skip_button_bg_color,
          color: chatbotlist.back_skip_button_text_color,
        },
        weconnect_chat_branding: chatbotlist.weconnect_chat_branding,
        widgetStyle: widgetStyle,
        responseStyle: responseStyle,
        avatarScale: chatbotlist.avatar_scale,

        buttonStyle: {
          color: chatbotlist.button_text_color,
          background: chatbotlist.button_background_color,
          border: `1px solid ${chatbotlist.button_border_color}`,
          borderRadius:
            chatbotlist.button_radius > 50
              ? chatbotlist.button_radius - 50 + "%"
              : chatbotlist.button_radius + "px",
        },
        messageBubble:
          chatbotlist.message_bubble === ""
            ? "one-rounder"
            : chatbotlist.message_bubble,
        profile: chatbotlist.profile
          ? chatbotlist.profile
          : process.env.REACT_APP_LOGO,
        avatar: chatbotlist.avatar
          ? chatbotlist.avatar
          : process.env.REACT_APP_LOGO,
        chatStyle: chatStyle,
        fontStyle: fontStyle,
        // pageStyle: pageStyle,
        bg_type: chatbotlist.bg_type,
        bg_value: chatbotlist.bg_value,
        style: {
          ...positionStyle,
          ...backgroundStyle,
        },
        triggerButton: {
          image: chatbotlist.avatar
            ? chatbotlist.avatar
            : process.env.REACT_APP_LOGO,
          style: {
            ...triggetStyle,
          },
        },
        header: {
          online: chatbotlist.widget_online_status,
          offline: chatbotlist.widget_offline_status,
          title: chatbotlist.bot_header_title
            ? chatbotlist.bot_header_title.substring(0, 30)
            : "",
          subtitle: chatbotlist.bot_header_subtitle
            ? chatbotlist.bot_header_subtitle.substring(0, 78)
            : "",
          image: chatbotlist.avatar
            ? chatbotlist.avatar
            : process.env.REACT_APP_LOGO,
          subtitleStyle: {
            color: chatbotlist.title_color,
          },
          titleStyle: {
            color: chatbotlist.title_color,
          },
          headerSameChat: chatbotlist.use_from_chatbox_checkbox,
          style: {
            color: chatbotlist.header_text_color,
            background: chatbotlist.header_color,
          },
        },
        message: {
          bot: {
            image: chatbotlist.avatar
              ? chatbotlist.avatar
              : process.env.REACT_APP_LOGO,
          },
        },
        brand: {
          color: "black",
        },
      },
      isCoverComponentOpen: chatbotlist.welcome_screen_checkbox === 1,
      chatsettings: chatbotlist,
    };

    if (props.mode === "landing" && props.editMode !== "design") {
      saveChatSettings.metaProperties = {
        meta_title: chatbotlist.meta_title,
        meta_image: chatbotlist.meta_image,
        meta_favicon: chatbotlist.meta_favicon,
        meta_description: chatbotlist.meta_description,
        title: chatbotlist.title,
        sub_title: chatbotlist.sub_title,
        // This will be common for all parts
        // custom_tracking_code_path: chatbotlist.custom_tracking_code_path,
        // facebook_pixel_path: chatbotlist.facebook_pixel_path,
        // google_analytics_path: chatbotlist.google_analytics_path,
        // hotjar_path: chatbotlist.hotjar_path,
      };
    }

    if (
      result &&
      result.live_chat_settings &&
      result.live_chat_settings.agent_sla_time_checkbox === 1
    ) {
      saveChatSettings.agent_sla_time_livechat =
        result.live_chat_settings.agent_sla_time_livechat;
      saveChatSettings.agent_sla_time_videocall =
        result.live_chat_settings.agent_sla_time_videocall;
    }
    updateChatSettings(saveChatSettings);
    if (props.editMode === "design" || props.editMode === "builder") {
      if (props.mode === "widget") {
        savedResponse.widget = saveChatSettings;
      } else if (props.mode === "landing") {
        savedResponse.landing = saveChatSettings;
      } else if (props.mode === "embed") {
        savedResponse.embed = saveChatSettings;
      }
    }
    chatbotlist.start_a_new_conversation_value =
      chatbotlist.start_a_new_conversation_value || "Start a conversation";
    chatbotlist.show_active_agent_value =
      chatbotlist.show_active_agent_value || "active agents";
    chatbotlist.show_continue_conv_value =
      chatbotlist.show_continue_conv_value || "Continue Conversation";
    chatbotlist.show_search_bar_value =
      chatbotlist.show_search_bar_value || "Search for help";
    chatbotlist.chat_now_value = chatbotlist.chat_now_value || "Chat Now";
    chatbotlist.whatsapp_value = chatbotlist.whatsapp_value || "Whatsapp";
    chatbotlist.whatsapp_hyperlinkwhatsapp_hyperlink =
      chatbotlist.whatsapp_hyperlinkwhatsapp_hyperlink ||
      "https://www.example.com";
    chatbotlist.email_value = chatbotlist.email_value || "Email";

    setChatSettings({
      ...chatbotlist,
    });
    if (props.onInit) setTimeout(() => props.onInit(), 100);

    if (props.editMode !== "design") {
      if (chatbotlist.google_analytics_path) {
        asyncLoadGa(chatbotlist.google_analytics_path);
      }

      if (chatbotlist.facebook_pixel_path) {
        asyncLoadFb(chatbotlist.facebook_pixel_path);
      }

      if (chatbotlist.hotjar_path) {
        asyncLoadHj(chatbotlist.hotjar_path);
      }
      reportScroll();
    }
  };

  let chatBotMessage = {};

  const newChatSettingsFn = async (newSettings) => {
    if (newSettings.avatar == null) {
      chatBotMessage.avatar = process.env.REACT_APP_LOGO;
    } else {
      chatBotMessage.avatar = newSettings.avatar;
    }

    if (newSettings.profile == null) {
      chatBotMessage.profile = process.env.REACT_APP_LOGO;
    } else {
      chatBotMessage.profile = newSettings.profile;
    }

    chatBotMessage.avatar_scale = newSettings.avatar_scale;
    chatBotMessage.avatar_shape = newSettings.avatar_shape;
    chatBotMessage.avatarstatus = newSettings.avatarstatus;
    chatBotMessage.profile_picture_scale = newSettings.profile_picture_scale;
    chatBotMessage.time_zone = newSettings.time_zone;
    chatBotMessage.button_background_color =
      newSettings.button_background_color;
    chatBotMessage.button_border_color = newSettings.button_border_color;
    chatBotMessage.button_radius = newSettings.button_radius;
    chatBotMessage.message_bubble = newSettings.message_bubble;
    chatBotMessage.button_text_color = newSettings.button_text_color;
    chatBotMessage.opacity = newSettings.opacity;
    chatBotMessage.theme_color = newSettings.theme_color;
    chatBotMessage.typing_color = newSettings.typing_color;
    chatBotMessage.isCoverComponentOpen = false;

    chatBotMessage.back_skip_button_bg_color =
      newSettings.back_skip_button_bg_color
        ? newSettings.back_skip_button_bg_color
        : "#000";
    chatBotMessage.back_skip_button_text_color =
      newSettings.back_skip_button_text_color
        ? newSettings.back_skip_button_text_color
        : "#fff";

    let widgetStyle = {
      color: "#fff",
      background: "rgb(0, 67, 79)",
    };

    if (newSettings?.chatbox_text_color && newSettings?.chatbox_theme_color) {
      widgetStyle = {
        color: newSettings.chatbox_text_color,
        background: newSettings.chatbox_theme_color,
      };
    }
    let responseStyle = widgetStyle;

    if (
      newSettings?.user_response_msg_background_color &&
      newSettings?.user_response_msg_text_color
    ) {
      responseStyle = {
        color: newSettings.user_response_msg_text_color,
        background: newSettings.user_response_msg_background_color,
      };
    }
    chatBotMessage.isOpenSettings = true;

    let saveSettings = {
      ...webchatState,
      ...webchatState.isWebchatOpen,
      ...webchatState.session,
      theme: {
        ...webchatState.theme,
        profileScale: chatBotMessage.profile_picture_scale + "%",
        widgetStyle: widgetStyle,
        responseStyle: responseStyle,
        triggerButton: {
          image: chatBotMessage.avatar
            ? chatBotMessage.avatar
            : process.env.REACT_APP_LOGO,
        },
        typingColor: chatBotMessage.typing_color,
        backSkipStyle: {
          background: chatBotMessage.back_skip_button_bg_color,
          color: chatBotMessage.back_skip_button_text_color,
        },
        opacity:
          chatBotMessage.opacity > 100
            ? chatBotMessage.opacity / 1000
            : chatBotMessage.opacity / 100,
        avatarScale: chatBotMessage.avatar_scale,
        profile: chatBotMessage.profile
          ? chatBotMessage.profile
          : process.env.REACT_APP_LOGO,
        avatar: chatBotMessage.avatar
          ? chatBotMessage.avatar
          : process.env.REACT_APP_LOGO,
        header: {
          image: chatBotMessage.avatar
            ? chatBotMessage.avatar
            : process.env.REACT_APP_LOGO,
        },
        message: {
          bot: {
            image: chatBotMessage.avatar
              ? chatBotMessage.avatar
              : process.env.REACT_APP_LOGO,
          },
        },
        buttonStyle: {
          color: chatBotMessage.button_text_color,
          background: chatBotMessage.button_background_color,
          border: `1px solid ${chatBotMessage.button_border_color}`,
          borderRadius:
            chatBotMessage.button_radius > 50
              ? chatBotMessage.button_radius - 50 + "%"
              : chatBotMessage.button_radius + "px",
        },
        messageBubble:
          chatBotMessage.message_bubble === ""
            ? "one-rounder"
            : chatBotMessage.message_bubble,
      },
      isCoverComponentOpen: chatBotMessage.isCoverComponentOpen,
      chatsettings: {
        ...webchatState.chatsettings,
        ...chatBotMessage,
      },
    };
    updateChatSettings(saveSettings);

    setChatSettings({
      ...chatSettings,
      ...chatBotMessage,
    });
  };

  const newWelcomeMessage = async (newResponse) => {
    chatBotMessage = newResponse;

    if (
      chatBotMessage.welcome_screen_profile_picture === null ||
      chatBotMessage.welcome_screen_profile_picture === ""
    ) {
      chatBotMessage.welcome_screen_profile_picture =
        chatBotMessage.profile == null
          ? chatBotMessage.profile
          : process.env.REACT_APP_LOGO;
    }
    chatBotMessage.layout =
      chatBotMessage.landingsetting?.original?.designsettings?.layout;

    chatBotMessage.progress_bar = chatBotMessage.settings.progress_bar;
    chatBotMessage.progress_bar_color =
      chatBotMessage.settings.progress_bar_color;
    chatBotMessage.weconnect_chat_branding =
      chatBotMessage.settings.weconnect_chat_branding;
    updateFont(chatBotMessage.settings.font_family);

    const fontStyle = {
      fontFamily: chatBotMessage.settings.font_family,
      fontSize:
        parseInt(chatBotMessage.settings.font_size) > 0
          ? chatBotMessage.settings.font_size + "px"
          : "16px",
    };

    if (chatBotMessage.settings.font_weight === 1) {
      fontStyle.fontWeight = "bold";
    } else {
      fontStyle.fontWeight = "normal";
    }

    let { session, devSettings, lastMessageUpdate } = botonicState || {};
    session = initSession(session);
    console.log("newWelcomeMessage");
    updateSession(session);

    // get environment
    const os = getOsName();
    const browser = getBrowserName();

    let isEnvironmentLoaded = false;
    if (
      session &&
      session.environment &&
      session.environment["ip"] &&
      session.environment["country"]
    ) {
      isEnvironmentLoaded = true;
    } else {
      if (Object.keys(savedEnvironment).length > 0) {
        session.environment = savedEnvironment;
        isEnvironmentLoaded = true;
      }
    }
    // if (isEnvironmentLoaded === false) {
    const abortableFetch = "signal" in new Request("") ? window.fetch : fetch;
    let resu = {};

    let ip = "122.165.182.177";
    let country = "India";
    let country_code = "In";

    try {
      const url =
        "https://geolocation-db.com/json/86f5f280-f4eb-11ec-8676-4f4388bc6daa";
      const fres = await abortableFetch(url);
      if (!fres.ok) {
        console.log("provide failed environment here");
      }
      resu = await fres.json();
      ip = resu.IPv4;
      country = resu.country_name;
      country_code = resu.country_code;
    } catch (err) {
      console.log("Geo Location API error", err);
    }

    const time_zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    console.log("time_zone", time_zone);

    session.environment = {
      browser: browser,
      operating_sys: os,
      ip: ip,
      country: country,
      time_zone,
      country_code: country_code,
    };
    savedEnvironment = session.environment;
    // }

    if (props.mode === "widget" && props.editMode !== "design") {
      const ip = session.environment.ip;
      // Block Ip Address
      if (
        chatBotMessage.block_ip_address &&
        chatBotMessage.block_ip_address !== ""
      ) {
        const blockedIp = chatBotMessage.block_ip_address.split(",");
        const blocked = blockedIp.some((myip) => {
          return myip === ip.substring(0, myip.length);
        });
        if (blocked) {
          console.log("block Ip");
          return;
        }
      }
    }

    let backgroundStyle = {};
    let positionStyle = {};
    let triggetStyle = {};

    console.log("merge", merge(initialSession, session));
    updateSession(merge(initialSession, session));
    if (devSettings) updateDevSettings(devSettings);
    else if (initialDevSettings) updateDevSettings(initialDevSettings);
    if (lastMessageUpdate) updateLastMessageDate(lastMessageUpdate);

    if (props.mode === "widget") {
      chatBotMessage.close_option_checkbox = chatBotMessage?.welcomemessage
        ?.close_option_checkbox
        ? chatBotMessage?.welcomemessage?.close_option_checkbox
        : 0;
      try {
        const widgetMessage1 =
          chatBotMessage.welcomemessage?.widgetmessage?.widgetmessage_1 !== ""
            ? JSON.parse(
                chatBotMessage.welcomemessage?.widgetmessage?.widgetmessage_1
              )
            : {};
        const widgetMessage2 =
          chatBotMessage.welcomemessage?.widgetmessage?.widgetmessage_2 !== ""
            ? JSON.parse(
                chatBotMessage.welcomemessage?.widgetmessage?.widgetmessage_2
              )
            : {};
        const widgetMessage3 =
          chatBotMessage.welcomemessage?.widgetmessage?.widgetmessage_3 !== ""
            ? JSON.parse(
                chatBotMessage.welcomemessage?.widgetmessage?.widgetmessage_3
              )
            : {};
        const widgetMessage4 =
          chatBotMessage.welcomemessage?.widgetmessage?.widgetmessage_4 !== ""
            ? JSON.parse(
                chatBotMessage.welcomemessage?.widgetmessage?.widgetmessage_4
              )
            : {};
        proacativeMessages = [
          widgetMessage1,
          widgetMessage2,
          widgetMessage3,
          widgetMessage4,
        ];
      } catch (error) {
        console.log("Error", error);
      }
      chatBotMessage.proacativeMessages = proacativeMessages;
      if (
        chatBotMessage?.welcomemessage
          ?.launch_criteria_welcome_message_percent === 0
      ) {
        chatBotMessage.showWelcomeMessage = true;
        scrollParam.welcomeMessage = true;
      } else {
        launchCriteriaWelcomeMessagePercent = chatBotMessage?.welcomemessage
          ?.launch_criteria_welcome_message_percent
          ? chatBotMessage?.welcomemessage
              ?.launch_criteria_welcome_message_percent
          : 0;
      }
      if (
        chatBotMessage?.welcomemessage?.page_url &&
        chatBotMessage?.welcomemessage?.page_url.trim() === ""
      ) {
        chatBotMessage.domainWelcome = true;
      } else {
        const domains = chatBotMessage?.welcomemessage?.page_url.split(",");
        chatBotMessage.domainWelcome = domains?.some((url) => {
          return url === window.location.href.substring(0, url.length);
        });
      }
      chatBotMessage.position = chatBotMessage.settings.position;
      const position = chatBotMessage.settings.position;
      if (position === "right") {
        positionStyle = {
          left: "auto",

          overflow: "hidden",
        };
        triggetStyle = {
          bottom: "25px",
          right: "25px",
        };
        proactiveStyle = {
          right: "10px",
          alignItems: "end",
        };
      } else if (position === "left") {
        positionStyle = {};
        triggetStyle = {
          right: "auto",
          bottom: "25px",
          left: "25px",
        };
        proactiveStyle = {
          left: "10px",
          alignItems: "start",
        };
      } else if (position === "center") {
        positionStyle = {
          bottom: "50%",
          top: "50%",
        };
        triggetStyle = {
          right: "0px",
          bottom: "50%",
          top: "50%",
        };
        proactiveStyle = {
          left: "10px",
          alignItems: "start",
        };
      }
      chatBotMessage.open_after_sec = 0;
      chatBotMessage.open_after_sec_mobile = 0;
      chatBotMessage.after_scroll_percent = 0;
      chatBotMessage.after_scroll_percent_mobile = 0;
      chatBotMessage.show_after_sec = 0;
      chatBotMessage.show_after_sec_mobile = 0;

      if (props.editMode !== "design") {
        if (isMobile(mobileBreakpoint)) {
          if (chatBotMessage.widget_launch_criteria_checkbox_mobile === 1) {
            setTimeout(() => {
              if (chatBotMessage.load === false) {
                chatBotMessage.load = true;
                setChatSettings({
                  ...chatBotMessage,
                  load: true,
                });
              }
            }, 1000 * chatBotMessage.show_after_sec_mobile);

            if (chatBotMessage.open_after_sec_mobile > 0)
              setTimeout(() => {
                if (!webchatState.isWebchatOpen) toggleWebchat(true);
              }, 1000 * chatBotMessage.open_after_sec_mobile);

            afterScrollPercent = chatBotMessage.after_scroll_percent_mobile;
          } else {
            chatBotMessage.load = true;
          }
        } else {
          if (chatBotMessage.widget_launch_criteria_checkbox === 1) {
            setTimeout(() => {
              if (chatBotMessage.load === false) {
                chatBotMessage.load = true;
                setChatSettings({
                  ...chatBotMessage,
                  load: true,
                });
              }
            }, 1000 * chatBotMessage.show_after_sec);

            if (chatBotMessage.open_after_sec > 0)
              setTimeout(() => {
                if (!webchatState.isWebchatOpen) toggleWebchat(true);
              }, 1000 * chatBotMessage.open_after_sec);

            afterScrollPercent = chatBotMessage.after_scroll_percent;
          } else {
            chatBotMessage.load = true;
          }
        }
      } else {
        chatBotMessage.load = true;
      }
    } else if (props.mode === "landing") {
      pageStyle = {};
      chatBotMessage.bg_type =
        chatBotMessage.landingsetting.original.designsettings.bg_type;
      chatBotMessage.bg_value =
        chatBotMessage.landingsetting.original.designsettings.bg_value;
      if (chatBotMessage.bg_type === "color") {
        pageStyle.background = chatBotMessage.bg_value;
      }

      chatBotMessage.load = true;
    } else if (props.mode === "embed") {
      // embed
      chatBotMessage.load = true;
      chatBotMessage.bg_type =
        chatBotMessage.embedsetting.original.designsettings.bg_value;
      pageStyle = {
        background: chatBotMessage.bg_value,
      };
      chatBotMessage.load = true;
    } else {
      chatBotMessage.load = true;
    }

    if (props.mode === "widget" && props.editMode !== "design") {
      /** Allowed Devices */
      if (chatBotMessage.show_on_device !== "all") {
        if (chatBotMessage.show_on_device == "mobile") {
          if (!isMobile(mobileBreakpoint)) {
            return;
          }
        } else if (chatBotMessage.show_on_device === "desktop") {
          if (isMobile(mobileBreakpoint)) {
            return;
          }
        }
      }
    }

    let widgetStyle = {
      color: "#fff",
      background: "rgb(0, 67, 79)",
    };
    if (
      chatBotMessage?.chatboticonsettings?.chatbox_text_color &&
      chatBotMessage?.chatboticonsettings?.chatbox_theme_color
    ) {
      widgetStyle = {
        color: chatBotMessage?.chatboticonsettings?.chatbox_text_color,
        background: chatBotMessage?.chatboticonsettings?.chatbox_theme_color,
      };
    }
    let responseStyle = widgetStyle;
    if (
      chatBotMessage?.chatboticonsettings?.user_response_msg_text_color &&
      chatBotMessage?.chatboticonsettings?.user_response_msg_background_color
    ) {
      responseStyle = {
        color:
          chatBotMessage?.chatboticonsettings?.user_response_msg_text_color,
        background:
          chatBotMessage?.chatboticonsettings
            ?.user_response_msg_background_color,
      };
    }

    let deviceMode = "desktop";

    if (isMobile(600)) {
      deviceMode = "mobile";
    } else if (isMobile(900)) {
      deviceMode = "tablet";
    }

    if (props.editMode === "design") {
      deviceMode = props.deviceMode;
    }
    chatBotMessage.isCoverComponentOpen = true;
    chatBotMessage.isOpenSettings = true;
    console.log("style", positionStyle, backgroundStyle);
    const saveNewSettings = {
      ...webchatState,
      layout: chatBotMessage.layout,
      session: {
        ...webchatState.session,
        ...session,
      },
      theme: {
        ...webchatState.theme,
        deviceMode: deviceMode,
        widgetStyle: widgetStyle,
        responseStyle: responseStyle,
        fontStyle: fontStyle,
        progress_bar: chatBotMessage.progress_bar,
        progressStyle:
          chatBotMessage.progress_bar_color === ""
            ? { ...widgetStyle }
            : {
                background: chatBotMessage.progress_bar_color,
                color: chatBotMessage.progress_bar_color,
              },
        style: {
          ...positionStyle,
          ...backgroundStyle,
        },
        triggerButton: {
          style: {
            ...triggetStyle,
          },
        },
        weconnect_chat_branding: chatBotMessage.weconnect_chat_branding,
        bubbleAnimation: {
          enable: chatBotMessage.widget_animation_checkbox,
          type: chatBotMessage.widget_animation_type,
        },
        bg_type: chatBotMessage.bg_type,
        bg_value: chatBotMessage.bg_value,

        header: {
          headerSameChat: chatBotMessage.use_from_chatbox_checkbox,
          style: {
            color: chatBotMessage.header_text_color,
            background: chatBotMessage.header_color,
          },
        },
      },
      isCoverComponentOpen:
        chatBotMessage.nextscreen === "welcomescreen" ? true : false,
      chatsettings: {
        ...webchatState.chatsettings,
        ...chatBotMessage,
      },
    };

    if (props.mode === "landing" && props.editMode !== "design") {
      saveNewSettings.metaProperties = {
        meta_title:
          chatBotMessage.landingsetting.original.designsettings.meta_title,
        meta_description:
          chatBotMessage.landingsetting.original.designsettings
            .meta_description,
        title: chatBotMessage.landingsetting.original.designsettings.title,
        sub_title:
          chatBotMessage.landingsetting.original.designsettings.sub_title,
      };
    }

    if (props.onInit) setTimeout(() => props.onInit(), 100);
    console.log("chatBotMessage", chatBotMessage);
    updateChatSettings(saveNewSettings);

    setChatSettings({
      ...chatSettings,
      ...chatBotMessage,
    });
  };

  const newWelcomeScreen = async (newResult, newArticles) => {
    chatBotMessage = newResult.welcomescreen;
    const articles = Array.isArray(newArticles.articles)
      ? newArticles.articles
      : [];
    chatBotMessage.articles = articles;
    chatBotMessage.isCoverComponentOpen = true;

    chatBotMessage.nextscreen = newResult.nextscreen;
    chatBotMessage.widget_online_status =
      chatBotMessage.botdetails.widget_online_status;
    chatBotMessage.widget_offline_status =
      chatBotMessage.botdetails.widget_offline_status;
    chatBotMessage.bot_header_title =
      chatBotMessage.botdetails.bot_header_title;
    chatBotMessage.bot_header_subtitle =
      chatBotMessage.botdetails.bot_header_subtitle;
    chatBotMessage.start_a_new_conversation_value =
      chatBotMessage.start_a_new_conversation_value || "Start a conversation";
    chatBotMessage.show_active_agent_value =
      chatBotMessage.show_active_agent_value || "active agents";
    chatBotMessage.show_active_agent_subtitle_online =
      chatBotMessage.show_active_agent_subtitle_online ||
      "Start a conversation";
    chatBotMessage.show_active_agent_subtitle_offline =
      chatBotMessage.show_active_agent_subtitle_offline || "active agents";
    chatBotMessage.show_search_bar_value =
      chatBotMessage.show_search_bar_value || "Search for help";
    chatBotMessage.chat_now_value = chatBotMessage.chat_now_value || "Chat Now";
    chatBotMessage.whatsapp_value = chatBotMessage.whatsapp_value || "Whatsapp";
    chatBotMessage.knowledge_base_value =
      chatBotMessage.knowledge_base_value || "Knowledge Base";
    chatBotMessage.email_value = chatBotMessage.email_value || "Email";
    chatBotMessage.whatsapp_hyperlinkwhatsapp_hyperlink =
      chatBotMessage.whatsapp_hyperlinkwhatsapp_hyperlink ||
      "https://www.example.com";
    chatBotMessage.email_hyperlink =
      chatBotMessage.email_hyperlink || "https://www.example.com";

    chatBotMessage.chat_now_icon_color = getColorJson(
      chatBotMessage.chat_now_icon_color,
      "rgb(75,94,201)"
    );
    chatBotMessage.whatsapp_icon_color = getColorJson(
      chatBotMessage.whatsapp_icon_color,
      "rgb(75,200,89)"
    );
    chatBotMessage.email_icon_color = getColorJson(
      chatBotMessage.email_icon_color,
      "rgb(0,172,139)"
    );
    chatBotMessage.knowledge_base_icon_color = getColorJson(
      chatBotMessage.knowledge_base_icon_color,
      "rgb(119,75,201)"
    );

    chatBotMessage.welcome_screen_checkbox = 1;

    if (props.mode === "widget") {
      if (chatBotMessage.welcome_screen_checkbox === 1) {
        if (chatBotMessage.welcome_screen_layout === "layout_1") {
          CoverComponent = Covercomponent1;
        } else if (chatBotMessage.welcome_screen_layout === "layout_2") {
          CoverComponent = Covercomponent2;
        } else if (chatBotMessage.welcome_screen_layout === "layout_3") {
          CoverComponent = Covercomponent3;
        }
      }
    } else if (props.mode === "landing") {
      chatBotMessage.load = true;
    } else if (props.mode === "embed") {
      // embed
      chatBotMessage.load = true;
    } else {
      chatBotMessage.load = true;
    }

    if (
      chatBotMessage.welcome_screen_profile_picture === null ||
      chatBotMessage.welcome_screen_profile_picture === ""
    ) {
      chatBotMessage.welcome_screen_profile_picture =
        chatBotMessage.profile == null
          ? chatBotMessage.profile
          : process.env.REACT_APP_LOGO;
    }
    chatBotMessage.google_analytics_path = chatBotMessage.google_analytics_path
      ? chatBotMessage.google_analytics_path
      : "Analytics ID";
    chatBotMessage.facebook_pixel_path = chatBotMessage.facebook_pixel_path
      ? chatBotMessage.facebook_pixel_path
      : "faceboookID";
    chatBotMessage.hotjar_path = chatBotMessage.hotjar_path
      ? chatBotMessage.hotjar_path
      : "testing";
    chatBotMessage.isOpenSettings = false;

    const resObj = {
      ...webchatState,
      ...webchatState.session,
      articles: Array.isArray(chatBotMessage.articles)
        ? chatBotMessage.articles
        : [],
      theme: {
        ...webchatState.theme,
        coverScale: chatBotMessage.welcome_screen_profile_pic_scale + "%",
        welcomeImg: chatBotMessage.welcome_screen_profile_picture,
        header: {
          online: chatBotMessage.widget_online_status,
          offline: chatBotMessage.widget_offline_status,
          title: chatBotMessage.bot_header_title
            ? chatBotMessage.bot_header_title.substring(0, 30)
            : "",
          subtitle: chatBotMessage.bot_header_subtitle
            ? chatBotMessage.bot_header_subtitle.substring(0, 78)
            : "",
        },
      },
      chatsettings: {
        ...webchatState.chatsettings,
        ...chatBotMessage,
      },
    };
    updateChatSettings(resObj);

    setChatSettings({
      ...chatSettings,
      ...chatBotMessage,
    });

    if (props.editMode !== "design") {
      if (chatBotMessage.google_analytics_path) {
        asyncLoadGa(chatBotMessage.google_analytics_path);
      }

      if (chatBotMessage.facebook_pixel_path) {
        asyncLoadFb(chatBotMessage.facebook_pixel_path);
      }

      if (chatBotMessage.hotjar_path) {
        asyncLoadHj(chatBotMessage.hotjar_path);
      }
      reportScroll();
    }

    // console.log("resObj", resObj);
  };

  useEffect(() => {
    const abortableFetch = "signal" in new Request("") ? window.fetch : fetch;
    console.log("webchatState", webchatState);
    // debugger;
    if (controllerGetSettings) {
      controllerGetSettings.abort();
    }
    console.log("OpenSettings", chatSettings.isOpenSettings);
    if (
      webchatState.isWebchatOpen &&
      chatSettings.nextscreen === "welcomescreen"
    ) {
      console.log(chatSettings.nextscreen);
      abortableFetch(
        `${process.env.REACT_APP_ENV_API_URL}chatbot/wecwelcomescreen?botid=${props.botId}`,
        {
          signal: controllerGetSettings,
        }
      )
        .then((response) => {
          return response.json();
        })
        .then(async (resp) => {
          if (resp) {
            abortableFetch(
              `${process.env.REACT_APP_ENV_API_URL}chatbot/searchknowledgebase?bot_id=${props.botId}&value=`,
              {
                signal: controllerGetSettings,
              }
            )
              .then((response) => {
                return response.json();
              })
              .then(async (res) => {
                if (res) {
                  newWelcomeScreen(resp, res);
                }
              })
              .catch((err) => {
                console.log("error...", err);
              });
          }
        })
        .catch((err) => {
          console.log("error...", err);
        });
    } else if (
      webchatState.isWebchatOpen &&
      chatSettings.nextscreen === "chatbot" &&
      chatSettings.isOpenSettings
    ) {
      fetchChatSettings();
    } else {
      if (props.mode == "widget") {
        fetchChatSettings();
      }
      // props.onOpen();
    }
  }, [webchatState.isWebchatOpen]);

  const getSettings = async () => {
    const abortableFetch = "signal" in new Request("") ? window.fetch : fetch;

    if (controllerGetSettings) {
      controllerGetSettings.abort();
    }
    // window.location.protocol+"//"+window.location.host+window.location.pathname
    if (props.mode === "landing") setWrapper(LandingWrapper);
    else if (props.mode === "embed") setWrapper(EmbedWrapper);
    let hostedOn = props.editMode !== "design" ? window.location.href : "";
    // prevent localhost hostedon
    if (hostedOn && hostedOn.substring(0, 16) === "http://localhost") {
      hostedOn = "";
    }
    abortableFetch(
      `${process.env.REACT_APP_ENV_API_URL}admin/botonloadconfigs?botid=${props.botId}&mode=${props.mode}&hosted_on=${hostedOn}`,
      {
        signal: controllerGetSettings,
      }
    )
      .then((response) => {
        return response.json();
      })
      .then(async (res) => {
        if (res && res.bot_onload_settings) {
          res.bot_onload_settings.load = false;

          if (res.bot_onload_settings.editMode == "design")
            res.bot_onload_settings.load = true;
          processSettings(res);
        }
      })
      .catch((err) => {
        console.log("error...", err);
        chatbotlist = {};
        chatbotlist.load = false;
        setChatSettings(chatbotlist);
      });
  };

  const reportScroll = () => {
    if (chatbotlist.load || chatBotMessage.load === undefined)
      // api is not loaded yet
      return;
    if (scrollParam.welcomeMessage && (chatbotlist.load || chatBotMessage.load))
      return;
    const scrollElement = document.scrollingElement || document.documentElement;
    const height = scrollElement.scrollHeight - scrollElement.clientHeight;
    const scrollPercentage = Math.round(
      (scrollElement.scrollTop / height) * 100
    );
    if (
      afterScrollPercent > 0 &&
      scrollParam.showOnScroll === false &&
      scrollPercentage >= afterScrollPercent
    ) {
      if ((chatbotlist.load || chatBotMessage.load) === false) {
        scrollParam.showOnScroll = true;
        chatbotlist.load = true;
        chatBotMessage.load = true;
        setChatSettings({
          ...chatbotlist,
          load: true,
        });
      }
    }
    if (
      launchCriteriaWelcomeMessagePercent > 0 &&
      scrollParam.welcomeMessage === false &&
      scrollPercentage >= launchCriteriaWelcomeMessagePercent
    ) {
      scrollParam.welcomeMessage = true;
      setChatSettings({
        ...chatbotlist,
        showWelcomeMessage: true,
      });
    }
  };

  const getWeChatSettings = async () => {
    const abortableFetch = "signal" in new Request("") ? window.fetch : fetch;

    if (controllerGetSettings) {
      controllerGetSettings.abort();
    }
    // window.location.protocol+"//"+window.location.host+window.location.pathname
    if (props.mode === "landing") setWrapper(LandingWrapper);
    else if (props.mode === "embed") setWrapper(EmbedWrapper);
    let hostedOn = props.editMode !== "design" ? window.location.href : "";
    // prevent localhost hostedon
    if (hostedOn && hostedOn.substring(0, 16) === "http://localhost") {
      hostedOn = "";
    }
    abortableFetch(
      `${process.env.REACT_APP_ENV_API_URL}chatbot/wecchat?botid=${props.botId}&mode=${props.mode}&hosted_on=${hostedOn}`,
      {
        signal: controllerGetSettings,
      }
    )
      .then((response) => {
        return response.json();
      })
      .then(async (res) => {
        if (res) {
          res.load = false;

          if (res.editMode == "design") res.load = true;

          if (props.mode !== "widget") {
            newWelcomeMessage(res);
            fetchChatSettings();
          } else {
            newWelcomeMessage(res);
          }
        }
      })
      .catch((err) => {
        console.log("error...", err);
        chatBotMessage = {};
        chatBotMessage.load = false;
        setChatSettings(chatBotMessage);
      });
  };

  const fetchChatSettings = () => {
    const abortableFetch = "signal" in new Request("") ? window.fetch : fetch;

    if (controllerGetSettings) {
      controllerGetSettings.abort();
    }
    // window.location.protocol+"//"+window.location.host+window.location.pathname
    if (props.mode === "landing") setWrapper(LandingWrapper);
    else if (props.mode === "embed") setWrapper(EmbedWrapper);
    let hostedOn = props.editMode !== "design" ? window.location.href : "";
    // prevent localhost hostedon
    if (hostedOn && hostedOn.substring(0, 16) === "http://localhost") {
      hostedOn = "";
    }
    if (
      (chatSettings.isCoverComponentOpen && props.mode == "widget") ||
      props.mode == "landing" ||
      props.mode == "embed"
    ) {
      abortableFetch(
        `${process.env.REACT_APP_ENV_API_URL}chatbot/chatsettings?botid=${props.botId}&mode=${props.mode}`,
        {
          signal: controllerGetSettings,
        }
      )
        .then((response) => {
          return response.json();
        })
        .then(async (resu) => {
          if (resu) {
            let newRes = resu.chatsettings;
            newChatSettingsFn(newRes);
            if (props.mode == "widget") {
              props.onOpen();
            }
          }
        })
        .catch((err) => {
          console.log("error...", err);
          chatBotMessage = {};
          chatBotMessage.load = false;
          setChatSettings(chatBotMessage);
        });
    }
  };

  useEffect(() => {
    // if (!document.getElementById("weconnect_w_css")) {
    //   var head = document.getElementsByTagName("HEAD")[0];
    //   var link = document.createElement("link");
    //   link.rel = "stylesheet";
    //   link.type = "text/css";
    //   link.id = "weconnect_w_css";
    //   link.href = process.env.REACT_APP_SCRIPT_BASE_URL + "main.css";
    //   // link.href = 'http://localhost:8080/main.css';
    //   head.appendChild(link);
    // }
    // getSettings();
    getWeChatSettings();
    const offlineStatus = () => {
      setOnline(false);
    };
    const onlineStatus = () => {
      setOnline(true);
    };

    const terminationEvent =
      "onpagehide" in window.self ? "pagehide" : "unload";

    const pongTrigger = (e) => {
      if (
        isMobile(mobileBreakpoint) ||
        window.location.href.includes("pingpongTest")
      ) {
        props.pongTrigger(e);
      }
    };

    if (props.editMode !== "design") {
      document.addEventListener("scroll", reportScroll, { passive: true });
      // window.addEventListener("beforeunload", props.closeBrowser);
      window.addEventListener(terminationEvent, props.closeBrowser);
      window.addEventListener("offline", offlineStatus);
      window.addEventListener("online", onlineStatus);
      window.addEventListener("visibilitychange", pongTrigger);
      return () => {
        document.removeEventListener("scroll", reportScroll);
        // window.removeEventListener("beforeunload", props.closeBrowser);
        window.removeEventListener(terminationEvent, props.closeBrowser);
        window.removeEventListener("offline", offlineStatus);
        window.removeEventListener("online", onlineStatus);
        window.removeEventListener("visibilitychange", pongTrigger);
      };
    } else {
      // window.addEventListener("beforeunload", props.closeBrowser);
      window.addEventListener(terminationEvent, props.closeBrowser);
      window.addEventListener("offline", offlineStatus);
      window.addEventListener("online", onlineStatus);
      window.addEventListener("visibilitychange", pongTrigger);
      return () => {
        props.closeBrowser();
        // window.removeEventListener("beforeunload", props.closeBrowser);
        window.removeEventListener(terminationEvent, props.closeBrowser);
        window.removeEventListener("offline", offlineStatus);
        window.removeEventListener("online", onlineStatus);
        window.removeEventListener("visibilitychange", pongTrigger);
      };
    }
  }, []);

  const coverComponent = () => {
    // const coverComponentProps = getThemeProperty(
    //   WEBCHAT.CUSTOM_PROPERTIES.coverComponentProps,
    //   props.coverComponent && props.coverComponent.props
    // );
    if (CoverComponent && webchatState.isCoverComponentOpen)
      return (
        <CoverComponent
          ismobile={webchatState.theme.deviceMode === "mobile"}
          chatSettings={chatSettings}
          closeComponent={closeCoverComponent}
          closeWebchat={() => {
            toggleWebchat(false);
          }}
          // {...coverComponentProps}
        />
      );
    return null;
  };

  const messageComponentFromInput = (input) => {
    let messageComponent = null;
    let sender = SENDERS.user;
    if (input.from === "bot") {
      sender = SENDERS.bot;
    }
    if (isText(input)) {
      messageComponent = (
        <Text
          html={input.html}
          id={input.id}
          payload={input.payload}
          from={sender}
        >
          {input.data}
        </Text>
      );
    } else if (isMedia(input)) {
      let mediaProps = {
        id: input.id,
        from: sender,
      };
      if (!input.src) {
        const temporaryDisplayUrl = URL.createObjectURL(input.data);
        mediaProps.src = temporaryDisplayUrl;
      } else {
        mediaProps.src = input.src;
      }
      if (isImage(input)) messageComponent = <Image {...mediaProps} />;
      else if (isGif(input)) messageComponent = <GifImage {...mediaProps} />;
      else if (isAudio(input)) messageComponent = <Audio {...mediaProps} />;
      else if (isVideo(input)) messageComponent = <Video {...mediaProps} />;
      else if (isDocument(input))
        messageComponent = <Document {...mediaProps} />;
    } else if (isLocation(input)) {
      const location = JSON.parse(input.data);
      const lat = location.lat;
      const long = location.long;
      messageComponent = <Location {...input} lat={lat} long={long} />;
    }
    return messageComponent;
  };

  const sendWaitInput = async (input) => {
    if (!input || Object.keys(input).length == 0) return;
    if (isText(input) && (!input.data || !input.data.trim())) return; // in case trim() doesn't work in a browser we can use !/\S/.test(input.data)
    if (isText(input) && checkBlockInput(input)) return;
    if (!input.id) input.id = uuidv4();
    const messageComponent = messageComponentFromInput(input);
    if (messageComponent) addMessageComponent(messageComponent);

    if (!input.src && isMedia(input))
      input.data = await readDataURL(input.data);
    updateLatestInput(input);
    updateReplies(false);
    isOnline() && updateLastMessageDate(currentDateString());
    togglePersistentMenu(false);
    // toggleEmojiPicker(false);
  };

  const sendInput = async (input) => {
    if (input.noInput !== true) await sendWaitInput(input);
    // sendUserInput should be worked after input is sent, for that sendWaitInput is made
    sendUserInput(input);
  };

  /* This is the public API this component exposes to its parents
  https://stackoverflow.com/questions/37949981/call-child-method-from-parent
  */
  const updateWebchatSettings = (settings) => {
    const themeUpdates = normalizeWebchatSettings(settings);
    console.log("updateWebchatSettings", updateWebchatSettings);
    updateTheme(merge(webchatState.theme, themeUpdates), themeUpdates);
  };

  const updateThemeSettings = (settings) => {
    const themeUpdates = settings;
    console.log("mysettings", settings, webchatState.theme);
    updateTheme(merge(webchatState.theme, themeUpdates), themeUpdates);
  };

  const updateBotSettings = (settings) => {
    console.log("settings", settings);
    const mergedSettings = merge(webchatState.chatsettings, settings);
    updateChatSettings(settings);
    setChatSettings({
      ...chatSettings,
      mergedSettings,
    });
  };

  const updateFont = (font) => {
    WebFont.load({
      google: {
        families: ["Nunito"],
      },
    });
    if (props.mode !== "widget") {
      WebFont.load({
        google: {
          families: [font],
        },
      });
    } else {
      let i = {
        fontFamily: font,
      };
      const merged = merge(webchatState, i);
      updateChatSettings(merged);
    }
  };

  const setSettingsChat = (payload) => {
    setChatSettings({
      ...chatSettings,
      ...payload,
    });
  };

  const setHandoff = (handoff) => {
    if (handoff) {
      updateWebchatSettings({
        enableUserInput: false,
      });
    } else {
      updateWebchatSettings({
        enableUserInput: true,
      });
    }

    // if (handoff)
    //   updateSession({
    //     ...webchatState.session,
    //     _botonic_action: `create_case:""`,
    //   });
    // else updateSession({ ...webchatState.session, _botonic_action: "" });
  };

  const updateSessionWithUser = (userToUpdate) => {
    console.log("updateSessionWithUser");
    updateSession(merge(webchatState.session, { user: userToUpdate }));
  };

  const weConnectUpdateSession = (sessionData) => {
    console.log("weConnectUpdateSession");
    updateSession(merge(webchatState.session, sessionData));
  };

  useImperativeHandle(ref, () => ({
    addBotResponse: async ({ response, session, lastRoutePath }, replace) => {
      setTyping(false);
      if (lastRoutePath !== webchatState.lastRoutePath) {
        if (props.onChangeRoute)
          await props.onChangeRoute(webchatState.lastRoutePath, lastRoutePath);
      }
      if (
        lastRoutePath === "appointment_confirmed" ||
        lastRoutePath === "carousal" ||
        lastRoutePath === "rating_selected" ||
        lastRoutePath === "message"
      ) {
        updateLastMessage({
          reply: true,
        });
      }
      if (Array.isArray(response))
        response.map((r) => {
          return addMessageComponent(r);
        });
      else if (response) addMessageComponent(response);

      if (session) {
        console.log("useImperativeHandle");
        updateSession(merge(session, { user: webchatState.session.user }));
        const action = session._botonic_action || "";
        const handoff = action.startsWith("create_case");
        // if (handoff && isDev) addMessageComponent(<Handoff />)
        updateHandoff(handoff);
      }
      if (lastRoutePath) {
        updateLastRoutePath(lastRoutePath);
      }
      updateLastMessageDate(currentDateString());
      if (props.onBotInput) {
        props.onBotInput(response, session, lastRoutePath);
        // updateReplies(false)
      }
    },
    setSocket: (status) => setSocket(status),
    getSettings: () => getSettings(),
    getWeChatSettings: () => getWeChatSettings(),
    resolveCase: () => resolveCase(),
    getwebchatState: () => webchatState,
    updateReplies: (args) => {
      updateLastMessageDate(currentDateString());
      updateReplies(args);
    },
    updateReadStatus: (payload) => updateReadStatus(payload),
    updateSendStatus: (msgId) => {
      updateSendStatus({ webchatState, updateMessage, msgId });
    },
    updateChatSettings: (payload) => updateBotSettings(payload),
    updateFont: (payload) => updateFont(payload),
    setSettingsChat: (payload) => setSettingsChat(payload),
    setTyping: (typing, coverClose) => setTyping(typing),
    setHandoff: (handoff) => setHandoff(handoff),
    addUserMessage: (message) => sendInput(message),
    updateUser: updateSessionWithUser,
    weConnectUpdateSession: weConnectUpdateSession,
    openWebchat: () => toggleWebchat(true),
    closeWebchat: () => toggleWebchat(false),
    toggleWebchat: () => toggleWebchat(!webchatState.isWebchatOpen),
    openCoverComponent: () => toggleCoverComponent(true),
    closeCoverComponent: () => toggleCoverComponent(false),
    renderCustomComponent: (_customComponent) => {
      setCustomComponent(_customComponent);
      doRenderCustomComponent(true);
    },
    unmountCustomComponent: () => doRenderCustomComponent(false),
    toggleCoverComponent: () =>
      toggleCoverComponent(!webchatState.isCoverComponentOpen),
    openWebviewApi: (component) => openWebviewT(component),
    setError,
    setOnline,
    getMessages: () => webchatState.messagesJSON,
    isOnline,
    clearMessages: () => {
      clearMessages();
      updateReplies(false);
    },
    getLastMessageUpdate: () => webchatState.lastMessageUpdate,
    updateMessageInfo: (msgId, messageInfo) => {
      const messageToUpdate = webchatState.messagesJSON.filter(
        (m) => m.id == msgId
      )[0];
      const updatedMsg = merge(messageToUpdate, messageInfo);
      if (updatedMsg.ack === 1) delete updatedMsg.unsentInput;
      updateMessage(updatedMsg);
    },
    updateMessageComponent: (message) => {
      updateReplies(false);
      updateMessageComponent(message);
    },
    updateWebchatSettings: (settings) => updateThemeSettings(settings),
  }));

  const resolveCase = () => {
    console.log("resolveCase");
    updateHandoff(false);
    updateSession({ ...webchatState.session, _botonic_action: null });
  };

  // const prevSession = usePrevious(webchatState.session);
  // useEffect(() => {
  //   // Resume conversation after handoff
  //   if (
  //     prevSession &&
  //     prevSession._botonic_action &&
  //     !webchatState.session._botonic_action
  //   ) {
  //     const action = getParsedAction(prevSession._botonic_action);
  //     if (action && action.on_finish) sendPayload(action.on_finish);
  //   }
  // }, [webchatState.session._botonic_action]);

  const sendText = async (text, payload, item) => {
    if (!text) return;
    const input = { type: INPUT.TEXT, data: text, payload, item };
    await sendInput(input);
  };

  const sendPayload = async (payload) => {
    if (!payload) return;
    const input = { type: INPUT.POSTBACK, payload };
    await sendInput(input);
  };

  const sendTextAreaText = async () => {
    if (!webchatState.online || !webchatState.socket) {
      return;
    }
    let result = true;
    if (props.onValidateInput)
      result = await props.onValidateInput({
        input: textArea.current.value,
        elem: textArea,
        webchatState: webchatState,
        lastRoutePath: webchatState.lastRoutePath,
      });
    if (result) {
      sendText(textArea.current.value);
      textArea.current.value = "";
      setChatText("");
    }
  };

  const onKeyDown = (event) => {
    if (event.keyCode == 13 && event.shiftKey == false) {
      event.preventDefault();
      sendTextAreaText();
    }
  };

  const webviewRequestContext = {
    getString: (stringId) => props.getString(stringId, webchatState.session),
    setLocale: (locale) => props.getString(locale, webchatState.session),
    session: webchatState.session || {},
    params: webchatState.webviewParams || {},
    closeWebview: closeWebview,
    defaultDelay: props.defaultDelay || 0,
    defaultTyping: props.defaultTyping || 0,
  };

  useEffect(() => {
    if (firstUpdate.current) {
      firstUpdate.current = false;
      return;
    }
    if (
      webchatState.isWebchatOpen &&
      chatSettings.nextscreen !== "welcomescreen"
    )
      if (
        !webchatState.isWebchatOpen &&
        props.onClose &&
        !firstUpdate.current
      ) {
        // toggleEmojiPicker(false);
        togglePersistentMenu(false);
      }
    if (isMobile(mobileBreakpoint)) {
      if (webchatState.isWebchatOpen) {
        document.documentElement.classList.add("weconnecthtmlcontainer");
      } else {
        document.documentElement.classList.remove("weconnecthtmlcontainer");
      }
    }
  }, [webchatState.isWebchatOpen]);

  const textArea = useRef();

  const webchatMessageList = () => (
    <WebchatMessageList
      style={{
        flex: 1,
        display: webchatState.isCoverComponentOpen ? "none" : "",
      }}
    >
      <MessageContainer deviceMode={webchatState.theme.deviceMode}>
        {webchatState.replies &&
          webchatState.socket &&
          webchatState.online &&
          Object.keys(webchatState.replies).length > 0 &&
          webchatReplies()}
      </MessageContainer>
      <MessageContainer style={{ textAlign: "left" }}>
        {(webchatState.typing ||
          !webchatState.online ||
          !webchatState.socket) && <TypingIndicator />}
      </MessageContainer>
    </WebchatMessageList>
  );

  const webchatReplies = () => (
    <WebchatReplies
      style={{ width: "100%" }}
      replies={webchatState.replies}
      nextMsg={webchatState.messagesJSON.filter((m) => !m.display)[0]}
    />
  );

  const isUserInputEnabled = () => {
    const isUserInputEnabled = getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.enableUserInput,
      false
    );
    return isUserInputEnabled && !webchatState.isCoverComponentOpen;
  };

  const userInputEnabled = isUserInputEnabled();

  const ConditionalAnimation = (props) => (
    <ConditionalWrapper
      condition={animationsEnabled}
      wrapper={(children) => (
        <motion.div whileHover={{ scale: 1.2 }}>{children}</motion.div>
      )}
    >
      {props.children}
    </ConditionalWrapper>
  );

  const userInputArea = () => {
    const chatActive =
      webchatState.lastRoutePath === "connected" ||
      webchatState.lastRoutePath === "human_takeover" ||
      webchatState.lastRoutePath === "videochatlink" ||
      webchatState.lastRoutePath === "assign_to_me";
    return (
      userInputEnabled &&
      webchatState.online &&
      webchatState.socket && (
        <UserInputContainer>
          <style>
            {`
            
            .speed-dial-block {
                height: auto !important;
            }
            .speed-dial-block .opened {
              border-radius: 20px;
              padding: 5px 5px 2px 5px;
              box-shadow: 0px 3px 14px rgb(44 48 64 / 14%);
              left: 11px;
              bottom: 0px;
              width: 33px;
          }
          .speed-dial-block .closed {
              border-radius: 20px;
              padding: 5px 5px 2px 5px;
              left: 11px;
              bottom: 0px !important;
              width: 33px;
          }
          .MuiSpeedDial-fab {
            width: 100%;
            min-width: 33px;
            height: 100%;
            min-height: 33px;
            display: -webkit-box;
            display: -webkit-flex;
            display: -ms-flexbox;
            display: flex;
            -webkit-align-items: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            -webkit-justify-content: center;
            justify-content: center;
            border: 1px solid #1e1e1e;
            border-radius: 25px;
            opacity: 1;
            box-shadow: none;
            margin: 3px 0;
            background-color: #fff;
            color: #1e1e1e;
        }
        .MuiSpeedDial-fab:hover{
          background-color:transparent
        }
        .speed-dial-block .closed button span {
            display: flex;
            align-items: center;
            height: 18px;
        }
        .speed-dial-block .closed button svg {
          font-size: 16px;
          color: inherit;
          user-select: none;
          width: 1em; 
          height: 1em;
          display: inline-block;
          fill: currentColor;
          -webkit-flex-shrink: 0;
          -ms-flex-negative: 0;
          flex-shrink: 0;
          -webkit-transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
          transition: fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
          font-size: 1.5rem;
      }
      .MuiSpeedDialAction-staticTooltipLabel{
        box-shadow:unset;
        background-color:unset
      }
        textarea {
          font-size: 16px !important;
          padding: 10px !important;
          font-family: inherit;
          color: #1e1e1e !important;
          line-height: 20px !important;
          box-shadow: none !important;
      }
      input[type=color], input[type=date], input[type=datetime], input[type=datetime-local], input[type=email], input[type=month], input[type=number], input[type=password], input[type=search], input[type=tel], input[type=text], input[type=time], input[type=url], input[type=week], select:focus, textarea {
          font-size: 16px !important;
      }
    
      .bottom-input-filed-block {
          background: #f9f9f9;
          border-radius: 33px;
          padding-left: 10px;
          width: 100%;
          display: flex;
          margin-left: 57px;
      }
      .bottom - input - filed - block.mic - btn {
                      background - color: rgba(0,0,0,0);
                      outline: none;
                      border: 0;
                  }
      .speed-dial-block .MuiSpeedDial-root.MuiSpeedDial-directionUp.closed .MuiSpeedDial-actions {
          display: none !important;
      }
      .speed-dial-block div#SpeedDialcontrolledopenexample-actions {
          margin: 0;
          padding: 0;
            display: flex;
          flex-wrap: wrap;
          justify-content: center;
      }
      #SpeedDialcontrolledopenexample-actions button{
        box-shadow:unset !important;
        height:unset !important;
        margin:0;
        min-height:40px
      }
      
     
      .speed-dial-block .opened button.MuiButtonBase-root.MuiFab-root.MuiFab-circular.MuiFab-sizeLarge.MuiFab-primary.MuiSpeedDial-fab {
          width: 100%;
          min-width: 33px;
          height: 100%;
          min-height: 33px;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #32e0a1;
          border: none;
          border-radius: 25px;
          opacity: 1;
          box-shadow: none;
          margin: 3px 0;
      }
       .speed-dial-block .opened button.MuiButtonBase-root.MuiFab-root.MuiFab-circular.MuiFab-sizeLarge.MuiFab-primary.MuiSpeedDial-fab:hover{
             background-color: transparent;
       }
      .speed-dial-block .opened button.MuiButtonBase-root.MuiFab-root.MuiFab-circular.MuiFab-sizeLarge.MuiFab-primary.MuiSpeedDial-fab span {
          height: 18px;
          display: flex;
          align-items: center;
      }
      .speed-dial-block .opened button.MuiButtonBase-root.MuiFab-root.MuiFab-circular.MuiFab-sizeLarge.MuiFab-primary.MuiSpeedDial-fab svg {
          font-size: 16px;
          color: #1e1e1e;
          width:15px;
          height:15px
      }
      .bottom-input-filed-block {
          background: #f9f9f9;
          border-radius: 33px;
          padding-left: 10px;
          width: 100%;
          display: flex;
          margin-left: 57px;
      }
      
      .bottom-input-filed-block img, .bottom-input-filed-block svg {
          width: 15px;
      }
      .reply_icon_btn {
          background: transparent;
          border: transparent;
      }
  
    
    
    
          .bottom - input - filed - block.mic - btn {
                        background - color: rgba(0,0,0,0);
                      outline: none;
                      border: 0;
          }
                      .weconnect_audio_player {
                        display: flex;
                      flex-direction: row;
                      align-items: center;
                      padding: 0 20px;
                      margin-bottom: 23px;
          }

                      .audio_delete {
                        color: #e34140;
                      width: 23px;
          }
                      .audioplayer {
                        width: 100%;
                      height: 35px;
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      background: #35d188;
                      color: #fff;
                      border-radius: 30px;
                      padding: unset !important;
                      margin: 0px 10px;
                      }
                      .audioplayer_user .slider {
                          width: 110px;
                        }
                           div#botonic-scrollable-content {
                            height:100%;
                        }
                        .audioplayer_user .audioplayer__time {
                              background: #fff;
                              color: #000;
                              border-radius: 12px;
                              padding: 0px 2px;
                              text-align: center;
                              font-size: 11px !important;
                          }
                        .audioplayer.audioplayer_user svg{
                          padding-left:10px
                        }
                      .audioplayer>div {
                                    width: calc(100% - 85px);
                                  height: 15px;
                                  display: flex;
                                  align-items: center;
                                  position: relative;
                      }

                                  .audioplayer__time {
                                    margin - right: 10px;
                                  margin-left: 2px;
                                  min-width: 35px;
                                  font-family: inherit;
                                  display: inline-block;
                                  font-size: 13px !important;
                      }
                                  .audioplayer2 .audioplayer__slider--played {
                                    background: #06d755;
                      }
                                .audioplayer__slider {
                                  -webkit-appearance: none;
                                  -moz-appearance: none;
                                  appearance: none;
                                  height: 5px;
                                  width: 100%;
                                  background: rgba(0,0,0,.1882352941);
                                  border-radius: 2.5px;
                                  position: absolute;
                                  right: 0;
                                  z-index: 1;
                              }
                              .audioplayer__time {
                                margin-right: 10px;
                                margin-left: 2px;
                                min-width: 35px;
                                font-family: inherit;
                                display: inline-block;
                                font-size: 13px !important;
                            }
                            .bottom - input - filed - block.mic - btn {
                                  background - color: rgba(0,0,0,0);
                                  outline: none;
                                  border: 0;
                              }


          `}
          </style>
          {/* <FeaturesWrapper>
              <ConditionalAnimation>
                <div onClick={handleMenu}>
                  {CustomMenuButton ? <CustomMenuButton /> : <PersistentMenu />}
                </div>
              </ConditionalAnimation>
            </FeaturesWrapper> */}

          <Box
            sx={{
              height: 320,
              transform: "translateZ(0px)",
              flexGrow: 1,
            }}
            className="speed-dial-block"
          >
            <SpeedDial
              ariaLabel="SpeedDial controlled open example"
              style={{
                position: "absolute",
                bottom: 16,
                right: 16,
                backgroundColor: open ? "#fff" : "transparent",
                "&> .MuiSpeedDial-fab": {
                  "&:hover": {
                    backgroundColor: chatActive ? "red" : "#fff",
                    color: chatActive ? "#fff" : "#1e1e1e",
                  },
                  width: "100%",
                  minWidth: "33px",
                  height: "100%",
                  minHeight: "33px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid #1e1e1e",
                  borderRadius: "25px",
                  opacity: 1,
                  boxShadow: "none",
                  margin: "3px 0",
                  backgroundColor: chatActive
                    ? widgetThemeStyle.background
                    : "#fff",
                  color: chatActive ? widgetThemeStyle.color : "#1e1e1e",
                },
              }}
              icon={<SpeedDialIcon />}
              onClick={handleClick}
              open={open}
              className={open ? "opened" : "closed"}
            >
              <SpeedDialAction
                key={"gif"}
                icon={<GifPickerSvg />}
                tooltipOpen
                onClick={(e, elem) => {
                  handleSpeedDialClick("gif");
                  e.stopPropagation();
                }}
              />
              <SpeedDialAction
                key={"emoji"}
                icon={<SmileSvg />}
                tooltipOpen
                onClick={(e, elem) => {
                  handleSpeedDialClick("emoji");
                  e.stopPropagation();
                }}
              />
              {(webchatState.lastRoutePath === "connected" ||
                webchatState.lastRoutePath === "human_takeover" ||
                webchatState.lastRoutePath === "connected" ||
                webchatState.lastRoutePath === "assign_to_me") && (
                <SpeedDialAction
                  key={"endchat"}
                  icon={<EndSvg />}
                  tooltipOpen
                  onClick={(e, elem) => {
                    handleSpeedDialClick("endchat");
                    e.stopPropagation();
                  }}
                />
              )}
              {/* {dialAction.map((action) => {
                // if(action.type==="endchat") {
                //   (webchatState.lastRoutePath!="connected" &&
                //   webchatState.lastRoutePath!="human_takeover" &&
                //   webchatState.lastRoutePath!="connected" &&
                //   webchatState.lastRoutePath!="assign_to_me"
                //   )
                //   return null;
                // }
                return (
                  <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipOpen
                    onClick={(e, elem) => {
                      handleSpeedDialClick(action.type);
                      e.stopPropagation();
                    }}
                  />
                );
              })} */}
            </SpeedDial>
          </Box>
          {giphyPickerOpen && (
            <Suspense
              fallback={
                <div
                  style={{
                    fontFamily: "nunito",
                  }}
                >
                  Loading...
                </div>
              }
            >
              <OpenedGiphyPicker
                apiKey={"LgyFqDpSMY4BanrZVAWBdGeEQ2ppu4yR"}
                onSelected={(item) => {
                  if (
                    webchatState.lastRoutePath === "connected" ||
                    webchatState.lastRoutePath === "videochatlink" ||
                    webchatState.lastRoutePath === "human_takeover" ||
                    webchatState.lastRoutePath === "assign_to_me"
                  ) {
                    const src = item.preview_gif.url.split("?")[0];
                    sendInput({
                      type: "gif",
                      from: "user",
                      data: src,
                      src: src,
                      extension: "gif",
                      item: {
                        btn_text: "gif",
                      },
                    });
                    updateReplies(false);
                  }
                  setGiphyPickerOpen(false);
                  setOpen(false);
                }}
                onClick={handleGiphyPick}
              />
            </Suspense>
          )}
          {emojiOpen && (
            <Suspense
              fallback={
                <div
                  style={{
                    fontFamily: "nunito",
                  }}
                >
                  Loading...
                </div>
              }
            >
              <OpenedEmojiPicker
                className="widget_emoji_picker_popup"
                height={webchatState.theme.style.height}
                onEmojiClick={handleSelectedEmoji}
                onClick={handleEmojiClick}
              />
            </Suspense>
          )}
          <style>
            {`
            .bottom-input-filed-block .mic-btn {
                background-color: rgba(0,0,0,0);
                outline: none;
                border: 0px;
            }
            .attachment_popup_block .MuiPaper-root {
                z-index: 99999;
                border-radius: 10px;
                background-color: rgb(255, 255, 255);
                color: rgba(0, 0, 0, 0.87);
                transition: box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
                border-radius: 4px;
                box-shadow: rgb(0 0 0 / 20%) 0px 5px 5px -3px, rgb(0 0 0 / 14%) 0px 8px 10px 1px, rgb(0 0 0 / 12%) 0px 3px 14px 2px;
                position: absolute;
                overflow: hidden auto;
                min-width: 16px;
                min-height: 16px;
                max-width: calc(100% - 32px);
                max-height: calc(100% - 32px);
                outline: 0px;
            }
             .attachment_popup_block .MuiPaper-root  ul{
                   list-style: none;
                    margin: 0px;
                    padding: 8px 0px;
                    position: relative;
                    outline: 0px;
             }
            .attachment_popup_block .attachment_main_block {
                padding: 10px 10px 0 10px;
            }
            .attachment_popup_block .attachment_main_block p {
                font-family: "nunito";
            }
            .attachment_main_block .MuiGrid-container {
                  box-sizing: border-box;
                  display: flex;
                  flex-flow: row wrap;
                  margin-top: -8px;
                  width: calc(100% + 8px);
                  margin-left: -8px;
            }
            .MuiGrid-grid-xs-4{
                padding-left: 8px;
                    padding-top: 8px;
            }
            @media (min-width: 900px){
              .MuiGrid-grid-xs-4 {
                  flex-basis: 33.3333%;
                  -webkit-box-flex: 0;
                  flex-grow: 0;
                  max-width: 33.3333%;
                  padding-left: 8px;
                  padding-top: 8px;
              }
            }

            `}
          </style>
          <div className="bottom-input-filed-block">
            <TextAreaContainer>
              {/**
               * @design team put mike icon here, I will add functionality
               */}
              {(webchatState.lastRoutePath === "connected" ||
                webchatState.lastRoutePath === "human_takeover" ||
                webchatState.lastRoutePath === "videochatlink" ||
                webchatState.lastRoutePath === "assign_to_me") && (
                <Tooltip
                  title={
                    isRecording
                      ? "Recording..."
                      : "Press & Hold to record audio"
                  }
                >
                  <IconButton
                    className={
                      isRecording
                        ? "recording_mike mic-btn"
                        : "weconnect_mike mic-btn"
                    }
                    onMouseDown={startRecording}
                    onMouseUp={stopRecording}
                  >
                    <BsMic className="mic-icon" />
                  </IconButton>
                </Tooltip>
              )}
              <Textarea
                name="text"
                onFocus={() => deviceAdapter.onFocus(host)}
                onBlur={() => deviceAdapter.onBlur()}
                maxRows={4}
                value={chatText}
                onChange={(e) => {
                  setChatText(e.target.value);
                }}
                wrap="soft"
                maxLength="1000"
                placeholder={getThemeProperty(
                  WEBCHAT.CUSTOM_PROPERTIES.textPlaceholder,
                  WEBCHAT.DEFAULTS.PLACEHOLDER
                )}
                autoFocus={true}
                inputRef={textArea}
                onKeyDown={(e) => onKeyDown(e)}
                style={{
                  display: "flex",
                  fontSize: deviceAdapter.fontSize(14),
                  width: "100%",
                  border: "none",
                  resize: "none",
                  overflow: "auto",
                  outline: "none",
                  flex: "1 1 auto",
                  transform: "scale(0.875)",
                  transformOrigin: "left center",
                  marginRight: "-14.28%",
                  padding: 10,
                  paddingLeft: persistentMenuOptions ? 0 : 10,
                  textSizeAdjust: "none",
                  fontFamily: "inherit",
                  ...getThemeProperty(
                    WEBCHAT.CUSTOM_PROPERTIES.userInputBoxStyle
                  ),
                }}
              />
            </TextAreaContainer>
            <FeaturesWrapper>
              {(webchatState.lastRoutePath === "connected" ||
                webchatState.lastRoutePath === "human_takeover" ||
                webchatState.lastRoutePath === "videochatlink" ||
                webchatState.lastRoutePath === "assign_to_me") && (
                <IconButton
                  className="reply_icon_btn"
                  onClick={handleClickAttach}
                >
                  <ImAttachment />
                </IconButton>
              )}
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={
                  props.mode === "widget"
                    ? openAttach && webchatState.isWebchatOpen
                    : openAttach
                }
                sx={{
                  zIndex: "9999999999",
                }}
                className="attachment_popup_block"
                onClose={handleCloseAttach}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
              >
                <div className="attachment_main_block">
                  <Grid container spacing={1}>
                    <Grid item xs={4}>
                      <Attachment
                        attachment={true}
                        onChange={handleAttachment}
                        accept={MIME_WHITELIST.document.join(",")}
                        icon={doc}
                        text="Document"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Attachment
                        attachment={true}
                        onChange={handleAttachment}
                        accept={MIME_WHITELIST.image.join(",")}
                        icon={image}
                        text="Image"
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Attachment
                        attachment={false}
                        onChange={handleLocation}
                        accept={MIME_WHITELIST.image.join(",")}
                        icon={map}
                        text="Location"
                      />
                      {/* <div className="attachment_content_block">
                        <div className="attachment_inner">
                          <img src={map} style={{ width: "15px" }} />
                        </div>
                        <p>Location</p>
                      </div> */}
                    </Grid>
                    <Grid item xs={4}>
                      <Attachment
                        attachment={true}
                        onChange={handleAttachment}
                        accept={MIME_WHITELIST.audio.join(",")}
                        icon={headphone}
                        text="Audio"
                      />
                      {/* <div className="attachment_content_block">
                        <div className="attachment_inner">
                          <img src={headphone} />
                        </div>
                        <p>Audio</p>
                      </div> */}
                    </Grid>
                    {/* <Grid item xs={4}>
                      <Attachment
                        attachment={false}
                        onChange={handleAttachment}
                        accept={MIME_WHITELIST.audio.join(",")}
                        icon={user1}
                        text="Contact"
                      />
                      <div className="attachment_content_block">
                        <div className="attachment_inner">
                          <img src={user1} />
                        </div>
                        <p>Contact</p>
                      </div>
                    </Grid> */}
                  </Grid>
                </div>
              </Menu>
              <div onClick={sendTextAreaText}>
                {chatText.trim() == "" ? (
                  <IconButton
                    className="reply_icon_btn"
                    style={{ marginRight: "5px" }}
                  >
                    <img src={send1} alt="" />
                  </IconButton>
                ) : (
                  <IconButton
                    className="reply_icon_btn"
                    style={{ marginRight: "5px" }}
                  >
                    <img src={send} alt="" />
                  </IconButton>
                )}
              </div>
              {/* {(sendButtonEnabled || CustomSendButton) && (
                // <ConditionalAnimation>
                <div onClick={sendTextAreaText}>
                  {CustomSendButton ? <CustomSendButton /> : <SendButton />}
                </div>
                // </ConditionalAnimation>
              )} */}
            </FeaturesWrapper>
          </div>
        </UserInputContainer>
      )
    );
  };

  let mobileStyle = {};
  let widgetViewStyle = {};

  if (props.mode === "widget") {
    widgetViewStyle = {
      bottom: "118px",
      left: "auto",
      position: "fixed",
      right: "22px",
      width: "100%",
      height: "100%",
      borderRadius: "20px",
      zIndex: "9999",
    };
  } else if (props.mode === "landing") {
    widgetViewStyle = {
      height: "100%",
      maxWidth: "700px",
    };
  } else if (props.mode === "embed" || props.editMode === "builder") {
    widgetViewStyle = {
      height: "100%",
      width: "100%",
    };
  }

  if (webchatState.theme.deviceMode === "mobile") {
    mobileStyle = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.mobileStyle) || {
      width: "100%",
      height: "100%",
      right: 0,
      bottom: 0,
      borderRadius: 0,
    };
  }
  const webchatWebview = () => (
    <RequestContext.Provider value={webviewRequestContext}>
      <WebviewContainer
        mode={props.mode}
        style={{
          ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.webviewStyle),
          ...mobileStyle,
          ...widgetViewStyle,
        }}
        webview={webchatState.webview}
      />
    </RequestContext.Provider>
  );

  // useEffect(() => {
  //   // Prod mode
  //   saveWebchatState(webchatState);
  //   scrollToBottom({ host });
  // }, [webchatState.themeUpdates]);

  // Only needed for dev/serve mode
  const updateWebchatDevSettings = (settings) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const themeUpdates = normalizeWebchatSettings(settings);
      console.log("updateWebchatDevSettings");
      updateTheme(merge(webchatState.theme, themeUpdates), themeUpdates);
    }, [webchatState.messagesJSON]);
  };

  const DarkenBackground = ({ component }) => {
    return (
      <div>
        {darkBackgroundMenu && (
          <DarkBackgroundMenu
            style={{
              borderRadius: webchatState.theme.style.borderRadius,
            }}
          />
        )}
        {component}
      </div>
    );
  };

  const _renderCustomComponent = () => {
    if (!customComponent) return <></>;
    else return customComponent;
  };
  const WebchatComponent = (
    <WebchatContext.Provider
      value={{
        sendText,
        sendPayload,
        sendInput,
        updateLastMessage,
        openWebview,
        resolveCase,
        webchatState,
        getThemeProperty,
        addMessage,
        toggleWebchat,
        updateMessage,
        updateReplies,
        updateLatestInput,
        toggleCoverComponent,
        updateChatSettings,
        updateUser: updateSessionWithUser,
        updateWebchatDevSettings: updateWebchatDevSettings,
        sendMessage: props.sendMessage,
        closeWebview: closeWebview,
        loadInitialResponse: props.onOpen,
        fetchChatSettings: fetchChatSettings,
      }}
    >
      <Wrapper
        fontFamily={webchatState.fontFamily}
        scrollContainer={scrollContainer}
        toggleCoverComponent={toggleCoverComponent}
        chatSettings={chatSettings}
        mode={props.mode}
        editMode={props.editMode}
        refreshChat={() => {
          setAudioURL(null);
          props.refreshChat();
        }}
      >
        <WIDGETGLOBALSTYLE />
        {
          <>
            <style>
              {`
                  
                  .weconnect_audio_player {
                        display: flex;
                      flex-direction: row;
                      align-items: center;
                      padding: 0 20px;
                      margin-bottom: 23px;
                  }

                  .audio_delete {
                        color: #e34140;
                      width: 43px;
                  }
                  .audioplayer {
                        width: 100%;
                      height: 35px;
                      display: flex;
                      align-items: center;
                      justify-content: space-between;
                      background: #35d188;
                      color: #fff;
                      border-radius: 30px;
                      padding: unset !important;
                      margin: 0px 10px;
                  }
                  .audioplayer.audioplayer2 svg {
                        padding-left: 8px;
                    }
                  .audioplayer>div {
                        width: calc(100% - 85px);
                      height: 15px;
                      display: flex;
                      align-items: center;
                      position: relative;
                  }

                  .audioplayer__time {
                        margin - right: 10px;
                      margin-left: 2px;
                      min-width: 35px;
                      font-family: inherit;
                      display: inline-block;
                      font-size: 13px !important;
                  }
                  .audioplayer2 .audioplayer__slider--played {
                        background: #06d755;
                  }
                  .audioplayer__slider {
                        -webkit - appearance: none;
                      -moz-appearance: none;
                      appearance: none;
                      height: 5px;
                      width: 100%;
                      background: rgba(0,0,0,.1882352941);
                      border-radius: 2.5px;
                      position: absolute;
                      right: 0;
                      z-index: 1;
                  }
              `}
            </style>
            {webchatState.theme.progress_bar === 1 &&
              !webchatState.isCoverComponentOpen && (
                <div style={{ padding: "10px 28px 0 28px" }}>
                  <Slider
                    sx={{
                      height: "3px",
                      padding: "0px",
                      "& .MuiSlider-track": progressStyle,
                      "& .MuiSlider-thumb": { display: "none" },
                      "& .MuiSlider-rail": progressStyle,
                    }}
                    max={chatSettings.total_questions}
                    value={webchatState.questionStep}
                  />
                </div>
              )}
            {/* {!webchatState.isCoverComponentOpen && (
              <StyledDate>Today {formatAMPM()}</StyledDate>
            )} */}
            {webchatMessageList()}
            {webchatState.isPersistentMenuOpen && (
              <DarkenBackground component={persistentMenu()} />
            )}
            {!webchatState.isCoverComponentOpen && audioURL && (
              <div className="weconnect_audio_player">
                <RiDeleteBin7Line
                  className="audio_delete"
                  onClick={() => {
                    setAudioURL(null);
                  }}
                />
                <AudioPlayer audioUrl={URL.createObjectURL(audioURL)} />
                <img
                  alt=""
                  style={{ width: "18px" }}
                  src={send}
                  onClick={handleAudio}
                />
              </div>

              // <audio
              //   src={audioURL}
              //   style={{ maxWidth: "100%" }}
              //   id="myAudio"
              //   controls
              // />
            )}
            {!audioURL && userInputArea()}
            {!webchatState.isCoverComponentOpen &&
              webchatState.theme.weconnect_chat_branding === 1 && (
                <CopyRightContainer
                  target="_blank"
                  href={process.env.REACT_APP_BASE_URL}
                >
                  Powered By{" "}
                  <img
                    alt="WeConnect"
                    style={{
                      marginLeft: 7,
                      maxWidth: "initial",
                      // width: "auto",
                      width: "16px",
                    }}
                    width="16"
                    height="16"
                    src={process.env.REACT_APP_LOGO}
                  />
                </CopyRightContainer>
              )}
            {webchatState.loading && (
              <Backdrop>
                <TypingIndicator />
                <ErrorMessage>uploading...</ErrorMessage>
                {/* <ErrorMessageContainer>
              </ErrorMessageContainer> */}
              </Backdrop>
            )}
            {/* {(!webchatState.online || !webchatState.socket) && (
                <Backdrop>
              <ErrorMessageContainer>
                <ErrorMessage>Connecting...</ErrorMessage>
              </ErrorMessageContainer>
              </Backdrop>
            )} */}
            {!webchatState.isCoverComponentOpen && (
              <Modal
                modal={webchatState.modal}
                updateChatSettings={updateChatSettings}
                toggleWebchat={toggleWebchat}
                botId={props.botId}
                webchatState={webchatState}
              />
            )}

            {webchatState.webview
              ? webchatWebview()
              : props.editMode !== "builder" &&
                webchatState.isCoverComponentOpen &&
                coverComponent()}
            {webchatState.isCustomComponentRendered &&
              customComponent &&
              _renderCustomComponent()}
          </>
        }
      </Wrapper>

      <Htmlcontainerstyle />
    </WebchatContext.Provider>
  );

  // console.log(chatSettings.load);

  return chatSettings.load === true ? WebchatComponent : null;
  // shadow dom need to look later
  // return props.shadowDOM ? (
  //   <StyleSheetManager target={host}>{WebchatComponent}</StyleSheetManager>
  // ) : (
  //   WebchatComponent
  // );
});
