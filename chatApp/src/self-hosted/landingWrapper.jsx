import React, { forwardRef, useContext, useEffect } from "react";
import Grid from "@mui/material/Grid";
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

const LandingInfo2 = styled.div`
  position: absolute;
  left: 35%;
  transform: translate(-50%, -50%);
  top: 50%;
  text-align: center;
  max-width: 179px;
  width:100%
  font-family: "Nunito";
`;

const LandingInfo3 = styled.div`
  position: absolute;
  left: 38%;
  bottom: 10px;
  font-family: "Nunito";
  text-align: center;
  max-width: 179px;
`;

const LandingInfoImg = styled.img`
  max-height: 50px !important;
  max-width: 50px !important;
  width: 46px !important;
  height: 46px !important;
  margin-bottom: 7px !important;
  border-radius: ${(props) => props.radius};
`;

const LandingInfoTitle = styled.h3`
  word-break: break-all;
  font-weight: 600;
  font-size: 1rem;
`;

const LandingInfoSubTitle = styled.h6`
  word-break: break-all;
  font-size: 0.9rem;
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
  fontfamily: '"Comic Sans MS", cursive, sans-serif';
  z-index: 111;
  background-color: ${COLORS.SOLID_WHITE};
  display: flex;
  flex-direction: column;
  position: relative;
  box-sizing: border-box;
  border-radius: 10px;
  padding: 25px 0;
  margin: ${(props) =>
    props.editMode === "design" ? "23px 0;" : "40px 0 0 0"};
  height: ${(props) =>
    props.editMode === "design"
      ? "calc(100% - 20px) !important;"
      : // : "calc(100% - 120px)!important"};
        "calc(100% - 35px)!important"};
  max-height: ${(props) =>
    props.editMode === "design"
      ? "calc(100% - 20px) !important;"
      : "calc(100vh - 80px)!important"};
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
export const LandingWrapper = forwardRef((props, ref) => {
  const { webchatState, getThemeProperty } = useContext(WebchatContext);
  //   const reqContext = useContext(RequestContext);

  const deviceMode = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.DEVICEMODE,
    "desktop"
  );

  // load themes
  const chatStyle = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.chatStyle);
  let pageStyle = {};
  if (
    props.chatSettings.bg_type === "color" ||
    props.chatSettings.bg_type === "gradient"
  ) {
    pageStyle = {
      background: props.chatSettings.bg_value,
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
  let leftColumn = 3;
  let centerColumn = 6;
  let rightColumn = 3;

  let parentGridStyles = {
    background: "#eee",
    height: "calc(100vh + 8px)",
    ...pageStyle,
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
    height: "calc(100vh - 130px)",
    borderRadius: "10px",
  };

  if (landingPageMode !== 1) {
    leftColumn = 4;
    centerColumn = 7;
    rightColumn = 0;
    landingMessageContainerStyle = {
      padding: "25px 0px",
      height: "calc(100vh - 100px)",
    };
  }

  if (props.editMode === "builder") {
    centerColumn = 12;
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
    if (landingPageMode === 1) {
      leftColumn = 2;
      centerColumn = 8;
      rightColumn = 2;
    }
    // centerColumn = 12;
    parentGridStyles = {
      // height: "100%",
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
    landingMessageContainerStyle.padding = "25px 15px";
  }

  let refreshPosition = {};
  if (landingPageMode === 1) {
    refreshPosition = {
      position: "absolute",
      // top: "25px",
      top: props.mode === "landing" ? "16px" : "6px",
      zIndex: "100000",
      right: props.mode === "landing" ? "20px" : "13px",
      "&:hover": {
        cursor: "pointer",
      },
    };
  } else {
    refreshPosition = {
      position: "absolute",
      // top: "16px",
      top: "13px",
      zIndex: "100000",
      right: "30px",
      "&:hover": {
        cursor: "pointer",
      },
    };
  }
  const rgbToRgba = (rgb) => {
    let a = 1;
    if (props.mode === "landing") a = webchatState.theme.opacity;
    if (rgb) return rgb.replace("rgb(", "rgba(").replace(")", `, ${a})`);
  };

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

  const WebchatComponent = (
    <Grid
      sx={{ ...parentGridStyles, ...fontStyle }}
      container
      spacing={1}
      // direction="row"
      // justifyContent="center"
      // alignItems="center"
    >
      {props.editMode !== "builder" && deviceMode !== "mobile" && (
        <Grid
          item
          sm={leftColumn}
          sx={{ position: "relative" }}
          className="weconnect_landing_wrapper"
        >
          {landingPageMode === 2 && (
            <div>
              <LandingInfo2>
                <LandingInfoImg
                  radius={getThemeProperty(
                    WEBCHAT.CUSTOM_PROPERTIES.profileScale,
                    "50%"
                  )}
                  src={profile}
                  alt="logo"
                />
                <LandingInfoTitle>
                  {c === "" ? "Title" : props.chatSettings.title}
                </LandingInfoTitle>
                <LandingInfoSubTitle>
                  {props.chatSettings.sub_title === ""
                    ? "SubTitle"
                    : props.chatSettings.sub_title}
                </LandingInfoSubTitle>
              </LandingInfo2>
            </div>
          )}
          {landingPageMode === 3 && (
            <LandingInfo3>
              <LandingInfoTitle>
                {props.chatSettings.title === ""
                  ? "Title"
                  : props.chatSettings.title}
              </LandingInfoTitle>
              <LandingInfoSubTitle>
                {props.chatSettings.sub_title === ""
                  ? "SubTitle"
                  : props.chatSettings.sub_title}
              </LandingInfoSubTitle>
            </LandingInfo3>
          )}
        </Grid>
      )}
      <Grid
        item
        sm={deviceMode !== "mobile" ? centerColumn : 12}
        xs={12}
        sx={mainGridStyles}
      >
        <StyledWebchat
          // TODO: Distinguis between multiple instances of webchat, e.g. `${uniqueId}-botonic-webchat`
          role={ROLES.WEBCHAT}
          ref={props.scrollContainer}
          id={WEBCHAT.DEFAULTS.ID}
          width={webchatState.width}
          height={webchatState.height}
          style={{
            ...webchatState.theme.style,
            ...mobileStyle,
            ...landingMessageContainerStyle,
          }}
        >
          {" "}
          {props.editMode !== "builder" && landingPageMode === 1 && (
            <div style={{ textAlign: "center" }}>
              <div style={{ overflow: "initial" }}>
                <LandingImage
                  radius={getThemeProperty(
                    WEBCHAT.CUSTOM_PROPERTIES.profileScale,
                    "50%"
                  )}
                  style={landingImageStyle}
                  src={profile}
                  alt="logo"
                  editMode={props.editMode}
                />
              </div>
            </div>
          )}
          {landingPageMode !== 1 && <div></div>}
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
      {props.editMode !== "builder" && deviceMode !== "mobile" && (
        <Grid item sm={rightColumn}></Grid>
      )}
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
