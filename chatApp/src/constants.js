import WeConnectLogo from "./assets/c3po-logo.png";

export const SENDERS = {
  bot: "bot",
  user: "user",
};

export const MODES = {
  LANDING: "landing",
  WIDGET: "widget",
  EMBED: "embed",
  LANDING: "landing",
};

export const COLORS = {
  // http://chir.ag/projects/name-that-color
  APPLE_GREEN: "rgba(58, 156, 53, 1)",
  BLEACHED_CEDAR_PURPLE: "rgba(46, 32, 59, 1)",
  BOTONIC_BLUE: "rgba(0, 153, 255, 1)",
  CACTUS_GREEN: "rgba(96, 115, 94, 1)",
  CONCRETE_WHITE: "rgba(243, 243, 243, 1)",
  CURIOUS_BLUE: "rgba(38, 139, 210, 1)",
  DAINTREE_BLUE: "rgba(0, 43, 53, 1)",
  ERROR_RED: "rgba(255, 43, 94)",
  FRINGY_FLOWER_GREEN: "rgba(198, 231, 192, 1)",
  GRAY: "rgba(129, 129, 129, 1)",
  LIGHT_GRAY: "rgba(209, 209, 209, 1)",
  MID_GRAY: "rgba(105, 105, 115, 1)",
  PIGEON_POST_BLUE_ALPHA_0_5: "rgba(176, 196, 222, 0.5)",
  SCORPION_GRAY: "rgba(87, 87, 87, 1)",
  SEASHELL_WHITE: "rgba(241, 240, 240, 1)",
  SILVER: "rgba(200, 200, 200, 1)",
  SOLID_BLACK_ALPHA_0_2: "rgba(0, 0, 0, 0.2)",
  SOLID_BLACK_ALPHA_0_5: "rgba(0, 0, 0, 0.5)",
  SOLID_BLACK: "rgba(0, 0, 0, 1)",
  SOLID_WHITE_ALPHA_0_2: "rgba(255, 255, 255, 0.2)",
  SOLID_WHITE_ALPHA_0_8: "rgba(255, 255, 255, 0.8)",
  SOLID_WHITE: "rgba(255, 255, 255, 1)",
  TASMAN_GRAY: "rgba(209, 216, 207, 1)",
  TRANSPARENT: "rgba(0, 0, 0, 0)",
  WILD_SAND_WHITE: "rgba(244, 244, 244, 1)",
};

export const WEBCHAT = {
  DEFAULTS: {
    WIDTH: 300,
    HEIGHT: 450,
   
    TITLE: "WeConnect",
    LOGO: WeConnectLogo,
    PLACEHOLDER: "Ask me something...",
    FONT_FAMILY: "'Noto Sans JP', sans-serif",
    PROFILE: process.env.REACT_APP_LOGO,
    AVATAR: process.env.REACT_APP_LOGO,
    WIDGETSTYLE: {
      color: "#fff",
      background: "#00424f",
      opacity:"1",
    },
    BUBBLEANIMATION: {
      enable: "0",
      type: "none",
    },
    PAGESTYLE: {
      color: "#000",
      background: "#fff"
    },
    BORDER_RADIUS_TOP_CORNERS: "6px 6px 0px 0px",
    ELEMENT_WIDTH: 222,
    ELEMENT_MARGIN_RIGHT: 6,
    STORAGE_KEY: "weconnectState",
    HOST_ID: "weconnect_root",
    ID: "botonic-webchat",
    BUTTON_AUTO_DISABLE: false,
    BUTTON_DISABLED_STYLE: {
      opacity: 0.5,
      cursor: "auto",
      pointerEvents: "none",
    },
  },
  SELECTORS: {
    SCROLLABLE_CONTENT: "#botonic-scrollable-content",
    SIMPLEBAR_CONTENT: ".weconnect-simplebar-content",
    SIMPLEBAR_WRAPPER: ".weconnect-simplebar-content-wrapper",
  },
  CUSTOM_PROPERTIES: {
    // weconnect
    mode: "mode",
    DEVICEMODE: "deviceMode",
    widgetStyle: "widgetStyle",
    backSkipStyle: "backSkipStyle",
    responseStyle: "responseStyle",
    messageBubble: "messageBubble",
    progressStyle: "progressStyle",
    headerStyle: "header.style",
    headerSameChat: "header.headerSameChat",
    buttonStyle: "buttonStyle",
    avatarScale: "avatarScale",
    profileScale: "profileScale",
    coverScale: "coverScale",
    pageStyle: "pageStyle",
    fontStyle: "fontStyle",
    chatStyle: "chatStyle",
    profile: "profile",
    welcomeImg: "welcomeImg",
    avatar: "avatar",
    typing: "typing",
    typingColor: "typingColor",
    bubbleAnimation: "bubbleAnimation",
    delay: "delay",
    // General
    enableAnimations: "animations.enable",
    markdownStyle: "markdownStyle",
    scrollbar: "scrollbar",
    // Mobile
    mobileBreakpoint: "mobileBreakpoint",
    mobileStyle: "mobileStyle",
    // Webviews
    webviewHeaderStyle: "webview.header.style",
    webviewStyle: "webview.style",
    // Brand
    brandColor: "brand.color",
    brandImage: "brand.image",
    // Header
    customHeader: "header.custom",
    headerImage: "header.image",
    // headerStyle: "header.style",
    headerSubtitle: "header.subtitle",
    headerTitle: "header.title",
    enableHeaders: "header.enable",
    onlineStatus: "header.online",
    offlineStatus: "header.offline",
    // Bot Message
    botMessageBackground: "message.bot.style.background",
    botMessageBlobTick: "message.bot.blobTick",
    botMessageBlobTickStyle: "message.bot.blobTickStyle",
    botMessageBlobWidth: "message.bot.blobWidth",
    botMessageBorderColor: "message.bot.style.borderColor",
    botMessageImage: "message.bot.image",
    botMessageImageStyle: "message.bot.imageStyle",
    botMessageStyle: "message.bot.style",
    // User Message
    customMessageTypes: "message.customTypes",
    messageStyle: "message.style",
    userMessageBackground: "message.user.style.background",
    userMessageBlobTick: "message.user.blobTick",
    userMessageBlobTickStyle: "message.user.blobTickStyle",
    userMessageBorderColor: "message.user.style.borderColor",
    userMessageStyle: "message.user.style",
    // Timestamps
    enableMessageTimestamps: "message.timestamps.enable",
    messageTimestampsFormat: "message.timestamps.format",
    messageTimestampsStyle: "message.timestamps.style",
    // Intro
    customIntro: "intro.custom",
    introImage: "intro.image",
    introStyle: "intro.style",
    // Buttons
    // buttonHoverBackground: "button.hoverBackground",
    // buttonHoverTextColor: "button.hoverTextColor",
    // buttonMessageType: "button.messageType",
    // buttonStyle: "button.style",
    // buttonDisabledStyle: "button.disabledstyle",
    // buttonAutoDisable: "button.autodisable",
    // buttonStyleBackground: "button.style.background",
    // buttonStyleColor: "button.style.color",
    customButton: "button.custom",
    // Replies
    alignReplies: "replies.align",
    customReply: "reply.custom",
    replyStyle: "reply.style",
    wrapReplies: "replies.wrap",
    // TriggerButton
    customTrigger: "triggerButton.custom",
    triggerButtonImage: "triggerButton.image",
    triggerButtonStyle: "triggerButton.style",
    // User Input
    blockInputs: "userInput.blockInputs",
    documentDownload: "documentDownload",
    customMenuButton: "userInput.menuButton.custom",
    customPersistentMenu: "userInput.menu.custom",
    customSendButton: "userInput.sendButton.custom",
    darkBackgroundMenu: "userInput.menu.darkBackground",
    enableAttachments: "userInput.attachments.enable",
    enableEmojiPicker: "userInput.emojiPicker.enable",
    enableSendButton: "userInput.sendButton.enable",
    enableUserInput: "userInput.enable",
    persistentMenu: "userInput.persistentMenu",
    textPlaceholder: "userInput.box.placeholder",
    userInputBoxStyle: "userInput.box.style",
    userInputStyle: "userInput.style",
    // Cover Component
    coverComponent: "coverComponent.component",
    coverComponentProps: "coverComponent.props",
    // Carousel
    customCarouselLeftArrow: "carousel.arrow.left",
    customCarouselRightArrow: "carousel.arrow.right",
    enableCarouselArrows: "carousel.enableArrows",
  },
};
export const GDPR_COOKIE = "weconnect_gdpr";
// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
export const MIME_WHITELIST = {
  audio: ["audio/mpeg", "audio/mp3", "audio/wav", "audio/ogg", "audio/webm"],
  document: [".pdf", ".doc", ".docx", ".xls", ".xlsx", ".ppt", ".pptx", ".rtf", ".odt", ".odp", ".ods"],
  image: ["image/jpeg", "image/png", "image/gif", "image/vnd.microsoft.icon", "application/vnd.oasis.opendocument.spreadsheet"],
  video: [".mp4", ".mov", ".3gp", ".avi"],
};

export const MAX_ALLOWED_SIZE_MB = 50;

export const ROLES = {
  ATTACHMENT_ICON: "attachment-icon",
  EMOJI_PICKER_ICON: "emoji-picker-icon",
  EMOJI_PICKER: "emoji-picker",
  HEADER: "header",
  MESSAGE_LIST: "message-list",
  PERSISTENT_MENU_ICON: "persistent-menu-icon",
  PERSISTENT_MENU: "persistent-menu",
  SEND_BUTTON_ICON: "send-button-icon",
  WEBCHAT: "webchat",
  TRIGGER_BUTTON: "trigger-button",
  TYPING_INDICATOR: "typing-indicator",
  TEXT_BOX: "textbox",
  WEBVIEW: "webview",
  WEBVIEW_HEADER: "webview-header",
  MESSAGE: "message",
  IMAGE_MESSAGE: "image-message",
  AUDIO_MESSAGE: "audio-message",
  VIDEO_MESSAGE: "video-message",
  DOCUMENT_MESSAGE: "document-message",
  RAW_MESSAGE: "raw-message",
};

export const COMPONENT_TYPE = {
  TEXT: "Text",
  BUTTON: "Button",
  REPLY: "Reply",
  CAROUSEL: "Carousel",
};
