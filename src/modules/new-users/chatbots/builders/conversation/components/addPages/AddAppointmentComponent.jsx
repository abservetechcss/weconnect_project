import React, { Component, Fragment } from "react";
import moment from "moment";
import downArrow from "../../../../../../../assets/images/Path 48024.svg";
import calenderIcon from "../../../../../../../assets/images/calendar.svg";
import { TextField, ToggleButtonGroup, ToggleButton } from "@mui/material";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
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
export class AddAppointmentComponent extends Component {
  static contextType = AlertContext;

  constructor(props) {
    super(props);

    let fromTime = new Date();
    let toTime = new Date();
    fromTime.setHours(9);
    fromTime.setMinutes(0);

    toTime.setHours(17);
    toTime.setMinutes(0);

    this.state = {
      backButton: 0,
      skipButton: 0,
      save: false,
      dateRange: [null, null],
      start_date: "",
      end_date: "",
      days: [],
      from_time: fromTime,
      to_time: toTime,
      duration: 30,
      no_of_appointment: 1,
      message_confirmation: "Your appointment is confirmed",
      message_unavailable: "Slots are not available for the selected day",
      message_booked: "Selected slot is not available",
      time: null,
      weekSelect: [1, 2, 3, 4, 5],
      defaultHtml: "<p>Book an Appointment/ meeting</p>",
      editordata: "",
    };

    this.handCheckChange = this.handCheckChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.myRef = {
      component: {
        question_id: "0C71F93F-5FC8-4149-9395-AAFD833FB411",
        type: this.props.type,
        question: this.state.defaultHtml,
        from_time: fromTime,
        to_time: toTime,
        duration: 30,
        message_confirmation: "Your appointment is confirmed",
        message_unavailable: "Slots are not available for the selected day",
        message_booked: "Selected slot is not available",
        back_button: 0,
        skip_button: 0,
        show_past_dates: true,
        show_future_dates: true,
        welcome_card_image: "",
        enable: 0,
        available_day: [1, 2, 3, 4, 5].join(","),
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

  handleMinutes = (event, newminutes) => {
    this.setState(
      {
        duration: newminutes,
      },
      () => {
        this.refreshComponent();
      }
    );
  };
  handleWeekChange = (data) => {
    let tempObj = this.state.weekSelect;
    if (tempObj.includes(data)) {
      tempObj.splice(tempObj.indexOf(data), 1);
    } else {
      tempObj.push(data);
    }
    this.setState(
      {
        weekSelect: tempObj,
      },
      () => {
        this.refreshComponent();
      }
    );
  };

  refreshPreview() {
    if (
      this.props.widget &&
      this.props.widget.webchatRef.current.updateMessageComponent
    ) {
      console.log("data", this.myRef);
      this.props.widget.webchatRef.current.updateMessageComponent({
        msgIndex: 0,
        component: this.myRef.component,
        botdetails: {
          time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        },
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
          botdetails: {
            time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          },
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
      available_day: this.state.weekSelect.map(Number).join(","),
      back_button: this.state.backButton,
      skip_button: this.state.skipButton,
      question: html,
      from_time: this.state.from_time,
      to_time: this.state.to_time,
      duration: this.state.duration,
      message_confirmation: this.state.message_confirmation,
      message_unavailable: this.state.message_unavailable,
      message_booked: this.state.message_booked,
    };
    this.myRef.component = component;
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
            // const fromDate = moment(res.start_date);
            // const toDate = moment(res.end_date);
            // let dateRange = [null, null];
            // if (fromDate.isValid() && toDate.isValid()) {
            //   dateRange = [fromDate.toDate(), toDate.toDate()];
            // }
            const updateState = {
              backButton: res.back_button,
              skipButton: res.skip_button,
              duration: res.duration,
              order_no: res.orderNo,
              to_time: moment(res.to_time, "hh:mm A"),
              from_time: moment(res.from_time, "hh:mm A"),
              // dateRange: dateRange,
              // start_date: moment(res.startDate),
              // end_date: moment(res.end_date),
              weekSelect: res.available_day.split(",").map(Number),
              message_booked: res.message_booked,
              message_confirmation: res.message_confirmation,
              message_unavailable: res.message_unavailable,
              no_of_appointment: res.no_of_appointment,
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
    if (this.state.from_time == null || this.state.to_time == null) {
      errors.push("From Time & To Time is Required");
    } else if (
      new Date(this.state.from_time).getTime() >
      new Date(this.state.to_time).getTime()
    ) {
      errors.push("To Time should be greater than From Time");
    }

    if (errors.length > 0) {
      this.context.showAlert({ type: "error", message: errors.join("\n\r") });
      this.handleDialogClose();
      return;
    }
    // console.log("dateRange", this.state.dateRange);
    // const [startDate, endDate] = this.state.dateRange;
    // console.log(startDate, endDate);
    const data = {
      type: this.props.type,
      bot_id: botId,
      chat_message: html,
      back_button: this.state.backButton,
      skip_button: this.state.skipButton,
      duration: this.state.duration,
      order_no: this.props.orderNo,
      to_time: moment(this.state.to_time).format("hh:mm A"),
      from_time: moment(this.state.from_time).format("hh:mm A"),
      start_date: moment().format("YYYY-MM-DD"),
      end_date: moment().format("YYYY-MM-DD"),
      available_day: this.state.weekSelect.join(","),
      message_booked: this.state.message_booked,
      message_confirmation: this.state.message_confirmation,
      message_unavailable: this.state.message_unavailable,
      no_of_appointment: this.state.no_of_appointment,
    };
    console.log("this.props.questionId", this.props);
    if (this.props.questionId === "") {
      createComponent(
        data,
        (res) => {
          console.log("res", res);
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
    // const [startDate, endDate] = this.state.dateRange;
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
                    </div>
                  </div>
                </div>
              </div>

              <div className="appointment_block">
                <label htmlFor="Error Message">Appointment</label>
                <div className="app_box">
                  {/* <div className="date-picker-range-block-cust">
                    <div className="icon-block">
                      <img
                        src={calenderIcon}
                        className="calender-icon"
                        alt=""
                      />
                    </div>
                    <div className="date-picker-box">
                      <DatePicker
                        selectsRange={true}
                        startDate={startDate}
                        endDate={endDate}
                        onChange={(update) => {
                          // setDateRange(update);
                          this.setState({
                            dateRange: update,
                          });
                        }}
                        isClearable={true}
                        dateFormat="MMMM d"
                      />
                      <img src={downArrow} alt="" />
                    </div>
                  </div> */}

                  <div className="weekly_days_block">
                    <label htmlFor="Error Message">Days</label>
                    <div className="weekly_days">
                      <div
                        className="days_box"
                        style={
                          this.state.weekSelect.includes(0)
                            ? { backgroundColor: "#019F9C", color: "#fff" }
                            : {}
                        }
                        onClick={() => {
                          this.handleWeekChange(0);
                        }}
                      >
                        S
                      </div>
                      <div
                        className="days_box"
                        style={
                          this.state.weekSelect.includes(1)
                            ? { backgroundColor: "#019F9C", color: "#fff" }
                            : {}
                        }
                        onClick={() => {
                          this.handleWeekChange(1);
                        }}
                      >
                        M
                      </div>
                      <div
                        className="days_box"
                        style={
                          this.state.weekSelect.includes(2)
                            ? { backgroundColor: "#019F9C", color: "#fff" }
                            : {}
                        }
                        onClick={() => {
                          this.handleWeekChange(2);
                        }}
                      >
                        T
                      </div>
                      <div
                        className="days_box"
                        style={
                          this.state.weekSelect.includes(3)
                            ? { backgroundColor: "#019F9C", color: "#fff" }
                            : {}
                        }
                        onClick={() => {
                          this.handleWeekChange(3);
                        }}
                      >
                        W
                      </div>
                      <div
                        className="days_box"
                        style={
                          this.state.weekSelect.includes(4)
                            ? { backgroundColor: "#019F9C", color: "#fff" }
                            : {}
                        }
                        onClick={() => {
                          this.handleWeekChange(4);
                        }}
                      >
                        T
                      </div>
                      <div
                        className="days_box"
                        style={
                          this.state.weekSelect.includes(5)
                            ? { backgroundColor: "#019F9C", color: "#fff" }
                            : {}
                        }
                        onClick={() => {
                          this.handleWeekChange(5);
                        }}
                      >
                        F
                      </div>
                      <div
                        className="days_box"
                        style={
                          this.state.weekSelect.includes(6)
                            ? { backgroundColor: "#019F9C", color: "#fff" }
                            : {}
                        }
                        onClick={() => {
                          this.handleWeekChange(6);
                        }}
                      >
                        S
                      </div>
                    </div>
                  </div>
                  <div className="time_picker_block">
                    <label htmlFor="Error Message">Time</label>
                    <div className="time_picker_box">
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                          label="From"
                          value={this.state.from_time}
                          onChange={(newValue) => {
                            this.setState({ from_time: newValue });
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <TimePicker
                          label="To"
                          value={this.state.to_time}
                          onChange={(newValue) => {
                            this.setState({ to_time: newValue });
                          }}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider>
                    </div>
                  </div>
                  <div className="app_permin_block">
                    <label>Accept</label>
                    <div className="min-block">
                      {/* <div className="input_number_digits">
                        <input type="number" 
                          value={this.state.interval}
                          onChange={this.handleInputChange}
                          data-label="interval" />
                      </div> */}
                      <Form.Select
                        aria-label="Default select example"
                        value={this.state.no_of_appointment}
                        onChange={this.handleInputChange}
                        data-label="no_of_appointment"
                      >
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                      </Form.Select>
                    </div>
                    <label>appoinment per</label>
                    <ToggleButtonGroup
                      value={this.state.duration}
                      onChange={this.handleMinutes}
                      exclusive
                    >
                      <ToggleButton value={15}>15</ToggleButton>
                      <ToggleButton value={30}>30</ToggleButton>
                      <ToggleButton value={60}>60</ToggleButton>
                    </ToggleButtonGroup>
                    <label>minutes</label>
                  </div>
                </div>
              </div>
              <div className="digits-section-block email-section-block upload-section-block">
                <label htmlFor="Error Message">Message</label>
                <div className="digits-block">
                  <div className="error-msg-block">
                    <label htmlFor="Error Message">
                      Success message on confirmation
                    </label>
                    <Form.Group
                      className=""
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Control
                        type="text"
                        value={this.state.message_confirmation}
                        onChange={this.handleInputChange}
                        data-label="message_confirmation"
                        placeholder="Your appointment is confirmed"
                      />
                    </Form.Group>
                  </div>
                  <div className="error-msg-block">
                    <label htmlFor="Error Message">
                      Message to show when slots are unavailable
                    </label>
                    <Form.Group
                      className=""
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Control
                        type="text"
                        value={this.state.message_unavailable}
                        onChange={this.handleInputChange}
                        data-label="message_unavailable"
                        placeholder="Slots are not available for the selected day"
                      />
                    </Form.Group>
                  </div>
                  <div className="error-msg-block">
                    <label htmlFor="Error Message">
                      Message to show when selected slot is already booked
                    </label>
                    <Form.Group
                      className=""
                      controlId="exampleForm.ControlInput1"
                    >
                      <Form.Control
                        type="text"
                        value={this.state.message_booked}
                        onChange={this.handleInputChange}
                        data-label="message_booked"
                        placeholder="Selected slot is not available"
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

export default AddAppointmentComponent;
