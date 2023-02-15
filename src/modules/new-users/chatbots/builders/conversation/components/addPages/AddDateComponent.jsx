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

export default class AddDateComponent extends Component {
  static contextType = AlertContext;

  constructor(props) {
    super(props);

    this.state = {
      backButton: 0,
      skipButton: 0,
      leads: 0,
      lead_tag: "DATE",
      show_past_dates: 1,
      show_future_dates: 1,
      save: false,
      defaultHtml: "<p>Select a date</p>",
      editordata: "",
    };

    this.handCheckChange = this.handCheckChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.myRef = {
      component: {
        question_id: "0C71F93F-5FC8-4149-9395-AAFD833FB411",
        type: this.props.type,
        question: this.state.defaultHtml,
        back_button: 0,
        skip_button: 0,
        show_past_dates: 1,
        show_future_dates: 1,
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
      options: {
        show_past_dates: this.state.show_past_dates,
        show_future_dates: this.state.show_future_dates,
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
        options: this.myRef.options,
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
          options: this.myRef.options,
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
    this.myRef.options = {
      show_past_dates: this.state.show_past_dates,
      show_future_dates: this.state.show_future_dates,
    };
    if (typeof noUpdate === "undefined") this.refreshPreview();
  }
  handCheckChange = (event) => {
    const label = event.target.dataset.label;
    this.setState({ [label]: event.target.checked ? 1 : 0 }, () => {
      this.refreshComponent();
    });
  };
  handleInputChange = (event) => {
    const label = event.target.dataset.label;
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
            // this.editorRef.current.setHtml(res.message);
            this.setState({
              defaultHtml: res.message,
            });
            const updateState = {
              backButton: res.back_button,
              skipButton: res.skip_button,
              leads: res.leads,
              lead_tag: res.lead_tag,
              show_past_dates: res.show_past_dates,
              show_future_dates: res.show_future_dates,
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
      leads: this.state.leads,
      lead_tag: this.state.lead_tag,
      order_no: this.props.orderNo,
      show_past_dates: this.state.show_past_dates,
      show_future_dates: this.state.show_future_dates,
    };
    console.log("this.props.questionId", this.props);
    if (this.props.questionId === "") {
      createComponent(
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
                          onChange={this.handCheckChange}
                          data-label="backButton"
                          checked={this.state.backButton === 1}
                        />
                      </Form.Group>
                      <Form.Group controlId="formSkipCheckbox">
                        <Form.Check
                          type="checkbox"
                          label="Skip button"
                          onChange={this.handCheckChange}
                          data-label="skipButton"
                          checked={this.state.skipButton === 1}
                        />
                      </Form.Group>
                      <Form.Group controlId="formLeadCheckbox">
                        <Form.Check
                          type="checkbox"
                          label="Leads"
                          onChange={this.handCheckChange}
                          data-label="leads"
                          checked={this.state.leads === 1}
                        />
                      </Form.Group>
                      <Form.Group className="d-flex align-items-center">
                        <Form.Label>Tags</Form.Label>
                        <Form.Select
                          aria-label="Default select example"
                          value={this.state.lead_tag}
                          onChange={this.handleInputChange}
                          data-label="lead_tag"
                          className="tag_select"
                        >
                          <option value="DATE">DATE</option>
                        </Form.Select>
                      </Form.Group>
                    </div>
                  </div>
                  <div className="dates_component">
                    <label htmlFor="Chat Message">Dates</label>
                    <div>
                      <Form.Group controlId="formpasteDate">
                        <Form.Check
                          type="checkbox"
                          label="Show Past Dates"
                          onChange={this.handCheckChange}
                          data-label="show_past_dates"
                          checked={this.state.show_past_dates === 1}
                        />
                      </Form.Group>
                      {/* <p className="date_text">
                        Duis aute irure dolor in reprehenderit in voluptate
                        velit
                      </p> */}
                      <Form.Group controlId="formFutureDate">
                        <Form.Check
                          type="checkbox"
                          label="Show Future Dates"
                          onChange={this.handCheckChange}
                          data-label="show_future_dates"
                          checked={this.state.show_future_dates === 1}
                        />
                      </Form.Group>
                      {/* <p className="date_text">
                        Duis aute irure dolor in reprehenderit in voluptate
                        velit
                      </p> */}
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
