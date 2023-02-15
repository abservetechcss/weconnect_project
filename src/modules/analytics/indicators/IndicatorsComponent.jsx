import React, { Component, Fragment } from "react";
import {
  Autocomplete,
  Button,
  ButtonGroup,
  Grid,
  TextField,
} from "@mui/material";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import { Bar } from "@nivo/bar";
import "react-circular-progressbar/dist/styles.css";
import { FloatingLabel, Form } from "react-bootstrap";
import img1 from "../../../assets/images/Mask Group 459.png";
import img2 from "../../../assets/images/Group 18998.svg";
// import grow from "../../../assets/images/Group 19365.svg";
import arrowup from "../../../assets/images/arrow-up (1).svg";
import DatePicker from "react-datepicker";
import downArrow from "../../../assets/images/Path 48024.svg";
import calenderIcon from "../../../assets/images/calendar.svg";
// import map from "../../../assets/images/Mask Group 444.png";
import { Tabs, Tab, TabPanel, TabList } from "react-web-tabs";
import { getAdminChatBotList } from "../../agent/dashboard/server/DashboardServer.js";
import IndicatorLineChart from "./components/IndicatorLineChart";
import moment from "moment";
import {
  getAllIndicatorsList,
  getAllTopSourceList,
} from "./server/IndicatorServer.js";
import { decryptBot } from "../../../js/encrypt";
import { getDaysBetweenDates } from "../../../js/lib";
import { MittContext } from "../../common/WebSocketComponent";

import VerticalBarChartComponent from "./components/VerticalBarChartComponent.jsx";
import truncate from "truncate-html";
// import { getAgentPerformanceList } from "../agentperformance/server/AgentPerfirmanceServer";

const fillMissingFieldValues = (arr, dates) => {
  let keyValuePair = {};
  const newArry = [];
  if (Array.isArray(arr)) {
    arr.forEach((arr) => {
      keyValuePair[arr.date] = arr.count;
    });
  }

  dates.reverse().forEach((date) => {
    if (!keyValuePair.hasOwnProperty(date)) {
      newArry.push({ x: date, y: 0 });
    } else {
      newArry.push({
        x: date,
        y: keyValuePair[date],
      });
    }
  });

  return newArry;
};

const fillMissingFieldValues2 = (arr, dates) => {
  let keyValuePair = {};
  const newArry = [];
  if (Array.isArray(arr)) {
    arr.forEach((arr) => {
      keyValuePair[arr.date] = arr.total_count;
    });
  }

  dates.reverse().forEach((date) => {
    if (!keyValuePair.hasOwnProperty(date)) {
      newArry.push({ x: date, y: 0 });
    } else {
      newArry.push({
        x: date,
        y: keyValuePair[date],
      });
    }
  });

  return newArry;
};
export class IndicatorsComponent extends Component {
  static contextType = MittContext;
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      loading: false,
      filterDate: [null, null],
      lineChartFormat: "%b %d",
      lineChartTickValue: "every 1 days",
      activeTab: "3",
      totalCount: 0,
      selectFilter: false,
      botId: null,
      botName: "",
      botItemList: [],
      data: [],
      latitude: 0,
      longitude: 0,
      zoom: 2,
      average_conversation_90_days: 0,
      average_conversation_per_day: 0,
      conversion_percentage: 0,
      new_conversation_completed: [],
      new_conversation_not_completed: [],
      overall_new_conversations: [],
      overall_total_conversation: [],
      total_conversation_completed: [],
      total_conversation_not_completed: [],
      percent_increase_in_lead_conversation: 0,
      percent_increase_in_conversation: 0,
      leadsChatBarList: [],
      csat_score: [],
      topSourcesList: [],
    };
  }
  componentDidMount() {
    let _this = this;
    var currentDate = new Date();
    var startDate = new Date(currentDate.setDate(currentDate.getDate() - 30));
    let endDate = new Date();
    this.setState(
      {
        filterDate: [startDate, endDate],
      },
      () => {
        if (window.location.href.includes("?botId=")) {
          let data = window.location.href.split("?botId=")[1];
          var decryptedData = decryptBot(data);
          _this.setState({
            botId: decryptedData && decryptedData.botId,
            botName: decryptedData && decryptedData.botName,
          });
          _this.fetchDataFromServer(decryptedData && decryptedData.botId);
          _this.fetchTopSource(decryptedData && decryptedData.botId);
        }
      }
    );
    window.scrollTo(0, 0);
    setTimeout(() => {
      getAdminChatBotList(
        _this,
        "",
        (res) => {
          _this.setState({ loading: false });
          let newObj =
            res.bot_list &&
            res.bot_list.length > 0 &&
            res.bot_list.map((prop) => {
              return {
                id: prop.bot_id,
                label: prop.bot_name,
                value: prop.bot_id,
              };
            });
          _this.setState({
            botItemList: newObj,
            loading: false,
          });
        },
        () => {
          _this.setState({ loading: false });
        }
      );
    }, 100);
  }

  fetchTopSource(id) {
    let _this = this;
    const [startDate, endDate] = _this.state.filterDate;
    let botId = _this.state.botId === null ? id : _this.state.botId;
    let params = "";
    if (startDate === null) {
      params = `bot_id=${botId}&duration=all`;
    } else {
      params = `bot_id=${botId}&startdate=${moment(startDate).format(
        "YYYY-MM-DD"
      )}&enddate=${moment(endDate).format("YYYY-MM-DD")}&duration=date`;
    }
    // let params = `bot_id=${botId}&duration=date&startdate=${moment(
    //   startDate
    // ).format("YYYY-MM-DD")}&enddate=${moment(endDate).format("YYYY-MM-DD")}`;
    getAllTopSourceList(
      params,
      (res) => {
        console.log(res);
        _this.setState({
          topSourcesList: res.top_sources,
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  fetchDataFromServer(id) {
    console.log("_this", this);
    let _this = this;
    const [startDate, endDate] = _this.state.filterDate;
    let botId = _this.state.botId === null ? id : _this.state.botId;
    let params = "";
    if (startDate === null) {
      params = `botid=${botId}&duration=all`;
    } else {
      params = `botid=${botId}&startdate=${moment(startDate).format(
        "YYYY-MM-DD"
      )}&enddate=${moment(endDate).format("YYYY-MM-DD")}&duration=date`;
    }

    _this.setState({ loading: true, activeTab: 3 });
    getAllIndicatorsList(
      _this,
      params,
      (res) => {
        let newObj = [];

        _this.setState({
          activeTab: 3,
          loading: false,
          percent_increase_in_lead_conversation:
            res.percent_increase_in_lead_conversation,
          percent_increase_in_conversation:
            res.percent_increase_in_conversation,
          average_conversation_90_days: res.average_conversation_90_days,
          average_conversation_per_day: res.average_conversation_per_day,
          conversion_percentage: res.conversion_percentage,
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
        let new_conversation_not_completed = fillMissingFieldValues(
          res.new_conversation_not_completed,
          dates
        );
        let total_conversation_completed = fillMissingFieldValues(
          res.total_conversation_completed,
          dates
        );
        let total_conversation_not_completed = fillMissingFieldValues(
          res.total_conversation_not_completed,
          dates
        );
        let overall_new_conversation = fillMissingFieldValues(
          res.overall_new_conversations,
          dates
        );
        let overall_total_conversation = fillMissingFieldValues2(
          res.overall_total_conversation,
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

        let data = res.barchart && res.barchart;
        if (Object.keys(data) && Object.keys(data).length > 0) {
          Object.keys(data).forEach((prop1, key) => {
            newObj.push({
              name: `${prop1}`,
              barChart: data[prop1],
            });
          });
        }

        _this.setState({
          leadsChatBarList: newObj,
          loading: false,
          new_conversation_completed: new_conversation_completed,
          new_conversation_not_completed: new_conversation_not_completed,
          overall_new_conversation: overall_new_conversation,
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
    // getAgentPerformanceList(
    //   _this,
    //   params,
    //   (res) => {
    //     let ratingData = [];
    //     let ratingArray = res.csat_score && res.csat_score;
    //     if (Object.keys(ratingArray) && Object.keys(ratingArray).length > 0) {
    //       Object.keys(ratingArray).map((prop1, key) => {
    //         ratingData.push({
    //           name: `${key + 1} *`,
    //           rating: ratingArray[prop1],
    //         });
    //       });
    //     }
    //     _this.setState({
    //       loading: false,
    //       csat_score: ratingData,
    //     });
    //   },
    //   () => {
    //     _this.setState({ loading: false, data: [] });
    //   }
    // );
  }
  render() {
    let _this = this;
    const [startDate, endDate] = this.state.filterDate;
    const HorizontalTick = ({ textAnchor, textBaseline, value, x, y }) => {
      const MAX_LINE_LENGTH = 9;
      const MAX_LINES = 2;
      const LENGTH_OF_ELLIPSIS = 3;
      const TRIM_LENGTH = MAX_LINE_LENGTH * MAX_LINES - LENGTH_OF_ELLIPSIS;
      const trimWordsOverLength = new RegExp(`^(.{${TRIM_LENGTH}}[^\\w]*).*`);
      const groupWordsByLength = new RegExp(
        `([^\\s].{0,${MAX_LINE_LENGTH}}(?=[\\s\\W]|$))`,
        "gm"
      );
      const splitValues = value
        .replace(trimWordsOverLength, "$1...")
        .match(groupWordsByLength)
        .slice(0, 2)
        .map((val, i) => (
          <tspan
            key={val}
            dy={15 * i}
            x={-10}
            y={20}
            style={{ fontFamily: "Nunito", fontSize: "11px" }}
          >
            {val}
          </tspan>
        ));
      return (
        <g transform={`translate(${x},${y})`}>
          <text alignmentBaseline={textBaseline} textAnchor={textAnchor}>
            {splitValues}
          </text>
        </g>
      );
    };
    let form = (
      <Fragment>
        <div className="performance_section">
          <div className="performance_filter_block">
            <FloatingLabel
              controlId="floatingSelect"
              label="Select Chat Interface"
              className="floating-select-field-block-cust performance_floating"
            >
              <Form.Select
                aria-label="Floating label select example"
                value={_this.state.botId}
                onChange={(e) => {
                  let data =
                    _this.state.botItemList &&
                    _this.state.botItemList.length > 0 &&
                    _this.state.botItemList.filter((x) => {
                      return x.value === parseInt(e.target.value);
                    });

                  _this.setState(
                    {
                      botId: data[0].value,
                      botName: data[0].label,
                    },
                    () => {
                      if (data[0] && data[0].label !== undefined) {
                        _this.fetchDataFromServer();
                        // debugger;
                        const url = window.location.href.includes(
                          "/user/analytics/funnel"
                        )
                          ? "/user/analytics/funnel"
                          : window.location.href.includes(
                              "/user/analytics/indicators"
                            )
                          ? "/user/analytics/indicators"
                          : "/user/analytics/insights";
                        this.context.emitter.emit("changebotUrl", {
                          botId: data[0].value,
                          botName: data[0].label,
                          url: url,
                        });
                      }
                    }
                  );
                }}
              >
                {_this.state.botItemList &&
                  _this.state.botItemList.length > 0 &&
                  _this.state.botItemList.map((prop) => {
                    return <option value={prop.value}>{prop.label}</option>;
                  })}
              </Form.Select>
            </FloatingLabel>

            <div className="date-picker-range-block-cust">
              <div className="icon-block">
                <img src={calenderIcon} className="calender-icon" alt="" />
              </div>
              <div className="date-picker-box">
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
                        _this.fetchTopSource();
                      }, 1000);
                    } else {
                      if (date[0] === null && date[1] === null) {
                        setTimeout(() => {
                          _this.fetchDataFromServer();
                          _this.fetchTopSource();
                        }, 1000);
                      }
                    }
                  }}
                  isClearable={true}
                  dateFormat="MMM d"
                />
                <img src={downArrow} alt="" />
              </div>
            </div>
          </div>
          <Grid container spacing={2}>
            <Grid item lg={8} md={12} sm={12} xs={12}>
              <div className="performance_block">
                <p className="performance_title">
                Conversation Insights
                </p>
                {/* <p className="performance_text">
                   n
                  reprehenderit in volupta
                </p> */}
                <div className="performance_box indicator_conv_box take_over">
                  <div className=" tab_line_chart">
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
                          <div></div>Total Conversation
                        </div>
                        <div className="legends_new">
                          <div></div>Unique visitors
                        </div>
                      </div>
                      <TabPanel tabId={1}>
                        {(_this.state.total_conversation_completed &&
                          _this.state.total_conversation_completed.length >
                            0) ||
                        (_this.state.new_conversation_completed &&
                          _this.state.new_conversation_completed.length > 0) ? (
                          <IndicatorLineChart
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
                          <IndicatorLineChart
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
                        (_this.state.overall_new_conversation &&
                          _this.state.overall_new_conversation.length > 0) ? (
                          <IndicatorLineChart
                            tickValues={_this.state.lineChartTickValue}
                            chartData={_this.state.overall_total_conversation}
                            chartData1={_this.state.overall_new_conversation}
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
              </div>
            </Grid>
            <Grid item md={6} sm={12} xs={12} lg={4}>
              <div className="performance_block">
                <p className="performance_title">CSAT score</p>
                <p className="performance_text">
                  Ratings received from visitor for live chat / video
                </p>
                <div className="performance_box">
                  <div className="user_img">
                    <img src={img1} />
                  </div>
                  <div>
                    {_this.state.csat_score &&
                    _this.state.csat_score.length > 0 ? (
                      <Bar
                        data={_this.state.csat_score}
                        width={230}
                        layout="horizontal"
                        height={215}
                        padding={0.55}
                        margin={{ top: 20, right: 8, bottom: 30, left: 40 }}
                        indexBy="name"
                        keys={["rating"]}
                        labelTextColor="inherit:darker(1.4)"
                        colors={"#17c7ba"}
                        enableGridY={false}
                        gridYValues={("456", "789")}
                        enableGridX={true}
                        fill={[
                          {
                            match: {
                              id: "fries",
                            },
                            id: "dots",
                          },
                          {
                            match: {
                              id: "sandwich",
                            },
                            id: "lines",
                          },
                        ]}
                        borderColor="black"
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                          tickSize: 0,
                          legend: false,
                          tickPadding: 5,
                        }}
                        axisLeft={{
                          tickSize: 5,
                          // format: (v) => `${v} *`,
                          legend: false,
                        }}
                        enableLabel={false}
                      />
                    ) : (
                      <Bar
                        data={[
                          {
                            name: "1 *",
                            rating: 0,
                          },
                          {
                            name: "2 *",
                            rating: 0,
                          },
                          {
                            name: "3 *",
                            rating: 0,
                          },
                          {
                            name: "4 *",
                            rating: 0,
                          },
                          {
                            name: "5 *",
                            rating: 0,
                          },
                        ]}
                        width={230}
                        layout="horizontal"
                        height={215}
                        padding={0.55}
                        margin={{ top: 20, right: 8, bottom: 30, left: 40 }}
                        indexBy="name"
                        keys={["rating"]}
                        labelTextColor="inherit:darker(1.4)"
                        colors={"#17c7ba"}
                        enableGridY={false}
                        gridYValues={("456", "789")}
                        enableGridX={true}
                        fill={[
                          {
                            match: {
                              id: "fries",
                            },
                            id: "dots",
                          },
                          {
                            match: {
                              id: "sandwich",
                            },
                            id: "lines",
                          },
                        ]}
                        borderColor="black"
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                          tickSize: 0,
                          legend: false,
                          tickPadding: 5,
                        }}
                        axisLeft={{
                          tickSize: 5,
                          // format: (v) => `${v} *`,
                          legend: false,
                        }}
                        enableLabel={false}
                      />
                    )}
                  </div>
                </div>
              </div>
            </Grid>
            {/* <Grid item lg={4} md={12} sm={12} xs={12}>
              <div className="performance_block">
                <p className="performance_title">Live Visitors (Coming Soon)</p>
                <p className="performance_text">Based on geolocation</p>
                <div className="performance_box">
                  <p className="indicator_text">Sessions by country</p>
                  <img className="map_img" src={map} />
                  <LocationWiseMapTiler
                    longitude={_this.state.longitude}
                    latitude={_this.state.latitude}
                    zoom={_this.state.zoom}
                    {...this.props}
                  />
                  <div>
                    <Bar
                      data={[
                        { country: "Canada", "hot dogs": 4 },
                        { country: "Ireland", "hot dogs": 8 },
                        { country: "United Kingdom", "hot dogs": 10 },
                        { country: "United States", "hot dogs": 15 },
                        { country: "India", "hot dogs": 20 },
                      ]}
                      width={260}
                      layout="horizontal"
                      height={215}
                      padding={0.55}
                      margin={{ top: 20, right: 12, bottom: 30, left: 95 }}
                      indexBy="country"
                      keys={["hot dogs"]}
                      labelTextColor="inherit:darker(1.4)"
                      colors={"#17c7ba"}
                      enableGridY={false}
                      gridYValues={("456", "789")}
                      enableGridX={true}
                      gridXValues={[0, 5, 10, 15, 20]}
                      fill={[
                        {
                          match: {
                            id: "fries",
                          },
                          id: "dots",
                        },
                        {
                          match: {
                            id: "sandwich",
                          },
                          id: "lines",
                        },
                      ]}
                      borderColor="black"
                      axisTop={null}
                      axisRight={null}
                      axisBottom={{
                        tickSize: 0,
                        format: (v) => `${v}%`,
                        legend: false,
                        tickValues: [0, 5, 10, 15, 20],
                        tickPadding: 5,
                      }}
                      axisLeft={{
                        tickSize: 5,
                        legend: false,
                      }}
                      enableLabel={false}
                    />
                  </div>
                </div>
              </div>
            </Grid> */}

            <Grid item lg={8} md={12} sm={12} xs={12}>
              <div className="performance_block">
                <p className="performance_title">
                  Average Conversations per Day {/* / Month */}
                </p>
                {/* <p className="performance_text">
                   n
                  reprehenderit in volupta
                </p> */}
                <div className="performance_box take_over">
                  <p className="indicator_text">Average conversations</p>
                  <div className="dollar_box">
                    <div>
                      <p className="dollar_text">
                        {`${_this.state.average_conversation_per_day}`}
                        <span>/day</span>
                      </p>
                      {/* <div className="dollar_line"></div>
                      <p className="dollar_text">
                        {`${_this.state.average_conversation_90_days}`}
                        <span>/month</span>
                      </p> */}
                    </div>
                    {parseFloat(_this.state.percent_increase_in_conversation) >=
                    0 ? (
                      <p className="precent_text">
                        {`${_this.state.percent_increase_in_conversation}%`}
                        <span> increase in conversation</span>
                      </p>
                    ) : (
                      <p className="review_perc">
                        {`${_this.state.percent_increase_in_conversation}%`}
                        <span> increase in conversation</span>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Grid>
            <Grid item lg={4} md={12} sm={12} xs={12}>
              <div className="performance_block">
                <p className="performance_title">% Lead conversion</p>
                <p className="performance_text">
                  Leads collected against total conversations
                </p>
                <div className="performance_box">
                  <p className="indicator_text"> Conversion percentage</p>
                  <div className="dollar_box">
                    <p className="dollar_text">
                      {`${_this.state.conversion_percentage} %`}
                    </p>
                    {parseFloat(
                      _this.state.percent_increase_in_lead_conversation
                    ) >= 0 ? (
                      <p className="precent_text">
                        {`${_this.state.percent_increase_in_lead_conversation}%`}
                        <img src={arrowup} />
                      </p>
                    ) : (
                      <p className="review_perc">
                        {`${_this.state.percent_increase_in_lead_conversation
                          .toString()
                          .substring(
                            1,
                            _this.state.percent_increase_in_lead_conversation.toString()
                              .length
                          )}%`}
                        <img src={downArrow} />
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Grid>

            <Grid item lg={8} md={12} sm={12} xs={12}>
              <div className="performance_block">
                <p className="performance_title">No of Lead Collected</p>
                {/* <p className="performance_text">
                  Duis aute irure dolor in reprehenderit in voluptate velit n
                  reprehenderit in volupta
                </p> */}
                <div className="performance_box take_over">
                  <div className="dash_bar_chart">
                    {_this.state.leadsChatBarList &&
                    _this.state.leadsChatBarList.length > 0 ? (
                      <VerticalBarChartComponent
                        leadsChatBarList={_this.state.leadsChatBarList}
                        _this={_this}
                        {..._this.props}
                      />
                    ) : _this.state.loading ? (
                      <div className="text-center alert alert-danger">
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
              </div>
            </Grid>
            <Grid item lg={4} md={12} sm={12} xs={12}>
              <div className="performance_block">
                <p className="performance_title">Top Sources</p>
                <p className="performance_text">
                  From which URL’s maximum chats are coming
                </p>
                <div className="performance_box">
                  <img className="search_img" src={img2} />
                  {Array.isArray(this.state.topSourcesList) ? (
                    <div>
                      <Bar
                        data={this.state.topSourcesList}
                        // data={[
                        //   { country: "Source 5", "hot dogs": 4 },
                        //   { country: "Source 4", "hot dogs": 8 },
                        //   { country: "Source 3", "hot dogs": 10 },
                        //   { country: "Source 2", "hot dogs": 15 },
                        //   { country: "Source 1", "hot dogs": 20 },
                        // ]}
                        width={250}
                        layout="horizontal"
                        height={215}
                        padding={0.55}
                        margin={{ top: 20, right: 10, bottom: 30, left: 140 }}
                        indexBy="source_url"
                        keys={["total_count"]}
                        labelTextColor="inherit:darker(1.4)"
                        colors={"#17c7ba"}
                        enableGridY={false}
                        gridYValues={("456", "789")}
                        enableGridX={true}
                        gridXValues={[
                          0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
                        ]}
                        fill={[
                          {
                            match: {
                              id: "fries",
                            },
                            id: "dots",
                          },
                          {
                            match: {
                              id: "sandwich",
                            },
                            id: "lines",
                          },
                        ]}
                        borderColor="black"
                        axisTop={null}
                        axisRight={null}
                        axisBottom={{
                          tickSize: 0,
                          legend: false,
                          tickValues: [
                            0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100,
                          ],
                          tickPadding: 5,
                        }}
                        tooltip={({ id, value, color }) => (
                          <div
                            style={{
                              padding: "3px 13px",
                              color: "#000",
                              background: "#fff",
                              fontSize: "14px",
                              boxShadow: "2px 2px 4px #87878866",
                              borderRadius: "2px",
                            }}
                          >
                            {id}:<strong> {value}</strong>
                          </div>
                        )}
                        axisLeft={{
                          tickSize: 10,
                          tickPadding: 5,
                          tickRotation: 0,
                          legend: "",
                          legendPosition: "middle",
                          legendOffset: -40,
                          renderTick: ({
                            textAnchor,
                            textBaseline,
                            textX,
                            textY,
                            value,
                            x,
                            y,
                          }) => {
                            return (
                              <g transform={`translate(${x},${y})`}>
                                <text
                                  alignmentBaseline={textBaseline}
                                  textAnchor={textAnchor}
                                  transform={`translate(${textX},${textY})`}
                                >
                                  <tspan>
                                    {truncate(
                                      value
                                        .replace("https://", "")
                                        .replace("http://", ""),
                                      18
                                    )}
                                  </tspan>
                                </text>
                              </g>
                            );
                          },
                        }}
                        enableLabel={false}
                      />
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
            </Grid>
          </Grid>
        </div>
      </Fragment>
    );
    return (
      <Fragment>
        {_this.state.alert}
        {this.state.loading && (
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
        )}
        {form}
      </Fragment>
    );
  }
}

export default IndicatorsComponent;
