import React, { Component, Fragment } from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import { Bar } from "@nivo/bar";
import "react-circular-progressbar/dist/styles.css";
import { FloatingLabel, Form } from "react-bootstrap";
import img1 from "../../../assets/images/Mask Group 459.png";
import grow from "../../../assets/images/Group 19365.svg";
import arrowup from "../../../assets/images/arrow-up (1).svg";
import DatePicker from "react-datepicker";
import downArrow from "../../../assets/images/Path 48024.svg";
import calenderIcon from "../../../assets/images/calendar.svg";
import { Grid } from "@mui/material";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import { getAdminChatBotList } from "../../agent/dashboard/server/DashboardServer.js";
import { getAgentPerformanceList } from "./server/AgentPerfirmanceServer.js";
import VerticalBarChartComponent from "./components/VerticalBarChartComponent.jsx";
import { MittContext } from "../../common/WebSocketComponent";
import moment from "moment";
import { Pie } from "@nivo/pie";
import { decryptBot } from "../../../js/encrypt";

export class AgentPerformanceComponent extends Component {
  static contextType = MittContext;
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      loading: false,
      filterDate: [null, null],
      activeTab: 0,
      selectFilter: false,
      botId: null,
      botName: "",
      agentId: null,
      human_takeover: 0,
      human_takeover_leads_converted: 0,
      human_takeover_leads_notconverted: 0,
      live_chat: 0,
      live_chat_leads_converted: 0,
      live_chat_leads_notconverted: 0,
      percent_humantakeover_lead_conversion: 0,
      percent_livechat_lead_conversion: 0,
      botItemList: [],
      agentList: [],
      avg_live_chat_duration: [],
      csat_score: [],
      live_chat_duration: [],
    };
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
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
          _this.setState(
            {
              botId: decryptedData && decryptedData.botId,
              botName: decryptedData && decryptedData.botName,
            },
            () => {
              _this.fetchDefaultAgentList(decryptedData && decryptedData.botId);
            }
          );
        }
      }
    );
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
  }

  fetchDefaultAgentList(id) {
    let _this = this;
    const [startDate, endDate] = _this.state.filterDate;
    let botId = _this.state.botId === null ? id : _this.state.botId;
    let params = "";
    if (startDate === null) {
      params = `botid=${botId}&agentid=${_this.state.agentId}&duration=all`;
    } else {
      params = `botid=${botId}&agentid=${
        _this.state.agentId
      }&startdate=${moment(startDate).format("YYYY-MM-DD")}&enddate=${moment(
        endDate
      ).format("YYYY-MM-DD")}&duration=date`;
    }

    _this.setState({ loading: true, activeTab: 0 });
    getAgentPerformanceList(
      _this,
      params,
      (res) => {
        let agentList =
          res.agentlist &&
          res.agentlist.length > 0 &&
          res.agentlist.map((prop) => {
            return {
              id: prop.id,
              label: prop.name,
              value: prop.id,
            };
          });
        _this.setState(
          {
            agentList: agentList,
            agentId: agentList[0].value,
          },
          () => {
            _this.fetchDataFromServer(id);
          }
        );
      },
      () => {
        _this.setState({ loading: false, data: [] });
      }
    );
  }
  fetchDataFromServer(id) {
    let _this = this;
    const [startDate, endDate] = _this.state.filterDate;
    let botId = _this.state.botId === null ? id : _this.state.botId;
    let params = "";
    if (startDate === null) {
      params = `botid=${botId}&agentid=${_this.state.agentId}&duration=all`;
    } else {
      params = `botid=${botId}&agentid=${
        _this.state.agentId
      }&startdate=${moment(startDate).format("YYYY-MM-DD")}&enddate=${moment(
        endDate
      ).format("YYYY-MM-DD")}&duration=date`;
    }

    _this.setState({ loading: true, activeTab: 0 });
    getAgentPerformanceList(
      _this,
      params,
      (res) => {
        let agentList =
          res.agentlist &&
          res.agentlist.length > 0 &&
          res.agentlist.map((prop) => {
            return {
              id: prop.id,
              label: prop.name,
              value: prop.id,
            };
          });
        let newObj = [];
        let data = res?.live_chat_duration ? res.live_chat_duration : {};
        if (Object.keys(data) && Object.keys(data).length > 0) {
          Object.keys(data).map((prop1, key) => {
            newObj.push({
              name: `${moment(prop1).format("DD MMM")}`,
              barChart: data[prop1].count_min,
              count_sec: data[prop1].count_sec,
            });
          });
        }
        let ratingData = [];
        let ratingArray = res?.csat_score ? res.csat_score : {};
        if (Object.keys(ratingArray) && Object.keys(ratingArray).length > 0) {
          Object.keys(ratingArray).map((prop1, key) => {
            ratingData.push({
              name: `${key + 1} *`,
              rating: ratingArray[prop1],
            });
          });
        }
        console.log("live_chat", res.live_chat);

        _this.setState({
          loading: false,
          avg_live_chat_duration: res.avg_live_chat_duration,
          csat_score: ratingData,
          live_chat_duration: newObj,
          human_takeover: res.human_takeover,
          human_takeover_leads_converted: res.human_takeover_leads_converted,
          human_takeover_leads_notconverted:
            res.human_takeover_leads_notconverted,
          live_chat: res.live_chat,
          live_chat_leads_converted: res.live_chat_leads_converted,
          live_chat_leads_notconverted: res.live_chat_leads_notconverted,
          percent_humantakeover_lead_conversion:
            res.percent_humantakeover_lead_conversion,
          percent_livechat_lead_conversion:
            res.percent_livechat_lead_conversion,
          agentList: agentList,
        });
      },
      () => {
        _this.setState({ loading: false, data: [] });
      }
    );
  }
  render() {
    let _this = this;
    const [startDate, endDate] = _this.state.filterDate;
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
                        this.context.emitter.emit("changebotUrl", {
                          botId: data[0].value,
                          botName: data[0].label,
                          url: "/user/analytics/agent-performance",
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
            <FloatingLabel
              controlId="floatingSelect"
              label="Select Agent"
              className="floating-select-field-block-cust performance_agent_floating"
            >
              <Form.Select
                aria-label="Floating label select example"
                value={_this.state.agentId}
                onChange={(e) => {
                  _this.setState({
                    agentId: e.target.value,
                  });
                  if (e.target.value) {
                    setTimeout(() => {
                      _this.fetchDataFromServer();
                    }, 1000);
                  }
                }}
              >
                <option value={null}>Select...</option>
                {_this.state.agentList &&
                  _this.state.agentList.length > 0 &&
                  _this.state.agentList.map((prop) => {
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
                        _this.fetchBarChartData();
                      }, 1000);
                    } else {
                      if (date[0] === null && date[1] === null) {
                        setTimeout(() => {
                          _this.fetchDataFromServer();
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
            <Grid item md={6} sm={12} xs={12} lg={4}>
              <div className="performance_block">
                <p className="performance_title">
                  Live chat to lead conversion
                </p>
                {/* <p className="performance_text">
                  Duis aute irure dolor in reprehenderit in volu
                </p> */}

                <div className="performance_box take_over">
                  {_this.state.percent_livechat_lead_conversion > 0 ? (
                    <div className="pie_chart_box">
                      <Pie
                        width={300}
                        height={300}
                        innerRadius={0.65}
                        data={[
                          {
                            id: "Converted",
                            label: "Converted",
                            value: _this.state.live_chat_leads_converted,
                            color: "hsl(89, 70%, 50%)",
                          },
                          {
                            id: "Not Converted",
                            label: "Not Converted",
                            value: _this.state.live_chat_leads_notconverted,
                            color: "hsl(146, 70%, 50%)",
                          },
                        ]}
                        margin={{
                          top: 20,
                          right: 20,
                          bottom: 80,
                          left: 20,
                        }}
                        startAngle={-180}
                        sortByValue={true}
                        colors={["#8be7c9", "#16c1b4"]}
                        borderColor="inherit:darker(0.6)"
                        enableArcLabels={true}
                        enableArcLinkLabels={false}
                        animate={true}
                        isInteractive={true}
                        motionStiffness={90}
                        motionDamping={15}
                        legends={[
                          {
                            anchor: "bottom",
                            direction: "column",
                            justify: false,
                            translateX: 5,
                            translateY: 67,
                            itemsSpacing: 15,
                            itemWidth: 90,
                            itemHeight: 10,
                            itemTextColor: "#999",
                            itemDirection: "left-to-right",
                            itemOpacity: 1,
                            symbolSize: 15,
                            symbolShape: "circle",
                            effects: [
                              {
                                on: "hover",
                                style: {
                                  itemTextColor: "#000",
                                },
                              },
                            ],
                          },
                        ]}
                        theme={{
                          tooltip: {
                            container: {
                              fontSize: "13px",
                            },
                          },
                          labels: {
                            text: { color: "#555" },
                          },
                        }}
                      />
                      <div className="agent_perf_percentage">{`${_this.state.percent_livechat_lead_conversion} %`}</div>
                    </div>
                  ) : (
                    <div className="pie_chart_box">
                      <CircularProgressbar
                        value={100}
                        text={"0%"}
                        strokeWidth={5}
                        styles={{
                          root: {},
                          path: {
                            stroke: `rgba(78, 68, 73, 0.8)`,
                            strokeLinecap: "butt",
                            transition: "stroke-dashoffset 0.5s ease 0s",
                            transform: "rotate(0.25turn)",
                            transformOrigin: "center center",
                          },
                        }}
                      />
                    </div>
                  )}

                  <div className="chat_box">
                    <div>
                      <p className="live_chat_text">Live Chat</p>
                      <p className="live_chat_text">{_this.state.live_chat}</p>
                    </div>
                    <div>
                      <p className="live_chat_text">Leads Converted</p>
                      <p className="live_chat_text">
                        {_this.state.live_chat_leads_converted}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>
            {/* <Grid item md={6} sm={12} xs={12} lg={4}>
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
            </Grid> */}
            <Grid item md={6} sm={12} xs={12} lg={4}>
              <div className="performance_block">
                <p className="performance_title">
                  Human takeover to lead conversion
                </p>
                {/* <p className="performance_text">
                  Duis aute irure dolor in reprehenderit in volu
                </p> */}
                <div className="performance_box take_over">
                  {_this.state.percent_humantakeover_lead_conversion > 0 ? (
                    <div className="pie_chart_box">
                      <Pie
                        width={300}
                        height={300}
                        innerRadius={0.65}
                        data={[
                          {
                            id: "Converted",
                            label: "Converted",
                            value: _this.state.human_takeover_leads_converted,
                            color: "hsl(89, 70%, 50%)",
                          },
                          {
                            id: "Not Converted",
                            label: "Not Converted",
                            value:
                              _this.state.human_takeover_leads_notconverted,
                            color: "hsl(146, 70%, 50%)",
                          },
                        ]}
                        margin={{
                          top: 20,
                          right: 20,
                          bottom: 80,
                          left: 20,
                        }}
                        startAngle={-180}
                        sortByValue={true}
                        colors={["#8be7c9", "#16c1b4"]}
                        borderColor="inherit:darker(0.6)"
                        enableArcLabels={true}
                        enableArcLinkLabels={false}
                        animate={true}
                        isInteractive={true}
                        motionStiffness={90}
                        motionDamping={15}
                        legends={[
                          {
                            anchor: "bottom",
                            direction: "column",
                            justify: false,
                            translateX: 5,
                            translateY: 67,
                            itemsSpacing: 15,
                            itemWidth: 90,
                            itemHeight: 10,
                            itemTextColor: "#999",
                            itemDirection: "left-to-right",
                            itemOpacity: 1,
                            symbolSize: 15,
                            symbolShape: "circle",
                            effects: [
                              {
                                on: "hover",
                                style: {
                                  itemTextColor: "#000",
                                },
                              },
                            ],
                          },
                        ]}
                        theme={{
                          tooltip: {
                            container: {
                              fontSize: "13px",
                            },
                          },
                          labels: {
                            text: { color: "#555" },
                          },
                        }}
                      />
                      <div className="agent_perf_percentage">{`${_this.state.percent_humantakeover_lead_conversion} %`}</div>
                    </div>
                  ) : (
                    <div className="pie_chart_box">
                      <CircularProgressbar
                        value={100}
                        text={"0%"}
                        strokeWidth={5}
                        styles={{
                          root: {},
                          path: {
                            stroke: `rgba(78, 68, 73, 0.8)`,
                            strokeLinecap: "butt",
                            transition: "stroke-dashoffset 0.5s ease 0s",
                            transform: "rotate(0.25turn)",
                            transformOrigin: "center center",
                          },
                        }}
                      />
                    </div>
                  )}

                  <div className="chat_box">
                    <div>
                      <p className="live_chat_text">Human Takeover</p>
                      <p className="live_chat_text">
                        {_this.state.human_takeover}
                      </p>
                    </div>
                    <div>
                      <p className="live_chat_text">Leads Converted</p>
                      <p className="live_chat_text">
                        {_this.state.human_takeover_leads_converted}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>

            <Grid item sm={12} xs={12} md={12} lg={8}>
              <div className="performance_block">
                <p className="performance_title">
                  Average Live chat/Video call duration
                </p>
                {/* <p className="performance_text">
                  Duis aute irure dolor in reprehenderit in volu
                </p> */}
                <div className="performance_box average_live_section">
                  <div className="average_live_block">
                    <div>
                      <p className="average_text">Average Live chat duration</p>
                      {_this.state.avg_live_chat_duration &&
                      Object.keys(_this.state.avg_live_chat_duration).length >
                        0 ? (
                        _this.state.avg_live_chat_duration.avg_hrs !== 0 ? (
                          <p className="time_text">{`${_this.state.avg_live_chat_duration.avg_hrs}hr ${_this.state.avg_live_chat_duration.avg_min}min ${_this.state.avg_live_chat_duration.avg_sec}s`}</p>
                        ) : (
                          <p className="time_text">{` ${_this.state.avg_live_chat_duration.avg_min}min ${_this.state.avg_live_chat_duration.avg_sec}s`}</p>
                        )
                      ) : (
                        ""
                      )}
                    </div>
                    {/* <Form.Select aria-label="Default select example">
                      <option>Live</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </Form.Select> */}
                  </div>
                  <div className="vertical-bar-block">
                    {_this.state.live_chat_duration &&
                    _this.state.live_chat_duration.length > 0 ? (
                      <VerticalBarChartComponent
                        live_chat_duration={_this.state.live_chat_duration}
                        _this={_this}
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
                  </div>
                </div>
              </div>
            </Grid>
            <Grid hidden item lg={4} md={12} sm={12} xs={12}>
              <div className="performance_block">
                <p className="performance_title">
                  Lead to paid customer conversion
                </p>
                {/* <p className="performance_text">
                  Duis aute irure dolor in reprehenderit in volu
                </p> */}
                <div className="performance_box">
                  <div className="performance_progress">
                    <CircularProgressbar
                      value={40}
                      text={"40%"}
                      strokeWidth={13}
                      styles={buildStyles({
                        strokeLinecap: "butt",
                      })}
                    />
                  </div>
                  <div className="performance_labels">
                    <div>
                      <div className="converted"></div>
                      <p>Converted</p>
                    </div>
                    <div>
                      <div className="not_converted"></div>
                      <p>Not Converted</p>
                    </div>
                  </div>
                  <div className="chat_box">
                    <div>
                      <p className="live_chat_text">Lead</p>
                      <p className="live_chat_text">100</p>
                    </div>
                    <div>
                      <p className="live_chat_text">Paid customer</p>
                      <p className="live_chat_text">50</p>
                    </div>
                  </div>
                </div>
              </div>
            </Grid>

            <Grid item sm={12} xs={12} md={12} lg={8}>
              <div className="performance_block">
                <p className="performance_title">Drop off performance</p>
                <p className="performance_text">
                  End conversation triggered by whom
                </p>
                <div className="performance_box">
                  <div className="vertical-bar-block">
                    <Bar
                      data={[
                        { country: "Closed by visitor", "hot dogs": 18 },
                        { country: "Closed by agent", "hot dogs": 12 },
                        { country: "Unknown", "hot dogs": 3 },
                      ]}
                      width={557}
                      height={322}
                      maxValue={20}
                      padding={0.5}
                      margin={{ top: 30, right: 0, bottom: 30, left: 0 }}
                      indexBy="country"
                      keys={["hot dogs"]}
                      labelTextColor="inherit:darker(1.4)"
                      colors={"#17c7ba"}
                      enableGridX={false}
                      enableGridY={false}
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
                        legend: false,
                        tickSize: 0,
                        tickPadding: 5,
                        tickRotation: 0,
                      }}
                      axisLeft={null}
                      enableLabel={false}
                    />
                  </div>
                </div>
              </div>
            </Grid>
            <Grid hidden item lg={4} md={12} sm={12} xs={12}>
              <div className="performance_block">
                <p className="performance_title">Commission earned</p>
                {/* <p className="performance_text">
                  Duis aute irure dolor in reprehenderit in volu
                </p> */}
                <div className="performance_box">
                  <div>
                    <img src={grow} />
                    <p className="commission_text">
                      Commission earned per customer
                    </p>
                    <div className="dollar_box">
                      <p className="dollar_text">$16</p>
                      <p className="precent_text">
                        38%
                        <img src={arrowup} />
                      </p>
                    </div>
                  </div>
                  <div className="prec_line"></div>
                  <div>
                    <img src={grow} />
                    <p className="commission_text">Total earnings collected</p>
                    <div className="dollar_box">
                      <p className="dollar_text">$169</p>
                      <p className="precent_text">
                        38%
                        <img src={arrowup} />
                      </p>
                    </div>
                  </div>
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
        {_this.state.loading ? (
          <>
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

            {form}
          </>
        ) : (
          <>{form}</>
        )}
      </Fragment>
    );
  }
}

export default AgentPerformanceComponent;
