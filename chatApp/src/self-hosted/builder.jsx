import { INPUT, params2queryString } from "@botonic/core";
import { motion } from "framer-motion";
import merge from "lodash.merge";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import Textarea from "react-textarea-autosize";
import styled, { StyleSheetManager } from "styled-components";
import { useAsyncEffect } from "use-async-effect";
import { v4 as uuidv4 } from "uuid";
import { useRecorder } from "./useRecorder";
// import "../assets/css/widget.scss";
import IoSendOutline from "../assets/react-icons/IoSendOutline.js";
import IoSend from "../assets/react-icons/IoSend";
import BsMic from "../assets/react-icons/BsMic";
import BsFillTrashFill from "../assets/react-icons/BsFillTrashFill";
// import { Audio, Document, Image, Video } from '../components'
// import { Audio } from '../components/audio';
// import { Document } from '../components/document';
import send1 from "../assets/send1.png";
import send from "../assets/send.png";
import user from "../assets/user.png";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import doc from "../assets/botonic/file.svg";
import image from "../assets/botonic/image (1).svg";
import map from "../assets/botonic/pin.png";
import headphone from "../assets/botonic/headphones (1).svg";
import user1 from "../assets/botonic/user (1).svg";
import {
  Text,
  Image,
  GifImage,
  Audio,
  Document,
  Video,
  Location,
} from "../actions/components";
import AudioPlayer from "../actions/components/audioPlayer";
import IconButton from "@mui/material/IconButton";
// import { Handoff } from '../components/handoff'
import { normalizeWebchatSettings } from "../components/webchat-settings";
import {
  COLORS,
  MAX_ALLOWED_SIZE_MB,
  ROLES,
  SENDERS,
  WEBCHAT,
} from "./constants";
import { RequestContext, WebchatContext } from "./contexts";
import MdClose from "../assets/react-icons/MdClose";
import MdOutlineClose from "../assets/react-icons/MdOutlineClose";
import {
  getFullMimeWhitelist,
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

// import { msgToBotonic } from '../msg-to-botonic'
import { msgToBotonic } from "../actions/components/msg-to-botonic";
import { scrollToBottom } from "../util/dom";
import { isDev, resolveImage } from "../util/environment";
import { ConditionalWrapper } from "../util/react";
import { deserializeRegex, stringifyWithRegexs } from "../util/regexs";
import {
  _getThemeProperty,
  getServerErrorMessage,
  initSession,
  shouldKeepSessionOnReload,
} from "../util/webchat";
import smile from "../assets/smile (2).svg";
import gif_picker from "../assets/Group 19616.svg";
import { getProperty } from "../util/objects";
// import { Attachment } from "../webchat/components/attachment";
import { Attachment } from "./attachment";
import {
  EmojiPicker,
  OpenedEmojiPicker,
} from "../webchat/components/emoji-picker";
import {
  OpenedPersistentMenu,
  PersistentMenu,
} from "../webchat/components/persistent-menu";
import { SendButton } from "../webchat/components/send-button";
import { TypingIndicator } from "../webchat/components/typing-indicator";
import { DeviceAdapter } from "../webchat/devices/device-adapter";
// import { StyledWebchatHeader } from '../webchat/header'
import { StyledWebchatHeader } from "./header";
import {
  useComponentWillMount,
  usePrevious,
  useTyping,
  useWebchat,
} from "./hooks";
import { WebchatMessageList } from "../webchat/message-list";
// import { WebchatReplies } from '../webchat/replies'
import { useStorageState } from "../webchat/use-storage-state-hook";
// import { WebviewContainer } from "../webchat/webview";
import { WebviewContainer } from "./webview";
import { WebchatReplies } from "../actions/components/WebchatReplies";

import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialIcon from "@mui/material/SpeedDialIcon";
import SpeedDialAction from "@mui/material/SpeedDialAction";
// import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
// import SaveIcon from '@mui/icons-material/Save';
// import PrintIcon from '@mui/icons-material/Print';
// import ShareIcon from '@mui/icons-material/Share';
import msg_img from "../assets/message-square.svg";
import gif_img from "../assets/Group 20337.png";
import MdAccountCircle from "../assets/react-icons/MdAccountCircle";
import Picker from "./EmojiPicker";
import ImAttachment from "../assets/react-icons/ImAttachment";

const isGif = (msg) => isOfType(msg.type, "gif");
export const getParsedAction = (botonicAction) => {
  const splittedAction = botonicAction.split("create_case:");
  if (splittedAction.length <= 1) return undefined;
  return JSON.parse(splittedAction[1]);
};

const MessageContainer = styled.div`
  padding-left: 50px;
`;

const StyledWebchat = styled.div`
  width: 100%;
  height: 100%;
  max-width: 700px;
  margin: auto;
  overflow: "hidden";
  fontfamily: '"Comic Sans MS", cursive, sans-serif';
  z-index: 9999977;
  background-color: ${COLORS.SOLID_WHITE};
  display: flex;
  flex-direction: column;
`;

const StyledTriggerButton = styled.div`
  cursor: pointer;
  z-index: 111;
  position: fixed;
  background: #fff;
  color: #00424f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 60px;
  height: 60px;
  bottom: 20px;
  right: 10px;
  padding: 8px;
  font-size: 25px;
  box-shadow: 0px 6px 42px #2425330f;
`;

const StyledTriggerButtonClose = styled.div`
  cursor: pointer;
  z-index: 111;
  position: fixed;
  background: #00424f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 60px;
  height: 60px;
  bottom: 20px;
  right: 10px;
  padding: 8px;
  box-shadow: 0px 6px 42px #2425330f;
`;

const StyledTriggerBadge = styled.div`
  position: fixed;
  border: 3px solid #f2f3f5;
  color: #fff;
  background: red;
  font-size: 12px;
  border-radius: 50%;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 3px;
  height: 3px;
  bottom: 60px;
  right: 2px;
  padding: 8px;
`;
const StyledDate = styled.div`
  text-align: center;
  color: #787878;
  font-family: inherit;
  font-size: 13px;
  margin: 15px 0 5px 0 !important;
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

const TriggerImage = styled.img`
  max-width: 100%;
  max-height: 100%;
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
  top: 10px;
  font-size: 14px;
  line-height: 20px;
  padding: 4px 11px;
  display: flex;
  background-color: ${COLORS.ERROR_RED};
  color: ${COLORS.CONCRETE_WHITE};
  border-radius: 5px;
  align-items: center;
  justify-content: center;
  font-family: ${WEBCHAT.DEFAULTS.FONT_FAMILY};
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
const CopyRightContainer = styled.div`
  font-size: 12px;
  display: flex;
  padding-bottom: 20px;
  font-family: inherit;
  justify-content: center;
  align-items: center;
`;

const actions = [
  { icon: <img src={gif_picker} />, name: "GifPicker", type: "gif" },
  { icon: <img src={smile} />, name: "EmojiPicker", type: "emoji" },
];

// eslint-disable-next-line complexity
export const Webchat = forwardRef((props, ref) => {
  const {
    webchatState,
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
    doRenderCustomComponent,
    setError,
    setOnline,
    clearMessages,
    openWebviewT,
    closeWebviewT,
    updateLastMessageDate,
    setCurrentAttachment,
    // eslint-disable-next-line react-hooks/rules-of-hooks
  } = props.webchatHooks || useWebchat();

  const firstUpdate = useRef(true);
  let [audioURL, isRecording, startRecording, stopRecording, setAudioURL] =
    useRecorder();
  const isOnline = () => webchatState.online;
  const currentDateString = () => new Date().toISOString();
  const theme = merge(webchatState.theme, props.theme);
  const { initialSession, initialDevSettings, onStateChange } = props;
  // const getThemeProperty = _getThemeProperty(theme)
  const getThemeProperty = (property, defaultValue = undefined) => {
    const value = getProperty(theme, property);
    if (value !== undefined) return value;
    return defaultValue;
  };

  const deviceMode = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.DEVICEMODE,
    'desktop'
  );

  const [customComponent, setCustomComponent] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [proactiveOpen, setProactiveOpen] = useState(true);
  const [proactiveCardOpen, setProactiveCardOpen] = useState(true);
  const [unread, setUnreadCount] = useState(2);
  const [giphyPickerOpen, setGiphyPickerOpen] = useState(false);
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
            lastRoutePath: webchatState.lastRoutePath,
            devSettings: webchatState.devSettings,
            lastMessageUpdate: webchatState.lastMessageUpdate,
            themeUpdates: webchatState.themeUpdates,
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
    setCurrentAttachment({
      fileName: event.target.files[0].name,
      file: event.target.files[0], // TODO: Attach more files?
      attachmentType: getMediaType(event.target.files[0].type),
    });
  };

  useEffect(() => {
    if (webchatState.currentAttachment)
      sendAttachment(webchatState.currentAttachment);
  }, [webchatState.currentAttachment]);

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

  // Load initial state from storage
  useEffect(() => {
    let {
      messages,
      session,
      lastRoutePath,
      devSettings,
      lastMessageUpdate,
      themeUpdates,
    } = botonicState || {};
    session = initSession(session);
    updateSession(session);
    if (shouldKeepSessionOnReload({ initialDevSettings, devSettings })) {
      if (messages) {
        messages.forEach((m) => {
          addMessage(m);
          const newComponent = msgToBotonic(
            { ...m, delay: 0, typing: 0 },
            (props.theme.message && props.theme.message.customTypes) ||
            props.theme.customMessageTypes
          );
          if (newComponent) addMessageComponent(newComponent);
        });
      }
      if (initialSession) updateSession(merge(initialSession, session));
      if (lastRoutePath) updateLastRoutePath(lastRoutePath);
    } else updateSession(merge(initialSession, session));
    if (devSettings) updateDevSettings(devSettings);
    else if (initialDevSettings) updateDevSettings(initialDevSettings);
    if (lastMessageUpdate) updateLastMessageDate(lastMessageUpdate);
    if (themeUpdates !== undefined)
      updateTheme(merge(props.theme, themeUpdates), themeUpdates);
    if (props.onInit) setTimeout(() => props.onInit(), 100);
  }, []);

  useEffect(() => {
    if (!webchatState.isWebchatOpen) return;
    deviceAdapter.init(host);
    scrollToBottom({ behavior: "auto", host });
  }, [webchatState.isWebchatOpen]);

  useEffect(() => {
    if (onStateChange && typeof onStateChange === "function")
      onStateChange(webchatState);
    saveWebchatState(webchatState);
  }, [
    webchatState.messagesJSON,
    webchatState.session,
    webchatState.lastRoutePath,
    webchatState.devSettings,
    webchatState.lastMessageUpdate,
  ]);

  useAsyncEffect(async () => {
    if (!webchatState.online) {
      setError({
        message: getServerErrorMessage(props.server),
      });
    } else {
      if (!firstUpdate.current) {
        setError(undefined);
      }
    }
  }, [webchatState.online]);

  useTyping({ webchatState, updateTyping, updateMessage, host });

  useEffect(() => {
    updateTheme(merge(props.theme, theme, webchatState.themeUpdates));
  }, [props.theme, webchatState.themeUpdates]);

  const openWebview = (webviewComponent, params) =>
    updateWebview(webviewComponent, params);

  const handleSelectedEmoji = (event, emojiObject) => {
    textArea.current.value += emojiObject.emoji;
    textArea.current.focus();
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
    toggleEmojiPicker(!webchatState.isEmojiPickerOpen);
  };

  const handleGiphyPick = () => {
    setGiphyPickerOpen(!giphyPickerOpen);
  };

  const handleSpeedDialClick = (action) => {
    if (action === "emoji") {
      setGiphyPickerOpen(false);
      handleEmojiClick();
    } else {
      toggleEmojiPicker(false);
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

  const getCoverComponent = () => {
    return getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.coverComponent,
      props.coverComponent &&
      (props.coverComponent.component || props.coverComponent)
    );
  };
  const CoverComponent = getCoverComponent();

  const closeCoverComponent = () => {
    toggleCoverComponent(false);
  };

  const openCoverComponent = () => {
    toggleCoverComponent(true);
  };

  useEffect(() => {
    if (!CoverComponent) return;
    if (
      !botonicState ||
      (botonicState.messages && botonicState.messages.length == 0)
    )
      toggleCoverComponent(true);
  }, []);

  const coverComponent = () => {
    const coverComponentProps = getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.coverComponentProps,
      props.coverComponent && props.coverComponent.props
    );

    if (CoverComponent && webchatState.isCoverComponentOpen)
      return (
        <CoverComponent
          closeComponent={closeCoverComponent}
          {...coverComponentProps}
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
      const lat = input.data ? input.data.location.lat : input.latitude;
      const long = input.data ? input.data.location.long : input.longitude;
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
    if (isMedia(input)) input.data = await readDataURL(input.data);
    updateLatestInput(input);
    updateReplies(false);
    isOnline() && updateLastMessageDate(currentDateString());
    togglePersistentMenu(false);
    toggleEmojiPicker(false);
  };

  const sendInput = async (input) => {
    await sendWaitInput(input);
    // sendUserInput should be worked after input is sent, for that sendWaitInput is made
    sendUserInput(input);
  };

  /* This is the public API this component exposes to its parents
  https://stackoverflow.com/questions/37949981/call-child-method-from-parent
  */
  const updateWebchatSettings = (settings) => {
    const themeUpdates = normalizeWebchatSettings(settings);
    updateTheme(merge(webchatState.theme, themeUpdates), themeUpdates);
  };
  const setHandoff = (handoff) => {
    //   if (handoff) {
    //     updateWebchatSettings({
    //       userInput: {
    //         enable: false
    //       }
    //     });
    //   } else {
    //     updateWebchatSettings({
    //       userInput: {
    //         enable: false
    //       }
    //     });
    //   }
    if (handoff)
      updateSession({
        ...webchatState.session,
        _botonic_action: `create_case:""`,
      });
    else updateSession({ ...webchatState.session, _botonic_action: "" });
  };

  const updateSessionWithUser = (userToUpdate) =>
    updateSession(merge(webchatState.session, { user: userToUpdate }));

  const weConnectUpdateSession = (sessionData) =>
    updateSession(merge(webchatState.session, sessionData));

  useImperativeHandle(ref, () => ({
    addBotResponse: async ({ response, session, lastRoutePath }) => {
      updateTyping(false);
      if (lastRoutePath !== webchatState.lastRoutePath) {
        if (props.onChangeRoute)
          await props.onChangeRoute(webchatState.lastRoutePath, lastRoutePath);
      }
      if (Array.isArray(response))
        response.map((r) => {
          // Todo: provide call method to component here to support onChange Route
          // r.alert();
          return addMessageComponent(r);
        });
      else if (response) addMessageComponent(response);
      if (session) {
        updateSession(merge(session, { user: webchatState.session.user }));
        const action = session._botonic_action || "";
        const handoff = action.startsWith("create_case");
        // if (handoff && isDev) addMessageComponent(<Handoff />)
        updateHandoff(handoff);
      }
      if (lastRoutePath) updateLastRoutePath(lastRoutePath);
      updateLastMessageDate(currentDateString());
      if (props.onBotInput) {
        props.onBotInput(response, session, lastRoutePath);
        // updateReplies(false)
      }
    },
    resolveCase: () => resolveCase(),
    getwebchatState: () => webchatState.session,
    updateReplies: (args) => {
      updateLastMessageDate(currentDateString());
      updateReplies(args);
    },
    setTyping: (typing) => updateTyping(typing),
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
    updateWebchatSettings: (settings) => updateWebchatSettings(settings),
  }));

  const resolveCase = () => {
    updateHandoff(false);
    updateSession({ ...webchatState.session, _botonic_action: null });
  };

  const prevSession = usePrevious(webchatState.session);
  useEffect(() => {
    // Resume conversation after handoff
    if (
      prevSession &&
      prevSession._botonic_action &&
      !webchatState.session._botonic_action
    ) {
      const action = getParsedAction(prevSession._botonic_action);
      if (action && action.on_finish) sendPayload(action.on_finish);
    }
  }, [webchatState.session._botonic_action]);

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

  const sendAttachment = async (attachment) => {
    if (attachment.file) {
      const attachmentType = getMediaType(attachment.file.type);
      if (!attachmentType) return;
      const input = {
        type: attachmentType,
        data: attachment.file,
      };
      await sendInput(input);
      setCurrentAttachment(undefined);
    }
  };

  const sendTextAreaText = async () => {
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
    if (webchatState.isWebchatOpen && props.onOpen) props.onOpen();
    if (!webchatState.isWebchatOpen && props.onClose && !firstUpdate.current) {
      props.onClose();
      toggleEmojiPicker(false);
      togglePersistentMenu(false);
    }
  }, [webchatState.isWebchatOpen]);

  const textArea = useRef();

  const getTriggerImage = () => {
    const triggerImage = getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.triggerButtonImage,
      null
    );
    if (triggerImage === null) {
      webchatState.theme.triggerButtonImage = WEBCHAT.DEFAULTS.LOGO;
      return null;
    }
    return triggerImage;
  };

  const triggerButtonStyle = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.triggerButtonStyle
  );

  const CustomTriggerButton = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.customTrigger,
    undefined
  );

  const triggerButton = () => {
    return (
      <>
        {webchatState.isWebchatOpen ? (
          <StyledTriggerButton role={ROLES.TRIGGER_BUTTON}>
            <MdOutlineClose />
          </StyledTriggerButton>
        ) : (
          <StyledTriggerButtonClose role={ROLES.TRIGGER_BUTTON}>
            <img style={{ width: "20px" }} src={msg_img} />
            <StyledTriggerBadge>2</StyledTriggerBadge>
          </StyledTriggerButtonClose>
        )}
      </>
    );
  };

  const webchatMessageList = () => (
    <WebchatMessageList
      style={{
        flex: 1,
        display: webchatState.isCoverComponentOpen ? "none" : "",
      }}
    >
      <MessageContainer>
        {webchatState.replies &&
          Object.keys(webchatState.replies).length > 0 &&
          webchatReplies()}
      </MessageContainer>
      <MessageContainer>
        {webchatState.typing && <TypingIndicator />}
      </MessageContainer>
    </WebchatMessageList>
  );
  const webchatReplies = () => (
    <WebchatReplies style={{ width: "100%" }} replies={webchatState.replies} />
  );

  const isUserInputEnabled = () => {
    const isUserInputEnabled = getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.enableUserInput,
      props.enableUserInput !== undefined ? props.enableUserInput : true
    );
    return isUserInputEnabled && !webchatState.isCoverComponentOpen;
  };

  const userInputEnabled = isUserInputEnabled();
  const emojiPickerEnabled = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.enableEmojiPicker,
    props.enableEmojiPicker
  );
  const attachmentsEnabled = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.enableAttachments,
    props.enableAttachments
  );
  const sendButtonEnabled = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.enableSendButton,
    true
  );
  const CustomSendButton = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.customSendButton,
    undefined
  );
  const CustomMenuButton = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.customMenuButton,
    undefined
  );

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
    return (
      userInputEnabled && (
        <UserInputContainer>
          {persistentMenuOptions && (
            // <FeaturesWrapper>
            //   <ConditionalAnimation>
            //     <div onClick={handleMenu}>
            //       {CustomMenuButton ? <CustomMenuButton /> : <PersistentMenu />}
            //     </div>
            //   </ConditionalAnimation>
            // </FeaturesWrapper>
            <>
              <Box
                sx={{ height: 320, transform: "translateZ(0px)", flexGrow: 1 }}
                className="speed-dial-block"
              >
                <SpeedDial
                  ariaLabel="SpeedDial controlled open example"
                  sx={{ position: "absolute", bottom: 16, right: 16 }}
                  icon={<SpeedDialIcon />}
                  onClick={handleClick}
                  open={open}
                  className={open ? "opened" : "closed"}
                >
                  {actions.map((action) => (
                    <SpeedDialAction
                      key={action.name}
                      icon={action.icon}
                      tooltipOpen
                      onClick={(e, elem) => {
                        handleSpeedDialClick(action.type);
                        e.stopPropagation();
                      }}
                    />
                  ))}
                </SpeedDial>
              </Box>
              {giphyPickerOpen && (
                <Picker
                  apiKey={"LgyFqDpSMY4BanrZVAWBdGeEQ2ppu4yR"}
                  onSelected={(item) => {
                    const src = item.preview_gif.url.split("?")[0];
                    sendInput({
                      type: "gif",
                      from: "user",
                      src: src,
                    });
                    setGiphyPickerOpen(false);
                    updateReplies(false);
                    setOpen(false);
                  }}
                />
              )}
              {webchatState.isEmojiPickerOpen && (
                <OpenedEmojiPicker
                  className="widget_emoji_picker_popup"
                  height={webchatState.theme.style.height}
                  onEmojiClick={handleSelectedEmoji}
                  onClick={handleEmojiClick}
                />
              )}
            </>
          )}
          <div className="bottom-input-filed-block">
            <TextAreaContainer>
              {/**
               * @design team put mike icon here, I will add functionality
               */}
              <button
                className={
                  isRecording
                    ? "recording_mike mic-btn"
                    : "weconnect_mike mic-btn"
                }
                onMouseDown={startRecording}
                onMouseUp={stopRecording}
              >
                <BsMic className="mic-icon" />
              </button>
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
                  padding: 10,
                  paddingLeft: persistentMenuOptions ? 0 : 10,
                  fontFamily: "inherit",
                  ...getThemeProperty(
                    WEBCHAT.CUSTOM_PROPERTIES.userInputBoxStyle
                  ),
                }}
              />
            </TextAreaContainer>
            <FeaturesWrapper>
              {/* {emojiPickerEnabled && (
                <EmojiPicker onClick={handleEmojiClick} />
    
              )} */}
              {/* {attachmentsEnabled && (
                // <ConditionalAnimation>
                <Attachment
                  onChange={handleAttachment}
                  accept={getFullMimeWhitelist().join(",")}
                />
                // </ConditionalAnimation>
              )} */}
              <IconButton
                className="reply_icon_btn"
                onClick={handleClickAttach}
              >
                <ImAttachment />
              </IconButton>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={openAttach}
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
                      <div className="attachment_content_block">
                        <div className="attachment_inner">
                          <img src={doc} />
                        </div>
                        <p>Document</p>
                      </div>
                    </Grid>
                    <Grid item xs={4}>
                      <div className="attachment_content_block">
                        <div className="attachment_inner">
                          <img src={image} />
                        </div>
                        <p>Image</p>
                      </div>
                    </Grid>
                    <Grid item xs={4}>
                      <div className="attachment_content_block">
                        <div className="attachment_inner">
                          <img src={map} style={{ width: "15px" }} />
                        </div>
                        <p>Location</p>
                      </div>
                    </Grid>
                    <Grid item xs={4}>
                      <div className="attachment_content_block">
                        <div className="attachment_inner">
                          <img src={headphone} />
                        </div>
                        <p>Audio</p>
                      </div>
                    </Grid>
                    <Grid item xs={4}>
                      <div className="attachment_content_block">
                        <div className="attachment_inner">
                          <img src={user1} />
                        </div>
                        <p>Contact</p>
                      </div>
                    </Grid>
                  </Grid>
                </div>
              </Menu>
              <div onClick={sendTextAreaText}>
                {chatText.trim() == "" ? (
                  <IconButton
                    className="reply_icon_btn"
                    style={{ marginRight: "5px" }}
                  >
                    <img src={send1} />
                  </IconButton>
                ) : (
                  <IconButton
                    className="reply_icon_btn"
                    style={{ marginRight: "5px" }}
                  >
                    <img src={send} />
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

  const webchatWebview = () => (
    <RequestContext.Provider value={webviewRequestContext}>
      <WebviewContainer
        style={{
          ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.webviewStyle),
          ...mobileStyle,
        }}
        webview={webchatState.webview}
      />
    </RequestContext.Provider>
  );
  let mobileStyle = {};
  if (deviceMode==="mobile") {
    mobileStyle = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.mobileStyle) || {
      width: "100%",
      height: "100%",
      right: 0,
      bottom: 0,
      borderRadius: 0,
    };
  }

  useEffect(() => {
    // Prod mode
    saveWebchatState(webchatState);
    scrollToBottom({ host });
  }, [webchatState.themeUpdates]);

  // Only needed for dev/serve mode
  const updateWebchatDevSettings = (settings) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const themeUpdates = normalizeWebchatSettings(settings);
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
        sendAttachment,
        sendPayload,
        sendInput,
        openWebview,
        resolveCase,
        webchatState,
        getThemeProperty,
        addMessage,
        toggleWebchat,
        updateMessage,
        updateReplies,
        updateLatestInput,
        updateUser: updateSessionWithUser,
        updateWebchatDevSettings: updateWebchatDevSettings,
      }}
    >
      {/* {!webchatState.isWebchatOpen && ( */}

      {webchatState.isWebchatOpen && (
        <StyledWebchat
          // TODO: Distinguis between multiple instances of webchat, e.g. `${uniqueId}-botonic-webchat`
          role={ROLES.WEBCHAT}
          id={WEBCHAT.DEFAULTS.ID}
          width={webchatState.width}
          height={webchatState.height}
          style={{
            ...webchatState.theme.style,
            ...mobileStyle,
          }}
        >
          {/* <StyledWebchatHeader
            refreshChat={() => {
              props.refreshChat();
            }}
            onCloseClick={() => {
              toggleWebchat(false)
            }}
          /> */}
          {/* {!webchatState.isCoverComponentOpen && (
            <StyledWebchatHeader
              refreshChat={() => {
                setAudioURL(null);
                props.refreshChat();
              }}
              onCloseClick={() => {
                toggleWebchat(false);
              }}
              openCoverComponent={() => openCoverComponent()}
            />
          )} */}
          {webchatState.error.message && (
            <ErrorMessageContainer>
              <ErrorMessage>{webchatState.error.message}</ErrorMessage>
            </ErrorMessageContainer>
          )}
          {!webchatState.isCoverComponentOpen && (
            <StyledDate>Today 10:51 PM</StyledDate>
          )}
          {webchatMessageList()}
          {webchatState.isPersistentMenuOpen && (
            <DarkenBackground component={persistentMenu()} />
          )}
          {!webchatState.isCoverComponentOpen && audioURL && (
            <div className="weconnect_audio_player">
              <BsFillTrashFill
                className="delete"
                onClick={() => {
                  setAudioURL(null);
                }}
              />
              <AudioPlayer audioUrl={audioURL} />
              <img
                src={send}
                onClick={() => {
                  if (audioURL) {
                    sendInput({
                      type: "audio",
                      from: "user",
                      src: audioURL,
                    });
                    updateReplies(false);
                    setAudioURL(null);
                  }
                }}
              />
            </div>

            // <audio
            //   src={audioURL}
            //   style={{ maxWidth: "100%" }}
            //   id="myAudio"
            //   controls
            // />
          )}
          {!webchatState.handoff && !audioURL && userInputArea()}
          {!webchatState.isCoverComponentOpen && (
            <CopyRightContainer>
              Powered By{" "}
              <img
                style={{ marginLeft: 7 }}
                width="16"
                height="16"
                src={process.env.REACT_APP_LOGO}
              />
            </CopyRightContainer>
          )}
          {webchatState.webview && webchatWebview()}
          {webchatState.isCoverComponentOpen && coverComponent()}
          {webchatState.isCustomComponentRendered &&
            customComponent &&
            _renderCustomComponent()}
        </StyledWebchat>
      )}
    </WebchatContext.Provider>
  );
  return props.shadowDOM ? (
    <StyleSheetManager target={host}>{WebchatComponent}</StyleSheetManager>
  ) : (
    WebchatComponent
  );
});
