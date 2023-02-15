import React, { Component, Fragment } from "react";
import left from "../../../../assets/images/corner-up-left.svg";
import all from "../../../../assets/images/Group 20107.svg";
import forward from "../../../../assets/images/corner-up-left-1.svg";
import star from "../../../../assets/images/star (2).svg";
import uploadImg from "../../../../assets/images/image.svg";
import checkedStar from "../../../../assets/images/star (3).svg";
import menu from "../../../../assets/images/Group 19493.svg";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
// import bold1 from "../../../../assets/images/bold.svg";
import { Button, MenuItem, Tooltip, IconButton, Menu } from "@mui/material";
// import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import moment from "moment";
import draftToHtml from "draftjs-to-html";
import ToolbarCustomComponent from "./ToolbarCustomComponent.jsx";
import {
  starredEmail,
  leadEmail,
  uploadImageCallBack,
  saveDraft,
  updateThread,
} from "../server/OfflineMessageServer.js";
import { Accordion, Form } from "react-bootstrap";
import createImagePlugin from "@draft-js-plugins/image";
import ThreadMessageComponent from "./threadMessageComponent";
import { ReactMultiEmail, isEmail } from "react-multi-email";
// import EditorComponent from "./editorComponent";
import htmlToDraft from "html-to-draftjs";
import { AlertContext } from "../../../common/Alert";

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
      ccEmails: [],
      bccEmails: [],
      toEmails: [],
    };
    this.scrollRef = React.createRef();
  }
  componentDidUpdate = (prevprops, prevstate) => {
    if (
      JSON.stringify(this.props.threadEmailList) !=
      JSON.stringify(prevprops.threadEmailList)
    ) {
      if (this.props.threadEmailList !== "") {
        this.props.threadEmailList.some((data, i) => {
          if (data.status == "draft") {
            return this.setState({
              reply: true,
              messageText: this.setDefaultHtml(data.messages),
            });
          } else {
            this.setState({
              reply: false,
            });
          }
        });
      } else {
        this.setState({
          reply: false,
        });
      }
    }
  };

  deleteMessage = () => {
    this.setState({
      messageText: "",
    });
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
          client_id: this.props.client_id,
        };
        saveDraft(params, (res) => {
          this.context.showAlert({ type: "success", message: res.message });
        });
      }
    }
  };

  handleCustomButtonActionData = (action, data, editorState, params) => {
    if (action === "reply") {
      const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      this.props.customButtonAction(action, html);
    } else if (action === "reply_all") {
      const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));

      this.props.customButtonAction(action, html, params);
    } else if (action === "forward") {
      const html = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      this.props.customButtonAction(action, html, params);
    }
  };

  handleCustomButtonAction = (action, data, editorState) => {
    if (action === "reply") {
      this.handleCustomButtonActionData(action, data, editorState);
    } else if (action === "delete") {
      this.setState({
        messageText: "",
      });
    } else if (action === "reply_all") {
      const params = {
        ccEmails: this.state.ccEmails.join(","),
        bccEmails: this.state.bccEmails.join(","),
        toEmails: this.state.toEmails.join(","),
      };
      this.handleCustomButtonActionData(action, data, editorState, params);
      this.setState({
        ccEmails: [],
        bccEmails: [],
        toEmails: [],
        replyAll: false,
      });
    } else if (action === "forward") {
      const params = {
        ccEmails: this.state.ccEmails.join(","),
        bccEmails: this.state.bccEmails.join(","),
        toEmails: this.state.toEmails.join(","),
      };
      this.handleCustomButtonActionData(action, data, editorState, params);
      this.setState({
        ccEmails: [],
        bccEmails: [],
        toEmails: [],
        forward: false,
      });
    }
  };

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  handleUpdateThread(id, status) {
    // console.log(e, this.client_id);
    if (status == "unread") {
      updateThread(
        {
          id: id,
          client_id: this.client_id,
        },
        (res) => {
          console.log(res);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  starred(value) {
    starredEmail(
      {
        starred: value,
        client_id: this.props.client_id,
      },
      (res) => {
        this.setState({
          star: value,
        });
      }
    );
  }

  markAsLead(value) {
    leadEmail(
      {
        lead: value,
        client_id: this.props.client_id,
      },
      (res) => {}
    );
  }

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
    const html =
      this.props.individualMessage.messages &&
      this.props.individualMessage.messages.Message
        ? this.props.individualMessage.messages.Message
        : "";
    let messageText = "";
    const forwardText = `<div>---------- Forwarded message ---------</div>
    <div>From: ${this.props.individualMessage.messages.Name}</div>
    <div>Date: ${moment(this.props.individualMessage.datetime).format(
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

  setDefaultHtml = (html) => {
    let messageText = "";
    const contentBlock = htmlToDraft(html);
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
        <div className="h-100">
          <div className="offline_msg_header">
            {_this.props.individualMessage &&
              _this.props.individualMessage.name}{" "}
            &#160;&lt;
            {_this.props.individualMessage &&
              _this.props.individualMessage.messages &&
              _this.props.individualMessage.messages.Email}
            &gt;
          </div>
          <div className="offline-user-block" ref={this.scrollRef}>
            <div className="offline_email_section">
              <div className="email_top">
                <div className="d-flex align-items-center">
                  <div className="visitor_avtar">
                    {_this.props.individualMessage &&
                      _this.props.individualMessage.name &&
                      _this.props.individualMessage.name.charAt(0)}
                  </div>
                  <div>
                    <p className="visitor_name">{`${
                      _this.props.individualMessage &&
                      _this.props.individualMessage.name
                    }`}</p>
                    <p className="visitor_subtext">
                      {`${moment(
                        _this.props.individualMessage &&
                          _this.props.individualMessage.datetime
                      )
                        .format("dddd")
                        .substring(0, 3)} ${moment(
                        _this.props.individualMessage &&
                          _this.props.individualMessage.datetime
                      ).format("MM/DD/yyyy hh:MM A")}`}
                    </p>
                  </div>
                </div>

                <div className="chat_icons">
                  <Tooltip title="Starred">
                    <IconButton
                      color="primary"
                      component="span"
                      className="horizont-more-btn"
                      id="basic-button"
                      onClick={() => this.starred(this.state.star ? 0 : 1)}
                      aria-controls={this.menuOpen ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={this.menuOpen ? "true" : undefined}
                    >
                      {this.state.star ? (
                        <img alt="" className="nomargin" src={checkedStar} />
                      ) : (
                        <img alt="" className="nomargin" src={star} />
                      )}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Reply">
                    <IconButton
                      color="primary"
                      component="span"
                      className="horizont-more-btn"
                      id="basic-button"
                      aria-controls={this.menuOpen ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={this.menuOpen ? "true" : undefined}
                      onClick={() => {
                        _this.setState(
                          {
                            replyAll: false,
                            reply: !this.state.reply,
                            forward: false,
                          },
                          () => {
                            _this.scrollRef.current.scrollTo(
                              0,
                              document.body.scrollHeight
                            );
                          }
                        );
                      }}
                    >
                      <img alt="" className="nomargin" src={left} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="More Options">
                    <IconButton
                      color="primary"
                      component="span"
                      className="horizont-more-btn"
                      id="basic-button"
                      aria-controls={this.menuOpen ? "basic-menu" : undefined}
                      aria-haspopup="true"
                      aria-expanded={this.menuOpen ? "true" : undefined}
                      onClick={this.menuOpen}
                    >
                      <img alt="" className="nomargin" src={menu} />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
              <div className="msg_text">
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
                      this.props.individualMessage.messages &&
                      _this.props.individualMessage.messages.Message
                        ? _this.props.individualMessage.messages.Message
                        : "",
                  }}
                />
                <div className="msg_btn">
                  <Button onClick={this.openReply} variant="outlined">
                    <img src={left} alt="" />
                    Reply
                  </Button>
                  <Button variant="outlined" onClick={this.openReplyAll}>
                    {" "}
                    <img src={all} alt="" />
                    Reply to all
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      const messageText = _this.setHtml();
                      this.openForward(messageText);
                    }}
                  >
                    {" "}
                    <img src={forward} alt="" />
                    Forward
                  </Button>
                </div>
              </div>
            </div>

            <div className="message_threading">
              <Accordion>
                {_this.props.threadEmailList.map((item, i) => (
                  <ThreadMessageComponent
                    _this={_this}
                    eventKey={i}
                    key={i}
                    message={item}
                    openReply={this.openReply}
                    openReplyAll={this.openReplyAll}
                    openForward={this.openForward}
                    individualMessage={this.props.individualMessage}
                    handleUpdateThread={this.handleUpdateThread}
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
                    {..._this.props}
                  />
                ))}
              </Accordion>
            </div>

            <div className="offline_email_section">
              {_this.state.reply ? (
                <div className="email_top">
                  <div className="d-flex w-100">
                    <div className="visitor_avtar">V</div>
                    <div className="reply_message">
                      <p className="visitor_name">
                        {" "}
                        <img src={left} alt="" />
                        {`${
                          _this.props.individualMessage &&
                          _this.props.individualMessage.name
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
                            {..._this.props}
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
              ) : null}

              {_this.state.forward ? (
                <div className="email_top">
                  <div className="d-flex w-100">
                    <div className="visitor_avtar">V</div>
                    <div className="reply_message">
                      <p className="visitor_name d-flex align-items-baseline">
                        {" "}
                        <img src={forward} className="" alt="" />
                        <div className="w-100">
                          <ReactMultiEmail
                            placeholder="To"
                            emails={this.state.toEmails}
                            onChange={(_emails) => {
                              this.setState({ toEmails: _emails });
                            }}
                            validateEmail={(email) => {
                              return isEmail(email); // return boolean
                            }}
                            getLabel={(email, index, removeEmail) => {
                              return (
                                <div data-tag key={index}>
                                  {email}
                                  <span
                                    data-tag-handle
                                    onClick={() => removeEmail(index)}
                                  >
                                    ×
                                  </span>
                                </div>
                              );
                            }}
                          />
                          <ReactMultiEmail
                            placeholder="Cc"
                            emails={this.state.ccEmails}
                            onChange={(_emails) => {
                              this.setState({ ccEmails: _emails });
                            }}
                            validateEmail={(email) => {
                              return isEmail(email); // return boolean
                            }}
                            getLabel={(email, index, removeEmail) => {
                              return (
                                <div data-tag key={index}>
                                  {email}
                                  <span
                                    data-tag-handle
                                    onClick={() => removeEmail(index)}
                                  >
                                    ×
                                  </span>
                                </div>
                              );
                            }}
                          />
                          <ReactMultiEmail
                            placeholder="Bcc"
                            emails={this.state.bccEmails}
                            onChange={(_emails) => {
                              this.setState({ bccEmails: _emails });
                            }}
                            validateEmail={(email) => {
                              return isEmail(email); // return boolean
                            }}
                            getLabel={(email, index, removeEmail) => {
                              return (
                                <div data-tag key={index}>
                                  {email}
                                  <span
                                    data-tag-handle
                                    onClick={() => removeEmail(index)}
                                  >
                                    ×
                                  </span>
                                </div>
                              );
                            }}
                          />
                        </div>
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
                            mode={"forward"}
                            handleCustomButtonAction={(action, data) => {
                              this.handleCustomButtonAction(
                                action,
                                data,
                                _this.state.messageText
                              );
                            }}
                            imagePlugin={imagePlugin}
                            {..._this.props}
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
              ) : null}

              {_this.state.replyAll ? (
                <div className="email_top">
                  <div className="d-flex w-100">
                    <div className="visitor_avtar">V</div>
                    <div className="reply_message">
                      <p className="visitor_name d-flex align-items-baseline">
                        {" "}
                        <img src={all} className="" alt="" />
                        <div className="w-100">
                          <ReactMultiEmail
                            placeholder="Cc"
                            emails={this.state.ccEmails}
                            onChange={(_emails) => {
                              this.setState({ ccEmails: _emails });
                            }}
                            validateEmail={(email) => {
                              return isEmail(email); // return boolean
                            }}
                            getLabel={(email, index, removeEmail) => {
                              return (
                                <div data-tag key={index}>
                                  {email}
                                  <span
                                    data-tag-handle
                                    onClick={() => removeEmail(index)}
                                  >
                                    ×
                                  </span>
                                </div>
                              );
                            }}
                          />

                          <ReactMultiEmail
                            placeholder="Bcc"
                            emails={this.state.bccEmails}
                            onChange={(_emails) => {
                              this.setState({ bccEmails: _emails });
                            }}
                            validateEmail={(email) => {
                              return isEmail(email); // return boolean
                            }}
                            getLabel={(email, index, removeEmail) => {
                              return (
                                <div data-tag key={index}>
                                  {email}
                                  <span
                                    data-tag-handle
                                    onClick={() => removeEmail(index)}
                                  >
                                    ×
                                  </span>
                                </div>
                              );
                            }}
                          />

                          {/* <Form.Group
                            className="input-field-block-cust mb-3"
                            controlId="formBasicEmail"
                          >
                            <Form.Control type="email" placeholder="Cc" />
                          </Form.Group> */}
                        </div>
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
                            mode={"reply_all"}
                            handleCustomButtonAction={(action, data) => {
                              this.handleCustomButtonAction(
                                action,
                                data,
                                _this.state.messageText
                              );
                            }}
                            imagePlugin={imagePlugin}
                            {..._this.props}
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
              ) : null}
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
      </Fragment>
    );
  }
}

export default IndividualOfflineMessageComponent;
