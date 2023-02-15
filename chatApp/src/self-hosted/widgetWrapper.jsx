// import { motion } from "framer-motion";
import merge from "lodash.merge";
import React, { forwardRef, useContext, useEffect, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { useAsyncEffect } from "use-async-effect";
import { WebchatContext } from "../contexts";
import { COLORS, ROLES, WEBCHAT } from "../constants";
import MdClose from "../assets/react-icons/MdClose";
import MdOutlineClose from "../assets/react-icons/MdOutlineClose";

// import { msgToBotonic } from '../msg-to-botonic'
import { scrollToBottom } from "../util/dom";
import { getProperty } from "../util/objects";
// import { Attachment } from "../webchat/components/attachment";
// import { DeviceAdapter } from "../webchat/devices/device-adapter";
// import { StyledWebchatHeader } from '../webchat/header'
import { StyledWebchatHeader } from "./header";
// import { WebchatReplies } from '../webchat/replies'
// import { WebviewContainer } from "../webchat/webview";
import { GenIcon } from "react-icons/lib";
// import { TriggerIframe } from "./triggerIframe";
// import { ProactiveIframe } from "./proactiveIframe";
import { WidgetIframe } from "./widgetIframe";

const ProactiveContainer = styled.div`
  display: flex;
  flex-flow: column;
  max-height: ${(props) =>
    props.position === "center" ? "calc(50% - 25px)" : "calc(100% - 130px)"};
  overflow-y: ${(props) => (props.mobile ? "scroll" : "hidden")};
`;

const MsgImg = function MdOutlineClose(props) {
  return GenIcon({
    tag: "svg",
    attr: { viewBox: "0 0 14.806 14.8" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M13.806 9.533a1.423 1.423 0 01-1.423 1.422H3.846L1 13.8V2.422A1.423 1.423 0 012.423 1h9.96a1.423 1.423 0 011.423 1.422z",
        },
      },
    ],
  })(props);
};
// window.addEventListener("resize", () => {
//   document
//     .querySelector(":root")
//     .style.setProperty("--vw", window.innerWidth / 100 + "px");
// });

// window.addEventListener("load", () => {
//   document
//     .querySelector(":root")
//     .style.setProperty("--vw", window.innerWidth / 100 + "px");
// });

// window.addEventListener("resize", () => {
//   document
//     .querySelector(":root")
//     .style.setProperty("--vh", window.innerHeight / 100 + "px");
// });

// window.addEventListener("load", () => {
//   document
//     .querySelector(":root")
//     .style.setProperty("--vh", window.innerHeight / 100 + "px");
// });

export const getParsedAction = (botonicAction) => {
  const splittedAction = botonicAction.split("create_case:");
  if (splittedAction.length <= 1) return undefined;
  return JSON.parse(splittedAction[1]);
};

const showhide = keyframes`
  from {
    transform: scale(0);
    opacity: 0;
  }
`;

const StyledWebchat = styled.div`
  margin: auto;
  boxshadow: "0 0 50px rgba(0,0,255,.30)";
  overflow: "hidden";
  fontfamily: '"Comic Sans MS", cursive, sans-serif';

  z-index: 111;
  background-color: ${COLORS.WHITE};
  box-shadow: ${COLORS.SOLID_BLACK_ALPHA_0_2} 0px 0px 12px;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;

  ${(props) =>
    props.mobile
      ? css`
          width: 100% !important;
          height: 100% !important;
          max-height: 100%;
          border-radius: 0px !important;
          right: 0px !important;
          bottom: 0px !important;
          max-width: 100% !important;
          left: 0px !important;
          top: 0 !important;
          margin-bottom: 0px !important;
        `
      : ""}

  ${(props) => (props.tablet ? css`` : "")}
`;

const pulse_tada = keyframes`
  0%, 100% {
    -webkit-transform: scale3d(1,1,1);
    transform: scale3d(1,1,1);
  }
  10%, 20% {
      -webkit-transform: scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg);
      transform: scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg);
  }
  30%, 50%, 70%, 90% {
      -webkit-transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg);
      transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg);
  }
  40%, 60%, 80% {
      -webkit-transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg);
      transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg);
  }
`;
const StyledTriggerButton = styled.div`
  cursor: pointer;
  user-select: none;
  z-index: 111;
  color: #fff;
  border-radius: 50%;
  display: flex;
  background: #00424f;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  width: 60px;
  height: 60px;
  bottom: 20px;
  padding: 8px;
  font-size: 25px;
  box-shadow: 0px 6px 42px #2425330f;
  z-index: 9999;
  box-sizing: border-box;

  ${(props) =>
    props.type === "tada" &&
    css`
      animation: ${pulse_tada} 1.5s infinite ease-out;
    `}
`;
const pulse = keyframes`
  0% {
      box-shadow: 0 0 0 0 rgb(37 211 102 / 50%);
  }
  80% {
      box-shadow: 0 0 0 14px rgb(37 211 102 / 0%);
  }
`;

const pulse_border = keyframes`
  0% {
		padding: 25px;
		opacity: 0.75;
	}
	75% {
		padding: 50px;
		opacity: 0;
	}
	100% {
		opacity: 0;
	}
`;

const StyledTriggerButtonClose = styled.div`
  cursor: pointer;
  user-select: none;
  z-index: 111;
  background: #00424f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  box-shadow: 0px 6px 42px #2425330f;
  justify-content: center;
  width: 60px;
  height: 60px;
  bottom: 20px;
  padding: 8px;
  z-index: 9999;
  box-sizing: border-box;
  ${(props) =>
    props.type === "tada" &&
    css`
      animation: ${pulse_tada} 1.5s infinite ease-out;
    `}

  ${(props) =>
    props.type === "ripple" &&
    css`
      &:before {
        content: "";
        position: absolute;
        border-radius: 50%;
        padding: 25px;
        border: ${(props) => `5px solid ${props.color}`};
        opacity: 0.75;
        animation: ${pulse_border} 1.5s ease-out infinite;
      }
    `}
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
  zindex: 99999991;
`;

const ProActiveVideoContainer = styled.div`
  display: flex;
  justify-content: end;
`;

const ProActiveVideo = styled.video`
  width: 190px;
  border-radius: 10px;
`;

const ProActiveSimpleMsg = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  flex-direction: column;
`;

const ProActiveMessage = styled.div`
  background: #fff;
  padding: 9px 11px;
  min-width: auto;
  color: #000 !important;
  font-family: inherit;
  font-weight: 600;
  max-width: auto;
  border-radius: 10px;
  margin: 3px 0 !important;
  box-shadow: 0px 6px 42px rgb(36 37 51 / 6%);
`;

// eslint-disable-next-line complexity
export const WidgetWrapper = forwardRef((props, ref) => {
  const { webchatState, toggleWebchat, toggleCoverComponent } =
    useContext(WebchatContext);

  const [showBack, setShowBack] = useState(false);

  const theme = merge(webchatState.theme, props.theme);
  // const getThemeProperty = _getThemeProperty(theme)
  const getThemeProperty = (property, defaultValue = undefined) => {
    const value = getProperty(theme, property);
    if (value !== undefined) return value;
    return defaultValue;
  };

  const deviceMode = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.DEVICEMODE,
    "desktop"
  );

  const [proactiveOpen, setProactiveOpen] = useState(true);

  const host = props.host || document.body;
  // const deviceAdapter = new DeviceAdapter();

  const openCoverComponent = () => {
    toggleCoverComponent(true);
  };

  useAsyncEffect(async () => {}, [webchatState.online]);

  const widgetThemeStyle = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.widgetStyle,
    WEBCHAT.DEFAULTS.WIDGETSTYLE
  );

  const bubbleAnimation = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.bubbleAnimation,
    WEBCHAT.DEFAULTS.BUBBLEANIMATION
  );

  // console.log("bubbleAnimation", bubbleAnimation);

  const triggerButton = () => {
    return (
      <>
        {webchatState.isWebchatOpen ? (
          <StyledTriggerButton
            className="weconnect_trigger_button"
            style={{ ...triggerStyle, ...widgetThemeStyle }}
            role={ROLES.TRIGGER_BUTTON}
            editMode={props.editMode}
          >
            <MdOutlineClose
              fill={widgetThemeStyle.color}
              stroke={widgetThemeStyle.color}
            />
          </StyledTriggerButton>
        ) : (
          <StyledTriggerButtonClose
            className="weconnect_trigger_button"
            role={ROLES.TRIGGER_BUTTON}
            type={bubbleAnimation.enable === 1 ? bubbleAnimation.type : "none"}
            color={widgetThemeStyle.background}
            style={{ ...triggerStyle, ...widgetThemeStyle }}
            editMode={props.editMode}
          >
            <MsgImg size={25} fill={"#fff"} stroke={widgetThemeStyle.color} />
            {/* <ProActiveChatbot>
              <ChatDot className="dot" />
              <ChatDot className="dot" />
              <ChatDot className="dot" />
            </ProActiveChatbot> */}

            {webchatState.unreadCount > 0 && (
              <StyledTriggerBadge>
                {webchatState.unreadCount}
              </StyledTriggerBadge>
            )}
          </StyledTriggerButtonClose>
        )}
      </>
    );
  };

  let mobileStyle = {};
  let widgetStyle = {};
  let triggerStyle = {};
  let proActiveStyle = {};
  let widgetFrameStyle = {};
  if (props.chatSettings.position === "left") {
    widgetFrameStyle = {
      // bottom: "80px",
      bottom: "100px",
      right: "auto",
      position: props.editMode === "design" ? "absolute" : "fixed",
      left: "22px",
      width: "400px",
      height: "500px",
      opacity: "1!important",
      // height: "500px",
      // height: resizeWidth > 1400 ? "200" : "500",
      borderRadius: "20px",
      zIndex: "99999999",
      border: 0,
      // '@media (max-width: 1640px)': {
      //   height: "50%",
      // },
    };

    widgetStyle = {
      // bottom: "80px",
      bottom: "100px",
      right: "auto",
      width: "100%",
      height: "100%",
      opacity: "1!important",
      // height: "500px",
      // height: resizeWidth > 1400 ? "200" : "500",
      borderRadius: "20px",
      zIndex: "99999999",
      // '@media (max-width: 1640px)': {
      //   height: "50%",
      // },
    };
    triggerStyle = {
      position: props.editMode === "design" ? "absolute" : "fixed",
      left: "10px",
    };
    proActiveStyle = {
      left: "22px",
      bottom: "107px",
      zIndex: "99999999",
      alignItems: "start",
      position: props.editMode === "design" ? "absolute" : "fixed",
    };
  } else if (props.chatSettings.position === "right") {
    widgetFrameStyle = {
      // bottom: "80px",
      bottom: "100px",
      left: "auto",
      position: props.editMode === "design" ? "absolute" : "fixed",
      right: "22px",
      opacity: "1!important",
      width: "400px",
      // height: "500px",
      height: "500px",
      boxShadow: "rgb(0 0 0 / 20%) 0px 0px 12px",
      borderRadius: "20px",
      zIndex: "99999999",
      border: 0,
    };
    widgetStyle = {
      // bottom: "80px",

      left: "auto",
      position: props.editMode === "design" ? "absolute" : "fixed",

      opacity: "1!important",
      width: "100%",
      height: "100%",
      boxShadow: "rgb(0 0 0 / 20%) 0px 0px 12px",
      borderRadius: "20px",
      zIndex: "99999999",
    };
    triggerStyle = {
      position: props.editMode === "design" ? "absolute" : "fixed",
      right: "10px",
    };
    proActiveStyle = {
      right: "22px",
      zIndex: "99999999",
      bottom: "82px!important",
      alignItems: "end",
      height: "auto",
      border: "none",
      position: props.editMode === "design" ? "absolute" : "fixed",
    };
  } else if (props.chatSettings.position === "center") {
    widgetFrameStyle = {
      right: "90px",
      left: "unset",
      position: props.editMode === "design" ? "absolute" : "fixed",
      width: "400px",
      height: "500px",
      borderRadius: "24px 24px 20px 20px",
      opacity: "1!important",
      zIndex: "99999999",
      margin: "auto",
      border: 0,
      bottom: "50%",
      top: "50%",
    };
    widgetStyle = {
      left: "unset",
      position: props.editMode === "design" ? "absolute" : "fixed",
      width: "100%",
      height: "100%",
      borderRadius: "24px 24px 20px 20px",
      opacity: "1!important",
      zIndex: "99999999",
      margin: "auto",
    };
    triggerStyle = {
      position: props.editMode === "design" ? "absolute" : "fixed",
      bottom: "50%",
      top: "50%",
      right: "10px",
    };
    proActiveStyle = {
      right: "22px",
      zIndex: "99999999",
      bottom: "52%",
      alignItems: "end",
      position: props.editMode === "design" ? "absolute" : "fixed",
    };
  }

  if (deviceMode === "mobile") {
    widgetFrameStyle = {
      // bottom: "80px",
      position: props.editMode === "design" ? "absolute" : "fixed",
      right: "0px",
      top: "0px",
      bottom: "0px",
      width: "100%",
      height: "100%",
      borderRadius: 0,
      zIndex: "99999999",
      border: 0,
      // '@media (max-width: 1640px)': {
      //   height: "50%",
      // },
    };

    mobileStyle = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.mobileStyle) || {
      width: "100%",
      height: "100%",
      right: 0,
      bottom: 0,
      borderRadius: 0,
    };
  }

  useEffect(() => {
    scrollToBottom({ host });
  }, [webchatState.themeUpdates, host]);

  useEffect(() => {
    if (props.chatSettings.nextscreen === "welcomescreen") {
      setShowBack(true);
    }
  }, [props.chatSettings]);

  const rgbToRgba = (rgb) => {
    let a = 1;
    a = webchatState.theme.opacity;
    if (rgb) return rgb.replace("rgb(", "rgba(").replace(")", `, ${a})`);
  };

  const widgetAlphastyle = {
    ...widgetStyle,
    background: rgbToRgba("rgb(255,255,255)"),
  };

  const widgetAlphaframestyle = {
    ...widgetFrameStyle,
    background: rgbToRgba("transparent"),
  };

  const fontStyle = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.fontStyle, {});

  const proactiveEnable =
    window.sessionStorage &&
    window.sessionStorage.getItem(
      "weconnect_proactive_disable" + props.botId
    ) &&
    props.editMode !== "design"
      ? false
      : true;
  console.log("widget working");
  const WebchatComponent = (
    <>
      <style>
        {`
       .proactiveContainer{
          border:unset;
          bottom:120px
        }
        .proactive_close {
            background-color: #000;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            margin-bottom: 10px;
            display: flex;
            cursor: pointer;
            align-items: center;
            justify-content: center;
        }
        .proactive_close svg {
            font-size: 15px;
        }
        .proactiveSimpleMsg {
            display: flex;
            align-items: flex-end;
            justify-content: flex-end;
            flex-direction: column;
        }
        .proacativeMessage {
            background: #fff;
            padding: 9px 11px;
            min-width: auto;
            color: #000 !important;
            font-family: Nunito !important;
            font-size: 15px !important;
            font-weight: 600 !important;
            border-radius: 10px;
            margin: 3px 0 !important;
            box-shadow: 0px 6px 42px rgb(36 37 51 / 6%);
            border: 1px solid rgba(210,206,206,0.9333333333);
        }
        .proactiveImage {
            padding: 10px;
            width: 150px;
            border-radius: 10px;
        }
        .proactiveVideo {
            width: 190px;
            border-radius: 10px;
        }

      `}
      </style>
      {props.chatSettings.showWelcomeMessage &&
        props.chatSettings.domainWelcome &&
        proactiveEnable &&
        !webchatState.isWebchatOpen &&
        Array.isArray(props.chatSettings.proacativeMessages) &&
        props.chatSettings.proacativeMessages.length > 0 && (
          <ProactiveContainer
            className="proactiveContainer"
            mobile={deviceMode === "mobile"}
            position={props.chatSettings.position}
            style={{
              ...fontStyle,
              ...proActiveStyle,
            }}
          >
            {proactiveOpen && (
              <>
                {props.chatSettings.close_option_checkbox === 1 && (
                  <div
                    className="proactive_close"
                    style={{ color: "white" }}
                    onClick={(event) => {
                      setProactiveOpen(false);
                      if (window.sessionStorage) {
                        window.sessionStorage.setItem(
                          "weconnect_proactive_disable" + props.botId,
                          "true"
                        );
                      }
                    }}
                  >
                    <MdClose />
                  </div>
                )}

                {props.chatSettings.proacativeMessages.map((item, i) => {
                  if (item && item.type === "text") {
                    if (item.value && item.value.substr(0, 8) === "https://")
                      return (
                        <div
                          onClick={(event) => {
                            toggleWebchat(!webchatState.isWebchatOpen);
                            event.preventDefault();
                          }}
                        >
                          <img
                            className="proactiveImage"
                            alt=""
                            src={item.value}
                          />
                        </div>
                      );
                    else
                      return (
                        <div className="proactiveSimpleMsg" key={i}>
                          <div
                            className="proacativeMessage"
                            onClick={(event) => {
                              toggleWebchat(!webchatState.isWebchatOpen);
                              event.preventDefault();
                            }}
                            dangerouslySetInnerHTML={{ __html: item.value }}
                          >
                            {/* {item.value} */}
                          </div>
                        </div>
                      );
                  } else if (item && item.type === "image") {
                    return (
                      <div
                        key={i}
                        onClick={(event) => {
                          toggleWebchat(!webchatState.isWebchatOpen);
                          event.preventDefault();
                        }}
                      >
                        <img
                          className="proactiveImage"
                          alt=""
                          src={item.value}
                        />
                      </div>
                    );
                  } else if (item && item.type === "video") {
                    return (
                      <div
                        key={i}
                        // onClick={(event) => {
                        //   toggleWebchat(!webchatState.isWebchatOpen);
                        //   event.preventDefault();
                        // }}
                      >
                        <video
                          className="proactiveVideo"
                          style={{ marginTop: "10px" }}
                          controls={true}
                          autoPlay={true}
                          loop={true}
                          muted={true}
                          controlsList="nodownload"
                          playsInline
                        >
                          <source
                            src={item.value + "#t=0.001"}
                            type="video/mp4"
                          ></source>
                        </video>
                      </div>
                    );
                  }
                  return null;
                })}
              </>
            )}
          </ProactiveContainer>
        )}
      {
        <div
          onClick={(event) => {
            toggleWebchat(!webchatState.isWebchatOpen);
            event.preventDefault();
          }}
        >
          {triggerButton()}
        </div>
      }

      <WidgetIframe
        fontFamily={props.fontFamily}
        position={props.chatSettings.position}
        mobile={deviceMode === "mobile"}
        style={{
          ...widgetAlphaframestyle,
          display: webchatState.isWebchatOpen ? "" : "none",
          boxShadow: webchatState.isWebchatOpen
            ? "rgb(0 0 0 / 20%) 0px 0px 12px"
            : "",
          borderRadius: webchatState.isWebchatOpen ? "20px" : "",
        }}
      >
        <StyledWebchat
          // TODO: Distinguis between multiple instances of webchat, e.g. `${uniqueId}-botonic-webchat`
          ref={props.scrollContainer}
          role={ROLES.WEBCHAT}
          id={WEBCHAT.DEFAULTS.ID}
          className="weconnect_widgetWrapper"
          width={webchatState.width}
          height={webchatState.height}
          mobile={deviceMode === "mobile"}
          tablet={deviceMode === "tablet"}
          position={props.chatSettings.position}
          editMode={props.editMode}
          style={{
            ...webchatState.theme.style,
            ...mobileStyle,
            ...widgetAlphastyle,
            ...fontStyle,
            display: webchatState.isWebchatOpen ? "" : "none",
          }}
        >
          {!webchatState.isCoverComponentOpen && (
            <StyledWebchatHeader
              coverComponent={showBack ? 1 : 0}
              refreshChat={() => {
                props.refreshChat();
              }}
              onCloseClick={() => {
                toggleWebchat(false);
              }}
              openCoverComponent={() => openCoverComponent()}
            />
          )}
          {props.children}
        </StyledWebchat>
      </WidgetIframe>
    </>
  );
  return WebchatComponent;
  // shadow dom need to look later
  // return props.shadowDOM ? (
  //   <StyleSheetManager target={host}>{WebchatComponent}</StyleSheetManager>
  // ) : (
  //   WebchatComponent
  // );
});
