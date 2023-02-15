import React, { Component, Fragment } from "react";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import share from "../../../assets/images/Group 19585.svg";
import menu from "../../../assets/images/Group 19584.svg";
import search from "../../../assets/images/search (1).svg";
import CloseIcon from "@mui/icons-material/Close";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import { Form } from "react-bootstrap";
import {
  Checkbox,
  Grid,
  Tab,
  Tabs,
  Autocomplete,
  TextField,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
} from "@mui/material";
import moment from "moment";

import IndividualOfflineMessageComponent from "./components/IndividualOfflineMessageComponent.jsx";
import { getChatBotList } from "../dashboard/server/DashboardServer.js";
import {
  getAllOfflineMsgList,
  getSingleOfflineMsgInfo,
  replySingleMessage,
  replyAllMessage,
} from "./server/OfflineMessageServer.js";
import { connect } from "react-redux";
// import { Link } from "react-router-dom";
import { OfflineListComponent } from "./components/offlineListComponent";
import { MittContext } from "../../common/WebSocketComponent";
import { successAlert, errorAlert } from "../../../js/alerts";
import {
  setOfflineMessageList,
  setOfflineMessages,
  setOfflineSelectedMessage,
  setOfflineUnread,
} from "../../../redux/actions/ReduxActionPage";
let page = 0;

export const OfflineMessageContext = React.createContext([]);

export class OfflineMessageComponent extends Component {
  static contextType = MittContext;
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      loading: false,
      selectTab: "inbox",
      botId: null,
      botName: "",
      limit: 50,
      searchKeyword: "",
      orderFilter: "desc",
      status: "all",
      selection: {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
      showSearchFilterModal: false,
      showFilterModal: false,
      showFilterAnchorEl: null,
      visitorAnchorEl: null,
      showDatePickerFilter: false,
      showDatePickerAnchorEl: null,
      selectedMsg: false,
      activeMessage: {},
      individualMessage: {},
      threadEmailList: [],
      botItemList: [],
      offlineMessageList: [],
    };
    this.editorRef = React.createRef();
    this.sendMessage = this.sendMessage.bind(this);
    this.customButtonAction = this.customButtonAction.bind(this);
    this.sendMessageTimeout = null;
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    _this.fetchChatBotData();
    _this.context.emitter.on("getOfflineMessage", (result) => {
      console.log("result", result);
      // debugger;
      if (result.type === "offlineform_response") {
        // _this.fetchDataFromServer();
        let emailList = [...this.state.threadEmailList];
        let data = {
          messages: result.email_message,
          emailfrom: "agent",
          name: "Lea Codersss",
          datetime: new Date(),
          starred: 0,
          status: "sent",
        };
        emailList.unshift(data);
        this.setState({
          threadEmailList: emailList,
        });
      }
      if (result.type === "replyemailagent" || "email") {
        _this.singleMessageFetch();
        clearTimeout(this.sendMessageTimeout);
        _this.setState({ loading: true });
        if (_this.editorRef.current && _this.editorRef.current.deleteMessage)
          _this.editorRef.current.deleteMessage();
      } else {
      }
    });
  }

  sendMessage(message) {
    let _this = this;
    // debugger;
    if (
      this.context.websocket &&
      this.context.websocket.readyState === WebSocket.OPEN
    ) {
      _this.setState({ loading: true });
      this.context.emitter.emit("sendMessage", message);

      clearTimeout(this.sendMessageTimeout);
      this.sendMessageTimeout = setTimeout(() => {
        errorAlert("send Message Failed", this, 3000);
        _this.setState({ loading: false });
      }, 12000);
    }
  }

  fetchChatBotData = () => {
    let _this = this;
    _this.setState({ loading: true });
    getChatBotList(
      _this,
      "",
      (res) => {
        if (res.status !== "False") {
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
          newObj.unshift({
            id: 0,
            label: "All",
            value: 0,
          });
          _this.setState({
            botItemList: newObj,
            botId: 0,
            botName: "All",
            loading: false,
          });
          _this.fetchDataFromServer();
        } else {
          _this.setState({ loading: false });
        }
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };
  fetchDataFromServer = (selectVisitor) => {
    let _this = this;
    let temp = _this.state.selection;

    if (selectVisitor !== "push") {
      page = 0;
      _this.setState({ loading: true, nextPage: true });
    } else {
      console.log("page", _this.state.page);
      if (_this.state.requestPaging) {
        return;
      }
      page = page + 1;
      _this.setState({ requestPaging: true });
    }

    let params = "";
    if (_this.state.status === "duration") {
      params = `botid=${_this.state.botId}&mainfilter=${
        _this.state.selectTab
      }&sortfilter=${_this.state.orderFilter}&filter=${
        _this.state.status
      }&startdate=${moment(temp.startDate).format(
        "YYYY-MM-DD"
      )}&enddate=${moment(temp.endDate).format("YYYY-MM-DD")}`;
    } else {
      if (
        _this.state.selectTab === "send" ||
        _this.state.selectTab === "draft"
      ) {
        params = `botid=${_this.state.botId}&mainfilter=${_this.state.selectTab}&sortfilter=${_this.state.orderFilter}`;
      } else {
        params = `botid=${_this.state.botId}&mainfilter=${_this.state.selectTab}&sortfilter=${_this.state.orderFilter}&filter=${_this.state.status}`;
      }
    }
    params +=
      "&totalFetch=" +
      page * this.state.limit +
      "&pagination=" +
      this.state.limit;
    getAllOfflineMsgList(
      params,
      (res) => {
        if (
          Array.isArray(res.offlinemsglist) &&
          res.offlinemsglist.length > 0
        ) {
          var uniqueDates = [];
          for (var i = 0; i < res.offlinemsglist.length; i++) {
            if (
              !_this.isDateInArray(res.offlinemsglist[i].datetime, uniqueDates)
            ) {
              uniqueDates.push(res.offlinemsglist[i].datetime);
            }
          }
          let newObj =
            res.offlinemsglist &&
            res.offlinemsglist.length > 0 &&
            res.offlinemsglist
              ? res.offlinemsglist
              : [];
          //   .map((prop,index) => {
          //     var days = 0;
          //     var endDate = new Date();
          //     let today = new Date(prop.datetime);
          //     var distance = endDate.getTime() - today.getTime();
          //     days = Math.floor(distance / (1000 * 60 * 60 * 24));
          //     if (days === 0) {
          //       prop.showDateFilter = "Today";
          //     } else if (days === 1) {
          //       prop.showDateFilter = "Yesterday";
          //     } else {
          //       prop.showDateFilter = "Other";
          //     }
          //     return prop;
          //   });

          // let newObj = [];
          // uniqueDates &&
          //   uniqueDates.length > 0 &&
          //   uniqueDates.map((prop) => {
          //     let uniqueData = tempObj.filter((x) => {
          //       return (
          //         moment(new Date(x.datetime)).format("YYYY-MM-DD") ===
          //         moment(new Date(prop)).format("YYYY-MM-DD")
          //       );
          //     });
          //     newObj.push({
          //       data: uniqueData.map((prop1, key) => {
          //         if ((key === 0)) {
          //           prop1.value = true;
          //           _this.setState({
          //             activeMessage:prop1
          //           })
          //         } else {
          //           prop1.value =false;
          //         }
          //         return prop1;

          //       })
          //     });
          //   });
          const activeMessage = newObj[0] || {};
          console.log("activeMessage", activeMessage);
          this.props.setMessageList(res.offlinemsglist);
          if (selectVisitor !== "push") {
            _this.setState(
              {
                loading: false,
                activeMessage: activeMessage,
                offlineMessageList: newObj,
                selectedMsg: true,
              },
              () => {
                if (newObj && newObj.length > 0) _this.singleMessageFetch();
              }
            );
          } else {
            // push branch
            let serverVisitorList = Array.isArray(newObj) ? newObj : [];
            let visitorList = [
              ...this.state.offlineMessageList,
              ...serverVisitorList,
            ];
            _this.setState({
              loading: false,
              offlineMessageList: visitorList,
              selectedMsg: true,
            });
          }
        } else {
          _this.setState({
            loading: false,
            offlineMessageList: [],
            individualMessage: {},
            threadEmailList: [],
            selectedMsg: false,
          });
        }
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };
  customButtonAction = (action, message, data) => {
    const currentAgentId = parseInt(localStorage.getItem("id"));
    if (action === "reply") {
      let _this = this;
      const client_id =
        _this.state.activeMessage && _this.state.activeMessage.client_id;
      // debugger;
      // _this.setState({ loading: true });

      this.sendMessage({
        type: "replyemailagent",
        client_id: client_id,
        agent_id: currentAgentId,
        message: message,
      });
      // replySingleMessage(
      //   {
      //     client_id: client_id,
      //     message: message
      //   },
      //   (res) => {
      //     if (_this.editorRef.current && _this.editorRef.current.deleteMessage)
      //       _this.editorRef.current.deleteMessage();
      //     _this.singleMessageFetch();
      //   },
      //   () => {
      //     _this.setState({ loading: false });
      //   }
      // );
    } else if (action === "reply_all") {
      let _this = this;
      const client_id =
        _this.state.activeMessage && _this.state.activeMessage.client_id;
      _this.setState({ loading: true });

      this.sendMessage({
        type: "email",
        subtype: "replytoallemail",
        bcc: data.bccEmails,
        cc: data.ccEmails,
        client_id: client_id,
        agent_id: currentAgentId,
        message: message,
        toemail: "",
      });

      // replyAllMessage(
      //   {
      //     client_id: client_id,
      //     message: message,
      //     emailtype: 'replytoall',
      //     cc: data.ccEmails,
      //     bcc: data.bccEmails,
      //   },
      //   (res) => {
      //     if (_this.editorRef.current && _this.editorRef.current.deleteMessage)
      //       _this.editorRef.current.deleteMessage();
      //     _this.singleMessageFetch();
      //   },
      //   () => {
      //     _this.setState({ loading: false });
      //   }
      // );
    } else if (action === "forward") {
      let _this = this;
      const client_id =
        _this.state.activeMessage && _this.state.activeMessage.client_id;
      _this.setState({ loading: true });

      this.sendMessage({
        type: "email",
        subtype: "forwardemail",
        bcc: data.bccEmails,
        cc: data.ccEmails,
        client_id: client_id,
        agent_id: currentAgentId,
        message: message,
        toemail: data.toEmails,
      });

      // replyAllMessage(
      //   {
      //     client_id: client_id,
      //     message: message,
      //     emailtype: 'forward',
      //     toemail: data.toEmails,
      //     cc: data.ccEmails,
      //     bcc: data.bccEmails,
      //   },
      //   (res) => {
      //     if (_this.editorRef.current && _this.editorRef.current.deleteMessage)
      //       _this.editorRef.current.deleteMessage();
      //     _this.singleMessageFetch();
      //   },
      //   () => {
      //     _this.setState({ loading: false });
      //   }
      // );
    }
  };
  isDateInArray = (needle, haystack) => {
    for (var i = 0; i < haystack.length; i++) {
      if (
        moment(new Date(needle)).format("YYYY-MM-DD") ===
        moment(new Date(haystack[i])).format("YYYY-MM-DD")
      ) {
        return true;
      }
    }
    return false;
  };

  singleMessageFetch = () => {
    let _this = this;
    _this.setState({
      loading: true,
      individualMessage: {},
      threadEmailList: [],
    });
    console.log(_this.state.activeMessage);
    let params = `client_id=${
      _this.state.activeMessage && _this.state.activeMessage.client_id
    }&id=${_this.state.activeMessage && _this.state.activeMessage.id}`;
    getSingleOfflineMsgInfo(
      params,
      (res) => {
        if (res.offlinemsglist && res.offlinemsglist) {
          let tempObj =
            res.offlinemsglist &&
            res.offlinemsglist.threademail.length > 0 &&
            res.offlinemsglist.threademail.map((prop) => {
              prop.value = false;
              return prop;
            });
          let newObj =
            tempObj &&
            tempObj.filter((x) => {
              if (
                _this.state.selectTab === "inbox" ||
                _this.state.selectTab === "starred"
              ) {
                return x.emailfrom === "client";
              } else {
                return x.emailfrom === "agent";
              }
            });
          this.props.setMessages(res.offlinemsglist.firstEmail);
          this.props.setSelectedMessage(res.offlinemsglist.threademail);
          _this.setState({
            loading: false,
            individualMessage:
              res.offlinemsglist && res.offlinemsglist.firstEmail,
            threadEmailList:
              (res.offlinemsglist && res.offlinemsglist.threademail) || [],
            // sorting is for api side work, don't do it on client side....
            // threadEmailList: newObj && newObj.length>0
            //   ? newObj.sort((a, b) => {
            //      return new Date(b.datetime) - new Date(a.datetime);
            //   }) :
            //   []
          });
        }
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };
  selectMessage = (activeMessage, index) => {
    let _this = this;
    let message = [..._this.state.offlineMessageList];
    message[index].readstatus = "read";
    _this.setState(
      {
        loading: false,
        activeMessage: activeMessage,
        selectedMsg: true,
        offlineMessageList: message,
      },
      () => {
        _this.singleMessageFetch();
      }
    );
  };
  handleCheck = (e, key) => {
    let _this = this;
    e.preventDefault();
    e.stopPropagation();
    console.log("checked", e.target.checked);
    const newObj = _this.state.offlineMessageList;
    newObj[key].value = e.target.checked;
    _this.setState(
      {
        loading: true,
      },
      () => {
        this.setState(
          {
            offlineMessageList: newObj,
          },
          () => {
            _this.setState({
              loading: false,
            });
          }
        );
      }
    );
  };

  updateRead = (id) => {
    console.log(this.state.threadEmailList);
    let a = [...this.state.threadEmailList];
    this.state.threadEmailList.map((data, i) => {
      if (data.id == id) {
        return (a[i].readstatus = "read");
      }
    });
    this.setState({
      threadEmailList: a,
    });
  };

  render() {
    let _this = this;
    let form = (
      <Fragment>
        <div className="live_conv_section">
          <Grid container className="h-100">
            <Grid item sm={12} md={12} lg={5}>
              <div className="live_conv_left">
                <div className="live_conv_top">
                  <div className="live_conv_header">
                    {!_this.state.showSearchFilterModal ? (
                      <>
                        <div className="w-50 align-items-center">
                          <div>
                            <p className="select_text">
                              Selected Chat Interface
                            </p>
                            <Autocomplete
                              disablePortal
                              id="combo-box-demo"
                              name="selectBotId"
                              options={_this.state.botItemList}
                              value={_this.state.botName}
                              onChange={(e, option) => {
                                _this.setState({
                                  botId: option.value,
                                  botName: option.label,
                                });
                                setTimeout(() => {
                                  _this.fetchDataFromServer();
                                }, 1000);
                              }}
                              className="chat_bot_select"
                              sx={{ width: 300 }}
                              renderInput={(params) => (
                                <TextField {...params} />
                              )}
                            />
                          </div>
                        </div>

                        <div className="filter_icons">
                          <Tooltip title="Sort">
                            <a
                              role="button"
                              onClick={() => {
                                _this.setState({
                                  orderFilter:
                                    _this.state.orderFilter === "asc"
                                      ? "desc"
                                      : "asc",
                                });
                                setTimeout(() => {
                                  _this.fetchDataFromServer();
                                }, 1000);
                              }}
                            >
                              <IconButton color="primary" component="span">
                                <img alt="" src={share} />
                              </IconButton>
                            </a>
                          </Tooltip>
                          <Tooltip title="Filter">
                            <IconButton
                              color="primary"
                              component="span"
                              id="basic-button"
                              aria-controls={
                                _this.state.filterModel
                                  ? "basic-menu"
                                  : undefined
                              }
                              aria-haspopup="true"
                              aria-expanded={
                                _this.state.filterModel ? "true" : undefined
                              }
                              onClick={(event) => {
                                _this.setState({
                                  showFilterModal: true,
                                  showFilterAnchorEl: event.currentTarget,
                                });
                              }}
                            >
                              <img alt="" src={menu} />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Search">
                            <IconButton
                              color="primary"
                              component="span"
                              onClick={() => {
                                _this.setState({
                                  showSearchFilterModal:
                                    !_this.state.showSearchFilterModal,
                                });
                              }}
                            >
                              <img alt="" src={search} />
                            </IconButton>
                          </Tooltip>
                        </div>
                      </>
                    ) : null}

                    {_this.state.showSearchFilterModal ? (
                      <div className="filter-options">
                        <Form>
                          <Form.Group
                            // className=""
                            controlId="formBasicSearch"
                            className="input-block"
                          >
                            <Form.Control
                              type="text"
                              value={_this.state.searchKeyword}
                              placeholder="Search Here..."
                              onChange={(e) => {
                                _this.setState({
                                  searchKeyword: e.target.value,
                                });
                                if (
                                  e.target.value &&
                                  e.target.value.length > 2
                                ) {
                                  setTimeout(() => {
                                    _this.fetchDataFromServer();
                                  }, 1000);
                                }
                              }}
                            />
                            <IconButton
                              color="primary"
                              component="span"
                              onClick={() => {
                                _this.setState({
                                  showSearchFilterModal: false,
                                });
                              }}
                            >
                              <CloseIcon />
                            </IconButton>
                          </Form.Group>
                        </Form>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="live_conv_main">
                  <Tabs
                    value={_this.state.selectTab}
                    onChange={(event, newValue) => {
                      _this.setState({
                        selectTab: newValue,
                      });
                      setTimeout(() => {
                        _this.fetchDataFromServer();
                      }, 1000);
                    }}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                  >
                    <Tab value="inbox" label="Inbox" />
                    <Tab value="starred" label="Starred" />
                    {/* <Tab value="send" label="Sent" /> */}
                    <Tab value="draft" label="Draft" />
                    {/* <Tab value="draft" label="Deleted" /> */}
                  </Tabs>
                  <div className="visitor_notification">
                    {_this.state.offlineMessageList &&
                    _this.state.offlineMessageList.length > 0 ? (
                      <Fragment>
                        {_this.state.offlineMessageList.map((item, i) => {
                          const lastMessage =
                            i === 0
                              ? null
                              : this.state.offlineMessageList[i - 1];
                          const nextMessage =
                            i === this.state.offlineMessageList.length - 1
                              ? null
                              : this.state.offlineMessageList[i + 1];

                          return (
                            <OfflineListComponent
                              key={i}
                              index={i}
                              activeMessage={_this.state.activeMessage}
                              selectMessage={(e) => {
                                this.selectMessage(e, i);
                              }}
                              handleCheck={this.handleCheck}
                              message={item}
                              lastMessage={lastMessage}
                              nextMessage={nextMessage}
                            />
                          );
                        })}
                      </Fragment>
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
            <Grid item sm={12} md={12} lg={7} className="h-100">
              {_this.state.selectedMsg ? (
                <div className="offline_msg_section h-100">
                  <OfflineMessageContext.Provider
                    value={{ updateRead: this.updateRead }}
                  >
                    <IndividualOfflineMessageComponent
                      {..._this.props}
                      ref={this.editorRef}
                      client_id={
                        _this.state.activeMessage &&
                        _this.state.activeMessage.client_id
                      }
                      customButtonAction={this.customButtonAction}
                      selectedMsg={_this.state.selectedMsg}
                      threadEmailList={_this.state.threadEmailList}
                      individualMessage={_this.state.individualMessage}
                      _this={_this}
                    />
                  </OfflineMessageContext.Provider>
                </div>
              ) : null}
            </Grid>
          </Grid>
        </div>

        <Menu
          className="filter-model-block"
          id="basic-menu"
          anchorEl={this.state.showFilterAnchorEl}
          open={this.state.showFilterModal}
          onClose={() => {
            _this.setState({
              showFilterModal: false,
              showFilterAnchorEl: null,
            });
          }}
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
          <MenuItem
            role="button"
            onClick={() => {
              _this.setState({
                status: "read",
                showFilterModal: false,
                showFilterAnchorEl: null,
              });
              setTimeout(() => {
                _this.fetchDataFromServer();
              }, 1000);
            }}
          >
            Read
          </MenuItem>
          {_this.state.selectTab === "send" ||
          _this.state.selectTab === "draft" ? null : (
            <Fragment>
              <MenuItem
                role="button"
                onClick={() => {
                  _this.setState({
                    status: "unread",
                    showFilterModal: false,
                    showFilterAnchorEl: null,
                  });
                  setTimeout(() => {
                    _this.fetchDataFromServer();
                  }, 1000);
                }}
              >
                Unread
              </MenuItem>
            </Fragment>
          )}
          <MenuItem
            role="button"
            onClick={() => {
              _this.setState({
                status: "week",
                showFilterModal: false,
                showFilterAnchorEl: null,
              });
              setTimeout(() => {
                _this.fetchDataFromServer();
              }, 1000);
            }}
          >
            Week
          </MenuItem>
          <MenuItem
            role="button"
            onClick={() => {
              _this.setState({
                status: "month",
                showFilterModal: false,
                showFilterAnchorEl: null,
              });
              setTimeout(() => {
                _this.fetchDataFromServer();
              }, 1000);
            }}
          >
            Month
          </MenuItem>
          <MenuItem
            role="button"
            onClick={() => {
              _this.setState({
                status: "year",
                showFilterModal: false,
                showFilterAnchorEl: null,
              });
              setTimeout(() => {
                _this.fetchDataFromServer();
              }, 1000);
            }}
          >
            Year
          </MenuItem>
          <MenuItem
            role="button"
            onClick={(event) => {
              _this.setState({
                status: "duration",
                showDatePickerAnchorEl: event.currentTarget,
                showDatePickerFilter: true,
              });
            }}
          >
            Select duration
            <ChevronRightIcon className="icon" />
          </MenuItem>
        </Menu>

        <Menu
          className="filter-duration-model-block"
          id="basic-menu"
          anchorEl={this.state.showDatePickerAnchorEl}
          open={this.state.showDatePickerFilter}
          onClose={() => {
            _this.setState({
              showDatePickerAnchorEl: null,
              showDatePickerFilter: false,
            });
          }}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
        >
          <li>
            <DateRangePicker
              ranges={[this.state.selection]}
              // minDate={moment().toDate()}
              startDatePlaceholderText="Check In"
              endDatePlaceholderText="Check Out"
              onChange={(item) => {
                _this.setState({
                  selection: {
                    startDate: item && item.selection.startDate,
                    endDate: item && item.selection.endDate,
                    key: "selection",
                  },
                });
                if (
                  item &&
                  item.selection.startDate &&
                  item &&
                  item.selection.endDate
                ) {
                  setTimeout(() => {
                    _this.setState({
                      showDatePickerAnchorEl: null,
                      showDatePickerFilter: false,
                      showFilterModal: false,
                      showFilterAnchorEl: null,
                    });
                    _this.fetchDataFromServer();
                  }, 2000);
                }
              }}
            />
          </li>
        </Menu>
      </Fragment>
    );
    return (
      <Fragment>
        {this.state.alert}
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

function mapStateToProps(state) {
  const unreadCount = state.offlineForm.unReadCount || [];
  const messages = state.offlineForm.messages || [];
  const messageList = state.offlineForm.MessageList || [];
  const selectedmessage = state.offlineForm.selectedMessage || [];
  return {
    unreadCount,
    messages,
    selectedmessage,
    messageList,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUnread: (data) => {
      dispatch(setOfflineUnread(data));
    },
    setMessageList: (data) => {
      dispatch(setOfflineMessageList(data));
    },
    setMessages: (data) => {
      dispatch(setOfflineMessages(data));
    },
    setSelectedMessage: (data) => {
      dispatch(setOfflineSelectedMessage(data));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OfflineMessageComponent);

// export default OfflineMessageComponent
