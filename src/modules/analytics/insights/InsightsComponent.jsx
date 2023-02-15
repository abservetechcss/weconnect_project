import React, { Component, Fragment } from "react";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import { Col, Nav, Row, Tab } from "react-bootstrap";
import { Pie } from "@nivo/pie";
import { Progress } from "react-sweet-progress";
import "react-sweet-progress/lib/style.css";
import check from "../../../assets/images/check-circle.svg";
import chart from "../../../assets/images/bar-chart-2.svg";
import InsightHeaderComponent from "../../common/InsightHeaderComponent";
import { getAdminChatBotList } from "../../agent/dashboard/server/DashboardServer.js";
import { getAllInsightList } from "./server/InsightServer.js";
import moment from "moment";
import { decryptBot } from "../../../js/encrypt";


export class InsightsComponent extends Component {
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
      botItemList: [],
      questionsList: [],
      conversionList: [],
      answerList: [],
    };
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    if (window.location.href.includes("?botId=")) {
      let data = window.location.href.split("?botId=")[1];
      var decryptedData = decryptBot(data);
      _this.setState({
        botId: decryptedData && decryptedData.botId,
        botName: decryptedData && decryptedData.botName
      });
      _this.fetchDataFromServer(decryptedData && decryptedData.botId);
    }
    getAdminChatBotList(
      _this,
      "",
      (res) => {
        _this.setState({ loading: false });
          let selectBot = res.selectedBot && res.selectedBot;
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
  fetchDataFromServer(id) {
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

    _this.setState({ loading: true, activeTab: 0 });
    getAllInsightList(
      _this,
      params,
      (res) => {
        let questionData = [],
          answerData = [],
          conversationData = [];
        if (!res.questions.includes("questions found")) {
          if (res.questions && res.questions.length > 0) {
            questionData = res.questions.map((prop, key) => {
              prop.key = key;
              prop.active = key === 0 ? true : false;
              return prop;
            });
          }
          if (Object.keys(res.answer) && Object.keys(res.answer).length > 0) {
            Object.keys(res.answer).map((prop, key) => {
              answerData.push({
                key: key,
                active: questionData[0].id == prop ? true : false,
                data: res.answer[prop],
                id: prop,
              });
            });
          }
          if (
            Object.keys(res.conversion) &&
            Object.keys(res.conversion).length > 0
          ) {
            Object.keys(res.conversion).map((prop, key) => {
              conversationData.push({
                key: key,
                active: questionData[0].id == prop ? true : false,
                data: res.conversion[prop],
                id: prop,
              });
            });
          }
        }
        _this.setState({
          questionsList: questionData,
          conversionList: conversationData,
          answerList: answerData,
          loading: false,
          activeTab: 0,
        });
      },
      () => {
        _this.setState({ loading: false, data: [] });
      }
    );
  }
  render() {
    let _this = this;

    let form = (
      <Fragment>
        <div className="chatbots_section">
          <InsightHeaderComponent
            _this={_this}
            filterDate={_this.state.filterDate}
            fetchDataFromServer={() => {
              _this.fetchDataFromServer();
            }}
            {..._this.props}
          />
          <div className="insights_section">
            <Tab.Container
              id="left-tabs-example"
              defaultActiveKey={_this.state.activeTab}
              value={_this.state.activeTab}
            >
              <div className="payment_history">
                <div className="payment_header">
                  <p>Questions</p>
                </div>
                {_this.state.questionsList &&
                _this.state.questionsList.length > 0 ? (
                  <Nav variant="pills" className="flex-column">
                    {_this.state.questionsList.map((prop, index) => {
                      return (
                        <Nav.Item>
                          <Nav.Link
                            onClick={() => {
                              _this.state.answerList &&
                                _this.state.answerList.length > 0 &&
                                _this.state.answerList.map((ans) => {
                                  if (ans.id == prop.id) {
                                    ans.active = true;
                                  } else {
                                    ans.active = false;
                                  }
                                  return ans;
                                });
                              _this.state.conversionList &&
                                _this.state.conversionList.length > 0 &&
                                _this.state.conversionList.map((cov) => {
                                  if (cov.id == prop.id) {
                                    cov.active = true;
                                  } else {
                                    cov.active = false;
                                  }
                                  return cov;
                                });
                              _this.setState({
                                activeTab: index,
                              });
                            }}
                            eventKey={prop.key}
                          >
                            <div className="pay_history_tabs">
                              <p
                                className="invoice_no"
                                dangerouslySetInnerHTML={{
                                  __html: prop.question,
                                }}
                              ></p>
                            </div>
                          </Nav.Link>
                        </Nav.Item>
                      );
                    })}
                  </Nav>
                ) : _this.state.loading ? 
                (
                  <div className="text-center alert alert-danger">
                    Loading...
                  </div>
                ) :
                (
                  <div className="text-center alert alert-danger">
                    No questions found!
                  </div>
                )}
              </div>
              <div className="insights_details">
                <Tab.Content>
                  <Tab.Pane eventKey={_this.state.activeTab}>
                    <div className="invoice_details">
                      <div className="invoice_header">
                        <p>Conversion</p>
                      </div>
                      {_this.state.conversionList &&
                      _this.state.conversionList.length > 0 ? (
                        _this.state.conversionList
                          .filter((x) => {
                            return x.active;
                          })
                          .map((prop1, key) => {
                            return (
                              <div className="conversation_box">
                                <div className="pie_chart_box">
                                  <Pie
                                    width={300}
                                    height={300}
                                    innerRadius={0.5}
                                    data={[
                                      {
                                        id: "Answered",
                                        label: "Answered",
                                        value: `${
                                          prop1.data && prop1.data.answered
                                        }`,
                                        color: "hsl(19, 70%, 50%)",
                                      },
                                      {
                                        id: "Dropped",
                                        label: "Dropped",
                                        value: `${
                                          prop1.data && prop1.data.dropped
                                        }`,
                                        color: "hsl(213, 70%, 50%)",
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
                                    colors={["#6A86E3", "#F1D25F", "#63500f"]}
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
                                        direction: "row",
                                        justify: false,
                                        translateX: 5,
                                        translateY: 35,
                                        itemsSpacing: 0,
                                        itemWidth: 90,
                                        itemHeight: 10,
                                        itemTextColor: "#999",
                                        itemDirection: "left-to-right",
                                        itemOpacity: 1,
                                        symbolSize: 15,
                                        symbolShape: "square",
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
                                </div>
                                <div className="chart_analysis_box">
                                  <img src={check} />
                                  <div>
                                    <p className="chart_title">
                                      {`${
                                        prop1.data && prop1.data.answered
                                      } Answered`}{" "}
                                    </p>
                                    <p className="chart_text">{`${
                                      prop1.data &&
                                      prop1.data.answered_in_percent
                                    } %`}</p>
                                  </div>
                                </div>
                                <div className="chart_analysis_box">
                                  <img src={chart} />
                                  <div>
                                    <p className="chart_title">
                                      {`${
                                        prop1.data && prop1.data.dropped
                                      }  Dropped`}{" "}
                                    </p>
                                    <p className="chart_text">
                                      {`${
                                        prop1.data &&
                                        prop1.data.dropped_in_percent
                                      } %`}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                      ) : _this.state.loading ? 
                      (
                        <div className="text-center alert alert-danger">
                          Loading...
                        </div>
                      ):
                      (
                        <div className="text-center alert alert-danger">
                          No conversion found!
                        </div>
                      )}
                    </div>
                    <div className="invoice_details">
                      <div className="invoice_header">
                        <p>Answer</p>
                      </div>
                      {_this.state.answerList &&
                      _this.state.answerList.length > 0 ? (
                        <div className="answer_box">
                          {_this.state.answerList
                            .filter((x) => {
                              return x.active;
                            })
                            .map((prop, key) => {
                              if (Array.isArray(prop.data)) {
                                return (
                                  prop.data &&
                                  prop.data.length > 0 &&
                                  prop.data.map((ans) => {
                                    return (
                                      <div>
                                        <p>
                                          {ans.name}
                                          {ans.count ? (
                                            <span>({ans.count})</span>
                                          ) : null}
                                        </p>
                                        {parseInt(ans.percentage) > 0 ? (
                                          <Progress
                                            percent={parseFloat(ans.percentage)}
                                          />
                                        ) : (
                                          <Progress percent={0} />
                                        )}
                                      </div>
                                    );
                                  })
                                );
                              } else {
                                return (
                                  <div>
                                    <p>
                                      {prop.data && prop.data.name}
                                      {prop.data && prop.data.count ? (
                                        <span>
                                          ({prop.data && prop.data.count})
                                        </span>
                                      ) : null}
                                    </p>
                                    {parseInt(
                                      prop.data && prop.data.percentage
                                    ) > 0 ? (
                                      <Progress
                                        percent={parseFloat(
                                          prop.data && prop.data.percentage
                                        )}
                                      />
                                    ) : (
                                      <Progress percent={0} />
                                    )}
                                  </div>
                                );
                              }
                            })}
                        </div>
                      ) : _this.state.loading ? 
                      (
                        <div className="text-center alert alert-danger">
                          Loading...
                        </div>
                      ) :
                      (
                        <div className="text-center alert alert-danger">
                          No answer found!
                        </div>
                      )}
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </div>
            </Tab.Container>
          </div>
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

InsightsComponent.propTypes = {};

export default InsightsComponent;
