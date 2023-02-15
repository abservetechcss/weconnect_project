import React, { Component, Fragment } from "react";
import left from "../../../assets/images/corner-up-left.svg";
import all from "../../../assets/images/Group 20107.svg";
import forward from "../../../assets/images/corner-up-left-1.svg";
import star from "../../../assets/images/star (2).svg";
import uploadImg from "../../../assets/images/image.svg";
import checkedStar from "../../../assets/images/star (3).svg";
import menu from "../../../assets/images/Group 19493.svg";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import bold1 from "../../../assets/images/bold.svg";
import { Button, MenuItem, Tooltip, IconButton, Menu } from "@mui/material";
import { Link, withRouter } from "react-router-dom";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import moment from "moment";
import draftToHtml from "draftjs-to-html";
import ToolbarCustomComponent from "./ToolbarCustomComponent.jsx";
import {
  starredEmail,
  leadEmail,
  uploadImageCallBack,
  saveDraft,
} from "./server/OfflineMessageServer.js";
import { Accordion, Form } from "react-bootstrap";
import createImagePlugin from "@draft-js-plugins/image";
import ThreadMessageComponent from "./threadMessageComponent";
import { ReactMultiEmail, isEmail } from "react-multi-email";
// import EditorComponent from "./editorComponent";
import htmlToDraft from "html-to-draftjs";
import { AlertContext } from "../../common/Alert";
import {
  getAllOfflineMsgList,
  replySingleMessage,
} from "./server/OfflineMessageServer";

const imagePlugin = createImagePlugin();
const plugins = [imagePlugin];
export class IndividualOfflineMessageComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    const editorState = EditorState.createEmpty();
    this.state = {
      reply: false,
      editorState,
      anchorEl: null,
      showModal: false,
      star: false,
      isShowEmojiModal: false,
      messageText: "",
      isShowGifImgModal: false,
      messages: [],
      offlinemsglist: {},
      message: {},
      ccEmails: [],
      bccEmails: [],
      toEmails: [],
      clienId: "",
      individualMessage: {},
      threadEmailList: [],
    };
    this.scrollRef = React.createRef();
    this.websocket = false;
    this.handleCustomButtonAction = this.handleCustomButtonAction.bind(this);
  }

  sendMessage(message) {
    let _this = this;

    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      _this.context.showLoading();
      this.websocket.send(JSON.stringify(message));

      clearTimeout(this.sendMessageTimeout);
      this.sendMessageTimeout = setTimeout(() => {
        this.context.showAlert({
          type: "error",
          message: "send Message Failed",
        });
        _this.context.showLoading(false);
      }, 12000);
    }
  }

  initWebsocketConnection(clientId) {
    const new_websocket_url =
      process.env.REACT_APP_ENV_WEBSOCKET_URL + "?id=" + clientId;
    this.websocket = window.WebSocket
      ? new window.WebSocket(new_websocket_url)
      : new window.MozWebSocket(new_websocket_url);
    this.websocket.onopen = () => {
      clearTimeout(this.pingInterval);

      if (this.websocket.readyState === WebSocket.OPEN) {
        this.pingInterval = setInterval((item) => {
          this.websocket.send("");
        }, 240000);
      }
    };
    this.websocket.onmessage = (evt) => {
      const data = evt.data;
      let result = JSON.parse(data);
      if (result.client_id === this.state.clienId) {
        if (result.type === "replyemailagent" || result.type === "email") {
          // this.fetchDataFromServer();
          console.log(result);
          let emailList = [...this.state.threadEmailList];
          let data = {
            messages: result.email_message,
            emailfrom: "agent",
            name: "Lea Codersss",
            datetime: new Date(),
          };
          emailList.unshift(data);
          this.setState({
            threadEmailList: emailList,
          });
        } else if (result.type === "replyemailclent") {
          clearTimeout(this.sendMessageTimeout);
          console.log("result.type", result.type);
          this.context.showAlert({ type: "success", message: "Message Sent!" });
          this.setState({
            messageText: "",
          });
          this.fetchDataFromServer();
        }
      }
    };
    this.websocket.onclose = (e) => {
      if (e) {
        switch (e.code) {
          case 1000:
            console.log("the default, normal closure, code:" + e.code, e);
            break;
          case 1006:
            console.log(
              " no way to set such code manually, indicates that the connection was lost, code:" +
                e.code,
              e
            );
            break;
          case 1001:
            console.log(
              " the party is going away, e.g. server is shutting down, or a browser leaves the page, code:" +
                e.code,
              e
            );
            break;
          case 1009:
            console.log("the message is too big to process, code:" + e.code, e);
            break;
          case 1011:
            console.log("unexpected error on server, code:" + e.code, e);
            break;
          default:
            console.log("Socket is closed. code:", e.code, e);
            console.log(" reason:" + e.reason, e);
        }
      }
      setTimeout(() => {
        this.initWebsocketConnection(clientId);
      }, 2000);
    };
  }

  fetchDataFromServer = () => {
    if (this.props.match.params.id) {
      const params = "id=" + this.props.match.params.id;

      getAllOfflineMsgList(
        params,
        (res) => {
          this.context.showLoading(false);
          if (this.websocket === false) {
            this.initWebsocketConnection(res.client_id);
          }
          this.setState({
            clienId: res.client_id,
            individualMessage: res.offlinemsglist.firstEmail,
            threadEmailList: res.offlinemsglist.threademail,
          });
        },
        (err) => {}
      );
    }
  };

  componentDidMount = () => {
    this.fetchDataFromServer();
  };

  menuOpen = (event) => {
    this.setState({
      anchorEl: event.currentTarget,
      showModal: true,
    });
  };

  saveDraft = () => {
    let _this = this;
    if (_this.state.reply || _this.state.replyAll || _this.state.forward) {
      const html = draftToHtml(
        convertToRaw(_this.state.messageText.getCurrentContent())
      );
      if (html !== "") {
        const params = {
          message: html,
          client_id: this.state.clienId,
        };
        saveDraft(params, (res) => {
          this.context.showAlert({ type: "success", message: res.message });
        });
      }
    }
  };

  handleCustomButtonAction = (action, data, editorState) => {
    if (action === "reply") {
      const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      const params = {
        client_id: this.state.clienId,
        type: "replyemailclent",
        message: html,
      };

      this.sendMessage(params);

      // this.websocket.send(JSON.stringify({params}));
      // replySingleMessage(params, (res) => {
      //   if (res.status === "True") {
      //     this.context.showAlert({ type: "success", message: res.message });
      //   } else {
      //     this.context.showAlert({ type: "error", message: res.message });
      //   }
      //   this.setState({
      //     messageText: "",
      //   });
      //   this.fetchDataFromServer();
      // });
    } else if (action === "delete") {
      this.setState({
        messageText: "",
      });
    }
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  starred(value) {
    starredEmail(
      {
        starred: value,
        client_id: this.state.clienId,
      },
      (res) => {
        this.setState({
          star: value,
        });
      }
    );
  }

  // markAsLead(value) {
  //   leadEmail(
  //     {
  //       lead: value,
  //       client_id: this.state.client_id,
  //     },
  //     (res) => {}
  //   );
  // }

  uploadImageCallBack = (file) => {
    return uploadImageCallBack(file);
  };

  openReply = () => {
    var _this = this;
    _this.setState(
      {
        reply: true,
        forward: false,
        replyAll: false,
        messageText: "",
      },
      () => {
        _this.scrollRef.current.scrollTo(
          0,
          _this.scrollRef.current.scrollHeight
        );
      }
    );
  };

  openReplyAll = () => {
    var _this = this;
    _this.setState(
      {
        replyAll: true,
        reply: false,
        forward: false,
        messageText: "",
      },
      () => {
        _this.scrollRef.current.scrollTo(
          0,
          _this.scrollRef.current.scrollHeight
        );
      }
    );
  };

  openForward = (messageText) => {
    var _this = this;
    _this.setState(
      {
        forward: true,
        messageText: messageText,
        reply: false,
        replyAll: false,
      },
      () => {
        _this.scrollRef.current.scrollTo(
          0,
          _this.scrollRef.current.scrollHeight
        );
      }
    );
  };

  setHtml = () => {
    const html = this.state.individualMessage.Message;
    let messageText = "";
    const forwardText = `<div>---------- Forwarded message ---------</div>
    <div>From: ${this.state.individualMessage.Name}</div>
    <div>Date: ${moment(this.state.individualMessage.datetime).format(
      "ddd, DD MMM YYYY [at] HH:mm"
    )}</div><div></div>`;
    // <div>Date: Fri, 23 Sept 2022 at 16:10</div>
    // <div>Subject: Fix your pipelines by validating your account</div>
    // <div>To: <muthu.leocoders@gmail.com></div>
    const contentBlock = htmlToDraft("<span>" + forwardText + html + "</span>");
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      messageText = editorState;
    }
    return messageText;
  };

  render() {
    let _this = this;
    return (
      <Fragment>
        <div className="offline_msg_section user_offline_msg_section">
          <div className="h-100">
            <div className="offline_msg_header email_msg_header">
              <img
                src={process.env.REACT_APP_LOGO}
                width="32"
                height="32"
                alt=""
              />
            </div>
            <div className="offline-user-block" ref={this.scrollRef}>
              {this.state.individualMessage &&
                this.state.individualMessage.name && (
                  <div className="offline_email_section user_email_section">
                    <div className="email_top d-flex align-items-center">
                      <div className="user_email_name_av_block">
                        <div className="visitor_avtar">
                          {this.state.individualMessage.name &&
                            this.state.individualMessage.name.charAt(0)}
                        </div>
                        <p className="visitor_name">{`${this.state.individualMessage.name}`}</p>
                      </div>
                      <div>
                        <p className="visitor_subtext">
                          {`${moment(this.state.individualMessage.datetime)
                            .format("dddd")
                            .substring(0, 3)} ${moment(
                            this.state.individualMessage.datetime
                          ).format("MM/DD/yyyy hh:MM A")}`}
                        </p>
                      </div>
                    </div>
                    <div className="user_msg_text">
                      {/* {_this.props.threadEmailList &&
                _this.props.threadEmailList.length > 0 &&
                _this.props.threadEmailList.map((prop, key) => {
                  return (
                    <p  />
                  );
                })} */}
                      <p
                        dangerouslySetInnerHTML={{
                          __html:
                            this.state.individualMessage.messages &&
                            this.state.individualMessage.messages.Message
                              ? this.state.individualMessage.messages.Message
                              : "",
                        }}
                      />
                    </div>
                  </div>
                )}
              {Array.isArray(this.state.threadEmailList) &&
                this.state.threadEmailList.length > 0 && (
                  <div className="message_threading">
                    <Accordion>
                      {this.state.threadEmailList.map((item, i) => (
                        <ThreadMessageComponent
                          _this={_this}
                          eventKey={i}
                          key={i}
                          message={item}
                          openReply={this.openReply}
                          openReplyAll={this.openReplyAll}
                          openForward={this.openForward}
                          individualMessage={this.state.individualMessage}
                          handleCustomButtonAction={(
                            action,
                            data,
                            editorState,
                            params
                          ) => {
                            this.handleCustomButtonActionData(
                              action,
                              data,
                              editorState,
                              params
                            );
                          }}
                        />
                      ))}
                    </Accordion>
                  </div>
                )}

              <div className="offline_email_section user_email_section">
                <div className="email_top d-flex w-100 user_email_block">
                  <div className="visitor_avtar">V</div>
                  <div className="reply_message">
                    <p className="visitor_name">
                      {" "}
                      <img src={left} alt="" />
                      {`${
                        this.state.individualMessage &&
                        this.state.individualMessage.name
                          ? this.state.individualMessage.name
                          : ""
                      }`}
                    </p>
                    <div className="msg_text"></div>
                    <Editor
                      stripPastedStyles={true}
                      plugins={plugins}
                      wrapperClassName="c-react-draft"
                      editorClassName="demo-editor"
                      toolbar={{
                        options: ["inline", "list", "textAlign", "image"],
                        inline: {
                          options: ["bold", "italic", "underline"],
                        },
                        textAlign: {
                          options: ["left", "center", "right", "justify"],
                        },
                        list: {
                          options: ["unordered"],
                        },

                        image: {
                          icon: uploadImg,
                          className: undefined,
                          component: undefined,
                          popupClassName: undefined,
                          urlEnabled: false,
                          uploadEnabled: true,
                          alignmentEnabled: false,
                          uploadCallback: _this.uploadImageCallBack,
                          previewImage: true,
                          inputAccept:
                            "image/gif,image/jpeg,image/jpg,image/png,image/svg",
                          alt: { present: false, mandatory: false },
                          defaultSize: {
                            height: "100px",
                            width: "100px",
                          },
                        },
                        remove: {
                          icon: star,
                          className: undefined,
                          component: undefined,
                        },
                      }}
                      toolbarCustomButtons={[
                        <ToolbarCustomComponent
                          mode={"reply"}
                          handleCustomButtonAction={(action, data) => {
                            this.handleCustomButtonAction(
                              action,
                              data,
                              _this.state.messageText
                            );
                          }}
                          imagePlugin={imagePlugin}
                          _this={_this}
                        />,
                      ]}
                      editorState={_this.state.messageText}
                      onEditorStateChange={(value) => {
                        _this.setState({
                          messageText: value,
                          isShowEmojiModal: false,
                          isShowGifImgModal: false,
                        });
                      }}
                      spellCheck={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Menu
            id="basic-menu"
            className="visitor-chat-model-block"
            anchorEl={this.state.anchorEl}
            open={_this.state.showModal}
            onClose={(e) => {
              _this.setState({
                showModal: false,
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
            <MenuItem
              onClick={(e) => {
                _this.setState(
                  {
                    showModal: false,
                  },
                  () => {
                    this.openReply();
                  }
                );
              }}
            >
              Reply
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                _this.setState(
                  {
                    showModal: false,
                  },
                  () => {
                    this.openReplyAll();
                  }
                );
              }}
            >
              Reply to all
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                const message = _this.setHtml();
                // get Message
                _this.setState(
                  {
                    showModal: false,
                  },
                  () => {
                    const messageText = _this.setHtml();
                    this.openForward(messageText);
                  }
                );
              }}
            >
              Forward
            </MenuItem>
            <MenuItem
              onClick={(e) => {
                this.saveDraft();
                _this.setState({
                  showModal: false,
                });
              }}
            >
              Save as draft
            </MenuItem>
          </Menu>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(IndividualOfflineMessageComponent);
