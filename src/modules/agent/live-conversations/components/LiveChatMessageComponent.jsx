import React, { Component, Fragment } from "react";
import { Tooltip, IconButton, MenuItem, Menu, Grid } from "@mui/material";
import messageUser from "../../../../assets/images/download.png";
import more from "../../../../assets/images/more-horizontal.svg";
import smile from "../../../../assets/images/smile.svg";
import video from "../../../../assets/images/video (1).svg";
import sendActive from "../../../../assets/images/sendActive.svg";
import { FormControl, InputGroup } from "react-bootstrap";
import TextareaAutosize from "react-textarea-autosize";
import moment from "moment";
import { connect } from "react-redux";
import { ImAttachment } from "react-icons/im";
import { Attachment } from "./messageComponents/Attachment";
import EmojiMartPickerComponent from "../../common/EmojiMartPickerComponent.jsx";
import MyMessage from "./MyMessage";
import OtherMessage from "./OtherMessage";
import { setNewVisitor } from "../../../../redux/actions/ReduxActionPage.jsx";
import doc from "../../../../assets/images/file3.svg";
import image from "../../../../assets/images/image1.svg";
import map from "../../../../assets/images/pin.png";
import headphone from "../../../../assets/images/headphones1.svg";
import {
  MIME_WHITELIST,
  getMediaType,
  MAX_ALLOWED_SIZE_MB,
  isAllowedSize,
} from "./attachment_lib";
import { uploadAttachment } from "../server/LiverConversationServer.js";
import { lightBlue } from "@mui/material/colors";

function getWordAtNthPosition(str, suggestions) {
  // const n = str.substring(position).match(/^[a-zA-Z0-9-/_]+/);
  // const p = str.substring(0, position).match(/[a-zA-Z0-9-/_]+$/);
  // if you really only want the word if you click at start or between
  // but not at end instead use if (!n) return

  const word = str.includes("/") ? "/" + str.split("/")[1] : str; //(p || "") + (n || ""); // demo
  console.log(word);
  let suggestionData = suggestions.filter((sdata, i) =>
    sdata.link.toLowerCase().includes(word.toLowerCase())
  );
  console.log(suggestionData);
  // return !p && !n ? "" : (p || "") + (n || "");
  return word == "" || word == "/" ? [] : suggestionData;
}

function uploadImageCallBack(file, botId, clientId, type) {
  return new Promise((resolve, reject) => {
    var formData = new FormData();

    formData.append("bot_id", botId);
    formData.append("client_id", clientId);
    formData.append("file", file);
    formData.append("type", type);

    uploadAttachment(
      formData,
      (data) => {
        resolve(data);
      },
      (error) => {
        console.log(error);
        reject();
      }
    );
  });
}

let activeMsgClass, chClassBreakPoint;
let groupMessage = [],
  populateMessage = [];

export class LiveChatMessageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endChatAnchorEl: null,
      isShowEmojiModal: false,
      emojiShow: [],
      width: window.screen.width,
      height: 0,
      messageText: "",
      showAttachment: false,
      suggestions: this.props.replyOption?.live_chat_settings?.reply_template,
      suggestionsTemp: [],
      currentFocus: 0,
    };
  }

  handleCloseAttach = () => {
    let _this = this;
    _this.setState({
      showAttachment: false,
    });
  };
  submitReplyMessage = () => {
    let _this = this;
    console.log("Message Text", _this.state.messageText);
    console.log("active vistor", _this.props.activeVisitor);
    if (_this.state.messageText.trim() !== "") {
      const currentAgentId = parseInt(localStorage.getItem("id"));
      _this.props.sendMessage({
        type: "chat",
        bot_id: _this.props.activeVisitor.bot_id,
        from: "agent",
        text: _this.state.messageText,
        client_id: _this.props.activeVisitor.vistor_id,
        agent_id: currentAgentId,
        file: "",
      });
    }
    _this.setState({
      messageText: "",
      suggestionsTemp: [],
    });
  };
  generateVideoLink = () => {
    let _this = this;
    const currentAgentId = parseInt(localStorage.getItem("id"));
    _this.props.sendMessage({
      type: "videochatlink",
      bot_id: _this.props.activeVisitor.bot_id,
      client_id: _this.props.activeVisitor.vistor_id,
      agent_id: currentAgentId,
    });
  };
  handleLocation = () => {
    let _this = this;
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition(async (location) => {
        const coords = location.coords;
        const currentAgentId = parseInt(localStorage.getItem("id"));
        _this.setState({
          showAttachment: false,
        });

        this.props.sendMessage({
          type: "chat",
          message_id: "",
          bot_id: _this.props.activeVisitor.bot_id,
          from: "agent",
          agent_id: currentAgentId,
          client_id: _this.props.activeVisitor.vistor_id,
          file: "",
          text: JSON.stringify({
            lat: coords.latitude,
            long: coords.longitude,
          }),
          answer_id: "location",
          extension: "location",
        });
      }, console.log);
    }
  };

  handleAttachment = async (event) => {
    // console.log(event.target.name);
    let _this = this;
    if (!isAllowedSize(event.target.files[0].size)) {
      throw new Error(
        `The file is too large. A maximum of ${MAX_ALLOWED_SIZE_MB}MB is allowed.`
      );
    }

    _this.setState({
      showAttachment: null,
      loading: true,
    });

    const filename = event.target.files[0].name;
    const extension = filename.split(".").pop();
    const flieType = event.target.files[0].type;

    var formData = new FormData();
    console.log("activeVisitor", _this.props.activeVisitor);

    formData.append("bot_id", _this.props.activeVisitor.bot_id);
    formData.append("client_id", _this.props.activeVisitor.vistor_id);
    formData.append("file", event.target.files[0]);
    formData.append("type", event.target.name);

    const res = await uploadImageCallBack(
      event.target.files[0],
      _this.props.activeVisitor.bot_id,
      _this.props.activeVisitor.vistor_id,
      event.target.name
    );

    console.log("res", res);

    // uploadAttachment(formData,
    //  async (res)=>{
    //     console.log("ers", res);
    //     if (res.status === "True") {
    if (res && res.file) {
      let type = getMediaType(flieType);
      if (
        [
          "pdf",
          "doc",
          "docx",
          "xls",
          "xlsx",
          "ppt",
          "pptx",
          "rtf",
          "odt",
          "odp",
          "ods",
        ].includes(extension)
      ) {
        type = "document";
      }
      const currentAgentId = parseInt(localStorage.getItem("id"));
      _this.setState({
        showAttachment: false,
      });
      this.props.sendMessage({
        type: "chat",
        message_id: "",
        bot_id: _this.props.activeVisitor.bot_id,
        from: "agent",
        agent_id: currentAgentId,
        client_id: _this.props.activeVisitor.vistor_id,
        file: "",
        text: res.file,
        answer_id: extension,
        extension: extension,
      });
    }
    // }
    //   },
    //   ()=>{

    //   })
  };

  render() {
    let _this = this;
    const endChatOpen = Boolean(this.state.endChatAnchorEl);
    return (
      <Fragment>
        <div className="block visitor-block">
          <div>
            <div className="header">
              <p>
                {_this.props.activeVisitor &&
                  _this.props.activeVisitor.vistor_name}
              </p>
              <IconButton
                color="primary"
                component="span"
                className="horizont-more-btn"
                id="basic-button"
                aria-controls={endChatOpen ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={endChatOpen ? "true" : undefined}
                onClick={(event) => {
                  _this.setState({
                    endChatAnchorEl: event.currentTarget,
                  });
                }}
              >
                <img src={more} alt="" />
              </IconButton>
            </div>
            <div className="chat_section" ref={_this.props.scollChat}>
              <p className="chat_date">
                {moment(_this.props.activeVisitor.datetime).calendar(null, {
                  lastWeek: "dddd, MMM D, YYYY hh:mm A",
                  lastDay: "[Yesterday], hh:mm A",
                  sameDay: "[Today], hh:mm A",
                  sameElse: "dddd, MMM D, YYYY hh:mm A",
                })}
              </p>
              {this.props.messages.map((message, i) => {
                const lastMessage = i === 0 ? null : this.props.messages[i - 1];
                const nextMessage =
                  i === this.props.messages.length - 1
                    ? null
                    : this.props.messages[i + 1];
                return message.from === "agent" ? (
                  <MyMessage
                    key={i}
                    lastMessage={lastMessage}
                    message={message}
                    nextMessage={nextMessage}
                  />
                ) : (
                  <OtherMessage
                    key={i}
                    lastMessage={lastMessage}
                    message={message}
                    nextMessage={nextMessage}
                  />
                );
              })}
            </div>
          </div>
          {_this.props.activeVisitor.status !== "closed" &&
          _this.props.activeVisitor.status !== "to_accept" &&
          _this.props.activeVisitor.status !== "endchatrefresh" &&
          _this.props.activeVisitor.status !== "videoLeft" &&
          _this.props.activeVisitor.status !== "endchat" &&
          _this.props.activeVisitor.status !== "reject" &&
          _this.props.activeVisitor.status !== "assign_to_me" &&
          _this.props.activeVisitor.chat_type !== "video_call" &&
          _this.props.activeVisitor.chat_type !== "video_chat" ? (
            <div className="type_text_block">
              {this.state.suggestionsTemp.length !== 0 && (
                <div className="message-suggest-block">
                  <div className="suggetion-block">
                    {this.state.suggestionsTemp.map((item, i) => {
                      return (
                        <p
                          key={"messageText_" + i}
                          id={"messageText_" + i}
                          style={
                            i == _this.state.currentFocus
                              ? {
                                  backgroundColor: "#eef5ff",
                                }
                              : {}
                          }
                          onClick={() => {
                            _this.setState({
                              messageText:
                                this.state.messageText.split("/")[0] +
                                item.type,
                              suggestionsTemp: [],
                            });
                          }}
                        >
                          {item.type}
                        </p>
                      );
                    })}
                  </div>
                </div>
              )}
              <fieldset style={{ opacity: "1" }}>
                {_this.state.isShowEmojiModal ? (
                  <EmojiMartPickerComponent
                    isShowEmojiModal={_this.state.isShowEmojiModal}
                    messageText={_this.state.messageText}
                    {..._this.props}
                    _this={_this}
                  />
                ) : null}
                <div className="msg_block">
                  <InputGroup className="type_msg_box">
                    <InputGroup.Text
                      id="emojis-btn"
                      role="button"
                      onClick={() => {
                        _this.setState({
                          isShowEmojiModal: true,
                        });
                      }}
                    >
                      <img alt="" src={smile} className="mb-1" />
                    </InputGroup.Text>
                    <TextareaAutosize
                      minRows={1}
                      maxRows={4}
                      value={this.state.messageText}
                      onChange={(e) => {
                        // const word = getWordAtNthPosition(e.target.value, e.target.selectionStart, _this.state.suggestions);
                        // console.log("word", word)
                        _this.setState({
                          messageText: e.target.value,
                          emoji: false,
                        });
                      }}
                      onFocus={(e) => {
                        _this.setState({ highlight: true });
                      }}
                      onKeyPress={(event) => {
                        if (event.key === "Enter" && !event.shiftKey) {
                          if (_this.state.suggestionsTemp.length == 0) {
                            _this.submitReplyMessage();
                            event.preventDefault();
                          } else {
                            event.preventDefault();
                            if (_this.state.currentFocus == -1) {
                              _this.setState({
                                suggestionsTemp: [],
                              });
                            }
                            _this.setState({
                              messageText:
                                _this.state.messageText.split("/")[0] +
                                _this.state.suggestionsTemp[
                                  _this.state.currentFocus
                                ].type,
                              suggestionsTemp: [],
                              currentFocus: 0,
                            });
                          }
                        }
                      }}
                      onKeyDown={(event) => {
                        console.log(event.keyCode, _this.state.currentFocus);
                        if (event.keyCode === 38) {
                          //up
                          if (_this.state.currentFocus !== -1) {
                            _this.setState({
                              currentFocus: _this.state.currentFocus - 1,
                            });
                          }
                        } else if (event.keyCode === 40) {
                          //down
                          if (
                            _this.state.currentFocus !==
                            _this.state.suggestionsTemp.length - 1
                          ) {
                            _this.setState({
                              currentFocus: _this.state.currentFocus + 1,
                            });
                          }
                        }
                      }}
                      onKeyUp={(event) => {
                        if (
                          event.target.value.startsWith("/") ||
                          event.target.value.includes("/") ||
                          event.target.value.length >= 1
                        ) {
                          console.log(event);
                          const word = getWordAtNthPosition(
                            event.target.value,
                            _this.state.suggestions
                          );
                          _this.setState({
                            suggestionsTemp: word,
                          });
                        }
                      }}
                      // onClick={(e) => {
                      //   const word = getWordAtNthPosition(
                      //     e.target.value,
                      //     // e.target.selectionStart,
                      //     _this.state.suggestions
                      //   );
                      //   console.log("word", word);
                      // }}
                      onMouseDown={() => {
                        _this.setState({ isShowEmojiModal: false });
                      }}
                      onBlur={() => {
                        _this.setState({
                          isShowEmojiModal: false,
                          highlight: false,
                        });
                      }}
                      required
                      placeholder="Type message.."
                    />
                    <InputGroup.Text
                      role="button"
                      onClick={(e) => {
                        _this.setState({
                          showAttachment: e.currentTarget,
                        });
                      }}
                      className="send-btn"
                    >
                      <ImAttachment
                        color="#1e1e1e"
                        fill="#1e1e1e"
                        stroke="#1e1e1e"
                      />
                    </InputGroup.Text>
                    <InputGroup.Text
                      role="button"
                      onClick={() => {
                        _this.submitReplyMessage();
                      }}
                      disabled={_this.state.messageText === ""}
                      className="send-btn"
                    >
                      <img
                        alt=""
                        src={sendActive}
                        style={
                          _this.state.messageText === ""
                            ? {
                                opacity: "0.3",
                              }
                            : {
                                opacity: "1",
                              }
                        }
                      />
                    </InputGroup.Text>
                  </InputGroup>

                  <Menu
                    id="basic-menu"
                    anchorEl={this.state.showAttachment}
                    open={Boolean(this.state.showAttachment)}
                    sx={{
                      zIndex: "99999",
                    }}
                    className="attachment_popup_block"
                    onClose={this.handleCloseAttach}
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
                          <Attachment
                            attachment={true}
                            onChange={this.handleAttachment}
                            accept={MIME_WHITELIST.document.join(",")}
                            icon={doc}
                            text="Document"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Attachment
                            attachment={true}
                            onChange={this.handleAttachment}
                            accept={MIME_WHITELIST.image.join(",")}
                            icon={image}
                            text="Image"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Attachment
                            attachment={false}
                            onChange={this.handleLocation}
                            accept={MIME_WHITELIST.image.join(",")}
                            icon={map}
                            text="Location"
                          />
                        </Grid>
                        <Grid item xs={4}>
                          <Attachment
                            attachment={true}
                            onChange={this.handleAttachment}
                            accept={MIME_WHITELIST.audio.join(",")}
                            icon={headphone}
                            text="Audio"
                          />
                        </Grid>
                      </Grid>
                    </div>
                  </Menu>
                  <div
                    className="text-video-block"
                    onClick={() => {
                      _this.generateVideoLink();
                    }}
                  >
                    <img alt="" src={video} />
                  </div>
                </div>
              </fieldset>
            </div>
          ) : (
            <>
              {_this.props.activeVisitor.status === "closed" && (
                <div className="chat_end">Chat Ended</div>
              )}
              {(_this.props.activeVisitor.status === "endchatrefresh" ||
                _this.props.activeVisitor.status === "videoLeft" ||
                _this.props.activeVisitor.status === "reject" ||
                _this.props.activeVisitor.status === "endchat") && (
                <div className="chat_end">
                  {_this.props.activeVisitor.message}
                </div>
              )}
            </>
          )}
        </div>
        <Menu
          className="end-chat-model-block"
          id="basic-menu"
          anchorEl={_this.state.endChatAnchorEl}
          open={endChatOpen}
          onClose={() => {
            _this.setState({
              endChatAnchorEl: false,
            });
          }}
          MenuListProps={{
            "aria-labelledby": "basic-button",
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
          {_this.props.activeVisitor.leads !== 1 &&
            _this.props.activeVisitor.status !== "assign_to_me" &&
            _this.props.activeVisitor.status !== "to_accept" &&
            _this.props.activeVisitor.status !== "endchatrefresh" &&
            _this.props.activeVisitor.status !== "reject" && (
              <MenuItem
                key="lead"
                onClick={(e) => {
                  let Obj = this.props.activeVisitor;
                  this.setState({
                    endChatAnchorEl: false,
                  });
                  let tempObj = {};
                  tempObj.vistorid = Obj.vistor_id;
                  tempObj.leads = Obj.leads === 1 ? 0 : 1;
                  this.props.updateMarkLeads(tempObj);
                }}
              >
                Mark as lead
              </MenuItem>
            )}

          {_this.props.activeVisitor.leads === 1 &&
            _this.props.activeVisitor.status !== "assign_to_me" &&
            _this.props.activeVisitor.status !== "to_accept" &&
            _this.props.activeVisitor.status !== "endchatrefresh" &&
            _this.props.activeVisitor.status !== "reject" && (
              <MenuItem
                key="lead"
                onClick={(e) => {
                  let Obj = this.props.activeVisitor;
                  this.setState({
                    endChatAnchorEl: false,
                  });
                  let tempObj = {};
                  tempObj.vistorid = Obj.vistor_id;
                  tempObj.leads = Obj.leads === 1 ? 0 : 1;
                  this.props.updateMarkLeads(tempObj);
                }}
              >
                Remove from lead
              </MenuItem>
            )}

          {_this.props.activeVisitor.accept === "assign_to_me" && (
            <MenuItem
              key="lead"
              onClick={(e) => {
                let Obj = this.props.activeVisitor;
                this.setState({
                  endChatAnchorEl: false,
                });
                this.props.chatWebscocketAction("assign_to_me", Obj);
              }}
            >
              Assign to me
            </MenuItem>
          )}

          {_this.props.activeVisitor.accept === "assign_to_me" && (
            <MenuItem
              key="lead"
              onClick={(e) => {
                let Obj = this.props.activeVisitor;
                this.setState({
                  endChatAnchorEl: false,
                });
                this.props.chatWebscocketAction("assign_to_reject", Obj);
              }}
            >
              Reject
            </MenuItem>
          )}

          {_this.props.activeVisitor.status !== "closed" &&
            _this.props.activeVisitor.status !== "to_accept" &&
            _this.props.activeVisitor.status !== "reject" &&
            _this.props.activeVisitor.status !== "endchatrefresh" &&
            _this.props.activeVisitor.status !== "endchat" &&
            _this.props.activeVisitor.status !== "assign_to_me" && (
              <MenuItem
                onClick={() => {
                  _this.setState({
                    endChatAnchorEl: false,
                  });
                  // _this.props._this.setState({
                  //   selectedVisitor: false,
                  // });
                  const currentAgentId = parseInt(localStorage.getItem("id"));
                  var data = {
                    type: "endchat",
                    bot_id: this.props.activeVisitor.vistor_id.split("-")[0],
                    client_id: this.props.activeVisitor.vistor_id,
                    agent_id: currentAgentId,
                  };
                  console.log("dataSend", this.props.activeVisitor);
                  _this.props.sendMessage(data);
                }}
              >
                End Chat
              </MenuItem>
            )}
        </Menu>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  const newVisitor = state.webchat.newVisitor || [];
  const replyOption = state.getUserProfile.settings || {};
  return {
    newVisitor,
    replyOption,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    setNewVisitor: (data) => {
      dispatch(setNewVisitor(data));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiveChatMessageComponent);
