import React, { Component, Fragment } from "react";
import { Form } from "react-bootstrap";

import {
  createComponent,
  updateComponent,
  getSavedComponent,
  insertComponent,
} from "../../BuilderConversaionServer";
import ConfigureHeader from "../layouts/ConfigureHeader";
import ConfigureFooter from "../layouts/ConfigureFooter";
import CustomEditor from "../layouts/EditorComponent";
import { AlertContext } from "../../../../../../common/Alert";
import { uploadImageCallBack } from "../../../../../../agent/offline-messages/server/OfflineMessageServer";

export default class AddFileUploadComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    this.state = {
      save: false,
      message_error_failed: "Upload failed",
      message_error: "File size exceeded 10 Mb",
      backButton: 0,
      skipButton: 0,
      defaultHtml: "<p>Upload file</p>",
      editordata: "",
    };
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.myRef = {
      component: {
        question_id: "0C71F93F-5FC8-4149-9395-AAFD833FB411",
        message_error_failed: "Upload failed",
        message_error: "File size exceeded 10 Mb",
        type: this.props.type,
        question: this.state.defaultHtml,
        back_button: 0,
        skip_button: 0,
        welcome_card_image: "",
        enable: 0,
        bg_color: null,
        bg_color_start: null,
        text_color: null,
        welcome_card_bg_type: "",
        order_no: "0",
        client_id: "309-160-128e2b8f30",
        hide: 0,
      },
    };
    this.footerRef = React.createRef();
    this.editorRef = React.createRef();
  }

  refreshPreview() {
    if (
      this.props.widget &&
      this.props.widget.webchatRef.current.updateMessageComponent
    ) {
      console.log("data", this.myRef);
      this.props.widget.webchatRef.current.updateMessageComponent({
        msgIndex: 0,
        component: this.myRef.component,
      });
    }
  }

  addChatMessagPreview() {
    if (this.props.widget && this.props.widget.addUserMessage) {
      console.log("this.props.type", this.props.type);
      const message = {
        type: "postback",
        payload: this.props.type,
        item: {
          component: this.myRef.component,
        },
      };
      console.log("message", message);
      this.props.widget.addUserMessage(message);
    }
  }
  refreshComponent(noUpdate) {
    const html = this.state.editordata
      ? this.state.editordata
      : this.state.defaultHtml;
    let component = {
      ...this.myRef.component,
      back_button: this.state.backButton,
      skip_button: this.state.skipButton,
      question: html,
    };
    this.myRef.component = component;
    if (typeof noUpdate === "undefined") this.refreshPreview();
  }

  handleCheckChange = (event) => {
    const label = event.target.name;
    this.setState({ [label]: event.target.checked ? 1 : 0 }, () => {
      this.refreshComponent();
    });
  };

  handleInputChange = (event) => {
    const label = event.target.name;
    this.setState({ [label]: event.target.value }, () => {
      this.refreshComponent();
    });
  };

  componentDidMount() {
    let _this = this;
    if (this.props.questionId !== "") {
      const myparams = `bot_id=${this.props.botId}&type=${this.props.type}&question_id=${this.props.questionId}`;
      this.context.showLoading();
      getSavedComponent(
        myparams,
        (res) => {
          this.context.showLoading(false);
          console.log("response", res);
          if (res.status === "True") {
            this.setState({
              defaultHtml: res.message,
            });
            const updateState = {
              backButton: res.back_button,
              skipButton: res.skip_button,
              message_error_failed: res.message_error_failed,
              message_error: res.message_error,
            };

            this.setState(updateState, () => {
              this.refreshComponent(true);
              this.addChatMessagPreview();
            });
          }
        },
        (error) => {}
      );
    } else {
      // this.editorRef.current.setHtml(this.defaultHtml, () => {
      _this.addChatMessagPreview();
      // });
    }
  }

  componentWillUnmount() {
    if (
      window.WeConnect &&
      window.WeConnect.webchatRef &&
      window.WeConnect.webchatRef.current
    )
      window.WeConnect.webchatRef.current.clearMessages();
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
    this.handleDialogClose();
    const botId = this.props.botId;
    const errors = [];
    const textContent = html.replace(
      /<(?!img\s*\/?)(?!video\s*\/?)[^>]+>/g,
      ""
    );
    console.log("textContent", textContent);
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
      back_button: this.state.backButton,
      skip_button: this.state.skipButton,
      order_no: this.props.orderNo,
      message_error: this.state.message_error,
      message_error_failed: this.state.message_error_failed,
    };
    console.log("this.props.questionId", this.props);
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
            this.context.showAlert({
              type: "success",
              message: "Component updated successfully",
            });
            this.props.handleCloseChatComponent();
          } else {
            this.handleDialogClose();
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
                      <Form.Group controlId="formBackCheckbox">
                        <Form.Check
                          type="checkbox"
                          label="Back button"
                          name="backButton"
                          onChange={this.handleCheckChange}
                          checked={this.state.backButton === 1}
                        />
                      </Form.Group>
                      <Form.Group controlId="formSkipCheckbox">
                        <Form.Check
                          type="checkbox"
                          label="Skip button"
                          name="skipButton"
                          onChange={this.handleCheckChange}
                          checked={this.state.skipButton === 1}
                        />
                      </Form.Group>
                    </div>
                  </div>
                </div>
              </div>

              <div className="digits-section-block email-section-block upload-section-block">
                <label htmlFor="Error Message">Message</label>
                <div className="digits-block">
                  <div className="error-msg-block">
                    <label htmlFor="Error Message">
                      Message to show when file size exceeds 10 Mb
                    </label>
                    <Form.Group className="" controlId="FormMaxSize">
                      <Form.Control
                        type="text"
                        placeholder="File size exceeded 10 Mb"
                        name="message_error"
                        value={this.state.message_error}
                        onChange={this.handleInputChange}
                      />
                    </Form.Group>
                  </div>
                  <div className="error-msg-block">
                    <label htmlFor="Error Message">
                      Message to show when upload fails
                    </label>
                    <Form.Group className="" controlId="FormUploadFailed">
                      <Form.Control
                        type="text"
                        placeholder="Upload failed"
                        name="message_error_failed"
                        value={this.state.message_error_failed}
                        onChange={this.handleInputChange}
                      />
                    </Form.Group>
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
