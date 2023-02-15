import React, { Component, Fragment } from "react";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Button, Divider, Menu } from "@mui/material";
import image from "../../../../../../../../assets/images/image.svg";
import video from "../../../../../../../../assets/images/video.svg";
import { styled } from "@mui/material/styles";
import { ColorPicker } from "react-color-gradient-picker";
import { fontFamilyList } from "../../../../../../../../variables/appVariables.jsx";
import {
  createGeneralLanding,
  getGeneralSettingList,
} from "../../../server/BuilderDesignServer.js";
import { AlertContext } from "../../../../../../../common/Alert";
import SimpleReactValidator from "simple-react-validator";

const solidColor = {
  red: 255,
  green: 255,
  blue: 255,
  alpha: 1,
  style: "rgb(255, 255, 255)",
};

const gradient = {
  points: [
    {
      left: 0,
      red: 255,
      green: 255,
      blue: 255,
      alpha: 1,
    },
    {
      left: 100,
      red: 255,
      green: 255,
      blue: 255,
      alpha: 1,
    },
  ],
  degree: 0,
  style:
    "linear-gradient(0deg,rgba(255, 255, 255, 1) 0%,rgba(255, 255, 255, 1) 100%)",
  type: "linear",
};
const textColor = {
  red: 255,
  green: 255,
  blue: 255,
  alpha: 1,
};
export default class GeneralLandingComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {},
    });
    this.state = {
      showGradientColorModal: null,
      showSolidColorModal: null,
      showProcessBarColorModal: null,
      generalSetting: {
        type: "landing",
        bot_id: props.botIdURL,
        font_family: "Roboto",
        font_size: 14,
        font_weight: 0,
        progress_bar: 0,
        weconnect_chat_branding: 0,
        bg_type: "",
        bg_start: "",
        bg_color: "",
        bg_image: "",
        progress_bar_color: "",
      },
      type: "",
      setImage: null,
      setVideo: null,
      isSolidColor: false,
      isGradientColor: false,
      isVideo: false,
      isImage: false,
      isProcessBarColor: false,
      setSolidColor: solidColor,
      setGradientColor: gradient,
      setProcessBarColor: textColor,
    };
    this.resetDefault = this.resetDefault.bind(this);
  }
  componentDidMount() {
    let _this = this;
    _this.fetchDataFromServer();
  }

  resetDefault() {
    let _this = this;
    _this.setState(
      {
        setGradientColor: gradient,
        setSolidColor: solidColor,
        setImage: null,
        setVideo: null,
        generalSetting: {
          ...this.state.generalSetting,
          bg_type: "color",
          bg_start: "rgb(255,255,255)",
          bg_color: "rgb(255,255,255)",
        },
      },
      () => {
        this.refreshBgStyle();
      }
    );
  }

  fetchDataFromServer = () => {
    let _this = this;
    let params = `type=landing&bot_id=${_this.props.botIdURL}`;
    getGeneralSettingList(
      params,
      (res) => {
        let temp = _this.state.generalSetting;
        // let newObj=res.
        if (res.bg_type === "color") {
          temp.bg_color = res.bg_value;
        } else if (res.bg_type === "gradient") {
          temp.bg_start = res.bg_value;
        } else if (res.bg_type === "image") {
          temp.bg_image = res.bg_value;
        } else if (res.bg_type === "video") {
          temp.bg_video = res.bg_value;
        }

        temp.bot_id = _this.props.botIdURL;
        temp.font_family =
          res.font_family === "Verdana" ? "Roboto" : res.font_family;
        temp.font_size = res.font_size === "" ? 0 : parseInt(res.font_size);
        temp.font_weight = res.font_weight;
        temp.progress_bar =
          res.progress_bar === 0 || res.progress_bar === null ? 0 : 1;
        // if(res.progress_bar===1)
        temp.progress_bar_color = res.progress_bar_color;
        temp.weconnect_chat_branding = res.weconnect_chat_branding;
        temp.type = "landing";
        _this.setState({
          loading: false,
          type: res.bg_type,
          setImage:
            temp.bg_image !== "" && temp.bg_image !== undefined
              ? temp.bg_image
              : null,
          setVideo:
            temp.bg_video !== "" && temp.bg_video !== undefined
              ? temp.bg_video
              : null,
          generalSetting: temp,
        });
      },
      () => {
        _this.props._this.setState({ loading: false });
      }
    );
  };

  refreshFontFamily = () => {
    if (
      window.WeConnect &&
      window.WeConnect.webchatRef.current &&
      window.WeConnect.webchatRef.current.updateFont
    ) {
      window.WeConnect.webchatRef.current.updateFont(
        this.state.generalSetting.font_family
      );
      this.refreshFontStyle();
    }
  };

  refreshFontStyle = () => {
    if (
      window.WeConnect &&
      window.WeConnect.webchatRef.current &&
      window.WeConnect.webchatRef.current.updateWebchatSettings
    ) {
      const fontSize = this.state.generalSetting.font_size;
      const fontFamily = this.state.generalSetting.font_family;

      window.WeConnect.webchatRef.current.updateWebchatSettings({
        fontStyle: {
          fontFamily: fontFamily + " !important",
          fontSize: fontSize,
          fontWeight:
            this.state.generalSetting.font_weight === 0 ? "normal" : "bold",
        },
        font_family: fontFamily,
      });
    }
  };

  refreshGeneralStyle = () => {
    if (
      window.WeConnect &&
      window.WeConnect.webchatRef.current &&
      window.WeConnect.webchatRef.current.updateWebchatSettings
    ) {
      const progress_bar = this.state.generalSetting.progress_bar;
      const progress_color = this.state.setProcessBarColor.style;
      const weconnect_chat_branding =
        this.state.generalSetting.weconnect_chat_branding;

      window.WeConnect.webchatRef.current.updateWebchatSettings({
        progress_bar: progress_bar,
        progressStyle: {
          background: progress_color,
          color: progress_color,
        },
        weconnect_chat_branding: weconnect_chat_branding,
      });
    }
  };

  refreshBgStyle = () => {
    let bg_value = this.state.setSolidColor.style;
    if (this.state.type === "gradient")
      bg_value = this.state.setGradientColor.style;
    else if (this.state.type === "image") bg_value = this.state.setImage;
    else if (this.state.type === "video") bg_value = this.state.setVideo;

    if (
      window.WeConnect &&
      window.WeConnect.webchatRef.current &&
      window.WeConnect.webchatRef.current.setSettingsChat
    ) {
      window.WeConnect.webchatRef.current.setSettingsChat({
        bg_type: this.state.type,
        bg_value: bg_value,
        bg_key: Math.random(),
      });
    }
  };

  onSubmit = () => {
    let _this = this;
    if (_this.validator.allValid()) {
      let tempObj = JSON.parse(JSON.stringify(_this.state.generalSetting));
      tempObj.bg_type = _this.state.type;
      if (_this.state.type === "image" && _this.state.isImage) {
        tempObj.bg_image = _this.state.setImage;
        tempObj.bg_color = "";
        tempObj.bg_start = "";
        tempObj.bg_video = "";
      }
      if (_this.state.type === "video" && _this.state.isVideo) {
        tempObj.bg_video = _this.state.setVideo;
        tempObj.bg_image = "";
        tempObj.bg_color = "";
        tempObj.bg_start = "";
      }
      if (_this.state.type === "gradient" && _this.state.isGradientColor) {
        tempObj.bg_start = _this.state.setGradientColor.style;
        tempObj.bg_color = "";
      }
      if (_this.state.type === "color" && _this.state.isSolidColor) {
        tempObj.bg_start = "";
        tempObj.bg_color = _this.state.setSolidColor.style;
      }
      if (
        _this.state.generalSetting.progress_bar === 1 &&
        _this.state.setProcessBarColor.style
      )
        tempObj.progress_bar_color = _this.state.setProcessBarColor.style;

      // _this.props.handleLoadingShow(true);
      // setTimeout(() => {
      //   _this.props.handleLoadingShow(false);
      // }, 3000);
      this.context.showLoading();
      createGeneralLanding(
        _this.props.super_this,
        tempObj,
        (res) => {
          // _this.props.handleLoadingShow(false);
          // successAlert("Updated Successfully!", _this.props.super_this);
          // _this.fetchDataFromServer();
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
          // _this.setState({ loading: false });
          // _this.props.handleLoadingShow(false);
        }
      );
    } else {
      _this.validator.showMessages();
      this.forceUpdate();
    }
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
        isSolidColor: true,
        isGradientColor: false,
        isVideo: false,
        isImage: false,
        type: "color",
        setImage: null,
        setVideo: null,
        setSolidColor: colorcardAttrs,
        setGradientColor: gradient,
      },
      () => {
        this.refreshBgStyle();
      }
    );
  };

  onChangeGradientColor = (gradientAttrs) => {
    let _this = this;
    _this.setState(
      {
        isGradientColor: true,
        isSolidColor: false,
        isVideo: false,
        isImage: false,
        type: "gradient",
        setImage: null,
        setVideo: null,
        setSolidColor: solidColor,
        setGradientColor: gradientAttrs,
      },
      () => {
        this.refreshBgStyle();
      }
    );
  };
  handleHeaderText = (event) => {
    this.setState({
      showProcessBarColorModal: event.currentTarget,
    });
  };

  handleHeaderTextClose = () => {
    this.setState({
      showProcessBarColorModal: null,
    });
  };
  onChangeHeaderText = (color) => {
    let _this = this;
    _this.setState(
      {
        setProcessBarColor: color,
      },
      () => {
        this.refreshGeneralStyle();
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
      if (files && files.length > 0 && files[0].type.includes("image")) {
        const reader = new FileReader();
        reader.addEventListener(
          "load",
          () => {
            _this.setState(
              {
                isGradientColor: false,
                isSolidColor: false,
                isVideo: false,
                isImage: true,
                type: "image",
                setImage: reader.result,
                setVideo: null,
                setSolidColor: solidColor,
                setGradientColor: gradient,
              },
              () => {
                this.refreshBgStyle();
              }
            );
          },
          false
        );
        reader.readAsDataURL(files[0]);
      } else if (files[0].type.includes("video")) {
        var videoSize = files[0].size / 1024 / 1024;
        console.log("videoSize", videoSize);
        if (
          files[0].name.includes(".mp4") ||
          files[0].name.includes(".mov") ||
          files[0].name.includes(".mkv") ||
          files[0].name.includes(".webm") ||
          files[0].name.includes(".wmv")
        ) {
          const reader = new FileReader();
          reader.addEventListener(
            "load",
            () => {
              _this.setState(
                {
                  type: "video",
                  setImage: null,
                  isGradientColor: false,
                  isSolidColor: false,
                  isVideo: true,
                  isImage: false,
                  setVideo: reader.result,
                  setSolidColor: solidColor,
                  setGradientColor: gradient,
                },
                () => {
                  this.refreshBgStyle();
                }
              );
            },
            false
          );
          reader.readAsDataURL(files[0]);
        } else {
          _this.setState({
            type: "",
            setImage: null,
            setVideo: null,
            isGradientColor: false,
            isSolidColor: false,
            isVideo: false,
            isImage: false,
            setSolidColor: solidColor,
            setGradientColor: gradient,
          });
          this.context.showAlert({
            type: "warning",
            message: `Please select a  video size less than or equal to 10MB.`,
          });
          // warningAlert(
          //   `Please select a  video size less than or equal to 10MB.`,
          //   _this.props.super_this
          // );
        }
      } else {
        _this.setState({
          type: "",
          setImage: null,
          setVideo: null,
          isGradientColor: false,
          isSolidColor: false,
          isVideo: false,
          isImage: false,
          setSolidColor: solidColor,
          setGradientColor: gradient,
        });
        this.context.showAlert({
          type: "warning",
          message: `File type not supported`,
        });
        // warningAlert(`File type not supported`, _this.props.super_this);
      }
    }
  };
  render() {
    let _this = this;
    const Input = styled("input")({
      display: "none",
    });
    const headerTextOpen = Boolean(_this.state.showProcessBarColorModal);

    const gradientOpen = Boolean(_this.state.showGradientColorModal);
    const solidOpen = Boolean(_this.state.showSolidColorModal);
    return (
      <Fragment>
        <div className="main-section general-block">
          <label htmlFor="Text">Text</label>
          <div className="border-block border">
            <div className="font-controler">
              <div className="family">
                <label htmlFor="Font Family">Font Family</label>
                <Form.Group className="select-field-block-cust">
                  <Form.Select
                    aria-label="Floating label select example"
                    value={
                      _this.state.generalSetting &&
                      _this.state.generalSetting.font_family
                    }
                    onChange={(e) => {
                      let temp = _this.state.generalSetting;
                      temp.font_family = e.target.value;
                      _this.setState(
                        {
                          generalSetting: temp,
                        },
                        () => {
                          this.refreshFontFamily();
                        }
                      );
                    }}
                  >
                    <option value={""}>select..</option>
                    {fontFamilyList.map((prop) => {
                      return <option value={prop}>{prop}</option>;
                    })}
                  </Form.Select>
                </Form.Group>
                <div className="errorMsg">
                  {_this.validator.message(
                    "Font Family",
                    _this.state.generalSetting.font_family,
                    "required"
                  )}
                </div>
              </div>
              <div>
                <label htmlFor="Font Family">Font Size</label>
                <InputGroup className="inc-desc-field-block-cust">
                  <button
                    className="btn btn-outline-secondary btn-minus"
                    type="button"
                    disabled={_this.state.generalSetting.font_size === 0}
                    onClick={() => {
                      let newObj = _this.state.generalSetting;
                      if (parseInt(newObj.font_size) > 0) {
                        newObj.font_size = parseInt(newObj.font_size) - 1;
                        _this.setState(
                          {
                            generalSetting: newObj,
                          },
                          () => {
                            this.refreshFontStyle();
                          }
                        );
                      }
                    }}
                  >
                    <RemoveIcon />
                  </button>
                  <FormControl
                    type="number"
                    value={_this.state.generalSetting.font_size}
                  />
                  <button
                    className="btn btn-outline-secondary btn-minus"
                    type="button"
                    onClick={() => {
                      let newObj = _this.state.generalSetting;
                      if (parseInt(newObj.font_size) >= 0) {
                        newObj.font_size = parseInt(newObj.font_size) + 1;
                        _this.setState(
                          {
                            generalSetting: newObj,
                          },
                          () => {
                            this.refreshFontStyle();
                          }
                        );
                      }
                    }}
                  >
                    <AddIcon />
                  </button>
                </InputGroup>
              </div>
            </div>
            <hr />
            <div className="weight">
              <div className="block">
                <p>Font Weight</p>
                <span>Make as bolds reprehenderit in voluptate velit</span>
              </div>
              <span className="switch-btn-cust">
                <input
                  type="checkbox"
                  id="switch"
                  value={
                    _this.state.generalSetting.font_weight == 0 ? false : true
                  }
                  checked={
                    _this.state.generalSetting.font_weight == 0 ? false : true
                  }
                  onChange={(e) => {
                    var newObj = _this.state.generalSetting;
                    newObj.font_weight = newObj.font_weight == 0 ? 1 : 0;
                    _this.setState(
                      {
                        generalSetting: newObj,
                      },
                      () => {
                        this.refreshFontStyle();
                      }
                    );
                  }}
                />
                <label htmlFor="switch">Toggle</label>
              </span>
            </div>
          </div>

          <div className="dates_component">
            <label htmlFor="Chat Message">Settings</label>
            <div>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  label="Progress Bar"
                  value={
                    _this.state.generalSetting.progress_bar === 0 ? false : true
                  }
                  checked={
                    _this.state.generalSetting.progress_bar === 0 ? false : true
                  }
                  onChange={(e) => {
                    var newObj = _this.state.generalSetting;
                    newObj.progress_bar = newObj.progress_bar === 0 ? 1 : 0;
                    _this.setState(
                      {
                        generalSetting: newObj,
                      },
                      () => {
                        this.refreshGeneralStyle();
                      }
                    );
                  }}
                />
              </Form.Group>
              <p className="date_text">
                <div className="mt-3 opacity-50">
                  {/* <Form.Group controlId="formBasicCheckbox">
                    <Form.Check type="checkbox" label="Progress Bar Color" />
                  </Form.Group> */}

                  <div className="simple">
                    <Button variant="text" onClick={this.handleHeaderText}>
                      <div
                        className="preview-color-block"
                        style={
                          _this.state.generalSetting.progress_bar_color ===
                            "" ||
                          (_this.state.setProcessBarColor &&
                            _this.state.setProcessBarColor.style)
                            ? {
                                background:
                                  _this.state.setProcessBarColor.style,
                                backgroundColor:
                                  _this.state.setProcessBarColor.style,
                              }
                            : {
                                background:
                                  _this.state.generalSetting.progress_bar_color,
                                backgroundColor:
                                  _this.state.generalSetting.progress_bar_color,
                              }
                        }
                      ></div>
                      Progress Bar Color
                    </Button>
                  </div>

                  {/* <p className="date_text">
                    
                  </p> */}
                </div>
              </p>
              <hr />
              <div className="weight">
                <div className="block">
                  <p>Chat Branding</p>
                  {/* <span>Make as bolds reprehenderit in voluptate velit</span> */}
                </div>
                <span className="switch-btn-cust">
                  <input
                    type="checkbox"
                    id="switch2"
                    value={
                      _this.state.generalSetting.weconnect_chat_branding == 0
                        ? false
                        : true
                    }
                    checked={
                      _this.state.generalSetting.weconnect_chat_branding == 0
                        ? false
                        : true
                    }
                    onChange={(e) => {
                      var newObj = _this.state.generalSetting;
                      newObj.weconnect_chat_branding =
                        newObj.weconnect_chat_branding == 0 ? 1 : 0;
                      _this.setState(
                        {
                          generalSetting: newObj,
                        },
                        () => {
                          this.refreshGeneralStyle();
                        }
                      );
                    }}
                  />
                  <label htmlFor="switch2">Toggle</label>
                </span>
              </div>
            </div>
          </div>

          <div className="edit-card-section">
            <label htmlFor="Edit Card">Landing Page Background</label>
            {/* <label htmlFor="Edit Card">Design / Landing Page / General</label> */}
            <div className="edit-card-block">
              <div className="color-block">
                <label htmlFor="COLORS">COLORS</label>
                <div>
                  <div className="simple">
                    <Button variant="text" onClick={this.handleSolidClick}>
                      <div
                        className="preview-color-block"
                        style={
                          _this.state.generalSetting.bg_color === "" ||
                          _this.state.isSolidColor ||
                          _this.state.isGradientColor
                            ? {
                                background: _this.state.setSolidColor.style,
                                backgroundColor:
                                  _this.state.setSolidColor.style,
                              }
                            : {
                                background: _this.state.generalSetting.bg_color,
                                backgroundColor:
                                  _this.state.generalSetting.bg_color,
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
                          _this.state.generalSetting.bg_start === "" ||
                          _this.state.isGradientColor
                            ? {
                                background: _this.state.setGradientColor.style,
                                backgroundColor:
                                  _this.state.setGradientColor.style,
                              }
                            : {
                                background: _this.state.generalSetting.bg_start,
                                backgroundColor:
                                  _this.state.generalSetting.bg_start,
                              }
                        }
                      ></div>
                      Gradient Color
                    </Button>
                  </div>
                </div>
              </div>
              <div className="upload-image-block">
                <label htmlFor="UPLOAD IMAGE">UPLOAD IMAGE</label>
                <div className="preview-upload">
                  <div className="preview">
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
                          _this.handleFileChange(e.target.files);
                        }}
                      />
                      <Button variant="contained" component="span">
                        Choose file
                      </Button>
                    </label>
                  </div>
                </div>
              </div>

              <div className="upload-image-block upload-video-block">
                <label htmlFor="UPLOAD IMAGE">UPLOAD VIDEO</label>
                <div className="preview-upload">
                  <div className="preview">
                    {this.state.setVideo === null ? (
                      <img src={video} alt="" />
                    ) : (
                      <video width="100" controls>
                        <source src={_this.state.setVideo} id="video_here" />
                        Your browser does not support HTML5 video.
                      </video>
                    )}
                  </div>
                  <div className="upload">
                    <label htmlFor="contained-button-file">
                      <label htmlFor="files">
                        <Button variant="contained" component="span">
                          Choose file
                        </Button>
                      </label>
                      <input
                        id="files"
                        style={{ display: "none" }}
                        type="file"
                        accept="video/mp4,video/x-m4v,video/*"
                        onChange={(e) => {
                          _this.handleFileChange(e.target.files);
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <Divider />
              <div className="default-block">
                <div className="text-block">
                  <p>Default</p>
                  <span>On clicking, appearance will be set to default.</span>
                </div>
                <div className="btn-block">
                  <Button variant="text" onClick={this.resetDefault}>
                    Default
                  </Button>
                </div>
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
        {/* solid color menu start */}
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
          anchorEl={this.state.showGradientColorModal}
          open={gradientOpen}
          onClose={this.handleGradientClose}
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
          anchorEl={this.state.showProcessBarColorModal}
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
              color={this.state.setProcessBarColor}
            />
          </div>
        </Menu>
      </Fragment>
    );
  }
}
