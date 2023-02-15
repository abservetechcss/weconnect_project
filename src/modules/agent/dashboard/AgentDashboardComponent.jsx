import React, { Component, Fragment } from "react";

import {
  Autocomplete,
  Button,
  // ButtonGroup,
  Grid,
  TextField,
  IconButton,
  Tooltip,
} from "@mui/material";
import VerticalBarChartComponent from "./components/VerticalBarChartComponent.jsx";
import trend from "../../../assets/images/trending-up.svg";
import clock from "../../../assets/images/clock.svg";
import mail from "../../../assets/images/mail.svg";
import arrow from "../../../assets/images/arrow.svg";
// import edit from "../../../assets/images/edit-2.svg";
import downarrow from "../../../assets/images/downarrow.svg";
import upArrow from "../../../assets/images/up-arrow.svg";
import calendar from "../../../assets/images/calendar.svg";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Form } from "react-bootstrap";
import {
  getChatBotList,
  getOfflineMesCount,
  getTotalAvgResponseCount,
  getAppointmentList,
  getBarChartList,
} from "./server/DashboardServer.js";
import moment from "moment";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { AlertContext } from "../../common/Alert";
import copy from "../../../assets/images/userdash/copy-1.svg";

export class AgentDashboardComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    this.state = {
      copied: false,
      alert: null,
      loading: true,
      loadingChart: true,
      filterDate: [null, null],
      appointmentList: [],
      botId: 0,
      botName: "All",
      botItemList: [],
      offlineMsg: 0,
      offlineMsgdiffComparison: "",
      offlineMsgdiffPercent: "",
      averageResponse: 0,
      totalResponse: 0,
      averagediffComparison: "",
      averageresponsediff: "",
      totaldiffComparison: "",
      totalresponsediffPercent: "",
      data: [],
      dataSet1: [0, 0, 0, 0, 0, 0, 0],
      dataSet2: [0, 0, 0, 0, 0, 0, 0],
      dataSet3: [0, 0, 0, 0, 0, 0, 0],
      dateFilter: "Day",
    };
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    var currentDate = new Date();
    var startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
    let endDate = new Date();
    _this.setState({
      filterDate: [startDate, endDate],
    });
    this.fetchChatBotDataCancelToken = _this.fetchChatBotData();
    this.FetchAppointmentDataCancelToken = _this.FetchAppointmentData();
  }
  componentWillUnmount() {
    if (this.fetchChatBotDataCancelToken) {
      this.fetchChatBotDataCancelToken.cancel();
    }
    if (this.FetchAppointmentDataCancelToken) {
      this.FetchAppointmentDataCancelToken.cancel();
    }
  }
  fetchChatBotData = () => {
    let _this = this;
    getChatBotList(
      _this,
      "",
      (res) => {
        // let selectBot = res.selectedBot && res.selectedBot;
        let newObj =
          res.bot_list && Array.isArray(res.bot_list)
            ? res.bot_list.map((prop) => {
                return {
                  id: prop.bot_id,
                  label: prop.bot_name,
                  value: prop.bot_id,
                };
              })
            : [];
        newObj.unshift({
          id: 0,
          label: "All",
          value: 0,
        });
        _this.setState({
          botItemList: newObj,
          // botId: selectBot && selectBot.bot_id,
          // botName: selectBot && selectBot.bot_name,
          loading: false,
        });
        setTimeout(() => {
          _this.fetchDataFromServer();
          _this.fetchBarChartData();
        }, 1000);
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };
  fetchDataFromServer() {
    let _this = this;
    const [startDate, endDate] = _this.state.filterDate;
    let params = "";
    if (startDate === null) {
      params = `?botid=${_this.state.botId}&startdate=null&enddate=null`;
    } else {
      params = `?startdate=${moment(startDate).format(
        "YYYY-MM-DD"
      )}&enddate=${moment(endDate).format("YYYY-MM-DD")}&botid=${
        _this.state.botId
      }`;
    }
    // _this.setState({ loading: true });
    getOfflineMesCount(
      params,
      (res) => {
        let offlineMsg = parseFloat(res.offlineMsg)
          ? parseFloat(res.offlineMsg)
          : 0;
        _this.setState({
          offlineMsg: offlineMsg,
          offlineMsgdiffComparison: res.offlineMsgdiffComparison,
          offlineMsgdiffPercent: res.offlineMsgdiffPercent,
          loading: false,
        });
      },
      () => {
        _this.setState({ loading: false, data: [] });
      }
    );
    getTotalAvgResponseCount(
      params,
      (res) => {
        let averageRes = parseFloat(res.averageResponse)
          ? parseFloat(res.averageResponse)
          : 0;
        let totalRes = parseFloat(res.totalresponse)
          ? parseFloat(res.totalresponse)
          : 0;

        _this.setState({
          loading: false,
          averageResponse: averageRes,
          totalResponse: totalRes,
          averagediffComparison: res.totaldiffComparison,
          averageresponsediff: res.averageresponsediff,
          totaldiffComparison: res.totaldiffComparison,
          totalresponsediffPercent: res.totalresponsediffPercent,
        });
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  }
  fetchBarChartData = () => {
    let _this = this;
    const [startDate, endDate] = _this.state.filterDate;
    let params = "";
    params = `?startdate=${moment(startDate).format(
      "YYYY-MM-DD"
    )}&enddate=${moment(endDate).format("YYYY-MM-DD")}&botid=${
      _this.state.botId
    }`;

    _this.setState({ loadingChart: true, data: [] });
    getBarChartList(
      params,
      (res) => {
        _this.setState({
          loadingChart: false,
          data: res.responseList,
          dataSet1: [0, 0, 0, 0, 0, 0, 0],
          dataSet2: [0, 0, 0, 0, 0, 0, 0],
          dataSet3: [0, 0, 0, 0, 0, 0, 0],
        });
        if (
          Array.isArray(res.responseList) &&
          res.responseList &&
          res.responseList.length > 0
        ) {
          const dataSet1 = [0, 0, 0, 0, 0, 0, 0];
          const dataSet2 = [0, 0, 0, 0, 0, 0, 0];
          // const updatedIndex: {
          //   0: 6,
          //   1: 0,
          //   2: 1,
          //   3: 2,
          //   4: 3,
          //   5: 4,
          //   6: 5,
          // };
          const labels = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
          res.responseList &&
            Array.isArray(res.responseList) &&
            res.responseList.length > 0 &&
            res.responseList.forEach((item) => {
              const weekDay = moment(item.res_datetime).day();
              let index = 6;
              if (weekDay !== 0) {
                index = weekDay - 1;
              }
              if (item.leads === 0) {
                dataSet1[index] += 1;
              } else {
                dataSet2[index] += 1;
              }
            });

          // ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
          _this.setState({
            dataSet1: dataSet1,
            dataSet2: dataSet2,
          });
        } else {
          _this.setState({ data: [], loadingChart: false });
        }
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };
  FetchAppointmentData = () => {
    let _this = this;
    getAppointmentList(
      "?botid=" + _this.state.botId,
      (res) => {
        if (Array.isArray(res.appointment_list)) {
          _this.setState({
            loading: false,
            appointmentList: res.appointment_list,
          });
        }
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };
  render() {
    const [startDate, endDate] = this.state.filterDate;
    let _this = this;
    let form = (
      <Fragment>
        <div className="dashboard_component">
          <div className="chat_bot_box">
            <div className="filter_box">
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                name="selectBotId"
                options={_this.state.botItemList}
                value={_this.state.botName}
                onChange={(e, option) => {
                  _this.setState(
                    {
                      botId: option.value,
                      botName: option.label,
                    },
                    () => {
                      if (option && option.label !== undefined) {
                        _this.fetchDataFromServer();
                        _this.fetchBarChartData();
                        _this.FetchAppointmentData();
                      }
                    }
                  );
                }}
                className="chat_bot_select"
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Chat Interface" />
                )}
              />

              <div className="date-floating-block">
                <img src={calendar} alt="" />
                <Form.Floating className="">
                  <DatePicker
                    selectsRange={true}
                    startDate={startDate}
                    endDate={endDate}
                    onChange={(date) => {
                      this.setState({
                        filterDate: date,
                      });
                      if (date[0] !== null && date[1] !== null) {
                        setTimeout(() => {
                          _this.fetchDataFromServer();
                          _this.fetchBarChartData();
                        }, 1000);
                      } else {
                        if (date[0] === null && date[1] === null) {
                          setTimeout(() => {
                            _this.fetchDataFromServer();
                            _this.fetchBarChartData();
                          }, 1000);
                        }
                      }
                    }}
                    isClearable={true}
                    dateFormat="MMMM d"
                  />
                  <label
                    htmlFor="floatingInputCustom"
                    style={
                      startDate !== null
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
            {/* 
            <p className="custome_text">
              <span>
                <img src={edit} alt="" />
              </span>
              Customize dashboard
            </p> */}
          </div>
          <div className="dash_grid">
            <div className="dash_grid_left">
              <Grid container spacing={2}>
                <Grid item md={4} sm={6} xs={12}>
                  <div className="review_box">
                    <div className="review_icon">
                      <img alt="" src={trend} />
                    </div>
                    <p className="response_text">Total response</p>
                    <div className="review_total_box">
                      <p className="review_total">
                        {_this.state.totalResponse}
                      </p>
                      {_this.state.totaldiffComparison === "High" ? (
                        <Fragment>
                          <p className="review_perc">
                            {`${
                              _this.state.totalresponsediffPercent === undefined
                                ? 0
                                : _this.state.totalresponsediffPercent
                            }%`}{" "}
                            <img src={upArrow} alt="" />
                          </p>
                        </Fragment>
                      ) : _this.state.totaldiffComparison === "Low" ? (
                        <Fragment>
                          <p className="review_perc">
                            {`${
                              _this.state.totalresponsediff === undefined
                                ? 0
                                : _this.state.totalresponsediff
                            }%`}{" "}
                            <img src={arrow} alt="" />
                          </p>
                        </Fragment>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <div className="review_box">
                    <div className="review_icon review_bg">
                      <img src={clock} alt="" />
                    </div>
                    <p className="response_text">Average response/day</p>
                    <div className="review_total_box">
                      <p className="review_total">
                        {_this.state.averageResponse}
                      </p>
                      {_this.state.averagediffComparison === "High" ? (
                        <Fragment>
                          <p className="review_perc">
                            {`${
                              _this.state.averageresponsediff === undefined
                                ? 0
                                : _this.state.averageresponsediff
                            }%`}{" "}
                            <img src={upArrow} alt="" />
                          </p>
                        </Fragment>
                      ) : _this.state.averagediffComparison === "Low" ? (
                        <Fragment>
                          <p className="review_perc">
                            {`${
                              _this.state.averageresponsediff === undefined
                                ? 0
                                : _this.state.averageresponsediff
                            }%`}{" "}
                            <img src={downarrow} alt="" />
                          </p>
                        </Fragment>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </Grid>
                <Grid item md={4} sm={6} xs={12}>
                  <div className="review_box">
                    <div className="review_icon review_bg2">
                      <img src={mail} alt="" />
                    </div>
                    <p className="response_text">Offline messages</p>
                    <div className="review_total_box">
                      <p className="review_total">{_this.state.offlineMsg}</p>{" "}
                      {_this.state.offlineMsgdiffComparison === "High" ? (
                        <Fragment>
                          <p className="review_perc">
                            {`${_this.state.offlineMsgdiffPercent}%`}{" "}
                            <img src={upArrow} alt="" />
                          </p>
                        </Fragment>
                      ) : _this.state.offlineMsgdiffComparison === "Low" ? (
                        <Fragment>
                          <p className="review_perc">
                            {`${_this.state.offlineMsgdiffPercent}%`}{" "}
                            <img src={downarrow} alt="" />
                          </p>
                        </Fragment>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                </Grid>
              </Grid>
              <div className="response_chart_section">
                <p className="chart_title">Responses</p>
                {_this.state.data && _this.state.data.length > 0 ? (
                  <div className="chart_box">
                    <VerticalBarChartComponent
                      _this={_this}
                      title1="Visitor"
                      title2="Leads"
                      data={_this.state.data}
                      dataSet1={_this.state.dataSet1}
                      dataSet2={_this.state.dataSet2}
                      {..._this.props}
                    />
                  </div>
                ) : _this.state.loadingChart ? (
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
            <div className="dash_grid_right">
              <p className="appoint_text">Appointments</p>
              {_this.state.appointmentList &&
              Array.isArray(_this.state.appointmentList) &&
              _this.state.appointmentList.length > 0 ? (
                <div className="meetings_box">
                  {_this.state.appointmentList.map((prop, index) => {
                    if (prop.value) {
                      return (
                        <Fragment>
                          <p className="upcoming_text">
                            {moment(prop.date).calendar(null, {
                              sameDay: "[Today]",
                              nextDay: "[Tomorrow]",
                              nextWeek: "DD MMM yyyy",
                              sameElse: "DD MMM yyyy",
                            })}
                          </p>
                          <div className="meeting_link_box">
                            <div className="visitor_id_box ">
                              <div className="d-flex align-items-center">
                                <div className="calendar_icon">
                                  <img alt="" src={calendar} />
                                </div>
                                <div>
                                  <p className="visitor_id_text">
                                    {prop.client_id}
                                  </p>
                                  <p className="visitor_time">
                                    {moment(prop.date, "YYYY-MM-DD").format(
                                      "ddd Do MMM YY"
                                    )}
                                    ,{" "}
                                    {`${prop.time_slot_start} - ${prop.time_slot_end}`}
                                  </p>
                                </div>
                              </div>
                              <div
                                className="downarrow_img"
                                role="button"
                                onClick={() => {
                                  let temp = _this.state.appointmentList;
                                  temp[index].value = false;
                                  _this.setState({
                                    appointmentList: temp,
                                  });
                                }}
                              >
                                <img src={downarrow} alt="" />
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

                              {/* <div className="downarrow_img">
                                <img src={copy} alt=""/>
                              </div> */}
                            </div>
                            {prop.meeting_link !== null ? (
                              <a
                                role="button"
                                href={prop.meeting_link}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <div className="visitor_btn_box">
                                  <Button
                                    type="button"
                                    className="meet_join_btn"
                                  >
                                    Join
                                  </Button>
                                </div>
                              </a>
                            ) : (
                              <div className="visitor_btn_box">
                                <Button type="button" className="meet_join_btn">
                                  Join
                                </Button>
                              </div>
                            )}
                          </div>
                        </Fragment>
                      );
                    } else {
                      return (
                        <Fragment>
                          <p className="upcoming_text">
                            {moment(prop.date).calendar(null, {
                              sameDay: "[Today]",
                              nextDay: "[Tomorrow]",
                              nextWeek: "DD MMM yyyy",
                              sameElse: "DD MMM yyyy",
                            })}
                          </p>
                          <div className="meeting_link_box visitor_box">
                            <div className="visitor_id_box">
                              <div className="d-flex align-items-center">
                                <div className="calendar_icon">
                                  <img src={calendar} alt="" />
                                </div>
                                <div>
                                  <p className="visitor_id_text">
                                    {prop.client_id}
                                  </p>
                                  <p className="visitor_time">
                                    {moment(prop.date, "YYYY-MM-DD").format(
                                      "ddd Do MMM YY"
                                    )}
                                    ,{" "}
                                    {`${prop.time_slot_start} - ${prop.time_slot_end}`}
                                  </p>
                                </div>
                              </div>
                              <div
                                className="downarrow_img"
                                role="button"
                                onClick={() => {
                                  let temp = _this.state.appointmentList;
                                  temp[index].value = true;
                                  _this.setState({
                                    appointmentList: temp,
                                  });
                                }}
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
                                  <img src={copy} alt="" />
                                  Copy Link
                                </Button>
                              </CopyToClipboard>
                              {prop.meeting_link !== null ? (
                                <a
                                  role="button"
                                  href={prop.meeting_link}
                                  target="_blank"
                                  rel="noreferrer"
                                >
                                  <Button
                                    type="button"
                                    className="visitor_btn join_btn"
                                  >
                                    Join
                                  </Button>
                                </a>
                              ) : (
                                <Button
                                  type="button"
                                  className="visitor_btn join_btn"
                                >
                                  Join
                                </Button>
                              )}
                            </div>
                          </div>
                        </Fragment>
                      );
                    }
                  })}
                </div>
              ) : _this.state.loading ? (
                <div className="text-center alert alert-danger">Loading...</div>
              ) : (
                <div className="text-center alert alert-danger">
                  No Data Found!
                </div>
              )}
            </div>
          </div>
        </div>
      </Fragment>
    );
    return (
      <Fragment>
        {this.state.alert}
        {this.state.loading && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
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
        )}
        {form}
      </Fragment>
    );
  }
}

export default AgentDashboardComponent;
