import { motion } from "framer-motion";
import React, { useContext } from "react";
import styled from "styled-components";

import { COLORS, ROLES, WEBCHAT } from "./constants";
import { WebchatContext } from "./contexts";
import { resolveImage } from "../util/environment";
import { ConditionalWrapper } from "../util/react";
// import left_arrow from "../assets/chevron-left (1).svg";
// import hand from "../assets/waving-hand.png";
import refreshIcon from "../assets/refresh.svg";
import whatApp from "../assets/Image 15.png";
import email from "../assets/Image 16.png";
import fbmessage from "../assets/Image 28.png";
import message from "../assets/message-square.svg";
import FiLogOut from "../assets/react-icons/FiLogOut";
import CgMenuRound from "../assets/react-icons/CgMenuRound";
import MdOutlineKeyboardArrowLeft from "../assets/react-icons/MdOutlineKeyboardArrowLeft";
import MdOutlineLanguage from "../assets/react-icons/MdOutlineLanguage";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";

const Header = styled.div`
  display: flex;
  // background: linear-gradient(
  //   90deg,
  //   ${COLORS.BLEACHED_CEDAR_PURPLE} 0%,
  //   ${(props) => props.color} 100%
  // );
  background-color: #00424f;
  height: 55px;
  // border-radius: ${WEBCHAT.DEFAULTS.BORDER_RADIUS_TOP_CORNERS};
  border-radius: 20px 20px 0px 0px;
  z-index: 2;
`;

const ImageContainer = styled.div`
  padding: 10px;
  align-items: center;
`;

const Image = styled.img`
  width: 32px;
  border-radius: 50%;
  border-radius: 28px 28px 0px 0px;
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
  font-family: inherit;
  font-weight: bold;
  // color: ${COLORS.SOLID_WHITE};
  color: #ffffff !important;
  font: normal normal bold 12px/18px Nunito;
  font-family: inherit;
`;

const Subtitle = styled.div`
  display: flex;
  font-family: inherit;
  font-size: 11px;
  color: ${COLORS.SOLID_WHITE};
`;

const CloseHeader = styled.div`
  padding: 0px 16px;
  cursor: pointer;
  color: ${COLORS.SOLID_WHITE};
  font-family: inherit;
  font-size: 36px;
`;

const RefreshHeader = styled.div`
  padding: 0px 16px;
  cursor: pointer;
  color: ${COLORS.SOLID_WHITE};
  font-family: inherit;
  font-size: 16px;
  top: 20px;
  position: relative;
`;

export const DefaultHeader = (props) => {
  const { getThemeProperty } = props;
  const animationsEnabled = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.enableAnimations,
    true
  );
  const headerImage = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.headerImage,
    getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.brandImage,
      WEBCHAT.DEFAULTS.LOGO
    )
  );

  const headerTitle = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.headerTitle,
    WEBCHAT.DEFAULTS.TITLE
  );

  const headerSubtitle = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.headerSubtitle,
    ""
  );
  const subTitleStyle = getThemeProperty("header.subtitleStyle", {});
  const titleStyle = getThemeProperty("header.titleStyle", {});

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

  const onCloseClick = () => {
    setShareAnchorEl(null);
    props.onCloseClick();
  };

  const openCoverComponent = () => {
    setShareAnchorEl(null);
    props.openCoverComponent();
  };

  const handleShareOpen = (event) => {
    setShareAnchorEl(event.currentTarget);
  };
  const handleShareClose = () => {
    setShareAnchorEl(null);
  };

  return (
    <Header
      className="header-section_weconnect"
      role={ROLES.HEADER}
      color={props.color}
      style={{ ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.headerStyle) }}
    >
      {/* <img src={left_arrow} alt="" width={9} style={{ color: '#fff' }} className="arrow-icon" /> */}
      <MdOutlineKeyboardArrowLeft
        className="arrow-icon"
        onClick={props.openCoverComponent}
      />
      {headerImage && (
        <ImageContainer>
          <Image src={resolveImage(headerImage)} />
        </ImageContainer>
      )}
      <TextContainer ml={headerImage ? "0px" : "16px"}>
        {/* <Title style={titleStyle} mb={headerSubtitle ? '6px' : '0px'}>{headerTitle}</Title> */}
        <Title style={titleStyle} mb={headerSubtitle ? "6px" : "0px"}>
          WeConnect.chat
        </Title>
        {/* <Subtitle style={subTitleStyle}>{headerSubtitle}</Subtitle> */}
      </TextContainer>
      <div className="right-menus">
        <IconButton
          className="icon"
          style={{ color: "#fff", fontSize: "18px" }}
          id="basic-button"
          aria-controls={shareOpen ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={shareOpen ? "true" : undefined}
          onClick={handleShareOpen}
        >
          <FiLogOut
          // onClick={props.onCloseClick}
          />
        </IconButton>
        <IconButton
          className="icon"
          style={{ color: "#fff", fontSize: "18px" }}
          id="basic-button"
          aria-controls={moreOpen ? "basic-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={moreOpen ? "true" : undefined}
          onClick={handleMoreOpen}
        >
          <CgMenuRound />
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
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={refreshChat}>
          {" "}
          <img src={refreshIcon} alt="" /> Refresh chat
        </MenuItem>
        <MenuItem onClick={handleMoreClose}>
          {" "}
          <MdOutlineLanguage /> English
        </MenuItem>
      </Menu>

      <Menu
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
        <MenuItem onClick={handleShareClose}>
          {" "}
          <img src={email} alt="" /> Email
        </MenuItem>
        <MenuItem onClick={handleShareClose}>
          {" "}
          <img src={fbmessage} alt="" /> Messenger
        </MenuItem>
        <MenuItem onClick={handleShareClose}>
          {" "}
          <img src={whatApp} alt="" /> Whatsapp
        </MenuItem>
        <MenuItem onClick={openCoverComponent}>
          {" "}
          <img src={message} alt="" /> Home
        </MenuItem>
      </Menu>
    </Header>
  );
};

export const WebchatHeader = (props) => {
  const { webchatState, getThemeProperty } = useContext(WebchatContext);
  const handleCloseWebchat = (event) => {
    props.onCloseClick(event.target.value);
  };
  const refreshChat = (event) => {
    props.refreshChat();
  };
  const openCoverComponent = () => {
    props.openCoverComponent();
  };
  const CustomHeader = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.customHeader);
  if (CustomHeader) {
    return (
      <CustomHeader
        onCloseClick={handleCloseWebchat}
        refreshChat={refreshChat}
      />
    );
  }
  return (
    <DefaultHeader
      webchatState={webchatState}
      getThemeProperty={getThemeProperty}
      color={getThemeProperty(
        WEBCHAT.CUSTOM_PROPERTIES.brandColor,
        COLORS.BOTONIC_BLUE
      )}
      openCoverComponent={openCoverComponent}
      onCloseClick={handleCloseWebchat}
      refreshChat={refreshChat}
    />
  );
};

export const StyledWebchatHeader = styled(WebchatHeader)`
  border-radius: 8px 8px 0px 0px;
  box-shadow: ${COLORS.PIGEON_POST_BLUE_ALPHA_0_5} 0px 2px 5px;
  height: 36px;
  flex: none;
`;
