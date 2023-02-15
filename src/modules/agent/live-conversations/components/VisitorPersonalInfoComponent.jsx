import React, { Component, Fragment, forwardRef } from "react";
import right_arrow from "../../../../assets/images/right-arrow.svg";
import { Form } from "react-bootstrap";
import "react-phone-input-2/lib/style.css";
import edit from "../../../../assets/images/edit-2.svg";
import calendar from "../../../../assets/images/calendar.svg";
import age from "../../../../assets/images/age.png";
import gender from "../../../../assets/images/gender.png";
import location from "../../../../assets/images/map-pin.svg";
import monitor from "../../../../assets/images/monitor.svg";
import link from "../../../../assets/images/link.svg";
import calenderIcon from "../../../../assets/images/calendar.svg";
import downArrow from "../../../../assets/images/Path 48024.svg";
import IconCheckbox from "./CheckBoxComponent";
import { Button } from "@mui/material";
import "emoji-mart/css/emoji-mart.css";
import DatePicker from "react-datepicker";
import moment from "moment";
import { errorAlert, successAlert } from "../../../../js/alerts.js";
import SimpleReactValidator from "simple-react-validator";
import { FiUser, FiMail, FiPhone } from "react-icons/fi";
import {
  updateVisitorNameInfo,
  updateVisitorNotes,
  createMarkLeadVisitor,
  updateLeadsInfo,
} from "../server/LiverConversationServer.js";
import { RiWechat2Line } from "react-icons/ri";
import { AlertContext } from "../../../common/Alert";
import { validURL, makeValidURL } from "../../../../js/lib";

const DateCustomInput = forwardRef(({ value, onClick }, ref) => (
  <div
    className="date-picker-range-block-cust lead_info_date_picker"
    onClick={onClick}
    ref={ref}
  >
    <div className="icon-block">
      <img src={calenderIcon} className="calender-icon" alt="" />
    </div>
    <div className="date-picker-box" style={{ width: "100%" }}>
      <div className="react-datepicker-wrapper">
        <div className="react-datepicker__input-container">
          <input
            readOnly
            type="text"
            className="react-datepicker-ignore-onclickoutside"
            value={value}
          />
        </div>
      </div>
      <img src={downArrow} alt="" />
    </div>
  </div>
));

export class VisitorPersonalInfoComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {},
    });
    this.state = {
      visitDetailToggle: true,
      dateRange: {
        startDate: null,
        endDate: null,
      },
      width: window.screen.width,
      height: 0,
      errorShowField: false,
      chatFieldInput: false,
      visitDetailToggleOpacity: 1,
      showVisitorName: false,
      showEditNotes: false,
      visitorName: props.activeVisitor && props.activeVisitor.vistor_name,
      notes: props.activeVisitor && props.activeVisitor.note,
      showEditLeads: false,
    };
  }
  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
    window.scrollTo(0, 0);
    if (window.innerWidth <= 1200) {
      this.setState({
        visitDetailToggle: !this.state.visitDetailToggle,
        visitDetailToggleOpacity: 0,
      });
    }
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.activeVisitor.vistor_id !== this.props.activeVisitor.vistor_id
    ) {
      this.setState({
        showVisitorName: false,
        showEditNotes: false,
        chatFieldInput: false,
        visitDetailToggle: true,
      });
    }
  }
  updateVisitorName = () => {
    let _this = this;
    let tempObj = {};
    tempObj.vistorid =
      _this.props.activeVisitor && _this.props.activeVisitor.vistor_id;
    tempObj.visitorname = _this.state.visitorName;
    _this.props._this.setState({
      loading: true,
    });
    setTimeout(() => {
      _this.props._this.setState({
        loading: false,
      });
    }, 3000);
    updateVisitorNameInfo(
      tempObj,
      (res) => {
        successAlert("Name updated successfully!", _this.props._this);
        _this.props.fetchDataFromServer();
        _this.setState(
          {
            showEditLeads: false,
            showEditNotes: false,
            showVisitorName: false,
          },
          () => {
            // clone object
            const activeVisitor = { ..._this.props.activeVisitor };
            activeVisitor.vistor_name = tempObj.visitorname;
            _this.props._this.setState({
              loading: false,
              activeVisitor: activeVisitor,
            });
          }
        );
      },
      (res) => {
        _this.props._this.setState({
          loading: false,
        });
      }
    );
  };
  editLeadsDetails = () => {
    let _this = this;
    let tempObj = _this.props.leadsDetails;
    tempObj.visitorid =
      _this.props.activeVisitor && _this.props.activeVisitor.vistor_id;

    const errors = [];

    // if(_this.props.leadsDetails.firstname.trim()==='') {
    //   errors.push("First name is required");
    // } else
    if (
      _this.props.leadsDetails.firstname !== "" &&
      !_this.props.leadsDetails.firstname.match(/^[_ a-zA-Z]+$/)
    ) {
      errors.push("Invalid Firstname!, only alphabets are allowed");
    }

    const emailRegex =
      /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    if (
      _this.props.leadsDetails.email !== "" &&
      !_this.props.leadsDetails.email.match(emailRegex)
    ) {
      errors.push("Invalid Email!");
    }

    if (
      _this.props.leadsDetails.lastname !== "" &&
      !_this.props.leadsDetails.lastname.match(/^[_ a-zA-Z]+$/)
    ) {
      errors.push("Invalid LastName!, only alphabets are allowed");
    }

    if (
      _this.props.leadsDetails.age !== "" &&
      !_this.props.leadsDetails.age.toString().match(/^[0-9]+$/)
    ) {
      errors.push("Invalid Age!, only numeric are allowed");
    }

    if (
      _this.props.leadsDetails.company !== "" &&
      !_this.props.leadsDetails.company.match(/^[_ a-zA-Z]+$/)
    ) {
      errors.push("Invalid Company!, only alphabets are allowed");
    }

    if (
      _this.props.leadsDetails.city !== "" &&
      !_this.props.leadsDetails.city.match(/^[_ a-zA-Z]+$/)
    ) {
      errors.push("Invalid city!, only alphabets are allowed");
    }
    if (
      _this.props.leadsDetails.lead_country !== "" &&
      !_this.props.leadsDetails.lead_country.match(/^[_ a-zA-Z]+$/)
    ) {
      errors.push("Invalid Country!, only alphabets are allowed");
    }
    if (
      _this.props.leadsDetails.phone !== "" &&
      !_this.props.leadsDetails.phone.match(/^[-_0-9]+$/)
    ) {
      errors.push("Invalid Phone!, only numeric are allowed");
    }
    // const url = makeValidURL(_this.props.leadsDetails.websiteurl);
    if (
      _this.props.leadsDetails.websiteurl !== "" &&
      !validURL(_this.props.leadsDetails.websiteurl)
    ) {
      errors.push("Please Provide Valid Website URL");
    }

    if (
      _this.props.leadsDetails.email === "" &&
      _this.props.leadsDetails.phone === ""
    ) {
      errors.push("Email or phone is Required");
    }

    if (errors.length > 0) {
      this.context.showAlert({ type: "error", message: errors.join("\n\r") });
      return;
    }

    _this.props._this.setState({
      loading: true,
    });
    updateLeadsInfo(
      tempObj.visitorid,
      tempObj,
      (res) => {
        _this.props._this.fetchSingleVisitorInfo();
        successAlert(
          "Lead Information updated Successfully!!",
          _this.props._this
        );
        _this.props._this.setState(
          {
            showEditLeads: false,
          },
          () => {
            // clone object
            // const activeVisitor = { ..._this.props.activeVisitor };
            // activeVisitor.vistor_name = tempObj.visitorname;
            _this.props._this.setState({
              loading: false,
              // activeVisitor: activeVisitor,
            });
          }
        );
      },
      (res) => {
        this.context.showAlert({
          type: "error",
          message: res.message || "Lead Update Failed!",
        });
        _this.props._this.setState({
          loading: false,
        });
      }
    );
  };
  updateNotes = () => {
    let _this = this;
    let tempObj = {};
    tempObj.vistorid =
      _this.props.activeVisitor && _this.props.activeVisitor.vistor_id;
    tempObj.visitornotes = this.props.activeVisitor.note;
    _this.props._this.setState({
      loading: true,
    });
    updateVisitorNotes(
      tempObj,
      (res) => {
        _this.props._this.fetchSingleVisitorInfo();
        _this.setState(
          {
            showEditLeads: false,
            showEditNotes: false,
            showVisitorName: false,
          },
          () => {
            // update also state

            _this.props._this.setState(
              {
                loading: false,
              },
              () => {
                successAlert("Note updated successfully!", _this.props._this);
              }
            );
          }
        );
      },
      (res) => {
        _this.props._this.setState({
          loading: false,
        });
      }
    );
  };

  updateMarkLeads = (leads) => {
    console.log(leads);
    let _this = this;
    let tempObj = {};
    tempObj.vistorid =
      _this.props.activeVisitor && _this.props.activeVisitor.vistor_id;
    tempObj.leads = leads === 1 ? 0 : 1;
    _this.props._this.setState({
      loading: true,
    });
    createMarkLeadVisitor(
      tempObj,
      (res) => {
        console.log(res.status);
        _this.props._this.setState({
          loading: false,
        });
        if (res.status === "True") {
          const activeVisitor = { ..._this.props.activeVisitor };
          activeVisitor.leads = tempObj.leads;

          _this.props._this.setState({
            loading: false,
            activeVisitor: activeVisitor,
            visitorDetails: {
              ..._this.props.visitorDetails,
              leads: tempObj.leads,
            },
          });
          successAlert(res.message, _this.props._this);
        } else {
          _this.props._this.setState({
            loading: false,
          });
          errorAlert(res.message, _this.props._this);
          _this.setState({
            errorShowField: true,
          });
          setTimeout(() => _this.setState({ errorShowField: false }), 10000);
        }
        _this.props.fetchDataFromServer();
      },
      (err) => {
        console.log(err);
      }
    );
  };

  updateDimensions = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
    if (this.state.width < 1200) {
      this.setState({
        visitDetailToggle: false,
      });
    } else {
      this.setState({
        visitDetailToggle: true,
      });
    }
  };
  handleInputChange = (e) => {
    let _this = this;
    var newObj = _this.props.leadsDetails;
    newObj[e.target.name] = e.target.value;
    _this.props._this.setState({ leadsDetails: newObj });
  };

  render() {
    let _this = this;
    let form = (
      <Fragment>
        <div
          className="block visitor-details delayedShow"
          style={
            _this.state.visitDetailToggle
              ? this.state.width < 1200
                ? {
                    position: "absolute",
                    maxWidth: "304px",
                    opacity: _this.state.visitDetailToggleOpacity,
                  }
                : {
                    position: "relative",
                    maxWidth: "304px",
                    opacity: _this.state.visitDetailToggleOpacity,
                  }
              : { maxWidth: "50px", position: "relative" }
          }
          // style={
          //   this.state.visitDetailToggle
          //     ? { maxWidth: '304px', position: 'absolute' }
          //     : { maxWidth: '50px', position: 'relative' }
          // }
        >
          {_this.state.visitDetailToggle ? (
            <div>
              <div className="assigned_box">
                <span
                  className="arrow-icon"
                  role="button"
                  onClick={() => {
                    _this.setState({
                      visitDetailToggle: !this.state.visitDetailToggle,
                    });
                    // setTimeout(() => {
                    //   if (!_this.state.visitDetailToggle) {
                    //     _this.setState({
                    //       visitDetailToggleOpacity: 0,
                    //     });
                    //   }
                    // }, 300);
                  }}
                >
                  <img src={right_arrow} alt="" />
                </span>
                <div
                  className="d-flex align-items-center mark-lead-block"
                  style={{
                    opacity: _this.state.visitDetailToggleOpacity,
                  }}
                >
                  {_this.props.activeVisitor.status !== "assign_to_me" &&
                    _this.props.activeVisitor.status !== "reject" &&
                    _this.props.activeVisitor.status !== "endchatrefresh" &&
                    _this.props.activeVisitor.status !== "to_accept" && (
                      <div
                        role="button"
                        onClick={() => {
                          _this.setState({
                            showEditLeads: false,
                            showEditNotes: false,
                            showVisitorName: false,
                          });
                          _this.updateMarkLeads(
                            _this.props.activeVisitor &&
                              _this.props.activeVisitor.leads
                          );
                        }}
                      >
                        {/* <img src={mark} alt="" /> */}
                        <IconCheckbox
                          checked={
                            _this.props.activeVisitor &&
                            _this.props.activeVisitor.leads === 1
                          }
                        />
                        <p className="read_text">Mark as lead</p>
                      </div>
                    )}

                  {/* <Button
                    className={
                      _this.state.chatFieldInput
                        ? "assigned_btn active"
                        : "assigned_btn"
                    }
                    variant="outlined"
                    onClick={() => {
                      _this.setState({
                        chatFieldInput: true,
                      });
                    }}
                  >
                    {_this.state.chatFieldInput ? "Assigned" : "Assign to me"}
                  </Button> */}
                  {_this.props.visitorDetails &&
                  _this.props.activeVisitor.accept === "assign_to_me" ? (
                    <Button
                      className="assigned_btn active"
                      variant="outlined"
                      onClick={() => {
                        this.props.chatWebscocketAction(
                          "assign_to_me",
                          this.props.activeVisitor
                        );
                      }}
                    >
                      Assign to me
                    </Button>
                  ) : _this.props.activeVisitor.status !== "closed" &&
                    _this.props.activeVisitor.status !== "reject" ? (
                    <Button className="assigned_btn" variant="outlined">
                      Assigned
                    </Button>
                  ) : null}
                </div>
              </div>
              <div
                className="visitors_data"
                style={{
                  opacity: _this.state.visitDetailToggleOpacity,
                }}
              >
                {_this.state.showVisitorName ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (_this.state.visitorName !== "") {
                        _this.updateVisitorName();
                      }
                    }}
                  >
                    <div className="edit-input-filed-block">
                      <Form.Group
                        controlId="formBasicEmail"
                        className="edit-input-filed"
                      >
                        <Form.Control
                          type="text"
                          value={_this.state.visitorName}
                          autoFocus={true}
                          placeholder="Enter visitor name"
                          onChange={(e) => {
                            _this.setState({
                              visitorName: e.target.value,
                            });
                          }}
                        />
                      </Form.Group>
                      <Button
                        type="button"
                        variant="contained"
                        className="edit-input-filed-submit"
                        disabled={_this.state.visitorName === "" ? true : false}
                        onClick={() => {
                          if (_this.state.visitorName !== "") {
                            _this.updateVisitorName();
                          }
                        }}
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="visitir_data_section">
                    <div
                      className="visitor_data_box"
                      role="button"
                      onClick={() => {
                        _this.setState({
                          visitorName:
                            _this.props.activeVisitor &&
                            _this.props.activeVisitor.vistor_name,
                          showVisitorName: true,
                        });
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <div className="visitor_avtar">
                          {_this.props.activeVisitor.vistor_name &&
                            _this.props.activeVisitor.vistor_name
                              .charAt(0)
                              .toUpperCase()}
                        </div>
                        <div>
                          <p className="visitor_name">
                            {_this.props.activeVisitor &&
                              _this.props.activeVisitor.vistor_name}
                          </p>
                          <p className="visitor_subtext">
                            User{" "}
                            {_this.props.activeVisitor &&
                            (_this.props.activeVisitor.status === "closed" ||
                              _this.props.activeVisitor.status === "endchat" ||
                              _this.props.activeVisitor.status ===
                                "endchatrefresh" ||
                              _this.props.activeVisitor.status === "reject")
                              ? "offline"
                              : "active"}
                          </p>
                        </div>
                      </div>
                      <p className="edit_text">
                        <img alt="" src={edit} />
                        Edit
                      </p>
                    </div>
                  </div>
                )}

                <div className="visitir_data_section">
                  <div className="user_data_box">
                    <p className="note_title">User data</p>
                  </div>
                  <div className="user_details">
                    <div>
                      <img alt="" src={calendar} />
                      <div>
                        <p className="user_detail_title">
                          {_this.props.visitorDetails &&
                          _this.props.visitorDetails.datetime
                            ? moment(
                                _this.props.visitorDetails.datetime
                              ).format("DD MMM, yyyy hh:mm A")
                            : null}
                        </p>
                        <p className="user_detail_text">Conversation date</p>
                      </div>
                    </div>
                    <div>
                      <img alt="" src={location} />
                      <div>
                        <p className="user_detail_title">
                          {_this.props.visitorDetails &&
                            _this.props.visitorDetails.country}
                        </p>
                        <p className="user_detail_text">Origin Country</p>
                      </div>
                    </div>
                    <div>
                      <img alt="" src={monitor} />
                      <div>
                        <p className="user_detail_title">{`${
                          _this.props.visitorDetails &&
                          _this.props.visitorDetails.browser
                        } / ${
                          _this.props.visitorDetails &&
                          _this.props.visitorDetails.operating_sys
                        }`}</p>
                        <p className="user_detail_text">{`Browser / ${
                          _this.props.visitorDetails &&
                          _this.props.visitorDetails.operating_sys
                        }`}</p>
                      </div>
                    </div>
                    <div>
                      <img alt="" src={link} />
                      <div>
                        <p className="user_detail_title">
                          <a
                            role="button"
                            target="_blank"
                            href={
                              _this.props.visitorDetails &&
                              _this.props.visitorDetails.sourceurl
                            }
                            rel="noreferrer"
                          >
                            {_this.props.visitorDetails &&
                              _this.props.visitorDetails.sourceurl}
                          </a>
                        </p>
                        <p className="user_detail_text">Source Url</p>
                      </div>
                    </div>
                    <div>
                      <RiWechat2Line />
                      <div>
                        <p className="user_detail_title">
                          {_this.props.visitorDetails &&
                            _this.props.visitorDetails.bot_name}
                        </p>
                        <p className="user_detail_text">Bot Name</p>
                      </div>
                    </div>
                  </div>
                </div>
                {_this.props.showEditLeads ? (
                  <Fragment>
                    <div className="lead-info-input-block">
                      <div className="edit-input-filed-block">
                        <Form.Group
                          controlId="formBasicEmail"
                          className="edit-input-filed"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Enter first name"
                            name="firstname"
                            value={
                              _this.props.leadsDetails &&
                              _this.props.leadsDetails.firstname
                            }
                            onChange={this.handleInputChange}
                          />
                          <div className="errorMsg">
                            {_this.validator.message(
                              "first name",
                              _this.props.leadsDetails &&
                                _this.props.leadsDetails.firstname,
                              "required"
                            )}
                          </div>
                        </Form.Group>
                      </div>
                      <div className="edit-input-filed-block">
                        <Form.Group
                          controlId="formBasicEmail"
                          className="edit-input-filed"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Enter last name"
                            name="lastname"
                            value={
                              _this.props.leadsDetails &&
                              _this.props.leadsDetails.lastname
                            }
                            onChange={this.handleInputChange}
                          />
                          <div className="errorMsg">
                            {_this.validator.message(
                              "last name",
                              _this.props.leadsDetails &&
                                _this.props.leadsDetails.lastname,
                              "required"
                            )}
                          </div>
                        </Form.Group>
                      </div>
                      <div className="edit-input-filed-block">
                        <Form.Group
                          controlId="formBasicEmail"
                          className="edit-input-filed"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Enter email Id"
                            name="email"
                            value={
                              _this.props.leadsDetails &&
                              _this.props.leadsDetails.email
                            }
                            onChange={this.handleInputChange}
                          />
                          <div className="errorMsg">
                            {_this.validator.message(
                              "email",
                              _this.props.leadsDetails &&
                                _this.props.leadsDetails.email,
                              "required|email"
                            )}
                          </div>
                        </Form.Group>
                      </div>
                      <div className="edit-input-filed-block">
                        <Form.Group
                          controlId="formBasicEmail"
                          className="edit-input-filed"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Enter phone number"
                            minLength="8"
                            maxLength="15"
                            pattern="[0-9]"
                            value={
                              _this.props.leadsDetails &&
                              _this.props.leadsDetails.phone
                            }
                            onChange={(e) => {
                              const re = /^[0-9\b]+$/;
                              let temp = _this.props.leadsDetails;
                              if (
                                e.target.value === "" ||
                                re.test(e.target.value)
                              ) {
                                temp.phone = e.target.value;
                                _this.props._this.setState({
                                  leadsDetails: temp,
                                });
                              }
                            }}
                          />{" "}
                        </Form.Group>

                        <div className="edit-input-filed-block">
                          <Form.Group
                            controlId="formBasicEmail"
                            className="edit-input-filed radio-field"
                          >
                            <label htmlFor="Gender">Select Gender</label>
                            <span>
                              <Form.Check
                                type="radio"
                                aria-label="radio 1"
                                name="gender"
                                value={
                                  _this.props.leadsDetails &&
                                  _this.props.leadsDetails.gender === "Male"
                                    ? true
                                    : false
                                }
                                checked={
                                  _this.props.leadsDetails &&
                                  _this.props.leadsDetails.gender === "Male"
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  var newObj = _this.props.leadsDetails;
                                  newObj.gender = "Male";
                                  _this.props._this.setState({
                                    leadsDetails: newObj,
                                  });
                                }}
                              />
                              Male
                            </span>
                            <span>
                              <Form.Check
                                type="radio"
                                aria-label="radio 1"
                                name="gender"
                                value={
                                  _this.props.leadsDetails &&
                                  _this.props.leadsDetails.gender === "Female"
                                    ? true
                                    : false
                                }
                                checked={
                                  _this.props.leadsDetails &&
                                  _this.props.leadsDetails.gender === "Female"
                                    ? true
                                    : false
                                }
                                onChange={(e) => {
                                  var newObj = _this.props.leadsDetails;
                                  newObj.gender = "Female";
                                  _this.props._this.setState({
                                    leadsDetails: newObj,
                                  });
                                }}
                              />
                              Female
                            </span>
                          </Form.Group>
                        </div>
                      </div>

                      <DatePicker
                        selectsRange={false}
                        isClearable={true}
                        // dateFormat="MMMM d"
                        selected={
                          _this.props.leadsDetails &&
                          _this.props.leadsDetails.date
                        }
                        customInput={<DateCustomInput />}
                        onChange={(date) => {
                          console.log(date);
                          let temp = _this.props.leadsDetails;
                          temp.date = date;
                          _this.props._this.setState({
                            leadsDetails: temp,
                          });
                        }}
                      />

                      <div className="edit-input-filed-block">
                        <Form.Group
                          controlId="formBasicEmail"
                          className="edit-input-filed"
                        >
                          <Form.Control
                            type="number"
                            placeholder="Enter Age"
                            name="age"
                            value={
                              _this.props.leadsDetails &&
                              _this.props.leadsDetails.age
                            }
                            onChange={(e) => {
                              const re = /^[0-9\b]+$/;
                              let temp = _this.props.leadsDetails;
                              if (
                                e.target.value === "" ||
                                re.test(e.target.value)
                              ) {
                                temp.age = e.target.value;
                                _this.props._this.setState({
                                  leadsDetails: temp,
                                });
                              }
                            }}
                          />
                        </Form.Group>
                      </div>
                      <div className="edit-input-filed-block">
                        <Form.Group
                          controlId="formBasicEmail"
                          className="edit-input-filed"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Enter company name"
                            name="company"
                            value={
                              _this.props.leadsDetails &&
                              _this.props.leadsDetails.company
                            }
                            onChange={this.handleInputChange}
                          />
                        </Form.Group>
                      </div>
                      <div className="edit-input-filed-block">
                        <Form.Group
                          controlId="formBasicEmail"
                          className="edit-input-filed"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Enter city name"
                            name="city"
                            value={
                              _this.props.leadsDetails &&
                              _this.props.leadsDetails.city
                            }
                            onChange={this.handleInputChange}
                          />
                        </Form.Group>
                      </div>
                      <div className="edit-input-filed-block">
                        <Form.Group
                          controlId="formBasicEmail"
                          className="edit-input-filed"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Enter country"
                            name="lead_country"
                            value={
                              _this.props.leadsDetails &&
                              _this.props.leadsDetails.lead_country
                            }
                            onChange={this.handleInputChange}
                          />
                        </Form.Group>
                      </div>
                      <div className="edit-input-filed-block">
                        <Form.Group
                          controlId="formBasicEmail"
                          className="edit-input-filed"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Enter address"
                            name="address"
                            as="textarea"
                            value={
                              _this.props.leadsDetails &&
                              _this.props.leadsDetails.address
                            }
                            onChange={this.handleInputChange}
                          />
                        </Form.Group>
                      </div>
                      <div className="edit-input-filed-block">
                        <Form.Group
                          controlId="formBasicEmail"
                          className="edit-input-filed"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Enter pin code"
                            name="pincode"
                            value={
                              _this.props.leadsDetails &&
                              _this.props.leadsDetails.pincode
                            }
                            onChange={this.handleInputChange}
                          />
                        </Form.Group>
                      </div>
                      <div className="edit-input-filed-block">
                        <Form.Group
                          controlId="formBasicEmail"
                          className="edit-input-filed"
                        >
                          <Form.Control
                            type="text"
                            placeholder="Enter website URL"
                            name="websiteurl"
                            value={
                              _this.props.leadsDetails &&
                              _this.props.leadsDetails.websiteurl
                            }
                            onChange={this.handleInputChange}
                          />
                        </Form.Group>
                      </div>
                      <div className="btn-block">
                        <div className="edit-input-filed-block">
                          <Button
                            type="button"
                            variant="contained"
                            className="edit-input-filed-submit"
                            onClick={() => {
                              _this.editLeadsDetails();
                            }}
                          >
                            Submit
                          </Button>
                        </div>

                        <div className="edit-input-filed-block">
                          <Button
                            type="button"
                            variant="contained"
                            className="edit-input-filed-submit cancel-btn"
                            onClick={() => {
                              _this.props._this.setState({
                                showEditLeads: false,
                              });
                              _this.props._this.fetchSingleVisitorInfo();
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Fragment>
                ) : (
                  <div className="visitir_data_section">
                    <div className="user_data_box">
                      <p className="note_title">Lead Information</p>
                      <p className="edit_text">
                        <img
                          role="button"
                          onClick={() => {
                            setTimeout(() => {
                              _this.props._this.setState({
                                showEditLeads: true,
                              });
                            }, 10);
                          }}
                          src={edit}
                          alt=""
                        />
                        Edit
                      </p>
                    </div>
                    {_this.props.leadsDetailsMessage ? (
                      _this.props.loading ? (
                        <div
                          style={{ width: "100%" }}
                          className="text-center alert alert-danger"
                        >
                          Loading...
                        </div>
                      ) : (
                        <div
                          style={{ width: "100%" }}
                          className="text-center alert alert-danger"
                        >
                          No Data Found!
                        </div>
                      )
                    ) : (
                      <div
                        className="user_details"
                        style={
                          _this.state.errorShowField
                            ? {
                                border: "1px solid red",
                                padding: "5px",
                                borderRadius: "10px",
                                transition: "0.2s",
                              }
                            : {
                                transition: "0.2s",
                              }
                        }
                      >
                        <div>
                          {/* <img alt="" src={calendar} /> */}
                          <FiUser />
                          <div>
                            <p className="user_detail_title">{`${_this.props.leadsDetails.firstname} ${_this.props.leadsDetails.lastname}`}</p>
                            <p className="user_detail_text">Name</p>
                          </div>
                        </div>

                        <div>
                          {/* <img alt="" src={calendar} /> */}
                          <FiMail />
                          <div>
                            <p className="user_detail_title">
                              {_this.props.leadsDetails &&
                                _this.props.leadsDetails.email}
                            </p>
                            <p className="user_detail_text">
                              Email<span className="text-danger">*</span>
                            </p>
                          </div>
                        </div>

                        <div>
                          {/* <img alt="" src={location} /> */}
                          <FiPhone />
                          <div>
                            <p className="user_detail_title">
                              {`+${
                                _this.props.leadsDetails &&
                                _this.props.leadsDetails.phone
                              }`}
                            </p>
                            <p className="user_detail_text">
                              Phone<span className="text-danger">*</span>
                            </p>
                          </div>
                        </div>

                        <div>
                          <img alt="" style={{ width: "14px" }} src={gender} />
                          <div>
                            <p className="user_detail_title">
                              {_this.props.leadsDetails &&
                                _this.props.leadsDetails.gender}
                            </p>
                            <p className="user_detail_text">Gender</p>
                          </div>
                        </div>
                        <div>
                          <img alt="" src={calendar} />
                          <div>
                            <p className="user_detail_title">
                              {_this.props.leadsDetails &&
                              _this.props.leadsDetails.date !== null
                                ? moment(_this.props.leadsDetails.date).format(
                                    "DD/MMM/yyyy"
                                  )
                                : "---"}
                            </p>
                            <p className="user_detail_text">Date</p>
                          </div>
                        </div>
                        <div>
                          <img alt="" style={{ width: "16px" }} src={age} />
                          <div>
                            <p className="user_detail_title">
                              {_this.props.leadsDetails &&
                              _this.props.leadsDetails.age !== null
                                ? _this.props.leadsDetails &&
                                  _this.props.leadsDetails.age
                                : "---"}
                            </p>
                            <p className="user_detail_text">Age</p>
                          </div>
                        </div>
                        <div>
                          <img alt="" src={location} />
                          <div>
                            <p className="user_detail_title">
                              {_this.props.leadsDetails &&
                                _this.props.leadsDetails.pincode}
                            </p>
                            <p className="user_detail_text">Pincode</p>
                          </div>
                        </div>

                        <div>
                          <img alt="" src={link} />
                          <div>
                            <p className="user_detail_title">
                              {_this.props.leadsDetails &&
                                _this.props.leadsDetails.company}
                            </p>
                            <p className="user_detail_text">Company</p>
                          </div>
                        </div>

                        <div>
                          <img alt="" src={location} />
                          <div>
                            <p className="user_detail_title">
                              {" "}
                              {_this.props.leadsDetails &&
                                _this.props.leadsDetails.city}
                            </p>
                            <p className="user_detail_text">City</p>
                          </div>
                        </div>

                        <div>
                          <img alt="" src={location} />
                          <div>
                            <p className="user_detail_title">
                              {" "}
                              {_this.props.leadsDetails &&
                                _this.props.leadsDetails.lead_country}
                            </p>
                            <p className="user_detail_text">Country</p>
                          </div>
                        </div>

                        <div>
                          <img alt="" src={location} />
                          <div>
                            <p className="user_detail_title">
                              {" "}
                              {_this.props.leadsDetails &&
                                _this.props.leadsDetails.address}
                            </p>
                            <p className="user_detail_text">Address</p>
                          </div>
                        </div>

                        <div>
                          <img alt="" src={link} />
                          <div>
                            <p className="user_detail_title">
                              {_this.props.leadsDetails.websiteurl !== "" ? (
                                <a href={_this.props.leadsDetails.websiteurl}>
                                  {_this.props.leadsDetails.websiteurl}
                                </a>
                              ) : (
                                "---"
                              )}
                            </p>
                            <p className="user_detail_text">Website URL</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <div
                  className="visitir_data_section"
                  role="button"
                  onClick={() => {
                    _this.setState({
                      notes:
                        _this.props.visitorDetails &&
                        _this.props.visitorDetails.note,
                      showEditNotes: true,
                    });
                  }}
                >
                  {_this.state.showEditNotes ? (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (_this.state.notes !== "") {
                          _this.updateNotes();
                        }
                      }}
                    >
                      <div className="edit-input-filed-block">
                        <Form.Group
                          controlId="formBasicEmail"
                          className="edit-input-filed"
                        >
                          <Form.Control
                            type="text"
                            as="textarea"
                            placeholder="Enter note"
                            autoFocus={true}
                            value={this.props.activeVisitor.note}
                            onChange={(e) => {
                              _this.props._this.setState({
                                activeVisitor: {
                                  ...this.props.activeVisitor,
                                  note: e.target.value,
                                },
                              });
                            }}
                          />
                        </Form.Group>
                        <Button
                          type="button"
                          variant="contained"
                          className="edit-input-filed-submit"
                          onClick={() => {
                            _this.updateNotes();
                          }}
                        >
                          Submit
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <>
                      <div className="user_data_box">
                        <p className="note_title">Note</p>
                        <p className="edit_text">
                          <img src={edit} alt="" />
                          Edit
                        </p>
                      </div>
                      <p className="note_text">
                        {_this.props.activeVisitor &&
                          _this.props.activeVisitor.note}
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div>
              <div className="assigned_toggle">
                <span
                  className="arrow-icon"
                  role="button"
                  onClick={() => {
                    this.setState({
                      visitDetailToggle: !_this.state.visitDetailToggle,
                    });
                    setTimeout(() => {
                      if (_this.state.visitDetailToggle) {
                        _this.setState({
                          visitDetailToggleOpacity: 1,
                        });
                      }
                    }, 300);
                  }}
                >
                  <img src={right_arrow} alt="" />
                </span>
              </div>
              <div className="close_visit_icons">
                <div
                  role="button"
                  onClick={() => {
                    _this.setState({
                      showEditLeads: false,
                      showEditNotes: false,
                      showVisitorName: false,
                    });
                    _this.updateMarkLeads(
                      _this.props.activeVisitor &&
                        _this.props.activeVisitor.leads
                    );
                  }}
                >
                  {/* <img src={mark} alt="" /> */}
                  <IconCheckbox
                    checked={
                      _this.props.activeVisitor &&
                      _this.props.activeVisitor.leads === 1
                    }
                  />
                </div>

                <img
                  role="button"
                  onClick={() => {
                    this.setState({
                      visitDetailToggle: !_this.state.visitDetailToggle,
                    });
                    setTimeout(() => {
                      if (_this.state.visitDetailToggle) {
                        _this.setState({
                          visitDetailToggleOpacity: 1,
                          visitorName:
                            _this.props.activeVisitor &&
                            _this.props.activeVisitor.vistor_name,
                          showVisitorName: true,
                        });
                      }
                    }, 300);
                  }}
                  src={edit}
                  alt=""
                />
              </div>
            </div>
          )}
        </div>
      </Fragment>
    );
    return <Fragment>{form}</Fragment>;
  }
}

export default VisitorPersonalInfoComponent;
