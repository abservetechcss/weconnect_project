/* eslint-disable no-redeclare */
import React, { useEffect, useState, useContext, useLayoutEffect } from "react";
import mitt from "mitt";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  setNewVisitor,
  setUnreadCount,
  setVideoChatLink,
  setActiveNotify,
  setActiveCalls,
  setOfflineUnread,
  setOfflineMessageList,
} from "../../redux/actions/ReduxActionPage.jsx";
import moment from "moment";
import { useHistory } from "react-router-dom";
import {
  getActiveCalls,
  getServerNotifications,
} from "../users/edit-profile/server/EditProfileServer.js";
import { userLogout } from "../users/login/server/LoginServer";
import { v4 as uuidv4 } from "uuid";
/**
 * This component should never re-render, so avoid using state in provider components
 */
const url = process.env.REACT_APP_ENV_WEBSOCKET_URL;
export const emitter = mitt();
export const MittContext = React.createContext({ emitter });
export const useMitt = () => useContext(MittContext);

let websocket = {};

const openWebsocketConnection = (id) => {
  if (parseInt(id) > 0) {
    const new_websocket_url = url + "?id=" + id;
    websocket = window.WebSocket
      ? new window.WebSocket(new_websocket_url)
      : new window.MozWebSocket(new_websocket_url);
  }
};

if (localStorage.getItem("id")) {
  openWebsocketConnection(localStorage.getItem("id"));
}

const pingPong = {};
const pingPongNotify = {};
let newVisitorData = [];
let newUnreadCount = {};
let videoChatData = {};
let settingsData = {};
let activeVisitor = {};

let activeCalls = [];
let openedNotify = [];

let destroyMethod = false;
let keepAlive;
var randomKey = (Math.random() * 10000).toString();
localStorage.setItem("tabKey", randomKey);

const offlineStatus = () => {
  emitter.emit("websocketActive", true);
};
const onlineStatus = () => {
  emitter.emit("websocketActive", false);
};

const onUnloadFunc = () => {
  if (localStorage.getItem("tabKey") === randomKey) {
    localStorage.removeItem("tabKey");
  }
};

const visibilitychangeFunc = (e) => {
  localStorage.setItem("tabKey", randomKey);
  emitter.emit("visibilitychange", e);
};

export const SocketProvider = ({ children }) => {
  let newVisitor = useSelector((state) => state.webchat.newVisitor);
  let unReadCount = useSelector((state) => state.webchat.unReadCount);
  let videoChat = useSelector((state) => state.webchat.videoChat);
  let active_visitor = useSelector((state) => state.webchat.activeVisitor);
  let usreData = useSelector((state) => state.getUserProfile);

  const history = useHistory();

  let pingWebsocket;
  // const [websocket, setWebsocket] = useState(false);
  const [queue, setqueue] = useState([]);
  const dispatch = useDispatch();

  const getCallNotification = () => {
    getActiveCalls(
      (res) => {
        if (res.status === "True") {
          dispatch(setActiveCalls(res.activechatlist));
        } else {
          dispatch(setActiveCalls([]));
        }
        // console.log(res);
      },
      (err) => {}
    );
  };

  const getNotifications = () => {
    getServerNotifications(
      (res) => {
        if (res.status === "True") {
          const currentAgentId = parseInt(localStorage.getItem("id"));
          let Notification = [];
          debugger;
          if (res.notificationlist) {
            Notification = res.notificationlist.filter((item) => {
              if (
                item.agent_id_reject
                  .split(",")
                  .includes(currentAgentId.toString())
              )
                return false;
              return true;
            });
          }

          // dispatch(setActiveRaibuNotify(Notification));
          dispatch(setActiveNotify(Notification));
        } else {
          // dispatch(setActiveRaibuNotify([]));
          dispatch(setActiveNotify([]));
        }
        // console.log(res);
      },
      (err) => {}
    );
  };

  const processLogout = (e) => {
    if (e.key === "loginStatus") {
      //login status changed
      if (e.newValue !== e.oldValue) {
        let currentLoginStatus = e.newValue;
        if (currentLoginStatus === "true") {
          window.location.reload();
          // if (localStorage.getItem("admin_type") === "agent") {
          //  history.push("/agent/dashboard");
          // } else {
          //     history.push("/user/dashboard");
          // }
        }
      }
      if (e.key === null && e.newValue === null) {
        // logout from other browser
        emitter.emit("logout");
      }
    }
    if (e.key === "id") {
      if (parseInt(e.newValue) > 0) {
        openWebsocketConnection(e.newValue);
        initWebsocket();
      }
    }

    if (e.key === "tabKey" && e.newValue === null) {
      if (localStorage.getItem("tabKey") === null) {
        localStorage.setItem("tabKey", randomKey);
      }
    }
  };

  const initWebsocket = () => {
    if (websocket) {
      websocket.onopen = () => {
        clearTimeout(keepAlive);
        emitter.emit("websocketActive", false);
        emitter.emit("pingWebsocket");

        const currentQueue = queue;
        // first element first out
        let item;
        // eslint-disable-next-line no-cond-assign
        while ((item = currentQueue.shift())) {
          if (websocket.readyState === WebSocket.OPEN) {
            console.log("send From queue", item);
            websocket.send(JSON.stringify(item));
          }
        }
        setqueue(currentQueue);
      };

      websocket.onerror = (e) => {
        emitter.emit("websocketActive", true);
      };

      websocket.onmessage = (evt) => {
        const data = evt.data;
        let result = JSON.parse(data);

        const currentAgentId = parseInt(localStorage.getItem("id"));
        if (result.type === "logout") {
          if (currentAgentId === parseInt(result.user_id)) {
            emitter.emit("logout");
          }
        }

        if (
          result.type === "ping" &&
          result.from === "client" &&
          parseInt(result.agent_id) === currentAgentId
        ) {
          if (result.value === "notify") {
            clearTimeout(pingPongNotify[result.client_id]);
            delete pingPongNotify[result.client_id];
          } else {
            clearTimeout(pingPong[result.client_id]);
            delete pingPong[result.client_id];
          }

          // agent is online, allow display
        }

        if (
          result.type === "ping" &&
          result.from === "trigger" &&
          Array.isArray(result.agent_id) &&
          result.agent_id.includes(currentAgentId)
        ) {
          const activeCallFound = activeCalls.filter(
            (item) => item.client_id === result.client_id
          );
          const openedNotifyFound = openedNotify.filter(
            (item) => item.client_id === result.client_id
          );

          if (activeCallFound.length > 0) {
            emitter.emit("pingActive", activeCallFound);
          }

          if (openedNotifyFound.length > 0) {
            emitter.emit("pingNotify", openedNotifyFound);
          }
        }

        if (result.status !== "False") emitter.emit("getMessage", result);
      };

      websocket.onclose = (e) => {
        emitter.emit("websocketActive", true);
        if (destroyMethod === false) {
          // initKeepAliveTimer();
          const agentId = parseInt(localStorage.getItem("id"));
          console.log("close agentId", agentId);
          if (agentId > 0) {
            openWebsocketConnection(localStorage.getItem("id"));
            initWebsocket();
          } else {
            emitter.emit("websocketActive", false);
          }
        } else {
          console.log("websocket is destroyed!");
        }
        console.log("websocket closing.......");
        if (e) {
          switch (e.code) {
            case 1000:
              console.log("the default, normal closure, code:" + e.code, e);
              break;
            case 1006:
              console.log(
                " no way to set such code manually, indicates that the connection was lost, code:" +
                  e.code,
                e
              );
              break;
            case 1001:
              console.log(
                " the party is going away, e.g. server is shutting down, or a browser leaves the page, code:" +
                  e.code,
                e
              );
              break;
            case 1009:
              console.log(
                "the message is too big to process, code:" + e.code,
                e
              );
              break;
            case 1011:
              console.log("unexpected error on server, code:" + e.code, e);
              break;
            default:
              console.log("Socket is closed. code:", e.code, e);
              console.log(" reason:" + e.reason, e);
          }
        }
      };
    }
  };

  useEffect(
    (data) => {
      if (websocket) {
        // emitter.off('sendMessage');
        // emitter.off('closeWebsocket');

        initWebsocket();

        // sendMessage
        emitter.on("sendMessage", (e) => {
          if (websocket.readyState === WebSocket.OPEN) {
            websocket.send(JSON.stringify(e));
          } else {
            // websocket is not open, push it in queue
            const currentQueue = queue;
            currentQueue.push(e);
            setqueue(currentQueue);
            console.log("websocket.readyState", websocket.readyState);
            openWebsocketConnection(localStorage.getItem("id"));
            initWebsocket();
          }
        });
        // close websocket for testing purpose
        emitter.on("closeWebsocket", (e) => {
          if (websocket.readyState === WebSocket.OPEN) websocket.close();
        });

        emitter.on("pingNotify", (openedNotify) => {
          openedNotify.forEach((item) => {
            let type = item.type;
            if (item.type === "live_chat" || item.type === "video_chat") {
              type = "agentresponse";
            } else if (item.type === "active_chat") {
              type = "assignedactiveuser";
            }
            delete pingPongNotify[item.client_id];
            emitter.emit("ping", {
              client_id: item.client_id,
              bot_id: item.bot_id,
              type: type,
              value: "notify",
            });
          });
        });

        emitter.on("pingActive", (activeCalls) => {
          activeCalls.forEach((item) => {
            delete pingPongNotify[item.client_id];
            if (item.type === "active_chat") {
              emitter.emit("ping", {
                client_id: item.client_id,
                bot_id: item.client_id.split("-")[0],
                type: "endchat",
                value: "active",
              });
            } else if (
              item.type === "live_chat" ||
              item.type === "video_chat"
            ) {
              emitter.emit("ping", {
                client_id: item.client_id,
                bot_id: item.client_id.split("-")[0],
                type: "endchat",
                value: "active",
              });
            }
          });
        });

        emitter.on("pingWebsocket", () => {
          emitter.emit("pingActive", activeCalls);
          emitter.emit("pingNotify", openedNotify);
        });
        // on load
        const onInitPingTimer = setTimeout(() => {
          // if(window.location.pathname!=='/agent/live-conversation')  {
          emitter.emit("pingWebsocket");
        }, 6000);
        //
        const pingPongInterval = setInterval((item) => {
          emitter.emit("pingWebsocket");
        }, 240000);

        // 240000

        return () => {
          clearTimeout(pingPongInterval);
          // clearTimeout(onInitPingTimer);
          emitter.off("pingWebsocket");
          emitter.off("pingActive");
          emitter.off("pingNotify");
          emitter.off("closeWebsocket");
          emitter.off("sendMessage");
        };
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },
    [websocket]
  );

  useEffect(() => {
    newVisitorData = newVisitor;
  }, [newVisitor]);

  useEffect(() => {
    videoChatData = videoChat;
  }, [videoChat]);

  useEffect(() => {
    // eslint-disable-next-line no-self-assign
    newUnreadCount = newUnreadCount;
  }, [unReadCount]);

  useEffect(() => {
    // eslint-disable-next-line no-self-assign
    settingsData = usreData.settings;
    activeCalls = usreData.activeCall;
    openedNotify = usreData.notify;
  }, [usreData]);

  useEffect(() => {
    // eslint-disable-next-line no-self-assign
    activeVisitor = active_visitor;
  }, [active_visitor]);

  const chattranscriptNotification = () => {};

  useEffect(() => {
    // ping websocket
    // eslint-disable-next-line react-hooks/exhaustive-deps
    pingWebsocket = setInterval(() => {
      if (websocket.readyState === WebSocket.OPEN) {
        websocket.send("");
      }
    }, 20000);

    // request notificatin permission
    if (!("Notification" in window)) {
      console.log("Notification not supported in this browser");
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function (permission) {});
    }

    emitter.on("getMessage", (result) => {
      let passMessage = result;
      const currentAgentId = parseInt(localStorage.getItem("id"));
      let soundSettings = {};
      if (
        settingsData &&
        settingsData.notification_settings &&
        !Array.isArray(settingsData.notification_settings)
      ) {
        soundSettings = settingsData.notification_settings;
      }
      if (soundSettings.notification_permission_trigger_checkbox) {
        if (
          Math.max(
            document.documentElement.clientWidth,
            window.innerWidth || 0
          ) < 600
        ) {
          //mobile
          if (soundSettings.mobile_notification !== 1) {
            soundSettings = {};
          }
        } else {
          //desktop
          if (soundSettings.browser_notification !== 1) {
            soundSettings = {};
          }
        }
      }
      if (
        result.type === "connect_agent" &&
        result.agent_id &&
        result.agent_id.includes(currentAgentId)
      ) {
        let message = {
          vistor_id: result.client_id,
          client_id: result.client_id,
          vistor_name: result.client_name,
          client_name: result.client_name,
          chat_type: result.chattype,
          assigned: "no",
          latestChat: "",
          datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
          chart_started: "no",
          leads: 0,
          note: "",
          starred: null,
          status: "to_accept",
          showDateFilter: "Today",
          accept: "ongoing",
          bot_id: result.bot_id,
          bot_name: result.bot_name,
          open: "True",
        };
        // newVisitorData = newVisitor;
        // here we will not get updated redux properties??
        newVisitorData = newVisitorData.filter(
          (item) => item.vistor_id !== message.vistor_id
        );
        newVisitorData.unshift(message);
        dispatch(setNewVisitor([...newVisitorData]));

        openedNotify = openedNotify.filter((item) => {
          return item.vistor_id !== result.client_id;
        });
        debugger;
        openedNotify.unshift(message);
        dispatch(setActiveNotify(openedNotify));

        // provide condition based on UserID
        // Todo: provide notification based on chat method
        if (localStorage.getItem("tabKey") === randomKey) {
          if (result.chattype === "video_chat") {
            var options = {
              title: "Video Chat-" + result.bot_name,
              body: "Video Chat Initiated!",
              closeTime: 10000,
              icon: process.env.REACT_APP_LOGO,
            };
            message.type = "video_chat";
            if (
              soundSettings.video_call_checkbox &&
              localStorage.getItem("tabKey") === randomKey
            ) {
              emitter.emit("soundAlert", soundSettings.video_call_value);
            }
            if (
              "Notification" in window &&
              Notification.permission === "granted"
            )
              new Notification(options.title, options);
          } else {
            var options = {
              title: "Live Chat-" + result.bot_name,
              body: "Live Chat Initiated!",
              closeTime: 10000,
              icon: process.env.REACT_APP_LOGO,
            };
            message.type = "live_chat";
            if (
              soundSettings.live_chat_checkbox &&
              localStorage.getItem("tabKey") === randomKey
            ) {
              emitter.emit("soundAlert", soundSettings.live_chat_value);
            }
            if (
              "Notification" in window &&
              Notification.permission === "granted"
            )
              new Notification(options.title, options);
          }
        }

        emitter.emit("sendMessage", {
          type: "totalunread",
          unread_from: "agent",
          bot_id: result.client_id.split("-")[0],
          client_id: result.client_id,
          agent_id: currentAgentId,
        });
        emitter.emit("chatNotification", result);
      }
      //  else if (result.type === "accept") {

      //   if (result.value === "decline") {
      //     let data = newVisitorData.filter((item) => item.vistor_id !== result.client_id)
      //     dispatch(setNewVisitor(data));
      //   }
      // }
      else if (
        result.type === "chat" &&
        result.from === "client" &&
        parseInt(result.agent_id) === currentAgentId
      ) {
        if (activeVisitor.vistor_id !== result.client_id) {
          emitter.emit("sendMessage", {
            type: "totalunread",
            unread_from: "agent",
            bot_id: result.client_id.split("-")[0],
            client_id: result.client_id,
            agent_id: currentAgentId,
          });
        }
        if (localStorage.getItem("tabKey") === randomKey) {
          if (
            (activeVisitor && activeVisitor.vistor_id !== result.client_id) ||
            document.hidden
          ) {
            // unread alert
            if (soundSettings.unread_message_checkbox) {
              emitter.emit("soundAlert", soundSettings.unread_message_value);
            } else if (soundSettings.message_received_checkbox) {
              emitter.emit("soundAlert", soundSettings.message_received_value);
            }
          } else {
            if (soundSettings.message_received_checkbox) {
              emitter.emit("soundAlert", soundSettings.message_received_value);
            }
          }
        }
      } else if (
        result.type === "chat" &&
        result.from === "agent" &&
        parseInt(result.agent_id) === currentAgentId
      ) {
        if (
          soundSettings.message_sent_checkbox &&
          localStorage.getItem("tabKey") === randomKey
        ) {
          emitter.emit("soundAlert", soundSettings.message_sent_value);
        }
      } else if (
        result.type === "totalunread" &&
        parseInt(result.agent_id) === currentAgentId
      ) {
        const unread = parseInt(result.totalunread);
        if (unread > 0) {
          newUnreadCount[result.client_id] = unread;
        } else {
          newUnreadCount[result.client_id] = 0;
        }

        dispatch(setUnreadCount({ ...newUnreadCount }));
      } else if (
        result.type === "updateunread" &&
        parseInt(result.agent_id) === currentAgentId
      ) {
        newUnreadCount[result.client_id] = 0;
        dispatch(setUnreadCount({ ...newUnreadCount }));
      } else if (
        result.type === "agentresponse" &&
        result.statusType === "Accept"
      ) {
        let assignStatus = null;
        if (parseInt(result.agent_id) === currentAgentId) {
          assignStatus = "insert";
        } else {
          const visitorFound = newVisitorData.some((item) => {
            return item.vistor_id === result.client_id;
          });
          if (visitorFound) {
            assignStatus = "filter";
          }
        }
        // agent  has been accepted
        // remove old visitor Data in redux & move to state on accept
        if (assignStatus !== null) {
          let UpdatedChat = false;
          newVisitorData = newVisitorData.filter((item) => {
            if (item.vistor_id === result.client_id) {
              UpdatedChat = item;
              return false;
            }
            return true;
          });
          dispatch(setNewVisitor([...newVisitorData]));
          // remove notification & add it to activecalls
          getCallNotification();
          getNotifications();

          if (UpdatedChat && assignStatus === "insert") {
            UpdatedChat.accept = "true";
            if (result.agentvideolink) {
              const video_link = `<a href="${result.agentvideolink}" target="_blank">${result.message}</a>`;
              dispatch(
                setVideoChatLink({
                  ...videoChatData,
                  [result.client_id]: video_link,
                })
              );
            }
            // insert this chat in state
            passMessage.insertChat = UpdatedChat;
          }
        }
      } else if (
        result.type === "agentresponse" &&
        parseInt(result.agent_id) === 0 &&
        result.offline_form !== "No"
      ) {
        // counter timeout, remove that visitor form redux,

        // let data = newVisitorData.map((item) => {
        //   if(item.vistor_id === result.client_id)
        //   {
        //     delete item.accept;
        //     item.status = 'endchatrefresh';
        //     item.message = "Timer Ended"; /// client has left the bot on condition, endchatrefresh
        //   }
        //   return item;
        // });
        let data = newVisitorData.filter(
          (item) => item.vistor_id !== result.client_id
        );
        dispatch(setNewVisitor(data));
        passMessage.deactiveSelect = true;
        // getCallNotification();
        getNotifications();
      } else if (
        result.type === "agentresponse" &&
        parseInt(result.agent_id) === currentAgentId &&
        result.value === "reject"
      ) {
        // counter timeout, remove that visitor form redux,

        // let data = newVisitorData.map((item) => {
        //   if(item.vistor_id === result.client_id)
        //   {
        //     delete item.accept;
        //     item.status = 'endchatrefresh';
        //     item.message = "Timer Ended"; /// client has left the bot on condition, endchatrefresh
        //   }
        //   return item;
        // });
        let data = newVisitorData.filter(
          (item) => item.vistor_id !== result.client_id
        );
        dispatch(setNewVisitor(data));

        const newVisitorList = openedNotify.filter((item) => {
          const vistorId = item.vistor_id || item.client_id;
          return vistorId !== result.client_id;
        });
        dispatch(setActiveNotify(newVisitorList));
        passMessage.deactiveSelect = true;
      } else if (result.type === "assignedactiveuser") {
        let assignStatus = null;
        if (parseInt(result.agent_id) === currentAgentId) {
          assignStatus = "insert";
        } else {
          const visitorFound = newVisitorData.some((item) => {
            return item.vistor_id === result.client_id;
          });
          if (visitorFound) {
            assignStatus = "filter";
          }
        }
        if (assignStatus !== null) {
          let UpdatedChat = false;
          newVisitorData = newVisitorData.filter((item) => {
            if (item.vistor_id === result.client_id) {
              UpdatedChat = item;
              return false;
            }
            return true;
          });
          if (result.statusType === "Reject") passMessage.deactiveSelect = true;
          dispatch(setNewVisitor([...newVisitorData]));
          if (UpdatedChat && assignStatus === "insert") {
            UpdatedChat.accept = "true";
            // insert this chat in state
            passMessage.insertChat = UpdatedChat;
          }
          getCallNotification();
          getNotifications();
        }
      } else if (
        result.type === "endchat" &&
        parseInt(result.agent_id) === currentAgentId
      ) {
        getCallNotification();
      } else if (
        result.type === "videochatclosed" &&
        parseInt(result.agent_id) === currentAgentId
      ) {
        // && parseInt(result.agent_id) === currentAgentId
        getCallNotification();
      } else if (
        result.type === "videochatlink" &&
        parseInt(result.agent_id) === currentAgentId
      ) {
      } else if (
        result.type === "videoLeft" &&
        parseInt(result.agent_id) === currentAgentId
      ) {
        let data = newVisitorData.map((item) => {
          if (item.vistor_id === result.client_id) {
            delete item.accept;
            item.status = "videoLeft";
            item.message = "Client Left the ChatBot"; /// client has left the bot on condition, endchatrefresh
          }
          return item;
        });
        dispatch(setNewVisitor(data));
      } else if (result.type === "chathistory") {
      } else if (result.type === "endchatrefresh") {
        let data = newVisitorData.filter(
          (item) => item.vistor_id !== result.client_id
        );
        getNotifications();
        getCallNotification();
        dispatch(setNewVisitor(data));
        passMessage.deactiveSelect = true;
      } else if (
        result.agent_ids &&
        result.agent_ids.includes(currentAgentId) &&
        (result.type === "offlineform_response" ||
          result.type === "replyemailclent")
      ) {
        // debugger;
        if (result.type === "offlineform_response") {
          emitter.emit("chatNotification", result);
          dispatch(setOfflineMessageList(result));
        } else {
        }
        emitter.emit("getOfflineMessage", result);
        return;
      } else if (
        result.agent_ids &&
        result.agent_ids.includes(currentAgentId)
      ) {
        console.log("result.type not defined", result.type);
        const visitorFound = newVisitorData.some((item) => {
          return item.vistor_id === result.client_id;
        });
        if (visitorFound) {
        } else {
          let message = {
            vistor_id: result.client_id,
            client_id: result.client_id,
            vistor_name: result.client_name,
            client_name: result.client_name,
            chat_type: "assign_to_me",
            message: "Chat Initiated",
            assigned: "no",
            latestChat: "",
            datetime: moment().format("YYYY-MM-DD HH:mm:ss"),
            chart_started: "no",
            leads: 0,
            note: "",
            starred: null,
            status: "assign_to_me",
            showDateFilter: "Today",
            accept: "assign_to_me",
            open: "True",
            bot_id: result.bot_id,
            bot_name: result.bot_name,
          };
          newVisitorData = newVisitorData.filter(
            (item) => item.vistor_id !== message.vistor_id
          );
          newVisitorData.unshift(message);
          dispatch(setNewVisitor([...newVisitorData]));

          message.type = "active_chat";
          openedNotify = openedNotify.filter((item) => {
            return item.vistor_id !== result.client_id;
          });
          openedNotify.unshift(message);
          dispatch(setActiveNotify(openedNotify));
          if (localStorage.getItem("tabKey") === randomKey) {
            var options = {
              title: "Chat-" + result.bot_name,
              body: "Chat Initiated!",
              closeTime: 10000,
              icon: process.env.REACT_APP_LOGO,
            };
            if (
              "Notification" in window &&
              Notification.permission === "granted"
            )
              new Notification(options.title, options);

            if (soundSettings.new_visitors_checkbox) {
              emitter.emit("soundAlert", soundSettings.new_visitors_value);
            }
          }
          emitter.emit("chatNotification", result);
        }
      } else if (
        result.type === "chatbot" &&
        result.client_id === activeVisitor.vistor_id
      ) {
      } else {
        // check if if is offline message type
        if (parseInt(result.agent_id) === currentAgentId) {
          if (
            result.type === "replyemailagent" ||
            result.type === "email" ||
            result.type === "replyemailclent"
          ) {
            emitter.emit("getOfflineMessage", result);
            return;
          } else {
            // console.log("none of the ws type", result);
            return;
          }
        }
        // console.log("none of the ws type", result);
        return;
      }
      emitter.emit("getMessageSub", passMessage);
    });

    const audioFile = new Audio();
    emitter.on("soundAlert", (src) => {
      if (src) {
        audioFile.pause();
        audioFile.src = src;
        audioFile.load();
        audioFile.play();
      }
    });

    window.addEventListener("storage", processLogout);
    window.addEventListener("offline", offlineStatus);
    window.addEventListener("online", onlineStatus);
    window.addEventListener("unload", onUnloadFunc);
    window.addEventListener("visibilitychange", visibilitychangeFunc);
    // initiate global chat
    if (window.WeConnect && window.WeConnect.constructor) {
      const botId = process.env.REACT_APP_LOAD_BOT;
      window.WeConnect.constructor({}).render(
        document.getElementById("weconnect_bot"),
        {
          mode: "widget",
          hostId: "webchat",
          editMode: "design2",
          botId: botId,
          key: "webchat",
          storageKey: "webchat",
          id: "webchat",
        }
      );
    }
    return () => {
      // destroy  method
      clearTimeout(pingWebsocket);
      // clearTimeout(pingPongInterval)
      emitter.all.clear();
      window.removeEventListener("storage", processLogout);
      window.removeEventListener("offline", offlineStatus);
      window.removeEventListener("online", onlineStatus);
      window.removeEventListener("unload", onUnloadFunc);
      window.removeEventListener("visibilitychange", visibilitychangeFunc);
      if (websocket) {
        destroyMethod = true;
        websocket.close();
      }
    };
  }, []);

  useLayoutEffect(() => {
    emitter.on("ping", (obj) => {
      if (websocket.readyState === WebSocket.OPEN) {
        // start 10 sec timer
        if (obj.value === "notify") {
          pingPongNotify[obj.client_id] = setTimeout(() => {
            if (pingPongNotify[obj.client_id]) {
              delete pingPongNotify[obj.client_id];
              // according to type end chat there
              let agentId = parseInt(localStorage.getItem("id"));
              if (agentId > 0) {
                if (obj.type === "endchat") {
                  agentId = 0;
                }

                emitter.emit("sendMessage", {
                  type: obj.type,
                  bot_id: obj.bot_id,
                  value: "reject",
                  client_id: obj.client_id,
                  agent_id: agentId,
                });
              }
            }
          }, 6000);

          emitter.emit("sendMessage", {
            type: "ping",
            value: "notify",
            subtype: obj.type,
            from: "agent",
            client_id: obj.client_id,
            bot_id: obj.bot_id,
            agent_id: parseInt(localStorage.getItem("id")),
          });
        } else if (obj.value === "active") {
          pingPong[obj.client_id] = setTimeout(() => {
            if (pingPong[obj.client_id]) {
              delete pingPong[obj.client_id];
              // according to type end chat there
              let agentId = parseInt(localStorage.getItem("id"));
              if (agentId > 0) {
                if (obj.type === "endchat") {
                  agentId = 0;
                }
                emitter.emit("sendMessage", {
                  type: obj.type,
                  bot_id: obj.bot_id,
                  value: "active",
                  client_id: obj.client_id,
                  agent_id: agentId,
                });
              }
            }
          }, 6000);

          emitter.emit("sendMessage", {
            type: "ping",
            value: "active",
            subtype: obj.type,
            from: "agent",
            client_id: obj.client_id,
            bot_id: obj.bot_id,
            agent_id: parseInt(localStorage.getItem("id")),
          });
        }
      }
    });

    emitter.on("logout", () => {
      localStorage.clear();
      localStorage.setItem("loginStatus", false);
      websocket.close();
      history.push("/login");
    });

    emitter.on("login", (userInfo) => {
      openWebsocketConnection(userInfo.id);
    });

    emitter.on("unauthorized", () => {
      console.log("Unauthorized API");
      if (localStorage.getItem("loginStatus") === "true") {
        if (localStorage.getItem("admin_type") === "agent") {
          history.push("/agent/dashboard");
        } else {
          history.push("/user/dashboard");
        }
      } else {
        emitter.emit("logout");
        userLogout();
      }
    });

    emitter.on("pushRoute", (path) => {
      history.push(path);
    });

    return () => {
      emitter.off("ping");
      emitter.off("pushRoute");
      emitter.off("unauthorized");
      emitter.off("logout");
    };
  }, []);

  return (
    <MittContext.Provider value={{ emitter, websocket }}>
      {children}
    </MittContext.Provider>
  );
};

export default SocketProvider;
