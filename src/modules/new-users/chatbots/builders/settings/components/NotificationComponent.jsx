import React, { Component, Fragment } from "react";
import { Button } from "@mui/material";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import "react-multi-email/style.css";
import SimpleReactValidator from "simple-react-validator";

import {
  getNotificationList,
  createNotification,
} from "../server/NotificationServer.js";
import { successAlert } from "../../../../../../js/alerts.js";
import { connect } from "react-redux";
import {
  setSendMailForm,
  setUpdateNotification,
} from "../../../../../../redux/actions/ReduxActionPage.jsx";
import {
  sendMail,
  updateNotification,
} from "../../../../knowledge-base/server/knowledgebaseServer.js";

export class NotificationComponent extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {
        email: "Invalid email address",
      },
    });
    this.state = {
      emails: [],
      offlineemails: [],
      notification: {
        emailnotification: "",
        chat_notification: "",
        offline_email_notification: "",
        braodcast_notification: "",
        emailfrom: "noreply@weconnect.chat",
        emailto: "",
        reply_to: "",
        emailsubject: "",
        offline_email_from: "noreply@weconnect.chat",
        offline_email_to: "",
        offline_reply_to: "",
        offline_email_subject: "",
      },
    };
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    _this.fetchDataFromServer();
  }

  fetchDataFromServer = () => {
    let _this = this;
    let params = `botid=${_this.props.botIdURL}`;
    getNotificationList(
      params,
      (res) => {
        let emailsList = [];
        let offlineemailsList = [];
        // debugger;
        let temp = res.notification;
        temp.emailfrom = "noreply@weconnect.chat";
        temp.offline_email_from = "noreply@weconnect.chat";
        temp.emailnotification = temp.emailnotification === 1 ? true : false;
        temp.chat_notification = temp.chat_notification === 1 ? true : false;
        temp.braodcast_notification =
          temp.braodcast_notification === 1 ? true : false;
        temp.offline_email_notification =
          temp.offline_email_notification === 1 ? true : false;
        if (temp?.offline_email_to !== "") {
          offlineemailsList = temp?.offline_email_to?.split(",");
        }
        if (temp?.emailto !== "") {
          emailsList = temp?.emailto?.split(",");
        }
        _this.setState({
          notification: temp,
          emails: emailsList,
          offlineemails: offlineemailsList,
        });
        _this.props._this.setState({ loading: false });
      },
      () => {
        _this.props._this.setState({ loading: false });
      }
    );
  };

  onSubmit = () => {
    let _this = this;
    let params = `botid=${_this.props.botIdURL}`;
    let newObj = _this.state.notification;
    let tempObj = {};
    tempObj.emailnotification = newObj.emailnotification ? 1 : 0;
    tempObj.chat_notification = newObj.chat_notification ? 1 : 0;
    tempObj.braodcast_notification = newObj.braodcast_notification ? 1 : 0;
    tempObj.offline_email_notification = newObj.offline_email_notification
      ? 1
      : 0;
    tempObj.from = newObj.emailfrom;
    tempObj.replyto = newObj.reply_to;
    tempObj.subject = newObj.emailsubject;
    tempObj.to = "";
    tempObj.offline_from = newObj.offline_email_from;
    tempObj.offline_reply_to = newObj.offline_reply_to;
    tempObj.offline_subject = newObj.offline_email_subject;
    tempObj.offline_to = "";
    tempObj.botid = _this.props.botIdURL;
    if (_this.state.emails && _this.state.emails.length > 0) {
      tempObj.to += _this.state.emails.map((prop) => {
        return prop;
      });
    }
    if (_this.state.offlineemails && _this.state.offlineemails.length > 0) {
      tempObj.offline_to += _this.state.offlineemails.map((prop) => {
        return prop;
      });
    }
    console.log(newObj);
    console.log(tempObj);

    if (_this.validator.allValid()) {
      _this.props.handleLoadingShow(true);
      createNotification(
        tempObj,
        (res) => {
          _this.props.handleLoadingShow(false);
          successAlert("Updated Successfully!", _this.props.superThis);
          _this.fetchDataFromServer();
          _this.props.selectActiveTab(3);
        },
        (res) => {
          _this.setState({ loading: false });
          _this.props.handleLoadingShow(false);
        }
      );
    } else {
      _this.validator.showMessages();
      this.forceUpdate();
    }
  };

  handleInputChange = (e) => {
    let _this = this;
    var newObj = _this.state.notification;
    newObj[e.target.name] = e.target.value;
    _this.setState({ notification: newObj });
  };

  render() {
    let _this = this;
    return (
      <Fragment>
        <div className="right-block">
          <div className="header">
            <p className="heading">Notifications</p>
            <p className="desc">
              Email the transcript of every chat to designated mail id
            </p>
          </div>
          <div className="main-block">
            <p className="general_title">Chat transcript</p>
            {/* <p className="general_text">
              
            </p> */}
            <div className="basic-acc-block">
              <div className="availability_box">
                <input
                  name=""
                  value={_this.state.notification.emailnotification}
                  checked={_this.state.notification.emailnotification}
                  onChange={(e) => {
                    var newObj = _this.state.notification;
                    newObj.emailnotification = !newObj.emailnotification;
                    _this.setState({
                      notification: newObj,
                    });
                  }}
                  type="checkbox"
                ></input>
                <div style={{ width: "100%" }}>
                  <p className="availability_title">Email Notification</p>
                  {/* <p className="availability_text">
                    
                  </p> */}
                </div>
              </div>
            </div>

            <div className="basic-acc-block email-notification-block">
              <div>
                <div className="email_titles">
                  <p>From:</p>
                </div>
                <div className="email_inputs">
                  <input
                    type="text"
                    name="emailfrom"
                    placeholder="Enter from"
                    readOnly={true}
                    // value={"noreply@weconnect.chat"}
                    value={
                      _this.state.notification &&
                      _this.state.notification.emailfrom
                    }
                    // onChange={this.handleInputChange}
                  />
                  <div className="errorMsg">
                    {_this.state.notification.emailnotification == 1 &&
                      _this.validator.message(
                        "form",
                        _this.state.notification &&
                          _this.state.notification.emailfrom,
                        "required|email"
                      )}
                  </div>
                </div>
              </div>
              <div>
                <div className="email_titles">
                  <p>To:</p>
                </div>
                <div className="email_inputs">
                  <ReactMultiEmail
                    placeholder="Enter to"
                    emails={_this.state.emails}
                    onChange={(_emails) => {
                      _this.setState({ emails: _emails });
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
                  <div className="errorMsg">
                    {_this.state.notification.emailnotification == 1 &&
                      _this.validator.message(
                        "To",
                        _this.state.emails && _this.state.emails.length > 0
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
                  <input
                    type="text"
                    name="reply_to"
                    placeholder="Enter reply_to"
                    value={
                      _this.state.notification &&
                      _this.state.notification.reply_to
                    }
                    onChange={this.handleInputChange}
                  />
                  <div className="errorMsg">
                    {_this.state.notification.emailnotification == 1 &&
                      _this.validator.message(
                        "reply to",
                        _this.state.notification &&
                          _this.state.notification.reply_to,
                        "required|email"
                      )}
                  </div>
                </div>
              </div>
              <div>
                <div className="email_titles">
                  <p>Subject:</p>
                </div>
                <div className="email_inputs">
                  <input
                    type="text"
                    name="emailsubject"
                    placeholder="Enter subject"
                    value={
                      _this.state.notification &&
                      _this.state.notification.emailsubject
                    }
                    onChange={this.handleInputChange}
                  />
                  <div className="errorMsg">
                    {_this.state.notification.emailnotification == 1 &&
                      _this.validator.message(
                        "subject",
                        _this.state.notification &&
                          _this.state.notification.emailsubject,
                        "required"
                      )}
                  </div>
                </div>
              </div>
            </div>
            {/* ----offline chat--- */}
            <p className="general_title">Offline Chat transcript</p>
            {/* <p className="general_text">
              
            </p> */}
            <div className="basic-acc-block">
              <div className="availability_box">
                <input
                  name=""
                  value={_this.state.notification.braodcast_notification}
                  checked={_this.state.notification.braodcast_notification}
                  onChange={(e) => {
                    var newObj = _this.state.notification;
                    newObj.braodcast_notification =
                      !newObj.braodcast_notification;
                    _this.setState({
                      notification: newObj,
                    });
                  }}
                  type="checkbox"
                ></input>
                <div style={{ width: "100%" }}>
                  <p className="availability_title">Braodcast Notification</p>
                </div>
              </div>
            </div>
            <div className="basic-acc-block">
              <div className="availability_box">
                <input
                  name=""
                  value={_this.state.notification.chat_notification}
                  checked={_this.state.notification.chat_notification}
                  onChange={(e) => {
                    var newObj = _this.state.notification;
                    newObj.chat_notification = !newObj.chat_notification;
                    _this.setState({
                      notification: newObj,
                    });
                  }}
                  type="checkbox"
                ></input>
                <div style={{ width: "100%" }}>
                  <p className="availability_title">Chat Notification</p>
                </div>
              </div>
            </div>
            <div className="basic-acc-block">
              <div className="availability_box">
                <input
                  name=""
                  value={_this.state.notification.offline_email_notification}
                  checked={_this.state.notification.offline_email_notification}
                  onChange={(e) => {
                    var newObj = _this.state.notification;
                    newObj.offline_email_notification =
                      !newObj.offline_email_notification;
                    _this.setState({
                      notification: newObj,
                    });
                  }}
                  type="checkbox"
                ></input>
                <div style={{ width: "100%" }}>
                  <p className="availability_title">
                    Offlineemail Notification
                  </p>
                </div>
              </div>
            </div>
            <div className="basic-acc-block email-notification-block">
              <div>
                <div className="email_titles">
                  <p>Offline From:</p>
                </div>
                <div className="email_inputs">
                  <input
                    type="text"
                    name="offline_email_from"
                    placeholder="Enter offline from"
                    readOnly={true}
                    // value={"noreply@weconnect.chat"}
                    value={
                      _this.state.notification &&
                      _this.state.notification.offline_email_from
                    }
                    // onChange={this.handleInputChange}
                  />
                  <div className="errorMsg">
                    {_this.state.notification.offline_email_notification == 1 &&
                      _this.validator.message(
                        "form",
                        _this.state.notification &&
                          _this.state.notification.offline_email_from,
                        "required|email"
                      )}
                  </div>
                </div>
              </div>

              <div>
                <div className="email_titles">
                  <p>Offline To:</p>
                </div>
                <div className="email_inputs">
                  <ReactMultiEmail
                    placeholder="Enter offline to"
                    emails={_this.state.offlineemails}
                    onChange={(_emails) => {
                      _this.setState({ offlineemails: _emails });
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
                  <div className="errorMsg">
                    {_this.state.notification.offline_email_notification == 1 &&
                      _this.validator.message(
                        "To",
                        _this.state.offlineemails &&
                          _this.state.offlineemails.length > 0
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
                  <input
                    type="text"
                    name="offline_reply_to"
                    placeholder="Enter offline reply_to"
                    value={
                      _this.state.notification &&
                      _this.state.notification.offline_reply_to
                    }
                    onChange={this.handleInputChange}
                  />
                  <div className="errorMsg">
                    {_this.state.notification.offline_email_notification == 1 &&
                      _this.validator.message(
                        "offline reply to",
                        _this.state.notification &&
                          _this.state.notification.offline_reply_to,
                        "required|email"
                      )}
                  </div>
                </div>
              </div>
              <div>
                <div className="email_titles">
                  <p>offline Subject:</p>
                </div>
                <div className="email_inputs">
                  <input
                    type="text"
                    name="offline_email_subject"
                    placeholder="Enter offline subject"
                    value={
                      _this.state.notification &&
                      _this.state.notification.offline_email_subject
                    }
                    onChange={this.handleInputChange}
                  />
                  <div className="errorMsg">
                    {_this.state.notification.offline_email_notification == 1 &&
                      _this.validator.message(
                        "subject",
                        _this.state.notification &&
                          _this.state.notification.offline_email_subject,
                        "required"
                      )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer">
            <Button
              type="button"
              onClick={() => {
                _this.fetchDataFromServer();
              }}
              variant="outlined"
              className="cancel-btn"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                _this.onSubmit();
              }}
              variant="outlined"
              className="save-btn"
            >
              Save
            </Button>
          </div>
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  const category = state.knowledgeBase.category || [];
  const article = state.knowledgeBase.article || {};
  const categoryForm = state.knowledgeBase.categoryForm || {};
  return {
    category,
    article,
    categoryForm,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setNotification: (data) => {
      dispatch(setUpdateNotification(data));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NotificationComponent);
