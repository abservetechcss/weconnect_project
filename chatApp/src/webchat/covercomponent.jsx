import React from "react";
import styled, { css } from "styled-components";
import { WebchatContext } from "../contexts";
import { WEBCHAT } from "../constants";
import { StyledScrollbar } from "../webchat/components/styled-scrollbar";
// import cancelBtn from "../assets/AiFillCloseCircle.svg";
import cancelBtn from "../assets/AiFillCloseCircle.png";
// import { WebchatMessageList } from "../webchat/message-list";

// import "../assets/css/cover.css";
// import whatsapp from "../assets/whatsapp.png";
import whatsapp from "../assets/whatsappIcon.png";
// import messenger from "../assets/messenger.png";
// import chat from "../assets/chat.png";
import chat from "../assets/message.png";
// import email from "../assets/email.png";
import email from "../assets/emailIcon.png";
// import logo from "../assets/brand avatar.png";
import search from "../assets/search.svg";
import user from "../assets/user.png";
// import hand from "../assets/waving-hand.png";
import SearchQuestion from "./searchQuestion";
import arrow from "../assets/Path 46470.svg";
import { ImCancelCircle } from "react-icons/im";
import IconButton from "@mui/material/IconButton";
import { MdArrowForwardIos } from "react-icons/md";
import CommonCover from "./commonCover";
import { height, width } from "@mui/system";

const Container = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  // padding: 0 28px;
  border-radius: 20px;
`;

const Cover = styled.div`
  background: #00424f;
  height: 200px;
  border-radius: 0px 0px 50% 50%;
  width: 100%;
  align-items: center;
  // top: -20px;
  position: relative;
  font-family: inherit;
  width: calc(100% + 30px);
  transform: translate(-25px, 0px);
  text-align: center;
  padding: 10px 10px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  flex-wrap: wrap;
  align-items: center;

  @media (max-width: 960px) {
    height: 160px;
  }
`;
const Card = styled.div`
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 6px 42px #2425330f;
  border-radius: 18px;
  display: inline-block;
`;

const Stack = styled.div`
  flex-direction: row;
  justify-content: center;
  white-space: nowrap;
  // padding: 20px;
  margin-top: 10px;
`;

const StyledButton = styled.button`
  border-radius: 20px;
  cursor: pointer;
  padding: 7px 10px 7px 6px;
  text-align: center;
  border-color: transparent;
  box-shadow: 0 0px 0px 1px #999797;
  width: 100px;
  margin: 4px auto;
`;

const coverLogoImg = styled.div`
  width: 51px;
  margin: auto;
  display: flex;
`;

const ConvCardTitle = styled.div`
  margin-left: 10px;
  font-size: 15px;
`;

const ConvCardSubtitle = styled.div`
  margin-left: 10px;
  color: gray;
`;

const cancelBtnStyle = {
  position: "absolute",
  right: "25px",
  top: "0px",
  maxWidth: "50px",
  color: "inherit",
};

const cancelBtnIcon = {
  fontSize: "25px",
  color: "inherit",
};

const coverImg = {
  height: "auto",
  width: "100%",
};
const CoverTitle = styled.h2`
  text-align: center;
  font: normal normal bold 17px/32px Nunito;
  font-family: Nunito !important;
  letter-spacing: 0px;
  width: 300px;
  margin: 3px auto 0px auto !important;
  color: white;
  font-weight: initial;
`;

const CoverSubtitle = styled.p`
  width: 224px;
  text-align: center;
  color: white;
  margin: 0 auto !important;
  font-weight: 300;
  text-align: center;
  font-size: 12px !important;
`;

const SmallTitle = styled.p`
  font: normal normal bold 14px/24px Nunito;
  font-family: Nunito !important;
  letter-spacing: 0px;
  color: #1e1e1e;
  opacity: 0.6;
`;
const searchInput = {
  border: "0",
  outline: "none",
  backgroundColor: "#fff0",
  width: "100%",
  font: "normal normal normal 12px/18px Nunito",
  fontFamily: "inherit !important",
  letterSpacing: "0px",
  boxShadow: "none !important",
  color: "#1e1e1e",
};
const ContinueConversationTitle = styled.p`
  color: #1e1e1e;
  font-weight: 500;

  font-family: Nunito;
  font-size: 14px;
  margin: 0;
`;
const ContinueConversationText = styled.p`
  color: #1e1e1e;
  font-weight: 400;
  font-family: Nunito;
  font-size: 12px;
  opacity: 0.6;
  margin: 0;
`;

const messageCoversation = {
  display: "flex",
  gap: "0px !important",
  flexWrap: "wrap",
  justifyContent: "flex-start",
  alignItems: "flex-start",
  marginTop: "10px !important",
  flexDirection: "column",
};

const cardBlock = {
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  boxShadow: "rgb(36 37 51 / 13%) 0px 6px 42px",
  borderRadius: "15px",
  font: "normal normal bold 12px/18px Nunito",
  fontFamily: "inherit",
  letterSpacing: "0px",
  color: "#1e1e1e",
  textAlign: "center",
  maxWidth: "110px",
  width: "100%",
  margin: "0",
  marginBottom: "5px",
  padding: "13px",
  whiteSpace: "break-spaces",
  wordBreak: "break-all",
  boxSizing: "border-box",
  cursor: "pointer",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  textDecoration: "none",
};

const headerimage = css`
  width: 60px;
  height: 60px;
  object-fit: cover !important;
`;

const headerimageround = css`
  width: auto;
  height: 60px;
`;

const StyledImg = styled.img`
  ${(props) =>
    parseInt(props.borderRadius) > 49 ? headerimage : headerimageround}
`;

export default class CoverComponent extends React.Component {
  static contextType = WebchatContext;

  constructor(props, context) {
    super(props);
    this.state = {
      date: "",
      reply: false,
    };
  }

  handleAction(action) {
    if (action === "chat") {
      this.props.closeComponent();
    } else {
      this.context.openWebview(SearchQuestion, { data: "myData" });
    }
  }

  render() {
    console.log(WEBCHAT.CUSTOM_PROPERTIES);
    return (
      <>
        <style>
          {`
        .cardblock:hover {
            background: #80808021;
        }
        `}
        </style>
        <div
          style={{
            backgroundColor: "#fff",
            overflow: "hidden",
            borderRadius: this.props.ismobile ? "0px" : "0px",
            fontFamily: "Nunito",
          }}
        >
          <Cover
            style={
              this.context.getThemeProperty(
                WEBCHAT.CUSTOM_PROPERTIES.headerSameChat,
                0
              ) === 1
                ? this.context.getThemeProperty(
                    WEBCHAT.CUSTOM_PROPERTIES.widgetStyle,
                    WEBCHAT.DEFAULTS.WIDGETSTYLE
                  )
                : this.context.getThemeProperty(
                    WEBCHAT.CUSTOM_PROPERTIES.headerStyle,
                    WEBCHAT.DEFAULTS.WIDGETSTYLE
                  )
            }
          >
            <div
              style={{
                display: "inline - block",
              }}
            >
              {this.props.ismobile && (
                <IconButton
                  style={cancelBtnStyle}
                  onClick={() => {
                    document.getElementsByTagName("body")[0].style.overflow =
                      "auto";
                    this.props.closeWebchat();
                  }}
                >
                  <ImCancelCircle style={cancelBtnIcon} />
                </IconButton>
              )}
              {/* {this.props.ismobile && <img
                src={cancelBtn}
                alt=""
                style={cancelBtnStyle}
                onClick={() => {
                  this.props.closeWebchat();
                }}
              />} */}
              <StyledImg
                borderRadius={this.context.getThemeProperty(
                  WEBCHAT.CUSTOM_PROPERTIES.coverScale,
                  "50%"
                )}
                src={this.context.getThemeProperty(
                  WEBCHAT.CUSTOM_PROPERTIES.welcomeImg,
                  WEBCHAT.DEFAULTS.PROFILE
                )}
                style={{
                  // width: "33px",
                  maxWidth: "200px",
                  objectFit: "contain",
                  display: "flex",
                  margin: "auto",
                  borderRadius: this.context.getThemeProperty(
                    WEBCHAT.CUSTOM_PROPERTIES.coverScale,
                    "50%"
                  ),
                }}
                alt=""
              />
            </div>
            <CoverTitle
            // className="coverTitle_weconnect"
            // style={CoverTitle}
            >
              {this.context.getThemeProperty(
                WEBCHAT.CUSTOM_PROPERTIES.headerTitle,
                WEBCHAT.DEFAULTS.TITLE
              )}
              {/* Hello there! <img src={hand} width="23" alt="" /> */}
            </CoverTitle>
            <CoverSubtitle
            // className="coverSubtitle"
            // style={{ fontSize: "16px", textAlign: 'center' }}
            >
              {this.context.getThemeProperty(
                WEBCHAT.CUSTOM_PROPERTIES.headerSubtitle,
                ""
              )}
              {/* We help your business grow by connecting you to your customers. */}
            </CoverSubtitle>
          </Cover>
        </div>
        <CommonCover {...this.props} />
      </>
    );
  }
}
