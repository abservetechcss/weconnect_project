import React, { Component } from "react";
import { FloatingLabel, Form } from "react-bootstrap";

import { step1get, step1save } from "./RaibuStepComponentServer";
import { AlertContext } from "../../../../../../../../common/Alert";

export default class RaibuStep1Component extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    this.state = {
      welcome_message: "",
      offline_message: "",
      human_takeover_message: "",
      video_chat_message: "",
      assigned_message: ""
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.saveStep = this.saveStep.bind(this);
    this.getStep = this.getStep.bind(this);
  }

  saveStep() {
    const params = {
      bot_id: this.props.botId,
      welcome_message: this.state.welcome_message,
      offline_message: this.state.offline_message,
      human_takeover_message: this.state.human_takeover_message,
      video_chat_message: this.state.video_chat_message,
      assigned_message: this.state.assigned_message,
    };
    params.question_id = this.props.questionId;
    this.context.showLoading();
    step1save(
      params,
      (res) => {
        if (res.status === "True") {
          this.props.handleActiveStep(1);
          this.context.showLoading(false);
        } else {
          this.context.showAlert({
            type: "error",
            message: "Add Form Failed",
          });
        }
      },
      (error) => {
        this.context.showAlert({
          type: "error",
          message: error.message || "Add Form Failed",
        });
      }
    );
  }

  getStep() {
    let params = `bot_id=${this.props.botId}`;
    if (this.props.questionId !== "")
      params += `&question_id=${this.props.questionId}`;
    this.context.showLoading();
    step1get(
      params,
      (res) => {
        if (res.status === "True") {
          this.setState({
            welcome_message: res.welcome_message,
            offline_message: res.offline_message,
            human_takeover_message: res.human_takeover_message,
            video_chat_message: res.video_chat_message,
            assigned_message: res.assigned_message,
          });
          this.context.showLoading(false);
        } else {
          this.context.showAlert({
            type: "error",
            message: res.message || "Get Form Failed",
          });
        }
      },
      (error) => {
        this.context.showAlert({ type: "error", message: "Error!" });
      }
    );
  }

  componentDidMount() {
    //  this.props.setActive(this.saveStep);
    this.getStep();
  }

  handleInputChange = (event) => {
    this.setState({ [event.target.dataset.label]: event.target.value });
  };

  render() {
    return (
      <>
        <section className="raibu-step-block raibu-step-1 ">
          <FloatingLabel
            className="input-filed raibu-input1"
            controlId="floatingMessage"
            label="Welcome message"
          >
            <Form.Control
              className=""
              type="text"
              placeholder="Welcome message"
              name="message"
              value={this.state.welcome_message}
              onChange={this.handleInputChange}
              data-label="welcome_message"
              // value={_this.state.user && _this.state.user.email}
              // onChange={this.handleInputChange}
              // onKeyPress={(event) => {
              //     if (event.key === "Enter") {
              //         _this.onLogin();
              //     }
              // }}
            />
          </FloatingLabel>

          <FloatingLabel
            className="input-filed raibu-input1"
            controlId="floatingMessage"
            label="Offline message"
          >
            <Form.Control
              className=""
              type="text"
              placeholder="Offline message"
              name="message"
              value={this.state.offline_message}
              onChange={this.handleInputChange}
              data-label="offline_message"
              // value={_this.state.user && _this.state.user.email}
              // onChange={this.handleInputChange}
              // onKeyPress={(event) => {
              //     if (event.key === "Enter") {
              //         _this.onLogin();
              //     }
              // }}
            />
          </FloatingLabel>

          <FloatingLabel
            className="input-filed raibu-input1"
            controlId="floatingMessage"
            label="Takeover message"
          >
            <Form.Control
              className=""
              type="text"
              placeholder="Takeover message"
              name="message"
              value={this.state.human_takeover_message}
              onChange={this.handleInputChange}
              data-label="human_takeover_message"
              // value={_this.state.user && _this.state.user.email}
              // onChange={this.handleInputChange}
              // onKeyPress={(event) => {
              //     if (event.key === "Enter") {
              //         _this.onLogin();
              //     }
              // }}
            />
          </FloatingLabel>

          <FloatingLabel
            className="input-filed raibu-input1"
            controlId="floatingMessage"
            label="Video chat message"
          >
            <Form.Control
              className=""
              type="text"
              placeholder="Video chat message"
              name="message"
              value={this.state.video_chat_message}
              onChange={this.handleInputChange}
              data-label="video_chat_message"
            />
          </FloatingLabel>

          <FloatingLabel
            className="input-filed raibu-input1"
            controlId="floatingMessage"
            label="Assigned Message"
          >
            <Form.Control
              className=""
              type="text"
              placeholder="Assigned Message"
              name="message"
              value={this.state.assigned_message}
              onChange={this.handleInputChange}
              data-label="assigned_message"
            />
          </FloatingLabel>
        </section>
      </>
    );
  }
}
