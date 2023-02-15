import {
  Button,
  ToggleButtonGroup,
  Drawer,
  Box,
  FormGroup,
} from "@mui/material";
import React, { Component, Fragment } from "react";
// import { Form } from "react-bootstrap";
import styled from "styled-components";

import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import "react-web-tabs/dist/react-web-tabs.css";
import VerticalBarChartComponent from "./components/VerticalBarChartComponent.jsx";
import user from "../../../assets/images/userdash/users.svg";
import star from "../../../assets/images/star (3).svg";
import downarrow from "../../../assets/images/downarrow.svg";
import calendar from "../../../assets/images/calendar.svg";
import img1 from "../../../assets/images/userdash/Group 20206.svg";
import cal1 from "../../../assets/images/userdash/calendar.svg";
// import cal2 from "../../../assets/images/userdash/calendar-1.svg";
// import cal3 from "../../../assets/images/userdash/calendar-2.svg";
import arrowright from "../../../assets/images/userdash/Path 48371.png";
// import plus from "../../../assets/images/userdash/plus-circle (2).svg";
import copy from "../../../assets/images/userdash/copy-1.svg";
// import copy1 from "../../../assets/images/userdash/copy-2.svg";
import arrow from "../../../assets/images/userdash/chevron-left (1).svg";
// import arrow_white from "../../../assets/images/Path 46450.svg";
import LineChartComponent from "./components/LineChartComponent.jsx";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Form } from "react-bootstrap";
import {
  getDashboardList,
  getLineChatData,
  getAppointmentList,
  getNewFeatures,
} from "./server/DashbardServer.js";
import moment from "moment";
import { encryptBot, decryptBot } from "../../../js/encrypt";
import { fillMissingFieldValues, getDaysBetweenDates } from "../../../js/lib";

import { CopyToClipboard } from "react-copy-to-clipboard";
import { AlertContext } from "../../common/Alert";

const DashboardComponent = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 18px;
`;

const DashGridLeft = styled.div`
  width: 69.5%;
  @media (max-width: 1200px) {
    width: 100%;
  }
`;

export class AgentDashboardComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);

    var currentDate = new Date();
    var startDate = new Date(currentDate.setDate(currentDate.getDate() - 30));
    let endDate = new Date();

    this.state = {
      customize: false,
      customizepopup: null,
      lineChartFormat: "%b %d",
      lineChartTickValue: "every 1 days",
      days: "day",
      alert: null,
      loading: true,
      chatbotlistLoading: true,
      appointmentLoading: true,
      chatBotList: [],
      leadsChatBarList: [],
      activeTab: "3",
      new_conversation_completed: [],
      new_conversation_not_completed: [],
      overall_new_conversations: [],
      total_conversation_completed: [],
      total_conversation_not_completed: [],
      overall_total_conversation: [],
      appointmentList: [],
      features: [],
      loadingFeatures: true,
      drawerOpen: false,
      dashbordFilter: [startDate, endDate],
      convFilter: [startDate, endDate],
    };
  }

  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    _this.fetchDataFromServer();
    _this.fetchLineChatList();
    _this.FetchAppointmentData();
    _this.fetchNewFeatures();
  }

  fetchDataFromServer() {
    let _this = this;
    _this.setState({ chatbotlistLoading: true });
    const [startDate, endDate] = _this.state.dashbordFilter;
    let params = "";
    if (startDate === null || endDate === null) {
      params = `?duration=all&startdate=null&enddate=null`;
    } else {
      params = `?duration=date&&startdate=${moment(startDate).format(
        "YYYY-MM-DD"
      )}&enddate=${moment(endDate).format("YYYY-MM-DD")}`;
    }

    getDashboardList(
      params,
      (res) => {
        let newObj = [];
        let tempObj = [];
        if (res.status !== "False") {
          Object.keys(res.chatbotlist) &&
            Object.keys(res.chatbotlist).length > 0 &&
            Object.keys(res.chatbotlist).map((prop, key) => {
              tempObj.push({
                value: false,
                index: key,
                chatbot_id: res.chatbotlist[prop].chatbot_id,
                chatbot_title: res.chatbotlist[prop].chatbot_title,
                no_of_users: res.chatbotlist[prop].no_of_users,
                data: res.chatbotlist[prop],
              });
            });

          let data = res.barchart && res.barchart;
          if (Object.keys(data) && Object.keys(data).length > 0) {
            Object.keys(data).map((prop1, key) => {
              if (typeof data[prop1] === "number") {
                newObj.push({
                  name: `${prop1}`,
                  barChart: data[prop1],
                });
              }
            });
          }
        }
        _this.setState({
          chatbotlistLoading: false,
          chatBotList: tempObj,
          leadsChatBarList: newObj,
        });
      },
      () => {
        _this.setState({ chatbotlistLoading: false });
      }
    );
  }

  fetchLineChatList = () => {
    let _this = this;
    _this.setState({ activeTab: 3, loading: true });

    const [startDate, endDate] = _this.state.convFilter;
    let params = "";
    if (startDate === null || endDate === null) {
      params = `?duration=all&startdate=null&enddate=null`;
    } else {
      params = `?duration=date&&startdate=${moment(startDate).format(
        "YYYY-MM-DD"
      )}&enddate=${moment(endDate).format("YYYY-MM-DD")}`;
    }
    getLineChatData(
      params,
      (res) => {
        _this.setState({
          activeTab: 3,
          loading: false,
        });
        let startDateObj;
        let endDateObj;
        if (startDate === null || endDate === null) {
          endDateObj = moment();
          let month = endDateObj.get("month");

          if (month === 0) month = 12;

          startDateObj = moment().set({ month: month - 1 });
        } else {
          startDateObj = moment(startDate);
          endDateObj = moment(endDate);
        }

        const diffDays = Math.abs(endDateObj.diff(startDateObj, "days"));

        const dates = getDaysBetweenDates(startDateObj, endDateObj);
        let new_conversation_completed = fillMissingFieldValues(
          res.new_conversation_completed,
          dates
        );
        let total_conversation_completed = fillMissingFieldValues(
          res.total_conversation_completed,
          dates
        );

        let new_conversation_not_completed = fillMissingFieldValues(
          res.new_conversation_not_completed,
          dates
        );
        let overall_new_conversations = fillMissingFieldValues(
          res.overall_new_conversations,
          dates
        );
        let overall_total_conversation = fillMissingFieldValues(
          res.overall_total_conversation,
          dates
        );
        let total_conversation_not_completed = fillMissingFieldValues(
          res.total_conversation_not_completed,
          dates
        );

        let lineChartTickValue = "every 1 days";
        if (diffDays > 320) {
          lineChartTickValue = "every 1 year";
        } else if (diffDays > 200) {
          lineChartTickValue = "every 1 month";
        } else if (diffDays > 160) {
          lineChartTickValue = "every 5 days";
        } else if (diffDays > 120) {
          lineChartTickValue = "every 4 days";
        } else if (diffDays > 60) {
          lineChartTickValue = "every 3 days";
        } else if (diffDays > 30) {
          lineChartTickValue = "every 2 days";
        }

        _this.setState({
          loading: false,
          new_conversation_completed: new_conversation_completed,
          new_conversation_not_completed: new_conversation_not_completed,
          overall_new_conversations: overall_new_conversations,
          overall_total_conversation: overall_total_conversation,
          total_conversation_completed: total_conversation_completed,
          total_conversation_not_completed: total_conversation_not_completed,
          lineChartTickValue: lineChartTickValue,
        });
      },
      () => {
        _this.setState({ loading: false, data: [] });
      }
    );
  };

  FetchAppointmentData = () => {
    let _this = this;
    getAppointmentList(
      "",
      (res) => {
        let newObj = [];
        newObj =
          res.future_appointments_list &&
          res.future_appointments_list.length > 0 &&
          res.future_appointments_list.map((prop) => {
            var days = 0;

            var endDate = moment(prop.date).add(1, "days");
            var today = moment();
            days = endDate.diff(today, "days");
            if (days === 0) {
              prop.showDate = "Today";
            } else if (days === 1) {
              prop.showDate = "Tomorrow";
            } else {
              prop.showDate = `${moment(prop.date).format("DD MMM yyyy")}`;
            }
            prop.value = false;
            prop.copied = false;
            return prop;
          });
        _this.setState({
          appointmentLoading: false,
          future_appointments_list: newObj,
        });
      },
      () => {
        _this.setState({ appointmentLoading: false });
      }
    );
  };

  fetchNewFeatures = () => {
    getNewFeatures(
      (res) => {
        this.setState({
          features: res.list,
          loadingFeatures: false,
        });
      },
      (err) => {
        this.setState({
          loadingFeatures: false,
        });
      }
    );
  };

  handleCustomize = () => {
    this.setState({
      customize: !this.state.customize,
    });
  };

  handleDaysChange = (event, newDay) => {
    this.setState({ days: newDay });
  };

  handleClick = (event) => {
    this.setState({
      customizepopup: event.currentTarget,
    });
  };

  handleClose = () => {
    this.setState({
      customizepopup: null,
    });
  };

  render() {
    let _this = this;
    const [dashboardStartDate, dashboardEndDate] = _this.state.dashbordFilter;
    const [convStartDate, convEndDate] = _this.state.convFilter;
    const customizeopen = Boolean(this.state.customizepopup);
    let form = (
      <Fragment>
        <DashboardComponent className="dashboard_component">
          {/* <div className="chat_bot_box user_dash_box">
            {this.state.customize ? (
              <Button
                variant="outlined"
                className="customize_box"
                id="basic-button"
                aria-controls={customizeopen ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={customizeopen ? "true" : undefined}
                onClick={this.handleClick}
              >
                {" "}
                Customize dashboard
                <img src={arrow} />
              </Button>
            ) : (
              <p onClick={this.handleCustomize} className="custome_text">
                <span>
                  <img src={edit} alt="" />
                </span>
                Customize dashboard
              </p>
            )}
            <Menu
              id="basic-menu"
              anchorEl={this.state.customizepopup}
              open={customizeopen}
              className="customize_popup"
              onClose={this.handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
            >
              <MenuItem>
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="Excepteur sint occaecat"
                  />
                </FormGroup>
              </MenuItem>
              <MenuItem>
                {" "}
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="anim id est molli aborum"
                  />
                </FormGroup>
              </MenuItem>
              <MenuItem>
                {" "}
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="reprehenderit in volupta"
                  />
                </FormGroup>
              </MenuItem>
              <MenuItem>
                {" "}
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox defaultChecked />}
                    label="anim id est molli aborum"
                  />
                </FormGroup>
              </MenuItem>
            </Menu>
          </div> */}
          <div
            className="dash_grid"
            style={{
              display: "flex",
              "align-items": "flex-start",
              "justify-content": "space-between",
            }}
          >
            <DashGridLeft className="dash_grid_left">
              <div
                className="status_main_block"
                style={{
                  display: "flex",
                  "align-items": "center",
                  gap: "15px",
                  "overflow-x": "auto",
                  "max-width": "calc(60vw - 50px)",
                }}
              >
                {_this.state.chatBotList &&
                _this.state.chatBotList.length > 0 ? (
                  _this.state.chatBotList.map((prop) => {
                    return (
                      <div
                        role="button"
                        onClick={() => {
                          const encData = encryptBot(
                            prop.chatbot_id,
                            prop.chatbot_title
                          );
                          setTimeout(() => {
                            _this.props.history.push(
                              `/user/chatbots/overview?botId=${encData}`
                            );
                          }, 1000);
                        }}
                        className="status_box"
                        style={{
                          border: "1px solid #c6cad9",
                          "border-radius": "10px",
                          padding: "15px",
                          "min-width": "185px",
                          height: "169px",
                          color: "#1e1e1e",
                        }}
                      >
                        <div
                          className="active_class"
                          style={{
                            display: "flex",
                            "align-items": "center",
                            "justify-content": "space-between",
                          }}
                        >
                          {/* <div>
                            <div className="active_circle"></div>
                            <p>Active</p>
                          </div> */}
                          <img src={arrowright} alt="" />
                        </div>
                        <p
                          className="status_title"
                          style={{
                            "font-size": "15px",
                            "font-weight": "700",
                            "line-height": "20px",
                            color: "#1e1e1e",
                            width: "100%",
                            "max-width": "111px",
                            display: "-webkit-box",
                            height: "42px",
                            "-webkit-line-clamp": "2",
                            "-webkit-box-orient": "vertical",
                            overflow: "hidden",
                            "text-overflow": "ellipsis",
                            "box-sizing": "border-box",
                            margin: "20px 0 !important",
                            "word-break": "break-all",
                          }}
                        >
                          {prop.chatbot_title}
                        </p>
                        <div
                          className="status_review"
                          style={{
                            display: "flex",
                            "align-items": "center",
                            "border-top":
                              "1px solid rgba(198, 202, 217, 0.368627451)",
                            "justify-content": "space-between",
                            cursor: "pointer",
                            "padding-top": "15px",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              "align-items": "center",
                            }}
                          >
                            {" "}
                            <img
                              src={user}
                              alt=""
                              style={{
                                "margin-right": "7px",
                                width: "17px",
                              }}
                            />
                            <p
                              style={{
                                "font-size": "11px",
                                "font-weight": "700",
                              }}
                            >
                              {prop.no_of_users}
                            </p>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              "align-items": "center",
                            }}
                          >
                            {" "}
                            <img
                              src={star}
                              alt=""
                              style={{
                                "margin-right": "7px",
                                width: "17px",
                              }}
                            />
                            <p
                              style={{
                                "font-size": "11px",
                                "font-weight": "700",
                              }}
                            >
                              4
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : _this.state.chatbotlistLoading ? (
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
                )}
              </div>
              <div className="response_chart_section">
                <p className="chart_title">Lead Insights</p>
                <p className="chart_text">
                  Here you gain insight on where your leads were captured.
                </p>

                <div className="filter_box chat_bot_box ">
                  <div className="date-floating-block">
                    <img src={calendar} alt="" />
                    <Form.Floating className="">
                      <DatePicker
                        selectsRange={true}
                        startDate={dashboardStartDate}
                        endDate={dashboardEndDate}
                        onChange={(date) => {
                          this.setState(
                            {
                              dashbordFilter: date,
                            },
                            () => {
                              if (date[0] !== null && date[1] !== null) {
                                _this.fetchDataFromServer();
                              } else {
                                if (date[0] === null && date[1] === null) {
                                  _this.fetchDataFromServer();
                                }
                              }
                            }
                          );
                        }}
                        isClearable={true}
                        dateFormat="MMMM d"
                      />
                      <label
                        htmlFor="floatingInputCustom"
                        style={
                          dashboardStartDate !== null
                            ? {
                                transform: "scale(0.9)",
                                top: "-15px",
                                backgroundColor: "#fff",
                                color: "#019f9c",
                                height: "20px",
                                width: "46px",
                              }
                            : null
                        }
                      >
                        Date
                      </label>
                    </Form.Floating>
                  </div>
                </div>

                <div className="chart_box">
                  <ToggleButtonGroup
                    color="primary"
                    value={this.state.days}
                    exclusive
                    onChange={this.handleDaysChange}
                  >
                    {/* <ToggleButton value="month">Month</ToggleButton>
                    <ToggleButton value="week">Week</ToggleButton>
                    <ToggleButton value="day">Day</ToggleButton> */}
                  </ToggleButtonGroup>
                  {_this.state.leadsChatBarList &&
                  _this.state.leadsChatBarList.length > 0 ? (
                    <VerticalBarChartComponent
                      leadsChatBarList={_this.state.leadsChatBarList}
                      _this={_this}
                      {..._this.props}
                    />
                  ) : _this.state.chatbotlistLoading ? (
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
                  )}
                </div>
              </div>
              <div className="response_chart_section">
                <p className="chart_title">Conversation Insights</p>
                {/* <p className="chart_text">
                   n
                  reprehenderit in volupta
                </p> */}

                <div className="filter_box chat_bot_box ">
                  <div className="date-floating-block">
                    <img src={calendar} alt="" />
                    <Form.Floating className="">
                      <DatePicker
                        selectsRange={true}
                        startDate={convStartDate}
                        endDate={convEndDate}
                        onChange={(date) => {
                          this.setState(
                            {
                              convFilter: date,
                            },
                            () => {
                              if (date[0] !== null && date[1] !== null) {
                                _this.fetchLineChatList();
                              } else {
                                if (date[0] === null && date[1] === null) {
                                  _this.fetchLineChatList();
                                }
                              }
                            }
                          );
                        }}
                        isClearable={true}
                        dateFormat="MMMM d"
                      />
                      <label
                        htmlFor="floatingInputCustom"
                        style={
                          convStartDate !== null
                            ? {
                                transform: "scale(0.9)",
                                top: "-15px",
                                backgroundColor: "#fff",
                                color: "#019f9c",
                                height: "20px",
                                width: "46px",
                              }
                            : null
                        }
                      >
                        Date
                      </label>
                    </Form.Floating>
                  </div>
                </div>

                <div className="chart_box tab_line_chart">
                  <Tabs
                    defaultTab={_this.state.activeTab}
                    value={_this.state.activeTab}
                    onChange={(tab) => {
                      _this.setState({
                        activeTab: tab,
                      });
                    }}
                  >
                    <TabList>
                      {/* <Tab
                        onClick={() => {
                          _this.setState({
                            activeTab: 1,
                          });
                        }}
                        tabFor={1}
                      >
                        Completed
                      </Tab>
                      <Tab
                        onClick={() => {
                          _this.setState({
                            activeTab: 2,
                          });
                        }}
                        tabFor={2}
                      >
                        Not Completed
                      </Tab> */}
                      <Tab
                        onClick={() => {
                          _this.setState({
                            activeTab: 3,
                          });
                        }}
                        tabFor={3}
                      >
                        Overall
                      </Tab>
                    </TabList>
                    <div className="legends_line_charts">
                      <div className="legends_total">
                        <div></div>Total Conversations
                      </div>
                      <div className="legends_new">
                        <div></div>New Conversations
                      </div>
                    </div>
                    <TabPanel tabId={1}>
                      {(_this.state.total_conversation_completed &&
                        _this.state.total_conversation_completed.length > 0) ||
                      (_this.state.new_conversation_completed &&
                        _this.state.new_conversation_completed.length > 0) ? (
                        <LineChartComponent
                          format={_this.state.lineChartFormat}
                          tickValues={_this.state.lineChartTickValue}
                          chartData={_this.state.total_conversation_completed}
                          chartData1={_this.state.new_conversation_completed}
                          {..._this.props}
                        />
                      ) : _this.state.loading ? (
                        <div className="text-center alert alert-danger">
                          Loading...
                        </div>
                      ) : (
                        <div className="text-center alert alert-danger">
                          No Data Found!
                        </div>
                      )}
                    </TabPanel>
                    <TabPanel tabId={2}>
                      {(_this.state.total_conversation_not_completed &&
                        _this.state.total_conversation_not_completed.length >
                          0) ||
                      (_this.state.new_conversation_not_completed &&
                        _this.state.new_conversation_not_completed.length >
                          0) ? (
                        <LineChartComponent
                          format={_this.state.lineChartFormat}
                          tickValues={_this.state.lineChartTickValue}
                          chartData={
                            _this.state.total_conversation_not_completed
                          }
                          chartData1={
                            _this.state.new_conversation_not_completed
                          }
                          {..._this.props}
                        />
                      ) : _this.state.loading ? (
                        <div className="text-center alert alert-danger">
                          Loading...
                        </div>
                      ) : (
                        <div className="text-center alert alert-danger">
                          No Data Found!
                        </div>
                      )}
                    </TabPanel>
                    <TabPanel tabId={3}>
                      {(_this.state.overall_total_conversation &&
                        _this.state.overall_total_conversation.length > 0) ||
                      (_this.state.overall_new_conversations &&
                        _this.state.overall_new_conversations.length > 0) ? (
                        <LineChartComponent
                          format={_this.state.lineChartFormat}
                          tickValues={_this.state.lineChartTickValue}
                          chartData={_this.state.overall_total_conversation}
                          chartData1={_this.state.overall_new_conversations}
                          {..._this.props}
                        />
                      ) : _this.state.loading ? (
                        <div className="text-center alert alert-danger">
                          Loading...
                        </div>
                      ) : (
                        <div className="text-center alert alert-danger">
                          No Data Found!
                        </div>
                      )}
                    </TabPanel>
                  </Tabs>
                </div>
              </div>
            </DashGridLeft>
            <div className="dash_grid_right">
              <div className="refer_a_friend">
                <div className="refer_img">
                  <img src={img1} alt="" />
                </div>
                <div>
                  <p className="refer_title">
                    Refer us to your network and earn special rewards and prizes
                  </p>
                  <p className="refer_text">
                    Every month you can try to climb the leaderboard and win
                    amazing prizes.
                  </p>
                  <Button
                    onClick={() => this.props.history.push("/user/refer")}
                    variant="contained"
                    className="refer_btn"
                  >
                    Refer Us
                  </Button>{" "}
                  (Coming Soon)
                </div>
              </div>
              <div>
                <p className="appoint_text">New Features</p>
                <div className="new_feature_block">
                  {this.state.features.length > 0 ? (
                    this.state.features.map((item, i) => (
                      <div
                        className="feature_box"
                        key={i}
                        onClick={() => {
                          this.setState({
                            drawerOpen: item,
                          });
                        }}
                      >
                        <div>
                          <div>
                            <img src={cal1} alt="" />
                          </div>
                          <p>{item.title}</p>
                        </div>
                        <img src={arrowright} alt="" />
                      </div>
                    ))
                  ) : this.state.loadingFeatures ? (
                    <div className="text-center alert alert-danger">
                      Loading...
                    </div>
                  ) : (
                    <div className="text-center alert alert-danger">
                      No Data Found!
                    </div>
                  )}

                  {/* <div className="text-center alert alert-danger">
                     No Data Found!
                  </div> */}
                </div>
              </div>
              <Drawer
                anchor={"right"}
                open={this.state.drawerOpen}
                onClose={() => {
                  this.setState({ drawerOpen: false });
                }}
              >
                <Box
                  sx={{
                    width: 512,
                  }}
                  role="presentation"
                  // onClick={toggleDrawer(anchor, false)}
                  // onKeyDown={toggleDrawer(anchor, false)}
                >
                  <div className="edit_question_drawer">
                    <div className="edit_question_header">
                      <p className="created_heading">
                        {this.state.drawerOpen && this.state.drawerOpen.title}
                      </p>
                      <p
                        role="button"
                        onClick={() => {
                          this.setState({ drawerOpen: false });
                        }}
                        className="back_text"
                      >
                        <img src={arrow} alt="" />
                        Back
                      </p>
                    </div>
                    <FormGroup>
                      {this.state.drawerOpen &&
                        this.state.drawerOpen.description}
                    </FormGroup>
                    <p>&nbsp;</p>
                    <div className="funnel_btn_block">
                      <Button
                        variant="contained"
                        className="fupdate_btn"
                        type="button"
                        onClick={() => {
                          this.setState({ drawerOpen: false });
                        }}
                      >
                        OK
                      </Button>
                    </div>
                  </div>
                </Box>
              </Drawer>
              <p className="appoint_text">Upcoming Appointments</p>
              <div className="meetings_box">
                {/* <p className="upcoming_text">Upcoming meeting</p> */}
                {_this.state.future_appointments_list &&
                _this.state.future_appointments_list.length > 0 ? (
                  _this.state.future_appointments_list.map((prop, index) => {
                    if (prop.value) {
                      return (
                        <Fragment key={index}>
                          <p className="upcoming_text">{`${prop.showDate} `}</p>
                          <div className="meeting_link_box">
                            <div className="visitor_id_box ">
                              <div className="d-flex align-items-center">
                                <div className="calendar_icon">
                                  <img alt="" src={calendar} />
                                </div>
                                <div>
                                  <p className="visitor_id_text">
                                    {`${prop.name}`}
                                  </p>
                                  <p className="visitor_time">
                                    {moment(prop.date, "YYYY-MM-DD").format(
                                      "ddd Do MMM YY"
                                    )}
                                    , {`${prop.from_time} - ${prop.to_time}`}
                                  </p>
                                </div>
                              </div>

                              <div
                                role="button"
                                onClick={() => {
                                  let temp =
                                    _this.state.future_appointments_list;
                                  temp[index].value = false;
                                  _this.setState({
                                    future_appointments_list: temp,
                                  });
                                }}
                                className="downarrow_img"
                              >
                                <img alt="" src={downarrow} />
                              </div>
                            </div>
                            <div className="visitor_id_box meeting_border_box">
                              <div>
                                <p className="meeting_link_text">
                                  Meeting Link
                                </p>
                                <p
                                  role="button"
                                  onClick={() => {
                                    window.open(prop.meeting_link, "_blank");
                                  }}
                                  className="meeting_link_text link_underline"
                                >
                                  {`${prop.meeting_link}`}
                                </p>
                              </div>
                              <CopyToClipboard
                                text={prop.meeting_link}
                                onCopy={() => {
                                  this.context.showAlert({
                                    type: "success",
                                    message: "Copied successfully",
                                  });
                                }}
                              >
                                <div role="button" className="copycontent_img">
                                  <img src={copy} alt="" />
                                </div>
                              </CopyToClipboard>
                            </div>

                            <div className="visitor_btn_box">
                              <Button
                                type="button"
                                onClick={() => {
                                  window.open(prop.meeting_link, "_blank");
                                }}
                                className="meet_join_btn"
                              >
                                Join
                              </Button>
                            </div>
                          </div>
                        </Fragment>
                      );
                    } else {
                      return (
                        <Fragment>
                          <p className="upcoming_text">{`${prop.showDate}`}</p>
                          <div className="meeting_link_box visitor_box">
                            <div className="visitor_id_box">
                              <div className="d-flex align-items-center">
                                <div className="calendar_icon">
                                  <img src={calendar} alt="" />
                                </div>
                                <div>
                                  <p className="visitor_id_text">
                                    {`${prop.name}`}
                                  </p>
                                  <p className="visitor_time">
                                    {moment(prop.date, "YYYY-MM-DD").format(
                                      "ddd Do MMM YY"
                                    )}
                                    , {`${prop.from_time} - ${prop.to_time}`}
                                  </p>
                                </div>
                              </div>
                              <div
                                role="button"
                                onClick={() => {
                                  let temp =
                                    _this.state.future_appointments_list;
                                  temp[index].value = true;
                                  _this.setState({
                                    future_appointments_list: temp,
                                  });
                                }}
                                className="downarrow_img"
                              >
                                <img src={downarrow} alt="" />
                              </div>
                            </div>
                            <div className="visitor_btn_box">
                              <CopyToClipboard
                                text={prop.meeting_link}
                                onCopy={() => {
                                  this.context.showAlert({
                                    type: "success",
                                    message: "Copied successfully",
                                  });
                                }}
                              >
                                <Button className="visitor_btn">
                                  <img role="button" src={copy} alt="" />
                                  Copy Link
                                </Button>
                              </CopyToClipboard>

                              <Button
                                type="button"
                                onClick={() => {
                                  window.open(prop.meeting_link, "_blank");
                                }}
                                className="visitor_btn join_btn"
                              >
                                Join
                              </Button>
                            </div>
                          </div>
                        </Fragment>
                      );
                    }
                  })
                ) : _this.state.appointmentLoading ? (
                  <div className="text-center alert alert-danger">
                    Loading...
                  </div>
                ) : (
                  <div className="text-center alert alert-danger">
                    No Data Found!
                  </div>
                )}
              </div>
            </div>
          </div>
        </DashboardComponent>
      </Fragment>
    );
    return (
      <Fragment>
        {_this.state.alert}
        {/* {(this.state.loading || this.state.chatbotlistLoading) && (
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              style={{ zIndex: "10000000000000000000000000000" }}
              open={true}
            >
              <div className="loader_main">
                <div className="item_loader">
                  <Loader
                    type="box-rotate-x"
                    bgColor={"#32E0A1"}
                    title={"Please wait..."}
                    color={"#fff"}
                    size={100}
                  />
                </div>
              </div>
            </Backdrop>
        )} */}
        {form}
      </Fragment>
    );
  }
}

export default AgentDashboardComponent;
