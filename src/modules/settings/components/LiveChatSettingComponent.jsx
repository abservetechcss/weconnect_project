import React, { Component, Fragment } from "react";
import { Button, Grid } from "@mui/material";
import { IconButton } from "@mui/material";
import draftToHtml from "draftjs-to-html";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { FloatingLabel, Form } from "react-bootstrap";
import deleteIcon from "../../../assets/images/userdash/trash-2 red.svg";
import menu from "../../../assets/images/userdash/Group 18691.svg";
import plus from "../../../assets/images/plus (1).svg";
import star from "../../../assets/images/star (2).svg";
import {
  getLiveChatSettingList,
  updateLiveChatSetting,
} from "../server/SettingServer.js";
import SimpleReactValidator from "simple-react-validator";
import { successAlert } from "../../../js/alerts";

export default class LiveChatSettingComponent extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {},
    });

    this.state = {
      liveChatSetting: {
        agent_sla_time_checkbox: 0,
        agent_sla_time_livechat: 0,
        agent_sla_time_videocall: 0,
        live_chat_timer_checkbox: 0,
        live_chat_timer_value: "",
        office_hours_checkbox: 0,
        office_hours_from: "",
        office_hours_to: "",
        office_hours_agent: "",
        office_hours_chatbot: "",
        reply_template_checkbox: 0,
        reply_template_type: "",
        reply_template_type_link: "",
        rate_conversation_agent_checkbox: 0,
        rate_1: "",
        rate_2: "",
        rate_3: "",
        rate_4: "",
        rate_5: "",
        feedback_chat_ends_checkbox: 0,
        feedback_question_title: "",
        feedback_options: "",
      },
      templateData: [],
      answerOption: [],
    };
  }
  componentDidMount() {
    let _this = this;
    _this.fetchDataFromServer();
  }

  fetchDataFromServer = () => {
    let _this = this;
    getLiveChatSettingList(
      "",
      (res) => {
        let temp = res.live_chat_settings;
        _this.setState({
          liveChatSetting: temp,
        });
        if (temp.feedback_options !== "") {
          if (temp.feedback_options.includes(",")) {
            let nameData = temp.feedback_options.split(",");
            for (var i = 0; i < nameData.length; i++) {
              let newObj = _this.state.answerOption;
              newObj.push({
                value: nameData[i],
                key: newObj.length,
              });
              _this.setState({
                answerOption: newObj,
              });
            }
          } else {
            let newObj = _this.state.answerOption;
            newObj.push({
              value: temp.feedback_options,

              key: newObj.length,
            });
            _this.setState({
              answerOption: newObj,
            });
          }
        }
        if (temp.reply_template_type_link !== "") {
          if (temp.reply_template_type_link.includes(",")) {
            let template_link = temp.reply_template_type_link.split(",");
            let template_type = temp.reply_template_type.split(",");
            for (var i = 0; i < template_type.length; i++) {
              let newObj = _this.state.templateData;
              newObj.push({
                type: template_type[i],
                link: template_link[i],
                key: newObj.length,
              });
              _this.setState({
                templateData: newObj,
              });
            }
          } else {
            let newObj = _this.state.templateData;
            newObj.push({
              type: temp.reply_template_type,
              link: temp.reply_template_type_link,

              key: newObj.length,
            });
            _this.setState({
              templateData: newObj,
            });
          }
        }
        _this.props._this.setState({ loading: false });
      },
      () => {
        _this.props._this.setState({ loading: false });
      }
    );
  };

  onSubmit = () => {
    let _this = this;
    let tempObj = JSON.parse(JSON.stringify(_this.state.liveChatSetting));
    tempObj.feedback_options = "";
    tempObj.reply_template_type = "";
    tempObj.reply_template_type_link = "";
    if (_this.state.answerOption && _this.state.answerOption.length > 0) {
      _this.state.answerOption.map((prop, key) => {
        if (key !== 0) {
          tempObj.feedback_options += ",";
        }
        tempObj.feedback_options += prop.value;
      });
    }
    if (_this.state.templateData && _this.state.templateData.length > 0) {
      _this.state.templateData.map((prop, key) => {
        if (key !== 0) {
          tempObj.reply_template_type += ",";
          tempObj.reply_template_type_link += ",";
        }
        tempObj.reply_template_type += prop.type;
        tempObj.reply_template_type_link += prop.link;
      });
    }
    if (_this.validator.allValid()) {
      _this.props.handleLoadingShow(true);
      updateLiveChatSetting(
        tempObj,
        (res) => {
          _this.props.handleLoadingShow(false);
          successAlert(
            "Live Chat Setting Updated Successfully!",
            _this.props._this
          );
          _this.fetchDataFromServer();
          _this.props.selectActiveTab(1);
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
    var newObj = _this.state.liveChatSetting;
    newObj[e.target.name] = e.target.value;
    _this.setState({ liveChatSetting: newObj });
  };
  render() {
    let _this = this;
    return (
      <Fragment>
        <div className="right-block">
          <div className="header">
            <p className="heading">Live chat settings</p>
            <p className="desc"></p>
          </div>
          <div className="main-block">
            <div className="live-chat-setting-section">
              <div className="timer-block">
                <div className="availability_box">
                  <input
                    type="checkbox"
                    value={
                      _this.state.liveChatSetting.agent_sla_time_checkbox == 0
                        ? false
                        : true
                    }
                    checked={
                      _this.state.liveChatSetting.agent_sla_time_checkbox == 0
                        ? false
                        : true
                    }
                    onChange={(e) => {
                      var newObj = _this.state.liveChatSetting;
                      newObj.agent_sla_time_checkbox =
                        newObj.agent_sla_time_checkbox == 0 ? 1 : 0;
                      _this.setState({
                        liveChatSetting: newObj,
                      });
                    }}
                  ></input>
                  <div>
                    <p className="availability_title">Agent SLA time</p>
                    <p className="availability_text">
                      Define agent’s time to respond to visitor
                    </p>
                    <div className="timer-input-block">
                      <div className="timer-field-block-cust">
                        <label htmlFor="Live chat">Live chat</label>
                        <div class="ms">
                          <input
                            type="number"
                            name="sec"
                            id="seconds"
                            value={
                              _this.state.liveChatSetting
                                .agent_sla_time_livechat
                            }
                            onChange={(e) => {
                              let newObj = _this.state.liveChatSetting;
                              if (parseInt(e.target.value) >= 0) {
                                newObj.agent_sla_time_livechat = parseInt(
                                  e.target.value
                                );
                                _this.setState({
                                  liveChatSetting: newObj,
                                });
                              } else {
                                newObj.agent_sla_time_livechat = 0;
                                _this.setState({
                                  liveChatSetting: newObj,
                                });
                              }
                            }}
                          />
                          <div className="arrow-block">
                            <KeyboardArrowDownIcon
                              className="icon up"
                              onClick={() => {
                                let newObj = _this.state.liveChatSetting;
                                newObj.agent_sla_time_livechat =
                                  newObj.agent_sla_time_livechat === ""
                                    ? 0
                                    : newObj.agent_sla_time_livechat;
                                if (
                                  parseInt(newObj.agent_sla_time_livechat) >= 0
                                ) {
                                  newObj.agent_sla_time_livechat =
                                    parseInt(newObj.agent_sla_time_livechat) +
                                    1;
                                  _this.setState({
                                    liveChatSetting: newObj,
                                  });
                                }
                              }}
                            />
                            <KeyboardArrowDownIcon
                              className="icon"
                              disabled={
                                _this.state.liveChatSetting
                                  .agent_sla_time_livechat === 0
                              }
                              onClick={() => {
                                let newObj = _this.state.liveChatSetting;
                                newObj.agent_sla_time_livechat =
                                  newObj.agent_sla_time_livechat === ""
                                    ? 0
                                    : newObj.agent_sla_time_livechat;
                                if (
                                  parseInt(newObj.agent_sla_time_livechat) > 0
                                ) {
                                  newObj.agent_sla_time_livechat =
                                    parseInt(newObj.agent_sla_time_livechat) -
                                    1;
                                  _this.setState({
                                    liveChatSetting: newObj,
                                  });
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="timer-field-block-cust">
                        <label htmlFor="Video call">Video call</label>
                        <div class="ms">
                          <input
                            type="number"
                            name="sec"
                            id="seconds"
                            value={
                              _this.state.liveChatSetting
                                .agent_sla_time_videocall
                            }
                            onChange={(e) => {
                              let newObj = _this.state.liveChatSetting;
                              if (parseInt(e.target.value) >= 0) {
                                newObj.agent_sla_time_videocall = parseInt(
                                  e.target.value
                                );
                                _this.setState({
                                  liveChatSetting: newObj,
                                });
                              } else {
                                newObj.agent_sla_time_videocall = 0;
                                _this.setState({
                                  liveChatSetting: newObj,
                                });
                              }
                            }}
                          />
                          <div className="arrow-block">
                            <KeyboardArrowDownIcon
                              className="icon up"
                              onClick={() => {
                                let newObj = _this.state.liveChatSetting;
                                newObj.agent_sla_time_videocall =
                                  newObj.agent_sla_time_videocall === ""
                                    ? 0
                                    : newObj.agent_sla_time_videocall;

                                if (
                                  parseInt(newObj.agent_sla_time_videocall) >= 0
                                ) {
                                  newObj.agent_sla_time_videocall =
                                    parseInt(newObj.agent_sla_time_videocall) +
                                    1;
                                  _this.setState({
                                    liveChatSetting: newObj,
                                  });
                                }
                              }}
                            />
                            <KeyboardArrowDownIcon
                              className="icon"
                              disabled={
                                _this.state.liveChatSetting
                                  .agent_sla_time_videocall === 0
                              }
                              onClick={() => {
                                let newObj = _this.state.liveChatSetting;
                                newObj.agent_sla_time_videocall =
                                  newObj.agent_sla_time_videocall === ""
                                    ? 0
                                    : newObj.agent_sla_time_videocall;
                                if (
                                  parseInt(newObj.agent_sla_time_videocall) > 0
                                ) {
                                  newObj.agent_sla_time_videocall =
                                    parseInt(newObj.agent_sla_time_videocall) -
                                    1;
                                  _this.setState({
                                    liveChatSetting: newObj,
                                  });
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* <div className="timer-block">
                <div className="availability_box">
                  <input
                    type="checkbox"
                    value={
                      _this.state.liveChatSetting.live_chat_timer_checkbox == 0
                        ? false
                        : true
                    }
                    checked={
                      _this.state.liveChatSetting.live_chat_timer_checkbox == 0
                        ? false
                        : true
                    }
                    onChange={(e) => {
                      var newObj = _this.state.liveChatSetting;
                      newObj.live_chat_timer_checkbox =
                        newObj.live_chat_timer_checkbox == 0 ? 1 : 0;
                      _this.setState({
                        liveChatSetting: newObj
                      });
                    }}
                  ></input>
                  <div>
                    <p className="availability_title">Live chat timer</p>
                    <p className="availability_text">
                      Define time to close live chat request in this time
                    </p>
                    <div className="timer-input-block">
                      <div className="timer-field-block-cust">
                        <label htmlFor="Disable">Disable</label>
                        <div class="ms">
                          <input
                            type="number"
                            name="sec"
                            id="seconds"
                            value={
                              _this.state.liveChatSetting.live_chat_timer_value
                            }
                            onChange={(e) => {
                              let newObj = _this.state.liveChatSetting;
                              if (parseInt(e.target.value) >= 0) {
                                newObj.live_chat_timer_value = parseInt(
                                  e.target.value
                                );
                                _this.setState({
                                  liveChatSetting: newObj
                                });
                              } else {
                                newObj.live_chat_timer_value = 0;
                                _this.setState({
                                  liveChatSetting: newObj
                                });
                              }
                            }}
                          />
                          <div className="arrow-block">
                            <KeyboardArrowDownIcon
                              className="icon up"
                              onClick={() => {
                                let newObj = _this.state.liveChatSetting;
                                newObj.live_chat_timer_value =
                                  newObj.live_chat_timer_value === ""
                                    ? 0
                                    : newObj.live_chat_timer_value;

                                if (
                                  parseInt(newObj.live_chat_timer_value) >= 0
                                ) {
                                  newObj.live_chat_timer_value =
                                    parseInt(newObj.live_chat_timer_value) + 1;
                                  _this.setState({
                                    liveChatSetting: newObj
                                  });
                                }
                              }}
                            />
                            <KeyboardArrowDownIcon
                              className="icon"
                              disabled={
                                _this.state.liveChatSetting
                                  .live_chat_timer_value === 0
                              }
                              onClick={() => {
                                let newObj = _this.state.liveChatSetting;
                                newObj.live_chat_timer_value =
                                  newObj.live_chat_timer_value === ""
                                    ? 0
                                    : newObj.live_chat_timer_value;
                                if (
                                  parseInt(newObj.live_chat_timer_value) > 0
                                ) {
                                  newObj.live_chat_timer_value =
                                    parseInt(newObj.live_chat_timer_value) - 1;
                                  _this.setState({
                                    liveChatSetting: newObj
                                  });
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div> */}

              {/* <div className="timer-block">
                <div className="availability_box">
                  <input type="checkbox"></input>
                  <div>
                    <p className="availability_title">Office hours</p>
                    <p className="availability_text">
                      Define agent’s time to respond to visitor
                    </p>

                    <div className="timer-select-block">
                      <div className="timer-input-block">
                        <div className="timer-field-block-cust">
                          <label htmlFor="Live chat">Live chat</label>
                          <div class="ms">
                            <input
                              type="number"
                              name="sec"
                              id="seconds"
                              value={this.state.amount}
                              onChange={(e) => {
                                this.setState({
                                  amount: parseFloat(e.target.name)
                                });
                              }}
                            />
                            <div className="arrow-block">
                              <KeyboardArrowDownIcon
                                className="icon up"
                                onClick={() => {
                                  this.setState({
                                    amount: parseFloat(this.state.amount + 1)
                                  });
                                }}
                              />
                              <KeyboardArrowDownIcon
                                className="icon"
                                onClick={() => {
                                  this.setState({
                                    amount: parseFloat(this.state.amount - 1)
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                        <div className="hl"></div>
                        <div className="timer-field-block-cust">
                          <label htmlFor="Video call">Video call</label>
                          <div class="ms">
                            <input
                              type="number"
                              name="sec"
                              id="seconds"
                              value={this.state.amount}
                              onChange={(e) => {
                                this.setState({
                                  amount: parseFloat(e.target.name)
                                });
                              }}
                            />
                            <div className="arrow-block">
                              <KeyboardArrowDownIcon
                                className="icon up"
                                onClick={() => {
                                  this.setState({
                                    amount: parseFloat(this.state.amount + 1)
                                  });
                                }}
                              />
                              <KeyboardArrowDownIcon
                                className="icon"
                                onClick={() => {
                                  this.setState({
                                    amount: parseFloat(this.state.amount - 1)
                                  });
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <Form.Select
                        aria-label="Default select example"
                        className="simple-select-field-block-cust"
                      >
                        <option selected disabled>
                          Select agent
                        </option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </Form.Select>

                      <Form.Select
                        aria-label="Default select example"
                        className="simple-select-field-block-cust"
                      >
                        <option selected disabled>
                          Select Chat Interface
                        </option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                      </Form.Select>
                    </div>
                  </div>
                </div>
              </div> */}

              <div className="timer-block">
                <div className="availability_box">
                  <input
                    type="checkbox"
                    value={
                      _this.state.liveChatSetting.reply_template_checkbox == 0
                        ? false
                        : true
                    }
                    checked={
                      _this.state.liveChatSetting.reply_template_checkbox == 0
                        ? false
                        : true
                    }
                    onChange={(e) => {
                      var newObj = _this.state.liveChatSetting;
                      newObj.reply_template_checkbox =
                        newObj.reply_template_checkbox == 0 ? 1 : 0;
                      _this.setState({
                        liveChatSetting: newObj,
                      });
                    }}
                  ></input>
                  <div style={{opacity: 0.5}}>
                    <p className="availability_title">Reply Template (Coming soon)</p>
                    <p className="availability_text">
                      Allow to create the templates for replies using shortcuts
                    </p>
                    {_this.state.templateData &&
                      _this.state.templateData.length > 0 &&
                      _this.state.templateData.map((prop, index) => {
                        return (
                          <Grid container spacing="5" className="mt-3">
                            <Grid item xs={5}>
                              <Form.Group
                                className="input-field-block-cust"
                                controlId="formBasicEmail"
                              >
                                <Form.Control
                                  type="text"
                                  placeholder="Type.."
                                  value={prop.type}
                                  onChange={(e) => {
                                    let temp = _this.state.templateData;
                                    temp[index].type = e.target.value;
                                    _this.setState({
                                      templateData: temp,
                                    });
                                  }}
                                />
                              </Form.Group>
                            </Grid>
                            <Grid item xs={5}>
                              <Form.Group
                                className="input-field-block-cust"
                                controlId="formBasicEmail"
                              >
                                <Form.Control
                                  type="text"
                                  placeholder="keyword"
                                  value={prop.link}
                                  onChange={(e) => {
                                    let temp = _this.state.templateData;
                                    temp[index].link = e.target.value;
                                    _this.setState({
                                      templateData: temp,
                                    });
                                  }}
                                />
                              </Form.Group>
                            </Grid>
                            <Grid item xs={2}>
                              <div className="delete-icon-block">
                                <IconButton
                                  type="button"
                                  onClick={() => {
                                    let temp = _this.state.templateData;
                                    temp.splice(index, 1);
                                    _this.setState({
                                      templateData: temp,
                                    });
                                  }}
                                >
                                  <img src={deleteIcon} alt="" />
                                </IconButton>
                              </div>
                            </Grid>
                          </Grid>
                        );
                      })}

                    <div className="next-btn-block-cust">
                      <Button
                        type="button"
                        onClick={() => {
                          let temp = _this.state.templateData;
                          temp.push({
                            link: "",
                            type: "",
                            key: temp.length,
                          });
                          _this.setState({
                            templateData: temp,
                          });
                        }}
                        variant="text"
                      >
                        <img src={plus} alt="" />
                        Add Shortcut
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="timer-block">
                <div className="availability_box">
                  <input
                    type="checkbox"
                    value={
                      _this.state.liveChatSetting
                        .rate_conversation_agent_checkbox == 0
                        ? false
                        : true
                    }
                    checked={
                      _this.state.liveChatSetting
                        .rate_conversation_agent_checkbox == 0
                        ? false
                        : true
                    }
                    onChange={(e) => {
                      var newObj = _this.state.liveChatSetting;
                      newObj.rate_conversation_agent_checkbox =
                        newObj.rate_conversation_agent_checkbox == 0 ? 1 : 0;
                      _this.setState({
                        liveChatSetting: newObj,
                      });
                    }}
                  ></input>
                  <div className="w-100" style={{opacity: 0.5}}>
                    <p className="availability_title">
                      Rate the conversation with agent (Coming Soon)
                    </p>
                    <p className="availability_text"></p>
                    <div className="detail-block">
                      <div className="individual-block">
                        <div className="num-block">
                          <span className="num">1</span>
                          <span className="star">
                            <img src={star} alt="" />
                          </span>
                        </div>
                        <div className="text-block">
                          <input
                            type="text"
                            name={"rate_1"}
                            value={_this.state.liveChatSetting.rate_1}
                            onChange={this.handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="individual-block">
                        <div className="num-block">
                          <span className="num">2</span>
                          <span className="star">
                            <img src={star} alt="" />
                          </span>
                        </div>
                        <div className="text-block">
                          <input
                            type="text"
                            name={"rate_2"}
                            value={_this.state.liveChatSetting.rate_2}
                            onChange={this.handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="individual-block">
                        <div className="num-block">
                          <span className="num">3</span>
                          <span className="star">
                            <img src={star} alt="" />
                          </span>
                        </div>
                        <div className="text-block">
                          <input
                            type="text"
                            name={"rate_3"}
                            value={_this.state.liveChatSetting.rate_3}
                            onChange={this.handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="individual-block">
                        <div className="num-block">
                          <span className="num">4</span>
                          <span className="star">
                            <img src={star} alt="" />
                          </span>
                        </div>
                        <div className="text-block">
                          <input
                            type="text"
                            name={"rate_4"}
                            value={_this.state.liveChatSetting.rate_4}
                            onChange={this.handleInputChange}
                          />
                        </div>
                      </div>
                      <div className="individual-block">
                        <div className="num-block">
                          <span className="num">5</span>
                          <span className="star">
                            <img src={star} alt="" />
                          </span>
                        </div>
                        <div className="text-block">
                          <input
                            type="text"
                            name={"rate_5"}
                            value={_this.state.liveChatSetting.rate_5}
                            onChange={this.handleInputChange}
                          />
                        </div>
                      </div>
                      <p className="text-block-bottom">
                        {/* Dolor sit amet, consectetur adipiscing elit, sed do
                        eiusmod tempor incididunt ut labore et dolore magna
                        aliqua */}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="timer-block">
                <div className="availability_box">
                  <input
                    type="checkbox"
                    value={
                      _this.state.liveChatSetting.feedback_chat_ends_checkbox ==
                      0
                        ? false
                        : true
                    }
                    checked={
                      _this.state.liveChatSetting.feedback_chat_ends_checkbox ==
                      0
                        ? false
                        : true
                    }
                    onChange={(e) => {
                      var newObj = _this.state.liveChatSetting;
                      newObj.feedback_chat_ends_checkbox =
                        newObj.feedback_chat_ends_checkbox == 0 ? 1 : 0;
                      _this.setState({
                        liveChatSetting: newObj,
                      });
                    }}
                  ></input>
                  <div className="w-100" style={{opacity: 0.5}}>
                    <p className="availability_title">
                      Collect feedback when chat ends (Coming soon)
                    </p>
                    <p className="availability_text">
                      {/* Duis aute irure dolor in reprehenderit velit */}
                    </p>

                    <div className="que-block">
                      <Form.Group
                        className="input-field-block-cust"
                        controlId="formBasicEmail"
                      >
                        <Form.Label>Question title</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Enter title"
                          name={"feedback_question_title"}
                          value={
                            _this.state.liveChatSetting.feedback_question_title
                          }
                          onChange={this.handleInputChange}
                        />
                      </Form.Group>
                    </div>

                    <div className="ans-block">
                      <label htmlFor="Answer options">Answer options</label>
                      <div className="special-alert-btn-grp">
                        {_this.state.answerOption &&
                          _this.state.answerOption.length > 0 &&
                          _this.state.answerOption.map((prop, index) => {
                            return (
                              <div className="btn-group-block">
                                <img
                                  src={menu}
                                  className="hover-menu-icon"
                                  alt=""
                                />

                                <div className="text-tab">
                                  <label htmlFor="">{`Option ${
                                    index + 1
                                  }`}</label>
                                  <div className="tab">
                                    <span className="vl"></span>
                                    <div className="delete-icon-block">
                                      <IconButton
                                        type="button"
                                        onClick={() => {
                                          let temp = _this.state.answerOption;
                                          temp.splice(index, 1);
                                          _this.setState({
                                            answerOption: temp,
                                          });
                                        }}
                                      >
                                        <img src={deleteIcon} alt="" />
                                      </IconButton>
                                    </div>
                                  </div>
                                </div>

                                <div className="btn-group">
                                  <Grid container spacing="5">
                                    <Grid item sm={12}>
                                      <Form.Control
                                        type="text"
                                        placeholder=""
                                        value={prop.value}
                                        onChange={(e) => {
                                          let temp = _this.state.answerOption;
                                          temp[index].value = e.target.value;
                                          _this.setState({
                                            answerOption: temp,
                                          });
                                        }}
                                      />
                                    </Grid>
                                  </Grid>
                                </div>
                              </div>
                            );
                          })}
                        <div className="next-btn-block-cust">
                          <Button
                            type="button"
                            onClick={() => {
                              let temp = _this.state.answerOption;
                              temp.push({
                                value: "",
                                key: temp.length,
                              });
                              _this.setState({
                                answerOption: temp,
                              });
                            }}
                            variant="text"
                          >
                            <img src={plus} alt="" />
                            Add next button
                          </Button>
                        </div>
                      </div>
                    </div>
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
