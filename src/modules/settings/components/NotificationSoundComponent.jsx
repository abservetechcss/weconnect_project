import React, { Component, Fragment } from "react";
import { Form } from "react-bootstrap";
import { Button, Grid } from "@mui/material";
import { IconButton, Stack, Switch } from "@mui/material";
import draftToHtml from "draftjs-to-html";
import htmlToDraft from "html-to-draftjs";
import link from "../../../assets/images/link.svg";
import smile from "../../../assets/images/smile3.svg";
import deleteIcon from "../../../assets/images/userdash/trash-2 red.svg";
import menu from "../../../assets/images/userdash/Group 18691.svg";
import plus from "../../../assets/images/plus (1).svg";
import { Editor } from "react-draft-wysiwyg";
import { FaPlay as PlayIcon } from "react-icons/fa";
import {
  EditorState,
  Modifier,
  convertFromHTML,
  convertToRaw,
  ContentState,
} from "draft-js";

import ToolbarCustomComponent from "../../new-users/common/ToolbarCustomComponent.jsx";
import createImagePlugin from "@draft-js-plugins/image";
import star from "../../../assets/images/star (2).svg";
import uploadImg from "../../../assets/images/image.svg";
import {
  getNotificationSoundList,
  updateNotificationSound,
} from "../server/SettingServer.js";
import SimpleReactValidator from "simple-react-validator";
import { successAlert } from "../../../js/alerts";
import { emitter } from "../../common/WebSocketComponent";

const imagePlugin = createImagePlugin();
const plugins = [imagePlugin];

export default class NotificationSoundComponent extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {},
    });

    this.state = {
      messageText: "",
      isShowEmojiModal: false,
      isShowGifImgModal: false,
      notificationSetting: {
        browser_notification: 0,
        button_link: "",
        button_name: "",
        desktop_notification: 0,
        live_chat_checkbox: 0,
        live_chat_value: "long1",
        message_received_checkbox: 0,
        message_received_value:
          process.env.REACT_APP_BASE_URL + "sounds/Short/short1.mp3",
        message_sent_checkbox: 0,
        message_sent_value:
          process.env.REACT_APP_BASE_URL + "sounds/Short/short1.mp3",
        mobile_notification: 0,
        new_tab: 0,
        new_visitors_checkbox: 0,
        new_visitors_value: "long1",
        notification_permission_trigger_checkbox: 0,
        notification_permission_trigger_value: "",
        show_special_alert_checkbox: 0,
        special_alert_text: 0,
        unread_message_checkbox: 0,
        unread_message_value:
          process.env.REACT_APP_BASE_URL + "sounds/Short/short1.mp3",
        video_call_checkbox: 0,
        video_call_value: "long1",
      },
      notificationSoundList: [
        {
          label: "sound1",
          value:
            "https://file-examples.com/storage/fe38eaf15f62b8b2ca12757/2017/11/file_example_MP3_700KB.mp3",
        },
        {
          label: "sound2",
          value:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        },
      ],
      notificationShort: [
        {
          value: process.env.REACT_APP_BASE_URL + "sounds/Short/short1.mp3",
          label: "Tone 1",
          // label: "Default short"
        },
        {
          value: process.env.REACT_APP_BASE_URL + "sounds/Short/short2.mp3",
          label: "Tone 2",
          // label: "Accomplished"
        },
        {
          value: process.env.REACT_APP_BASE_URL + "sounds/Short/short3.mp3",
          label: "Tone 3",
          // label: "Achievement message tone"
        },
        {
          value: process.env.REACT_APP_BASE_URL + "sounds/Short/short4.mp3",
          label: "Tone 4",
          // label: "Hangover sound"
        },
        {
          value: process.env.REACT_APP_BASE_URL + "sounds/Short/short5.mp3",
          label: "Tone 5",
          // label: "I did it message tone"
        },
        {
          value: process.env.REACT_APP_BASE_URL + "sounds/Short/short6.mp3",
          label: "Tone 6",
          // label: "My work is done message tone"
        },
        {
          value: process.env.REACT_APP_BASE_URL + "sounds/Short/short7.mp3",
          label: "Tone 7",
          // label: "Notification tone swift gesture"
        },
        {
          value: process.env.REACT_APP_BASE_URL + "sounds/Short/short8.mp3",
          label: "Tone 8",
          // label: "point blank"
        },
        {
          value: process.env.REACT_APP_BASE_URL + "sounds/Short/short9.mp3",
          label: "Tone 9",
          // label: "So proud notification"
        },
        {
          value: process.env.REACT_APP_BASE_URL + "sounds/Short/short10.mp3",
          label: "Tone 10",
          // label: "Succeeded message tone"
        },
        {
          value: process.env.REACT_APP_BASE_URL + "sounds/Short/short11.mp3",
          label: "Tone 11",
          // label: "That was quick tone"
        },
        {
          value: process.env.REACT_APP_BASE_URL + "sounds/Short/short12.mp3",
          label: "Tone 12",
          // label: "When"
        },
      ],
      notificationLong: [
        {
          label: "Ring 1",
          value: process.env.REACT_APP_BASE_URL + "sounds/Long/long1.mp3",
          // label: "Default long"
        },
        {
          label: "Ring 2",
          value: process.env.REACT_APP_BASE_URL + "sounds/Long/long2.mp3",
          // label: "Default long2"
        },
        {
          label: "Ring 3",
          value: process.env.REACT_APP_BASE_URL + "sounds/Long/long3.mp3",
          // label: "Discreet"
        },
        {
          label: "Ring 4",
          value: process.env.REACT_APP_BASE_URL + "sounds/Long/long4.mp3",
          // label: "Good-morning"
        },
        {
          label: "Ring 5",
          value: process.env.REACT_APP_BASE_URL + "sounds/Long/long5.mp3",
          // label: "Metallic"
        },
        {
          label: "Ring 6",
          value: process.env.REACT_APP_BASE_URL + "sounds/Long/long6.mp3",
          // label: "Ring2"
        },
        {
          label: "Ring 7",
          value: process.env.REACT_APP_BASE_URL + "sounds/Long/long7.mp3",
          // label: "Ring3"
        },
        {
          label: "Ring 8",
          value: process.env.REACT_APP_BASE_URL + "sounds/Long/long8.mp3",
          // label: "Ring4"
        },
      ],
      tabListData: [],
    };
  }
  componentDidMount() {
    let _this = this;
    _this.fetchDataFromServer();
  }

  fetchDataFromServer = () => {
    let _this = this;
    getNotificationSoundList(
      "",
      (res) => {
        let temp = res.notification_data;
        _this.setState({
          notificationSetting: temp,
        });
        if (temp.button_name !== "" || temp.button_link !== "") {
          if (temp.button_name.includes(",")) {
            let nameData = temp.button_name.split(",");
            let linkData = temp.button_link.split(",");
            let new_tabData = temp.new_tab.split(",");
            for (var i = 0; i < nameData.length; i++) {
              let newObj = _this.state.tabListData;
              newObj.push({
                button_name: nameData[i],
                new_tab: new_tabData[i],
                button_link: linkData[i],
                key: newObj.length,
              });
              _this.setState({
                tabListData: newObj,
              });
            }
          } else {
            let newObj = _this.state.tabListData;
            newObj.push({
              button_name: temp.button_name,
              new_tab: temp.new_tab,
              button_link: temp.button_link,
              key: newObj.length,
            });
            _this.setState({
              tabListData: newObj,
            });
          }
        }
        if (temp.special_alert_text !== "") {
          const contentBlock = htmlToDraft(temp.special_alert_text);
          let messageText = "";
          if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(
              contentBlock.contentBlocks
            );
            const editorState = EditorState.createWithContent(contentState);
            messageText = editorState;
          }
          _this.setState({
            isShowEmojiModal: false,
            messageText: messageText,
          });
        }

        _this.props._this.setState({ loading: false });
      },
      () => {
        _this.props._this.setState({ loading: false });
      }
    );
  };

  onSubmit = () => {
    let _this = this;
    let tempObj = JSON.parse(JSON.stringify(_this.state.notificationSetting));

    if (_this.state.messageText !== "") {
      tempObj.special_alert_text = draftToHtml(
        convertToRaw(_this.state.messageText.getCurrentContent())
      );
    } else {
      tempObj.special_alert_text = "";
    }
    tempObj.button_name = "";
    tempObj.button_link = "";
    tempObj.new_tab = "";
    if (_this.state.tabListData && _this.state.tabListData.length > 0) {
      _this.state.tabListData.map((prop, key) => {
        if (key !== 0) {
          tempObj.button_name += ",";
          tempObj.button_link += ",";
          tempObj.new_tab += ",";
        }
        tempObj.button_name += prop.button_name;
        tempObj.button_link += prop.button_link;
        tempObj.new_tab += prop.new_tab;
      });
    }

    if (_this.validator.allValid()) {
      _this.props.handleLoadingShow(true);
      updateNotificationSound(
        tempObj,
        (res) => {
          _this.props.handleLoadingShow(false);
          emitter.emit("changeDesktopSettings");
          successAlert(
            "Notification Sound Updated Successfully!",
            _this.props._this
          );
          _this.fetchDataFromServer();
          _this.props.selectActiveTab(0);
        },
        (res) => {
          _this.setState({ loading: false });
          _this.props.handleLoadingShow(false);
        }
      );
    } else {
      _this.validator.showMessages();
      this.forceUpdate();
    }
  };
  handleInputChange = (e) => {
    let _this = this;
    var newObj = _this.state.notificationSetting;
    newObj[e.target.name] = e.target.value;
    _this.setState({ notificationSetting: newObj });
  };

  handleSoundChange = (e) => {
    let _this = this;
    var newObj = _this.state.notificationSetting;
    emitter.emit("soundAlert", e.target.value);
    newObj[e.target.name] = e.target.value;
    _this.setState({ notificationSetting: newObj });
  };

  playSound = (name) => {
    const soundValue = this.state.notificationSetting[name];
    emitter.emit("soundAlert", soundValue);
  };

  uploadImageCallBack = (file) => {
    const imageObject = {
      file: file,
      localSrc: URL.createObjectURL(file),
    };
    return new Promise((resolve, reject) => {
      resolve({ data: { link: imageObject.localSrc } });
    });
  };
  render() {
    let _this = this;
    return (
      <Fragment>
        <div className="right-block">
          <div className="header">
            <p className="heading">Notifications and sound</p>
            <p className="desc"></p>
          </div>
          <div className="main-block ">
            <div className="notification-sound-block">
              <div className="basic-acc-block">
                <div className="availability_box">
                  <div className="checkbox-block">
                    <input
                      type="checkbox"
                      value={
                        _this.state.notificationSetting
                          .new_visitors_checkbox === 0
                          ? false
                          : true
                      }
                      checked={
                        _this.state.notificationSetting
                          .new_visitors_checkbox === 0
                          ? false
                          : true
                      }
                      onChange={(e) => {
                        var newObj = _this.state.notificationSetting;
                        newObj.new_visitors_checkbox =
                          newObj.new_visitors_checkbox === 0 ? 1 : 0;
                        _this.setState({
                          notificationSetting: newObj,
                        });
                      }}
                    />
                    <div>
                      <p className="availability_title">New visitors</p>
                      <p className="availability_text">
                        {/* Duis aute irure dolor in reprehenderit velit */}
                      </p>
                    </div>
                  </div>
                  <div className="selector-block">
                    <Form.Select
                      aria-label="Default select example"
                      name="new_visitors_value"
                      value={
                        _this.state.notificationSetting &&
                        _this.state.notificationSetting.new_visitors_value
                      }
                      onChange={this.handleSoundChange}
                    >
                      <option value="">Select..</option>
                      {_this.state.notificationLong.map((prop) => {
                        return <option value={prop.value}>{prop.label}</option>;
                      })}
                    </Form.Select>
                    <PlayIcon
                      color="#4fccca"
                      onClick={() => this.playSound("new_visitors_value")}
                    />
                  </div>
                </div>

                <div className="availability_box">
                  <div className="checkbox-block">
                    <input
                      type="checkbox"
                      value={
                        _this.state.notificationSetting.live_chat_checkbox === 0
                          ? false
                          : true
                      }
                      checked={
                        _this.state.notificationSetting.live_chat_checkbox === 0
                          ? false
                          : true
                      }
                      onChange={(e) => {
                        var newObj = _this.state.notificationSetting;
                        newObj.live_chat_checkbox =
                          newObj.live_chat_checkbox == 0 ? 1 : 0;
                        _this.setState({
                          notificationSetting: newObj,
                        });
                      }}
                    />
                    <div>
                      <p className="availability_title">Live chat</p>
                      <p className="availability_text">
                        {/* Duis aute irure dolor in reprehenderit velit */}
                      </p>
                    </div>
                  </div>
                  <div className="selector-block">
                    <Form.Select
                      aria-label="Default select example"
                      name="live_chat_value"
                      value={
                        _this.state.notificationSetting &&
                        _this.state.notificationSetting.live_chat_value
                      }
                      onChange={this.handleSoundChange}
                    >
                      <option value="">Select..</option>
                      {_this.state.notificationLong.map((prop) => {
                        return <option value={prop.value}>{prop.label}</option>;
                      })}
                    </Form.Select>
                    <PlayIcon
                      color="#4fccca"
                      onClick={() => this.playSound("live_chat_value")}
                    />
                  </div>
                </div>

                <div className="availability_box">
                  <div className="checkbox-block">
                    <input
                      type="checkbox"
                      value={
                        _this.state.notificationSetting.video_call_checkbox ===
                        0
                          ? false
                          : true
                      }
                      checked={
                        _this.state.notificationSetting.video_call_checkbox ===
                        0
                          ? false
                          : true
                      }
                      onChange={(e) => {
                        var newObj = _this.state.notificationSetting;
                        newObj.video_call_checkbox =
                          newObj.video_call_checkbox === 0 ? 1 : 0;
                        _this.setState({
                          notificationSetting: newObj,
                        });
                      }}
                    />
                    <div>
                      <p className="availability_title">Video call</p>
                      <p className="availability_text">
                        {/* Duis aute irure dolor in reprehenderit velit */}
                      </p>
                    </div>
                  </div>
                  <div className="selector-block">
                    <Form.Select
                      aria-label="Default select example"
                      name="video_call_value"
                      value={
                        _this.state.notificationSetting &&
                        _this.state.notificationSetting.video_call_value
                      }
                      onChange={this.handleSoundChange}
                    >
                      <option value="">Select..</option>
                      {_this.state.notificationLong.map((prop) => {
                        return <option value={prop.value}>{prop.label}</option>;
                      })}
                    </Form.Select>
                    <PlayIcon
                      color="#4fccca"
                      onClick={() => this.playSound("video_call_value")}
                    />
                  </div>
                </div>

                <div className="availability_box">
                  <div className="checkbox-block">
                    <input
                      type="checkbox"
                      value={
                        _this.state.notificationSetting
                          .unread_message_checkbox === 0
                          ? false
                          : true
                      }
                      checked={
                        _this.state.notificationSetting
                          .unread_message_checkbox === 0
                          ? false
                          : true
                      }
                      onChange={(e) => {
                        var newObj = _this.state.notificationSetting;
                        newObj.unread_message_checkbox =
                          newObj.unread_message_checkbox === 0 ? 1 : 0;
                        _this.setState({
                          notificationSetting: newObj,
                        });
                      }}
                    />
                    <div>
                      <p className="availability_title">Unread messages</p>
                      <p className="availability_text">
                        {/* Duis aute irure dolor in reprehenderit velit */}
                      </p>
                    </div>
                  </div>
                  <div className="selector-block">
                    <Form.Select
                      aria-label="Default select example"
                      name="unread_message_value"
                      value={
                        _this.state.notificationSetting &&
                        _this.state.notificationSetting.unread_message_value
                      }
                      onChange={this.handleSoundChange}
                    >
                      <option value="">Select..</option>
                      {_this.state.notificationShort.map((prop) => {
                        return <option value={prop.value}>{prop.label}</option>;
                      })}
                    </Form.Select>
                    <PlayIcon
                      color="#4fccca"
                      onClick={() => this.playSound("unread_message_value")}
                    />
                  </div>
                </div>

                <div className="availability_box">
                  <div className="checkbox-block">
                    <input
                      type="checkbox"
                      value={
                        _this.state.notificationSetting
                          .message_sent_checkbox === 0
                          ? false
                          : true
                      }
                      checked={
                        _this.state.notificationSetting
                          .message_sent_checkbox === 0
                          ? false
                          : true
                      }
                      onChange={(e) => {
                        var newObj = _this.state.notificationSetting;
                        newObj.message_sent_checkbox =
                          newObj.message_sent_checkbox === 0 ? 1 : 0;
                        _this.setState({
                          notificationSetting: newObj,
                        });
                      }}
                    />
                    <div>
                      <p className="availability_title">Message sent</p>
                      <p className="availability_text">
                        {/* Duis aute irure dolor in reprehenderit velit */}
                      </p>
                    </div>
                  </div>
                  <div className="selector-block">
                    <Form.Select
                      aria-label="Default select example"
                      name="message_sent_value"
                      value={
                        _this.state.notificationSetting &&
                        _this.state.notificationSetting.message_sent_value
                      }
                      onChange={this.handleSoundChange}
                    >
                      <option value="">Select..</option>
                      {_this.state.notificationShort.map((prop) => {
                        return <option value={prop.value}>{prop.label}</option>;
                      })}
                    </Form.Select>
                    <PlayIcon
                      color="#4fccca"
                      onClick={() => this.playSound("message_sent_value")}
                    />
                  </div>
                </div>

                <div className="availability_box">
                  <div className="checkbox-block">
                    <input
                      type="checkbox"
                      value={
                        _this.state.notificationSetting
                          .message_received_checkbox === 0
                          ? false
                          : true
                      }
                      checked={
                        _this.state.notificationSetting
                          .message_received_checkbox === 0
                          ? false
                          : true
                      }
                      onChange={(e) => {
                        var newObj = _this.state.notificationSetting;
                        newObj.message_received_checkbox =
                          newObj.message_received_checkbox === 0 ? 1 : 0;
                        _this.setState({
                          notificationSetting: newObj,
                        });
                      }}
                    />
                    <div>
                      <p className="availability_title">Message received</p>
                      <p className="availability_text">
                        {/* Duis aute irure dolor in reprehenderit velit */}
                      </p>
                    </div>
                  </div>
                  <div className="selector-block">
                    <Form.Select
                      aria-label="Default select example"
                      name="message_received_value"
                      value={
                        _this.state.notificationSetting &&
                        _this.state.notificationSetting.message_received_value
                      }
                      onChange={this.handleSoundChange}
                    >
                      <option value="">Select..</option>
                      {_this.state.notificationShort.map((prop) => {
                        return <option value={prop.value}>{prop.label}</option>;
                      })}
                    </Form.Select>
                    <PlayIcon
                      color="#4fccca"
                      onClick={() => this.playSound("message_received_value")}
                    />
                  </div>
                </div>

                <div className="notification-trigger-block">
                  <div className="availability_box">
                    <div className="checkbox-block">
                      <input
                        type="checkbox"
                        value={
                          _this.state.notificationSetting
                            .notification_permission_trigger_checkbox === 0
                            ? false
                            : true
                        }
                        checked={
                          _this.state.notificationSetting
                            .notification_permission_trigger_checkbox === 0
                            ? false
                            : true
                        }
                        onChange={(e) => {
                          var newObj = _this.state.notificationSetting;
                          newObj.notification_permission_trigger_checkbox =
                            newObj.notification_permission_trigger_checkbox ===
                            0
                              ? 1
                              : 0;
                          _this.setState({
                            notificationSetting: newObj,
                          });
                        }}
                      />
                      <div>
                        <p className="availability_title">
                        Enable Sound Notifications
                        </p>
                        <p className="availability_text">
                          {/* Duis aute irure dolor in reprehenderit velit */}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="switches">
                    <div className="switch-block">
                      <label htmlFor="Browser">Browser</label>
                      <span>
                        <span className="switch-btn-cust">
                          <input
                            type="checkbox"
                            value={
                              _this.state.notificationSetting
                                .browser_notification === 0
                                ? false
                                : true
                            }
                            checked={
                              _this.state.notificationSetting
                                .browser_notification === 0
                                ? false
                                : true
                            }
                            onChange={(e) => {
                              var newObj = _this.state.notificationSetting;
                              newObj.browser_notification =
                                newObj.browser_notification === 0 ? 1 : 0;
                              _this.setState({
                                notificationSetting: newObj,
                              });
                            }}
                            id="switch"
                          />
                          <label htmlFor="switch">Toggle</label>
                        </span>
                      </span>
                    </div>
                    <div className="switch-block">
                      <label htmlFor="Browser">Desktop</label>
                      <span>
                        <span className="switch-btn-cust">
                          <input
                            type="checkbox"
                            value={
                              _this.state.notificationSetting
                                .desktop_notification == 0
                                ? false
                                : true
                            }
                            checked={
                              _this.state.notificationSetting
                                .desktop_notification == 0
                                ? false
                                : true
                            }
                            onChange={(e) => {
                              var newObj = _this.state.notificationSetting;
                              newObj.desktop_notification =
                                newObj.desktop_notification == 0 ? 1 : 0;
                              _this.setState({
                                notificationSetting: newObj,
                              });
                            }}
                            id="switch1"
                          />
                          <label htmlFor="switch1">Toggle</label>
                        </span>
                      </span>
                    </div>
                    <div className="switch-block">
                      <label htmlFor="Browser">Mobile</label>
                      <span>
                        <span className="switch-btn-cust">
                          <input
                            value={
                              _this.state.notificationSetting
                                .mobile_notification == 0
                                ? false
                                : true
                            }
                            checked={
                              _this.state.notificationSetting
                                .mobile_notification == 0
                                ? false
                                : true
                            }
                            onChange={(e) => {
                              var newObj = _this.state.notificationSetting;
                              newObj.mobile_notification =
                                newObj.mobile_notification == 0 ? 1 : 0;
                              _this.setState({
                                notificationSetting: newObj,
                              });
                            }}
                            type="checkbox"
                            id="switch2"
                          />
                          <label htmlFor="switch2">Toggle</label>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="special-alert-block">
                <div className="availability_box">
                  <input
                    type="checkbox"
                    value={
                      _this.state.notificationSetting
                        .show_special_alert_checkbox == 0
                        ? false
                        : true
                    }
                    checked={
                      _this.state.notificationSetting
                        .show_special_alert_checkbox == 0
                        ? false
                        : true
                    }
                    onChange={(e) => {
                      var newObj = _this.state.notificationSetting;
                      newObj.show_special_alert_checkbox =
                        newObj.show_special_alert_checkbox == 0 ? 1 : 0;
                      _this.setState({
                        notificationSetting: newObj,
                      });
                    }}
                  />
                  <div style={{opacity: 0.5}}>
                    <p className="availability_title">Show special alerts (Coming Soon)</p>
                    <p className="availability_text">
                      {/* Duis aute irure dolor in reprehenderit velit */}
                    </p>
                    <div className="chat-msg-block">
                      <div className="offline_email_section">
                        <div className="email_top">
                          <div className="w-100">
                            <div className="reply_message editor-block-all right-emoji-show">
                              <div className="msg_text"></div>

                              <Editor
                              stripPastedStyles={true}
                                plugins={plugins}
                                wrapperClassName="c-react-draft"
                                editorClassName="demo-editor"
                                toolbar={{
                                  options: [
                                    "inline",
                                    "list",
                                    "textAlign",
                                    "image",
                                  ],
                                  inline: {
                                    options: ["bold", "italic", "underline"],
                                  },
                                  textAlign: {
                                    options: [
                                      "left",
                                      "center",
                                      "right",
                                      "justify",
                                    ],
                                  },
                                  list: {
                                    options: ["unordered"],
                                  },

                                  image: {
                                    icon: uploadImg,
                                    className: undefined,
                                    component: undefined,
                                    popupClassName: undefined,
                                    urlEnabled: true,
                                    uploadEnabled: true,
                                    alignmentEnabled: false,
                                    uploadCallback: _this.uploadImageCallBack,
                                    previewImage: true,
                                    inputAccept:
                                      "image/gif,image/jpeg,image/jpg,image/png,image/svg",
                                    alt: { present: false, mandatory: false },
                                    defaultSize: {
                                      height: "100px",
                                      width: "100px",
                                    },
                                  },
                                  remove: {
                                    icon: star,
                                    className: undefined,
                                    component: undefined,
                                  },
                                }}
                                toolbarCustomButtons={[
                                  <ToolbarCustomComponent
                                    customButtonAction={this.customButtonAction}
                                    imagePlugin={imagePlugin}
                                    {..._this.props}
                                    _this={_this}
                                  />,
                                ]}
                                editorState={_this.state.messageText}
                                onEditorStateChange={(value) => {
                                  _this.setState({
                                    messageText: value,
                                    isShowEmojiModal: false,
                                    isShowGifImgModal: false,
                                  });
                                }}
                                spellCheck={true}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="special-alert-btn-grp">
                      {_this.state.tabListData &&
                        _this.state.tabListData.length > 0 &&
                        _this.state.tabListData.map((prop, key) => {
                          return (
                            <div className="btn-group-block">
                              <img
                                src={menu}
                                className="hover-menu-icon"
                                alt=""
                              />

                              <div className="text-tab">
                                <label htmlFor="">{`Button ${key + 1}`}</label>
                                <div className="tab">
                                  <Form.Group
                                    className=""
                                    controlId="formBasicCheckbox"
                                  >
                                    <Form.Check
                                      type="checkbox"
                                      label="New Tab"
                                      value={prop.new_tab == 0 ? false : true}
                                      checked={prop.new_tab == 0 ? false : true}
                                      onChange={(e) => {
                                        let newObj = _this.state.tabListData;
                                        newObj[key].new_tab =
                                          prop.new_tab == 0 ? 1 : 0;
                                        _this.setState({
                                          tabListData: newObj,
                                        });
                                      }}
                                    />
                                  </Form.Group>
                                  <span className="vl"></span>
                                  <div className="delete-icon-block">
                                    <IconButton
                                      type="button"
                                      onClick={() => {
                                        let newObj = _this.state.tabListData;
                                        newObj.splice(key, 1);
                                        _this.setState({ tabListData: newObj });
                                      }}
                                    >
                                      <img src={deleteIcon} alt="" />
                                    </IconButton>
                                  </div>
                                </div>
                              </div>

                              <div className="btn-group">
                                <Grid container spacing="5">
                                  <Grid item sm={6}>
                                    <Form.Group
                                      className="input-field-block-cust"
                                      controlId="formBasicEmail"
                                    >
                                      <Form.Control
                                        type="text"
                                        placeholder="Button Name"
                                        value={prop.button_name}
                                        onChange={(e) => {
                                          let newObj = _this.state.tabListData;
                                          newObj[key].button_name =
                                            e.target.value;
                                          _this.setState({
                                            tabListData: newObj,
                                          });
                                        }}
                                      />
                                    </Form.Group>
                                  </Grid>

                                  <Grid item sm={6}>
                                    <Form.Group
                                      className="search-block-cust"
                                      controlId="formBasicEmail"
                                    >
                                      <div className="search-field-box search-field-box2">
                                        <img src={link} alt="" />
                                        <Form.Control
                                          type="text"
                                          placeholder="Link"
                                          value={prop.button_link}
                                          onChange={(e) => {
                                            let newObj =
                                              _this.state.tabListData;
                                            newObj[key].button_link =
                                              e.target.value;
                                            _this.setState({
                                              tabListData: newObj,
                                            });
                                          }}
                                        />
                                      </div>
                                    </Form.Group>
                                  </Grid>
                                </Grid>
                              </div>
                            </div>
                          );
                        })}

                      <div className="next-btn-block">
                        <Button
                          type="button"
                          onClick={() => {
                            let newObj = _this.state.tabListData;
                            newObj.push({
                              button_name: "",
                              new_tab: 0,
                              button_link: "https://",
                              key: newObj.length,
                            });
                            _this.setState({
                              addURLData: newObj,
                            });
                          }}
                          variant="text"
                        >
                          <img src={plus} alt="" />
                          Add next button
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="footer">
            <Button
              type="button"
              onClick={() => {
                _this.fetchDataFromServer();
              }}
              variant="outlined"
              className="cancel-btn"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => {
                _this.onSubmit();
              }}
              variant="outlined"
              className="save-btn"
            >
              Save
            </Button>
          </div>
        </div>
      </Fragment>
    );
  }
}
