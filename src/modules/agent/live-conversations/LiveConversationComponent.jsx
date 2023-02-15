import React, { Component, Fragment } from "react";
import { Grid, MenuItem, Menu } from "@mui/material";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import { getChatBotList } from "../dashboard/server/DashboardServer.js";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import basket from "../../../assets/images/shopping-basket.png";
import moment from "moment";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { DateRangePicker } from "react-date-range";
import LiverChatFilterComponent from "./components/LiverChatFilterComponent.jsx";
import VisitorPersonalInfoComponent from "./components/VisitorPersonalInfoComponent.jsx";
import LiveChatMessageComponent from "./components/LiveChatMessageComponent.jsx";
import {
  setUnreadCount,
  setVideoChatLink,
  setNewVisitor,
  setActiveVisitor,
} from "../../../redux/actions/ReduxActionPage.jsx";
import { MittContext } from "../../common/WebSocketComponent";
import { successAlert, errorAlert } from "../../../js/alerts";
import { decryptBase64 } from "../../../js/encrypt";
import { connect } from "react-redux";

import {
  getAllVisitorList,
  getSingleVisitorInfo,
  fetchLeadsDetails,
  getOpenedVisitorList,
  createMarkLeadVisitor,
  getVisitorSearchList,
} from "./server/LiverConversationServer.js";
let page = 0;
export class LiveConversationComponent extends Component {
  static contextType = MittContext;
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      loading: true,
      visitorLoading: false,
      chatLoading: true,
      selectTab: "all",
      botId: null,
      botName: "",
      selection: {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
      page: 0,
      limit: 50,
      nextPage: true,
      requestPaging: false,
      searchKeyword: "",
      orderFilter: "desc",
      status: "all",
      selectedVisitor: false,
      showSearchFilterModal: false,
      showFilterModal: false,
      showFilterAnchorEl: null,
      visitorAnchorEl: null,
      showDatePickerFilter: false,
      showDatePickerAnchorEl: null,
      activeVisitor: {},
      botItemList: [],
      // visitorList: [],
      visitorDetails: {},
      showEditLeads: false,
      leadsDetails: {
        firstname: "",
        lastname: "",
        email: "",
        phone: "",
        company: "",
        city: "",
        lead_country: "",
        address: "",
        pincode: "",
        age: "",
        date: null,
        gender: "",
        websiteurl: "",
      },
      visitorListData: [],
      leadsDetailsMessage: false,
      messages: [],
    };
    this.scollChat = React.createRef(null);
    this.chatWebscocketAction = this.chatWebscocketAction.bind(this);
    this.visibilitychange = this.visibilitychange.bind(this);
    this.unSelectActiveVisitor = this.unSelectActiveVisitor.bind(this);
  }

  visibilitychange() {
    if (this.state.activeVisitor && this.state.activeVisitor.vistor_id) {
      const currentAgentId = parseInt(localStorage.getItem("id"));
      this.sendMessage({
        type: "updateunread",
        bot_id: this.state.activeVisitor.vistor_id.split("-")[0],
        unread_from: "agent",
        client_id: this.state.activeVisitor.vistor_id,
        agent_id: currentAgentId,
      });
    }
  }

  unSelectActiveVisitor(data) {
    if (this.state.activeVisitor.vistor_id === data.client_id) {
      this.setState({
        selectedVisitor: false,
        activeVisitor: {},
        visitorDetails: {},
      });
    }
  }

  componentDidMount() {
    let _this = this;
    _this.context.emitter.emit("pingWebsocket");

    window.scrollTo(0, 0);
    _this.fetchChatBotData();
    const currentAgentId = parseInt(localStorage.getItem("id"));
    /**
     * This event is not directly emitted from websocket,
     * Intead it will pass through agentlayout component and modified websocket result will emit
     */
    _this.context.emitter.on("getMessageSub", (result) => {
      if (result.deactiveSelect) {
        this.unSelectActiveVisitor(result);
        return;
      }
      if (result.type === "chat") {
        if (result.from === "client") {
          if (_this.state.activeVisitor.vistor_id === result.client_id) {
            if (result.answer_id && result.answer_id !== "") {
              result.chatbot_type = "file_upload";
              result.answer = result.answer_id;
            }

            _this.setState(
              {
                messages: [...this.state.messages, result],
              },
              () => {
                // scroll top bottom when last message is visible
                if (_this.scollChat && _this.scollChat.current) {
                  _this.scollChat.current.scrollTo({
                    top: _this.scollChat.current.scrollHeight,
                    behavior: "smooth",
                  });
                }
              }
            );
            if (!document.hidden) {
              // on recive message, update unread message
              _this.sendMessage({
                type: "updateunread",
                bot_id: result.client_id.split("-")[0],
                unread_from: "agent",
                client_id: result.client_id,
                agent_id: currentAgentId,
              });
            }
          }
        }
      } else if (
        result.type === "chathistory" &&
        result.chathistory.length > 0
      ) {
        var clientId = result.chathistory[0].client_id;
        if (_this.state.activeVisitor.vistor_id === clientId) {
          let mappedMessage = [];
          result.chathistory.map((item) => {
            if (item.chat_type === "active_chat") {
              item.from = "agent";
              item.text = item.question;
              mappedMessage.push({ ...item });
              item.from = "client";
              item.text = item.answer;
              mappedMessage.push({ ...item });
            } else if (item.chat_type === "live_chat") {
              if (item.chat_from === "agent") {
                item.from = "agent";
              } else if (item.chat_from === "client") {
                item.from = "client";
              }
              if (item.file_type) {
                item.chatbot_type = "file_upload";
                item.answer = item.file_type;
              }
              item.text = item.chat_text;
              mappedMessage.push(item);
            } else if (item.chat_type === "video_call") {
              if (item.visitorvideolink !== "") {
                item.from = "client";
                const message =
                  item.message || "Click Here to Start Video Chat";
                item.text = `<a href="${item.agentvideolink}" target="_blank">${message}</a>`;
                mappedMessage.push(item);
              }
            } else {
              item.from = "client";
              item.text = "Unknown type" + item.chat_type;
              mappedMessage.push(item);
            }
            return item;
          });

          // if (_this.state.activeVisitor.chat_type === 'video_chat') {
          //   if (_this.props.videoChat[_this.state.activeVisitor.vistor_id]) {
          //     mappedMessage.push({
          //     from: 'client',
          //     text: _this.props.videoChat[_this.state.activeVisitor.vistor_id]
          //   });
          //   }
          // }

          console.log("mappedMessage", mappedMessage);
          _this.setState(
            {
              messages: mappedMessage,
            },
            () => {
              if (_this.scollChat.current) {
                _this.scollChat.current.scrollTo({
                  top: _this.scollChat.current.scrollHeight,
                });
              }
              if (!document.hidden) {
                // on viewing message update unread
                _this.sendMessage({
                  type: "updateunread",
                  bot_id: clientId.split("-")[0],
                  unread_from: "agent",
                  client_id: clientId,
                  agent_id: currentAgentId,
                });
              }
              // update unread redux count
              if (_this.props.unReadCount[clientId]) {
                // clone unread count
                const unreadCount = { ..._this.props.unReadCount };
                delete unreadCount[clientId];
                _this.props.setUnreadCount(unreadCount);
              }
            }
          );
        }
      } else if (result.type === "endchat") {
        const currentAgentId = parseInt(localStorage.getItem("id"));
        if (currentAgentId === parseInt(result.agent_id)) {
          const updatedObj = {
            botId: 0,
            botName: "All",
          };
          // const findObj = this.state.botItemList.find((item)=> parseInt(item.value) === parseInt(result.bot_id));
          // if(findObj) {
          //   updatedObj.botName = findObj.label;
          // }

          _this.setState(updatedObj, () => {
            // _this.fetchDataFromServer();
            const updatedVisitor = this.props.visitorList.map((item) => {
              if (item.vistor_id === result.client_id) {
                delete item.accept;
                item.status = "endchat";
                item.message = result.message;
              }
              return item;
            });
            this.props.setVisitorList(updatedVisitor);
            if (_this.state.activeVisitor.vistor_id === result.client_id) {
              _this.setState({
                activeVisitor: {
                  ...this.state.activeVisitor,
                  status: "endchat",
                  message: result.message,
                },
              });
              // _this.fetchSingleVisitorInfo(result.client_id);
            }
          });
        }
      } else if (result.type === "videoLeft") {
        this.setState({
          activeVisitor: {
            ...this.state.activeVisitor,
            status: "videoLeft",
            message: "Client Left the ChatBot",
          },
        });
      } else if (result.type === "agentresponse") {
        if (result.offline_form === "No") {
          // clone array
          if (result.insertChat) {
            const chat = result.insertChat;
            chat.status = "assigned";
            this.setState(
              {
                selectedVisitor: false,
                activeVisitor: chat,
                botId: 0,
                botName: "All",
                status: "all",
              },
              () => {
                _this.fetchDataFromServer("active");
              }
            );
          }
        } else {
          if (
            this.state.activeVisitor &&
            this.state.activeVisitor.vistor_id &&
            this.state.activeVisitor.vistor_id === result.client_id
          ) {
            this.setState({
              activeVisitor: {
                ...this.state.activeVisitor,
                status: "endchatrefresh",
                message: "Timer Ended",
              },
            });
          }
        }
      } else if (result.type === "endchatrefresh") {
        let visitorData = this.props.visitorList;
        visitorData = visitorData.map((item) => {
          if (item.vistor_id === result.client_id) {
            delete item.accept;
            item.status = "endchatrefresh";
            item.message = result.message;
          }
          return item;
        });
        this.props.setVisitorList(visitorData);
        if (
          this.state.activeVisitor &&
          this.state.activeVisitor.vistor_id &&
          this.state.activeVisitor.vistor_id === result.client_id
        ) {
          this.setState({
            activeVisitor: {
              ...this.state.activeVisitor,
              status: "endchatrefresh",
              message: result.message,
            },
          });
        }
      } else if (result.type === "videochatclosed") {
        let visitorData = this.props.visitorList;
        visitorData = visitorData.map((item) => {
          if (item.vistor_id === result.client_id) {
            delete item.accept;
            item.status = "closed";
            // item.message = result.message;
          }
          return item;
        });
        this.props.setVisitorList(visitorData);
        if (
          this.state.activeVisitor &&
          this.state.activeVisitor.vistor_id &&
          this.state.activeVisitor.vistor_id === result.client_id
        ) {
          this.setState({
            activeVisitor: {
              ...this.state.activeVisitor,
              status: "closed",
            },
          });
        }
      } else if (result.type === "videochatlink") {
        if (result.visitorvideolink !== "") {
          const message = result.message || "Click Here to Start Video Chat";
          const newMessages = [
            {
              from: "agent",
              text: `<a href="${result.agentvideolink}" target="_blank">${message}</a>`,
            },
          ];
          const mappedMessage = [...this.state.messages, ...newMessages];
          console.log("mappedMessage", mappedMessage);
          _this.setState(
            {
              messages: mappedMessage,
            },
            () => {
              if (_this.scollChat && _this.scollChat.current) {
                _this.scollChat.current.scrollTo({
                  top: _this.scollChat.current.scrollHeight,
                  behavior: "smooth",
                });
              }
            }
          );
        }
      } else if (result.type === "assignedactiveuser" && result.agent_name) {
        if (result.insertChat) {
          const chat = result.insertChat;
          chat.status = "assigned";
          chat.assignedstatus = "assigned";
          this.setState(
            {
              activeVisitor: chat,
              botId: 0,
              botName: "All",
            },
            () => {
              _this.fetchDataFromServer("active");
            }
          );
        }
      } else if (result.status === "True" && result.question) {
        console.log("Incoming result", result);
        if (_this.state.activeVisitor.vistor_id === result.client_id) {
          // special rendering components => file upload, rating, appointment
          let answer = {
            client: "client",
            text: result.answer ? result.answer : result.answer_id,
          };
          if (result.chatbot_type === "appointment") {
            answer = {
              ...result,
              ...answer,
            };
          } else if (result.chatbot_type === "file_upload") {
            answer = {
              ...result,
              ...answer,
              text: result.answer_id,
            };
          }
          //media file is sent here
          if (
            (result.chatbot_type === "text_question" ||
              result.chatbot_type === "text_question") &&
            result.answer_id &&
            result.answer_id !== ""
          ) {
            result.chatbot_type = "file_upload";
          }
          const newMessages = [
            {
              from: "agent",
              text: result.question,
            },
            answer,
          ];
          const mappedMessage = [...this.state.messages, ...newMessages];
          console.log("mappedMessage", mappedMessage);
          const updateState = {
            messages: mappedMessage,
          };
          if (result.leads && result.leads === "True") {
            const answer = result.answer ? result.answer : result.answer_id;
            const updateLeadState = {};
            switch (result.leadtags) {
              case "first_name":
                updateLeadState.firstname = answer;
                break;
              case "last_name":
                updateLeadState.lastname = answer;
                break;
              case "website_url":
                updateLeadState.websiteurl = answer;
                break;
              // case "gender":
              // updateLeadState.gender = answer;
              // break;
              // case "lead_country":
              // updateLeadState.lead_country = answer;
              // break;
              // case "address":
              // updateLeadState.address = answer;
              // break;
              // case "pincode":
              // updateLeadState.pincode = answer;
              // break;
              // case "company":
              // updateLeadState.company = answer;
              // break;
              // case "city":
              // updateLeadState.city = answer;
              // break;
              // case "email":
              // updateLeadState.email = answer;
              // break;
              // case "date":
              // updateLeadState.date = answer;
              // break;
              // case "phone":
              // updateLeadState.phone = answer;
              // break;

              default:
                if (result.leadtags) updateLeadState[result.leadtags] = answer;
            }
            updateState.leadsDetails = {
              ..._this.state.leadsDetails,
              ...updateLeadState,
            };
          }
          console.log("updateState", updateState);
          _this.setState(updateState, () => {
            if (_this.scollChat && _this.scollChat.current) {
              _this.scollChat.current.scrollTo({
                top: _this.scollChat.current.scrollHeight,
                behavior: "smooth",
              });
            }
          });
        }
      }
    });

    _this.context.emitter.on("activeVisitor", (clientId) => {
      if (_this.state.botId === 0 && _this.state.selectTab === "all") {
        const data = {
          type: "chathistory",
          bot_id: clientId.split("-")[0],
          client_id: clientId,
          agent_id: currentAgentId,
        };
        const chat = this.props.visitorList.find(
          (item) => item.vistor_id === clientId
        );

        if (chat) {
          _this.setState(
            {
              selectedVisitor: true,
              activeVisitor: chat,
            },
            () => {
              _this.sendMessage(data);
              _this.fetchSingleVisitorInfo(chat.vistor_id);
            }
          );
          return;
        }
      }
      _this.setState(
        {
          botId: 0,
          botName: "All",
          selectTab: "all",
        },
        () => {
          _this.fetchDataFromServer(true);
        }
      );
    });
    _this.context.emitter.on("visibilitychange", (e) => {
      this.visibilitychange(e);
    });
    _this.context.emitter.on("toastAction", (result) => {
      this.chatWebscocketAction(result.action, result);
    });
  }

  componentWillUnmount() {
    let _this = this;

    _this.context.emitter.off("getMessageSub");
    _this.context.emitter.off("toastAction");
    _this.context.emitter.off("visibilitychange");
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.state.activeVisitor !== nextState.activeVisitor) {
      console.log("State Changes", nextState);
      this.props.setActiveVisitor(nextState.activeVisitor);
    }
  }

  decryptBot(decrypt) {
    try {
      const data = decryptBase64(decrypt);
      return data;
    } catch (err) {
      return 0;
    }
  }

  sendMessage(message) {
    let _this = this;
    this.context.emitter.emit("sendMessage", message);
    if (message.from && message.from === "agent") {
      if (message.answer_id && message.answer_id !== "") {
        message.chatbot_type = "file_upload";
        message.answer = message.answer_id;
      }

      _this.setState(
        {
          messages: [...this.state.messages, message],
        },
        () => {
          if (this.scollChat && this.scollChat.current) {
            console.log("this.scollChat", this.scollChat);
            this.scollChat.current.scrollTo({
              top: this.scollChat.current.scrollHeight,
              behavior: "smooth",
            });
          }
        }
      );
    }
  }
  chatWebscocketAction(action, chat) {
    var data;
    if (action === "accept") {
      // send socket data
      data = {
        type: "agentresponse",
        bot_id: chat.bot_id,
        value: "accept",
        client_id: chat.vistor_id,
        agent_id: parseInt(localStorage.getItem("id")),
      };
      // chat.accept = "true";
      this.setState(
        {
          selectedVisitor: true,
          activeVisitor: chat,
        },
        () => {
          this.sendMessage(data);
        }
      );
    } else if (action === "reject") {
      // visitorData = visitorData.map((item) => {
      //   if(item.vistor_id === chat.vistor_id) {
      //     delete item.accept;
      //     item.status = "reject";
      //     item.message = "Agent Rejected The Chat";
      //     activeChat = item;
      //   }
      //   return item;
      // });

      data = {
        type: "agentresponse",
        bot_id: chat.bot_id,
        value: "reject",
        client_id: chat.vistor_id,
        agent_id: parseInt(localStorage.getItem("id")),
      };
      this.sendMessage(data);
      // if (this.state.activeVisitor.vistor_id === chat.vistor_id) {
      //   this.setState({
      //     activeVisitor: activeChat
      //   });
      // }
    } else if (action === "assign_to_reject") {
      // update reject buttons
      // let activeChat = {};
      // let visitorData = this.props.visitorList;

      // visitorData = visitorData.filter((item) => {
      //   return item.vistor_id !== chat.vistor_id;
      // });

      // chat.client_id = chat.vistor_id;
      // this.unSelectActiveVisitor(chat);

      // visitorData = visitorData.map((item) => {
      //   if(item.vistor_id === chat.vistor_id) {
      //     delete item.accept;
      //     item.status = "reject";
      //     item.message = "Agent Rejected The Chat";
      //     activeChat = item;
      //   }
      //   return item;
      // });
      // this.props.setVisitorList(visitorData);

      // if (this.state.activeVisitor.vistor_id === chat.vistor_id) {
      //   this.setState({
      //     activeVisitor: activeChat
      //   });
      // }

      data = {
        type: "assignedactiveuser",
        value: "reject",
        bot_id: chat.bot_id,
        client_id: chat.vistor_id,
        agent_id: parseInt(localStorage.getItem("id")),
      };
      this.sendMessage(data);
    } else if (action === "assign_to_me") {
      data = {
        type: "assignedactiveuser",
        value: "accept",
        bot_id: chat.bot_id,
        client_id: chat.vistor_id,
        agent_id: parseInt(localStorage.getItem("id")),
      };
      this.setState(
        {
          selectedVisitor: true,
          activeVisitor: chat,
        },
        () => {
          this.sendMessage(data);
        }
      );
    }
  }

  fetchChatBotData = () => {
    let _this = this;
    _this.setState({ chatLoading: true });
    getChatBotList(
      _this,
      "",
      async (res) => {
        if (res.status !== "False") {
          // let selectBot = res.selectedBot && res.selectedBot;
          let newObj =
            res.bot_list &&
            Array.isArray(res.bot_list) &&
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
          _this.setState(
            {
              botItemList: newObj,
              // botId: selectBot && selectBot.bot_id,
              // botName: selectBot && selectBot.bot_name,
              botId: 0,
              botName: "All",
              chatLoading: false,
            },
            () => {
              _this.fetchDataFromServer(true);
            }
          );
        } else {
          _this.setState({
            botItemList: [],
            botId: 0,
            botName: "All",
            chatLoading: false,
            loading: false,
          });
        }
      },
      () => {
        _this.setState({ chatLoading: false, loading: false });
      }
    );
  };
  arrayUniqueByKey = (array, key) => {
    return [...new Map(array.map((item) => [item[key], item])).values()];
  };

  fetchDataFromServer = (selectVisitor) => {
    // debugger;
    let _this = this;
    let temp = _this.state.selection;
    if (selectVisitor !== "push") {
      page = 0;
      _this.setState({ visitorLoading: true, nextPage: true });
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
    } else if (selectVisitor.search == "search") {
      params = `searchvalue=${selectVisitor.searchkeyword}&bot_id=${_this.state.botId}`;
    } else {
      params = `botid=${_this.state.botId}&mainfilter=${_this.state.selectTab}&sortfilter=${_this.state.orderFilter}&filter=${_this.state.status}`;
    }
    if (selectVisitor.search == "search") {
      params +=
        "&pagination=" +
        this.state.limit +
        "&totalFetch=" +
        page * this.state.limit;
    } else {
      params +=
        "&totalFetch=" +
        page * this.state.limit +
        "&pagination=" +
        this.state.limit;
    }
    console.log(params);
    if (selectVisitor.search == "search") {
      getVisitorSearchList(
        params,
        (res) => {
          console.log(res);
          let visitorData = res.visitorlist;
          this.props.setVisitorList(visitorData);
        },
        (err) => {
          console.log(err);
        }
      );
    } else if (selectVisitor === "searchclose") {
      getAllVisitorList(
        params,
        (res) => {
          console.log(res);
          let visitorData = res.visitorlist;
          this.props.setVisitorList(visitorData);
        },
        (err) => {
          console.log(err);
        }
      );
    } else {
      getAllVisitorList(
        params,
        async (res) => {
          // Existing opened visitors List
          // openedvisitorlist should got from ajax response
          this.setState({
            visitorListData: res.visitorlist,
          });
          let visitorList = [];
          const updateState = {
            visitorLoading: false,
            loading: false,
          };
          if (selectVisitor !== "push") {
            let openedVisitorList = this.props.visitorList.filter((item) => {
              if (item.open === "True") {
                if (this.state.selectTab === "all") return true;
                else if (this.state.selectTab === "chats")
                  return item.chat_type === "live_chat";
                else if (this.state.selectTab === "videos")
                  return item.chat_type === "video_chat";
                else if (this.state.selectTab === "assigned")
                  return item.chat_type === "assign_to_me";
                else return false;
              }
              return false;
            });
            //   console.log("openedVisitorList", openedVisitorList);
            let ajaxOpenedVisitorList = (await getOpenedVisitorList()) || {};
            let serverOpenedVisitorList = [];
            const currentAgentId = parseInt(localStorage.getItem("id"));
            if (
              ajaxOpenedVisitorList &&
              ajaxOpenedVisitorList.data &&
              ajaxOpenedVisitorList.data.notificationlist &&
              Array.isArray(ajaxOpenedVisitorList.data.notificationlist)
            ) {
              serverOpenedVisitorList =
                ajaxOpenedVisitorList.data.notificationlist.filter((item) => {
                  if (item.type === "offlineMessage") return false;
                  if (
                    item.agent_id_reject &&
                    item.agent_id_reject
                      .split(",")
                      .includes(currentAgentId.toString())
                  )
                    return false;
                  return true;
                });
              //           assigned: "no"
              // bot_id: "515"
              // chart_started: "yes"
              // chat_type: "live_chat"
              // datetime: "2022-08-03 06:20:21"
              // latestChat: "hi"
              // leads: 0
              // note: ""
              // starred: null
              // status: "closed"
              // total_unread: 0
              // vistor_id: "515-360-23b68c6a86"
              // vistor_name: "visitor-8-030822"
              serverOpenedVisitorList = serverOpenedVisitorList.map((item) => {
                item.vistor_id = item.client_id;
                item.vistor_name = item.client_name;
                item.chat_type = item.type;

                if (item.type === "active_chat") {
                  item.message = "Chat Initiated";
                  item.accept = "assign_to_me";
                  item.status = "assign_to_me";
                } else {
                  item.accept = "ongoing";
                  item.status = "to_accept";
                  if (item.type === "video_chat") {
                    item.message = "VideoChat Initiated";
                  } else if (item.type === "live_chat") {
                    item.message = "LiveChat Initiated";
                  }
                }

                item.datetime = moment().format("YYYY-MM-DD h:mm:ss");
                item.note = "";
                item.leads = 0;
                item.starred = null;
                item.total_unread = 0;
                item.assigned = "no";
                return item;
              });
            }
            let serverVisitorList = Array.isArray(res.visitorlist)
              ? res.visitorlist
              : [];

            let combinedVisitorList = [
              ...openedVisitorList,
              ...serverOpenedVisitorList,
              ...serverVisitorList,
            ];
            // remove duplicate visitor list
            visitorList = this.arrayUniqueByKey(
              combinedVisitorList,
              "vistor_id"
            );
          } else {
            let serverVisitorList = Array.isArray(res.visitorlist)
              ? res.visitorlist
              : [];
            visitorList = [...this.props.visitorList, ...serverVisitorList];
            updateState.requestPaging = false;
            if (serverVisitorList.length === 0) updateState.nextPage = false;
          }

          let firstChat = visitorList[0];
          let activeVisitor = {};
          if (selectVisitor === true && firstChat && firstChat.vistor_id) {
            let params = new URL(document.location).searchParams;
            if (params.get("id")) {
              const clientId = this.decryptBot(params.get("id"));
              const foundVisitor = visitorList.some(
                (item) => item.vistor_id === clientId
              );
              if (foundVisitor) {
                firstChat = visitorList.find(
                  (item) => item.vistor_id === clientId
                );
              }
            }
            updateState.activeVisitor = firstChat;
            updateState.selectedVisitor = true;
          } else if (
            selectVisitor === "active" &&
            this.state.activeVisitor &&
            this.state.activeVisitor.vistor_id
          ) {
            updateState.selectedVisitor = true;
            activeVisitor = visitorList.find(
              (item) => item.vistor_id === this.state.activeVisitor.vistor_id
            );
          }
          const currentAgentId = parseInt(localStorage.getItem("id"));
          _this.setState(updateState, () => {
            this.props.setVisitorList(visitorList).then(() => {
              if (selectVisitor === true && firstChat && firstChat.vistor_id) {
                this.fetchSingleVisitorInfo(firstChat.vistor_id);
                if (firstChat && firstChat.vistor_id)
                  _this.sendMessage({
                    type: "chathistory",
                    bot_id: firstChat.bot_id,
                    client_id: firstChat.vistor_id,
                    agent_id: currentAgentId,
                  });
              } else if (
                selectVisitor === "active" &&
                this.state.activeVisitor &&
                this.state.activeVisitor.vistor_id
              ) {
                this.fetchSingleVisitorInfo(activeVisitor.vistor_id);
                _this.sendMessage({
                  type: "chathistory",
                  bot_id: activeVisitor.bot_id,
                  client_id: activeVisitor.vistor_id,
                  agent_id: currentAgentId,
                });
              }
            });
          });
        },
        () => {
          _this.setState({
            visitorLoading: false,
            loading: false,
            requestPaging: false,
          });
        }
      );
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
  fetchSingleVisitorInfo = (id) => {
    let _this = this;
    _this.setState({ loading: true, visitorDetails: {} });
    let params = `vistorid=${
      _this.state.activeVisitor === undefined
        ? id
        : _this.state.activeVisitor.vistor_id
    }`;
    getSingleVisitorInfo(
      params,
      (res) => {
        if (res.visitordetail && res.visitordetail.length > 0) {
          // update visitor Detail
          const visitorDetail = res.visitordetail[0];
          const activeVisitor = { ..._this.props.activeVisitor };
          activeVisitor.leads = visitorDetail.leads;

          // update Visitor List
          const updatedVisitor = this.props.visitorList.map((item) => {
            if (item.vistor_id === _this.state.activeVisitor.vistor_id) {
              item.leads = visitorDetail.leads;
              item.note = visitorDetail.note;
            }
            return item;
          });
          _this.setState({
            loading: false,
            activeVisitor: activeVisitor,
            visitorDetails: visitorDetail,
          });
          this.props.setVisitorList(updatedVisitor);
        }
      },
      () => {
        _this.setState({ loading: false });
      }
    );
    let params1 = `visitorid=${
      _this.state.activeVisitor === undefined
        ? id
        : _this.state.activeVisitor.vistor_id
    }`;

    fetchLeadsDetails(
      params1,
      (res) => {
        if (res.lead_details !== "No Data Found!") {
          let temp = res.lead_details;
          if (temp.date !== null) {
            let data = temp.date.split("-");
            let d = new Date();
            d.setFullYear(data[0]);
            d.setMonth(data[1]);
            d.setDate(data[2]);
            temp.date = new Date(d);
          }

          _this.setState({
            loading: false,
            showEditLeads: false,
            leadsDetails: temp,
            leadsDetailsMessage: false,
          });
        } else {
          _this.setState({
            leadsDetailsMessage: true,
          });
        }
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };

  updateMarkLeads = (obj) => {
    this.setState({
      loading: true,
    });
    createMarkLeadVisitor(
      obj,
      (res) => {
        // _this.fetchSingleVisitorInfo(result.client_id);
        // _this.props.fetchSingleVisitorInfo();
        if (res.status === "True") {
          this.fetchDataFromServer();
          if (this.state.activeVisitor.vistor_id === obj.vistorid) {
            this.setState({
              loading: false,
              activeVisitor: {
                ...this.state.activeVisitor,
                leads: obj.leads,
              },
            });
          }
          successAlert(res.message, this);
        } else {
          errorAlert(res.message, this);
        }
      },
      (res) => {
        this.setState({
          loading: false,
        });
      }
    );
  };
  render() {
    let _this = this;
    let form = (
      <Fragment>
        <div className="live_conv_section">
          <Grid style={{ height: "100%" }} container>
            <LiverChatFilterComponent
              chatWebscocketAction={this.chatWebscocketAction}
              fetchDataFromServer={(args) => {
                _this.fetchDataFromServer(args);
              }}
              sendMessage={(data) => {
                _this.sendMessage(data);
              }}
              loading={_this.state.chatLoading}
              updateMarkLeads={this.updateMarkLeads}
              visitorList={_this.props.visitorList}
              orderFilter={_this.state.orderFilter}
              activeVisitor={_this.state.activeVisitor}
              searchKeyword={_this.state.searchKeyword}
              {..._this.props}
              _this={_this}
            />
            <Grid item md={12} lg={8} sm={12} xs={12}>
              <div className="live_conv_right">
                {_this.state.selectedVisitor ? (
                  <>
                    <div className="visitor-section">
                      <LiveChatMessageComponent
                        {..._this.props}
                        sendMessage={(data) => {
                          _this.sendMessage(data);
                        }}
                        chatWebscocketAction={this.chatWebscocketAction}
                        updateMarkLeads={this.updateMarkLeads}
                        scollChat={this.scollChat}
                        messages={_this.state.messages}
                        selectedVisitor={_this.state.selectedVisitor}
                        activeVisitor={_this.state.activeVisitor}
                        visitorDetails={_this.state.visitorDetails}
                        leadsDetails={_this.state.leadsDetails}
                        showEditLeads={_this.state.showEditLeads}
                        _this={_this}
                      />
                      <VisitorPersonalInfoComponent
                        {..._this.props}
                        _this={_this}
                        loading={_this.state.loading}
                        chatWebscocketAction={this.chatWebscocketAction}
                        selectedVisitor={_this.state.selectedVisitor}
                        activeVisitor={_this.state.activeVisitor}
                        visitorDetails={_this.state.visitorDetails}
                        leadsDetails={_this.state.leadsDetails}
                        showEditLeads={_this.state.showEditLeads}
                        leadsDetailsMessage={_this.state.leadsDetailsMessage}
                        fetchDataFromServer={(args) => {
                          _this.fetchDataFromServer(args);
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="blank-chat-section">
                      <img src={basket} alt="" />
                      <p className="warning">Please select a chat for view</p>
                      <p className="small-warning">
                        {/* Excepteur sint occaecat cupida.. */}
                      </p>
                    </div>
                  </>
                )}
              </div>
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
              _this.setState(
                {
                  status: "all",
                  nextPage: true,
                  page: 0,
                  selectedVisitor: false,
                  showFilterModal: false,
                  showFilterAnchorEl: null,
                },
                () => {
                  _this.fetchDataFromServer(true);
                }
              );
            }}
          >
            All
          </MenuItem>
          <MenuItem
            role="button"
            onClick={() => {
              _this.setState(
                {
                  status: "assigned",
                  nextPage: true,
                  page: 0,
                  selectedVisitor: false,
                  showFilterModal: false,
                  showFilterAnchorEl: null,
                },
                () => {
                  _this.fetchDataFromServer(true);
                }
              );
            }}
          >
            Open
          </MenuItem>
          <MenuItem
            role="button"
            onClick={() => {
              _this.setState(
                {
                  status: "unread",
                  nextPage: true,
                  page: 0,
                  selectedVisitor: false,
                  showFilterModal: false,
                  showFilterAnchorEl: null,
                },
                () => {
                  _this.fetchDataFromServer(true);
                }
              );
            }}
          >
            Unread
          </MenuItem>
          <MenuItem
            role="button"
            onClick={() => {
              _this.setState(
                {
                  status: "closed",
                  nextPage: true,
                  page: 0,
                  selectedVisitor: false,
                  showFilterModal: false,
                  showFilterAnchorEl: null,
                },
                () => {
                  _this.fetchDataFromServer(true);
                }
              );
            }}
          >
            Closed
          </MenuItem>
          {/* <MenuItem
            role="button"
            onClick={() => {
              _this.setState(
                {
                  status: "week",
                  showFilterModal: false,
                  showFilterAnchorEl: null
                },
                () => {
                  _this.fetchDataFromServer(true);
                }
              );
            }}
          >
            Week
          </MenuItem>
          <MenuItem
            role="button"
            onClick={() => {
              _this.setState(
                {
                  status: "month",
                  showFilterModal: false,
                  showFilterAnchorEl: null
                },
                () => {
                  _this.fetchDataFromServer(true);
                }
              );
            }}
          >
            Month
          </MenuItem>
          <MenuItem
            role="button"
            onClick={() => {
              _this.setState(
                {
                  status: "year",
                  showFilterModal: false,
                  showFilterAnchorEl: null
                },
                () => {
                  _this.fetchDataFromServer(true);
                }
              );
            }}
          >
            Year
          </MenuItem> */}
          <MenuItem
            role="button"
            onClick={(event) => {
              _this.setState({
                status: "duration",
                nextPage: true,
                page: 0,
                selectedVisitor: false,
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
                if (item) {
                  _this.setState(
                    {
                      selection: {
                        selectedVisitor: false,
                        startDate: item.selection.startDate,
                        endDate: item.selection.endDate,
                        key: "selection",
                      },
                    },
                    () => {
                      if (
                        item.selection.startDate &&
                        item.selection.endDate &&
                        item.selection.startDate !== item.selection.endDate
                      ) {
                        _this.fetchDataFromServer(true);
                        _this.setState({
                          showDatePickerAnchorEl: null,
                          showDatePickerFilter: false,
                          showFilterModal: false,
                          showFilterAnchorEl: null,
                        });
                      }
                    }
                  );
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
        {form}
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
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  const newVisitor = state.webchat.newVisitor || [];
  const unReadCount = state.webchat.unReadCount || {};
  const videoChat = state.webchat.videoChat || {};
  const activeVisitor = state.webchat.activeVisitor || {};
  return {
    visitorList: newVisitor,
    unReadCount,
    videoChat,
    activeVisitor,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setUnreadCount: (data) => {
      dispatch(setUnreadCount(data));
    },
    setVideoChatLink: (data) => {
      dispatch(setVideoChatLink(data));
    },
    setVisitorList: (data) => {
      return dispatch(setNewVisitor(data));
    },
    setActiveVisitor: (data) => {
      return dispatch(setActiveVisitor(data));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LiveConversationComponent);
