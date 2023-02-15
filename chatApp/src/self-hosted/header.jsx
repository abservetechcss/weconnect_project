import { motion } from "framer-motion";
import React, { useContext } from "react";
import styled from "styled-components";
import { COLORS, ROLES, WEBCHAT } from "../constants";
import { WebchatContext } from "../contexts";
import { resolveImage } from "../util/environment";
import { ConditionalWrapper } from "../util/react";
import refreshIcon from "../assets/refresh.svg";
import whatApp from "../assets/Image 15.png";
import email from "../assets/Image 16.png";
import message from "../assets/message-square.svg";
import FiLogOut from "../assets/react-icons/FiLogOut";
import CgMenuRound from "../assets/react-icons/CgMenuRound";
import MdOutlineKeyboardArrowLeft from "../assets/react-icons/MdOutlineKeyboardArrowLeft";
import MdOutlineLanguage from "../assets/react-icons/MdOutlineLanguage";
import MdClear from "../assets/react-icons/MdClear";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
const mobileBreakpoint = 600;
const Header = styled.div`
  display: flex;
  height: 60px;
  border-radius: 20px 20px 0px 0px;
  z-index: 2;
  font-size: 20px;
  font-family: Nunito;
  @media (max-width: 600px) {
    border-radius: 0px !important;
  }
`;

const ImageContainer = styled.div`
  padding: 10px;
  padding-left: 8px;
  align-items: center;
`;

const Image = styled.img`
  width: 35px;
  height: 35px;
  max-width: 35px;
  border-radius: ${(props) => props.radius};
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1 1 auto;
  background-color: "#00424F";
`;

const Title = styled.div`
  display: flex;
  ${'' /* font-weight: bold; */}
  font-family: "Nunito";
  word-break: break-word;
  font-size: 16px;
  padding: ${(props) =>
    props.deviceMode === "mobile"
      ? "unset"
      : props.deviceMode === "tablet"
      ? "4px"
      : "5px"};
`;

// const Subtitle = styled.div`
//   display: flex;
//   font-family: inherit;
//   font-size: 11px;
//   color: ${COLORS.SOLID_WHITE};
// `;

// const CloseHeader = styled.div`
//   padding: 0px 16px;
//   cursor: pointer;
//   color: ${COLORS.SOLID_WHITE};
//   font-family: inherit;
//   font-size: 36px;
// `;

// const RefreshHeader = styled.div`
//   padding: 0px 16px;
//   cursor: pointer;
//   color: ${COLORS.SOLID_WHITE};
//   font-family: inherit;
//   font-size: 16px;
//   top: 20px;
//   position: relative;
// `;

export const DefaultHeader = (props) => {
  const { webchatState, getThemeProperty } = useContext(WebchatContext);
  const animationsEnabled = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.enableAnimations,
    true
  );
  const headerImage = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.profile);

  const headerTitle = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.headerTitle,
    WEBCHAT.DEFAULTS.TITLE
  );

  const headerSubtitle = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.headerSubtitle,
    ""
  );
  const headerSameChat = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.headerSameChat,
    0
  );
  const headerStyle = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.headerStyle,
    WEBCHAT.DEFAULTS.WIDGETSTYLE
  );
  const widgetStyle = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.widgetStyle,
    WEBCHAT.DEFAULTS.WIDGETSTYLE
  );

  const deviceMode = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.DEVICEMODE,
    "desktop"
  );

  const [moreAnchorEl, setMoreAnchorEl] = React.useState(null);
  const moreOpen = Boolean(moreAnchorEl);

  const [shareAnchorEl, setShareAnchorEl] = React.useState(null);
  const shareOpen = Boolean(shareAnchorEl);

  const handleMoreOpen = (event) => {
    setMoreAnchorEl(event.currentTarget);
  };
  const handleMoreClose = () => {
    setMoreAnchorEl(null);
  };

  const refreshChat = () => {
    setMoreAnchorEl(null);
    props.refreshChat();
  };

  const openCoverComponent = () => {
    setShareAnchorEl(null);
    props.openCoverComponent();
  };

  const handleShareOpen = (event) => {
    if (webchatState.chatsettings.welcome_screen_checkbox === 1) {
      setShareAnchorEl(event.currentTarget);
    } else {
      props.onCloseClick();
    }
  };
  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  return (
    <>
      <style>
        {`
      .more-menu-popup-block .MuiPaper-root.MuiPaper-elevation.MuiPaper-rounded {
    border-radius: 10px;
      }
      .more-menu-popup-block ul li, .more-menu-popup-block ul li div, .more-menu-popup-block ul li span {
          font: normal normal 600 12px/18px Nunito;
          font-family: Nunito !important;
          letter-spacing: 0px;
          color: #1e1e1e;
          opacity: 1;
          min-height:unset !important
      }
      .more-menu-popup-block ul li img {
          width: 12px;
          margin-right: 6px;
      }
     .arrow-icon{
        padding:5px
      }
     .arrow-icon:hover{
             background: #0000004a;
      padding: 5px;
      border-radius: 7px;
     }
     .basic-button{
       padding:5px
     }
     .basic-button:hover{
      background: #0000004a;
      padding: 5px;
      border-radius: 7px;
     }

      `}
      </style>
      <Header
        // className="header-section_weconnect"
        role={ROLES.HEADER}
        style={headerSameChat === 1 ? widgetStyle : headerStyle}
      >
        {/* <img src={left_arrow} alt="" width={9} style={{ color: '#fff' }} className="arrow-icon" /> */}
        {props.coverComponent === 1 && (
          <IconButton
            style={{
              backgroundColor: "transparent",
              border: 0,
              padding: 0,
              paddingLeft: "8px",
            }}
          >
            <MdOutlineKeyboardArrowLeft
              className="arrow-icon"
              style={{ color: "#fff", fontSize: "20px" }}
              onClick={props.openCoverComponent}
            />
          </IconButton>
        )}

        {headerImage && (
          <ImageContainer
            style={
              props.coverComponent === 1
                ? { paddingTop: "13px" }
                : { marginLeft: "5px", paddingTop: "13px" }
            }
          >
            <Image
              src={resolveImage(headerImage)}
              radius={getThemeProperty(
                WEBCHAT.CUSTOM_PROPERTIES.profileScale,
                "50%"
              )}
            />
          </ImageContainer>
        )}
        <TextContainer ml={headerImage ? "0px" : "16px"}>
          {/* <Title style={titleStyle} mb={headerSubtitle ? '6px' : '0px'}>{headerTitle}</Title> */}
          <Title
            deviceMode={deviceMode}
            mb={headerSubtitle ? "6px" : "0px"}
            className="title"
          >
            {headerTitle}
          </Title>
          {/* <Subtitle style={subTitleStyle}>{headerSubtitle}</Subtitle> */}
        </TextContainer>
        <div
          // className="right-menus"
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <IconButton
            // className="next_icon"
            style={{
              color: "#fff",
              fontSize: "18px",
              backgroundColor: "transparent",
              border: 0,
              paddingRight: "0px",
              padding: "0px",
            }}
            id="basic-button"
            aria-controls={shareOpen ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={shareOpen ? "true" : undefined}
            onClick={handleShareOpen}
          >
            <FiLogOut
              className="basic-button"
              // onClick={props.onCloseClick}
            />
          </IconButton>
          <IconButton
            // className="next_icon"
            style={{
              color: "#fff",
              fontSize: "18px",
              backgroundColor: "transparent",
              border: 0,
              marginRight: "0px",
              padding: "0px 8px 0px 6px",
            }}
            id="basic-button"
            aria-controls={moreOpen ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={moreOpen ? "true" : undefined}
            onClick={handleMoreOpen}
          >
            <CgMenuRound className="basic-button" />
          </IconButton>
          <IconButton
            // className="cross_icon"
            style={{
              color: "#fff",
              fontSize: "18px",
              backgroundColor: "transparent",
              border: 0,
              display: deviceMode === "mobile" ? "block" : "none",
            }}
            id="basic-button"
            onClick={props.onCloseClick}
          >
            <MdClear />
          </IconButton>
        </div>

        <ConditionalWrapper
          condition={animationsEnabled}
          wrapper={(children) => (
            <motion.div whileHover={{ scale: 1.2 }}>{children}</motion.div>
          )}
        >
          {/* // close Header
              <CloseHeader onClick={props.onCloseClick}>⨯</CloseHeader> */}

          {/* <RefreshHeader onClick={props.refreshChat}>R</RefreshHeader> */}
        </ConditionalWrapper>

        <Menu
          id="basic-menu"
          anchorEl={moreAnchorEl}
          open={moreOpen}
          onClose={handleMoreClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          className="more-menu-popup-block"
          sx={{
            fontFamily: "Nunito",
          }}
          style={{
            zIndex: "1300000000",
            borderRadius: "10px",
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <MenuItem
            onClick={refreshChat}
            style={{
              font: "normal normal 600 12px/18px Nunito",
              letterSpacing: "0px",
              color: "#1e1e1e",
              opacity: "1",
            }}
          >
            {" "}
            <img
              src={refreshIcon}
              alt=""
              style={{
                width: "12px",
                marginRight: "6px",
              }}
            />{" "}
            Refresh chat
          </MenuItem>
          <MenuItem
            onClick={handleMoreClose}
            style={{
              font: "normal normal 600 12px/18px Nunito",
              letterSpacing: "0px",
              color: "#1e1e1e",
              opacity: "1",
            }}
          >
            {" "}
            <MdOutlineLanguage
              style={{
                fontSize: "15px",
                color: "#626262",
                marginRight: "6px",
              }}
            />{" "}
            English
          </MenuItem>
        </Menu>

        <Menu
          sx={{
            zIndex: 999999999,
            fontFamily: "Nunito",
          }}
          id="basic-menu"
          anchorEl={shareAnchorEl}
          open={shareOpen}
          onClose={handleShareClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          className="more-menu-popup-block"
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          {webchatState.chatsettings.email_checkbox === 1 && (
            <MenuItem onClick={handleShareClose}>
              {" "}
              <img src={email} alt="" /> Email
            </MenuItem>
          )}
          {/* <MenuItem onClick={handleShareClose}>
          {" "}
          <img src={fbmessage} alt="" /> Messenger
        </MenuItem> */}
          {webchatState.chatsettings.whatsapp_checkbox === 1 && (
            <MenuItem onClick={handleShareClose}>
              {" "}
              <img src={whatApp} alt="" /> Whatsapp
            </MenuItem>
          )}
          <MenuItem onClick={openCoverComponent}>
            {" "}
            <img src={message} alt="" /> Home
          </MenuItem>
        </Menu>
      </Header>
    </>
  );
};

export const StyledWebchatHeader = styled(DefaultHeader)`
  border-radius: 8px 8px 0px 0px;
  box-shadow: ${COLORS.PIGEON_POST_BLUE_ALPHA_0_5} 0px 2px 5px;
  height: 36px;
  flex: none;
`;
