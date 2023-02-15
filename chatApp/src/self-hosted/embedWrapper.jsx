// import { isMobile } from "./lib";
import React, { forwardRef, useContext, useEffect } from "react";
// import Grid from "@mui/material/Grid";
import styled from "styled-components";
import { useAsyncEffect } from "use-async-effect";
import { WebchatContext } from "../contexts";
import { COLORS, ROLES, WEBCHAT } from "../constants";
import FiRefreshCw from "../assets/react-icons/FiRefreshCw";

export const getParsedAction = (botonicAction) => {
  const splittedAction = botonicAction.split("create_case:");
  if (splittedAction.length <= 1) return undefined;
  return JSON.parse(splittedAction[1]);
};

const Videobg = styled.video.attrs((props) => ({
  muted: true,
  Muted: true,
  autoPlay: true,
  loop: true,
}))`
  position: ${(props) => (props.editMode === "design" ? "absolute" : "fixed")};
  right: 0;
  left: 0;
  bottom: 0;
  top: 0;
  min-width: 100%;
  min-height: 100%;
`;

const LandingImage = styled.img`
  border-radius: ${(props) => props.radius};
  height: ${(props) => (props.editMode === "design" ? "40px" : "60px")};
  width: ${(props) => (props.editMode === "design" ? "40px" : "60px")};
  ${
    "" /* max-width: ${(props) =>
    props.editMode === "design" ? "40px!important" : "60px!important"}; */
  }
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: ${(props) => (props.editMode === "design" ? "-18px;" : "33px")};
`;

const StyledWebchat = styled.div`
  margin: auto;
  overflow: "hidden";
  width: 100%;
  z-index: 111;
  background-color: ${COLORS.SOLID_WHITE};
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  border-radius: 10px;
  margin: ${(props) =>
    props.editMode === "design" ? "23px 0;" : "40px 0 0 0"};
  height: ${(props) =>
    props.editMode === "design" ? "calc(100% - 40px) !important;" : ""};
`;

const Grid = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  flex-direction: row;
  margin-top: -8px;
  background: ${(props) =>
    props.background ? props.background : "transparent"};
  font-family: ${(props) => (props.fontFamily ? props.fontFamily : "")};
  font-size: ${(props) => (props.fontSize ? props.fontSize : "16px")};
  font-weight: ${(props) => (props.fontWeight ? props.fontWeight : "normal")};
  height: ${(props) =>
    props.editMode === "design" ? "calc(100% - 10px)" : "calc(100vh + 8px)"};
  width: auto;
  margin-left: 0px;
`;

const addTag = (queryProperty, value, attribute = "content", tag = "meta") => {
  // Check unique
  let element = document.querySelector(`${tag}[${queryProperty}]`);
  if (element) {
    // If it does just change the content of the element
    element.setAttribute(attribute, value);
  } else {
    // It doesn't exist so lets make a HTML element string with the info we want
    if (tag === "meta")
      element = `<meta ${queryProperty} ${attribute}="${value}" />`;
    else if (tag === "link")
      element = `<link ${queryProperty} rel="icon" type="image/x-icon" ${attribute}="${value}" />`;

    // And insert it into the head
    document.head.insertAdjacentHTML("beforeend", element);
  }
};
// eslint-disable-next-line complexity
export const EmbedWrapper = forwardRef((props, ref) => {
  const { webchatState, getThemeProperty } = useContext(WebchatContext);

  const deviceMode = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.DEVICEMODE,
    "desktop"
  );

  //   const reqContext = useContext(RequestContext);
  const rgbToRgba = (rgb) => {
    let a = webchatState.theme.opacity;
    if (rgb)
      return rgb.replace(
        /rgba?(\(\s*\d+\s*,\s*\d+\s*,\s*\d+)(?:\s*,.+?)?\)/g,
        "rgba$1," + a + ")"
      );
  };
  // load themes
  const chatStyle = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.chatStyle);
  let pageStyle = {};
  if (
    props.chatSettings.bg_type === "color" ||
    props.chatSettings.bg_type === "gradient"
  ) {
    pageStyle = {
      background: rgbToRgba(props.chatSettings.bg_value),
    };
  } else if (props.chatSettings.bg_type === "image") {
    pageStyle = {
      backgroundImage: `url(${props.chatSettings.bg_value})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "100% 100%",
    };
  }
  // const pageStyle = getThemeProperty(
  //   WEBCHAT.CUSTOM_PROPERTIES.pageStyle,
  //   WEBCHAT.DEFAULTS.PAGESTYLE
  // );
  const profile = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.profile);

  //totally 3 modes
  // default landingpage is 1
  // const landingPageMode = 3;
  let landingPageMode = 1;
  if (props.chatSettings.layout === "personal") {
    landingPageMode = 2;
  } else if (props.chatSettings.layout === "modern") {
    landingPageMode = 3;
  }
  let landingImageStyle = {
    marginTop: "-62px",
  };
  if (props.mode === "embed") {
  }

  let parentGridStyles = {
    background: "transparent",
    height:
      props.editMode === "design" ? "calc(100% + 8px)" : "calc(100vh + 8px)",
  };
  let mainGridStyles = {
    borderRadius: "10px",
    transform: "translateY(0px)",
    transition: "all 0.3s ease",
    paddingTop: "0 !important",
    position: "relative",
  };
  let mobileStyle = {};
  let landingMessageContainerStyle = {
    padding: "25px 0",
    height: "calc(100vh - 32px)",
    borderRadius: "10px",
  };

  if (props.editMode === "builder") {
    parentGridStyles = {
      height: "100%",
      width: "100%",
      marginLeft: "0px",
      marginTop: "0px",
      ...pageStyle,
    };
    landingMessageContainerStyle = {
      height: "100%",
    };
    mainGridStyles.paddingLeft = "0px !important";
  } else if (props.editMode === "design") {
    // centerColumn = 12;
    parentGridStyles = {
      height: "100%",
      width: "100%",
      marginLeft: "0px",
      marginTop: "0px",
      ...pageStyle,
    };
    landingMessageContainerStyle = {
      height: "100%",
    };
    mainGridStyles.height = "100%";

    if (props.editMode === "design") {
      mainGridStyles.height = "calc(100% - 37px)";
    }
    mainGridStyles.paddingLeft = "0px !important";
    landingImageStyle = {};
  }
  if (props.mode === "embed") {
    landingMessageContainerStyle.padding = "15px";
  }

  let refreshPosition = {};
  if (landingPageMode === 1) {
    refreshPosition = {
      position: "absolute",
      top: "13px",
      zIndex: "100000",
      right: "35px",
      "&:hover": {
        cursor: "pointer",
      },
    };
  } else {
    refreshPosition = {
      position: "absolute",
      top: "60px",
      zIndex: "100000",
      right: "40px",
      "&:hover": {
        cursor: "pointer",
      },
    };
  }

  landingMessageContainerStyle = {
    ...landingMessageContainerStyle,
    background: rgbToRgba(chatStyle.background),
  };

  const LandingRefreshPosition = styled.div(refreshPosition);

  useAsyncEffect(async () => {}, [webchatState.online]);

  useEffect(() => {
    const title = webchatState.metaProperties.meta_title
      ? webchatState.metaProperties.meta_title
      : "WeConnect";
    addTag('property="title"', title);
    document.title = title;
    addTag(
      'property="description"',
      webchatState.metaProperties.meta_description
        ? webchatState.metaProperties.meta_description
        : "WeConnect"
    );
    addTag(
      'property="image"',
      webchatState.metaProperties.meta_image
        ? webchatState.metaProperties.meta_image
        : process.env.REACT_APP_LOGO
    );
    addTag(
      'rel="icon"',
      webchatState.metaProperties.meta_favicon
        ? webchatState.metaProperties.meta_favicon
        : process.env.REACT_APP_BASE_URL + "/favicon.ico",
      "href",
      "link"
    );
  }, [webchatState.metaProperties]);

  const fontStyle = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.fontStyle, {});

  if (deviceMode === "mobile") {
    mobileStyle = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.mobileStyle) || {
      width: "100%",
      height: "100%",
      right: 0,
      bottom: 0,
      borderRadius: 0,
    };
  }
  const Gridprops = { ...parentGridStyles, ...fontStyle };
  const WebchatComponent = (
    <Grid
      editMode={props.editMode}
      className="weconnect_embed_wrapper"
      container
      spacing={1}
      {...Gridprops}
      // style={{
      //   ...parentGridStyles,
      //   ...fontStyle,
      // }}
      // direction="row"
      // justifyContent="center"
      // alignItems="center"
    >
      <StyledWebchat
        // TODO: Distinguis between multiple instances of webchat, e.g. `${uniqueId}-botonic-webchat`
        role={ROLES.WEBCHAT}
        id={WEBCHAT.DEFAULTS.ID}
        ref={props.scrollContainer}
        width={webchatState.width}
        height={webchatState.height}
        style={{
          ...webchatState.theme.style,
          ...mobileStyle,
          ...landingMessageContainerStyle,
          ...pageStyle,
        }}
      >
        {" "}
        {props.editMode !== "builder" && landingPageMode === 1 && (
          <div style={{ textAlign: "center" }}>
            <div style={{ overflow: "initial" , marginTop: "35px" }}>
              <LandingImage
                style={landingImageStyle}
                src={profile}
                alt="logo"
                radius={getThemeProperty(
                  WEBCHAT.CUSTOM_PROPERTIES.profileScale,
                  "50%"
                )}
                editMode={props.editMode}
              />
            </div>
          </div>
        )}
        {landingPageMode !== 1 && <div style={{ height: "30px" }}></div>}
        {props.editMode !== "builder" && (
          <LandingRefreshPosition
            onClick={() => {
              props.refreshChat();
            }}
          >
            <FiRefreshCw />
          </LandingRefreshPosition>
        )}
        {props.children}
      </StyledWebchat>
    </Grid>
  );
  if (props.chatSettings.bg_type === "video")
    return (
      <>
        <Videobg editMode={props.editMode} key={props.chatSettings.bg_key}>
          <source src={props.chatSettings.bg_value} type="video/mp4" />
        </Videobg>
        {WebchatComponent}
      </>
    );
  else return WebchatComponent;
  // shadow dom need to look later
  // return props.shadowDOM ? (
  //   <StyleSheetManager target={host}>{WebchatComponent}</StyleSheetManager>
  // ) : (
  //   WebchatComponent
  // );
});
