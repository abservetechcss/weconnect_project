/**
 * This is common file where logic for embed, landing, widget is made
 *
 */

import "yet-another-abortcontroller-polyfill";
import { fetch } from "whatwg-fetch";

import React from "react";
// import {createRoot} from 'react-dom/client';
import { render } from "react-dom";
import { Webchat } from "./widget";
import { ReactBot } from "./react-bot";
import { WebchatApp } from "./webchat-app";
import merge from "lodash.merge";

import { SENDERS, MODES, GDPR_COOKIE } from "../constants";

// import { onDOMLoaded } from "../util/dom";

import { getCookie, } from "./lib";

const backButton = {}; //orderId: backbutotntruorfalse
export class SelfHostedApp extends WebchatApp {
  constructor({
    persistentMenu,
    coverComponent,
    blockInputs,
    enableEmojiPicker,
    enableAttachments,
    enableUserInput,
    enableAnimations,
    shadowDOM,
    hostId,
    storage,
    storageKey,
    onInit,
    onOpen,
    onClose,
    onMessage,
    ...botOptions
  } = {}) {
    super({
      persistentMenu,
      coverComponent,
      blockInputs,
      enableEmojiPicker,
      enableAttachments,
      enableUserInput,
      enableAnimations,
      shadowDOM,
      hostId,
      storage,
      storageKey,
      onInit,
      onOpen,
      onClose,
      onMessage,
    });
    //bind this operator
    this.loadInitialResponse = this.loadInitialResponse.bind(this);
    this.websocketConnect = this.websocketConnect.bind(this);
    this.WebsocketkeepAlive = this.WebsocketkeepAlive.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.agentIds = [];
    const query = new URLSearchParams(window.location.search);
    const bot_type = query.get("type") || "widget";

    this.state = {
      ws: null,
      questions: [],
      step: null,
      bot_type: bot_type,
      queue: [],
    };

    this.bot = new ReactBot({
      ...botOptions,
    });
    this.leads = {};
    this.mode = "";
    this.connectAgentTimer = null;
    this.currentQuestion = {};
    this.questionStep = 0;
    this.client_id = null;
    this.interacted = false;
    this.flowId = null;
    this.botId = null;
    this.botType = "Landing";
    this.agentId = 0;
    this.previewMode = false;
    this.session_id = 0;
    this.delayTimeout = null;
  }

  closeBrowser = (e) => {
    if (e) {
      e.preventDefault();
    }
    if (window.location.href.includes('pingpongTest'))
      return;
    if (this.webchatRef.current && this.webchatRef.current.getwebchatState) {
      const webchatState =
        this.webchatRef.current.getwebchatState();
      const lastRoutePath = webchatState.lastRoutePath;

      if (lastRoutePath === "human_handoff") { //timer ongoing
        this.ws.send(JSON.stringify({
          type: "agentresponse",
          value: "decline",
          bot_id: this.botId,
          client_id: this.client_id,
          agent_id: 0,
        })
        );
      } else if (lastRoutePath === "connected" || lastRoutePath === "videochatlink" || lastRoutePath === "assign_to_me" || lastRoutePath === 'videoChatinit') {
        this.ws.send(
          JSON.stringify({
            type: "endchat",
            bot_id: this.botId,
            client_id: this.client_id,
            agent_id: 0,
          })
        );

      }
      // else if(lastRoutePath === 'videoChatinit') {
      //   this.ws.send(
      //     JSON.stringify({
      //       type: "videoLeft",
      //       bot_id: this.botId,
      //       client_id: this.client_id,
      //       agent_id: this.agentId,
      //     })
      //   );
      // } 
      else {
        this.ws.send(
          JSON.stringify({
            type: "endchatrefresh",
            bot_id: this.botId,
            client_id: this.client_id,
          })
        );
      }
    }
    // this.chattranscriptNotification();

    // if(this.interacted) {
    //   var confirmationMessage = "Are you sure to leave the chat";
    //   (e || window.event).returnValue = confirmationMessage; //Gecko + IE
    //   return confirmationMessage;  
    // }
  }

  pongTrigger = (e) => {
    if (e) {
      e.preventDefault();
    }

    if (this.agent_ids && this.agent_ids.length > 0) {
      if (document.visibilityState === 'unloaded' || document.visibilityState === 'hidden') {
        console.log("Pingpong trigger");
        this.ws.send(JSON.stringify({
          type: "ping",
          from: "trigger",
          bot_id: this.botId,
          client_id: this.client_id,
          agent_id: this.agent_ids,
        }));
      }
    }
  }

  static getDerivedStateFromError(error) {
    console.log("Error section in widget works", error);
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.log("error logged", error, info);
  }

  loadInitialResponse = async () => {
    this.setTyping(true);
    this.questionStep = 0;
    this.fetchNextQuestion(0);
    // GDPR Dialog
    let webchatState = this.webchatRef.current.getwebchatState();
    const gdpr_cc = ["AT", "BE", "BG", "CY", "CH", "CZ", "DE", "DK", "EE", "ES", "FI", "FR",
      "GB", "GR", "HR", "HU", "IE", "IS", "IT", "LI", "LT", "LU", "LV", "MT", "NL", "NO",
      "PL", "PT", "RO", "SE", "SI", "SK"];


    if (webchatState.session.environment && webchatState.gdpr === 1 && webchatState.gdprMessage && gdpr_cc.includes(webchatState.session.environment.country_code) && !getCookie(GDPR_COOKIE + this.botId)) {
      this.updateChatSettings({
        modal: {
          open: true,
          type: "gdpr",
          text: webchatState.gdprMessage
        }
      });
    }

  };

  setPreviewMode = (value) => {
    this.updateChatSettings({ previewMode: value });
    this.previewMode = value;
  };

  WebsocketkeepAlive() {
    if (this.ws && this.ws.readyState === this.ws.OPEN) {
      this.ws.send("");
    }
  }

  updateChatSettings(settings) {
    this.webchatRef.current.updateChatSettings(settings);
  }

  addUserMessage(message) {
    this.webchatRef.current.addUserMessage(message);
    if (message.payload) {
      switch (message.payload) {
        case "welcome_card":
        case "multi_choice":
        case "date":
        case "multi_select":
        case "message":
        case "opinion_scale":
        case "range":
        case "file_upload":
        case "carousal":
        case "rating":
        case "offline_form":
        case "videoChatinit":
        case "appointment":
        case "links":
        case "human_handoff":
        case "off_chat":
        case "connect_agent":
          this.webchatRef.current.setHandoff(true);
          break;
        default:
          this.webchatRef.current.setHandoff(false);
      }
    }
  }

  websocketConnect = async () => {
    if (this.ws && this.ws.readyState === this.ws.OPEN) {
      console.log("connection prevented");
      this.setSocket(true);
      return;
    }
    if (this.client_id) {
      this.ws = new WebSocket(process.env.REACT_APP_ENV_WEBSOCKET_URL + "?id=" + this.client_id);
      let _this = this;

      this.ws.onopen = () => {
        this.setSocket(true);
        this.updateUser({
          ws: this.ws,
        });
        if (this.timerWs) {
          clearInterval(this.timerWs);
        }
        console.log("[open] Connection established");
      };

      this.ws.onerror = (error) => {
        this.setSocket(false);
        this.updateUser({
          ws: this.ws,
        });
        if (this.timerWs) {
          clearInterval(this.timerWs);
        }
        console.log(`[error] ${error.message}`);
      };

      this.ws.onclose = (e) => {
        this.setSocket(false);
        if (this.client_id) {
          this.timerWs = setTimeout(() => {
            _this.websocketConnect();
          }, 1000);
        }
        if (e) {
          switch (e.code) {
            case 1000:
              console.log("the default, normal closure, code:" + e.code, e);
              break;
            case 1006:
              console.log(" no way to set such code manually, indicates that the connection was lost, code:" + e.code, e);
              break;
            case 1001:
              console.log(" the party is going away, e.g. server is shutting down, or a browser leaves the page, code:" + e.code, e);
              break;
            case 1009:
              console.log("the message is too big to process, code:" + e.code, e);
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

      this.ws.onmessage = async (event) => {
        const data = JSON.parse(event.data);
        if (data.client_id && data.client_id === this.client_id) {

          this.interacted = true;

          if (data.type === "ping" && data.from === "agent") { //pong request
            data.from = "client";
            this.sendMessage(data);
            return;
          }
          if (data.status !== "True" && data.type !== "updateunread") {
            this.addUserMessage({
              type: "text",
              from: "bot",
              data: "something went wrong",
            });
            this.fetchNextQuestion(this.questionStep);
            return;
          }
          if (data.agent_id) {
            if (Array.isArray(data.agent_id)) {
              this.agent_ids = data.agent_id;
            } else if (parseInt(data.agent_id) > 0) {
              this.agent_ids = [data.agent_id];
            }
          }
          // Hand question steps
          if (this.session_id === 0 && data.session_id && data.session_id !== "0") {
            this.session_id = data.session_id;
            this.webchatRef.current.updateChatSettings({ session_id: this.session_id });
          }
          if (data["chatbot_type"] === "appointment" && data["meeting_link"] !== "" && data["answer_id"] !== "Skip") {
            if (this.currentQuestion && this.currentQuestion.component) {
              data.message_booked = this.currentQuestion.component.booked;
              data.message_confirmation = this.currentQuestion.component.message_confirmation;
            }
            this.addUserMessage({
              type: "postback",
              payload: "appointment_confirmed",
              item: data,
            });
          }

          if (parseInt(data["jump_to"]) >= 0) {
            this.questionStep = parseInt(data["jump_to"]);
            this.updateChatSettings({ questionStep: this.questionStep });
            this.fetchNextQuestion(this.questionStep);
            return;
          }

          if (data["jump_to"] === -1) { // end conversation
            let webchatState = this.webchatRef.current.getwebchatState();
            this.questionStep = webchatState.chatsettings.total_questions;
            this.updateChatSettings({ questionStep: this.questionStep });
            this.webchatRef.current.setHandoff(true);
            this.setTyping(false);
            return;
          }

          if (data.leads && data.leads === "True" && data.leadtags && data.answer_id) {
            this.leads[data.leadtags] = data.answer_id;
          }

          if (
            data["chatbot_type"] === "text_question" ||
            data["chatbot_type"] === "multi_choice" ||
            data["chatbot_type"] === "welcome_card" ||
            data["chatbot_type"] === "number" ||
            data["chatbot_type"] === "phone_number" ||
            data["chatbot_type"] === "email" ||
            data["chatbot_type"] === "date" ||
            data["chatbot_type"] === "multi_select" ||
            data["chatbot_type"] === "file_upload" ||
            data["chatbot_type"] === "carousal" ||
            data["chatbot_type"] === "rating" ||
            data["chatbot_type"] === "range" ||
            data["chatbot_type"] === "opinion_scale" ||
            data["chatbot_type"] === "appointment" ||
            data["chatbot_type"] === "links" ||
            data["chatbot_type"] === "offline_form"
          ) {
            this.questionStep = this.questionStep + 1;
            this.updateChatSettings({ questionStep: this.questionStep });
            this.fetchNextQuestion(this.questionStep);
            return;
          }
          // response from Agent
          if (data["type"]) {
            // why apiTeam send message in different params??
            if (data["type"] === "human_takeover") {
              this.webchatRef.current.setHandoff(false);
              const message =
                data.msgText ||
                "agent has assigned themeselves to connect with you";
              this.agentId = data.agent_id;
              this.addUserMessage({
                type: "postback",
                payload: "human_takeover",
                item: { label: message },
              });
            } else if (data["type"] === "chat" && data["from"] === "agent") {
              let webchatState = this.webchatRef.current.getwebchatState();
              const lastRoutePath = webchatState.lastRoutePath;
              if (lastRoutePath !== "assign_to_me" && lastRoutePath !== "videochatlink" && lastRoutePath !== "connected")
                return;
              if (data.answer_id) {
                const sendData = {
                  from: "bot",
                }
                if (data.answer_id === "location") {
                  sendData.data = data.text;
                  sendData.type = data.answer_id;
                } else {
                  let type = "image";
                  if (["pdf", "doc", "docx", "xls", "xlsx", "ppt", "pptx", "rtf", "odt", "odp", "ods"].includes(data.answer_id)) {
                    type = "document";
                  } else if (["mpeq", "wav", "mp3", "ogg", "webm"].includes(data.answer_id)) {
                    type = "audio";
                  }
                  sendData.type = type;
                  sendData.src = data.text;
                }
                this.addUserMessage(sendData);

              } else {
                this.addUserMessage({
                  type: "text",
                  from: "bot",
                  data: data.text,
                });
              }
              // send total unread count if cover component is not opened or webchat is not opened
              if (this.mode === "widget") {

                if (!webchatState.isWebchatOpen && !webchatState.isCoverComponentOpen && webchatState.session) {
                  this.sendMessage({
                    'type': 'totalunread',
                    'unread_from': 'client',
                    'agent_id': this.agentId,
                    'bot_id': webchatState.session.bot.id,
                    'client_id': webchatState.session.bot.client_id,
                  });
                } else if (webchatState.isWebchatOpen && !webchatState.isCoverComponentOpen && !document.hidden && webchatState.session) {
                  // send update unread count if webchat is open & cover component is not opened
                  this.sendMessage({
                    'type': 'updateunread',
                    'bot_id': webchatState.session.bot.id,
                    'unread_from': 'client',
                    'client_id': webchatState.session.bot.client_id,
                    'agent_id': this.agentId
                  });
                  this.updateChatSettings({ unreadCount: 0 });
                }
              }
            } else if (data['type'] === 'chat' && data["from"] === 'client') {
              this.webchatRef.current.updateSendStatus(data.message_id);
            } else if (data['type'] === 'updateunread' && data["unread_from"] === 'agent') {
              this.webchatRef.current.updateReadStatus(data.message_id);
            }
            else if (data["type"] === "totalunread") {
              this.updateChatSettings({ unreadCount: data.totalunread });
            }
            else if (data["type"] === "videochatlink") {
              let webchatState = this.webchatRef.current.getwebchatState();
              const lastRoutePath = webchatState.lastRoutePath;
              if (lastRoutePath !== "assign_to_me" && lastRoutePath !== "videochatlink" && lastRoutePath !== "connected")
                return;

              this.addUserMessage({
                type: "postback",
                payload: "videochatlink",
                item: data,
              });
            } else if (data["type"] === "agentresponse") {
              if (data["value"] === "reject") {
                return;
              }
              clearTimeout(this.connectAgentTimer);
              if (data.offline_form === "No") {
                this.agentId = data.agent_id || 0;
                if (data.chattype && data.chattype === "video_chat") {
                  this.webchatRef.current.setHandoff(true);
                  if (this.agentId) {
                    this.addUserMessage({
                      type: "postback",
                      payload: "videoChatinit",
                      item: data,
                    });
                  }
                } else {
                  this.webchatRef.current.setHandoff(false);
                  if (this.agentId) {
                    this.addUserMessage({
                      type: "postback",
                      payload: "connected",
                      item: data,
                    });
                  }
                }
              } else {
                if (data["offline_form_status"] === 0 || data["offline_form"] === "" || data["offline_form_enable"] === 0) {
                  this.addUserMessage({
                    type: "text",
                    from: "bot",
                    data: data.message,
                  });
                  this.questionStep = this.questionStep + 1;
                  this.updateChatSettings({ questionStep: this.questionStep });
                  this.fetchNextQuestion(this.questionStep);
                } else {
                  data.leads = this.leads;
                  this.addUserMessage({
                    type: "postback",
                    payload: "offline_form",
                    item: data,
                  });
                }
              }
            } else if (data["type"] === "assignedactiveuser" && data["statusType"] !== "Reject") {
              this.webchatRef.current.setHandoff(false);
              this.agentId = data.agent_id || 0;
              if (this.agentId) {
                let webchatState = this.webchatRef.current.getwebchatState();
                this.questionStep = webchatState.chatsettings.total_questions;
                this.updateChatSettings({ questionStep: this.questionStep });
                this.abortAllAPi();
                this.addUserMessage({
                  type: "postback",
                  payload: "assign_to_me",
                  item: data,
                });
              }
            } else if (data["type"] === "connect_agent" || data["chatbot_type"] === "connect_agent") {
              if (data.offline_form === "No") {
                this.addUserMessage({
                  type: "postback",
                  payload: "human_handoff",
                  item: data,
                });
                // counter is provided here, because component unmount issue comes if provided in any inner parts
                const webchatState =
                  this.webchatRef.current.getwebchatState();
                let myCount = 30;
                if (data.chattype === "live_chat")
                  myCount = webchatState.agent_sla_time_livechat;
                else
                  myCount = webchatState.agent_sla_time_videocall;
                this.connectAgentTimer = setInterval(() => {
                  if (myCount < 0) {
                    clearTimeout(this.connectAgentTimer);
                    this.ws.send(
                      JSON.stringify({
                        type: "agentresponse",
                        value: "decline",
                        bot_id: this.botId,
                        client_id: this.client_id,
                        agent_id: 0,
                      })
                    );
                    // websocket.send(
                    //   JSON.stringify({
                    //     type: "upateLiveCounter",
                    //     client_id: bot.client_id,
                    //   })
                    // );
                    return;
                  }
                  this.webchatRef.current.weConnectUpdateSession({
                    counter: myCount,
                  });
                  myCount = myCount - 1;
                }, 1000);
              } else {

                if (data.skiptype === 1) {
                  this.questionStep = this.questionStep + 1;
                  this.updateChatSettings({ questionStep: this.questionStep });
                  this.fetchNextQuestion(this.questionStep);
                  return;
                }
                // handle offline form here
              }
            }
            else if (data["type"] === "off_chat") {
              if (data["offline_form_status"] === 0 || data["offline_form"] === "") {
                this.addUserMessage({
                  type: "text",
                  from: "bot",
                  data: data.message,
                });
                this.questionStep = this.questionStep + 1;
                this.updateChatSettings({ questionStep: this.questionStep });
                this.fetchNextQuestion(this.questionStep);
              } else {
                data.leads = this.leads;
                this.addUserMessage({
                  type: "postback",
                  payload: "offline_form",
                  item: data,
                });
              }
            } else if (data["type"] === "restartChat") {
              this.addUserMessage({
                type: "postback",
                payload: "restartChat",
                item: data,
              });
            }
            else if (data["type"] === "endchat") {

              this.addUserMessage({
                type: "postback",
                payload: "endchat",
                item: {
                  message: "Chat Ended!"
                },
              });
              this.webchatRef.current.setHandoff(false);
              this.questionStep = this.questionStep + 1;
              this.updateChatSettings({ questionStep: this.questionStep });
              this.fetchNextQuestion(this.questionStep);
            }
            else if (data["type"] === "videochatclosed") {
              this.addUserMessage({
                type: "text",
                from: "bot",
                data: "Video Chat Ended"
              });
              this.questionStep = this.questionStep + 1;
              this.updateChatSettings({ questionStep: this.questionStep });
              this.fetchNextQuestion(this.questionStep);
            }
            else if (data["type"] === "offlineform_response") {
              this.addUserMessage({
                type: "text",
                from: "bot",
                data: data.message,
              });
              this.questionStep = this.questionStep + 1;
              this.updateChatSettings({ questionStep: this.questionStep });
              this.fetchNextQuestion(this.questionStep);
            }
          } else if (data["from"] && data["from"] === "agent") {
            this.addUserMessage({
              type: "text",
              from: "bot",
              data: data.text,
            });
            this.webchatRef.current.setHandoff(true);
          }
        }
      };

      clearTimeout(this.websocketTimerId);
      this.websocketTimerId = setInterval(this.WebsocketkeepAlive, 20000);
      // this.ws.onmessage = this.ws.onmessage.bind(this);
      return this.ws;
    }
  };

  abortAllAPi = () => {
    //abort fetch question api
    if (this.controller) {
      this.controller.abort();
    }
  }

  openWebsocketConnection() {
    this.websocketConnect();
  }

  fetchSingleQuestion = async (step, error) => {
    if (
      this.currentQuestion &&
      this.currentQuestion.component &&
      this.currentQuestion.component.order_no === step
    ) {
      return this.currentQuestion;
    }
    let params;
    if (step === 0) {
      params = {
        bot_id: this.botId,
        order_no: 0,
        client_id: 0,
      };
    } else {
      params = {
        bot_id: this.botId,
        order_no: step,
        client_id: this.client_id,
      };
    }
    const queryString = Object.keys(params)
      .map((key) => key + "=" + params[key])
      .join("&");

    // fetch first question
    if (this.controller) {
      this.controller.abort();
    }
    const abortableFetch = "signal" in new Request("") ? window.fetch : fetch;

    this.controller = new AbortController();

    const res = await abortableFetch(
      process.env.REACT_APP_ENV_API_URL + `chatbot/component?${queryString}`,
      {
        signal: this.controller.signal,
      }
    );
    if (!res.ok) {
      // setTimeout(this.fetchSingleQuestion(step, error), 1200000);
      return;
    }
    try {
      this.currentQuestion = await res.json();
      // for file upload
      if (this.currentQuestion.status !== "False") {
        this.updateChatSettings({ currentQuestionId: this.currentQuestion.defaultparam.question_id });
      }
    } catch (e) {
      console.log("error:", e.message);
    }
    if (this.currentQuestion.status === "False") {
      this.setTyping(false);
      this.setSocket(true);
      this.webchatRef.current.setHandoff(true);
    }
    if (!this.currentQuestion.component || Array.isArray(this.currentQuestion.component)) {
      this.currentQuestion.component = {};
    }
    console.log(this.currentQuestion.component);
    return this.currentQuestion;
  };

  handlePlay(step) {
    this.clearMessages();
    this.questionStep = step;
    this.updateChatSettings({ questionStep: step });
    this.fetchNextQuestion(step);
  }


  async fetchNextQuestion(step, error) {
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout)
    }
    this.setTyping(true);
    let webchatState = this.webchatRef.current.getwebchatState();

    new Promise(async (resolve, rej) => {
    }).then((item) => {
      let delay = 0;
      let typing = "Groovy CSS Spinner";
      if (
        item.typing_animation_settings &&
        item.typing_animation_settings.delay_time_checkbox === 1 &&
        item.typing_animation_settings.delay_time_value
      ) {
        delay = item.typing_animation_settings.delay_time_value;
      }
      if (
        item.typing_animation_settings &&
        item.typing_animation_settings.anime_value
      ) {
        typing = item.typing_animation_settings.anime_value;
      }

      let webchatState = this.webchatRef.current.getwebchatState();
      let newObj = {
        ...webchatState,
        theme: {
          ...webchatState.theme,
          delay: delay,
          typing: typing,
        }
      };
      this.updateChatSettings(newObj);
    });

    new Promise(async (resolve, rej) => {
      const delay = webchatState.theme.delay || 0;
      let data, timeoutFinished;
      if (delay > 0) {
        let timeSec = 1;
        this.delayTimeout = setInterval(() => {
          ++timeSec;
          if (timeSec >= delay) {
            clearTimeout(this.delayTimeout);
            timeoutFinished = true;

            if (data) {
              resolve(data);
            }
          }
        }, 1000);
      } else {
        timeoutFinished = true;
      }
      data = await this.fetchSingleQuestion(step, error);
      if (timeoutFinished) {
        resolve(data);
      }

    }).then((item) => {

      item.component = {
        ...item.component,
        ...item.defaultparam
      }

      if (step === 0) {
        // console.log(item.component);
        if (item && item.component && item.component.client_id) {
          this.client_id = item.component.client_id;
          this.botId = this.client_id.split("-")[0];
          this.flowId = this.client_id.split("-")[1];
          let uniqueId = this.client_id.split("-")[2];

          this.client_id = `${this.botId}-${this.flowId}-${uniqueId}`;
          this.openWebsocketConnection(this.client_id);

          item.botdetails = {};
          item.botdetails.time_zone = webchatState?.chatsettings?.time_zone;
          console.log(item.botdetails.time_zone);
          let updateObj = {};
          updateObj["bot"] = {
            id: this.botId,
            flow_id: this.flowId,
            client_id: this.client_id,
            bot_type: this.botType,
            agent_id: 0,
            timezone: item.botdetails.time_zone,
          };
          this.webchatRef.current.weConnectUpdateSession(updateObj);

        } else {
          console.log("CLIENTID ERROR");
          return;
        }
      }
      if (item) {
        if (error) {
          item.error = error;
        }
        if (item.status === "True" && item.component.skip === 0) {
          this.questionStep = this.questionStep + 1;
          this.updateChatSettings({ questionStep: this.questionStep });
          this.fetchNextQuestion(this.questionStep);
          return;
        }
        if (item.status === "True" && item.component.type) {
          this.addUserMessage({
            type: "postback",
            item,
            payload: item.component.type,
          });
        } else if (this.session_id !== 0 && item.status === "False") {
          this.chattranscriptNotification();
        }
        // this.addUserMessage({
        //   type: "audio",
        //   from: "user",
        //   src: "https://file-examples.com/storage/fee788409562ada83b58ed5/2017/11/file_example_MP3_5MG.mp3",
        // });
      } else if (this.session_id !== 0 && item.status === "False") {
        console.log("All question finished!");
        this.updateChatSettings({
          modal: {
            params: this.agent_id,
            open: true,
            type: "feedback"
          }
        });

        // this.chattranscriptNotification();
      }
      // modal open/ close
      // design 4 dialogs
      // feedback / feedback2 / gdpr / continue


      // this.updateChatSettings({
      //   modal: {
      //     open: true,
      //     type: "feedback"
      //   }
      // });
      //  this.addUserMessage({
      //    type: "image",
      //    from: "user",
      //    src: "https://cdn.pixabay.com/photo/2017/03/21/21/05/medal-2163347__340.png",
      //  });

      if (item.component.type === "message") {
        if (item.component.jump_to > 0) {
          this.questionStep = item.component.jump_to;
        } else if (item.component.jump_to === -1) {
          let webchatState = this.webchatRef.current.getwebchatState();
          this.questionStep = webchatState.chatsettings.total_questions;
          this.updateChatSettings({ questionStep: this.questionStep });
          this.setTyping(false);
          this.webchatRef.current.setHandoff(true);
          // stop here
          return;
        } else {
          this.questionStep = this.questionStep + 1;
        }
        this.updateChatSettings({ questionStep: this.questionStep });
        this.fetchNextQuestion(this.questionStep);
      }

    });

  }

  refreshChat() {

    this.closeBrowser();
    // clear timeout counters
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout)
    }
    if (this.connectAgentTimer) clearTimeout(this.connectAgentTimer);
    this.currentQuestion = null;
    this.session_id = 0;
    this.questionStep = 0;
    this.client_id = 0;
    this.ws.close();
    this.agent_ids = []
    this.interacted = false;
    this.updateChatSettings({ lastRoutePath: null, questionStep: this.questionStep });
    this.clearMessages();
    this.fetchNextQuestion(0);
  }

  onInit = async (req, req1, req2) => {
    if (this.mode !== 'widget') {
      const messages = this.getMessages();
      if (messages.length === 0) {
        this.loadInitialResponse();
      }
    }

    this.updateUser({
      bot: {
        bot_id: this.botId,
        client_id: this.client_id,
        bot_type: this.botType,
        agent_id: 0,
      },
    });

    return () => {
      this.ws.close();
    };
  };

  onOpen = () => {
    const webchatState = this.webchatRef.current.getwebchatState();
    const messages = this.getMessages();
    if (messages.length === 0) {
      this.loadInitialResponse();
    }

    if (webchatState.session.bot) {
      this.sendMessage({
        'type': 'updateunread',
        'bot_id': webchatState.session.bot.id,
        'unread_from': 'client',
        'client_id': webchatState.session.bot.client_id,
        'agent_id': this.agentId
      });
      this.updateChatSettings({ unreadCount: 0 });
    }
  };

  onMessage = (req, data) => {
    // console.log("On Message req", req, data);
  };

  async onValidateInput({ input, elem, lastRoutePath, webchatState }) {
    // const message = elem.current.value;
    return true;
  }

  sendMessage = (message) => {
    let _this = this;
    if (this.previewMode) {
      this.questionStep = this.questionStep + 1;
      this.updateChatSettings({ questionStep: this.questionStep });
      _this.fetchNextQuestion(this.questionStep, true);
      return;
    }
    if (_this.ws && _this.ws.readyState === WebSocket.OPEN) {
      _this.ws.send(JSON.stringify(message));
    } else {
      const currentQueue = [..._this.state.queue];
      currentQueue.push(JSON.stringify(message));
      if (_this.setState) {
        _this.setState({
          queue: currentQueue,
        });
      }
    }
  };

  async onChangeRoute(lastRoutePath, currentRoute) {
    // if (currentRoute == "form_sent") {
    //   questionStep = questionStep + 1;
    //   this.fetchSingleQuestion(questionStep, true);
    // }
  }

  updateLastMessageReply = () => {
    this.webchatRef.current.getwebchatState({
      reply: true
    });
  }

  sendParam = (obj) => {
    const webchatState =
      this.webchatRef.current.getwebchatState();
    let websocketDataSend = {
      session_id: this.session_id,
      bot_id: this.botId,
      client_id: webchatState.session.bot.client_id,
      ...obj,
    };
    this.sendMessage(websocketDataSend);
  }

  async onUserInput({ input, session, lastRoutePath, webchatState }) {

    if (lastRoutePath === "connect_agent" && input.item) {
      let counter = 30;
      if (input.item.sub_type === "live_chat" || input.item.chattype === "live_chat") {
        counter = webchatState.agent_sla_time_livechat;
      } else {
        counter = webchatState.agent_sla_time_videocall;
      }
      this.webchatRef.current.weConnectUpdateSession({
        counter: counter,
      });
    }
    this.webchatRef.current.updateReplies([]);

    const messages = this.getMessages();

    if (input.from && input.from === "bot") {
      return;
    }

    let websocketDataSend = {
      ...session.environment,
      session_id: this.session_id,
      sourceurl: window.location.href,
      bot_id: this.botId,
      sub_type: "",
      time_slot: "",
      name: "",
      email: "",
      phone: "",
      company_name: "",
    };

    if (
      lastRoutePath === "welcome_card" &&
      input.payload === "form_sent"
      // || (input.type!=="postback" && lastRoutePath === "file_upload")
    ) {
      // fetch next question after form is sent
      this.questionStep = this.questionStep + 1;
      this.updateChatSettings({ questionStep: this.questionStep });
      this.fetchNextQuestion(this.questionStep, true);
    }
    if (input.payload === "rating_selected") {
      this.setTyping(true);
      websocketDataSend.chatbot_type = lastRoutePath;
      websocketDataSend.type = "chatbot";
      websocketDataSend.skiptype = 0;

      if (backButton[this.questionStep]) {
        delete backButton[this.questionStep];
        websocketDataSend.backtype = 1;
      } else {
        websocketDataSend.backtype = 0;
      }

      websocketDataSend.client_id = session.bot.client_id;
      websocketDataSend.order_no = this.questionStep;
      websocketDataSend.question_id = this.currentQuestion.component.question_id;
      if (input.item && typeof input.item.btn_id !== "undefined") {
        websocketDataSend.answer_id = input.item.btn_id;
      } else {
        websocketDataSend.answer_id = input.data;
      }
      websocketDataSend.question = this.currentQuestion.component.question;
      websocketDataSend.session_id = this.session_id;
      websocketDataSend.bot_type = this.botType;
      this.sendMessage(websocketDataSend);
    }
    if (input.payload === undefined && messages.length >= 0) {
      if (!this.ws || this.ws.readyState !== this.ws.OPEN)
        return;
      if (lastRoutePath === "file_upload" && input.src) input.data = input.src;
      if (typeof input.data === "undefined") return;

      // SKip Logic
      if (input.data === "Skip" && input.item.skip === true) {
        websocketDataSend.chatbot_type = lastRoutePath;
        websocketDataSend.type = "chatbot";
        websocketDataSend.skiptype = 1;
        websocketDataSend.backtype = 0;
        websocketDataSend.client_id = session.bot.client_id;
        websocketDataSend.order_no = this.questionStep;
        websocketDataSend.question_id = this.currentQuestion.component.question_id;
        if (input.item && typeof input.item.btn_id !== "undefined") {
          websocketDataSend.answer_id = input.item.btn_id;
        } else {
          websocketDataSend.answer_id = input.data;
        }
        websocketDataSend.question = this.currentQuestion.component.question;
        websocketDataSend.session_id = this.session_id;
        websocketDataSend.bot_type = this.botType;
        this.sendMessage(websocketDataSend);
        return;

        // questionStep = questionStep + 1;
        // this.fetchNextQuestion(questionStep);
        // return false;
      }

      // Back Logic
      if (input.data === "Back" && input.item.back === true) {
        this.questionStep = this.questionStep - 1;
        this.updateChatSettings({ questionStep: this.questionStep });
        backButton[this.questionStep] = true;
        this.fetchNextQuestion(this.questionStep);
        return false;
      }

      // here check for wrong answers
      // Skip & Back is not one of wrong answer
      if (
        input.item === undefined ||
        (input.item.skip === undefined &&
          input.item.back === undefined &&
          !input.error)
      ) {
        // input is wrong
        if (lastRoutePath === "number") {
          const message_error = this.currentQuestion.component.message_error;
          if (isNaN(parseInt(input.data.trim()))) {
            this.fetchNextQuestion(this.questionStep, message_error);
            return false;
          }
          const number = input.data.trim().length;
          if (
            !(
              number <= parseInt(this.currentQuestion.options.maximum_digit) &&
              number >= parseInt(this.currentQuestion.options.minimum_digit) &&
              !isNaN(input.data)
            )
          ) {
            this.fetchNextQuestion(this.questionStep, message_error);
            return false;
          }
        } else if (lastRoutePath === "email") {
          const message_error = this.currentQuestion.component.message_error;
          const emailRegex =
            /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
          if (!input.data.match(emailRegex)) {
            this.fetchNextQuestion(this.questionStep, message_error);
            return false;
          }
        } else if (lastRoutePath === "phone_number") {
          const message_error = this.currentQuestion.component.message_error;
          var phoneno = /^[0-9 ()+-]+$/;
          if (!input.data.match(phoneno)) {
            this.fetchNextQuestion(this.questionStep, message_error);
            return false;
          }
          const number_length = input.data.trim().length;
          if (number_length > this.currentQuestion.options.number_length) {
            this.fetchNextQuestion(this.questionStep, message_error);
            return false;
          }
        }
      }

      if (lastRoutePath === "offline_form") {
        // cors error comes??
        // need to send post data here
        this.questionStep = this.questionStep + 1;
        this.updateChatSettings({ questionStep: this.questionStep });
        this.fetchNextQuestion(this.questionStep);
      }
      if (lastRoutePath === "appointment" && input.item.server) {
        websocketDataSend.time_slot = input.item.server.time_slot;
        input.data = input.item.server.date;
        websocketDataSend.name = input.item.name;
        websocketDataSend.email = input.item.email;
        websocketDataSend.phone = input.item.phone;
        websocketDataSend.company_name = input.item.company_name;
      }
      if (
        lastRoutePath === "text_question" ||
        lastRoutePath === "multi_choice" ||
        lastRoutePath === "welcome_card" ||
        lastRoutePath === "opinion_scale" ||
        lastRoutePath === "number" ||
        lastRoutePath === "phone_number" ||
        lastRoutePath === "email" ||
        lastRoutePath === "range" ||
        lastRoutePath === "date" ||
        lastRoutePath === "multi_select" ||
        lastRoutePath === "file_upload" ||
        lastRoutePath === "rating" ||
        lastRoutePath === "carousal" ||
        lastRoutePath === "appointment" ||
        lastRoutePath === "links"
      ) {
        this.setTyping(true);
        websocketDataSend.chatbot_type = lastRoutePath;
        websocketDataSend.type = "chatbot";
        websocketDataSend.skiptype = 0;
        if (backButton[this.questionStep]) {
          delete backButton[this.questionStep];
          websocketDataSend.backtype = 1;
        } else {
          websocketDataSend.backtype = 0;
        }
        websocketDataSend.client_id = session.bot.client_id;
        websocketDataSend.order_no = this.questionStep;
        websocketDataSend.question_id = this.currentQuestion.component.question_id;
        if (input.item && typeof input.item.btn_id !== "undefined") {
          websocketDataSend.answer_id = input.item.btn_id;
        } else {
          websocketDataSend.answer_id = input.data;
        }
        if (input.item && typeof input.item.btn_text !== "undefined") {
          websocketDataSend.answer = input.item.btn_text;
        }
        websocketDataSend.question = this.currentQuestion.component.question;
        websocketDataSend.session_id = this.session_id;
        websocketDataSend.bot_type = this.botType;
        // websocketDataSend.sub_type = "";
        // websocketDataSend.time_slot = "";
        // websocketDataSend.name = "";
        // websocketDataSend.phone = "";
        // websocketDataSend.company_name = "";
        this.sendMessage(websocketDataSend);
        return;
      }
      if (lastRoutePath === "connect_agent" && input.item) {
        let connectWebsocket = {
          type: "connect_agent",
          bot_id: session.bot.id,
          client_id: session.bot.client_id,
          id: session.bot.flow_id,
          bot_type: this.botType,
          order_no: this.questionStep,
          session_id: this.session_id,
          sourceurl: window.location.href,
          ...websocketDataSend,
        };

        connectWebsocket.sub_type = input.item.sub_type;
        connectWebsocket.answer_id = input.item.btn_id;
        connectWebsocket.question_id = this.currentQuestion.component.question_id;
        connectWebsocket.skiptype = 0;
        connectWebsocket.backtype = 0;
        this.sendMessage(connectWebsocket);
        return false;
      }
      if (lastRoutePath === "connected" || lastRoutePath === "human_takeover" || lastRoutePath === "assign_to_me" || lastRoutePath === "videochatlink") {
        // const agentDataSend = {
        //   msg: input.data,
        //   client_id: client_id,
        //   agent_id: agentId,
        //   type: "client",
        //   attachment: "NO",
        // };
        const agentDataSend = {
          type: "chat",
          message_id: input.id,
          bot_id: session.bot.id,
          from: "client",
          text: input.data,
          client_id: session.bot.client_id,
          agent_id: this.agentId,
          file: "",
          answer_id: input.extension,
          session_id: this.session_id,
        };
        this.sendMessage(agentDataSend);
        return;
      }
    }

    if (input.type === "text") {
    } else {
      this.onMessage &&
        this.onMessage(this, { from: SENDERS.user, message: input });
      const resp = await this.bot.input({ input, session, lastRoutePath });
      this.onMessage &&
        resp.response.map((r) =>
          this.onMessage(this, { from: SENDERS.bot, message: r })
        );
      this.webchatRef.current.addBotResponse(resp);
    }
  }

  onBotInput(response, session, lastRoutePath) {
    if (lastRoutePath === "connected" || lastRoutePath === "endchat")
      this.webchatRef.current.updateReplies(false);
  }

  async render(dest, optionsAtRuntime = {}) {
    let socket = false;
    if (this.ws && this.ws.readyState === this.ws.OPEN) {
      socket = true;
    }
    let {
      persistentMenu,
      coverComponent,
      blockInputs,
      enableEmojiPicker,
      enableAttachments,
      enableUserInput,
      enableAnimations,
      storage,
      storageKey,
      onInit,
      onOpen,
      onClose,
      onMessage,
      hostId,
      botId,
      orderNo,
      mode,
      editMode,
      deviceMode,
      key,
      ...webchatOptions
    } = optionsAtRuntime;
    if (botId === 'NzMx') {
      const domains = [
        'https://www.novi.nl/stap',
        'https://www.novi.nl/html-css/',
        'https://www.novi.nl/introductie-hacking/',
        'https://www.novi.nl/prototyping-met-figma'
      ];
      const changeBot = domains.some((url) => {
        if (typeof url == "string")
          return url.trim() === window.location.href.substring(0, url.length);
        return false;
      });
      if (changeBot) {
        botId = 'Njc0';
      }
    }

    this.questionStep = orderNo || 0;
    const theme = {};
    persistentMenu = persistentMenu || this.persistentMenu;
    coverComponent = coverComponent || this.coverComponent;
    blockInputs = blockInputs || this.blockInputs;
    enableEmojiPicker = enableEmojiPicker || this.enableEmojiPicker;
    enableAttachments = enableAttachments || this.enableAttachments;
    enableUserInput = enableUserInput || this.enableUserInput;
    enableAnimations = enableAnimations || this.enableAnimations;
    storage = storage || this.storage;
    storageKey = storageKey || this.storageKey;
    this.onClose = onClose || this.onClose;
    this.hostId = hostId || this.hostId;
    let botIdInteger;
    if (typeof editMode === 'undefined') {
      editMode = 'production';
    }

    try {
      if (!botIdInteger) {
        botIdInteger = window.atob(botId);
      }
    } catch (error) { }
    if (isNaN(parseInt(botIdInteger)) === false) {
      this.botId = parseInt(botIdInteger);
    } else {
      this.botId = 427;
    }

    this.onInit = onInit || this.onInit;
    this.onOpen = onOpen || this.onOpen;
    let enableHeaders = true;

    let chatMode = MODES.LANDING;
    this.mode = mode;
    if (mode) {
      chatMode = mode;
      if (mode !== "widget") {
        enableHeaders = false;
      }
    }

    this.botType = mode;
    this.webchatRef = React.createRef();

    this.createRootElement(dest);
    render(
      <Webchat
        {...webchatOptions}
        closeBrowser={this.closeBrowser}
        pongTrigger={this.pongTrigger}
        botId={this.botId}
        key={key}
        deviceMode={deviceMode}
        socket={socket}
        editMode={editMode}
        loadInitialResponse={() => { }}
        mode={chatMode}
        ref={this.webchatRef}
        host={this.host}
        botType={this.state.bot_type}
        sendMessage={this.sendParam}
        shadowDOM={this.shadowDOM}
        theme={theme}
        persistentMenu={persistentMenu}
        coverComponent={coverComponent}
        blockInputs={blockInputs}
        enableEmojiPicker={enableEmojiPicker}
        enableAttachments={enableAttachments}
        enableUserInput={enableUserInput}
        enableAnimations={enableAnimations}
        enableHeaders={enableHeaders}
        storage={storage}
        storageKey={storageKey}
        getString={(stringId, session) => this.bot.getString(stringId, session)}
        setLocale={(locale, session) => this.bot.setLocale(locale, session)}
        onInit={(...args) => this.onInitWebchat(...args)}
        onOpen={(...args) => this.onOpenWebchat(...args)}
        onClose={(...args) => this.onCloseWebchat(...args)}
        onUserInput={(...args) => this.onUserInput(...args)}
        onValidateInput={(...args) => this.onValidateInput(...args)}
        onChangeRoute={(...args) => this.onChangeRoute(...args)}
        onBotInput={(...args) => this.onBotInput(...args)}
        refreshChat={(...args) => this.refreshChat(...args)}
      />,
      this.getReactMountNode(dest)
    );
    // });
  }
}
