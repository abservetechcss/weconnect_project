import React, { Component, Fragment } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  IconButton,
  Tooltip,
  Button,
  Grid,
  Dialog,
  DialogContent,
  DialogContentText,
} from "@mui/material";

import { FloatingLabel, Form } from "react-bootstrap";
import help from "../../../../../../../../assets/images/help-circle.svg";
import RaibuStepComponent from "./components/RaibuStepComponent";
import undo from "../../../../../../../../assets/images/userdash/rotate-ccw.svg";
import redo from "../../../../../../../../assets/images/userdash/rotate-cw.svg";
import line from "../../../../../../../../assets/images/userdash/Line 1134.svg";
import crossX from "../../../../../../../../assets/images/x.svg";
import image from "../../../../../../../../assets/images/image.svg";
import { styled } from "@mui/material/styles";
import CustomEditor from "../../layouts/EditorComponent";

import {
  createComponent,
  updateComponent,
  getSavedComponent,
  insertComponent,
} from "../../../BuilderConversaionServer";

import { AlertContext } from "../../../../../../../common/Alert";
import FontIconPicker from "@muthu32/react-fonticonpicker";
import "@muthu32/react-fonticonpicker/dist/fonticonpicker.base-theme.react.css";
import "@muthu32/react-fonticonpicker/dist/fonticonpicker.material-theme.react.css";
import { ReactIcons } from "../../../../../../../common/IconList";
import DynamicIcon from "../../../../../../../common/DynamicIcon";
import { uploadImageCallBack } from "../../../../../../../agent/offline-messages/server/OfflineMessageServer";

export class AddRaibuComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    this.defaultHtml = "How would you like to connect to an agent?";
    this.state = {
      btnstyle: "",
      setupLive: false,
      liveChat: 1,
      videoChat: 1,
      backButton: 0,
      skipButton: 0,
      liveChatName: "Live Chat",
      videoChatName: "Video Chat",
      raibuStepCompleted: false,
      liveChatBtnId: "",
      videoChatBtnId: "",
      alert: "",
      btnType: "chips",
      save: false,
      defaultHtml: "<p>How would you like to connect to an agent?</p>",
      editordata: "",
      btnImage: {
        liveChatImg: "",
        videoChatImg: "",
      },
      btnIcon: {
        liveChatIcon: "",
        videoChatIcon: "",
      },
    };

    this.myRef = {
      component: {
        question_id: "",
        type: this.props.type,
        question: this.state.defaultHtml,
        back_button: 0,
        skip_button: 0,
        liveChat: 1,
        videoChat: 1,
        chip_type: "chips",
        welcome_card_image: "",
        enable: 0,
        bg_color: null,
        bg_color_start: null,
        text_color: null,
        welcome_card_bg_type: "",
        order_no: this.props.orderNo,
        client_id: "309-160-128e2b8f30",
        hide: 0,
      },
      options_type: [
        {
          btn_id: 0,
          btn_text: "Live Chat",
          btn_val: "",
          data_value: 1,
          sub_type: "live_chat",
        },
        {
          btn_id: 341,
          btn_text: "Video Chat",
          data_value: 0,
          btn_val: "",
          sub_type: "video_chat",
        },
      ],
    };
    this.handCheckChange = this.handCheckChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleFinishSetupLive = this.handleFinishSetupLive.bind(this);
    this.footerRef = React.createRef();
    this.editorRef = React.createRef();
  }

  refreshPreview() {
    if (
      this.props.widget &&
      this.props.widget.webchatRef.current &&
      this.props.widget.webchatRef.current.updateMessageComponent
    ) {
      console.log("data", this.myRef);
      this.props.widget.webchatRef.current.updateMessageComponent({
        msgIndex: 0,
        component: this.myRef.component,
        btn_detail: this.myRef.options_type,
      });
    }
  }
  refreshOptionTypes(noUpdate) {
    let newOptions = [];
    if (this.state.liveChat) {
      newOptions.push({
        btn_id: this.state.liveChatBtnId,
        btn_text: this.state.liveChatName,
        data_value: 1,
        sub_type: "live_chat",
        btn_val:
          this.state.btnType === "image"
            ? this.state.btnImage.liveChatImg
            : this.state.btnIcon.liveChatIcon,
        btn_type: this.state.btnType,
      });
    }
    if (this.state.videoChat) {
      newOptions.push({
        btn_id: this.state.liveChatBtnId,
        btn_text: this.state.videoChatName,
        data_value: 1,
        sub_type: "video_chat",
        btn_val:
          this.state.btnType === "image"
            ? this.state.btnImage.videoChatImg
            : this.state.btnIcon.videoChatIcon,
        btn_type: this.state.btnType,
      });
    }
    this.myRef.options_type = newOptions;
    if (typeof noUpdate === "undefined") this.refreshPreview();
  }
  refreshComponent(noUpdate) {
    const html = this.state.editordata
      ? this.state.editordata
      : this.state.defaultHtml;
    let component = {
      ...this.myRef.component,
      chip_type: this.state.btnType,
      liveChat: this.state.liveChat,
      videoChat: this.state.videoChat,
      back_button: this.state.backButton,
      skip_button: this.state.skipButton,
      question: html,
    };
    this.myRef.component = component;
    if (typeof noUpdate === "undefined") this.refreshPreview();
  }
  addChatMessagPreview() {
    if (this.props.widget && this.props.widget.addUserMessage) {
      const message = {
        type: "postback",
        payload: this.props.type,
        item: {
          component: this.myRef.component,
          btn_detail: this.myRef.options_type,
        },
      };
      console.log("message", message);
      this.props.widget.addUserMessage(message);
    }
  }

  handleBtnStyle = (event) => {
    this.setState({
      btnstyle: event.target.value,
    });
  };
  handleSetupLiveOpen = () => {
    this.setState({
      setupLive: true,
    });
  };

  handleSetupLiveClose = () => {
    this.setState({
      setupLive: false,
    });
  };

  handleFinishSetupLive = () => {
    this.setState({
      setupLive: false,
      raibuStepCompleted: true,
    });
  };
  componentDidMount() {
    console.log("this.props.questionId", this.props);
    let _this = this;
    if (this.props.questionId !== "") {
      const myparams = `bot_id=${this.props.botId}&type=${this.props.type}&question_id=${this.props.questionId}`;
      this.context.showLoading();
      getSavedComponent(
        myparams,
        (res) => {
          this.context.showLoading(false);
          console.log("response", res);
          if (res.status === "True") {
            // this.editorRef.current.setHtml(res.message);
            this.setState({
              defaultHtml: res.message,
            });
            let updateState = {
              backButton: res.back_button,
              skipButton: res.skip_button,
              liveChat: 0,
              videoChat: 0,
              liveChatName: "",
              videoChatName: "",
              liveChatBtnId: "",
              videoChatBtnId: "",
              btnType: res.btn_type,
            };
            if (res.btn_type === "image") {
              updateState = {
                ...updateState,
                btnImage: {
                  liveChatImg: res.btn_detail[0].btn_val,
                  videoChatImg: res.btn_detail[1].btn_val,
                },
              };
            } else if (res.btn_type === "icon") {
              updateState = {
                ...updateState,
                btnIcon: {
                  liveChatIcon: res.btn_detail[0].btn_val,
                  videoChatIcon: res.btn_detail[1].btn_val,
                },
              };
            }
            res.btn_detail.map((item) => {
              if (item.live_type == "live_chat") {
                // live chat
                if (item.status == 0) updateState.liveChat = 1;
                else updateState.liveChat = 0;

                updateState.liveChatName = item.btn_text;
                updateState.liveChatBtnId = item.btn_id;
              } else if (item.live_type == "video_call") {
                // video chat
                if (item.status == 0) updateState.videoChat = 1;
                else updateState.videoChat = 0;
                updateState.videoChatName = item.btn_text;
                updateState.videoChatBtnId = item.btn_id;
              }
            });
            this.setState(updateState, () => {
              this.refreshOptionTypes(true);
              this.refreshComponent(true);
              this.addChatMessagPreview();
            });
            this.setState({
              btnType: res.btn_type,
            });
            if (res.btn_type == "image") {
              let a = {
                liveChatImg: res.btn_detail[0].btn_val,
                videoChatImg: res.btn_detail[1].btn_val,
              };
              this.setState({
                btnImage: a,
              });
            } else {
            }
          } else {
            this.context.showAlert({
              type: "error",
              message: res.message || "Error",
            });
          }
        },
        (error) => {}
      );
    } else {
      // this.editorRef.current.setHtml(this.defaultHtml, () => {
      //   _this.addChatMessagPreview();
      // });
    }
  }

  componentWillUnmount() {
    if (
      window.WeConnect &&
      window.WeConnect.webchatRef &&
      window.WeConnect.webchatRef.current
    )
      window.WeConnect.webchatRef.current.clearMessages();
  }

  insertInMiddle(param) {
    param.orderNo = this.props.orderNo;
    insertComponent(
      param,
      (res) => {
        this.context.showAlert({
          type: "success",
          message: "Component added successfully",
        });
        this.props.handleCloseChatComponent();
      },
      (err) => {
        this.context.showAlert({
          type: "error",
          message: err.message || "Sequence Update Failed",
        });
      }
    );
  }

  uploadImageCallBackfn = (file, filetype) => {
    return uploadImageCallBack(file, filetype);
  };

  EditorChange = (newValue) => {
    if (this.state.defaultHtml !== newValue) {
      console.log(newValue);
      this.setState(
        {
          editordata: newValue,
        },
        () => {
          this.refreshComponent();
        }
      );
    }
  };

  handleSave = () => {
    /**
     * Force User to Complete Raibu Steps
     */
    // if (this.props.questionId === "" && this.state.raibuStepCompleted===false) {
    //   this.handleDialogClose();
    //   this.context.showAlert({ type: "error", message: "Please Complete Step 2, Setup Live Assistant!" });
    // return;
    // }

    this.context.showLoading();
    const html = this.state.editordata
      ? this.state.editordata
      : this.state.defaultHtml;

    // const botId = localStorage.getItem("activeBotId");
    const botId = this.props.botId;
    const liveType = [];
    const chipNameUpdate = [];
    const errors = [];
    const dataValue = [];
    const buttonId = [];
    const status = [];
    if (this.state.liveChat) {
      liveType.push("live_chat");
      dataValue.push(1);
      if (this.state.liveChatName.trim() === "") {
        errors.push("Live Chat Button Name is required");
      } else {
        chipNameUpdate.push(this.state.liveChatName);
        status.push(0);
      }
      if (this.state.liveChatBtnId !== "") {
        buttonId.push(this.state.liveChatBtnId);
      } else {
        buttonId.push(0);
      }
      if (this.state.btnType === "image") {
        if (this.state.btnImage.liveChatImg == "") {
          errors.push("image required");
        }
      }
    } else {
      chipNameUpdate.push("Live Chat");
      status.push(1);
      // buttonId.push(0)
    }
    if (this.state.videoChat) {
      liveType.push("video_chat");
      dataValue.push(0);
      if (this.state.videoChatName.trim() === "") {
        errors.push("Video Chat Button Name is required");
      } else {
        chipNameUpdate.push(this.state.videoChatName);
        status.push(0);
      }
      if (this.state.videoChatBtnId !== "") {
        buttonId.push(this.state.videoChatBtnId);
      } else {
        buttonId.push(0);
      }
      if (this.state.btnType === "image") {
        if (this.state.btnImage.videoChatImg == "") {
          errors.push("image required");
        }
      }
    } else {
      chipNameUpdate.push("Video Chat");
      status.push(1);
      // buttonId.push(0);
    }
    if (liveType.length == 0) {
      errors.push("Please select atleast on chat Type");
    }

    const textContent = html.replace(
      /<(?!img\s*\/?)(?!video\s*\/?)[^>]+>/g,
      ""
    );
    console.log("textContent", textContent);
    if (textContent.trim() === "") {
      errors.push("Chat Message is Required");
    }

    if (errors.length > 0) {
      this.context.showAlert({ type: "error", message: errors.join("\n\r") });
      return;
    }
    console.log("this.props", this.props);

    const data = {
      type: this.props.type,
      bot_id: botId,
      live_type: ["live_chat", "video_call"],
      btn_type: this.state.btnType, // image or icon
      btn_name: chipNameUpdate,
      // data_value: [1,0],
      chat_message: html,
      back_button: this.state.backButton,
      skip_button: this.state.skipButton,
      order_no: this.props.orderNo,
      status: status,
    };
    if (this.state.btnType == "image") {
      data.image = [
        this.state.btnImage.liveChatImg,
        this.state.btnImage.videoChatImg,
      ];
    } else {
      data.icon = [
        this.state.btnIcon.liveChatIcon,
        this.state.btnIcon.videoChatIcon,
      ];
    }
    console.log("this.props.questionId", this.props.questionId);
    console.log("this.props.type", this.props.type);
    if (this.props.questionId === "") {
      createComponent(
        data,
        (res) => {
          if (res.status === "True") {
            if (this.props.insertMiddle) {
              this.insertInMiddle(res);
            } else {
              this.context.showAlert({
                type: "success",
                message: "Component added successfully",
              });
              this.props.handleCloseChatComponent();
            }
          } else {
            this.handleDialogClose();
            this.context.showAlert({
              type: "error",
              message: res.message || "Add Component Failed",
            });
          }
        },
        (error) => {
          this.handleDialogClose();
          this.context.showAlert({
            type: "error",
            message: error.message || "Update Component Failed",
          });
        }
      );
    } else {
      data.type = this.props.type;
      data.question_id = this.props.questionId;

      data.btn_id = [this.state.liveChatBtnId, this.state.videoChatBtnId];
      updateComponent(
        data,
        (res) => {
          if (res.status === "True") {
            this.context.showAlert({
              type: "success",
              message: "Component updated successfully",
            });
            this.props.handleCloseChatComponent();
          } else {
            this.handleDialogClose();
            this.context.showAlert({
              type: "error",
              message: res.message || "Add Component Failed",
            });
          }
        },
        (error) => {
          this.context.showAlert({
            type: "error",
            message: error.message || "Update Component Failed",
          });
        }
      );
    }
  };

  handCheckChange = (event) => {
    const label = event.target.dataset.label;
    this.setState({ [label]: event.target.checked ? 1 : 0 }, () => {
      if (label === "liveChat" || label === "videoChat") {
        this.refreshOptionTypes();
      } else {
        this.refreshComponent();
      }
    });
  };

  handleInputChange = (event) => {
    const label = event.target.dataset.label;
    this.setState({ [label]: event.target.value }, () => {
      if (label === "liveChatName" || label === "videoChatName") {
        this.refreshOptionTypes();
      } else {
        this.refreshComponent();
      }
    });
  };

  handleDialogClose = () => {
    this.setState({
      save: false,
    });
  };

  handleDialogOpen = () => {
    this.setState({
      save: true,
    });
  };

  renderSVG(svg) {
    if (svg && svg != "") {
      return <DynamicIcon icon={svg} size="2em" color="black" />;
    } else {
      return <span></span>;
    }
  }

  handleArrayObjectImage = (event, type) => {
    const index = parseInt(event.target.dataset.index);
    const label = event.target.name;
    const FR = new FileReader();

    FR.addEventListener("load", (evt) => {
      let a = { ...this.state.btnImage };
      if (type == "live") {
        a.liveChatImg = evt.target.result;
      } else {
        a.videoChatImg = evt.target.result;
      }
      this.setState(
        {
          btnImage: a,
        },
        () => {
          this.refreshOptionTypes();
        }
      );
    });
    FR.readAsDataURL(event.target.files[0]);
  };

  handleArrayIcon = (val, type) => {
    let a = { ...this.state.btnIcon };
    if (type == "live") {
      a.liveChatIcon = val;
    } else {
      a.videoChatIcon = val;
    }
    this.setState(
      {
        btnIcon: a,
      },
      () => {
        this.refreshOptionTypes();
      }
    );
  };

  render() {
    const Input = styled("input")({
      display: "none",
    });
    let _this = this;
    return (
      <Fragment>
        {this.state.alert}
        <section className="add-chat-block-section">
          <div className="knowledge_header">
            <div>
              <IconButton
                onClick={this.props.handleCloseChatComponent}
                className="back_icon_btn"
              >
                <ChevronLeftIcon className="icon" />
              </IconButton>
              <p>Configure component: Raibu (Live setup)</p>
            </div>
            <div className="undo-redo">
              <Tooltip title="undo">
                <IconButton>
                  <img src={undo} />
                </IconButton>
              </Tooltip>
              <img src={line} />
              <Tooltip title="redo">
                <IconButton>
                  <img src={redo} />
                </IconButton>
              </Tooltip>
            </div>
          </div>

          <div className="main-section">
            <div className="chat-msg-block">
              <div className="raibu_live_setup">
                <div className="live_step1">
                  <label className="step_label">STEP 1</label>
                  <div className="live_chat_main">
                    <div className="live_chat_comp">
                      <Form.Group
                        className="live_checkbox"
                        controlId="formLiveCheckbox"
                      >
                        <Form.Check
                          onChange={this.handCheckChange}
                          data-label="liveChat"
                          checked={this.state.liveChat === 1}
                          type="checkbox"
                          label="Live Chat"
                        />
                      </Form.Group>
                      <div className="live_chat_inner">
                        <label className="live_chat_inner_label">BUTTON</label>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            {/* <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                Button Style
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={this.state.btnstyle}
                                label="Button Style"
                                onChange={this.handleBtnStyle}
                              >
                                <MenuItem value="">
                                  <em>None</em>
                                </MenuItem>
                                <MenuItem value={10}>Ten</MenuItem>
                                <MenuItem value={20}>Twenty</MenuItem>
                                <MenuItem value={30}>Thirty</MenuItem>
                              </Select>
                            </FormControl> */}

                            <FloatingLabel
                              controlId="floatingSelect"
                              label="Button Style"
                              className="floating-select-field-block-cust"
                            >
                              <Form.Select
                                value={this.state.btnType}
                                onChange={this.handleInputChange}
                                data-label="btnType"
                                aria-label="Floating label select example"
                              >
                                <option value="chips">Chips</option>
                                <option value="icon">Button with icon</option>
                                <option value="image">Button with image</option>
                              </Form.Select>
                            </FloatingLabel>
                          </Grid>
                          <Grid item xs={6}>
                            <FloatingLabel
                              className="floating-input-field-block-cust"
                              controlId="floatingPassword"
                              label="Button Name"
                            >
                              <Form.Control
                                value={this.state.liveChatName}
                                onChange={this.handleInputChange}
                                data-label="liveChatName"
                                type="text"
                                placeholder="text"
                              />
                            </FloatingLabel>
                          </Grid>
                          {/* <Grid style={{ position: "relative" }} item xs={6}>
                            <FloatingLabel
                              className="floating-input-link-field-block-cust"
                              controlId="floatingPassword"
                              label="Select Icon"
                            >
                              <div className="icon-block">
                                <img src={smile} alt="" />
                              </div>
                              <Form.Control type="text" placeholder="text" />
                            </FloatingLabel>
                          </Grid> */}
                          {this.state.btnType === "icon" && (
                            <Grid item sm={6}>
                              <Form.Group
                                className="search-block-cust"
                                controlId="formBasicEmail"
                              >
                                <div className="icon_picker_field">
                                  <FontIconPicker
                                    closeOnSelect={true}
                                    value={this.state.btnIcon.liveChatIcon}
                                    // theme="teal"
                                    isMulti={false}
                                    icons={ReactIcons}
                                    renderFunc={this.renderSVG}
                                    onChange={(val) =>
                                      this.handleArrayIcon(val, "live")
                                    }
                                  />
                                </div>
                              </Form.Group>
                            </Grid>
                          )}
                          {this.state.btnType === "image" && (
                            <Grid item sm={6}>
                              <div className="upload-image-block">
                                <label htmlFor="UPLOAD IMAGE">
                                  UPLOAD IMAGE
                                </label>
                                <div className="preview-upload">
                                  <div className="preview">
                                    <img
                                      src={
                                        this.state.btnImage.liveChatImg == ""
                                          ? image
                                          : this.state.btnImage.liveChatImg
                                      }
                                      alt="image"
                                      className="show-preview"
                                    />
                                  </div>
                                  <div className="upload">
                                    <label htmlFor={"contained-button-file1"}>
                                      <Input
                                        accept="image/*"
                                        id={"contained-button-file1"}
                                        // multiple
                                        type="file"
                                        // data-index={key}
                                        name="image"
                                        onChange={(e) => {
                                          this.handleArrayObjectImage(
                                            e,
                                            "live"
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
                                </div>
                                <div className="condition-block">
                                  <ul>
                                    <li>Image format: JPG/PNG</li>
                                    <li>Aspect Ratio: 16:9 </li>
                                    <li>
                                      Recommended size: 3840x2160 or 1920x1080
                                      pixels
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </Grid>
                          )}
                        </Grid>
                      </div>
                    </div>
                    <div className="video_call_comp">
                      <Form.Group
                        className="live_checkbox"
                        controlId="formVideoCheckbox"
                      >
                        <Form.Check
                          onChange={this.handCheckChange}
                          data-label="videoChat"
                          checked={this.state.videoChat === 1}
                          type="checkbox"
                          label="Video Call"
                        />
                      </Form.Group>
                      <div className="live_chat_inner">
                        <label className="live_chat_inner_label">BUTTON</label>
                        <Grid container spacing={2}>
                          <Grid item xs={12}>
                            <FloatingLabel
                              controlId="floatingSelect"
                              label="Button Style"
                              className="floating-select-field-block-cust"
                            >
                              <Form.Select
                                value={this.state.btnType}
                                onChange={this.handleInputChange}
                                data-label="btnType"
                                aria-label="Floating label select example"
                              >
                                <option value="chips">Chips</option>
                                <option value="icon">Button with icon</option>
                                <option value="image">Button with image</option>
                              </Form.Select>
                            </FloatingLabel>
                          </Grid>
                          <Grid item xs={6}>
                            <FloatingLabel
                              className="floating-input-field-block-cust"
                              controlId="floatingPassword"
                              label="Button Name"
                            >
                              <Form.Control
                                value={this.state.videoChatName}
                                onChange={this.handleInputChange}
                                data-label="videoChatName"
                                type="text"
                                placeholder="text"
                              />
                            </FloatingLabel>
                          </Grid>
                          {this.state.btnType === "icon" && (
                            <Grid item sm={6}>
                              <Form.Group
                                className="search-block-cust"
                                controlId="formBasicEmail"
                              >
                                <div className="icon_picker_field">
                                  <FontIconPicker
                                    closeOnSelect={true}
                                    value={this.state.btnIcon.videoChatIcon}
                                    // theme="teal"
                                    isMulti={false}
                                    icons={ReactIcons}
                                    renderFunc={this.renderSVG}
                                    onChange={(val) =>
                                      this.handleArrayIcon(val, "video")
                                    }
                                  />
                                </div>
                              </Form.Group>
                            </Grid>
                          )}
                          {this.state.btnType === "image" && (
                            <Grid item sm={6}>
                              <div className="upload-image-block">
                                <label htmlFor="UPLOAD IMAGE">
                                  UPLOAD IMAGE
                                </label>
                                <div className="preview-upload">
                                  <div className="preview">
                                    <img
                                      src={
                                        this.state.btnImage.videoChatImg == ""
                                          ? image
                                          : this.state.btnImage.videoChatImg
                                      }
                                      alt="image"
                                      className="show-preview"
                                    />
                                  </div>
                                  <div className="upload">
                                    <label htmlFor={"contained-button-file2"}>
                                      <Input
                                        accept="image/*"
                                        id={"contained-button-file2"}
                                        // multiple
                                        type="file"
                                        // data-index={key}
                                        name="image"
                                        onChange={(e) => {
                                          this.handleArrayObjectImage(
                                            e,
                                            "video"
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
                                </div>
                                <div className="condition-block">
                                  <ul>
                                    <li>Image format: JPG/PNG</li>
                                    <li>Aspect Ratio: 16:9 </li>
                                    <li>
                                      Recommended size: 3840x2160 or 1920x1080
                                      pixels
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </Grid>
                          )}
                        </Grid>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="live_step1">
                  <label className="step_label">STEP 2</label>
                  <div className="live_chat_main">
                    <Button
                      variant="contained"
                      onClick={this.handleSetupLiveOpen}
                    >
                      Setup Live Assistant
                    </Button>
                    {/* <p className="live_step2_text">
                      
                    </p> */}
                  </div>
                </div>
                <div className="live_step1">
                  <label className="step_label">STEP 3</label>
                  <div className="live_chat_main">
                    <div className="offline_email_section">
                      <div className="w-100">
                        <div className="reply_message editor-block-all add-raibu-editor">
                          <div className="msg_text"></div>
                          <label htmlFor="Chat Message">Chat Message</label>
                          <CustomEditor
                            defaultHtml={_this.state.defaultHtml}
                            uploadImageCallBackfn={_this.uploadImageCallBackfn}
                            handleEditorChange={_this.EditorChange}
                            botId={this.props.botId}
                            questionId={this.props.questionId}
                          />
                        </div>
                      </div>
                      <div className="button_component">
                        <label htmlFor="Chat Message">Button</label>
                        <div>
                          {" "}
                          <Form.Group controlId="formBackCheckbox">
                            <Form.Check
                              type="checkbox"
                              label="Back button"
                              onChange={this.handCheckChange}
                              data-label="backButton"
                              checked={this.state.backButton === 1}
                            />
                          </Form.Group>
                          <Form.Group controlId="formSkipCheckbox">
                            <Form.Check
                              type="checkbox"
                              label="Skip button"
                              onChange={this.handCheckChange}
                              data-label="skipButton"
                              checked={this.state.skipButton === 1}
                            />
                          </Form.Group>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="knowledge_footer">
            <div className="btn_block">
              <Button
                variant="contained"
                className="cancel-btn"
                onClick={() => {
                  this.props.handleCloseChatComponent();
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className="save-btn"
                onClick={this.handleDialogOpen}
              >
                Save
              </Button>
            </div>
          </div>
        </section>
        {/* Model popup start */}
        <Dialog
          open={this.state.setupLive}
          onClose={this.handleSetupLiveClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="raibu-setup-live-model-popup"
        >
          <span className="cross-icon-block">
            <IconButton onClick={this.handleSetupLiveClose}>
              <img src={crossX} alt="" />
            </IconButton>
          </span>
          <DialogContent>
            <p className="header-title">Setup Raibu - Live assistant</p>
            <RaibuStepComponent
              questionId={this.props.questionId}
              botId={this.props.botId}
              handleSetupLiveClose={this.handleSetupLiveClose}
              handleFinishSetupLive={this.handleFinishSetupLive}
            />
          </DialogContent>
        </Dialog>
        <Dialog
          open={this.state.save}
          onClose={this.handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="delete_popup"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>Do you want to save this component?</p>
              <div className="info_box">
                <img src={help} />
                <div>
                  <Button
                    variant="contained"
                    className="no_btn"
                    onClick={this.handleDialogClose}
                  >
                    No
                  </Button>
                  <Button
                    variant="text"
                    className="yes_btn"
                    onClick={this.handleSave}
                  >
                    Yes
                  </Button>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
        {/* Model popup end */}
      </Fragment>
    );
  }
}

export default AddRaibuComponent;
