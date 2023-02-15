import React, { Component, Fragment } from "react";

import x from "../../../../../../assets/images/userdash/x-circle.svg";
import clip from "../../../../../../assets/images/paperclip (3).svg";
import link from "../../../../../../assets/images/link-2.svg";
import emoji from "../../../../../../assets/images/smile (2).svg";
import delete1 from "../../../../../../assets/images/userdash/trash-2.svg";
import uploadImg from "../../../../../../assets/images/image.svg";
import star from "../../../../../../assets/images/star (2).svg";
import { IconButton } from "@mui/material";
import { emailtodeveloper } from "../server/shareServer";
import { AlertContext } from "../../../../../common/Alert";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/style.css";
import SimpleReactValidator from "simple-react-validator";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import ToolbarCustomComponent from "./ToolbarCustomComponent.jsx";
import createImagePlugin from "@draft-js-plugins/image";
import htmlToDraft from "html-to-draftjs";
import draftToHtml from "draftjs-to-html";
// import Button from "@mui/material/Button";
const imagePlugin = createImagePlugin();
const plugins = [imagePlugin];

function escapeHtml(htmlStr) {
  return htmlStr.replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");        

}

export default class EmailDeveloper extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    
    this.validator = new SimpleReactValidator({
      messages: {
        email: "Invalid email address"
      }
    });    

    this.state = {
      messageText: "",
      reply_to: "",
      replyEmails: [],
      emails:[],
      subject: "Instructions to install weconnect to website.",
      body: "",
      isShowEmojiModal: false,
      messageData: '',
      widgetScript: '',
      embedScript: ''
    }
    this.hanldleChangeInput = this.hanldleChangeInput.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.resetForm = this.resetForm.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.widgetScript !== prevState.widgetScript || nextProps.embedScript !== prevState.embedScript) {
      const html = `<span><p>You have been requested to implement a chatbot. This chatbot is built on WeConnect.chat.</p>
    <p>1. Widget installation on website:</p>
    
    <p>To implement chatbot, you will need to add below snippet to your site.</p>
    <p>Copy and paste below snippet right before the closing  ${escapeHtml('</head>')} tag:</p>
    
    <blockquote>${escapeHtml(nextProps.widgetScript)}</blockquote>
    
    <p>2. Embed on a webpage:</p>
    
    <blockquote>${escapeHtml(nextProps.embedScript)}</blockquote>
    
    
    <p>For additional information about WeConnect.Chat, visit our website.</p>
    
    <p>Thanks.</p></span>`;
    let messageText = "";
    const contentBlock = htmlToDraft(html);
            if (contentBlock) {
              const contentState = ContentState.createFromBlockArray(
                contentBlock.contentBlocks
              );
              const editorState = EditorState.createWithContent(contentState);
              messageText = editorState;
            };

      return ({ 
        messageText: messageText,
        widgetScript: nextProps.widgetScript,
        embedScript: nextProps.embedScript
       }) // <- this is setState equivalent
    }
    return null
  }

  handleCustomButtonAction(action, data, message) {
    let _this = this;
    if(action==="delete") {
      _this.setState({
        messageText: ""
      })
    } else if(action==="reply") {
      this.onSubmit();
    }
  }

  onSubmit() {
    if(this.state.emails.length<1) {
      this.context.showAlert({
        type: "success",
        message: "Please Enter atleast one To email",
      });
      return;
    }

    if(!isEmail(this.state.reply_to)) {
      this.context.showAlert({
        type: "success",
        message: "Please Enter atleast one Reply email",
      });
      return;
    }

    const html = draftToHtml(
      convertToRaw(this.state.messageText.getCurrentContent())
    );

    if(html.trim().length<1) {
      this.context.showAlert({
        type: "success",
        message: "Please Type Message Body",
      });
      return;
    }

    const sendObj = {
      reply_to: this.state.reply_to,
      to: this.state.emails.join(","),
      subject: this.state.subject,
      body: html,
    };
    this.context.showLoading();
    emailtodeveloper(sendObj,(res)=>{
      if(res.status==="True") {
        this.context.showAlert({
          type: "success",
          message: res.message
        });
        this.resetForm();
      } else {
        this.context.showAlert({
          type: "error",
          message: res.message
        });
      }
    },()=>{
      this.context.showAlert({
        type: "error",
        message: "Email Failed!",
      });
    })
  }
  resetForm() {
    this.setState({
      reply_to: "",
    to: "",
    emails:[],
    replyEmails: [],
    subject: "Instructions to install weconnect to website.",
    body: "",
    });
  }

  hanldleChangeInput(e) {
    const { value, name } = e.target;
    this.setState({
      [name]:value
    });
  }
  render() {
    let _this = this;
    return (
      <Fragment>
        <div className="right-block">
          <div className="header">
            <p className="heading">Email to Developer</p>
            <p className="desc">Install the widget on a webpage</p>
          </div>
          <div className="main-block">
            <div className="size-block">
              <p className="title">Share bot link on email</p>
              <p className="desc">Share bot to various email address</p>
            </div>
            <div className="basic-acc-block email-notification-block">
              <div>
                <div className="email_titles">
                  <p>From:</p>
                </div>
                <div className="email_inputs">
                  <input type="text" name="from" value="noreply@weconnect.chat" />
                </div>
              </div>
              <div>
                <div className="email_titles">
                  <p>To:</p>
                </div>
                <div className="email_inputs">
                <ReactMultiEmail
                    placeholder="Enter to"
                    emails={this.state.emails}
                    onChange={(_emails) => {
                      this.setState({ emails: _emails });
                    }}
                    validateEmail={(email) => {
                      return isEmail(email); // return boolean
                    }}
                    getLabel={(email,index,removeEmail) => {
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
                  <div className="errorMsg">
                    {this.validator.message(
                      "To",
                      this.state.emails && this.state.emails.length > 0
                        ? true
                        : "",
                      "required"
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div className="email_titles">
                  <p>Reply to:</p>
                </div>
                <div className="email_inputs">
                {/* <ReactMultiEmail
                    placeholder="Enter to"
                    emails={this.state.replyEmails}
                    onChange={(_emails) => {
                      this.setState({ replyEmails: _emails });
                    }}
                    validateEmail={(email) => {
                      return isEmail(email); // return boolean
                    }}
                    getLabel={(email,index,removeEmail) => {
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
                  /> */}
                  <input type="text" placeholder="Enter to" value={this.state.reply_to} name="reply_to" onChange={this.hanldleChangeInput} />
                </div>
              </div>
              <div>
                <div className="email_titles">
                  <p>Subject:</p>
                </div>
                <div className="email_inputs">
                  <input
                    type="text"
                    name="subject"
                    value={this.state.subject}
                    onChange={this.hanldleChangeInput}
                  />
                </div>
              </div>
              <div className="email_btn_box">
                <div className="offline_msg_section" style={{width: "100%"}}>
                <div className="offline_email_section email_inputs">
                  {/* <textarea
                  name="body"
                  value={this.state.body}
                  onChange={this.hanldleChangeInput}
                    type="text"
                    placeholder="Type something…"
                    rows={15}
                  /> */}
                  <Editor
                      stripPastedStyles={true}
                        plugins={plugins}
                        wrapperClassName="c-react-draft"
                        editorClassName="demo-editor"
                        toolbar={{
                          options: ["inline", "list", ],
                          inline: {
                            options: ["bold"],
                          },
                          textAlign: {
                            options: ["left", "center", "right"],
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
                            handleCustomButtonAction={(action, data)=>{
                              this.handleCustomButtonAction(action, data, _this.state.messageText)
                            }
                            }
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
              
                {/* <div className="email_btns">
                  <Button className="send_btn" variant="contained" onClick={this.onSubmit}>
                    Send
                  </Button>
                  <IconButton className="icon_btn">
                    <img src={clip} alt="" />
                  </IconButton>
                  <IconButton className="icon_btn">
                    <img src={link} alt="" />
                  </IconButton>
                  {_this.state.isShowEmojiModal ? (
                                    <EmojiMartPickerComponent
                                      isShowEmojiModal={
                                        _this.state.isShowEmojiModal
                                      }
                                      messageData={_this.state.messageData}
                                      isArrayFormat={true}
                                      {..._this.props}
                                      _this={_this}
                                    />
                                  ) : null}
                  <IconButton className="icon_btn">
                    <img src={emoji} alt="" />
                  </IconButton>
                </div>
                <div>
                  <IconButton className="icon_btn" onClick={this.resetForm}>
                    <img src={delete1} alt="" />
                  </IconButton>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
