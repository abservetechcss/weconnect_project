import React from "react";
import styled from "styled-components";
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
import calendar from "../assets/calendar.svg";
import calendarIcon from "../assets/calender.svg";
import bookIcon from "../assets/books.svg";
// import logo from "../assets/brand avatar.png";
import search from "../assets/search.svg";
import user from "../assets/user.png";
// import hand from "../assets/waving-hand.png";
import SearchQuestion from "./searchQuestion";
import arrow from "../assets/Path 46470.svg";
// import { ImCancelCircle } from "react-icons/im";
import { MdArrowForwardIos } from "react-icons/md";

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
  font-family: Nunito;
  width: calc(100% + 30px);
  transform: translate(-25px, 0px);
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
  width: "22px",
  height: "22px",
};
const CoverTitle = styled.h2`
  text-align: center;
  font: normal normal bold 17px/32px Nunito;
  font-family: Nunito !important;
  letter-spacing: 0px;
  width: 300px;
  margin: 3px auto 0px auto !important;
  color: white;
  font-weight: bold;
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
  margin-bottom: 6px;
`;
const searchInput = {
  border: "0",
  outline: "none",
  backgroundColor: "#fff0",
  width: "100%",
  font: "normal normal normal 12px/18px Nunito",
  fontFamily: "Nunito !important",
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

const Backdrop = styled.div`
  position: fixed;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  background-color: #00000082;
  z-index: 99999998;
`;

// const CloseBtn = styled.div`
//   color: #000;
//   z-index: 9999;
//   text-align: right;
//   font-size: 30px;
//   cursor: pointer;
//   cursor: pointer;
//   width: 20px;
//   flex: 0 0 20px;
//   height: 20px;
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   box-shadow: 0px 0px 10px #eaecf2;
//   border-radius: 50%;
// `;

const CloseBtn = styled.div`
  color: #000;
  z-index: 9999;
  text-align: right;
  font-size: 30px;
  line-height: 25px;
  cursor: pointer;
`;

const CardView = styled.div`
  max-height: calc(100% - 35px);
  overflow-y: auto;
  /* width */
  &::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: #fff;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #eaecf2;
    border-radius: 10px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #eaecf2;
    border-radius: 10px;
  }
`;

const PopupArticle = styled.div`
  position: fixed;
  top: 10px;
  bottom: 10px;
  right: 10px;
  left: 10px;
  padding: 10px;
  border-radius: 10px;
  background-color: #fff;
  transition: 1s;
  transform-origin: center;
  z-index: 99999999;
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
  boxShadow: "0px 6px 42px rgb(36 37 51 / 6%)",
  borderRadius: "15px",
  font: "normal normal 600 12px/18px Nunito",
  fontFamily: "Nunito",
  letterSpacing: "0px",
  color: "#1e1e1e",
  textAlign: "center",
  maxWidth: "110px",
  width: "100%",
  margin: "0",
  padding: "13px",
  whiteSpace: "break-spaces",
  wordBreak: "break-word",
  boxSizing: "border-box",
  cursor: "pointer",
  width: "100%",
  maxWidth: "100%",
  display: "flex",
  flexDirection: "row",
  alignItems: "center",
  textDecoration: "none",
};

let controllerGetSettings = null;
export default class CommonCover extends React.Component {
  static contextType = WebchatContext;

  constructor(props, context) {
    super(props);
    this.state = {
      date: "",
      reply: false,
      articleshow: {
        modalcontent: "",
        modalshow: false,
      },
    };
  }

  handleAction(action) {
    if (action === "chat") {
      this.props.closeComponent();
      this.context.fetchChatSettings();
      this.context.loadInitialResponse();
    } else {
      this.context.openWebview(SearchQuestion, { data: "myData" });
    }
  }

  sendReply(e, item) {
    let blockAnchor = true;
    if (blockAnchor) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (e.currentTarget.getAttribute("href") !== "#") {
      this.context.openWebview(e.currentTarget.getAttribute("href"));
    }
  }

  handleArticleClick(articleId) {
    const abortableFetch = "signal" in new Request("") ? window.fetch : fetch;
    if (controllerGetSettings) {
      controllerGetSettings.abort();
    }
    abortableFetch(
      `${process.env.REACT_APP_ENV_API_URL}chatbot/knowledgebase?article_id=${articleId}`,
      {
        signal: controllerGetSettings,
      }
    )
      .then((response) => {
        return response.json();
      })
      .then(async (res) => {
        console.log("res...", res);
        this.setState({
          articleshow: {
            modalcontent: res.articles[0],
            modalshow: true,
          },
        });
      })
      .catch((err) => {
        console.log("error...", err);
      });
  }

  render() {
    return (
      <StyledScrollbar
        style={{ flex: 1 }}
        ismessagescontainer="true"
        autoHide={true}
        id="welcomecard-scrollable-content"
        // className="block-2"
      >
        <style>
          {`
            .user_count_img{
              width: 7px;
              height: 7px;
              border: 2px solid #c5c5c5;
              border-radius: 50%;
              background: #c5c5c5;
              line-height: 9px;
              padding: 4px;
              position: absolute;
              bottom: 8px;
              right: 3px;
              font-size: 9px;
              display: flex;
              align-items: center;
              justify-content: center;
              z-index: 999;
            }
            .popuparticle{
              position: fixed;
              top: 0px;
              bottom: 0px;
              right: 0px;
              left: 0px;
              background-color: #fff;
              z-index: 9999;
            }
        `}
        </style>
        <section
          // className="cover-page-section"
          style={{ fontFamily: "Nunito" }}
        >
          <Container
            className=""
            style={{ padding: "15px", boxSizing: "border-box" }}
          >
            {this.context.webchatState.chatsettings
              .show_active_agent_checkbox === 1 && (
              <div
                // className="continue_conversation_section"
                style={{
                  marginBottom: "2px",
                  backgroundColor: "#fff",
                  boxShadow: "0px 6px 42px #2425330f",
                  borderRadius: "15px",
                  overflow: "hidden",
                }}
              >
                <div
                  // className="continue_conversation_block active_agent_block"
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    cursor: "auto !important",
                    padding: "7px 24px",
                    boxSizing: "border-box",
                  }}
                >
                  <div
                    className="continue_conversation_imgs"
                    style={{
                      position: "relative",
                      display: "flex",
                      width: "52px",
                      height: "52px",
                    }}
                  >
                    {this.props.chatSettings.live_agents_profile_pic &&
                    this.props.chatSettings.live_agents_profile_pic.length !==
                      0 ? (
                      this.props.chatSettings.live_agents_profile_pic.map(
                        (data, i) =>
                          i <= 1 ? (
                            <img
                              src={data}
                              alt=""
                              style={{
                                width: "33px",
                                height: "33px",
                                borderRadius: "50px",
                                position: "absolute",
                                top: "10px",
                                right: i !== 1 ? "25px" : "unset",
                                left: i == 1 ? "-1px" : "unset",
                                zIndex: i == 1 ? "2" : "1",
                              }}
                            />
                          ) : (
                            <></>
                          )
                      )
                    ) : (
                      <></>
                    )}
                    {this.props.chatSettings.active_agents_count &&
                    this.props.chatSettings.active_agents_count > 2 ? (
                      <div className="user_count_img">
                        {"+" + this.props.chatSettings.active_agents_count - 2}
                      </div>
                    ) : (
                      <></>
                    )}

                    {/* <img
                      src={user}
                      alt=""
                      style={{
                        width: "33px",
                        height: "33px",
                        borderRadius: "50px",
                        position: "absolute",
                        top: "10px",
                        right: "25px",
                        zIndex: "1",
                      }}
                    />
                    <img
                      src={user}
                      alt=""
                      style={{
                        width: "33px",
                        height: "33px",
                        position: "absolute",

                        zIndex: "2",
                        top: "10px",
                        left: "-1px",
                      }}
                    /> */}
                  </div>
                  <div style={{ width: "100%" }}>
                    <p
                      // className="continue_conversation_title"
                      style={{
                        color: "#1e1e1e",
                        fontWeight: "500",
                        fontFamily: "Nunito",
                        fontSize: "14px",
                        margin: "0",
                      }}
                    >
                      {this.context.webchatState.chatsettings
                        .active_agents_count &&
                        this.context.webchatState.chatsettings
                          .active_agents_count}{" "}
                      {this.props.chatSettings.show_active_agent_value}
                    </p>
                    <p
                      // className="continue_conversation_text"
                      style={{
                        color: "#1e1e1e",
                        fontWeight: "400",
                        fontFamily: "Nunito",
                        fontSize: "12px",
                        opacity: "0.6",
                        margin: "0",
                      }}
                    >
                      {/* We will be responding in duis aute irure dolor in */}
                      {/* {this.context.webchatState.chatsettings
                        .active_agents_count > 0
                        ? this.context.getThemeProperty(
                            WEBCHAT.CUSTOM_PROPERTIES.onlineStatus,
                            "Online"
                          )
                        : this.context.getThemeProperty(
                            WEBCHAT.CUSTOM_PROPERTIES.offlineStatus,
                            "Offline"
                          )} */}
                      {this.context.webchatState.chatsettings
                        .active_agents_count &&
                      this.context.webchatState.chatsettings
                        .active_agents_count == 1
                        ? this.props.chatSettings
                            .show_active_agent_subtitle_online
                        : this.props.chatSettings
                            .show_active_agent_subtitle_offline}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {this.context.webchatState.chatsettings
              .show_continue_conv_checkbox === 1 && (
              <div>
                <SmallTitle
                // className="small-title"
                >
                  {this.props.chatSettings.show_continue_conv_value}
                </SmallTitle>
                <div
                  // className="continue_conversation_section"
                  style={{
                    marginTop: "10px",
                    marginBottom: "10px",
                    backgroundColor: "#fff",
                    boxShadow: "0px 6px 42px rgb(36 37 51 / 6%)",
                    borderRadius: "15px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    // className="continue_conversation_block"
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      cursor: "auto !important",
                      padding: "10px 15px",
                      boxSizing: "border-box",
                    }}
                  >
                    <img
                      src={user}
                      style={{
                        maxWidth: "35px",
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        marginRight: "10px",
                      }}
                      alt=""
                    />
                    <div style={{ width: "100%" }}>
                      <ContinueConversationTitle
                      // className="continue_conversation_title"
                      >
                        WeConnect.chat
                      </ContinueConversationTitle>
                      <div
                        // className="continue_conversation_date"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <ContinueConversationText
                        // className="continue_conversation_text"
                        >
                          Fair enough.. Well Hi there, hope…
                        </ContinueConversationText>
                        <ContinueConversationText
                        // className="continue_conversation_text"
                        >
                          Aug 9, 2021
                        </ContinueConversationText>
                      </div>
                    </div>
                  </div>
                  <div
                    // className="continue_conversation_block"
                    style={{
                      width: "100%",
                      display: "flex",
                      alignitems: "center",
                      cursor: "auto !important",
                      padding: "10px 15px",
                      boxSizing: "border-box",
                    }}
                  >
                    <div
                      // className="continue_conversation_img"
                      style={{
                        position: "relative",
                        display: "flex",
                        width: "52px",
                        height: "45px",
                      }}
                    >
                      <img
                        src={user}
                        alt=""
                        style={{
                          width: "27px",
                          height: "27px",
                          borderRadius: "50%",
                          marginRight: "10px",
                        }}
                      />
                      <img
                        src={user}
                        alt=""
                        style={{
                          width: "27px",
                          height: "27px",
                          borderRadius: "50%",
                          marginRight: "10px",
                          position: "absolute",
                          right: "0px",
                          zIndex: "99999",
                        }}
                      />
                      <img
                        src={user}
                        alt=""
                        style={{
                          width: "27px",
                          height: "27px",
                          borderRadius: "50%",
                          marginRight: "10px",
                          position: "absolute",
                          right: "20px",
                          zIndex: "99999",
                        }}
                      />
                    </div>
                    <div style={{ width: "100%" }}>
                      <ContinueConversationTitle
                      // className="continue_conversation_title"
                      >
                        WeConnect.chat
                      </ContinueConversationTitle>
                      <div
                        // className="continue_conversation_date"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          width: "100%",
                        }}
                      >
                        <ContinueConversationText
                        // className="continue_conversation_text"
                        >
                          You: Fair enough.. Well Hi there…
                        </ContinueConversationText>
                        <ContinueConversationText
                        // className="continue_conversation_text"
                        >
                          Feb 9, 2021
                        </ContinueConversationText>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {this.context.webchatState.chatsettings
              .show_conv_starter_card_checkbox === 1 && (
              <>
                <SmallTitle
                // className="small-title"
                >
                  {this.props.chatSettings.start_a_new_conversation_value}
                </SmallTitle>
                <Stack
                  // className="MessageCoversation"
                  style={messageCoversation}
                  // style={{
                  //   display: "flex",
                  //   gap: "0px !important",
                  //   flexWrap: "wrap",
                  //   justifyContent: "flex-start",
                  //   alignItems: "flex-start",
                  //   marginTop: "10px !important",
                  //   flexDirection: "column",
                  // }}
                >
                  {this.context.webchatState.chatsettings.chat_now_checkbox ===
                    1 && (
                    <div
                      // className="card-block"
                      style={cardBlock}
                      className="cardblock"
                      onClick={() => this.handleAction("chat")}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                        }}
                      >
                        <span
                          style={{
                            backgroundColor:
                              this.context.webchatState.chatsettings
                                .chat_now_icon_color || "#4b5ec9",
                            maxWidth: "35px",
                            width: "100%",
                            borderRadius: "50px",
                            textAlign: "center",
                            padding: "7px",
                            boxSizing: "border-box",
                            height: "35px",
                            display: "block",
                            marginLeft: "0px",
                          }}
                        >
                          <img
                            src={chat}
                            style={{
                              marginBottom: "15px",
                              height: "auto",
                              width: "100%",
                            }}
                            alt=""
                          />
                        </span>

                        <div
                          style={{
                            textAlign: "left",
                          }}
                        >
                          <ConvCardTitle>
                            {this.props.chatSettings.chat_now_value}
                          </ConvCardTitle>
                          <ConvCardSubtitle
                            style={{
                              width: "35ch",
                              overflow: "hidden",
                              whiteSpace: "nowrap",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {this.props.chatSettings.chat_now_subtitle}
                          </ConvCardSubtitle>
                        </div>
                      </div>
                      <p
                        style={{
                          float: "right",
                          textAlign: "right",
                        }}
                      >
                        <MdArrowForwardIos
                          style={{ fontSize: "18px", color: "darkgray" }}
                        />
                      </p>
                    </div>
                  )}
                  {this.context.webchatState.chatsettings.whatsapp_checkbox ===
                    1 && (
                    <a
                      // className="card-block"
                      style={cardBlock}
                      className="cardblock"
                      href={this.props.chatSettings.whatsapp_hyperlink}
                      // style={{ textDecoration: "none" }}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          width: "100%",
                        }}
                      >
                        <span
                          style={{
                            backgroundColor:
                              this.context.webchatState.chatsettings
                                .whatsapp_icon_color || "#4bc859",
                            maxWidth: "35px",
                            width: "100%",
                            borderRadius: "50px",
                            textAlign: "center",
                            boxSizing: "border-box",
                            height: "35px",
                            display: "flex",
                            marginLeft: "0px",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <img src={whatsapp} style={coverImg} alt="" />
                        </span>

                        <div
                          style={{
                            textAlign: "left",
                          }}
                        >
                          <ConvCardTitle>
                            {this.props.chatSettings.whatsapp_value}
                          </ConvCardTitle>
                          <ConvCardSubtitle>
                            {this.props.chatSettings.whatsapp_subtitle}
                          </ConvCardSubtitle>
                        </div>
                      </div>
                      <p
                        style={{
                          float: "right",
                          textAlign: "right",
                        }}
                      >
                        <MdArrowForwardIos
                          style={{ fontSize: "18px", color: "darkgray" }}
                        />
                      </p>
                    </a>
                  )}

                  {this.context.webchatState.chatsettings.email_checkbox ===
                    1 && (
                    <a
                      // className="card-block"
                      style={cardBlock}
                      className="cardblock"
                      href={
                        this.props.chatSettings &&
                        this.props.chatSettings.email_hyperlink !== ""
                          ? this.props.chatSettings.email_hyperlink
                          : "#"
                      }
                      onClick={(e) => {
                        this.sendReply(
                          e,
                          this.props.chatSettings.email_hyperlink
                        );
                      }}
                      rel="noreferrer"
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          width: "100%",
                        }}
                      >
                        <span
                          style={{
                            backgroundColor:
                              this.context.webchatState.chatsettings
                                .email_icon_color || "#00ac8b",
                            maxWidth: "35px",
                            width: "100%",
                            borderRadius: "50px",
                            textAlign: "center",
                            padding: "7px",
                            boxSizing: "border-box",
                            height: "35px",
                            display: "block",
                            marginLeft: "0px",
                          }}
                        >
                          <img
                            src={calendarIcon}
                            style={{
                              height: "21px",
                              width: "21px",
                            }}
                            alt=""
                          />
                        </span>

                        <div
                          style={{
                            textAlign: "left",
                          }}
                        >
                          <ConvCardTitle>
                            {this.props.chatSettings.email_value}
                          </ConvCardTitle>
                          <ConvCardSubtitle>
                            {this.props.chatSettings.email_subtitle}
                          </ConvCardSubtitle>
                        </div>
                      </div>
                      <p
                        style={{
                          float: "right",
                          textAlign: "right",
                        }}
                      >
                        <MdArrowForwardIos
                          style={{ fontSize: "18px", color: "darkgray" }}
                        />
                      </p>
                    </a>
                  )}

                  {this.context.webchatState.chatsettings
                    .knowledge_base_checkbox === 1 && (
                    <div
                      // className="card-block"
                      onClick={() => this.handleAction("")}
                      style={cardBlock}
                      className="cardblock"
                      // style={{ textDecoration: "none" }}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "flex-start",
                          width: "100%",
                        }}
                      >
                        <span
                          style={{
                            backgroundColor:
                              this.context.webchatState.chatsettings
                                .knowledge_base_icon_color || "#774bc9",
                            maxWidth: "35px",
                            width: "100%",
                            borderRadius: "50px",
                            textAlign: "center",
                            padding: "7px",
                            boxSizing: "border-box",
                            height: "35px",
                            display: "block",
                            marginLeft: "0px",
                          }}
                        >
                          <img
                            src={bookIcon}
                            style={{
                              height: "21px",
                              width: "21px",
                            }}
                            alt=""
                          />
                        </span>

                        <div
                          style={{
                            textAlign: "left",
                          }}
                        >
                          <ConvCardTitle>
                            {this.props.chatSettings.knowledge_base_value}
                          </ConvCardTitle>
                          <ConvCardSubtitle>
                            {this.props.chatSettings.knowledge_base_subtitle}
                          </ConvCardSubtitle>
                        </div>
                      </div>
                      <p
                        style={{
                          float: "right",
                          textAlign: "right",
                        }}
                      >
                        <MdArrowForwardIos />
                      </p>
                    </div>
                  )}

                  {/* <div className="card-block">
              <img src={messenger} />
              Messenger
            </div> */}
                  {/* {this.context.webchatState.chatsettings.whatsapp_checkbox===1 && <div className="card-block">
              <img src={whatsapp} />
              Video
            </div>} */}
                </Stack>
              </>
            )}
            {this.context.webchatState.chatsettings.show_search_bar_checkbox ===
              1 && (
              <div
                // className="help-block"
                style={{
                  boxShadow: "0px 6px 42px #2425330f",
                  borderRadius: "18px",
                  backgroundColor: "#fff",
                }}
              >
                {/* {JSON.stringify(this.props.chatSettings.articles)} */}
                <div
                  // className="help-search-box"
                  style={{ padding: "10px 15px 12px 15px" }}
                >
                  <SmallTitle
                  // className="small-title"
                  >
                    {this.props.chatSettings.show_search_bar_value}
                  </SmallTitle>
                  <div
                    // className="search"
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#f9f9f9",
                      borderRadius: "33px",
                      padding: "12px",
                    }}
                  >
                    <input
                      type="search"
                      placeholder="Search articles…"
                      readOnly={true}
                      onClick={() => this.handleAction("whatsapp")}
                      style={searchInput}
                    />
                    <img src={search} alt="" style={{ width: "15px" }} />
                  </div>
                </div>
                <div
                  // className="help-question-box"
                  style={{
                    // paddingBottom: "10px",
                    padding: "1px 15px",
                  }}
                >
                  <SmallTitle
                  // className="small-title"
                  >
                    Suggested articles
                  </SmallTitle>
                  {this.props.chatSettings?.articles &&
                  this.props.chatSettings?.articles?.length !== 0 ? (
                    this.props.chatSettings?.articles?.map((data, i) => (
                      <>
                        <div
                          key={"article_" + i}
                          onClick={() => {
                            this.handleArticleClick(data.id);
                          }}
                          style={{
                            background: "#fff 0% 0% no-repeat padding-box",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "1px 0px",
                            fontSize: "14px",
                            height: "45px",
                            marginTop: "10px !important",
                            cursor: "pointer",
                          }}
                        >
                          {data.newtab === 1 ? (
                            <a
                              href={data.slug}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                textDecoration: "none",
                                font: "normal normal bold 13px/19px Nunito",
                                fontFamily: "Nunito !important",
                                letterSpacing: "0px",
                                color: "gray",
                                margin: "0 !important",
                                cursor: "pointer",
                              }}
                            >
                              {data.title}
                            </a>
                          ) : (
                            <p
                              onClick={() => {
                                this.setState({
                                  articleshow: {
                                    modalcontent: i,
                                    modalshow: true,
                                  },
                                });
                              }}
                              style={{
                                font: "normal normal bold 13px/19px Nunito",
                                fontFamily: "Nunito !important",
                                letterSpacing: "0px",
                                color: "gray",
                                margin: "0 !important",
                                cursor: "pointer",
                              }}
                            >
                              {data.title}
                            </p>
                          )}
                          {/* <p
                            style={{
                              font: "normal normal bold 13px/19px Nunito",
                              fontFamily: "Nunito !important",
                              letterSpacing: "0px",
                              color: "gray",
                              margin: "0 !important",
                              cursor: "pointer",
                            }}
                          >
                            {data.title}
                          </p> */}
                          <MdArrowForwardIos
                            style={{ fontSize: "18px", color: "darkgray" }}
                          />
                        </div>
                      </>
                    ))
                  ) : (
                    <></>
                  )}
                </div>
              </div>
            )}
          </Container>
        </section>

        {this.state.articleshow?.modalshow ? (
          <>
            <PopupArticle>
              <CloseBtn
                onClick={() => {
                  this.setState({
                    articleshow: {
                      modalshow: false,
                    },
                  });
                }}
              >
                &times;
              </CloseBtn>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "0px 0px 10px 0px",
                }}
              >
                <p
                  style={{
                    margin: "0px",
                  }}
                >
                  {this.state.articleshow.modalcontent.title}
                </p>
              </div>
              <CardView>
                <div
                  dangerouslySetInnerHTML={{
                    __html: this.state.articleshow.modalcontent.description,
                  }}
                ></div>
              </CardView>
            </PopupArticle>
            <Backdrop />
          </>
        ) : (
          <></>
        )}
      </StyledScrollbar>
    );
  }
}
