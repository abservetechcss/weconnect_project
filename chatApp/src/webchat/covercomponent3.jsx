import React from "react";
import styled from "styled-components";
import { WebchatContext } from "../contexts";
import { StyledScrollbar } from "../webchat/components/styled-scrollbar";
// import { WebchatMessageList } from "../webchat/message-list";
import { WEBCHAT } from "../constants";
// import "../assets/css/cover.css";
// import whatsapp from "../assets/whatsapp.png";
// import chat from "../assets/chat.png";
// import email from "../assets/email.png";
// import logo from "../assets/brand avatar.png";
import search from "../assets/search.svg";
import user from "../assets/user.png";
// import hand from "../assets/waving-hand.png";
import SearchQuestion from "./searchQuestion";
import arrow from "../assets/Path 46470.svg";
// import cancelBtn from "../assets/AiFillCloseCircle.svg";
import cancelBtn from "../assets/AiFillCloseCircle.png";

import whatsapp from "../assets/whatsappIcon.png";
import chat from "../assets/message.png";
import email from "../assets/emailIcon.png";
import { ImCancelCircle } from "react-icons/im";
import IconButton from "@mui/material/IconButton";
import { MdArrowForwardIos } from "react-icons/md";
import CommonCover from "./commonCover";

const ConvCardTitle = styled.div`
  margin-left: 10px;
  font-size: 15px;
`;

const ConvCardSubtitle = styled.div`
  margin-left: 10px;
  color: gray;
`;
const cardBlock = {
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  boxShadow: "rgb(36 37 51 / 12%) 0px 6px 42px",
  borderRadius: "15px",
  font: "normal normal bold 12px/18px Nunito",
  fontFamily: "inherit",
  letterSpacing: "0px",
  color: "#1e1e1e",
  textAlign: "center",
  maxWidth: "110px",
  width: "100%",
  margin: "0",
  marginBottom: "4px",
  padding: "13px",
  whiteSpace: "break-spaces",
  wordBreak: "break-all",
  boxSizing: "border-box",
  cursor: "pointer",
  width: "100%",
  maxWidth: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  textDecoration: "none",
};

const Container = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  // padding: 0 28px;
`;

const Cover = styled.div`
  background: #00424f;
  height: 180px;
  border-radius: 0;
  border-radius: 14px;
  width: 100%;
  align-items: center;
  // top: -20px;
  position: relative;
  font-family: inherit;
  // width: calc(100% + 50px);
  // transform: translate(-25px, 0px);
  @media (max-width: 960px) {
    height: 180px;
  }
`;
const CoverInner = styled.div`
  background: #ffffff 0% 0% no-repeat padding-box;
  box-shadow: 0px 6px 42px #24253321;
  border-radius: 14px;
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  top: 66%;
  max-width: 75%;
  width: 100%;
  padding: 10px;
  height: 145px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`;
const Title = styled.p`
  color: #000;
  font-size: 17px;
  font-family: Nunito !important;
  text-align: center;
  font-weight: initial;
  margin: 10px 0;
`;
const SubTitle = styled.p`
    max-width: 230px;
    margin: 0 auto;
    letter-spacing:0.5px;
    font-weight: 400;
    font-family: Nunito !important;;
    text-align: center;
    font-size: 12px !important;
    color: #000;
}`;

const Stack = styled.div`
  flex-direction: row;
  justify-content: center;
  white-space: nowrap;
  // padding: 20px;
`;

const cancelBtnStyle = {
  position: "absolute",
  right: "5px",
  top: "5px",
  maxWidth: "50px",
  color: "inherit",
};
const cancelBtnIcon = {
  fontSize: "25px",
  color: "inherit",
};

const coverImg = {
  height: "auto",
};

export default class CoverComponent3 extends React.Component {
  static contextType = WebchatContext;

  constructor(props) {
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
    return (
      <>
        <style>
          {`
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
          .cardblock:hover {
            background: #80808021;
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
          .cover-page-section {
              background-color: #fff;
              border-radius: 20px;
          }
          .cover_page_block {
              padding: 15px;
              box-sizing: border-box;
              background: white;
              display: -webkit-box;
              display: -webkit-flex;
              display: -ms-flexbox;
              display: flex;
              -webkit-flex-direction: column;
              -ms-flex-direction: column;
              flex-direction: column;
              -webkit-box-pack: center;
              -webkit-justify-content: center;
              -ms-flex-pack: center;
              justify-content: center;
              width: 100%;
          }
          .continue_conversation_section {
              background-color: #fff;
              box-shadow: 0px 6px 42px rgb(36 37 51 / 6%);
              border-radius: 15px;
              overflow: hidden;
          }
          .continue_conversation_section .continue_conversation_block {
            width: 100%;
            display: flex;
            align-items: center;
            cursor: auto !important;
            padding: 10px 15px;
            box-sizing: border-box;
            }
            .continue_conversation_img {
                position: relative;
                display: flex;
                width: 52px;
            }
            .continue_conversation_img img:nth-last-child(1) {
                position: absolute;
                right: 0px;
                z-index: 99999;
            }
            .continue_conversation_section .continue_conversation_block img {
                width: 27px !important;
                height: 27px !important;
                border-radius: 50%;
                margin-right: 10px;
            }
            .continue_conversation_title {
              color: #1e1e1e;
              font-weight: 600;
              font-family: Nunito !important;;
              font-size: 14px;
              margin: 0;  
          }
          .continue_conversation_text {
              color: #1e1e1e;
              font-weight: 400;
              font-family: Nunito !important;;
              font-size: 12px;
              opacity: .6;
              margin: 0;
          }
          .small-title {
            font: normal normal bold 14px/24px Nunito;
            font-family: Nunito !important;
            letter-spacing: 0px;
            color: #1e1e1e;
            opacity: .6;
            font-weight:bold
        }
        .cover-page-section .message-coversation {
            display: flex;
            gap: 0px !important;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-items: flex-start;
            margin-top: 0px !important;
            flex-direction: column;
        } 
        .cover-page-section .card-block {
            display: flex;
            flex-direction: column;
            box-shadow: 0px 6px 42px rgb(36 37 51 / 6%);
            border-radius: 15px;
            font: normal normal bold 12px/18px Nunito;
            font-family: Nunito !important;;
            letter-spacing: 0px;
            color: #1e1e1e;
            text-align: center;
            max-width: 110px;
            width: 100%;
            margin: 0;
            padding: 13px;
            white-space: break-spaces;
            word-break: break-all;
            box-sizing: border-box;
            cursor: pointer !important;
            width: 100% !important;
            max-width: 100% !important;
            display: flex !important;
            flex-direction: row !important;
            align-items: center;
        }
        .cover-page-section .message-coversation span{
            display: block !important;
            width: 100%;
            text-align: left;
            margin-left: 0px !important;
            height: 40px !important;
            padding: 10px !important;
            max-width: 40px!important;
        }
        .cover-page-section .message-coversation img {
            max-width: 40px !important;
            width: 100% !important;
            margin: auto;
            object-fit: cover;
                height: auto;
            margin-bottom: 0px !important;
            cursor: pointer !important;
        }
        .cardtitle{
          font: normal normal bold 14px/24px Nunito;
          font-family: Nunito !important;
          font-weight:600;
          margin-top: -4px;
        } 
         .cardsubtitle{
          font: normal normal bold 14px/24px Nunito;
            font-family: Nunito !important;
            font-weight:500;
            margin-top: -5px;
        } 
        .pulse {
            display: inline-block;
          }
           .pulse:hover {
              animation-name: pulse;
              animation-duration: 1s;
              animation-timing-function: linear;
              animation-iteration-count: infinite;
            
          }
          @keyframes pulse {
            25% {
              transform: scale(1.1);
            }

            75% {
              transform: scale(.9);
            }
          }
         `}
        </style>
        <div
          style={{
            backgroundColor: "#fff",
            margin: "15px 15px 39px 15px",
          }}
          className="cover-page-section"
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
            {/* {this.props.ismobile && <img src={cancelBtn}
              alt=""
              style={cancelBtnStyle}
              onClick={()=>{
                this.props.closeWebchat();
              }}
            />} */}

            {this.props.ismobile && (
              <>
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
              </>
            )}

            <CoverInner>
              <img
                src={this.context.getThemeProperty(
                  WEBCHAT.CUSTOM_PROPERTIES.welcomeImg,
                  WEBCHAT.DEFAULTS.PROFILE
                )}
                style={{
                  // width: "32px",
                  maxWidth: "200px",
                  width: "100%",
                  height: "50px",
                  objectFit: "contain",
                  borderRadius: this.context.getThemeProperty(
                    WEBCHAT.CUSTOM_PROPERTIES.coverScale,
                    "50%"
                  ),
                }}
                alt=""
              />
              <Title>
                {this.context.getThemeProperty(
                  WEBCHAT.CUSTOM_PROPERTIES.headerTitle,
                  WEBCHAT.DEFAULTS.TITLE
                )}
              </Title>
              <SubTitle>
                {this.context.getThemeProperty(
                  WEBCHAT.CUSTOM_PROPERTIES.headerSubtitle,
                  ""
                )}
              </SubTitle>
            </CoverInner>
          </Cover>
        </div>
        <CommonCover {...this.props} />
      </>
    );
  }
}
