import React, { Component, Fragment } from "react";
import { Form } from "react-bootstrap";
import ConfigureHeader from "../layouts/ConfigureHeader";
import ConfigureFooter from "../layouts/ConfigureFooter";
import CustomEditor from "../layouts/EditorComponent";
import {
  createComponent,
  updateComponent,
  getSavedComponent,
  insertComponent,
} from "../../BuilderConversaionServer";
import { AlertContext } from "../../../../../../common/Alert";

import { uploadImageCallBack } from "../../../../../../agent/offline-messages/server/OfflineMessageServer";

export default class AddSimpleChatComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    // this.defaultHtml = this.state?.defaultHtml
    //   ? this.state.defaultHtml
    //   : "Hello";

    this.state = {
      save: false,
      transparency: 0,
      isShowEmojiModal: false,
      isShowGifImgModal: false,
      defaultHtml: "<p>Hello</p>",
      editordata: "",
    };
    this.myRef = {
      component: {
        question_id: "0C71F93F-5FC8-4149-9395-AAFD833FB411",
        type: this.props.type,
        question: this.state.defaultHtml,
        welcome_card_image: "",
        enable: 0,
        bg_color: null,
        bg_color_start: null,
        text_color: null,
        welcome_card_bg_type: "",
        order_no: "0",
        hide: 0,
        transparency: "0",
      },
    };
    this.handCheckChange = this.handCheckChange.bind(this);
    this.footerRef = React.createRef();
    this.editorRef = React.createRef();
  }

  refreshPreview() {
    if (
      this.props.widget &&
      this.props.widget.webchatRef.current.updateMessageComponent
    ) {
      this.props.widget.webchatRef.current.updateMessageComponent({
        msgIndex: 0,
        component: this.myRef.component,
      });
    }
  }
  addChatMessagPreview() {
    if (this.props.widget && this.props.widget.addUserMessage) {
      const message = {
        type: "postback",
        payload: this.props.type,
        item: {
          component: this.myRef.component,
        },
      };
      this.props.widget.addUserMessage(message);
    }
  }
  refreshComponent(noUpdate) {
    const html = this.state.editordata
      ? this.state.editordata
      : this.state.defaultHtml;
    let component = {
      ...this.myRef.component,
      question: html,
      transparency: this.state.transparency,
    };
    this.myRef.component = component;
    if (typeof noUpdate === "undefined") this.refreshPreview();
  }

  componentDidMount() {
    let _this = this;
    if (this.props.questionId !== "") {
      const myparams = `bot_id=${this.props.botId}&type=${this.props.type}&question_id=${this.props.questionId}`;
      this.context.showLoading();
      getSavedComponent(
        myparams,
        (res) => {
          this.context.showLoading(false);
          if (res.status === "True") {
            this.setState({
              defaultHtml: res.message,
            });
            const updateState = {
              transparency: res.transparency,
            };
            this.setState(updateState, () => {
              this.refreshComponent(true);
              this.addChatMessagPreview();
            });
          }
        },
        (err) => {
          this.context.showLoading(false);
        }
      );
    } else {
      // this.editorRef.current.setHtml(this.defaultHtml, () => {
      _this.addChatMessagPreview();
      // });
    }
  }

  insertInMiddle(param) {
    param.orderNo = this.props.orderNo;
    insertComponent(
      param,
      (res) => {
        this.context.showAlert({
          type: "success",
          message: "Component added successfully",
        });
        this.props.handleCloseChatComponent();
      },
      (err) => {
        this.context.showAlert({
          type: "error",
          message: err.message || "Sequence Update Failed",
        });
      }
    );
  }

  componentWillUnmount() {
    if (
      window.WeConnect &&
      window.WeConnect.webchatRef &&
      window.WeConnect.webchatRef.current
    )
      window.WeConnect.webchatRef.current.clearMessages();
  }

  handleSave = () => {
    this.context.showLoading();

    if (
      this.footerRef &&
      this.footerRef.current &&
      this.footerRef.current.handleDialogClose
    )
      this.footerRef.current.handleDialogClose();

    const html = this.state.editordata
      ? this.state.editordata
      : this.state.defaultHtml;
    const botId = this.props.botId;
    const errors = [];
    this.handleDialogClose();
    const textContent = html.replace(
      /<(?!img\s*\/?)(?!video\s*\/?)[^>]+>/g,
      ""
    );

    if (textContent.trim() === "") {
      errors.push("Chat Message is Required");
    }

    if (errors.length > 0) {
      this.context.showAlert({ type: "error", message: errors.join("\n\r") });
      return;
    }

    const data = {
      type: this.props.type,
      bot_id: botId,
      chat_message: html,
      transparency: this.state.transparency ? "1" : "0",
      order_no: this.props.orderNo,
    };
    if (this.props.questionId === "") {
      createComponent(
        data,
        (res) => {
          if (res.status === "True") {
            if (this.props.insertMiddle) {
              this.insertInMiddle(res);
            } else {
              this.context.showAlert({
                type: "success",
                message: "Component added successfully",
              });
              this.props.handleCloseChatComponent();
            }
          } else {
            this.handleDialogClose();
            this.context.showAlert({
              type: "error",
              message: res.message || "Add Component Failed",
            });
          }
        },
        (error) => {
          this.handleDialogClose();
          this.context.showAlert({
            type: "error",
            message: error.message || "Add Component Failed",
          });
        }
      );
    } else {
      data.type = this.props.type;
      data.question_id = this.props.questionId;
      updateComponent(
        data,
        (res) => {
          if (res.status === "True") {
            this.props.handleCloseChatComponent();
            this.context.showAlert({
              type: "success",
              message: "Component updated successfully",
            });
          } else {
            this.context.showAlert({
              type: "error",
              message: res.message || "Update Component Failed",
            });
          }
        },
        (error) => {
          this.context.showAlert({
            type: "error",
            message: error.message || "Update Component Failed",
          });
        }
      );
    }
  };

  handCheckChange = (event) => {
    const { name, checked } = event.target;
    this.setState({ [name]: checked ? 1 : 0 }, () => {
      // this.refreshComponent();
    });
  };

  handleDialogClose = () => {
    this.setState({
      save: false,
    });
  };

  handleDialogOpen = () => {
    this.setState({
      save: true,
    });
  };

  uploadImageCallBackfn = (file, filetype) => {
    return uploadImageCallBack(file, filetype);
  };

  EditorChange = (newValue) => {
    if (this.state.defaultHtml !== newValue) {
      console.log(newValue);
      this.setState(
        {
          editordata: newValue,
        },
        () => {
          this.refreshComponent();
        }
      );
    }
  };

  render() {
    let _this = this;
    return (
      <Fragment>
        <section className="add-chat-block-section">
          <ConfigureHeader {...this.props} />
          <div className="main-section">
            <div className="chat-msg-block">
              <div className="offline_email_section">
                <div className="email_top">
                  <div className="w-100">
                    <div className="reply_message editor-block-all">
                      <div className="msg_text"></div>
                      <label htmlFor="Chat Message">Chat Message</label>

                      <CustomEditor
                        defaultHtml={_this.state.defaultHtml}
                        uploadImageCallBackfn={_this.uploadImageCallBackfn}
                        handleEditorChange={_this.EditorChange}
                        botId={this.props.botId}
                        questionId={this.props.questionId}
                      />
                    </div>
                  </div>

                  <div className="button_component">
                    <label htmlFor="Chat Message">Button</label>
                    <div>
                      {" "}
                      <Form.Group controlId="transparencyCheckbox">
                        <Form.Check
                          type="checkbox"
                          label="Component Transparency "
                          onChange={this.handCheckChange}
                          name="transparency"
                          checked={this.state.transparency === 1}
                        />
                      </Form.Group>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <ConfigureFooter
            ref={this.footerRef}
            {...this.props}
            handleSave={this.handleSave}
          />
        </section>
      </Fragment>
    );
  }
}
