import React, { Component, Fragment } from "react";
import { FloatingLabel, Form, Modal } from "react-bootstrap";
import SimpleReactValidator from "simple-react-validator";
import img1 from "../../../../../../assets/images/screen1.png";
import ani1 from "../../../../../../assets/images/Ellipse 445.svg";
import img3 from "../../../../../../assets/images/screen3.png";
// import edit2 from "../../../../../../assets/images/edit-2.svg";
import img2 from "../../../../../../assets/images/screen2.png";
import eye from "../../../../../../assets/images/eye.svg";
import deleteIcon from "../../../../../../assets/images/trash (1).svg";
import smile from "../../../../../../assets/images/smile3.svg";
import dot from "../../../../../../assets/images/dots.svg";
import image from "../../../../../../assets/images/image.svg";
import { Button, IconButton } from "@mui/material";
import plus from "../../../../../../assets/images/plus (1).svg";
import hyper_link from "../../../../../../assets/images/hyperlink.svg";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Backdrop from "@mui/material/Backdrop";
import Loader from "react-js-loader";
import {
  getWidgetSettingList,
  createUpdateWidgetSetting,
} from "../server/WidgetComponentServer";
import {
  warningAlert,
  successAlert,
  errorAlert,
} from "../../../../../../js/alerts.js";
import EmojiMartPickerComponent from "../../../../../agent/common/EmojiMartPickerComponent";
import GifImagesPageComponent from "../../../../../agent/common/GifImagesPageComponent.jsx";
// import CropImageComponent from "./CropImageComponent.jsx";
import { styled } from "@mui/material/styles";
import ReactPlayer from "react-player";
import Dialog from "@mui/material/Dialog";
// import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
// import DialogTitle from "@mui/material/DialogTitle";
import ClearIcon from "@mui/icons-material/Clear";
// import { BiCheck } from "react-icons/bi";
import EditWidgetLabel from "./EditWidgetLabelComponent";
import WidgetColorPicker from "./WidgetColorPicker";
import { Container, Draggable } from "react-smooth-dnd";
import styledComponent, { keyframes } from "styled-components";
import { GenIcon } from "react-icons/lib";
import Slider from "@mui/material/Slider";

const pulse_tada = keyframes`
  0%, 100% {
    -webkit-transform: scale3d(1,1,1);
    transform: scale3d(1,1,1);
  }
  10%, 20% {
      -webkit-transform: scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg);
      transform: scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg);
  }
  30%, 50%, 70%, 90% {
      -webkit-transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg);
      transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg);
  }
  40%, 60%, 80% {
      -webkit-transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg);
      transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg);
  }
`;

const pulse_border = keyframes`
  0% {
		padding: 25px;
		opacity: 0.75;
	}
	75% {
		padding: 50px;
		opacity: 0;
	}
	100% {
		opacity: 0;
	}
`;

// const pulse = keyframes`
//   0% {
//       box-shadow: 0 0 0 0 rgb(37 211 102 / 50%);
//   }
//   80% {
//       box-shadow: 0 0 0 14px rgb(37 211 102 / 0%);
//   }
// `;

const pulse = keyframes`
0% {
  padding: 25px;
  opacity: 0.75;
}
75% {
  padding: 50px;
  opacity: 0;
}
100% {
  opacity: 0;
}
`;

function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

const TriggerButtonRipple = styledComponent.div`
  cursor: pointer;
  user-select: none;
  z-index: 111;
  background: #00424f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  box-shadow: 0px 6px 42px #2425330f;
  justify-content: center;
  // overflow: hidden;
  width: 60px;
  height: 60px;
  bottom: 8px;
  padding: 8px;
  z-index: 9999;
  // animation: ${pulse} 1.5s infinite ease-out;
  &:before{
    content: "";
    position: absolute;
    border-radius: 50%;
    padding: 25px;
    border: 5px solid #00424f;
    opacity: 0.75;
    animation: ${pulse_border} 1.5s ease-out infinite;
  }
`;

const TriggerButtonTada = styledComponent.div`
  cursor: pointer;
  user-select: none;
  z-index: 111;
  background: #00424f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  box-shadow: 0px 6px 42px #2425330f;
  justify-content: center;
  // overflow: hidden;
  width: 60px;
  height: 60px;
  bottom: "8px";
  padding: 8px;
  z-index: 9999;
  animation: ${pulse_tada} 1.5s infinite ease-out;
`;

const MsgImg = function MdOutlineClose(props) {
  return GenIcon({
    tag: "svg",
    attr: { viewBox: "0 0 14.806 14.8" },
    child: [
      {
        tag: "path",
        attr: {
          d: "M13.806 9.533a1.423 1.423 0 01-1.423 1.422H3.846L1 13.8V2.422A1.423 1.423 0 012.423 1h9.96a1.423 1.423 0 011.423 1.422z",
        },
      },
    ],
  })(props);
};

const iconColor = {
  red: 159,
  green: 22,
  blue: 237,
  alpha: 1,
};

export class WidgetComponent extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {},
    });

    this.cropper = React.createRef();
    this.state = {
      progress: 0,
      loading: false,
      cropperImg: null,
      widgetSetting: {
        afterscrollpercent: 0,
        after_scroll_percent_mobile: 0,
        blockipaddress: "",
        closeoptioncheckbox: 0,
        hideonpages: "",
        launchcriteriawelcomemessagepercent: 0,
        openaftersec: 0,
        open_after_sec_mobile: 0,
        pageurl: "",
        showactiveagentcheckbox: 0,
        showaftersec: 0,
        show_after_sec_mobile: 0,
        showondevice: "all",
        showonpages: "",
        welcomemessagecheckbox: 0,
        welcomescreencheckbox: 0,
        welcomescreenlayout: "",
        widgetlaunchcriteriacheckbox: 0,
        widget_launch_criteria_checkbox_mobile: 0,
        widgetanimationcheckbox: 0,
        showcontinueconvcheckbox: 0,
        showsearchbarcheckbox: 0,
        showconvstartercardcheckbox: 0,
        chatnowcheckbox: 0,
        whatsappcheckbox: 0,
        emailcheckbox: 0,
        widgetanimationtype: "",
        widgetmessage1: [],
        widgetmessage2: [],
        widgetmessage3: [],
        widgetmessage4: [],
        startanewconversationvalue: "Start a conversation",
        showactiveagentvalue: "active agents",
        showcontinueconvalue: "Continue Conversation",
        showsearchbarvalue: "Search for help",
        chatnowvalue: "Chat Now",
        whatsappvalue: "Whatsapp",
        whatsapphyperlink: "",
        emailhyperlink: "",
        emailvalue: "Email",
        chat_now_subtitle: "Invite a live chat or vidoe call with agents",
        chat_now_icon_color: "",
        whatsapp_subtitle: "Start a live chat on WhatsApp",
        whatsapp_icon_color: "",
        email_subtitle: "Send a direct message to us",
        email_icon_color: "",
        knowledge_base_checkbox: "",
        knowledge_base_value: "Knowledge Base",
        knowledge_base_subtitle: "Get answers to most FAQ's",
        knowledge_base_icon_color: "",
        welcome_screen_profile_picture: "",
        welcome_screen_profile_pic_scale: 0,
        show_active_agent_subtitle_online: "",
        show_active_agent_subtitle_offline: "",
      },
      welcome_screen_profile_picture_preview: "",
      messageData: [],
      activeMsgIndex: 0,
      addURLData: [],
      messageText: "",
      isShowEmojiModal: false,
      isShowGifImgModal: false,
      showImage: false,
      file: null,
      previewModel: false,
      videoFormatModal: false,
      previewImg: "img1",
      errorHighlight: false,
    };
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    _this.fetchDataFromServer();
  }

  fetchDataFromServer = () => {
    let _this = this;
    let params = `botid=${_this.props.botIdURL}`;
    getWidgetSettingList(
      params,
      (res) => {
        let temp = res.widgetsetting;
        // let Obj = _this.state.messageData;
        let Obj = [];
        if (
          (temp.widgetmessage1 && temp.widgetmessage1.value !== "") ||
          (temp.widgetmessage2 && temp.widgetmessage2.value !== "") ||
          (temp.widgetmessage3 && temp.widgetmessage3.value !== "") ||
          (temp.widgetmessage4 && temp.widgetmessage4.value !== "")
        ) {
          if (
            temp.widgetmessage1 &&
            temp.widgetmessage1.type !== "" &&
            temp.widgetmessage1.value
          ) {
            let type = temp.widgetmessage1.value.toLowerCase().includes(".gif")
              ? "GIF"
              : temp.widgetmessage1.type === "text"
              ? "textBox"
              : "imgVideo";
            Obj.push({
              type: type,
              message: temp.widgetmessage1.value,
              name: "",
              setFile: temp.widgetmessage1.value,
              videoPreview: "",
              imageStr:
                type === "imgVideo"
                  ? temp.widgetmessage1.type
                  : temp.widgetmessage1.value,
              active: false,
              showImage: temp.widgetmessage1.type === "image" ? true : false,
              showVideo: temp.widgetmessage1.type === "video" ? true : false,
              GIFImg: type === "GIF" ? true : false,
              key: Obj.length,
            });
          }
          if (
            temp.widgetmessage2 &&
            temp.widgetmessage2.type !== "" &&
            temp.widgetmessage2.value
          ) {
            let type = temp.widgetmessage2.value.toLowerCase().includes(".gif")
              ? "GIF"
              : temp.widgetmessage2.type === "text"
              ? "textBox"
              : "imgVideo";
            Obj.push({
              type: type,
              message: temp.widgetmessage2.value,
              name: "",
              setFile: temp.widgetmessage2.value,
              videoPreview: "",
              imageStr:
                type === "imgVideo"
                  ? temp.widgetmessage2.type
                  : temp.widgetmessage2.value,
              active: false,
              showImage: temp.widgetmessage2.type === "image" ? true : false,
              showVideo: temp.widgetmessage2.type === "video" ? true : false,
              GIFImg: type === "GIF" ? true : false,
              key: Obj.length,
            });
          }
          if (
            temp.widgetmessage3 &&
            temp.widgetmessage3.type !== "" &&
            temp.widgetmessage3.value
          ) {
            let type = temp.widgetmessage3.value.toLowerCase().includes(".gif")
              ? "GIF"
              : temp.widgetmessage3.type === "text"
              ? "textBox"
              : "imgVideo";
            Obj.push({
              type: type,
              message: temp.widgetmessage3.value,
              name: "",
              setFile: temp.widgetmessage3.value,
              videoPreview: "",
              imageStr:
                type === "imgVideo"
                  ? temp.widgetmessage3.type
                  : temp.widgetmessage3.value,
              active: false,
              showImage: temp.widgetmessage3.type === "image" ? true : false,
              showVideo: temp.widgetmessage3.type === "video" ? true : false,
              GIFImg: type === "GIF" ? true : false,
              key: Obj.length,
            });
          }
          if (
            temp.widgetmessage4 &&
            temp.widgetmessage4.type !== "" &&
            temp.widgetmessage4.value
          ) {
            let type = temp.widgetmessage4.value.toLowerCase().includes(".gif")
              ? "GIF"
              : temp.widgetmessage4.type === "text"
              ? "textBox"
              : "imgVideo";
            Obj.push({
              type: type,
              message: temp.widgetmessage4.value,
              name: "",
              setFile: temp.widgetmessage4.value,
              videoPreview: "",
              imageStr:
                type === "imgVideo"
                  ? temp.widgetmessage4.type
                  : temp.widgetmessage4.value,
              active: false,
              showImage: temp.widgetmessage4.type === "image" ? true : false,
              showVideo: temp.widgetmessage4.type === "video" ? true : false,
              GIFImg: type === "GIF" ? true : false,
              key: Obj.length,
            });
          }
        }
        if (temp.pageurl !== "") {
          let newObj = [];
          if (temp.pageurl.includes(",")) {
            let data = temp.pageurl.split(",");
            data &&
              data.length > 0 &&
              data.map((x) => {
                newObj.push({
                  URL: x,
                  key: newObj.length,
                });
                return x;
              });
          } else {
            newObj.push({
              URL: temp.pageurl,
              key: newObj.length,
            });
          }
          _this.setState({
            addURLData: newObj,
          });
        }

        temp.startanewconversationvalue =
          temp.startanewconversationvalue || "Start a conversation";
        temp.showactiveagentvalue =
          temp.showactiveagentvalue || "active agents";
        temp.showcontinueconvalue =
          temp.showcontinueconvalue || "Continue Conversation";
        temp.showsearchbarvalue = temp.showsearchbarvalue || "Search for help";
        temp.chatnowvalue = temp.chatnowvalue || "Chat Now";
        temp.whatsappvalue = temp.whatsappvalue || "Whatsapp";
        temp.whatsapphyperlink = temp.whatsapphyperlink || "";
        temp.emailhyperlink = temp.emailhyperlink || "";
        temp.emailvalue = temp.emailvalue || "Email";

        temp.chat_now_subtitle =
          temp.chat_now_subtitle ||
          "Invite a live chat or vidoe call with agents";
        temp.whatsapp_subtitle =
          temp.whatsapp_subtitle || "Start a live chat on WhatsApp";
        temp.email_subtitle =
          temp.email_subtitle || "Send a direct message to us";

        temp.knowledge_base_value =
          temp.knowledge_base_value || "Knowledge Base";
        temp.knowledge_base_subtitle =
          temp.knowledge_base_subtitle || "Get answers to most FAQ's";
        temp.show_active_agent_subtitle_online =
          temp.show_active_agent_subtitle_online || "online";
        temp.show_active_agent_subtitle_offline =
          temp.show_active_agent_subtitle_offline || "offline";

        // temp.welcome_screen_profile_picture = temp.welcome_screen_profile_picture || "Get answers to most FAQ's";

        if (isJsonString(temp.chat_now_icon_color)) {
          console.log("icon color", temp.chat_now_icon_color);
          temp.chat_now_icon_color = JSON.parse(temp.chat_now_icon_color);
        } else {
          temp.chat_now_icon_color = {
            red: 85,
            green: 64,
            blue: 96,
            alpha: 1,
            style: "rgba(85, 64, 96, 1)",
          };
        }

        if (isJsonString(temp.whatsapp_icon_color)) {
          temp.whatsapp_icon_color = JSON.parse(temp.whatsapp_icon_color);
        } else {
          temp.whatsapp_icon_color = {
            red: 75,
            green: 200,
            blue: 89,
            alpha: 1,
            style: "rgba(75, 200, 89, 1)",
          };
        }

        if (isJsonString(temp.email_icon_color)) {
          temp.email_icon_color = JSON.parse(temp.email_icon_color);
        } else {
          temp.email_icon_color = {
            red: 0,
            green: 172,
            blue: 139,
            alpha: 1,
            style: "rgba(0, 172, 139, 1)",
          };
        }

        if (isJsonString(temp.knowledge_base_icon_color)) {
          temp.knowledge_base_icon_color = JSON.parse(
            temp.knowledge_base_icon_color
          );
        } else {
          temp.knowledge_base_icon_color = {
            red: 0,
            green: 172,
            blue: 139,
            alpha: 1,
            style: "rgba(119, 75, 201, 1)",
          };
        }

        _this.setState({
          messageData: Obj,
          widgetSetting: temp,
          loading: false,
        });
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };
  onSubmit = () => {
    let _this = this;
    let params = `botid=${_this.props.botIdURL}`;
    let newObj = JSON.parse(JSON.stringify(_this.state.widgetSetting));

    if (_this.validator.allValid()) {
      if (_this.state.widgetSetting.welcomemessagecheckbox === 1) {
        if (!Array.isArray(_this.state.messageData)) {
          errorAlert("Invalid Welcome Message", _this.props.superThis);

          return;
        }
        let isEmpty = _this.state.messageData.length === 0;
        if (!isEmpty) {
          isEmpty = _this.state.messageData.some((item) => {
            return item.message === "";
          });
        }
        if (isEmpty) {
          errorAlert(
            "Welcome Message should not be Empty",
            _this.props.superThis
          );

          return;
        }
      }
      if (newObj.welcomescreencheckbox === 1) {
        if (
          newObj.showactiveagentcheckbox === 0 &&
          newObj.showcontinueconvcheckbox === 0 &&
          newObj.showsearchbarcheckbox === 0 &&
          newObj.showconvstartercardcheckbox === 0 &&
          newObj.welcomescreenlayout !== "layout_2"
        ) {
          errorAlert(
            "Select anyone item from Welcome Screen",
            _this.props.superThis
          );
          _this.setState({
            errorHighlight: true,
          });
          setTimeout(() => _this.setState({ errorHighlight: false }), 5000);
          return;
        }

        if (
          typeof newObj.welcome_screen_profile_picture == "string" &&
          newObj.welcome_screen_profile_picture.trim() === ""
        ) {
          errorAlert(
            "Please UPLOAD WELCOME SCREEN IMAGE",
            _this.props.superThis
          );
          return;
        }
      }

      if (newObj.showconvstartercardcheckbox === 1) {
        if (
          newObj.chatnowcheckbox === 0 &&
          newObj.whatsappcheckbox === 0 &&
          newObj.emailcheckbox === 0
        ) {
          errorAlert(
            "Select anyone item from conversation starter cards",
            _this.props.superThis
          );
          return;
        }
        debugger;

        if (newObj.chatnowvalue.trim() === "") {
          errorAlert(
            "Chat Now title Should not be empty",
            _this.props.superThis
          );
          return;
        }

        if (newObj.whatsappvalue.trim() === "") {
          errorAlert(
            "Whatsap title Should not be empty",
            _this.props.superThis
          );
          return;
        }

        if (newObj.emailvalue.trim() === "") {
          errorAlert("Email title Should not be empty", _this.props.superThis);
          return;
        }

        if (newObj.knowledge_base_value.trim() === "") {
          errorAlert(
            "Knowledge base title Should not be empty",
            _this.props.superThis
          );
          return;
        }

        if (newObj.chat_now_subtitle.trim() === "") {
          errorAlert(
            "Chat Now subtitle Should not be empty",
            _this.props.superThis
          );
          return;
        }

        if (newObj.whatsapp_subtitle.trim() === "") {
          errorAlert(
            "Whatsap subtitle Should not be empty",
            _this.props.superThis
          );
          return;
        }

        if (newObj.email_subtitle.trim() === "") {
          errorAlert(
            "Email subtitle Should not be empty",
            _this.props.superThis
          );
          return;
        }

        if (newObj.knowledge_base_subtitle.trim() === "") {
          errorAlert(
            "Knowledge base title Should not be empty",
            _this.props.superThis
          );
          return;
        }

        // if(newObj.whatsappcheckbox === 1) {
        //   if(newObj.whatsapphyperlink.trim()==="") {
        //     errorAlert("whatsapphyperlink field is required", _this.props.superThis);
        //     return;
        //   }
        // }
      }

      var tempObj = new FormData();
      tempObj.append("botid", _this.props.botIdURL);
      tempObj.append("showondevice", newObj.showondevice.trim());
      tempObj.append("blockipaddress", newObj.blockipaddress);

      tempObj.append(
        "widgetlaunchcriteriacheckbox",
        newObj.widgetlaunchcriteriacheckbox
      );
      tempObj.append("openaftersec", newObj.openaftersec);
      tempObj.append("showaftersec", newObj.showaftersec);
      tempObj.append("afterscrollpercent", newObj.afterscrollpercent);

      tempObj.append(
        "widget_launch_criteria_checkbox_mobile",
        newObj.widget_launch_criteria_checkbox_mobile
      );
      tempObj.append("open_after_sec_mobile", newObj.open_after_sec_mobile);
      tempObj.append("show_after_sec_mobile", newObj.show_after_sec_mobile);
      tempObj.append(
        "after_scroll_percent_mobile",
        newObj.after_scroll_percent_mobile
      );

      tempObj.append("hideonpages", newObj.hideonpages);
      tempObj.append("showonpages", newObj.showonpages);
      tempObj.append("welcomemessagecheckbox", newObj.welcomemessagecheckbox);
      tempObj.append("closeoptioncheckbox", newObj.closeoptioncheckbox);
      tempObj.append(
        "showcontinueconvcheckbox",
        newObj.showcontinueconvcheckbox
      );
      tempObj.append("showsearchbarcheckbox", newObj.showsearchbarcheckbox);
      tempObj.append(
        "showconvstartercardcheckbox",
        newObj.showconvstartercardcheckbox
      );
      tempObj.append("chatnowcheckbox", newObj.chatnowcheckbox);
      tempObj.append("whatsappcheckbox", newObj.whatsappcheckbox);
      tempObj.append("emailcheckbox", newObj.emailcheckbox);
      tempObj.append("knowledge_base_checkbox", newObj.knowledge_base_checkbox);

      tempObj.append("widgetanimationcheckbox", newObj.widgetanimationcheckbox);
      tempObj.append("widgetanimationtype", newObj.widgetanimationtype);
      tempObj.append(
        "launchcriteriawelcomemessagepercent",
        newObj.launchcriteriawelcomemessagepercent
      );
      let UrlData = "";
      if (_this.state.addURLData && _this.state.addURLData.length > 0) {
        _this.state.addURLData.map((prop, key) => {
          if (key !== 0) {
            UrlData += ",";
          }
          UrlData += prop.URL;
          return prop;
        });
      }
      tempObj.append("pageurl", UrlData);
      tempObj.append("welcomescreencheckbox", newObj.welcomescreencheckbox);
      tempObj.append("welcomescreenlayout", newObj.welcomescreenlayout);
      tempObj.append("showactiveagentcheckbox", newObj.showactiveagentcheckbox);
      tempObj.append(
        "startanewconversationvalue",
        newObj.startanewconversationvalue
      );
      tempObj.append("showactiveagentvalue", newObj.showactiveagentvalue);
      tempObj.append(
        "show_active_agent_subtitle_offline",
        newObj.show_active_agent_subtitle_offline
      );
      tempObj.append(
        "show_active_agent_subtitle_online",
        newObj.show_active_agent_subtitle_online
      );
      tempObj.append("showcontinueconvalue", newObj.showcontinueconvalue);
      tempObj.append("showsearchbarvalue", newObj.showsearchbarvalue);

      tempObj.append("chatnowvalue", newObj.chatnowvalue);
      tempObj.append("whatsappvalue", newObj.whatsappvalue);
      tempObj.append("whatsapphyperlink", newObj.whatsapphyperlink);
      tempObj.append("emailhyperlink", newObj.emailhyperlink);
      tempObj.append("emailvalue", newObj.emailvalue);
      tempObj.append("knowledge_base_value", newObj.knowledge_base_value);

      tempObj.append("chat_now_subtitle", newObj.chat_now_subtitle);
      tempObj.append("whatsapp_subtitle", newObj.whatsapp_subtitle);
      tempObj.append("email_subtitle", newObj.email_subtitle);
      tempObj.append("knowledge_base_subtitle", newObj.knowledge_base_subtitle);

      tempObj.append(
        "chat_now_icon_color",
        JSON.stringify(newObj.chat_now_icon_color)
      );
      tempObj.append(
        "whatsapp_icon_color",
        JSON.stringify(newObj.whatsapp_icon_color)
      );
      tempObj.append(
        "email_icon_color",
        JSON.stringify(newObj.email_icon_color)
      );
      tempObj.append(
        "knowledge_base_icon_color",
        JSON.stringify(newObj.knowledge_base_icon_color)
      );
      tempObj.append(
        "welcome_screen_profile_picture",
        _this.state.widgetSetting.welcome_screen_profile_picture
      );
      tempObj.append(
        "welcome_screen_profile_pic_scale",
        _this.state.widgetSetting.welcome_screen_profile_pic_scale
      );

      if (_this.state.messageData && _this.state.messageData.length > 0) {
        if (_this.state.messageData[0].type === "imgVideo") {
          tempObj.append(
            `widgetmessage1[type]`,
            `${_this.state.messageData[0].showVideo ? "video" : "image"}`
          );
          tempObj.append(
            `widgetmessage1[value]`,
            _this.state.messageData[0].message
          );
        } else {
          tempObj.append(`widgetmessage1[type]`, `text`);
          tempObj.append(
            `widgetmessage1[value]`,
            _this.state.messageData[0].message
          );
        }
      } else {
        tempObj.append(`widgetmessage1[type]`, ``);
        tempObj.append(`widgetmessage1[value]`, ``);
      }

      if (_this.state.messageData && _this.state.messageData.length > 1) {
        if (_this.state.messageData[1].type === "imgVideo") {
          tempObj.append(
            `widgetmessage2[type]`,
            `${_this.state.messageData[1].showVideo ? "video" : "image"}`
          );
          tempObj.append(
            `widgetmessage2[value]`,
            _this.state.messageData[1].message
          );
        } else {
          tempObj.append(`widgetmessage2[type]`, `text`);
          tempObj.append(
            `widgetmessage2[value]`,
            _this.state.messageData[1].message
          );
        }
      } else {
        tempObj.append(`widgetmessage2[type]`, ``);
        tempObj.append(`widgetmessage2[value]`, ``);
      }
      if (_this.state.messageData && _this.state.messageData.length > 2) {
        if (_this.state.messageData[2].type === "imgVideo") {
          tempObj.append(
            `widgetmessage3[type]`,
            `${_this.state.messageData[2].showVideo ? "video" : "image"}`
          );
          tempObj.append(
            `widgetmessage3[value]`,
            _this.state.messageData[2].message
          );
        } else {
          tempObj.append(`widgetmessage3[type]`, `text`);
          tempObj.append(
            `widgetmessage3[value]`,
            _this.state.messageData[2].message
          );
        }
      } else {
        tempObj.append(`widgetmessage3[type]`, ``);
        tempObj.append(`widgetmessage3[value]`, ``);
      }
      if (_this.state.messageData && _this.state.messageData.length > 3) {
        if (_this.state.messageData[3].type === "imgVideo") {
          tempObj.append(
            `widgetmessage4[type]`,
            `${_this.state.messageData[3].showVideo ? "video" : "image"}`
          );
          tempObj.append(
            `widgetmessage4[value]`,
            _this.state.messageData[3].message
          );
        } else {
          tempObj.append(`widgetmessage4[type]`, `text`);
          tempObj.append(
            `widgetmessage4[value]`,
            _this.state.messageData[3].message
          );
        }
      } else {
        tempObj.append(`widgetmessage4[type]`, ``);
        tempObj.append(`widgetmessage4[value]`, ``);
      }
      _this.setState({
        loading: true,
      });
      createUpdateWidgetSetting(
        _this,
        params,
        tempObj,
        (res) => {
          _this.setState({ loading: false });
          if (res.data.status == "True") {
            successAlert("Updated Successfully!", _this.props.superThis);
          } else {
            const message = res.data.message || "Update Failed!";
            errorAlert(message, _this.props.superThis);
            _this.setState({
              videoFormatModal: true,
            });
          }
          _this.fetchDataFromServer();
          _this.props.selectActiveTab(5);
        },
        (res) => {
          _this.setState({ loading: false });
          const message = res.message || "Update Failed!";
          errorAlert(message, _this.props.superThis);
        },
        (progress) => {
          _this.setState({
            progress: progress,
          });
        }
      );
    } else {
      _this.setState({ loading: false });
      // _this.validator.showMessages();
      // this.forceUpdate();
    }
  };
  handleInputChange = (e) => {
    let _this = this;
    var newObj = _this.state.widgetSetting;
    const { name, value } = e.target;
    newObj[name] = value;
    _this.setState({ widgetSetting: newObj });
  };

  handleInputChangeCheckbox = (e) => {
    // debugger;
    let _this = this;
    var newObj = _this.state.widgetSetting;
    const { name, checked } = e.target;
    newObj[name] = checked ? 1 : 0;
    _this.setState({ widgetSetting: newObj });
  };

  handleColorChange = (colorAttrs, name) => {
    let _this = this;
    var newObj = _this.state.widgetSetting;
    newObj[name] = colorAttrs;
    _this.setState({ widgetSetting: newObj });
  };

  handleFileChange = (files, index) => {
    let _this = this;
    // let FileLimit = 0,
    //   sizeType = "";
    if (files && files.length > 0) {
      // var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (files[0].size === 0) return "n/a";
      // var i = parseInt(Math.floor(Math.log(files[0].size) / Math.log(1024)));
      // if (i === 0) {
      //   FileLimit = files[0].size;
      //   sizeType = sizes[i];
      // } else {
      //   FileLimit = (files[0].size / Math.pow(1024, i)).toFixed(1);
      //   sizeType = sizes[i];
      // }
      var imageSize = files[0].size / 1024 / 1024;
      if (
        files &&
        files.length > 0 &&
        files[0].type.toLowerCase().includes("image")
      ) {
        if (imageSize <= 50) {
          if (
            files[0].name.toLowerCase().includes(".png") ||
            files[0].name.toLowerCase().includes(".jpeg") ||
            files[0].name.toLowerCase().includes(".jpg") ||
            files[0].name.toLowerCase().includes(".gif") ||
            files[0].name.toLowerCase().includes(".svg")
          ) {
            const reader = new FileReader();
            reader.addEventListener(
              "load",
              () => {
                let newObj = _this.state.messageData;
                newObj[index].message = files[0];
                newObj[index].showImage = true;
                newObj[index].showVideo = false;
                newObj[index].setFile = reader.result;
                _this.setState({
                  messageData: newObj,
                });
              },
              false
            );
            reader.readAsDataURL(files[0]);
          } else {
            let newObj = _this.state.messageData;
            newObj[index].message = "";
            newObj[index].showVideo = false;
            newObj[index].showImage = false;
            newObj[index].imageStr = "";
            newObj[index].setFile = "";
            _this.setState({
              messageData: newObj,
            });
            warningAlert(`File type not supported`, _this.props.superThis);
          }
        } else {
          let newObj = _this.state.messageData;
          newObj[index].message = "";
          newObj[index].showVideo = false;
          newObj[index].showImage = false;
          newObj[index].imageStr = "";
          newObj[index].setFile = "";
          _this.setState({
            messageData: newObj,
          });
          warningAlert(
            `Please select a  image size less than or equal to 50Mb.`,
            _this.props.superThis
          );
        }
      } else if (files[0].type.toLowerCase().includes("video")) {
        var videoSize = files[0].size / 1024 / 1024;
        if (videoSize.toFixed(2) <= 50) {
          if (
            files[0].name.toLowerCase().includes(".mp4") ||
            files[0].name.toLowerCase().includes(".ogg") ||
            files[0].name.toLowerCase().includes(".mov") ||
            files[0].name.toLowerCase().includes(".mkv") ||
            files[0].name.toLowerCase().includes(".webm") ||
            files[0].name.toLowerCase().includes(".wmv")
          ) {
            const reader = new FileReader();
            reader.addEventListener(
              "load",
              () => {
                let newObj = _this.state.messageData;
                newObj[index].message = files[0];
                newObj[index].videoPreview = URL.createObjectURL(files[0]);
                newObj[index].showVideo = true;
                newObj[index].showImage = false;
                newObj[index].setFile = reader.result;
                _this.setState({
                  messageData: newObj,
                });
              },
              false
            );
            reader.readAsDataURL(files[0]);
          } else {
            let newObj = _this.state.messageData;
            newObj[index].message = "";
            newObj[index].showVideo = false;
            newObj[index].showImage = false;
            newObj[index].imageStr = "";
            newObj[index].videoPreview = "";
            newObj[index].setFile = "";
            _this.setState({
              messageData: newObj,
            });
            warningAlert(`File type not supported`, _this.props.superThis);
          }
        } else {
          let newObj = _this.state.messageData;
          newObj[index].message = "";
          newObj[index].showVideo = false;
          newObj[index].showImage = false;
          newObj[index].setFile = "";
          newObj[index].videoPreview = "";
          newObj[index].imageStr = "";
          _this.setState({
            messageData: newObj,
          });
          warningAlert(
            `Please select a  video size less than or equal to 50MB.`,
            _this.props.superThis
          );
        }
      } else {
        let newObj = _this.state.messageData;
        newObj[index].message = "";
        newObj[index].showVideo = false;
        newObj[index].showImage = false;
        newObj[index].videoPreview = "";
        newObj[index].setFile = "";
        _this.setState({
          messageData: newObj,
        });

        warningAlert(`File type not supported`, _this.props.superThis);
      }
    }
  };

  handleWelcomeFileChange = (files) => {
    let _this = this;
    // let FileLimit = 0,
    //   sizeType = "";
    if (files && files.length > 0) {
      // var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      if (files[0].size === 0) return "n/a";
      // var i = parseInt(Math.floor(Math.log(files[0].size) / Math.log(1024)));
      // if (i === 0) {
      //   FileLimit = files[0].size;
      //   sizeType = sizes[i];
      // } else {
      //   FileLimit = (files[0].size / Math.pow(1024, i)).toFixed(1);
      //   sizeType = sizes[i];
      // }
      var imageSize = files[0].size / 1024 / 1024;
      if (
        files &&
        files.length > 0 &&
        files[0].type.toLowerCase().includes("image")
      ) {
        if (imageSize <= 50) {
          if (
            files[0].name.toLowerCase().includes(".png") ||
            files[0].name.toLowerCase().includes(".jpeg") ||
            files[0].name.toLowerCase().includes(".jpg") ||
            files[0].name.toLowerCase().includes(".gif") ||
            files[0].name.toLowerCase().includes(".svg")
          ) {
            const reader = new FileReader();
            reader.addEventListener(
              "load",
              () => {
                let newObj = _this.state.widgetSetting;
                newObj["welcome_screen_profile_picture"] = files[0];
                _this.setState({
                  widgetSetting: newObj,
                  welcome_screen_profile_picture_preview: reader.result,
                });
              },
              false
            );
            reader.readAsDataURL(files[0]);
          } else {
            let newObj = _this.state.widgetSetting;
            newObj["welcome_screen_profile_picture"] = "";
            _this.setState({
              widgetSetting: newObj,
              welcome_screen_profile_picture_preview: "",
            });
            warningAlert(`File type not supported`, _this.props.superThis);
          }
        } else {
          let newObj = _this.state.widgetSetting;
          newObj["welcome_screen_profile_picture"] = "";
          _this.setState({
            widgetSetting: newObj,
            welcome_screen_profile_picture_preview: "",
          });
          warningAlert(
            `Please select a  image size less than or equal to 50Mb.`,
            _this.props.superThis
          );
        }
      } else {
        let newObj = _this.state.widgetSetting;
        newObj["welcome_screen_profile_picture"] = "";
        _this.setState({
          widgetSetting: newObj,
          welcome_screen_profile_picture_preview: "",
        });

        warningAlert(`File type not supported`, _this.props.superThis);
      }
    }
  };

  closeEditable = (e) => {
    let _this = this;
    const { name, value } = e.target;
    var newObj = _this.state.widgetSetting;
    newObj[name] = value;
    _this.setState({ editStatus: newObj });
  };

  handleKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.closeEditable(e);
    }
  };

  handleClosePreviewModel = () => {
    this.setState({
      previewModel: false,
    });
  };
  handleOpenPreviewModel = (img) => {
    this.setState({
      previewModel: true,
      previewImg: img,
    });
  };

  render() {
    let _this = this;
    const Input = styled("input")({
      display: "none",
    });
    const applyDrag = (arr, dragResult) => {
      const { removedIndex, addedIndex, payload } = dragResult;
      if (removedIndex === null && addedIndex === null) return arr;

      const result = [...arr];
      let itemToAdd = payload;

      if (removedIndex !== null) {
        itemToAdd = result.splice(removedIndex, 1)[0];
      }

      if (addedIndex !== null) {
        result.splice(addedIndex, 0, itemToAdd);
      }

      return result;
    };
    return (
      <Fragment>
        {this.state.loading && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            style={{ zIndex: "10000000000000000000000000000" }}
            open={true}
          >
            <div className="loader_main">
              <div className="item_loader">
                <Loader
                  type="box-rotate-x"
                  bgColor={"#32E0A1"}
                  title={
                    <div>
                      <div>"Please wait..."</div>
                      <p>{this.state.progress} %</p>
                    </div>
                  }
                  color={"#fff"}
                  size={100}
                />
              </div>
            </div>
          </Backdrop>
        )}
        <div className="right-block">
          <div className="header">
            <p className="heading">Widget settings</p>
            <p className="desc">
              Target your audience based on different criteria
            </p>
          </div>

          <div className="main-block widget-setting-block">
            <div className="basic-acc-block">
              <div className="show-on-block">
                <p className="title">Show on</p>
                <div className="tab-block">
                  <Button
                    type="button"
                    onClick={() => {
                      let temp = _this.state.widgetSetting;
                      temp.showondevice = "all";
                      _this.setState({
                        widgetSetting: temp,
                      });
                    }}
                    variant="text"
                    className={
                      _this.state.widgetSetting &&
                      _this.state.widgetSetting.showondevice === "all"
                        ? "active"
                        : ""
                    }
                  >
                    All devices
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      let temp = _this.state.widgetSetting;
                      temp.showondevice = "mobile";
                      _this.setState({
                        widgetSetting: temp,
                      });
                    }}
                    variant="text"
                    className={
                      _this.state.widgetSetting &&
                      _this.state.widgetSetting.showondevice === "mobile"
                        ? "active"
                        : ""
                    }
                  >
                    Mobile only
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      let temp = _this.state.widgetSetting;
                      temp.showondevice = "desktop";
                      _this.setState({
                        widgetSetting: temp,
                      });
                    }}
                    variant="text"
                    className={
                      _this.state.widgetSetting &&
                      _this.state.widgetSetting.showondevice === "desktop"
                        ? "active"
                        : ""
                    }
                  >
                    Desktop only
                  </Button>
                </div>
                <div className="text-small-block">
                  <FloatingLabel
                    controlId="floatingPassword"
                    label="Block IP address"
                  >
                    <Form.Control
                      type="text"
                      name="blockipaddress"
                      value={
                        _this.state.widgetSetting &&
                        _this.state.widgetSetting.blockipaddress
                      }
                      placeholder="Block IP address"
                      onChange={this.handleInputChange}
                    />
                    {/* <div className="errorMsg">
                      {_this.validator.message(
                        "Block IP address",
                        _this.state.widgetSetting &&
                        _this.state.widgetSetting.blockipaddress,
                        "required"
                      )}
                    </div> */}
                  </FloatingLabel>
                  <small>
                    Enter multiple IP addresses Separated by (,) comma
                  </small>
                </div>
                <div className="text-small-block">
                  <FloatingLabel
                    controlId="floatingPassword"
                    label="Hide Chat Interface on URL"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Hide Chat Interface on URL"
                      name="hideonpages"
                      value={
                        _this.state.widgetSetting &&
                        _this.state.widgetSetting.hideonpages
                      }
                      onChange={this.handleInputChange}
                    />
                  </FloatingLabel>
                  <small>Enter multiple URL’s separated by (,) comma</small>
                </div>
                <div className="text-small-block">
                  <FloatingLabel
                    controlId="floatingPassword"
                    label="Show Chat Interface on URL"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Show Chat Interface on URL"
                      name="showonpages"
                      value={
                        _this.state.widgetSetting &&
                        _this.state.widgetSetting.showonpages
                      }
                      onChange={this.handleInputChange}
                    />
                  </FloatingLabel>
                  <small>Enter multiple URL’s separated by (,) comma</small>
                </div>
              </div>
            </div>

            <div className="basic-acc-block">
              <div className="availability_box">
                <input
                  type="checkbox"
                  value={
                    _this.state.widgetSetting.welcomemessagecheckbox === 0
                      ? false
                      : true
                  }
                  checked={
                    _this.state.widgetSetting.welcomemessagecheckbox === 0
                      ? false
                      : true
                  }
                  onChange={(e) => {
                    var newObj = _this.state.widgetSetting;
                    newObj.welcomemessagecheckbox =
                      newObj.welcomemessagecheckbox === 0 ? 1 : 0;
                    _this.setState({
                      widgetSetting: newObj,
                    });
                  }}
                ></input>
                <div style={{ width: "100%" }}>
                  <p className="availability_title">Widget - Welcome message</p>
                  <p className="availability_text mb-4">
                    Configure proactive welcome messages
                  </p>
                  <div
                    className="basic-acc-block"
                    style={
                      _this.state.widgetSetting.welcomemessagecheckbox === 0
                        ? {
                            opacity: 0.5,
                            // pointerEvents: "none"
                          }
                        : {}
                    }
                  >
                    <div className="availability_box">
                      <input
                        type="checkbox"
                        value={
                          _this.state.widgetSetting.closeoptioncheckbox === 0
                            ? false
                            : true
                        }
                        checked={
                          _this.state.widgetSetting.closeoptioncheckbox === 0
                            ? false
                            : true
                        }
                        onChange={(e) => {
                          var newObj = _this.state.widgetSetting;
                          newObj.closeoptioncheckbox =
                            newObj.closeoptioncheckbox === 0 ? 1 : 0;
                          _this.setState({
                            widgetSetting: newObj,
                          });
                        }}
                      ></input>
                      <div style={{ width: "100%" }}>
                        <p className="availability_title">Close option</p>
                        <p className="availability_text">
                          Allow to close the welcome message shown above widget
                        </p>
                      </div>
                    </div>
                  </div>

                  <div
                    className="basic-acc-block message"
                    style={
                      _this.state.widgetSetting.welcomemessagecheckbox === 0
                        ? {
                            opacity: 0.5,
                            pointerEvents: "none",
                          }
                        : {}
                    }
                  >
                    <div className="show-on-block">
                      <p className="title">MESSAGES</p>
                    </div>
                    <Container
                      dragHandleSelector=".drag_handle"
                      animationDuration={500}
                      onDrop={(e) => {
                        const element = applyDrag(this.state.messageData, e);
                        console.log("element", element);
                        this.setState({
                          messageData: element,
                        });
                      }}
                    >
                      {_this.state.isShowEmojiModal ? (
                        <EmojiMartPickerComponent
                          isShowEmojiModal={_this.state.isShowEmojiModal}
                          messageData={_this.state.messageData}
                          isArrayFormat={true}
                          index={_this.state.activeMsgIndex}
                          {..._this.props}
                          _this={_this}
                        />
                      ) : null}
                      {_this.state.messageData &&
                        _this.state.messageData.length > 0 &&
                        _this.state.messageData.map((prop, index) => {
                          if (index <= 3 && prop.type === "textBox") {
                            return (
                              <Draggable key={index}>
                                <div className="hover-input-field-block">
                                  <div className="drag_handle">
                                    <img
                                      src={dot}
                                      className="dot noSelect"
                                      alt=""
                                    />
                                  </div>
                                  <FloatingLabel
                                    className="floating-input-delete-field-block-cust"
                                    controlId="floatingPassword"
                                    label={`message ${index + 1}`}
                                  >
                                    <Form.Control
                                      type="text"
                                      placeholder={`text${index}`}
                                      value={prop.message}
                                      onChange={(e) => {
                                        let newObj = _this.state.messageData;
                                        newObj[index].message = e.target.value;
                                        _this.setState({
                                          messageData: newObj,
                                          isShowEmojiModal: false,
                                        });
                                      }}
                                    />
                                    <div className="icon-block">
                                      <IconButton
                                        type="button"
                                        onClick={() => {
                                          _this.state.messageData.map(
                                            (prop1, key) => {
                                              if (key === index) {
                                                prop1.active = true;
                                              } else {
                                                prop1.active = false;
                                              }
                                              return prop1;
                                            }
                                          );
                                          _this.setState({
                                            isShowEmojiModal: true,
                                            activeMsgIndex: index,
                                          });
                                        }}
                                      >
                                        <img src={smile} alt="" />
                                      </IconButton>
                                      <hr></hr>

                                      <IconButton
                                        type="button"
                                        onClick={() => {
                                          let newObj = _this.state.messageData;
                                          newObj.splice(index, 1);
                                          _this.setState({
                                            messageData: newObj,
                                          });
                                        }}
                                      >
                                        <img src={deleteIcon} alt="" />
                                      </IconButton>
                                    </div>
                                  </FloatingLabel>
                                </div>
                              </Draggable>
                            );
                          } else if (index <= 3 && prop.type === "imgVideo") {
                            return (
                              <Draggable key={index}>
                                <div className="hover-input-field-block">
                                  <div className="drag_handle">
                                    <img
                                      src={dot}
                                      className="dot noSelect"
                                      alt=""
                                    />
                                  </div>
                                  <div>
                                    <div className="upload-image-block">
                                      <label htmlFor="UPLOAD IMAGE">
                                        UPLOAD IMAGE/VIDEO
                                      </label>
                                      <div className="preview-upload">
                                        <div
                                          style={
                                            prop.message === ""
                                              ? { backgroundColor: "#12e3ce" }
                                              : { backgroundColor: "#ffff" }
                                          }
                                          className="preview"
                                        >
                                          {prop.showImage &&
                                          prop.message !== "" ? (
                                            <img
                                              src={prop.setFile}
                                              className="show-preview"
                                              alt=""
                                            />
                                          ) : prop.showVideo &&
                                            prop.message !== "" ? (
                                            <ReactPlayer
                                              className="show-preview"
                                              playing={false}
                                              controls={true}
                                              width="100"
                                              height="100"
                                              url={
                                                typeof prop.message === "string"
                                                  ? prop.message
                                                  : prop.videoPreview
                                              }
                                              onContextMenu={(e) =>
                                                e.preventDefault()
                                              }
                                            />
                                          ) : (
                                            <img src={image} alt="" />
                                          )}
                                        </div>
                                        <div className="upload">
                                          <label
                                            htmlFor={`contained-button-file${index}`}
                                          >
                                            <Input
                                              id={`contained-button-file${index}`}
                                              // multiple
                                              type="file"
                                              onChange={(e) => {
                                                _this.handleFileChange(
                                                  e.target.files,
                                                  index
                                                );
                                              }}
                                            />
                                            <Button
                                              variant="contained"
                                              component="span"
                                            >
                                              Choose file
                                            </Button>
                                          </label>
                                        </div>
                                        <div className="icon-block">
                                          <IconButton
                                            type="button"
                                            onClick={() => {
                                              let newObj =
                                                _this.state.messageData;
                                              newObj.splice(index, 1);
                                              _this.setState({
                                                messageData: newObj,
                                              });
                                            }}
                                          >
                                            <img src={deleteIcon} alt="" />
                                          </IconButton>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* <div className="img-video-block">
                                {prop.showVideo || prop.showImage ? (
                                  prop.showImage ? (
                                    <CropImageComponent
                                      childThis={_this}
                                      imageProp={prop.setFile}
                                      index={index}
                                      {..._this.props}
                                    />
                                  ) : (
                                    <img
                                      className="preview_widget_img"
                                      src={
                                        prop.cropperImg !== null
                                          ? prop.cropperImg
                                          : videoIcon
                                      }
                                    />
                                  )
                                ) : null}
                              </div>

                              {prop.showVideo ? <p>{prop.message.name}</p> : ""} */}
                              </Draggable>
                            );
                          } else if (index <= 3 && prop.type === "GIF") {
                            return (
                              <Draggable key={index}>
                                <div className="hover-input-field-block">
                                  <div className="drag_handle">
                                    <img
                                      src={dot}
                                      className="dot noSelect"
                                      alt=""
                                    />
                                  </div>
                                  <div className="upload-image-block">
                                    <label htmlFor="UPLOAD IMAGE">
                                      UPLOAD GIF
                                    </label>
                                    <div className="preview-upload">
                                      <div className="preview">
                                        <img
                                          className={
                                            prop.message !== ""
                                              ? "show-preview"
                                              : null
                                          }
                                          src={
                                            prop.message !== ""
                                              ? prop.message
                                              : image
                                          }
                                          alt=""
                                        />
                                      </div>
                                      <div className="upload">
                                        <label htmlFor="contained-button-file">
                                          <Button
                                            variant="contained"
                                            component="span"
                                            onClick={() => {
                                              _this.state.messageData.map(
                                                (prop1, key) => {
                                                  if (key === index) {
                                                    prop1.active = true;
                                                  } else {
                                                    prop1.active = false;
                                                  }
                                                  return prop1;
                                                }
                                              );
                                              _this.setState({
                                                isShowGifImgModal: true,
                                              });
                                            }}
                                          >
                                            Choose file
                                          </Button>
                                        </label>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="icon-block">
                                    <IconButton
                                      type="button"
                                      onClick={() => {
                                        let newObj = _this.state.messageData;
                                        newObj.splice(index, 1);
                                        _this.setState({
                                          messageData: newObj,
                                        });
                                      }}
                                    >
                                      <img src={deleteIcon} alt="" />
                                    </IconButton>
                                  </div>
                                </div>
                                {_this.state.isShowGifImgModal ? (
                                  <GifImagesPageComponent
                                    isShowGifImgModal={
                                      _this.state.isShowGifImgModal
                                    }
                                    _this={_this}
                                    closePopUp={() => {
                                      _this.setState({
                                        isShowGifImgModal: false,
                                      });
                                    }}
                                    messageData={_this.state.messageData}
                                    isArrayFormat={true}
                                    {..._this.props}
                                  />
                                ) : null}
                              </Draggable>
                            );
                          } else return null;
                        })}
                    </Container>
                    <div className="btn-message-text">
                      <div className="btn-text">
                        <Button
                          type="button"
                          onClick={() => {
                            let obj = _this.state.messageData;
                            if (obj && obj.length <= 3) {
                              obj.push({
                                key: obj.length,
                                type: "textBox",
                                message: "",
                                name: "",
                                setFile: "",
                                imageStr: "",
                                active: false,
                                showImage: false,
                                showVideo: false,
                                GIFImg: false,
                              });
                              _this.setState({
                                messageData: obj,
                              });
                            } else {
                              warningAlert(
                                `Maximum 4 Welcome Messages are allowed`,
                                _this.props.superThis
                              );
                              // warningAlert("")
                            }
                          }}
                          variant="text"
                        >
                          <img src={plus} alt="" />
                          Text message
                        </Button>

                        {/* <label htmlFor="contained-button-file">
                          <Input
                            id="contained-button-file"
                            multiple={false}
                            type="file"
                            className="image_video_upload"
                            onChange={(e) =>
                              _this.handleFileChange(
                                e.target.files,
                                0
                              )
                            }
                            accept="image/png,image/svg+xml,image/jpeg,image/jpg,video/mp4,video/mov,video/wmv,video/flv,video/mkv,video/avi,video/webm"
                          />
                          <Button
                            variant="text"
                            component="span"
                          >
                            <img src={plus} alt="" />
                            Image / Video
                          </Button>

                        </label> */}

                        <Button
                          type="button"
                          onClick={() => {
                            let obj = _this.state.messageData;
                            if (obj && obj.length <= 3) {
                              obj.push({
                                key: obj.length,
                                type: "imgVideo",
                                message: "",
                                name: "",
                                setFile: "",
                                videoPreview: "",
                                cropperImg: null,
                                active: false,
                                showImage: false,
                                showVideo: false,
                                GIFImg: false,
                              });
                              _this.setState({
                                messageData: obj,
                              });
                            } else {
                              warningAlert(
                                `Maximum 4 Welcome Messages are allowed`,
                                _this.props.superThis
                              );
                            }
                          }}
                          variant="text"
                        >
                          <img src={plus} alt="" />
                          Image / Video
                        </Button>

                        <Button
                          type="button"
                          onClick={() => {
                            let obj = _this.state.messageData;
                            if (obj && obj.length <= 3) {
                              obj.push({
                                key: obj.length,
                                type: "GIF",
                                message: "",
                                name: "",
                                setFile: "",
                                imageStr: "",
                                active: false,
                                showImage: false,
                                showVideo: false,
                                GIFImg: false,
                              });
                              _this.setState({
                                messageData: obj,
                              });
                            } else {
                              warningAlert(
                                `Maximum 4 Welcome Messages are allowed`,
                                _this.props.superThis
                              );
                            }
                          }}
                          variant="text"
                        >
                          <img src={plus} alt="" />
                          Add GIF
                        </Button>
                      </div>
                      <span className="text">
                        {_this.state.messageData &&
                          _this.state.messageData.length}
                        /4 messages
                      </span>
                      <hr />
                      <p className="desc">
                        Firstly created message will be shown on the top, that
                        is from top to bottom will be the arrangement
                        <ul>
                          <li>Max Size allowed: 50 Mb</li>
                          <li>
                            File formats allowed: mp4 / mov / webm / wmv / ogg
                          </li>
                          <li>
                            Supported Images: png / jpeg / jpg / svg / gif
                          </li>
                        </ul>
                      </p>
                    </div>
                  </div>
                  <div
                    className="basic-acc-block block"
                    style={
                      _this.state.widgetSetting.welcomemessagecheckbox === 0
                        ? {
                            opacity: 0.5,
                            pointerEvents: "none",
                          }
                        : {}
                    }
                  >
                    <div className="availability_box">
                      <div style={{ width: "100%" }}>
                        <p className="availability_title">
                          Launch criteria for welcome message
                        </p>
                        <p className="availability_text">
                          When to show the welcome message on screen
                        </p>
                        <div className="time-seconde-time-input">
                          <label htmlFor="Delay time">Scroll Percentage</label>
                          <div className="ms percent">
                            <input
                              type="number"
                              name="afterscrollpercent"
                              id="seconds"
                              value={
                                _this.state.widgetSetting
                                  .launchcriteriawelcomemessagepercent
                              }
                              onChange={(e) => {
                                let newObj = _this.state.widgetSetting;
                                if (
                                  parseInt(e.target.value) <= 100 &&
                                  parseInt(e.target.value) >= 0
                                ) {
                                  newObj.launchcriteriawelcomemessagepercent =
                                    parseInt(e.target.value);
                                  _this.setState({
                                    widgetSetting: newObj,
                                  });
                                } else {
                                  newObj.launchcriteriawelcomemessagepercent = 0;
                                  _this.setState({
                                    widgetSetting: newObj,
                                  });
                                }
                              }}
                            />
                            <div className="arrow-block">
                              <KeyboardArrowDownIcon
                                className="icon up"
                                disabled={
                                  _this.state.widgetSetting
                                    .launchcriteriawelcomemessagepercent === 100
                                }
                                onClick={() => {
                                  let newObj = _this.state.widgetSetting;
                                  if (
                                    parseInt(
                                      newObj.launchcriteriawelcomemessagepercent
                                    ) < 100
                                  ) {
                                    newObj.launchcriteriawelcomemessagepercent =
                                      parseInt(
                                        newObj.launchcriteriawelcomemessagepercent
                                      ) + 1;
                                    _this.setState({
                                      widgetSetting: newObj,
                                    });
                                  }
                                }}
                              />
                              <KeyboardArrowDownIcon
                                className="icon"
                                disabled={
                                  _this.state.widgetSetting
                                    .launchcriteriawelcomemessagepercent === 0
                                }
                                onClick={() => {
                                  let newObj = _this.state.widgetSetting;
                                  if (
                                    parseInt(
                                      newObj.launchcriteriawelcomemessagepercent
                                    ) > 0
                                  ) {
                                    newObj.launchcriteriawelcomemessagepercent =
                                      parseInt(
                                        newObj.launchcriteriawelcomemessagepercent
                                      ) - 1;
                                    _this.setState({
                                      widgetSetting: newObj,
                                    });
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="basic-acc-block block">
                    <p className="sync_title">Page URL</p>
                    <p className="sync_text">
                      When to show the welcome message on screen
                    </p>
                    {_this.state.addURLData &&
                      _this.state.addURLData.length > 0 &&
                      _this.state.addURLData.map((prop, key) => {
                        return (
                          <Fragment>
                            <div className="hyper-link-block trackers_input">
                              <img src={hyper_link} alt="" />
                              <input
                                type="text"
                                placeholder="example: www.google.com"
                                value={prop.URL}
                                onChange={(e) => {
                                  let newObj = _this.state.addURLData;
                                  newObj[key].URL = e.target.value;
                                  _this.setState({
                                    addURLData: newObj,
                                  });
                                }}
                              />
                            </div>
                            <div className="icon-block">
                              <IconButton
                                type="button"
                                onClick={() => {
                                  let newObj = _this.state.addURLData;
                                  newObj.splice(key, 1);
                                  _this.setState({ addURLData: newObj });
                                }}
                              >
                                <img src={deleteIcon} alt="" />
                              </IconButton>
                            </div>
                          </Fragment>
                        );
                      })}

                    <div className="btn-block">
                      <Button
                        type="button"
                        onClick={() => {
                          let newObj = _this.state.addURLData;
                          newObj.push({
                            URL: "https://",
                            key: newObj.length,
                          });
                          _this.setState({
                            addURLData: newObj,
                          });
                        }}
                        variant="text"
                      >
                        <img src={plus} alt="" />
                        Add URL
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="widget-welcome-screen-block">
                <div className="availability_box">
                  <input
                    value={
                      _this.state.widgetSetting.welcomescreencheckbox === 0
                        ? false
                        : true
                    }
                    checked={
                      _this.state.widgetSetting.welcomescreencheckbox === 0
                        ? false
                        : true
                    }
                    onChange={(e) => {
                      var newObj = _this.state.widgetSetting;
                      newObj.welcomescreencheckbox =
                        newObj.welcomescreencheckbox === 0 ? 1 : 0;
                      _this.setState({
                        widgetSetting: newObj,
                      });
                    }}
                    type="checkbox"
                  ></input>
                  <div style={{ width: "100%" }}>
                    <p className="availability_title">Welcome screen</p>
                    <p className="availability_text mb-4">
                      Show welcome screen on clicking chat bubble. Configure
                      layout content (Logo, text) from widget design page in
                      step 3 of builder.
                    </p>
                    <div
                      className="basic-acc-block layout-block"
                      style={
                        _this.state.widgetSetting.welcomescreencheckbox === 0
                          ? {
                              opacity: 0.5,
                              pointerEvents: "none",
                            }
                          : {}
                      }
                    >
                      <p className="title-small">CHOOSE LAYOUTS</p>
                      <div className="layout-images-block active">
                        <div
                          type="button"
                          onClick={() => {
                            var newObj = _this.state.widgetSetting;
                            newObj.welcomescreenlayout = "layout_1";
                            _this.setState({
                              widgetSetting: newObj,
                            });
                          }}
                        >
                          <img
                            style={
                              _this.state.widgetSetting.welcomescreenlayout ===
                              "layout_1"
                                ? { border: "1px solid " }
                                : {}
                            }
                            src={img1}
                            alt=""
                          />
                          <div
                            className="preview text-center"
                            onClick={() => {
                              this.handleOpenPreviewModel("img1");
                            }}
                          >
                            <img src={eye} alt="" />
                            Preview
                          </div>
                        </div>
                        <div
                          type="button"
                          onClick={() => {
                            var newObj = _this.state.widgetSetting;
                            newObj.welcomescreenlayout = "layout_2";
                            _this.setState({
                              widgetSetting: newObj,
                            });
                          }}
                          className=""
                        >
                          <img
                            style={
                              _this.state.widgetSetting.welcomescreenlayout ===
                              "layout_2"
                                ? { border: "1px solid " }
                                : {}
                            }
                            src={img2}
                            alt=""
                          />
                          <div
                            className="preview text-center"
                            onClick={() => {
                              this.handleOpenPreviewModel("img2");
                            }}
                          >
                            <img src={eye} alt="" />
                            Preview
                          </div>
                        </div>
                        <div
                          type="button"
                          onClick={() => {
                            var newObj = _this.state.widgetSetting;
                            newObj.welcomescreenlayout = "layout_3";
                            _this.setState({
                              widgetSetting: newObj,
                            });
                          }}
                          className=""
                        >
                          <img
                            style={
                              _this.state.widgetSetting.welcomescreenlayout ===
                              "layout_3"
                                ? { border: "1px solid " }
                                : {}
                            }
                            src={img3}
                            alt=""
                          />
                          <div
                            className="preview text-center"
                            onClick={() => {
                              this.handleOpenPreviewModel("img3");
                            }}
                          >
                            <img src={eye} alt="" />
                            Preview
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="basic-acc-block message"
                      style={
                        _this.state.widgetSetting.welcomescreencheckbox === 0
                          ? {
                              opacity: 0.5,
                              pointerEvents: "none",
                            }
                          : {}
                      }
                    >
                      <div
                        className="hover-input-field-block"
                        style={{ marginLeft: "15px" }}
                      >
                        <div className="upload-image-block">
                          <label htmlFor="UPLOAD IMAGE">
                            Upload Welcome Screen Image
                          </label>
                          <div className="preview-upload">
                            <div
                              // style={
                              //   prop.message === ""
                              //     ? { backgroundColor: "#12e3ce" }
                              //     : { backgroundColor: "#ffff" }
                              // }
                              className="preview"
                            >
                              {_this.state
                                .welcome_screen_profile_picture_preview ? (
                                <img
                                  src={
                                    _this.state
                                      .welcome_screen_profile_picture_preview
                                  }
                                  className="show-preview"
                                  alt=""
                                />
                              ) : typeof _this.state.widgetSetting
                                  .welcome_screen_profile_picture ===
                                "string" ? (
                                <img
                                  src={
                                    _this.state.widgetSetting
                                      .welcome_screen_profile_picture
                                  }
                                  className="show-preview"
                                  alt=""
                                />
                              ) : (
                                <img src={image} alt="" />
                              )}
                            </div>
                            <div className="upload">
                              <label htmlFor={`contained-welcomescreen-img`}>
                                <Input
                                  id={`contained-welcomescreen-img`}
                                  accept=".jpg,.png, jpeg, .gif"
                                  // multiple
                                  type="file"
                                  onChange={(e) => {
                                    this.handleWelcomeFileChange(
                                      e.target.files
                                    );
                                  }}
                                />
                                <Button variant="contained" component="span">
                                  Choose file
                                </Button>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="opacity-radius-block"
                        style={{ marginLeft: "15px" }}
                      >
                        <p className="title">Scale</p>
                        <div className="bar-block rating_range_unique">
                          <Slider
                            min={1}
                            max={100}
                            value={
                              this.state.widgetSetting
                                .welcome_screen_profile_pic_scale
                            }
                            onChange={(e) => {
                              let _this = this;
                              let temp = _this.state.widgetSetting;
                              temp.welcome_screen_profile_pic_scale =
                                e.target.value;
                              _this.setState({
                                widgetSetting: temp,
                              });
                            }}
                            valueLabelDisplay="auto"
                            // valueLabelFormat={this.valueTempLabelFormat}
                          />
                        </div>
                      </div>
                    </div>

                    <div
                      className="basic-acc-block widget_setting_active"
                      style={
                        _this.state.widgetSetting.welcomescreencheckbox === 0
                          ? {
                              opacity: 0.5,
                              pointerEvents: "none",
                            }
                          : {}
                      }
                    >
                      <EditWidgetLabel
                        value={_this.state.widgetSetting}
                        label={
                          _this.state.widgetSetting.startanewconversationvalue
                        }
                        checkboxName={false}
                        placeholder="Start A Conversation"
                        inputName="startanewconversationvalue"
                        onChange={this.handleInputChange}
                        onChangeCheckbox={this.handleInputChangeCheckbox}
                        inputProps={{
                          maxLength: 40,
                        }}
                      />
                    </div>
                    <div
                      className="basic-acc-block widget_setting_active"
                      style={
                        _this.state.errorHighlight
                          ? {
                              border: "1px solid #ffb2b0",
                              boxShadow: "0px 0px 5px #ffb2b0",
                            }
                          : {
                              border: "1px solid #c6cad9",
                              boxShadow: "unset",
                            }
                      }
                    >
                      <EditWidgetLabel
                        value={_this.state.widgetSetting}
                        label={_this.state.widgetSetting.showactiveagentvalue}
                        placeholder="Show Active Agents"
                        checkboxName="showactiveagentcheckbox"
                        inputName="showactiveagentvalue"
                        onChange={this.handleInputChange}
                        onChangeCheckbox={this.handleInputChangeCheckbox}
                      />

                      <div
                        style={
                          _this.state.widgetSetting.showactiveagentcheckbox ===
                          0
                            ? {
                                opacity: 0.5,
                                pointerEvents: "none",
                              }
                            : {}
                        }
                      >
                        <EditWidgetLabel
                          value={_this.state.widgetSetting}
                          label={
                            _this.state.widgetSetting
                              .show_active_agent_subtitle_online
                          }
                          checkboxName={false}
                          placeholder="online"
                          inputName="show_active_agent_subtitle_online"
                          onChange={this.handleInputChange}
                          onChangeCheckbox={this.handleInputChangeCheckbox}
                        />
                        <EditWidgetLabel
                          value={_this.state.widgetSetting}
                          label={
                            _this.state.widgetSetting
                              .show_active_agent_subtitle_offline
                          }
                          checkboxName={false}
                          placeholder="offline"
                          inputName="show_active_agent_subtitle_offline"
                          onChange={this.handleInputChange}
                          onChangeCheckbox={this.handleInputChangeCheckbox}
                        />
                      </div>
                    </div>
                    <div
                      className="basic-acc-block  widget_setting_active"
                      style={{ opacity: 0.5, pointerEvents: "none" }}
                    >
                      <EditWidgetLabel
                        value={_this.state.widgetSetting}
                        label={
                          _this.state.widgetSetting.showcontinueconvalue +
                          " (Coming Soon)"
                        }
                        placeholder="Show Continue Conversation"
                        checkboxName="showcontinueconvcheckbox"
                        inputName="showcontinueconvalue"
                        onChange={this.handleInputChange}
                        onChangeCheckbox={this.handleInputChangeCheckbox}
                      />
                    </div>

                    <div
                      className="basic-acc-block  widget_setting_active"
                      style={
                        _this.state.errorHighlight
                          ? {
                              border: "1px solid #ffb2b0",
                              boxShadow: "0px 0px 5px #ffb2b0",
                            }
                          : {
                              border: "1px solid #c6cad9",
                              boxShadow: "unset",
                            }
                      }
                    >
                      <EditWidgetLabel
                        value={_this.state.widgetSetting}
                        label={_this.state.widgetSetting.showsearchbarvalue}
                        placeholder="Show Search For Help"
                        checkboxName="showsearchbarcheckbox"
                        inputName="showsearchbarvalue"
                        onChange={this.handleInputChange}
                        onChangeCheckbox={this.handleInputChangeCheckbox}
                      />
                    </div>
                    <div
                      className="basic-acc-block"
                      style={
                        _this.state.errorHighlight
                          ? {
                              border: "1px solid #ffb2b0",
                              boxShadow: "0px 0px 5px #ffb2b0",
                            }
                          : {
                              border: "1px solid #c6cad9",
                              boxShadow: "unset",
                            }
                      }
                    >
                      <div className="availability_box">
                        <input
                          value={
                            _this.state.widgetSetting
                              .showconvstartercardcheckbox === 0
                              ? false
                              : true
                          }
                          checked={
                            _this.state.widgetSetting
                              .showconvstartercardcheckbox === 0
                              ? false
                              : true
                          }
                          onChange={(e) => {
                            var newObj = _this.state.widgetSetting;
                            newObj.showconvstartercardcheckbox =
                              newObj.showconvstartercardcheckbox === 0 ? 1 : 0;
                            _this.setState({
                              widgetSetting: newObj,
                            });
                          }}
                          type="checkbox"
                        ></input>
                        <div style={{ width: "100%" }}>
                          <p className="availability_title">
                            Show Conversation Starter Cards
                          </p>
                        </div>
                      </div>
                      <div
                        className="starter_card_block"
                        style={
                          _this.state.widgetSetting.welcomescreencheckbox ===
                            0 ||
                          _this.state.widgetSetting
                            .showconvstartercardcheckbox === 0
                            ? {
                                opacity: 0.5,
                                pointerEvents: "none",
                              }
                            : {}
                        }
                      >
                        <div className="basic-acc-block starter_inner_block  widget_setting_active">
                          <EditWidgetLabel
                            value={_this.state.widgetSetting}
                            label={_this.state.widgetSetting.chatnowvalue}
                            checkboxName="chatnowcheckbox"
                            inputName="chatnowvalue"
                            placeholder="Chat Now"
                            onChange={this.handleInputChange}
                            onChangeCheckbox={this.handleInputChangeCheckbox}
                          />
                          <div
                            style={
                              _this.state.widgetSetting.chatnowcheckbox === 0
                                ? {
                                    opacity: 0.5,
                                    pointerEvents: "none",
                                  }
                                : {}
                            }
                          >
                            <EditWidgetLabel
                              value={_this.state.widgetSetting}
                              label={
                                _this.state.widgetSetting.chat_now_subtitle
                              }
                              checkboxName={false}
                              placeholder="Chat Now Subtitle"
                              inputName="chat_now_subtitle"
                              onChange={this.handleInputChange}
                              onChangeCheckbox={this.handleInputChangeCheckbox}
                            />

                            <WidgetColorPicker
                              name="chat_now_icon_color"
                              color={
                                _this.state.widgetSetting.chat_now_icon_color
                              }
                              onChange={this.handleColorChange}
                            />
                          </div>
                        </div>
                        <div className="basic-acc-block starter_inner_block widget_setting_active whatsapp_setting">
                          <div className="whatsapp_setting_inner">
                            <EditWidgetLabel
                              value={_this.state.widgetSetting}
                              label={_this.state.widgetSetting.whatsappvalue}
                              placeholder="Whatsapp"
                              checkboxName="whatsappcheckbox"
                              inputName="whatsappvalue"
                              onChange={this.handleInputChange}
                              onChangeCheckbox={this.handleInputChangeCheckbox}
                            />
                            <div
                              style={
                                _this.state.widgetSetting.whatsappcheckbox === 0
                                  ? {
                                      opacity: 0.5,
                                      pointerEvents: "none",
                                    }
                                  : {}
                              }
                            >
                              <EditWidgetLabel
                                value={_this.state.widgetSetting}
                                label={
                                  _this.state.widgetSetting.whatsapp_subtitle
                                }
                                inputName="whatsapp_subtitle"
                                checkboxName={false}
                                placeholder="Whatsapp Subtitle"
                                onChange={this.handleInputChange}
                                onChangeCheckbox={
                                  this.handleInputChangeCheckbox
                                }
                              />
                              <WidgetColorPicker
                                name="whatsapp_icon_color"
                                color={
                                  _this.state.widgetSetting.whatsapp_icon_color
                                }
                                onChange={this.handleColorChange}
                              />

                              {/* <div className="availability_box">
                              <input
                                value={
                                  _this.state.widgetSetting.whatsappcheckbox ===
                                  0
                                    ? false
                                    : true
                                }
                                checked={
                                  _this.state.widgetSetting.whatsappcheckbox ===
                                  0
                                    ? false
                                    : true
                                }
                                onChange={(e) => {
                                  var newObj = _this.state.widgetSetting;
                                  newObj.whatsappcheckbox =
                                    newObj.whatsappcheckbox === 0 ? 1 : 0;
                                  _this.setState({
                                    widgetSetting: newObj,
                                  });
                                }}
                                type="checkbox"
                              ></input>
                              <div style={{ width: "100%" }}>
                                <p className="availability_title">Whatsapp</p>
                              </div>
                            </div>
                            <IconButton>
                              <img src={edit2} alt=""/>
                            </IconButton> */}
                            </div>
                            <div
                              className="basic-acc-block block"
                              style={
                                _this.state.widgetSetting.whatsappcheckbox === 0
                                  ? {
                                      opacity: 0.5,
                                      pointerEvents: "none",
                                    }
                                  : {}
                              }
                            >
                              <p className="sync_title">Page URL</p>

                              <Fragment>
                                <div className="hyper-link-block trackers_input">
                                  <img src={hyper_link} alt="" />
                                  <input
                                    type="text"
                                    name="whatsapphyperlink"
                                    value={
                                      _this.state.widgetSetting
                                        .whatsapphyperlink
                                    }
                                    onChange={this.handleInputChange}
                                    placeholder="example: https://www.google.com"
                                  />
                                </div>
                              </Fragment>
                            </div>
                          </div>
                        </div>
                        <div className="basic-acc-block starter_inner_block widget_setting_active">
                          <EditWidgetLabel
                            value={_this.state.widgetSetting}
                            label={_this.state.widgetSetting.emailvalue}
                            checkboxName="emailcheckbox"
                            placeholder="Email"
                            inputName="emailvalue"
                            onChange={this.handleInputChange}
                            onChangeCheckbox={this.handleInputChangeCheckbox}
                          />

                          <div
                            style={
                              _this.state.widgetSetting.emailcheckbox === 0
                                ? {
                                    opacity: 0.5,
                                    pointerEvents: "none",
                                  }
                                : {}
                            }
                          >
                            <EditWidgetLabel
                              value={_this.state.widgetSetting}
                              label={_this.state.widgetSetting.email_subtitle}
                              checkboxName={false}
                              placeholder="Email subtitle"
                              inputName="email_subtitle"
                              onChange={this.handleInputChange}
                              onChangeCheckbox={this.handleInputChangeCheckbox}
                            />

                            <WidgetColorPicker
                              name="email_icon_color"
                              color={_this.state.widgetSetting.email_icon_color}
                              onChange={this.handleColorChange}
                            />
                          </div>
                          <div
                            className="basic-acc-block block"
                            style={
                              _this.state.widgetSetting.emailcheckbox === 0
                                ? {
                                    opacity: 0.5,
                                    pointerEvents: "none",
                                  }
                                : {}
                            }
                          >
                            <p className="sync_title">Page URL</p>

                            <Fragment>
                              <div className="hyper-link-block trackers_input">
                                <img src={hyper_link} alt="" />
                                <input
                                  type="text"
                                  name="emailhyperlink"
                                  value={
                                    _this.state.widgetSetting.emailhyperlink
                                  }
                                  onChange={this.handleInputChange}
                                  placeholder="example: https://www.google.com"
                                />
                              </div>
                            </Fragment>
                          </div>
                        </div>

                        <div className="basic-acc-block starter_inner_block widget_setting_active">
                          <EditWidgetLabel
                            value={_this.state.widgetSetting}
                            label={
                              _this.state.widgetSetting.knowledge_base_value
                            }
                            checkboxName="knowledge_base_checkbox"
                            placeholder="Knowledge Base"
                            inputName="knowledge_base_value"
                            onChange={this.handleInputChange}
                            onChangeCheckbox={this.handleInputChangeCheckbox}
                          />

                          <div
                            style={
                              _this.state.widgetSetting
                                .knowledge_base_checkbox === 0
                                ? {
                                    opacity: 0.5,
                                    pointerEvents: "none",
                                  }
                                : {}
                            }
                          >
                            <EditWidgetLabel
                              value={_this.state.widgetSetting}
                              label={
                                _this.state.widgetSetting
                                  .knowledge_base_subtitle
                              }
                              checkboxName={false}
                              placeholder="Knowledge Base subtitle"
                              inputName="knowledge_base_subtitle"
                              onChange={this.handleInputChange}
                              onChangeCheckbox={this.handleInputChangeCheckbox}
                            />

                            <WidgetColorPicker
                              name="knowledge_base_icon_color"
                              color={
                                _this.state.widgetSetting
                                  .knowledge_base_icon_color
                              }
                              onChange={this.handleColorChange}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="basic-acc-block">
              <div className="availability_box">
                <input
                  value={
                    _this.state.widgetSetting.widgetlaunchcriteriacheckbox === 0
                      ? false
                      : true
                  }
                  checked={
                    _this.state.widgetSetting.widgetlaunchcriteriacheckbox === 0
                      ? false
                      : true
                  }
                  onChange={(e) => {
                    var newObj = _this.state.widgetSetting;
                    newObj.widgetlaunchcriteriacheckbox =
                      newObj.widgetlaunchcriteriacheckbox === 0 ? 1 : 0;
                    _this.setState({
                      widgetSetting: newObj,
                    });
                  }}
                  type="checkbox"
                ></input>
                <div style={{ width: "100%" }}>
                  <p className="availability_title">
                    Widget - Desktop Launch Criteria
                  </p>
                  <p className="availability_text">
                    Set criteria for launching the widget in Desktop Application
                  </p>
                  <div
                    className="time-seconde-box"
                    style={
                      _this.state.widgetSetting.widgetlaunchcriteriacheckbox ===
                      0
                        ? {
                            opacity: 0.5,
                            pointerEvents: "none",
                          }
                        : {}
                    }
                  >
                    <div className="time-seconde-time-input">
                      <label htmlFor="Delay time">Show After</label>
                      <div className="ms">
                        <input
                          type="number"
                          name="sec"
                          id="seconds"
                          value={_this.state.widgetSetting.showaftersec}
                          onChange={(e) => {
                            let newObj = _this.state.widgetSetting;
                            if (parseInt(e.target.value) >= 0) {
                              newObj.showaftersec = parseInt(e.target.value);
                              _this.setState({
                                widgetSetting: newObj,
                              });
                            } else {
                              newObj.showaftersec = 0;
                              _this.setState({
                                widgetSetting: newObj,
                              });
                            }
                          }}
                        />
                        <div className="arrow-block">
                          <KeyboardArrowDownIcon
                            className="icon up"
                            onClick={() => {
                              let newObj = _this.state.widgetSetting;
                              if (parseInt(newObj.showaftersec) >= 0) {
                                newObj.showaftersec =
                                  parseInt(newObj.showaftersec) + 1;
                                _this.setState({
                                  widgetSetting: newObj,
                                });
                              }
                            }}
                          />
                          <KeyboardArrowDownIcon
                            className="icon"
                            disabled={
                              _this.state.widgetSetting.showaftersec === 0
                            }
                            onClick={() => {
                              let newObj = _this.state.widgetSetting;
                              if (parseInt(newObj.showaftersec) > 0) {
                                newObj.showaftersec =
                                  parseInt(newObj.showaftersec) - 1;
                                _this.setState({
                                  widgetSetting: newObj,
                                });
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="time-seconde-time-input">
                      <label htmlFor="Delay time">Open After</label>
                      <div className="ms">
                        <input
                          type="number"
                          name="sec"
                          id="seconds"
                          value={_this.state.widgetSetting.openaftersec}
                          onChange={(e) => {
                            let newObj = _this.state.widgetSetting;
                            if (parseInt(e.target.value) >= 0) {
                              newObj.openaftersec = parseInt(e.target.value);
                              _this.setState({
                                widgetSetting: newObj,
                              });
                            } else {
                              newObj.openaftersec = 0;
                              _this.setState({
                                widgetSetting: newObj,
                              });
                            }
                          }}
                        />
                        <div className="arrow-block">
                          <KeyboardArrowDownIcon
                            className="icon up"
                            onClick={() => {
                              let newObj = _this.state.widgetSetting;
                              if (parseInt(newObj.openaftersec) >= 0) {
                                newObj.openaftersec =
                                  parseInt(newObj.openaftersec) + 1;
                                _this.setState({
                                  widgetSetting: newObj,
                                });
                              }
                            }}
                          />
                          <KeyboardArrowDownIcon
                            className="icon"
                            disabled={
                              _this.state.widgetSetting.openaftersec === 0
                            }
                            onClick={() => {
                              let newObj = _this.state.widgetSetting;
                              if (parseInt(newObj.openaftersec) > 0) {
                                newObj.openaftersec =
                                  parseInt(newObj.openaftersec) - 1;
                                _this.setState({
                                  widgetSetting: newObj,
                                });
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="time-seconde-time-input">
                      <label htmlFor="Delay time">Show on Scroll</label>
                      <div className="ms percent">
                        <input
                          type="number"
                          name="percent_scroll"
                          id="seconds"
                          value={_this.state.widgetSetting.afterscrollpercent}
                          onChange={(e) => {
                            let newObj = _this.state.widgetSetting;
                            if (parseInt(e.target.value) >= 0) {
                              newObj.afterscrollpercent = parseInt(
                                e.target.value
                              );
                              _this.setState({
                                widgetSetting: newObj,
                              });
                            } else {
                              newObj.afterscrollpercent = 0;
                              _this.setState({
                                widgetSetting: newObj,
                              });
                            }
                          }}
                        />
                        <div className="arrow-block">
                          <KeyboardArrowDownIcon
                            className="icon up"
                            onClick={() => {
                              let newObj = _this.state.widgetSetting;
                              if (parseInt(newObj.afterscrollpercent) >= 0) {
                                newObj.afterscrollpercent =
                                  parseInt(newObj.afterscrollpercent) + 1;
                                _this.setState({
                                  widgetSetting: newObj,
                                });
                              }
                            }}
                          />
                          <KeyboardArrowDownIcon
                            className="icon"
                            disabled={
                              _this.state.widgetSetting.afterscrollpercent === 0
                            }
                            onClick={() => {
                              let newObj = _this.state.widgetSetting;
                              if (parseInt(newObj.afterscrollpercent) > 0) {
                                newObj.afterscrollpercent =
                                  parseInt(newObj.afterscrollpercent) - 1;
                                _this.setState({
                                  widgetSetting: newObj,
                                });
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="basic-acc-block">
              <div className="availability_box">
                <input
                  value={
                    _this.state.widgetSetting
                      .widget_launch_criteria_checkbox_mobile === 0
                      ? false
                      : true
                  }
                  checked={
                    _this.state.widgetSetting
                      .widget_launch_criteria_checkbox_mobile === 0
                      ? false
                      : true
                  }
                  onChange={(e) => {
                    var newObj = _this.state.widgetSetting;
                    newObj.widget_launch_criteria_checkbox_mobile =
                      newObj.widget_launch_criteria_checkbox_mobile === 0
                        ? 1
                        : 0;
                    _this.setState({
                      widgetSetting: newObj,
                    });
                  }}
                  type="checkbox"
                ></input>
                <div style={{ width: "100%" }}>
                  <p className="availability_title">
                    Widget - Mobile Launch Criteria
                  </p>
                  <p className="availability_text">
                    Set criteria for launching the widget in Mobile Application
                  </p>
                  <div
                    className="time-seconde-box"
                    style={
                      _this.state.widgetSetting
                        .widget_launch_criteria_checkbox_mobile === 0
                        ? {
                            opacity: 0.5,
                            pointerEvents: "none",
                          }
                        : {}
                    }
                  >
                    <div className="time-seconde-time-input">
                      <label htmlFor="Delay time">Show After</label>
                      <div className="ms">
                        <input
                          type="number"
                          name="sec"
                          id="seconds"
                          value={
                            _this.state.widgetSetting.show_after_sec_mobile
                          }
                          onChange={(e) => {
                            let newObj = _this.state.widgetSetting;
                            if (parseInt(e.target.value) >= 0) {
                              newObj.show_after_sec_mobile = parseInt(
                                e.target.value
                              );
                              _this.setState({
                                widgetSetting: newObj,
                              });
                            } else {
                              newObj.show_after_sec_mobile = 0;
                              _this.setState({
                                widgetSetting: newObj,
                              });
                            }
                          }}
                        />
                        <div className="arrow-block">
                          <KeyboardArrowDownIcon
                            className="icon up"
                            onClick={() => {
                              let newObj = _this.state.widgetSetting;
                              if (parseInt(newObj.show_after_sec_mobile) >= 0) {
                                newObj.show_after_sec_mobile =
                                  parseInt(newObj.show_after_sec_mobile) + 1;
                                _this.setState({
                                  widgetSetting: newObj,
                                });
                              }
                            }}
                          />
                          <KeyboardArrowDownIcon
                            className="icon"
                            disabled={
                              _this.state.widgetSetting
                                .show_after_sec_mobile === 0
                            }
                            onClick={() => {
                              let newObj = _this.state.widgetSetting;
                              if (parseInt(newObj.show_after_sec_mobile) > 0) {
                                newObj.show_after_sec_mobile =
                                  parseInt(newObj.show_after_sec_mobile) - 1;
                                _this.setState({
                                  widgetSetting: newObj,
                                });
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="time-seconde-time-input">
                      <label htmlFor="Delay time">Open After</label>
                      <div className="ms">
                        <input
                          type="number"
                          name="sec"
                          id="seconds"
                          value={
                            _this.state.widgetSetting.open_after_sec_mobile
                          }
                          onChange={(e) => {
                            let newObj = _this.state.widgetSetting;
                            if (parseInt(e.target.value) >= 0) {
                              newObj.open_after_sec_mobile = parseInt(
                                e.target.value
                              );
                              _this.setState({
                                widgetSetting: newObj,
                              });
                            } else {
                              newObj.open_after_sec_mobile = 0;
                              _this.setState({
                                widgetSetting: newObj,
                              });
                            }
                          }}
                        />
                        <div className="arrow-block">
                          <KeyboardArrowDownIcon
                            className="icon up"
                            onClick={() => {
                              let newObj = _this.state.widgetSetting;
                              if (parseInt(newObj.open_after_sec_mobile) >= 0) {
                                newObj.open_after_sec_mobile =
                                  parseInt(newObj.open_after_sec_mobile) + 1;
                                _this.setState({
                                  widgetSetting: newObj,
                                });
                              }
                            }}
                          />
                          <KeyboardArrowDownIcon
                            className="icon"
                            disabled={
                              _this.state.widgetSetting
                                .open_after_sec_mobile === 0
                            }
                            onClick={() => {
                              let newObj = _this.state.widgetSetting;
                              if (parseInt(newObj.open_after_sec_mobile) > 0) {
                                newObj.open_after_sec_mobile =
                                  parseInt(newObj.open_after_sec_mobile) - 1;
                                _this.setState({
                                  widgetSetting: newObj,
                                });
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="time-seconde-time-input">
                      <label htmlFor="Delay time">Show on Scroll</label>
                      <div className="ms percent">
                        <input
                          type="number"
                          name="percent_scroll"
                          id="seconds"
                          value={
                            _this.state.widgetSetting
                              .after_scroll_percent_mobile
                          }
                          onChange={(e) => {
                            let newObj = _this.state.widgetSetting;
                            if (parseInt(e.target.value) >= 0) {
                              newObj.after_scroll_percent_mobile = parseInt(
                                e.target.value
                              );
                              _this.setState({
                                widgetSetting: newObj,
                              });
                            } else {
                              newObj.after_scroll_percent_mobile = 0;
                              _this.setState({
                                widgetSetting: newObj,
                              });
                            }
                          }}
                        />
                        <div className="arrow-block">
                          <KeyboardArrowDownIcon
                            className="icon up"
                            onClick={() => {
                              let newObj = _this.state.widgetSetting;
                              if (
                                parseInt(newObj.after_scroll_percent_mobile) >=
                                0
                              ) {
                                newObj.after_scroll_percent_mobile =
                                  parseInt(newObj.after_scroll_percent_mobile) +
                                  1;
                                _this.setState({
                                  widgetSetting: newObj,
                                });
                              }
                            }}
                          />
                          <KeyboardArrowDownIcon
                            className="icon"
                            disabled={
                              _this.state.widgetSetting
                                .after_scroll_percent_mobile === 0
                            }
                            onClick={() => {
                              let newObj = _this.state.widgetSetting;
                              if (
                                parseInt(newObj.after_scroll_percent_mobile) > 0
                              ) {
                                newObj.after_scroll_percent_mobile =
                                  parseInt(newObj.after_scroll_percent_mobile) -
                                  1;
                                _this.setState({
                                  widgetSetting: newObj,
                                });
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="basic-acc-block">
              <div className="availability_box">
                <input
                  value={
                    _this.state.widgetSetting.widgetanimationcheckbox === 0
                      ? false
                      : true
                  }
                  checked={
                    _this.state.widgetSetting.widgetanimationcheckbox === 0
                      ? false
                      : true
                  }
                  onChange={(e) => {
                    var newObj = _this.state.widgetSetting;
                    newObj.widgetanimationcheckbox =
                      newObj.widgetanimationcheckbox === 0 ? 1 : 0;
                    _this.setState({
                      widgetSetting: newObj,
                    });
                  }}
                  type="checkbox"
                ></input>
                <div>
                  <p className="availability_title">Widget animation</p>
                  {/* <p className="availability_text">
                    
                  </p> */}
                  <div
                    className="widget_animation"
                    style={
                      _this.state.widgetSetting.widgetanimationcheckbox === 0
                        ? {
                            opacity: 0.5,
                            pointerEvents: "none",
                          }
                        : {}
                    }
                  >
                    <div
                      style={
                        _this.state.widgetSetting.widgetanimationtype ===
                        "ripple"
                          ? { border: "1px solid " }
                          : {}
                      }
                      role="button"
                      onClick={(e) => {
                        var newObj = _this.state.widgetSetting;
                        newObj.widgetanimationtype = "ripple";
                        _this.setState({
                          widgetSetting: newObj,
                        });
                      }}
                    >
                      <TriggerButtonRipple>
                        <MsgImg size={25} fill={"#fff"} stroke={"#fff"} />
                      </TriggerButtonRipple>
                      <div>Ripple</div>
                    </div>
                    <div
                      style={
                        _this.state.widgetSetting.widgetanimationtype === "tada"
                          ? { border: "1px solid " }
                          : {}
                      }
                      role="button"
                      onClick={(e) => {
                        var newObj = _this.state.widgetSetting;
                        newObj.widgetanimationtype = "tada";
                        _this.setState({
                          widgetSetting: newObj,
                        });
                      }}
                    >
                      <TriggerButtonTada>
                        <MsgImg size={25} fill={"#fff"} stroke={"#fff"} />
                      </TriggerButtonTada>
                      <div>Tada</div>
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

        <Dialog
          open={this.state.previewModel}
          onClose={this.handleClosePreviewModel}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="widget-setting-popup-model"
        >
          <DialogContent>
            <Button
              variant="contained"
              className="stop-btn"
              onClick={this.handleClosePreviewModel}
            >
              Stop preview
            </Button>

            <DialogContentText id="alert-dialog-description">
              <div className="preview-block">
                {this.state.previewImg === "img1" ? (
                  <img src={img1} alt="" />
                ) : this.state.previewImg === "img2" ? (
                  <img src={img2} alt="" />
                ) : this.state.previewImg === "img3" ? (
                  <img src={img3} alt="" />
                ) : null}
                <IconButton
                  onClick={this.handleClosePreviewModel}
                  className="cross-icon"
                >
                  <ClearIcon />
                </IconButton>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>

        <Dialog
          open={this.state.videoFormatModal}
          onClose={() => {
            this.setState({
              videoFormatModal: false,
            });
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="delete_popup"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>
                This Video format is not supported in older version browsers
              </p>
              <hr />
              <div>
                <p>Follow this instructions to convert the video:</p>
                <ol>
                  <li>
                    use this following link to convert the Video &nbsp;
                    <a href="https://converterpoint.com/">Clickhere</a>
                  </li>
                </ol>
                <div className="info_box">
                  <div className="d-flex justify-content-end w-100">
                    <Button
                      variant="contained"
                      className="no_btn"
                      onClick={() => {
                        this.setState({
                          videoFormatModal: false,
                        });
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

export default WidgetComponent;
