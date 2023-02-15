import React, { Component, Fragment } from "react";

import { Grid } from "@mui/material";
import { FloatingLabel, Form } from "react-bootstrap";
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

export default class AddNumberRangeComponent extends Component {
  static contextType = AlertContext;

  constructor(props) {
    super(props);
    this.defaultHtml = "Select a range";

    this.state = {
      btnstyle: "",
      save: false,
      backButton: 0,
      skipButton: 0,
      prefix: "prefix",
      suffix: "suffix",
      minimum_digit: 0,
      maximum_digit: 100,
      steps: 0,
      defaultHtml: "<p>Select a range</p>",
      editordata: "",
    };

    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.myRef = {
      component: {
        question_id: "0C71F93F-5FC8-4149-9395-AAFD833FB411",
        type: this.props.type,
        question: this.defaultHtml,
        back_button: 0,
        skip_button: 0,
        prefix: "prefix",
        suffix: "suffix",
        minimum_digit: 0,
        maximum_digit: 100,
        steps: 0,
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
      prefix: this.state.prefix,
      suffix: this.state.suffix,
      minimum_digit: parseInt(this.state.minimum_digit),
      maximum_digit: parseInt(this.state.maximum_digit),
      steps: parseInt(this.state.steps),
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
              prefix: res.prefix,
              suffix: res.suffix,
              minimum_digit: res.minimum_digit,
              maximum_digit: res.maximum_digit,
              steps: res.steps,
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
      prefix: this.state.prefix,
      suffix: this.state.suffix,
      minimum_digit: this.state.minimum_digit,
      maximum_digit: this.state.maximum_digit,
      steps: this.state.steps,
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
              message: "Component added successfully",
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
          this.handleDialogClose();
          this.context.showAlert({
            type: "error",
            message: error.message || "Add Component Failed",
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

  handleBtnStyle = (event) => {
    this.setState({
      btnstyle: event.target.value,
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
                  <div className="button_component">
                    <label htmlFor="Chat Message">Range criteria</label>
                    <div className="btn_style_box">
                      <Grid container spacing={2}>
                        <Grid item xs={6}>
                          <FloatingLabel
                            className="floating-input-field-block-cust"
                            controlId="formprefix"
                            label="Prefix"
                          >
                            <Form.Control
                              type="text"
                              placeholder="Left label"
                              name="prefix"
                              value={this.state.prefix}
                              onChange={this.handleInputChange}
                            />
                          </FloatingLabel>
                        </Grid>
                        <Grid style={{ position: "relative" }} item xs={6}>
                          <FloatingLabel
                            className="floating-input-field-block-cust"
                            controlId="formsuffix"
                            label="Suffix"
                          >
                            <Form.Control
                              type="text"
                              placeholder="Right label"
                              name="suffix"
                              value={this.state.suffix}
                              onChange={this.handleInputChange}
                            />
                          </FloatingLabel>
                        </Grid>
                        <Grid style={{ position: "relative" }} item xs={6}>
                          <FloatingLabel
                            className="floating-input-field-block-cust"
                            controlId="formMinimum"
                            label="Minimum Value Accepted"
                          >
                            <Form.Control
                              type="number"
                              placeholder="Minumum value accepted"
                              name="minimum_digit"
                              value={this.state.minimum_digit}
                              onChange={this.handleInputChange}
                            />
                          </FloatingLabel>
                        </Grid>
                        <Grid style={{ position: "relative" }} item xs={6}>
                          <FloatingLabel
                            className="floating-input-field-block-cust"
                            controlId="formmaximumvalue"
                            label="Maximum Value Accepted"
                          >
                            <Form.Control
                              type="number"
                              placeholder="Maximum Value Accepted"
                              name="maximum_digit"
                              value={this.state.maximum_digit}
                              onChange={this.handleInputChange}
                            />
                          </FloatingLabel>
                        </Grid>
                        <Grid style={{ position: "relative" }} item xs={6}>
                          <FloatingLabel
                            className="floating-input-field-block-cust"
                            controlId="formsteps"
                            label="Steps for Range"
                          >
                            <Form.Control
                              type="number"
                              placeholder="steps"
                              name="steps"
                              value={this.state.steps}
                              onChange={this.handleInputChange}
                            />
                          </FloatingLabel>
                        </Grid>
                      </Grid>
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
