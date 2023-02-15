import React, { Component, Fragment } from "react";
import MUIDataTable from "mui-datatables";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import moment from "moment";
import logo from "../../../assets/images/Group 970.svg";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { connect } from "react-redux";
import CommonDateAndSearchWiseFilterComponent from "../../common/CommonDateAndSearchWiseFilterComponent.jsx";
import CommonPaginationComponent from "../../common/CommonPaginationComponent.jsx";
import ChatHistoryMessageComponent from "./components/ChatHistoryMessageComponent.jsx";
import { Link } from "react-router-dom";
import chatuser from "../../../assets/images/download.png";

import {
  getUserLeadsList,
  getChatDetailsList,
} from "./server/UserLeadsServer.js";
import { decryptBot } from "../../../js/encrypt";
import { MittContext } from "../../common/WebSocketComponent";

export class UserLeadsComponent extends Component {
  static contextType = MittContext;
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      botIdURL: null,
      loading: false,
      loading_list: false,
      filterDate: [null, null],
      resultData: [],
      page: 1,
      limit: 10,
      totalCount: 0,
      data: [],
      lead_columnsList: [],
      columnsList: [],
      searchValue: "",
      conditionalOperator: "or",
      showChatBotModal: false,
      chatDetails: [],
      applyFilter: [
        {
          key: 0,
          columnName: null,
          rule: null,
          value: "",
          position: null,
          conditionalOperator: "or",
        },
      ],
    };
  }

  componentDidUpdate(prevProps) {
    let _this = this;
    if (this.props.leads !== prevProps.leads) {
      _this.fetchDataFromServer();
    }
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    var currentDate = new Date();
    var startDate = new Date(currentDate.setDate(currentDate.getDate() - 30));
    let endDate = new Date();
    _this.setState(
      {
        filterDate: [startDate, endDate],
      },
      () => {
        if (window.location.href.includes("?botId=")) {
          let data = window.location.href.split("?botId=")[1];
          var decryptedData = decryptBot(data);
          _this.setState(
            { botIdURL: decryptedData && decryptedData.botId },
            () => {
              _this.fetchDataFromServer();
            }
          );
        } else {
          _this.fetchDataFromServer();
        }
      }
    );
  }

  fetchDataFromServer = () => {
    let _this = this;
    const [startDate, endDate] = _this.state.filterDate;
    let params = "";
    if (
      _this.state.botIdURL === null ||
      window.location.href.includes("/user/leads")
    ) {
      if (startDate === null) {
        params = `leadlist?duration=all&mode_type=${_this.props.leads}&searchfilter=${_this.state.searchValue}&limit=${_this.state.limit}&page=${_this.state.page}`;
      } else {
        params = `leadlist?startdate=${moment(startDate).format(
          "YYYY-MM-DD"
        )}&enddate=${moment(endDate).format("YYYY-MM-DD")}&mode_type=${
          _this.props.leads
        }&duration=date&searchfilter=${_this.state.searchValue}&limit=${
          _this.state.limit
        }&page=${_this.state.page}`;
      }
    }
    _this.setState({
      loading_list: true,
    });

    getUserLeadsList(
      params,
      (res) => {
        _this.setState({ loading_list: false });
        let columns = [];
        var parser = new DOMParser();
        if (res.lead_columns && res.lead_columns.length > 0) {
          columns = res.lead_columns.map((col, key) => {
            let doc = parser.parseFromString(
              `${Object.values(col)}`,
              "text/html"
            );
            return {
              label: doc.body.innerText,
              name: `answer${key + 1}`,
              value: `answer${key + 1}`,
              position: key,
              options: {
                filter: true,
                sort: true,
                customBodyRender: (value) => {
                  return (
                    <>
                      {Object.values(col) == "Chat ID" ? (
                        value === "" || value === "---" ? (
                          "---"
                        ) : (
                          <Link
                            role="button"
                            onClick={() => {
                              _this.fetchChatIdDetails(value);
                            }}
                          >
                            {value}
                          </Link>
                        )
                      ) : (
                        <div>{value === null ? "---" : value}</div>
                      )}
                    </>
                  );
                },
              },
            };
          });
        }
        let lead_columnsLength =
          res.lead_columns && res.lead_columns.length - 1;
        let tempObj = [];
        if (res.lead_answers !== "No Leads Found!") {
          Object.keys(res.lead_answers) &&
            Object.keys(res.lead_answers).length > 0 &&
            Object.keys(res.lead_answers).map((prop, key) => {
              tempObj.push({
                value: false,
                index: key,
                prop1: res.lead_answers[prop],
              });
              for (var i = 0; i <= lead_columnsLength; i++) {
                if (i <= lead_columnsLength) {
                  tempObj[key][`answer${i + 1}`] = Array.isArray(
                    res.lead_answers[prop]
                  )
                    ? res.lead_answers[prop][i] !== undefined
                      ? Object.values(res.lead_answers[prop][i])[0] !== ""
                        ? Object.values(res.lead_answers[prop][i])[0]
                        : "---"
                      : "---"
                    : "---";
                }
              }
            });
          _this.setState({
            resultData: tempObj,
            loading_list: false,
            data: tempObj,
            lead_columnsList: res.lead_columns,
            columnsList: columns,
            totalCount: res.count === undefined ? 0 : res.count,
          });
        } else {
          _this.setState({
            resultData: [],
            loading_list: false,
            data: [],
            lead_columnsList: res.lead_columns,
            columnsList: columns,
            totalCount: 0,
          });
        }
      },
      () => {
        _this.setState({ loading_list: false });
      }
    );
  };
  fetchChatIdDetails = (id) => {
    let _this = this;
    let botId = _this.state.botIdURL;
    let params = `botid=${botId}&clientid=${id}`;
    _this.setState({
      showChatBotModal: true,
      loading: true,
      chatDetails: [],
    });
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
                    tempObj.push({
                      showDateFilter:
                        days === 0
                          ? "Today"
                          : days === 1
                          ? "Yesterday"
                          : "Other",
                      questions: res.chatDetails[prop][i].question,
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
                    });
                  } else {
                    if (res.chatDetails[prop][i].question !== undefined) {
                      tempObj.push({
                        showDateFilter:
                          days === 0
                            ? "Today"
                            : days === 1
                            ? "Yesterday"
                            : "Other",
                        questions: res.chatDetails[prop][i].question,
                        datetime: today,
                        days: days,
                        answer: "",
                        key: i,
                        time: res.chatDetails[prop][i].time,
                        prop1: res.chatDetails[prop],
                      });
                    } else {
                      if (res.chatDetails[prop][i].answer !== undefined) {
                        tempObj.push({
                          showDateFilter:
                            days === 0
                              ? "Today"
                              : days === 1
                              ? "Yesterday"
                              : "Other",
                          questions: "",
                          datetime: today,
                          days: days,
                          answer: res.chatDetails[prop][i].answer,
                          key: i,
                          time: res.chatDetails[prop][i].time,
                          prop1: res.chatDetails[prop],
                        });
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
  fetchApplyFilterDataFromServer = () => {
    let _this = this;
    let conditionalOperator = _this.state.conditionalOperator;

    let ApplyFilterLength =
      _this.state.applyFilter &&
      _this.state.applyFilter.filter((x) => {
        return x.columnName !== null && x.rule !== null;
      }).length;
    const [startDate, endDate] = _this.state.filterDate;
    let botId = _this.props.selectBotList && _this.props.selectBotList.botId;
    let params = "";
    if (
      _this.props.selectBotList === undefined ||
      window.location.href.includes("/user/leads")
    ) {
      if (startDate === null) {
        // params = `leadlist?mode_type=${_this.props.leads}&duration=all&searchfilter=${_this.state.searchValue}`;
        params = `leadlist?`;
        _this.state.applyFilter.map((filter, f) => {
          params += `value[${filter.key}]=${filter.value}&jump_to_question[${filter.key}]=${filter.columnName}&id[${filter.key}]=${filter.position}&condition[${filter.key}]=${filter.conditionalOperator}&`;
        });
        params += `duration=all`;
      } else {
        // params = `leadlist?mode_type=${_this.props.leads}&startdate=${moment(
        //   startDate
        // ).format("YYYY-MM-DD")}&enddate=${moment(endDate).format(
        //   "YYYY-MM-DD"
        // )}&duration=date&searchfilter=${_this.state.searchValue}`;
        params = `leadlist?`;
        _this.state.applyFilter.map((filter, f) => {
          params += `value[${filter.key}]=${filter.value}&jump_to_question[${filter.key}]=${filter.columnName}&id[${filter.key}]=${filter.position}&condition[${filter.key}]=${filter.conditionalOperator}&`;
        });
        params += `startdate=${moment(startDate).format(
          "YYYY-MM-DD"
        )}&enddate=${moment(endDate).format("YYYY-MM-DD")}&duration=date`;
      }
    } else {
      params = `leadlist?mode_type=${_this.props.leads}&botid=${botId}&duration=all`;
    }
    if (
      _this.state.applyFilter &&
      _this.state.applyFilter.filter((x) => {
        return x.columnName !== null && x.rule !== null;
      }).length > 0
    ) {
      _this.setState({
        loading: true,
      });
      getUserLeadsList(
        params,
        (res) => {
          console.log(res);
          _this.setState({ loading: false });
          let columns = [];
          if (res.lead_columns && res.lead_columns.length > 0) {
            columns = res.lead_columns.map((col, key) => {
              return {
                label: Object.values(col),
                name: `answer${key + 1}`,
                value: `answer${key + 1}`,
                position: key,
                options: {
                  filter: true,
                  sort: true,
                  customBodyRender: (value) => {
                    return (
                      <>
                        <div>{value === "" ? "---" : value}</div>
                      </>
                    );
                  },
                },
              };
            });
          }
          let lead_columnsLength =
            res.lead_columns && res.lead_columns.length - 1;
          let tempObj = [];
          if (res.lead_answers !== "No Leads Found!") {
            Object.keys(res.lead_answers) &&
              Object.keys(res.lead_answers).length > 0 &&
              Object.keys(res.lead_answers).map((prop, key) => {
                tempObj.push({
                  value: false,
                  index: key,
                  prop1: res.lead_answers[prop],
                });
                for (var i = 0; i <= lead_columnsLength; i++) {
                  if (i <= lead_columnsLength) {
                    let temp = _this.state.resultData;
                    temp[key][`answer${i + 1}`] = Array.isArray(
                      res.lead_answers[prop]
                    )
                      ? res.lead_answers[prop][i]
                      : "---";
                  }
                }
              });

            if (ApplyFilterLength > 0) {
              let temp = tempObj;
              tempObj = [];

              if (ApplyFilterLength === 1) {
                tempObj = temp.filter((x, index) => {
                  if (_this.state.applyFilter[0].rule === "contains") {
                    return x.prop1[
                      _this.state.applyFilter[0].position
                    ].includes(_this.state.applyFilter[0].value);
                  } else if (
                    _this.state.applyFilter[0].rule === "doesn't contains"
                  ) {
                    return !x.prop1[
                      _this.state.applyFilter[0].position
                    ].includes(_this.state.applyFilter[0].value);
                  } else if (_this.state.applyFilter[0].rule === "equals") {
                    return (
                      x.prop1[_this.state.applyFilter[0].position] ===
                      _this.state.applyFilter[0].value
                    );
                  } else if (_this.state.applyFilter[0].rule === "not equals") {
                    return (
                      x.prop1[_this.state.applyFilter[0].position] !==
                      _this.state.applyFilter[0].value
                    );
                  } else if (_this.state.applyFilter[0].rule === "is empty") {
                    return (
                      x.prop1[_this.state.applyFilter[0].position] === "" ||
                      x.prop1[_this.state.applyFilter[0].position] === null
                    );
                  } else if (
                    _this.state.applyFilter[0].rule === "is not empty"
                  ) {
                    return (
                      x.prop1[_this.state.applyFilter[0].position] !== "" &&
                      x.prop1[_this.state.applyFilter[0].position] !== null
                    );
                  }
                });
              } else if (ApplyFilterLength === 2) {
                tempObj = temp.filter((x, index) => {
                  if (_this.state.applyFilter[1].conditionalOperator === "or") {
                    return (
                      x.prop1[_this.state.applyFilter[0].position] ===
                        _this.state.applyFilter[0].value ||
                      x.prop1[_this.state.applyFilter[1].position] ===
                        _this.state.applyFilter[1].value
                    );
                  } else {
                    return (
                      x.prop1[_this.state.applyFilter[0].position] ===
                        _this.state.applyFilter[0].value &&
                      x.prop1[_this.state.applyFilter[1].position] ===
                        _this.state.applyFilter[1].value
                    );
                  }
                });
              } else if (ApplyFilterLength === 3) {
                tempObj = temp.filter((x, index) => {
                  if (conditionalOperator === "or") {
                    return (
                      x.prop1[_this.state.applyFilter[0].position] ===
                        _this.state.applyFilter[0].value ||
                      x.prop1[_this.state.applyFilter[1].position] ===
                        _this.state.applyFilter[1].value ||
                      x.prop1[_this.state.applyFilter[2].position] ===
                        _this.state.applyFilter[2].value
                    );
                  } else {
                    return (
                      x.prop1[_this.state.applyFilter[0].position] ===
                        _this.state.applyFilter[0].value &&
                      x.prop1[_this.state.applyFilter[1].position] ===
                        _this.state.applyFilter[1].value &&
                      x.prop1[_this.state.applyFilter[2].position] ===
                        _this.state.applyFilter[2].value
                    );
                  }
                });
              } else if (ApplyFilterLength === 4) {
                tempObj = temp.filter((x, index) => {
                  if (conditionalOperator === "or") {
                    return (
                      x.prop1[_this.state.applyFilter[0].position] ===
                        _this.state.applyFilter[0].value ||
                      x.prop1[_this.state.applyFilter[1].position] ===
                        _this.state.applyFilter[1].value ||
                      x.prop1[_this.state.applyFilter[2].position] ===
                        _this.state.applyFilter[2].value ||
                      x.prop1[_this.state.applyFilter[3].position] ===
                        _this.state.applyFilter[3].value
                    );
                  } else {
                    return (
                      x.prop1[_this.state.applyFilter[0].position] ===
                        _this.state.applyFilter[0].value &&
                      x.prop1[_this.state.applyFilter[1].position] ===
                        _this.state.applyFilter[1].value &&
                      x.prop1[_this.state.applyFilter[2].position] ===
                        _this.state.applyFilter[2].value &&
                      x.prop1[_this.state.applyFilter[3].position] ===
                        _this.state.applyFilter[3].value
                    );
                  }
                });
              } else if (ApplyFilterLength === 5) {
                tempObj = temp.filter((x, index) => {
                  if (conditionalOperator === "or") {
                    return (
                      x.prop1[_this.state.applyFilter[0].position] ===
                        _this.state.applyFilter[0].value ||
                      x.prop1[_this.state.applyFilter[1].position] ===
                        _this.state.applyFilter[1].value ||
                      x.prop1[_this.state.applyFilter[2].position] ===
                        _this.state.applyFilter[2].value ||
                      x.prop1[_this.state.applyFilter[3].position] ===
                        _this.state.applyFilter[3].value ||
                      x.prop1[_this.state.applyFilter[4].position] ===
                        _this.state.applyFilter[4].value
                    );
                  } else {
                    return (
                      x.prop1[_this.state.applyFilter[0].position] ===
                        _this.state.applyFilter[0].value &&
                      x.prop1[_this.state.applyFilter[1].position] ===
                        _this.state.applyFilter[1].value &&
                      x.prop1[_this.state.applyFilter[2].position] ===
                        _this.state.applyFilter[2].value &&
                      x.prop1[_this.state.applyFilter[3].position] ===
                        _this.state.applyFilter[3].value &&
                      x.prop1[_this.state.applyFilter[4].position] ===
                        _this.state.applyFilter[4].value
                    );
                  }
                });
              } else if (ApplyFilterLength === 6) {
                tempObj = temp.filter((x, index) => {
                  if (conditionalOperator === "or") {
                    return (
                      x.prop1[_this.state.applyFilter[0].position] ===
                        _this.state.applyFilter[0].value ||
                      x.prop1[_this.state.applyFilter[1].position] ===
                        _this.state.applyFilter[1].value ||
                      x.prop1[_this.state.applyFilter[2].position] ===
                        _this.state.applyFilter[2].value ||
                      x.prop1[_this.state.applyFilter[3].position] ===
                        _this.state.applyFilter[3].value ||
                      x.prop1[_this.state.applyFilter[4].position] ===
                        _this.state.applyFilter[4].value ||
                      x.prop1[_this.state.applyFilter[5].position] ===
                        _this.state.applyFilter[5].value
                    );
                  } else {
                    return (
                      x.prop1[_this.state.applyFilter[0].position] ===
                        _this.state.applyFilter[0].value &&
                      x.prop1[_this.state.applyFilter[1].position] ===
                        _this.state.applyFilter[1].value &&
                      x.prop1[_this.state.applyFilter[2].position] ===
                        _this.state.applyFilter[2].value &&
                      x.prop1[_this.state.applyFilter[3].position] ===
                        _this.state.applyFilter[3].value &&
                      x.prop1[_this.state.applyFilter[4].position] ===
                        _this.state.applyFilter[4].value &&
                      x.prop1[_this.state.applyFilter[5].position] ===
                        _this.state.applyFilter[5].value
                    );
                  }
                });
              } else if (ApplyFilterLength === 7) {
                tempObj = temp.filter((x, index) => {
                  if (conditionalOperator === "or") {
                    return (
                      x.prop1[_this.state.applyFilter[0].position] ===
                        _this.state.applyFilter[0].value ||
                      x.prop1[_this.state.applyFilter[1].position] ===
                        _this.state.applyFilter[1].value ||
                      x.prop1[_this.state.applyFilter[2].position] ===
                        _this.state.applyFilter[2].value ||
                      x.prop1[_this.state.applyFilter[3].position] ===
                        _this.state.applyFilter[3].value ||
                      x.prop1[_this.state.applyFilter[4].position] ===
                        _this.state.applyFilter[4].value ||
                      x.prop1[_this.state.applyFilter[5].position] ===
                        _this.state.applyFilter[5].value ||
                      x.prop1[_this.state.applyFilter[6].position] ===
                        _this.state.applyFilter[6].value
                    );
                  } else {
                    return (
                      x.prop1[_this.state.applyFilter[0].position] ===
                        _this.state.applyFilter[0].value &&
                      x.prop1[_this.state.applyFilter[1].position] ===
                        _this.state.applyFilter[1].value &&
                      x.prop1[_this.state.applyFilter[2].position] ===
                        _this.state.applyFilter[2].value &&
                      x.prop1[_this.state.applyFilter[3].position] ===
                        _this.state.applyFilter[3].value &&
                      x.prop1[_this.state.applyFilter[4].position] ===
                        _this.state.applyFilter[4].value &&
                      x.prop1[_this.state.applyFilter[5].position] ===
                        _this.state.applyFilter[5].value &&
                      x.prop1[_this.state.applyFilter[6].position] ===
                        _this.state.applyFilter[6].value
                    );
                  }
                });
              } else if (ApplyFilterLength === 8) {
                tempObj = temp.filter((x, index) => {
                  if (conditionalOperator === "or") {
                    return (
                      x.prop1[_this.state.applyFilter[0].position] ===
                        _this.state.applyFilter[0].value ||
                      x.prop1[_this.state.applyFilter[1].position] ===
                        _this.state.applyFilter[1].value ||
                      x.prop1[_this.state.applyFilter[2].position] ===
                        _this.state.applyFilter[2].value ||
                      x.prop1[_this.state.applyFilter[3].position] ===
                        _this.state.applyFilter[3].value ||
                      x.prop1[_this.state.applyFilter[4].position] ===
                        _this.state.applyFilter[4].value ||
                      x.prop1[_this.state.applyFilter[5].position] ===
                        _this.state.applyFilter[5].value ||
                      x.prop1[_this.state.applyFilter[6].position] ===
                        _this.state.applyFilter[6].value ||
                      x.prop1[_this.state.applyFilter[7].position] ===
                        _this.state.applyFilter[7].value
                    );
                  } else {
                    return (
                      x.prop1[_this.state.applyFilter[0].position] ===
                        _this.state.applyFilter[0].value &&
                      x.prop1[_this.state.applyFilter[1].position] ===
                        _this.state.applyFilter[1].value &&
                      x.prop1[_this.state.applyFilter[2].position] ===
                        _this.state.applyFilter[2].value &&
                      x.prop1[_this.state.applyFilter[3].position] ===
                        _this.state.applyFilter[3].value &&
                      x.prop1[_this.state.applyFilter[4].position] ===
                        _this.state.applyFilter[4].value &&
                      x.prop1[_this.state.applyFilter[5].position] ===
                        _this.state.applyFilter[5].value &&
                      x.prop1[_this.state.applyFilter[6].position] ===
                        _this.state.applyFilter[6].value &&
                      x.prop1[_this.state.applyFilter[7].position] ===
                        _this.state.applyFilter[7].value
                    );
                  }
                });
              } else if (ApplyFilterLength === 9) {
                tempObj = temp.filter((x, index) => {
                  if (conditionalOperator === "or") {
                    return (
                      x.prop1[_this.state.applyFilter[0].position] ===
                        _this.state.applyFilter[0].value ||
                      x.prop1[_this.state.applyFilter[1].position] ===
                        _this.state.applyFilter[1].value ||
                      x.prop1[_this.state.applyFilter[2].position] ===
                        _this.state.applyFilter[2].value ||
                      x.prop1[_this.state.applyFilter[3].position] ===
                        _this.state.applyFilter[3].value ||
                      x.prop1[_this.state.applyFilter[4].position] ===
                        _this.state.applyFilter[4].value ||
                      x.prop1[_this.state.applyFilter[5].position] ===
                        _this.state.applyFilter[5].value ||
                      x.prop1[_this.state.applyFilter[6].position] ===
                        _this.state.applyFilter[6].value ||
                      x.prop1[_this.state.applyFilter[7].position] ===
                        _this.state.applyFilter[7].value ||
                      x.prop1[_this.state.applyFilter[8].position] ===
                        _this.state.applyFilter[8].value
                    );
                  } else {
                    return (
                      x.prop1[_this.state.applyFilter[0].position] ===
                        _this.state.applyFilter[0].value &&
                      x.prop1[_this.state.applyFilter[1].position] ===
                        _this.state.applyFilter[1].value &&
                      x.prop1[_this.state.applyFilter[2].position] ===
                        _this.state.applyFilter[2].value &&
                      x.prop1[_this.state.applyFilter[3].position] ===
                        _this.state.applyFilter[3].value &&
                      x.prop1[_this.state.applyFilter[4].position] ===
                        _this.state.applyFilter[4].value &&
                      x.prop1[_this.state.applyFilter[5].position] ===
                        _this.state.applyFilter[5].value &&
                      x.prop1[_this.state.applyFilter[6].position] ===
                        _this.state.applyFilter[6].value &&
                      x.prop1[_this.state.applyFilter[7].position] ===
                        _this.state.applyFilter[7].value &&
                      x.prop1[_this.state.applyFilter[8].position] ===
                        _this.state.applyFilter[8].value
                    );
                  }
                });
              } else if (ApplyFilterLength === 10) {
                tempObj = temp.filter((x, index) => {
                  if (conditionalOperator === "or") {
                    return (
                      x.prop1[_this.state.applyFilter[0].position] ===
                        _this.state.applyFilter[0].value ||
                      x.prop1[_this.state.applyFilter[1].position] ===
                        _this.state.applyFilter[1].value ||
                      x.prop1[_this.state.applyFilter[2].position] ===
                        _this.state.applyFilter[2].value ||
                      x.prop1[_this.state.applyFilter[3].position] ===
                        _this.state.applyFilter[3].value ||
                      x.prop1[_this.state.applyFilter[4].position] ===
                        _this.state.applyFilter[4].value ||
                      x.prop1[_this.state.applyFilter[5].position] ===
                        _this.state.applyFilter[5].value ||
                      x.prop1[_this.state.applyFilter[6].position] ===
                        _this.state.applyFilter[6].value ||
                      x.prop1[_this.state.applyFilter[7].position] ===
                        _this.state.applyFilter[7].value ||
                      x.prop1[_this.state.applyFilter[8].position] ===
                        _this.state.applyFilter[8].value ||
                      x.prop1[_this.state.applyFilter[9].position] ===
                        _this.state.applyFilter[9].value
                    );
                  } else {
                    return (
                      x.prop1[_this.state.applyFilter[0].position] ===
                        _this.state.applyFilter[0].value &&
                      x.prop1[_this.state.applyFilter[1].position] ===
                        _this.state.applyFilter[1].value &&
                      x.prop1[_this.state.applyFilter[2].position] ===
                        _this.state.applyFilter[2].value &&
                      x.prop1[_this.state.applyFilter[3].position] ===
                        _this.state.applyFilter[3].value &&
                      x.prop1[_this.state.applyFilter[4].position] ===
                        _this.state.applyFilter[4].value &&
                      x.prop1[_this.state.applyFilter[5].position] ===
                        _this.state.applyFilter[5].value &&
                      x.prop1[_this.state.applyFilter[6].position] ===
                        _this.state.applyFilter[6].value &&
                      x.prop1[_this.state.applyFilter[7].position] ===
                        _this.state.applyFilter[7].value &&
                      x.prop1[_this.state.applyFilter[8].position] ===
                        _this.state.applyFilter[8].value &&
                      x.prop1[_this.state.applyFilter[9].position] ===
                        _this.state.applyFilter[9].value
                    );
                  }
                });
              }
            }
            _this.setState({
              resultData: tempObj,
              loading: false,
              data: _this.state.resultData,
              lead_columnsList: res.lead_columns,
              columnsList: columns,
            });
          } else {
            _this.setState({
              resultData: [],
              loading: false,
              data: [],
              lead_columnsList: res.lead_columns,
              columnsList: columns,
            });
          }
        },
        () => {
          _this.setState({ loading: false });
        }
      );
    }
  };
  render() {
    let _this = this;
    const options = {
      filter: false,
      filterType: "dropdown",
      download: false,
      print: false,
      viewColumns: false,
      pagination: false,
      search: false,
      selectableRows: false,
      responsive: "scrollMaxHeight",
      rowsPerPage: 10,
      rowsPerPageOptions: [5, 10, 25, 50],
      textLabels: {
        body: {
          noMatch: _this.state.loading_list ? "Loading..." : "No Leads Found!",
        },
      },
    };
    let form = (
      <Fragment>
        <div className="chatbots_section">
          {window.location.href.includes("/user/analytics/leads") ? null : (
            <CommonDateAndSearchWiseFilterComponent
              {..._this.props}
              _this={_this}
              searchValue={_this.state.searchValue}
              filterDate={_this.state.filterDate}
              columnsList={_this.state.columnsList}
              applyFilter={_this.state.applyFilter}
              conditionalOperator={_this.state.conditionalOperator}
              leads={true}
              fetchApplyFilterDataFromServer={() => {
                _this.fetchApplyFilterDataFromServer();
              }}
              fetchDataFromServer={() => {
                _this.fetchDataFromServer();
              }}
            />
          )}
          <div className="analytics_lead_section">
            <MUIDataTable
              title={""}
              data={_this.state.data}
              columns={_this.state.columnsList}
              options={options}
              className="lead_table disable-hover check-disable-height"
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
          </div>
        </div>
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
                chatDetails={_this.state.chatDetails}
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
      </Fragment>
    );
    return (
      <Fragment>
        {_this.state.alert}
        {(this.state.loading || this.state.loading_list) && (
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

function mapStateToProps(state) {
  return {
    leads: state.modes.leads,
  };
}

export default connect(mapStateToProps)(UserLeadsComponent);
