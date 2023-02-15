import React, { Component, Fragment } from "react";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import { Link } from "react-router-dom";
import crossX from "../../../assets/images/x.svg";
import calendar from "../../../assets/images/calendar.svg";
import chatuser from "../../../assets/images/download.png";
import location from "../../../assets/images/map-pin.svg";
import monitor from "../../../assets/images/monitor.svg";
import link from "../../../assets/images/link.svg";
import logo from "../../../assets/images/Group 970.svg";
import CommonDateAndSearchWiseFilterComponent from "../../common/CommonDateAndSearchWiseFilterComponent.jsx";
import ChatHistoryMessageComponent from "./components/ChatHistoryMessageComponent.jsx";
import CommonPaginationComponent from "../../common/CommonPaginationComponent.jsx";
import { errorAlert } from "../../../js/alerts.js";
import { decryptBot } from "../../../js/encrypt";

import { getAdminChatBotList } from "../../agent/dashboard/server/DashboardServer.js";

import {
  getAnalyticsConversationList,
  getChatDetailsList,
  getSingleVisitorInfo,
  getAnalyticsConversationDownloadReport,
  getConversationSearchList,
  getMeetChatInfo,
} from "./server/ConversationServer.js";
import moment from "moment";
import { connect } from "react-redux";
import ChatListMessageComponent from "./components/ChatListMessageComponent";

export class AnalyticsConversationPageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      loading: false,
      botIdURL: null,
      page: 1,
      limit: 10,
      totalCount: 0,
      filterDate: [null, null],
      resultData: [],
      downloadResultData: [],
      data: [],
      questionsList: [],
      noDataList: "",
      columnsList: [],
      searchValue: "",
      showVisitorModal: false,
      showChatBotModal: false,
      setChatListModal: false,
      showPrintModal: false,
      showDownloadModal: false,
      showDownloadExcelReport: false,
      chatDetails: [],
      visitorDetails: {},
      vistor_id: null,
      downloadReportColumn: [],
      downloadReportList: [],
      chatListDetails: [],
      botId: null,
      clientId: null,
      botName: "",
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
          console.log(decryptedData);
          _this.setState(
            {
              botId: decryptedData && decryptedData.botId,
              botName: decryptedData && decryptedData.botName,
            },
            () => {
              _this.fetchDataFromServer();
              // _this.downloadConversationReport();
            }
          );
        } else {
          _this.fetchDataFromServer();
        }
      }
    );

    getAdminChatBotList(_this, "", (res) => {
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
      });
    });
  }

  fetchDataFromServer() {
    let _this = this;
    // debugger;
    const [startDate, endDate] = _this.state.filterDate;
    let botId = _this.state.botId;
    let params = "";
    if (startDate === null) {
      params = `botid=${botId}&duration=all&searchfilter=${_this.state.searchValue}&limit=${_this.state.limit}&page=${_this.state.page}`;
    } else {
      params = `botid=${botId}&startdate=${moment(startDate).format(
        "YYYY-MM-DD"
      )}&enddate=${moment(endDate).format(
        "YYYY-MM-DD"
      )}&duration=date&searchfilter=${_this.state.searchValue}&limit=${
        _this.state.limit
      }&page=${_this.state.page}`;
    }
    _this.setState({ loading: true });
    getAnalyticsConversationList(
      params,
      (res) => {
        // _this.setState({ loading: false });
        console.log(res);
        let columns = [];
        var parser = new DOMParser();
        if (res.questions && res.questions.length > 0) {
          columns = res.questions.map((ques, key) => {
            let doc = parser.parseFromString(
              `${Object.values(res.questions[key])[ques.question_id ? 1 : 0]}`,
              "text/html"
            );
            return {
              label: doc.body.innerText,
              name: `answer${key + 1}`,
              options: {
                filter: true,
                sort: false,
                customHeadLabelRender: (value) => {
                  if (ques.deleted === 1) {
                    return (
                      <div style={{ color: "red" }}>{value.label} (D)</div>
                    );
                  }
                  return value.label;
                },
                customBodyRender: (value) => {
                  return (
                    <>
                      {key === 2 || key === 1 ? (
                        value === "" ? (
                          "---"
                        ) : (
                          <Link
                            role="button"
                            to={"#"}
                            onClick={(e) => {
                              e.preventDefault();
                              if (key === 1) {
                                _this.fetchSingleVisitorInfo(
                                  _this.state.data[key - 1].answer3
                                );
                                _this.setState({
                                  vistor_id: value,
                                });
                              } else if (key === 2) {
                                _this.setState(
                                  {
                                    showChatBotModal: true,
                                    chatDetails: [],
                                    loading: true,
                                  },
                                  () => {
                                    _this.fetchChatIdDetails(value);
                                  }
                                );
                              }
                            }}
                          >
                            {value}
                          </Link>
                        )
                      ) : (
                        <div>{value === "" ? "---" : value}</div>
                      )}
                    </>
                  );
                },
              },
            };
          });
        }

        let questionLength = res.questions && res.questions.length - 1;
        let tempObj = [];
        if (res.answers !== "No conversations Found!!") {
          Object.keys(res.answers) &&
            Object.keys(res.answers).length > 0 &&
            Object.keys(res.answers).map((prop, key) => {
              tempObj.push({
                value: false,
                index: key,
                prop1: res.answers[prop],
              });
              // _this.setState({
              //   resultData: tempObj
              // });
              for (var i = 0; i <= questionLength; i++) {
                if (i <= questionLength) {
                  // let temp = _this.state.resultData;
                  tempObj[key][`answer${i + 1}`] = Array.isArray(
                    res.answers[prop][i]
                  ) ? (
                    res.answers[prop][i][0].includes("http://") ||
                    res.answers[prop][i][0].includes("https://") ? (
                      <a
                        rel="noreferrer"
                        role="button"
                        target={"_blank"}
                        href={`${res.answers[prop][i][0]}`}
                      >
                        Image
                      </a>
                    ) : (
                      res.answers[prop][i][0]
                    )
                  ) : (
                    "---"
                  );
                  // _this.setState({
                  //   resultData: temp
                  // });
                }
              }
            });
          _this.setState({
            resultData: tempObj,
            loading: false,
            data: tempObj,
            questionsList: res.questions,
            columnsList: columns,
            // downloadReportList: _this.state.downloadResultData,
            // downloadReportColumn: downloadColumns,
            totalCount: res.count,
          });
        } else {
          _this.setState({
            loading: false,
            data: [],
            questionsList: res.questions,
            columnsList: columns,
            // downloadReportList: _this.state.downloadResultData,
            // downloadReportColumn: downloadColumns,
            totalCount: 0,
          });
        }
      },
      () => {
        _this.setState({ loading: false, data: [] });
      }
    );
  }

  fetchAnalyticsSearchList(value) {
    let _this = this;
    console.log(value);
    _this._this.setState({
      searchValue: value,
    });
    if (value.length >= 1) {
      _this._this.setState(
        {
          loading: true,
        },
        () => {
          console.log(value);
          const [startDate, endDate] = _this._this.state.filterDate;
          let botId = _this._this.state.botId;
          let params = "";
          if (startDate === null) {
            //   params = `bot_id=${botId}&searchvalue=${value}&pagination=${_this._this.state.page}&totalFetch=${_this._this.state.limit}&duration=all`;
            params = `bot_id=${botId}&duration=all&searchvalue=${value}&page=${_this._this.state.page}&limit=${_this._this.state.limit}`;
          } else {
            params = `bot_id=${botId}&searchvalue=${value}&page=${
              _this._this.state.page
            }&limit=${_this._this.state.limit}&duration=date&startdate=${moment(
              startDate
            ).format("YYYY-MM-DD")}&enddate=${moment(endDate).format(
              "YYYY-MM-DD"
            )}`;
            // params = `bot_id=${botId}&searchvalue=${
            //   value
            // }&page=${_this._this.state.page}&limit=${
            //   _this._this.state.limit
            // }&duration=date&startdate=${moment(startDate).format(
            //   "YYYY-MM-DD"
            // )}&enddate=${moment(endDate).format("YYYY-MM-DD")}`;
          }
          getConversationSearchList(
            params,
            (res) => {
              // debugger;
              console.log(res);
              let columns = [];
              var parser = new DOMParser();
              if (res.questions && res.questions.length > 0) {
                columns = res.questions.map((ques, key) => {
                  let doc = parser.parseFromString(
                    `${
                      Object.values(res.questions[key])[
                        ques.question_id ? 1 : 0
                      ]
                    }`,
                    "text/html"
                  );
                  return {
                    label: doc.body.innerText,
                    name: `answer${key + 1}`,
                    options: {
                      filter: true,
                      sort: false,
                      customHeadLabelRender: (value) => {
                        if (ques.deleted === 1) {
                          return (
                            <div style={{ color: "red" }}>
                              {value.label} (D)
                            </div>
                          );
                        }
                        return value.label;
                      },
                      customBodyRender: (value) => {
                        return (
                          <>
                            {key === 2 || key === 1 ? (
                              value === "" ? (
                                "---"
                              ) : (
                                <Link
                                  role="button"
                                  to={"#"}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    if (key === 1) {
                                      _this.fetchSingleVisitorInfo(
                                        _this._this.state.data[key - 1].answer3
                                      );
                                      _this._this.setState({
                                        vistor_id: value,
                                      });
                                    } else if (key === 2) {
                                      _this._this.setState(
                                        {
                                          showChatBotModal: true,
                                          chatDetails: [],
                                          loading: true,
                                        },
                                        () => {
                                          _this.fetchChatIdDetails(value);
                                        }
                                      );
                                    }
                                  }}
                                >
                                  {value}
                                </Link>
                              )
                            ) : (
                              <div>{value === "" ? "---" : value}</div>
                            )}
                          </>
                        );
                      },
                    },
                  };
                });
              }

              let questionLength = res.questions && res.questions.length - 1;
              let tempObj = [];
              if (res.answers !== "No conversations Found!!") {
                Object.keys(res.answers) &&
                  Object.keys(res.answers).length > 0 &&
                  Object.keys(res.answers).map((prop, key) => {
                    tempObj.push({
                      value: false,
                      index: key,
                      prop1: res.answers[prop],
                    });
                    // _this._this.setState({
                    //   resultData: tempObj
                    // });
                    for (var i = 0; i <= questionLength; i++) {
                      if (i <= questionLength) {
                        // let temp = _this._this.state.resultData;
                        tempObj[key][`answer${i + 1}`] = Array.isArray(
                          res.answers[prop][i]
                        ) ? (
                          res.answers[prop][i][0].includes("http://") ||
                          res.answers[prop][i][0].includes("https://") ? (
                            <a
                              rel="noreferrer"
                              role="button"
                              target={"_blank"}
                              href={`${res.answers[prop][i][0]}`}
                            >
                              Image
                            </a>
                          ) : (
                            res.answers[prop][i][0]
                          )
                        ) : (
                          "---"
                        );
                        // _this._this.setState({
                        //   resultData: temp
                        // });
                      }
                    }
                  });
                _this._this.setState({
                  resultData: tempObj,
                  loading: false,
                  data: tempObj,
                  questionsList: res.questions,
                  columnsList: columns,
                  // downloadReportList: _this.state.downloadResultData,
                  // downloadReportColumn: downloadColumns,
                  totalCount: res.count,
                });
              } else {
                _this._this.setState({
                  loading: false,
                  data: [],
                  noDataList: res.answers,
                  questionsList: res.questions,
                  columnsList: columns,
                  // downloadReportList: _this.state.downloadResultData,
                  // downloadReportColumn: downloadColumns,
                  totalCount: 0,
                });
              }
            },
            () => {
              _this._this.setState({ loading: false, data: [] });
            }
          );
        }
      );
    } else {
      _this.fetchDataFromServer();
    }
  }

  downloadConversationReport(value) {
    let _this = this;
    let botId = _this.state.botId;
    let params = "";
    params = `botid=${botId}&duration=all`;
    _this.setState({ loading: true });
    getAnalyticsConversationDownloadReport(
      params,
      (res) => {
        if (value === "print") {
          _this.setState({
            showPrintModal: true,
          });
        } else if (value === "download") {
          _this.setState({
            showDownloadModal: true,
          });
        } else if (value === "downloadExcel") {
          _this.setState({
            showDownloadExcelReport: true,
          });
        }
        _this.setState({ loading: false });
        let downloadColumns = [];
        let tempObj = [];
        let temp = [];
        var parser = new DOMParser();
        if (res.questions && res.questions.length > 0) {
          downloadColumns = res.questions.map((ques, key) => {
            let queStr = `${
              Object.values(res.questions[key])[ques.question_id ? 1 : 0]
            }`;
            let doc = parser.parseFromString(`${queStr}`, "text/html");
            return {
              displayName:
                doc.body.innerText && doc.body.innerText.includes("\n")
                  ? doc.body.innerText.substring(
                      0,
                      doc.body.innerText.length - 1
                    )
                  : doc.body.innerText,
              id: `answer${key + 1}`,
            };
          });
        }
        let questionLength = res.questions && res.questions.length - 1;

        if (res.all_answers !== "No conversations!!") {
          if (
            Object.keys(res.all_answers) &&
            Object.keys(res.all_answers).length > 0
          ) {
            Object.keys(res.all_answers) &&
              Object.keys(res.all_answers).length > 0 &&
              Object.keys(res.all_answers).map((prop, key) => {
                tempObj.push({});
                _this.setState({
                  downloadResultData: tempObj,
                });

                for (var i = 0; i <= questionLength; i++) {
                  if (i <= questionLength) {
                    temp = _this.state.downloadResultData;
                    temp[key][`answer${i + 1}`] = Array.isArray(
                      res.all_answers[prop][i]
                    )
                      ? res.all_answers[prop][i][0] !== "" &&
                        res.all_answers[prop][i][0] !== undefined
                        ? res.all_answers[prop][i][0]
                        : "---"
                      : "---";
                  }
                }
              });
            _this.setState({
              downloadResultData: temp,
            });
          }

          _this.setState({
            loading: false,
            downloadReportList: _this.state.downloadResultData,
            downloadReportColumn: downloadColumns,
          });
        } else {
          errorAlert("No data found.", _this);
          _this.setState({
            loading: false,
            downloadReportList: _this.state.downloadResultData,
            downloadReportColumn: downloadColumns,
          });
        }
      },
      () => {
        _this.setState({ loading: false, data: [] });
      }
    );
  }
  fetchChatIdDetails = (id) => {
    let _this = this;
    let botId = _this.state.botId;
    let params = `botid=${botId}&clientid=${id}`;
    _this.setState({
      clientId: id,
    });
    // _this.setState({
    //   showChatBotModal: true,
    //   loading: true,
    //   chatDetails:[]
    // });
    getChatDetailsList(
      params,
      (res) => {
        _this.setState({
          loading: false,
        });
        let tempObj = [];
        let newObj = [];
        var uniqueDates = [];
        if (res.chatDetails !== "No conversations Found!!") {
          Object.keys(res.chatDetails) &&
            Object.keys(res.chatDetails).length > 0 &&
            Object.keys(res.chatDetails).map((prop, key) => {
              var days = 0;
              var endDate = new Date();
              let today = new Date();
              for (var i = 0; i < res.chatDetails[prop].length; i++) {
                if (i === 0) {
                  if (moment(res.chatDetails[prop][0].date)) {
                    today = new Date(res.chatDetails[prop][i].date);
                    var distance = endDate.getTime() - today.getTime();
                    days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    let TimeArray = res.chatDetails[prop][i].time.split(":");
                    today.setHours(parseInt(TimeArray[0]));
                    today.setMinutes(parseInt(TimeArray[1]));
                    today.setSeconds(parseInt(TimeArray[2]));
                  }
                }

                if (i !== 0) {
                  uniqueDates.push(today);
                  if (
                    res.chatDetails[prop][i].question !== undefined &&
                    res.chatDetails[prop][i].answer !== undefined
                  ) {
                    let obj = {
                      showDateFilter:
                        days === 0
                          ? "Today"
                          : days === 1
                          ? "Yesterday"
                          : "Other",
                      questions: res.chatDetails[prop][i].question,
                      videomessage: res.chatDetails[prop][i]?.videomessage
                        ? res.chatDetails[prop][i]?.videomessage
                        : "",
                      datetime: today,
                      days: days,
                      key: i,
                      answer:
                        res.chatDetails[prop][i].answer.includes("http://") ||
                        res.chatDetails[prop][i].answer.includes("https://") ? (
                          <a
                            role="button"
                            target={"_blank"}
                            href={`${res.chatDetails[prop][i].answer}`}
                            rel="noreferrer"
                          >
                            Image
                          </a>
                        ) : (
                          res.chatDetails[prop][i].answer
                        ),
                      time: res.chatDetails[prop][i].time,
                      prop1: res.chatDetails[prop],
                    };
                    if (res.chatDetails[prop][i]?.answer !== "Video Chat") {
                      delete obj.videomessage;
                    }
                    tempObj.push(obj);
                  } else {
                    if (res.chatDetails[prop][i].question !== undefined) {
                      let obj1 = {
                        showDateFilter:
                          days === 0
                            ? "Today"
                            : days === 1
                            ? "Yesterday"
                            : "Other",
                        questions: res.chatDetails[prop][i].question,
                        videomessage: res.chatDetails[prop][i]?.videomessage
                          ? res.chatDetails[prop][i]?.videomessage
                          : "",
                        datetime: today,
                        days: days,
                        answer: "",
                        key: i,
                        time: res.chatDetails[prop][i].time,
                        prop1: res.chatDetails[prop],
                      };
                      if (res.chatDetails[prop][i]?.answer !== "Video Chat") {
                        delete obj1.videomessage;
                      }
                      tempObj.push(obj1);
                    } else {
                      if (res.chatDetails[prop][i].answer !== undefined) {
                        let obj2 = {
                          showDateFilter:
                            days === 0
                              ? "Today"
                              : days === 1
                              ? "Yesterday"
                              : "Other",
                          questions: "",
                          videomessage: res.chatDetails[prop][i]?.videomessage
                            ? res.chatDetails[prop][i]?.videomessage
                            : "",
                          datetime: today,
                          days: days,
                          answer: res.chatDetails[prop][i].answer,
                          key: i,
                          time: res.chatDetails[prop][i].time,
                          prop1: res.chatDetails[prop],
                        };
                        if (res.chatDetails[prop][i]?.answer !== "Video Chat") {
                          delete obj2.videomessage;
                        }
                        tempObj.push(obj2);
                      }
                    }
                  }
                }
              }
            });
          let uniqueResult = [];
          if (uniqueDates && uniqueDates.length > 0) {
            uniqueResult = [...new Set(uniqueDates)];
          }
          uniqueResult &&
            uniqueResult.length > 0 &&
            uniqueResult.map((prop) => {
              let uniqueData = tempObj.filter((x) => {
                return (
                  new Date(x.datetime).getTime() === new Date(prop).getTime()
                );
              });
              newObj.push({
                data: uniqueData,
              });
            });
        }
        console.log(newObj);
        _this.setState({
          loading: false,
          chatDetails: newObj,
        });
      },
      () => {
        _this.setState({
          loading: false,
        });
      }
    );
  };
  fetchSingleVisitorInfo = (id) => {
    let _this = this;
    _this.setState({
      loading: true,
      showVisitorModal: true,
      visitorDetails: {},
    });
    let params = `visitorid=${id}`;
    // setTimeout(
    //   () =>
    //     _this.setState({
    //       loading: false
    //     }),
    //   4000
    // );
    getSingleVisitorInfo(
      params,
      (res) => {
        _this.setState({
          loading: false,
        });
        if (res.visitorDetails) {
          _this.setState({
            loading: false,
            visitorDetails: res.visitorDetails,
          });
        }
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };

  handleMeetDetails(clientId) {
    let _this = this._this;
    let params = `client_id=${clientId}`;
    // let params = `client_id=454-299-8cbeaf2480`;
    getMeetChatInfo(
      params,
      (res) => {
        _this.setState({
          setChatListModal: true,
        });
        console.log(res);
        _this.setState({
          chatListDetails: res.chatlist,
        });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  render() {
    let _this = this;
    const options = {
      filter: false,
      filterType: "checkbox",
      download: false,
      print: false,
      viewColumns: false,
      search: false,
      selectableRows: "none",
      responsive: "vertical",
      pagination: false,
      rowsPerPage: 10,
      rowsPerPageOptions: [5, 10, 25, 50],
      textLabels: {
        body: {
          noMatch: _this.state.loading
            ? "Loading..."
            : _this.state.noDataList
            ? _this.state.noDataList
            : "No conversations!",
        },
      },
    };
    let form = (
      <Fragment>
        <div className="analytics_lead_section chatbots_section">
          {_this.state.botItemList && _this.state.botItemList.length > 0 ? (
            <CommonDateAndSearchWiseFilterComponent
              {..._this.props}
              _this={_this}
              showBotList={true}
              botItemList={_this.state.botItemList}
              botId={_this.state.botId}
              botName={_this.state.botName}
              searchValue={_this.state.searchValue}
              filterDate={_this.state.filterDate}
              downloadReportList={_this.state.downloadReportList}
              downloadReportColumn={_this.state.downloadReportColumn}
              showPrintModal={_this.state.showPrintModal}
              showDownloadModal={_this.state.showDownloadModal}
              showDownloadExcelReport={_this.state.showDownloadExcelReport}
              downloadConversationReport={(value) => {
                _this.downloadConversationReport(value);
              }}
              fetchAnalyticsSearchList={this.fetchAnalyticsSearchList}
              fetchDataFromServer={() => {
                _this.fetchDataFromServer();
              }}
            />
          ) : null}

          <MUIDataTable
            title={""}
            data={_this.state.data}
            columns={_this.state.columnsList}
            options={options}
            className="lead_table disable-hover check-disable-height"
            // className="lead_table disable-hover "
          />

          <CommonPaginationComponent
            _this={_this}
            page={_this.state.page}
            limit={_this.state.limit}
            pages={Math.ceil(_this.state.totalCount / _this.state.limit)}
            totalCount={_this.state.totalCount}
            filterData={_this.state.filterData}
            selectFilter={_this.state.selectFilter}
            fetchDataFromServer={() => {
              _this.fetchDataFromServer();
            }}
            {..._this.props}
          />
          <Dialog
            open={_this.state.showVisitorModal}
            onClose={() => {
              _this.setState({
                showVisitorModal: false,
              });
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className="knowdledge-base-folder-model-popup-block analytics-visitor-popup"
          >
            <span className="cross-icon-block">
              <IconButton
                onClick={() => {
                  _this.setState({
                    showVisitorModal: false,
                  });
                }}
              >
                <img src={crossX} alt="" />
              </IconButton>
            </span>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <div className="visitor_header">
                  <div className="d-flex align-items-center">
                    <div className="visitor_avtar">V</div>
                    <div>
                      <p className="visitor_name">
                        {_this.state.visitorDetails &&
                          _this.state.visitorDetails.visitorid}
                      </p>
                      <p className="visitor_subtext">
                        User{" "}
                        {_this.state.visitorDetails &&
                        _this.state.visitorDetails.status === "closed"
                          ? "offline"
                          : "active"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="visitir_data_section">
                  <div className="user_data_box">
                    <p className="note_title">User data</p>
                  </div>
                  <div className="user_details">
                    <div>
                      <img alt="" src={calendar} />
                      <div>
                        <p className="user_detail_title">
                          {_this.state.visitorDetails &&
                          _this.state.visitorDetails.conversationdate
                            ? moment(
                                _this.state.visitorDetails.conversationdate
                              ).format("DD MMM, yyyy")
                            : null}
                        </p>
                        <p className="user_detail_text">Conversation date</p>
                      </div>
                    </div>
                    <div>
                      <img alt="" src={location} />
                      <div>
                        <p className="user_detail_title">
                          {_this.state.visitorDetails &&
                            _this.state.visitorDetails.origincountry}
                        </p>
                        <p className="user_detail_text">Origin Country</p>
                      </div>
                    </div>
                    <div>
                      <img alt="" src={monitor} />
                      <div>
                        <p className="user_detail_title">{`${
                          _this.state.visitorDetails &&
                          _this.state.visitorDetails.browser
                        } / ${
                          _this.state.visitorDetails &&
                          _this.state.visitorDetails.operating_sys
                        }`}</p>
                        <p className="user_detail_text">{`Browser / ${
                          _this.state.visitorDetails &&
                          _this.state.visitorDetails.operating_sys
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
                              _this.state.visitorDetails &&
                              _this.state.visitorDetails.sourceurl
                            }
                            rel="noreferrer"
                          >
                            {_this.state.visitorDetails &&
                              _this.state.visitorDetails.sourceurl}
                          </a>
                        </p>
                        <p className="user_detail_text">Source Url</p>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContentText>
            </DialogContent>
          </Dialog>

          <Dialog
            open={_this.state.showChatBotModal}
            onClose={() => {
              _this.setState({
                showChatBotModal: false,
              });
            }}
            scroll="paper"
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            className="chatid-modal-block"
          >
            <DialogTitle id="scroll-dialog-title">
              <img src={chatuser} alt="" />
              WeConnect.chat
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
                <ChatHistoryMessageComponent
                  {..._this.props}
                  _this={_this}
                  clientId={_this.state.clientId}
                  loading={_this.state.loading}
                  chatDetails={_this.state.chatDetails}
                  handleMeetDetails={_this.handleMeetDetails}
                />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <a
                href={process.env.REACT_APP_BASE_URL}
                target="_blank"
                rel="noreferrer"
                style={{ color: "initial" }}
              >
                powered by
                <img src={logo} alt="" />
              </a>
            </DialogActions>
          </Dialog>

          <Dialog
            open={_this.state.setChatListModal}
            onClose={() => {
              _this.setState({
                setChatListModal: false,
              });
            }}
            scroll="paper"
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            className="chatid-modal-block"
          >
            <DialogTitle id="scroll-dialog-title">
              <img src={chatuser} alt="" />
              WeConnect.chat
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="scroll-dialog-description" tabIndex={-1}>
                <ChatListMessageComponent
                  {..._this.props}
                  _this={_this}
                  chatListDetails={_this.state.chatListDetails}
                />
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <a
                href={process.env.REACT_APP_BASE_URL}
                target="_blank"
                rel="noreferrer"
                style={{ color: "initial" }}
              >
                powered by
                <img src={logo} alt="" />
              </a>
            </DialogActions>
          </Dialog>
        </div>
      </Fragment>
    );
    return (
      <Fragment>
        {this.state.alert}
        {this.state.loading && (
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
          </>
        )}
        {form}
      </Fragment>
    );
  }
}
const mapStateToProps = (state) => ({
  selectBotList: state.getSelectBotIdDetails.selectBotList,
});

export default connect(
  mapStateToProps,
  null
)(AnalyticsConversationPageComponent);
