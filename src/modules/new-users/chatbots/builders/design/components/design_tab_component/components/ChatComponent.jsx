import { Button, IconButton, Menu } from "@mui/material";
import React, { Component, Fragment } from "react";
import { ColorPicker } from "react-color-gradient-picker";
import Slider from "@mui/material/Slider";
import { Form } from "react-bootstrap";
import image from "../../../../../../../../assets/images/image.svg";
import { styled } from "@mui/material/styles";
import avt11 from "../../../../../../../../assets/images/avatar/avt13.png";
import avt12 from "../../../../../../../../assets/images/avatar/avt14.jpeg";
import deleteIcon from "../../../../../../../../assets/images/trash (1).svg";
import {
  createGeneralChats,
  getChartSettingList,
} from "../../../server/BuilderDesignServer.js";
import { AlertContext } from "../../../../../../../common/Alert";
import SimpleReactValidator from "simple-react-validator";

const solidColor = {
  red: 0,
  green: 66,
  blue: 79,
  alpha: 1,
  style: "rgb(0, 66, 79)",
};

const gradient = {
  points: [
    {
      left: 0,
      red: 0,
      green: 0,
      blue: 0,
      alpha: 1,
    },
    {
      left: 100,
      red: 255,
      green: 0,
      blue: 0,
      alpha: 1,
    },
  ],
  degree: 0,
  type: "linear",
};

const textColor = {
  red: 159,
  green: 22,
  blue: 237,
  alpha: 1,
};

export default class ChatComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {},
    });
    this.state = {
      showGradientColorModal: null,
      showSolidColorModal: null,
      showTextColorModal: null,
      showTypingColorModal: null,
      showTextColorModal1: null,
      showTextColorModal2: null,
      showTextColorModal3: null,
      showTextColorModal4: null,
      showTextColorModal5: null,
      generalChatSetting: {
        type: props.layoutType,
        bot_id: props.botIdURL,
        profile: null,
        avatar: null,
        avatarstatus: 0,
        opacity: 1,
        sameprofileavatar: 0,

        chatbox_theme_type: "",
        chatbox_text_color: "",
        chatbox_theme_color: "",

        button_text_color: "",
        button_background_color: "",
        button_border_color: "",

        user_response_msg_background_color: "",
        user_response_msg_text_color: "",

        // landing_text_color: "",
        // landing_theme_type: "",
        // landing_theme_start: "",
        // landing_theme_color: "",
        // widget_theme_type: "",
        // widget_theme_start: "",
        // widget_theme_color: "",
        // widget_text_color: "",
        // embed_theme_type: "",
        // embed_theme_start: "",
        // embed_theme_color: "",
        // embed_text_color: ""
      },
      message_bubble: "one-rounder",
      chatbox_theme_type: "color",
      setImage: null,
      setAvatar: null,
      avatarImage: null,

      applyTextColor: "",
      applySolidColor: "",
      applyGradientColor: "",
      applyTypingColor: "",

      setSolidColor: solidColor,
      setGradientColor: gradient,
      setTextColor: textColor,
      setMessageBackground: textColor,
      setMessageTextColor: textColor,
      setButtonBorderColor: textColor,
      setButtonTextColor: textColor,
      setButtonBackgroundColor: textColor,
      setTypingColor: textColor,

      buttonRadius: 0,
      scaleRadius: 0,
      profileRadius: 0,
      setDefaultImg: true,
      setShape: "rounded",
    };
  }
  componentDidMount() {
    let _this = this;
    _this.fetchDataFromServer();
  }

  fetchDataFromServer = () => {
    let _this = this;
    let params = `type=${_this.props.layoutType}&bot_id=${_this.props.botIdURL}`;
    getChartSettingList(
      params,
      (res) => {
        let temp = _this.state.generalChatSetting;
        if (res.chatbox_theme_type === "color") {
          temp.theme_color = res.chatbox_theme_color;
          console.log("applySolidColor", res.chatbox_theme_color);
          _this.setState({
            applySolidColor: res.chatbox_theme_color,
            applyGradientColor: "",
          });
        } else if (res.chatbox_theme_type === "gradient") {
          temp.theme_color = res.chatbox_theme_color;
          console.log("applyGradientColor", res.chatbox_theme_color);
          _this.setState({
            applySolidColor: "",
            applyGradientColor: res.chatbox_theme_color,
          });
        }
        temp.bot_id = _this.props.botIdURL;
        temp.opacity = res.opacity;
        temp.type = _this.props.layoutType;

        temp.chatbox_theme_type = res.chatbox_theme_type
          ? res.chatbox_theme_type
          : "color";
        temp.chatbox_theme_color = res.chatbox_theme_color;
        temp.button_text_color = res.button_text_color
          ? res.button_text_color
          : "rgb(0,0,0)";
        temp.button_background_color = res.button_background_color;
        temp.button_border_color = res.button_border_color;
        temp.user_response_msg_background_color =
          res.user_response_msg_background_color;
        temp.user_response_msg_text_color = res.user_response_msg_text_color;
        let avatarImage = res.avatar ? res.avatar : process.env.REACT_APP_LOGO;

        avatarImage = avatarImage.replace(
          "https://app2.weconnect.chat/assets/images/",
          process.env.REACT_APP_ICONS
        );
        _this.setState({
          scaleRadius: res.avatar_scale,
          profileRadius: res.profile_picture_scale,
          loading: false,
          setAvatar: res.avatar ? res.avatar : process.env.REACT_APP_LOGO,
          avatarImage: avatarImage,
          setImage: res.profile ? res.profile : process.env.REACT_APP_LOGO,
          applyTextColor: res.chatbox_text_color
            ? res.chatbox_text_color
            : "rgb(255,255,255)",
          applyTypingColor: res.typing_color
            ? res.typing_color
            : "rgb(255,255,255)",
          buttonRadius: res.button_radius,
          chatbox_theme_type: res.chatbox_theme_type
            ? res.chatbox_theme_type
            : "color",
          message_bubble: res.message_bubble
            ? res.message_bubble
            : "one-rounder",
          generalChatSetting: temp,
        });
      },
      () => {
        _this.props._this.setState({ loading: false });
      }
    );
  };
  onSubmit = () => {
    let _this = this;
    if (_this.validator.allValid()) {
      let tempObj = JSON.parse(JSON.stringify(_this.state.generalChatSetting));
      tempObj.chatbox_theme_type = _this.state.chatbox_theme_type;
      tempObj.chatbox_text_color =
        _this.state.applyTextColor !== ""
          ? _this.state.applyTextColor
          : _this.state.setTextColor.style;

      tempObj.typing_color =
        _this.state.applyTypingColor !== ""
          ? _this.state.applyTypingColor
          : _this.state.setTypingColor.style;

      if (_this.state.chatbox_theme_type === "color") {
        tempObj.chatbox_theme_color =
          _this.state.applySolidColor === ""
            ? _this.state.setSolidColor.style
            : _this.state.applySolidColor;
      }
      if (_this.state.chatbox_theme_type === "gradient") {
        tempObj.chatbox_theme_color =
          _this.state.applyGradientColor === ""
            ? _this.state.setGradientColor.style
            : _this.state.applyGradientColor;
      }

      if (_this.state.setAvatar !== null) {
        tempObj.avatar = _this.state.setAvatar;
      } else {
        tempObj.avatar = _this.state.avatarImage;
      }
      tempObj.avatar_scale = _this.state.scaleRadius;
      tempObj.profile_picture_scale = _this.state.profileRadius;
      tempObj.avatar_shape = "rounded";

      tempObj.button_text_color = this.state.setButtonTextColor.style
        ? this.state.setButtonTextColor.style
        : this.state.generalChatSetting.button_text_color;
      tempObj.button_background_color = this.state.setButtonBackgroundColor
        .style
        ? this.state.setButtonBackgroundColor.style
        : this.state.generalChatSetting.button_background_color;
      tempObj.button_border_color = this.state.setButtonBorderColor.style
        ? this.state.setButtonBorderColor.style
        : this.state.generalChatSetting.button_border_color;
      tempObj.button_radius = this.state.buttonRadius;

      tempObj.message_bubble = this.state.message_bubble;
      tempObj.user_response_msg_background_color = this.state
        .setMessageBackground.style
        ? this.state.setMessageBackground.style
        : this.state.generalChatSetting.user_response_msg_background_color;
      tempObj.user_response_msg_text_color = this.state.setMessageTextColor
        .style
        ? this.state.setMessageTextColor.style
        : this.state.generalChatSetting.user_response_msg_text_color;

      if (_this.state.setImage !== null) tempObj.profile = _this.state.setImage;
      if (tempObj.sameprofileavatar || _this.state.setDefaultImg) {
        tempObj.avatarstatus = 0;
        // tempObj.sameprofileavatar = tempObj.sameprofileavatar
      } else {
        tempObj.avatarstatus = 1;
        // tempObj.sameprofileavatar = tempObj.sameprofileavatar;
      }
      // _this.props.handleLoadingShow(true);
      // setTimeout(() => {
      //   _this.props.handleLoadingShow(false);
      // }, 3000);
      this.context.showLoading();
      createGeneralChats(
        _this.props.super_this,
        tempObj,
        (res) => {
          // _this.props.handleLoadingShow(false);
          _this.props.super_this.fetchServerDesign();
          this.context.showAlert({
            type: "success",
            message: "Updated Successfully!",
          });
          _this.props.super_this.setState({
            isHeaderTabActive: false,
            headerMessage: "",
            activeLandingTab: 1,
            activeWidgetTab: 1,
            activeEmbedTab: 1,
          });
          // setTimeout(() => {
          // }, 3000);
        },
        (res) => {
          this.context.showAlert({
            type: "error",
            message: res.message,
          });
        }
      );
    } else {
      _this.validator.showMessages();
      this.forceUpdate();
    }
  };
  handleCardClick = (event) => {
    this.setState({
      cardAnchorEl: event.currentTarget,
    });
  };

  handleHeaderColor = (event) => {
    this.setState({
      headerAnchorEl: event.currentTarget,
    });
  };

  handleHeaderColorClose = () => {
    this.setState({
      headerAnchorEl: null,
    });
  };
  handleGradientClick = (event) => {
    this.setState({
      showGradientColorModal: event.currentTarget,
    });
  };
  handleGradientClose = () => {
    this.setState({
      showGradientColorModal: null,
    });
  };

  handleSolidClick = (event) => {
    this.setState({
      showSolidColorModal: event.currentTarget,
    });
  };

  handleSolidClose = () => {
    this.setState({
      showSolidColorModal: null,
    });
  };

  onChangeSolidColor = (colorcardAttrs) => {
    let _this = this;
    _this.setState(
      {
        chatbox_theme_type: "color",
        applySolidColor: "",
        applyGradientColor: "",
        setSolidColor: colorcardAttrs,
        setGradientColor: gradient,
      },
      () => {
        this.refreshWidgetStyle();
      }
    );
  };

  refreshWidgetStyle = () => {
    if (
      window.WeConnect &&
      window.WeConnect.webchatRef.current &&
      window.WeConnect.webchatRef.current.updateWebchatSettings
    ) {
      const textColor = this.state.applyTextColor
        ? this.state.applyTextColor
        : this.state.setTextColor.style;
      const typingColor = this.state.applyTypingColor
        ? this.state.applyTypingColor
        : this.state.setTypingColor.style;
      let color;

      if (this.state.chatbox_theme_type === "color") {
        color =
          this.state.applySolidColor === ""
            ? this.state.setSolidColor.style
            : this.state.applySolidColor;
      } else {
        color =
          this.state.applyGradientColor === ""
            ? this.state.setGradientColor.style
            : this.state.applyGradientColor;
      }

      const responsebgColor = this.state.setMessageBackground.style
        ? this.state.setMessageBackground.style
        : this.state.generalChatSetting.user_response_msg_background_color;
      const user_response_msg_text_color = this.state.setMessageTextColor.style
        ? this.state.setMessageTextColor.style
        : this.state.generalChatSetting.user_response_msg_text_color;

      const button_background_color = this.state.setButtonBackgroundColor.style
        ? this.state.setButtonBackgroundColor.style
        : this.state.generalChatSetting.button_background_color;
      const button_border_color = this.state.setButtonBorderColor.style
        ? this.state.setButtonBorderColor.style
        : this.state.generalChatSetting.button_border_color;
      const button_text_color = this.state.setButtonTextColor.style
        ? this.state.setButtonTextColor.style
        : this.state.generalChatSetting.button_text_color;
      console.log("widgetStyle", {
        widgetStyle: {
          color: textColor,
          background: color,
        },
        typingColor: typingColor,
        responseStyle: {
          color: user_response_msg_text_color,
          background: responsebgColor,
        },
        buttonStyle: {
          color: button_text_color,
          background: button_background_color,
          border: `1px solid ${button_border_color}`,
          borderRadius:
            this.state.buttonRadius > 50
              ? this.state.buttonRadius - 50 + "%"
              : this.state.buttonRadius + "px",
        },
        messageBubble: this.state.message_bubble,
        opacity: this.state.generalChatSetting.opacity / 100,
        avatarScale: this.state.scaleRadius,
        profileScale: this.state.profileRadius + "%",
      });
      window.WeConnect.webchatRef.current.updateWebchatSettings({
        widgetStyle: {
          color: textColor,
          background: color,
        },
        typingColor: typingColor,
        responseStyle: {
          color: user_response_msg_text_color,
          background: responsebgColor,
        },
        buttonStyle: {
          color: button_text_color,
          background: button_background_color,
          border: `1px solid ${button_border_color}`,
          borderRadius:
            this.state.buttonRadius > 50
              ? this.state.buttonRadius - 50 + "%"
              : this.state.buttonRadius + "px",
        },
        messageBubble: this.state.message_bubble,
        opacity: this.state.generalChatSetting.opacity / 100,
        avatarScale: this.state.scaleRadius,
        profileScale: this.state.profileRadius + "%",
      });
    }
  };

  refreshImageStyle = (avimage) => {
    if (
      window.WeConnect &&
      window.WeConnect.webchatRef.current &&
      window.WeConnect.webchatRef.current.updateWebchatSettings
    ) {
      let avatar = this.state.setAvatar;
      if (avimage) {
        avatar = this.state.avatarImage;
      }
      let profile = this.state.setImage;
      if (!this.state.generalChatSetting.sameprofileavatar == 0) {
        profile = avatar;
      }
      console.log("this.state.avatarImage", this.state.avatarImage);
      console.log("this.state.setAvatar", this.state.setAvatar);

      window.WeConnect.webchatRef.current.updateWebchatSettings({
        profile: profile,
        avatar: avatar,
      });
    }
  };

  onChangeGradientColor = (gradientAttrs) => {
    let _this = this;
    _this.setState(
      {
        // showGradientColorModal: null,
        applySolidColor: "",
        applyGradientColor: "",
        chatbox_theme_type: "gradient",
        setSolidColor: solidColor,
        setGradientColor: gradientAttrs,
      },
      () => {
        this.refreshWidgetStyle();
      }
    );

    console.log("it works");
  };

  handleHeaderText = (event) => {
    this.setState({
      showTextColorModal: event.currentTarget,
    });
  };
  handleTypingColorToggle = (event) => {
    this.setState({
      showTypingColorModal: event.currentTarget,
    });
  };

  addChatMessagPreview() {
    if (window.WeConnect && window.WeConnect.addUserMessage) {
      const message = {
        type: "postback",
        payload: "preview_chat",
      };

      window.WeConnect.clearMessages();
      window.WeConnect.addUserMessage(message);
    }
  }

  handleHeaderTextClose = () => {
    this.setState({
      showTextColorModal: null,
    });
  };

  onChangeHeaderText = (color) => {
    let _this = this;
    _this.setState(
      {
        applyTextColor: "",
        setTextColor: color,
      },
      () => {
        this.refreshWidgetStyle();
      }
    );
  };

  handleTypingColorClose = () => {
    this.setState({
      showTypingColorModal: null,
    });
  };

  onChangeTypingColor = (color) => {
    let _this = this;
    _this.setState(
      {
        applyTypingColor: "",
        setTypingColor: color,
      },
      () => {
        this.refreshWidgetStyle();
      }
    );
  };

  handleHeaderText1 = (event) => {
    this.setState({
      showTextColorModal1: event.currentTarget,
    });
  };

  handleHeaderTextClose1 = () => {
    this.setState({
      showTextColorModal1: null,
    });
  };
  onChangeHeaderText1 = (color) => {
    let _this = this;
    _this.setState(
      {
        setMessageBackground: color,
      },
      () => {
        this.refreshWidgetStyle();
      }
    );
  };
  handleHeaderText2 = (event) => {
    this.setState({
      showTextColorModal2: event.currentTarget,
    });
  };

  handleHeaderTextClose2 = () => {
    this.setState({
      showTextColorModal2: null,
    });
  };
  onChangeHeaderText2 = (color) => {
    let _this = this;
    _this.setState(
      {
        setMessageTextColor: color,
      },
      () => {
        this.refreshWidgetStyle();
      }
    );
  };
  handleHeaderText3 = (event) => {
    this.setState({
      showTextColorModal3: event.currentTarget,
    });
  };

  handleHeaderTextClose3 = () => {
    this.setState({
      showTextColorModal3: null,
    });
  };
  onChangeHeaderText3 = (color) => {
    let _this = this;
    _this.setState(
      {
        setButtonBorderColor: color,
      },
      () => {
        this.refreshWidgetStyle();
      }
    );
  };
  handleHeaderText4 = (event) => {
    this.setState({
      showTextColorModal4: event.currentTarget,
    });
  };

  handleHeaderTextClose4 = () => {
    this.setState({
      showTextColorModal4: null,
    });
  };
  onChangeHeaderText4 = (color) => {
    let _this = this;
    _this.setState(
      {
        setButtonTextColor: color,
      },
      () => {
        this.refreshWidgetStyle();
      }
    );
  };
  handleHeaderText5 = (event) => {
    this.setState({
      showTextColorModal5: event.currentTarget,
    });
  };

  handleHeaderTextClose5 = () => {
    this.setState({
      showTextColorModal5: null,
    });
  };
  onChangeHeaderText5 = (color) => {
    let _this = this;
    _this.setState(
      {
        setButtonBackgroundColor: color,
      },
      () => {
        this.refreshWidgetStyle();
      }
    );
  };
  handleFileChange = (files) => {
    let _this = this;
    let FileLimit = 0,
      sizeType = "";
    if (files && files.length > 0) {
      var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (files[0].size == 0) return "n/a";
      var i = parseInt(Math.floor(Math.log(files[0].size) / Math.log(1024)));
      if (i == 0) {
        FileLimit = files[0].size;
        sizeType = sizes[i];
      } else {
        FileLimit = (files[0].size / Math.pow(1024, i)).toFixed(1);
        sizeType = sizes[i];
      }
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          _this.setState(
            {
              setImage: reader.result,
            },
            () => {
              this.refreshImageStyle();
            }
          );
        },
        false
      );
      reader.readAsDataURL(files[0]);
    }
  };
  handleFileChange1 = (files) => {
    let _this = this;
    let FileLimit = 0,
      sizeType = "";
    if (files && files.length > 0) {
      var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (files[0].size == 0) return "n/a";
      var i = parseInt(Math.floor(Math.log(files[0].size) / Math.log(1024)));
      if (i == 0) {
        FileLimit = files[0].size;
        sizeType = sizes[i];
      } else {
        FileLimit = (files[0].size / Math.pow(1024, i)).toFixed(1);
        sizeType = sizes[i];
      }

      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          _this.setState(
            {
              setAvatar: reader.result,
              setDefaultImg: false,
            },
            () => {
              this.refreshImageStyle();
            }
          );
        },
        false
      );
      reader.readAsDataURL(files[0]);
    }
  };

  handleMessageBubble = (type) => {
    let _this = this;
    _this.setState(
      {
        message_bubble: type,
      },
      () => {
        this.refreshWidgetStyle();
      }
    );
  };

  render() {
    let _this = this;
    const headerTextOpen = Boolean(_this.state.showTextColorModal);
    const headerTypingOpen = Boolean(_this.state.showTypingColorModal);
    const headerTextOpen1 = Boolean(_this.state.showTextColorModal1);
    const headerTextOpen2 = Boolean(_this.state.showTextColorModal2);
    const headerTextOpen3 = Boolean(_this.state.showTextColorModal3);
    const headerTextOpen4 = Boolean(_this.state.showTextColorModal4);
    const headerTextOpen5 = Boolean(_this.state.showTextColorModal5);
    const gradientOpen = Boolean(_this.state.showGradientColorModal);
    const solidOpen = Boolean(_this.state.showSolidColorModal);
    const Input = styled("input")({
      display: "none",
    });

    return (
      <Fragment>
        <div className="main-section chat-block-section">
          <div className="block">
            <label htmlFor="Chat Style" className="title-label">
              Chat Style
            </label>
            <div className="inner-block">
              <label htmlFor="MESSAGE BUBBLE" className="inner-title-label">
                MESSAGE BUBBLE
              </label>
              <div className="bubble-block">
                <div
                  className={`bubble square${
                    this.state.message_bubble === "square" ? " selected" : ""
                  }`}
                  onClick={() => this.handleMessageBubble("square")}
                >
                  <p>hi</p>
                </div>

                <div
                  className={`bubble rounder${
                    this.state.message_bubble === "rounder" ? " selected" : ""
                  }`}
                  onClick={() => this.handleMessageBubble("rounder")}
                >
                  <p>hi</p>
                </div>

                <div
                  className={`bubble one-rounder${
                    this.state.message_bubble === "one-rounder"
                      ? " selected"
                      : ""
                  }`}
                  onClick={() => this.handleMessageBubble("one-rounder")}
                >
                  <p>hi</p>
                </div>

                <div
                  className={`bubble open${
                    this.state.message_bubble === "open" ? " selected" : ""
                  }`}
                  onClick={() => this.handleMessageBubble("open")}
                >
                  <p>hi</p>
                </div>
              </div>
              <hr />
              <label htmlFor="CHATBOX" className="inner-title-label">
                CHATBOX
              </label>

              <div className="color-block">
                <div className="simple">
                  <Button variant="text" onClick={this.handleSolidClick}>
                    <div
                      className="preview-color-block header-color"
                      style={
                        _this.state.applySolidColor !== ""
                          ? {
                              background: _this.state.applySolidColor,
                              backgroundColor: _this.state.applySolidColor,
                            }
                          : {
                              background: _this.state.setSolidColor.style,
                              backgroundColor: _this.state.setSolidColor.style,
                            }
                      }
                    ></div>
                    Solid Color
                  </Button>
                </div>

                <div className="gradient">
                  <Button
                    variant="text"
                    onClick={this.handleGradientClick}
                    className="gradient-btn"
                  >
                    <div
                      className="preview-color-block"
                      style={
                        _this.state.applyGradientColor !== ""
                          ? {
                              background: _this.state.applyGradientColor,
                              backgroundColor: _this.state.applyGradientColor,
                            }
                          : {
                              background: _this.state.setGradientColor.style,
                              backgroundColor:
                                _this.state.setGradientColor.style,
                            }
                      }
                    ></div>
                    Gradient Color
                  </Button>
                </div>

                <div className="simple">
                  <Button variant="text" onClick={this.handleHeaderText}>
                    {_this.state.applyTextColor !== "" ? (
                      <div
                        className="preview-color-block header-text"
                        style={{
                          background: _this.state.applyTextColor,
                          backgroundColor: _this.state.applyTextColor,
                        }}
                      ></div>
                    ) : (
                      <div
                        className="preview-color-block header-text"
                        style={{
                          background: _this.state.setTextColor.style,
                          backgroundColor: _this.state.setTextColor.style,
                        }}
                      ></div>
                    )}
                    Text Color
                  </Button>
                </div>

                <div className="simple">
                  <Button variant="text" onClick={this.handleTypingColorToggle}>
                    {_this.state.applyTypingColor !== "" ? (
                      <div
                        className="preview-color-block header-text"
                        style={{
                          background: _this.state.applyTypingColor,
                          backgroundColor: _this.state.applyTypingColor,
                        }}
                      ></div>
                    ) : (
                      <div
                        className="preview-color-block header-text"
                        style={{
                          background: _this.state.setTypingColor.style,
                          backgroundColor: _this.state.setTypingColor.style,
                        }}
                      ></div>
                    )}
                    Typing Color
                  </Button>
                </div>
              </div>

              <div className="opacity-radius-block">
                <p className="title">Opacity</p>
                <div className="bar-block rating_range_unique">
                  <Slider
                    min={1}
                    max={100}
                    value={
                      _this.state.generalChatSetting &&
                      _this.state.generalChatSetting.opacity
                    }
                    onChange={(e) => {
                      let temp = _this.state.generalChatSetting;
                      temp.opacity = e.target.value;
                      _this.setState(
                        {
                          generalChatSetting: temp,
                        },
                        () => {
                          this.refreshWidgetStyle();
                        }
                      );
                    }}
                    valueLabelDisplay="auto"
                    valueLabelFormat={this.valueTempLabelFormat}
                  />
                </div>
              </div>
              <hr />
              <label htmlFor="USER MESSAGE" className="inner-title-label">
                {" "}
                USER RESPONSE MESSAGE
              </label>
              <div className="color-block">
                <div className="simple">
                  <Button variant="text" onClick={this.handleHeaderText1}>
                    <div
                      className="preview-color-block header-color"
                      style={
                        this.state.generalChatSetting
                          .user_response_msg_background_color === "" ||
                        (this.state.setMessageBackground &&
                          this.state.setMessageBackground.style)
                          ? {
                              background: this.state.setMessageBackground.style,
                              backgroundColor:
                                this.state.setMessageBackground.style,
                            }
                          : {
                              background:
                                this.state.generalChatSetting
                                  .user_response_msg_background_color,
                              backgroundColor:
                                this.state.generalChatSetting
                                  .user_response_msg_background_color,
                            }
                      }
                    ></div>
                    Background Color
                  </Button>
                </div>

                <div className="simple">
                  <Button variant="text" onClick={this.handleHeaderText2}>
                    <div
                      className="preview-color-block header-text"
                      style={
                        this.state.generalChatSetting
                          .user_response_msg_text_color === "" ||
                        (this.state.setMessageTextColor &&
                          this.state.setMessageTextColor.style)
                          ? {
                              background: this.state.setMessageTextColor.style,
                              backgroundColor:
                                this.state.setMessageTextColor.style,
                            }
                          : {
                              background:
                                this.state.generalChatSetting
                                  .user_response_msg_text_color,
                              backgroundColor:
                                this.state.generalChatSetting
                                  .user_response_msg_text_color,
                            }
                      }
                    ></div>
                    Text Color
                  </Button>
                </div>
              </div>
              <hr />
              <label htmlFor="BUTTON STYLE" className="inner-title-label">
                BUTTON STYLE
              </label>
              <div className="opacity-radius-block">
                <p className="title">Button Radius</p>
                <div className="bar-block rating_range_unique">
                  <Slider
                    min={1}
                    max={100}
                    value={this.state.buttonRadius}
                    onChange={(e) =>
                      _this.setState({ buttonRadius: e.target.value }, () => {
                        this.refreshWidgetStyle();
                      })
                    }
                    valueLabelDisplay="auto"
                    valueLabelFormat={this.valueTempLabelFormat}
                  />
                </div>
              </div>
              <div className="color-block">
                <div className="simple">
                  <Button variant="text" onClick={this.handleHeaderText3}>
                    <div
                      className="preview-color-block header-color"
                      style={
                        _this.state.generalChatSetting.button_border_color ===
                          "" ||
                        (this.state.setButtonBorderColor &&
                          this.state.setButtonBorderColor.style)
                          ? {
                              background: this.state.setButtonBorderColor.style,
                              backgroundColor:
                                this.state.setButtonBorderColor.style,
                            }
                          : {
                              background:
                                this.state.generalChatSetting
                                  .button_border_color,
                              backgroundColor:
                                this.state.generalChatSetting
                                  .button_border_color,
                            }
                      }
                    ></div>
                    Button Border Color
                  </Button>
                </div>

                <div className="simple">
                  <Button variant="text" onClick={this.handleHeaderText5}>
                    <div
                      className="preview-color-block header-text"
                      style={
                        _this.state.generalChatSetting
                          .button_background_color === "" ||
                        (_this.state.setButtonBackgroundColor &&
                          _this.state.setButtonBackgroundColor.style)
                          ? {
                              background:
                                this.state.setButtonBackgroundColor.style,
                              backgroundColor:
                                this.state.setButtonBackgroundColor.style,
                            }
                          : {
                              background:
                                this.state.generalChatSetting
                                  .button_background_color,
                              backgroundColor:
                                this.state.generalChatSetting
                                  .button_background_color,
                            }
                      }
                    ></div>
                    Button Background Color
                  </Button>
                </div>
                <div className="simple">
                  <Button variant="text" onClick={this.handleHeaderText4}>
                    <div
                      className="preview-color-block header-text"
                      style={
                        this.state.generalChatSetting.button_text_color ===
                          "" ||
                        (this.state.setButtonTextColor &&
                          this.state.setButtonTextColor.style)
                          ? {
                              background: this.state.setButtonTextColor.style,
                              backgroundColor:
                                this.state.setButtonTextColor.style,
                            }
                          : {
                              background:
                                this.state.generalChatSetting.button_text_color,
                              backgroundColor:
                                this.state.generalChatSetting.button_text_color,
                            }
                      }
                    ></div>
                    Button Text Color
                  </Button>
                </div>
              </div>
            </div>

            <div className="dates_component ">
              <label htmlFor="">Profile Picture & Avatar</label>
              <div>
                <p className="date_text">
                  <div className="upload-image-block">
                    <label htmlFor="UPLOAD IMAGE" className="title-label">
                      UPLOAD PROFILE IMAGE
                    </label>
                    <div className="upload_chat_box_avatar">
                      <div className="preview-upload">
                        <div
                          className="preview"
                          style={
                            this.state.setImage !== null
                              ? { background: "transparent" }
                              : {}
                          }
                        >
                          {this.state.setImage === null ? (
                            <img src={image} alt="" />
                          ) : (
                            <img
                              src={this.state.setImage}
                              alt=""
                              className="show-preview"
                            />
                          )}
                        </div>
                        <div className="upload">
                          <label htmlFor="contained-button-file">
                            <Input
                              accept="image/*"
                              id="contained-button-file"
                              // multiple
                              type="file"
                              onChange={(e) => {
                                _this.handleFileChange(
                                  e.target.files,
                                  "profile"
                                );
                              }}
                            />
                            <Button variant="contained" component="span">
                              Choose file
                            </Button>
                          </label>
                        </div>
                        {this.state.setImage !== null ? (
                          <div
                            role="button"
                            onClick={() => {
                              _this.setState({
                                setImage: null,
                              });
                            }}
                            className="icon-block"
                          >
                            <IconButton type="button">
                              <img src={deleteIcon} alt="" />
                            </IconButton>
                          </div>
                        ) : null}
                      </div>
                      <div className="condition-block">
                        <ul>
                          <li>Image format: JPG/PNG</li>
                          <li>Maximum Size: 20MB </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="errorMsg"></div>
                  <div className="upload-image-block">
                    <label htmlFor="UPLOAD IMAGE" className="title-label">
                      UPLOAD AVATAR IMAGE
                    </label>
                    <div className="upload_chat_box_avatar">
                      <div className="preview-upload">
                        <div
                          className="preview"
                          style={
                            this.state.setAvatar !== null
                              ? { background: "transparent" }
                              : {}
                          }
                        >
                          {this.state.setAvatar === null ? (
                            <img src={image} alt="" />
                          ) : (
                            <img
                              src={this.state.setAvatar}
                              alt=""
                              className="show-preview"
                            />
                          )}
                        </div>
                        <div className="upload">
                          <label htmlFor="contained-button-file1">
                            <Input
                              accept="image/*"
                              id="contained-button-file1"
                              // multiple
                              type="file"
                              onChange={(e) => {
                                _this.handleFileChange1(
                                  e.target.files,
                                  "avatar"
                                );
                              }}
                            />
                            <Button variant="contained" component="span">
                              Choose file
                            </Button>
                          </label>
                        </div>
                        {this.state.setAvatar !== null ? (
                          <div
                            role="button"
                            onClick={() => {
                              _this.setState({
                                setAvatar: null,
                              });
                            }}
                            className="icon-block"
                          >
                            <IconButton type="button">
                              <img src={deleteIcon} alt="" />
                            </IconButton>
                          </div>
                        ) : null}
                      </div>
                      <div className="condition-block">
                        <ul>
                          <li>Image format: JPG/PNG</li>
                          <li>Maximum Size: 20MB </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <Form.Group controlId="formBasicCheckbox">
                    <Form.Check
                      className="picture_avatar_checkbox"
                      type="checkbox"
                      label="SAME PROFILE PICTURE & AVATAR"
                      value={
                        _this.state.generalChatSetting.sameprofileavatar == 0
                          ? false
                          : true
                      }
                      checked={
                        _this.state.generalChatSetting.sameprofileavatar == 0
                          ? false
                          : true
                      }
                      onChange={(e) => {
                        var newObj = _this.state.generalChatSetting;
                        newObj.sameprofileavatar =
                          newObj.sameprofileavatar == 0 ? 1 : 0;
                        _this.setState({
                          generalChatSetting: newObj,
                        });
                        this.refreshImageStyle();
                      }}
                    />
                  </Form.Group>
                  <hr />
                  <label htmlFor="PICK A AVATAR" className="title-label">
                    AVATAR
                  </label>
                  <div className="loaders-block">
                    <div>
                      <div
                        style={
                          _this.state.avatarImage === process.env.REACT_APP_LOGO
                            ? {
                                border: "2px solid blue",
                                padding: "5px",
                              }
                            : {}
                        }
                        role="button"
                        onClick={() => {
                          _this.setState(
                            {
                              avatarImage: process.env.REACT_APP_LOGO,
                              setAvatar: process.env.REACT_APP_LOGO,
                            },
                            () => {
                              this.refreshImageStyle(true);
                            }
                          );
                        }}
                        className="loader"
                      >
                        <img src={process.env.REACT_APP_LOGO} alt="" />
                      </div>
                      <div
                        style={
                          _this.state.avatarImage ===
                          process.env.REACT_APP_ICONS + "avatar_1.gif"
                            ? {
                                border: "2px solid blue",
                                padding: "5px",
                              }
                            : {}
                        }
                        role="button"
                        onClick={() => {
                          _this.setState(
                            {
                              avatarImage:
                                process.env.REACT_APP_ICONS + "avatar_1.gif",
                              setAvatar:
                                process.env.REACT_APP_ICONS + "avatar_1.gif",
                            },
                            () => {
                              this.refreshImageStyle(true);
                            }
                          );
                        }}
                        className="loader"
                      >
                        <img
                          src={process.env.REACT_APP_ICONS + "avatar_1.gif"}
                          alt=""
                        />
                      </div>
                      <div
                        style={
                          _this.state.avatarImage ===
                          process.env.REACT_APP_ICONS + "avatar_2.png"
                            ? {
                                border: "2px solid blue",
                                padding: "5px",
                              }
                            : {}
                        }
                        role="button"
                        onClick={() => {
                          _this.setState(
                            {
                              avatarImage:
                                process.env.REACT_APP_ICONS + "avatar_2.png",
                              setAvatar:
                                process.env.REACT_APP_ICONS + "avatar_2.png",
                            },
                            () => {
                              this.refreshImageStyle(true);
                            }
                          );
                        }}
                        className="loader"
                      >
                        <img
                          src={process.env.REACT_APP_ICONS + "avatar_2.png"}
                          alt=""
                        />
                      </div>
                      <div
                        style={
                          _this.state.avatarImage ===
                          process.env.REACT_APP_ICONS + "avatar_3.jpg"
                            ? {
                                border: "2px solid blue",
                                padding: "5px",
                              }
                            : {}
                        }
                        role="button"
                        onClick={() => {
                          _this.setState(
                            {
                              avatarImage:
                                process.env.REACT_APP_ICONS + "avatar_3.jpg",
                              setAvatar:
                                process.env.REACT_APP_ICONS + "avatar_3.jpg",
                            },
                            () => {
                              this.refreshImageStyle(true);
                            }
                          );
                        }}
                        className="loader"
                      >
                        <img
                          src={process.env.REACT_APP_ICONS + "avatar_3.jpg"}
                          alt=""
                        />
                      </div>
                      <div
                        style={
                          _this.state.avatarImage ===
                          process.env.REACT_APP_ICONS + "avatar_4.gif"
                            ? {
                                border: "2px solid blue",
                                padding: "5px",
                              }
                            : {}
                        }
                        role="button"
                        onClick={() => {
                          _this.setState(
                            {
                              avatarImage:
                                process.env.REACT_APP_ICONS + "avatar_4.gif",
                              setAvatar:
                                process.env.REACT_APP_ICONS + "avatar_4.gif",
                            },
                            () => {
                              this.refreshImageStyle(true);
                            }
                          );
                        }}
                        className="loader"
                      >
                        <img
                          src={process.env.REACT_APP_ICONS + "avatar_4.gif"}
                          alt=""
                        />
                      </div>
                      <div
                        style={
                          _this.state.avatarImage ===
                          process.env.REACT_APP_ICONS + "avatar_5.jpg"
                            ? {
                                border: "2px solid blue",
                                padding: "5px",
                              }
                            : {}
                        }
                        role="button"
                        onClick={() => {
                          _this.setState(
                            {
                              avatarImage:
                                process.env.REACT_APP_ICONS + "avatar_5.jpg",
                              setAvatar:
                                process.env.REACT_APP_ICONS + "avatar_5.jpg",
                            },
                            () => {
                              this.refreshImageStyle(true);
                            }
                          );
                        }}
                        className="loader"
                      >
                        <img
                          src={process.env.REACT_APP_ICONS + "avatar_5.jpg"}
                          alt=""
                        />
                      </div>
                      <div
                        style={
                          _this.state.avatarImage ===
                          process.env.REACT_APP_ICONS + "avatar_6.png"
                            ? {
                                border: "2px solid blue",
                                padding: "5px",
                              }
                            : {}
                        }
                        role="button"
                        onClick={() => {
                          _this.setState(
                            {
                              avatarImage:
                                process.env.REACT_APP_ICONS + "avatar_6.png",
                              setAvatar:
                                process.env.REACT_APP_ICONS + "avatar_6.png",
                            },
                            () => {
                              this.refreshImageStyle(true);
                            }
                          );
                        }}
                        className="loader"
                      >
                        <img
                          src={process.env.REACT_APP_ICONS + "avatar_6.png"}
                          alt=""
                        />
                      </div>
                      <div
                        style={
                          _this.state.avatarImage ===
                          process.env.REACT_APP_ICONS + "avatar_7.gif"
                            ? {
                                border: "2px solid blue",
                                padding: "5px",
                              }
                            : {}
                        }
                        role="button"
                        onClick={() => {
                          _this.setState(
                            {
                              avatarImage:
                                process.env.REACT_APP_ICONS + "avatar_7.gif",
                              setAvatar:
                                process.env.REACT_APP_ICONS + "avatar_7.gif",
                            },
                            () => {
                              this.refreshImageStyle(true);
                            }
                          );
                        }}
                        className="loader"
                      >
                        <img
                          src={process.env.REACT_APP_ICONS + "avatar_7.gif"}
                          alt=""
                        />
                      </div>
                      <div
                        style={
                          _this.state.avatarImage ===
                          process.env.REACT_APP_ICONS + "avatar_8.jpg"
                            ? {
                                border: "2px solid blue",
                                padding: "5px",
                              }
                            : {}
                        }
                        role="button"
                        onClick={() => {
                          _this.setState(
                            {
                              avatarImage:
                                process.env.REACT_APP_ICONS + "avatar_8.jpg",
                              setAvatar:
                                process.env.REACT_APP_ICONS + "avatar_8.jpg",
                            },
                            () => {
                              this.refreshImageStyle(true);
                            }
                          );
                        }}
                        className="loader"
                      >
                        <img
                          src={process.env.REACT_APP_ICONS + "avatar_8.jpg"}
                          alt=""
                        />
                      </div>
                      <div
                        style={
                          _this.state.avatarImage ===
                          process.env.REACT_APP_ICONS + "avatar_9.png"
                            ? {
                                border: "2px solid blue",
                                padding: "5px",
                              }
                            : {}
                        }
                        role="button"
                        onClick={() => {
                          _this.setState(
                            {
                              avatarImage:
                                process.env.REACT_APP_ICONS + "avatar_9.png",
                              setAvatar:
                                process.env.REACT_APP_ICONS + "avatar_9.png",
                            },
                            () => {
                              this.refreshImageStyle(true);
                            }
                          );
                        }}
                        className="loader"
                      >
                        <img
                          src={process.env.REACT_APP_ICONS + "avatar_9.png"}
                          alt=""
                        />
                      </div>
                      <div
                        style={
                          _this.state.avatarImage ===
                          process.env.REACT_APP_ICONS + "avatar_11.png"
                            ? {
                                border: "2px solid blue",
                                padding: "5px",
                              }
                            : {}
                        }
                        role="button"
                        onClick={() => {
                          _this.setState(
                            {
                              avatarImage:
                                process.env.REACT_APP_ICONS + "avatar_11.png",
                            },
                            () => {
                              this.refreshImageStyle(true);
                            }
                          );
                        }}
                        className="loader"
                      >
                        <img
                          src={process.env.REACT_APP_ICONS + "avatar_11.png"}
                          alt=""
                        />
                      </div>
                      <div
                        style={
                          _this.state.avatarImage ===
                          process.env.REACT_APP_ICONS + "avatar_14.png"
                            ? {
                                border: "2px solid blue",
                                padding: "5px",
                              }
                            : {}
                        }
                        role="button"
                        onClick={() => {
                          _this.setState(
                            {
                              avatarImage:
                                process.env.REACT_APP_ICONS + "avatar_14.png",
                            },
                            () => {
                              this.refreshImageStyle(true);
                            }
                          );
                        }}
                        className="loader"
                      >
                        <img
                          src={process.env.REACT_APP_ICONS + "avatar_14.png"}
                          alt=""
                        />
                      </div>
                    </div>
                  </div>
                  <div className="errorMsg">
                    {_this.validator.message(
                      "avatar Image",
                      _this.state.avatarImage !== null ||
                        _this.state.setAvatar !== null
                        ? true
                        : "",
                      "required"
                    )}
                  </div>
                  {/* Avatar Image&nbsp;
                  <label htmlFor="SHAPE & SCALE" className="title-label">
                    SHAPE & SCALE
                  </label>
                  <div className="select-shape-block">
                    <p>Select Shape</p>
                    <Form.Select
                      aria-label="Default select example"
                      className="simple-select-field-block-cust"
                      value={_this.state.setShape}
                      onChange={(e) => {
                        _this.setState({
                          setShape: e.target.value
                        });
                      }}
                    >
                      <option value="rounded">Rounded</option>
                    </Form.Select>
                  </div> */}
                  <div className="opacity-radius-block">
                    <p className="title">Avatar Image Scale</p>
                    <div className="bar-block rating_range_unique">
                      <Slider
                        min={1}
                        max={100}
                        value={this.state.scaleRadius}
                        onChange={(e) =>
                          _this.setState(
                            { scaleRadius: e.target.value },
                            () => {
                              this.refreshWidgetStyle();
                            }
                          )
                        }
                        valueLabelDisplay="auto"
                        valueLabelFormat={this.valueTempLabelFormat}
                      />
                    </div>
                  </div>

                  <div className="opacity-radius-block">
                    <p className="title">Profile Image Scale</p>
                    <div className="bar-block rating_range_unique">
                      <Slider
                        min={1}
                        max={100}
                        value={this.state.profileRadius}
                        onChange={(e) =>
                          _this.setState(
                            { profileRadius: e.target.value },
                            () => {
                              this.refreshWidgetStyle();
                            }
                          )
                        }
                        valueLabelDisplay="auto"
                        valueLabelFormat={this.valueTempLabelFormat}
                      />
                    </div>
                  </div>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="knowledge_footer">
          <div className="btn_block">
            <Button
              role="button"
              onClick={() => {
                _this.props.super_this.fetchServerDesign();
                _this.props.super_this.setState({
                  isHeaderTabActive: false,
                  headerMessage: "",
                  activeLandingTab: 1,
                  activeWidgetTab: 1,
                  activeEmbedTab: 1,
                });
              }}
              variant="contained"
              className="cancel-btn"
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="button"
              onClick={() => {
                _this.onSubmit();
              }}
              className="save-btn"
            >
              Save
            </Button>
          </div>
        </div>

        <Menu
          id="basic-menu"
          anchorEl={this.state.showSolidColorModal}
          open={solidOpen}
          onClose={this.handleSolidClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          className="color-model-block"
        >
          <div>
            <ColorPicker
              onStartChange={_this.onChangeSolidColor}
              onChange={_this.onChangeSolidColor}
              onEndChange={_this.onChangeSolidColor}
              color={_this.state.setSolidColor}
            />
          </div>
        </Menu>
        <Menu
          id="basic-menu"
          anchorEl={_this.state.showGradientColorModal}
          open={gradientOpen}
          onClose={_this.handleGradientClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          className="color-model-block"
        >
          <div>
            <ColorPicker
              onStartChange={_this.onChangeGradientColor}
              onChange={_this.onChangeGradientColor}
              onEndChange={_this.onChangeGradientColor}
              gradient={this.state.setGradientColor}
              isGradient
            />
          </div>
        </Menu>
        <Menu
          id="basic-menu"
          anchorEl={this.state.showTextColorModal}
          open={headerTextOpen}
          onClose={this.handleHeaderTextClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          className="color-model-block"
        >
          <div>
            <ColorPicker
              onStartChange={this.onChangeHeaderText}
              onChange={this.onChangeHeaderText}
              onEndChange={this.onChangeHeaderText}
              color={this.state.setTextColor}
            />
          </div>
        </Menu>
        <Menu
          id="basic-menu"
          anchorEl={this.state.showTypingColorModal}
          open={headerTypingOpen}
          onClose={this.handleTypingColorClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          className="color-model-block"
        >
          <div>
            <ColorPicker
              onStartChange={this.onChangeTypingColor}
              onChange={this.onChangeTypingColor}
              onEndChange={this.onChangeTypingColor}
              color={this.state.setTextColor}
            />
          </div>
        </Menu>
        <Menu
          id="basic-menu"
          anchorEl={this.state.showTextColorModal1}
          open={headerTextOpen1}
          onClose={this.handleHeaderTextClose1}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          className="color-model-block"
        >
          <div>
            <ColorPicker
              onStartChange={this.onChangeHeaderText1}
              onChange={this.onChangeHeaderText1}
              onEndChange={this.onChangeHeaderText1}
              color={this.state.setMessageBackground}
            />
          </div>
        </Menu>
        <Menu
          id="basic-menu"
          anchorEl={this.state.showTextColorModal2}
          open={headerTextOpen2}
          onClose={this.handleHeaderTextClose2}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          className="color-model-block"
        >
          <div>
            <ColorPicker
              onStartChange={this.onChangeHeaderText2}
              onChange={this.onChangeHeaderText2}
              onEndChange={this.onChangeHeaderText2}
              color={this.state.setMessageTextColor}
            />
          </div>
        </Menu>
        <Menu
          id="basic-menu"
          anchorEl={this.state.showTextColorModal3}
          open={headerTextOpen3}
          onClose={this.handleHeaderTextClose3}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          className="color-model-block"
        >
          <div>
            <ColorPicker
              onStartChange={this.onChangeHeaderText3}
              onChange={this.onChangeHeaderText3}
              onEndChange={this.onChangeHeaderText3}
              color={this.state.setButtonBorderColor}
            />
          </div>
        </Menu>
        <Menu
          id="basic-menu"
          anchorEl={this.state.showTextColorModal4}
          open={headerTextOpen4}
          onClose={this.handleHeaderTextClose4}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          className="color-model-block"
        >
          <div>
            <ColorPicker
              onStartChange={this.onChangeHeaderText4}
              onChange={this.onChangeHeaderText4}
              onEndChange={this.onChangeHeaderText4}
              color={this.state.setButtonTextColor}
            />
          </div>
        </Menu>
        <Menu
          id="basic-menu"
          anchorEl={this.state.showTextColorModal5}
          open={headerTextOpen5}
          onClose={this.handleHeaderTextClose5}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
          className="color-model-block"
        >
          <div>
            <ColorPicker
              onStartChange={this.onChangeHeaderText5}
              onChange={this.onChangeHeaderText5}
              onEndChange={this.onChangeHeaderText5}
              color={this.state.setButtonBackgroundColor}
            />
          </div>
        </Menu>
      </Fragment>
    );
  }
}
