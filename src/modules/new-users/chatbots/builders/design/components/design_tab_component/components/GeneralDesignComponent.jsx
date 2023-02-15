import React, { Component, Fragment } from "react";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Button, Divider, Menu } from "@mui/material";
import { ColorPicker } from "react-color-gradient-picker";
import { fontFamilyList } from "../../../../../../../../variables/appVariables.jsx";

import {
  createGeneralLanding,
  getGeneralSettingList,
} from "../../../server/BuilderDesignServer.js";
import { AlertContext } from "../../../../../../../common/Alert";
import SimpleReactValidator from "simple-react-validator";
const textColor = {
  red: 159,
  green: 22,
  blue: 237,
  alpha: 1,
};
export default class GeneralDesignComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {},
    });
    this.state = {
      showProcessBarColorModal: null,
      generalSetting: {
        type: "widget",
        bot_id: props.botIdURL,
        font_family: "",
        font_size: 0,
        font_weight: 0,
        progress_bar: 0,
        weconnect_chat_branding: 0,
        bg_type: "",
        bg_start: "",
        bg_color: "",
        bg_image: "",
      },
      type: "",
      setProcessBarColor: textColor,
    };
  }
  componentDidMount() {
    let _this = this;
    _this.fetchDataFromServer();
  }

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
          fontFamily: fontFamily,
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

  fetchDataFromServer = () => {
    let _this = this;
    let params = `type=widget&bot_id=${_this.props.botIdURL}`;
    getGeneralSettingList(
      params,
      (res) => {
        _this.setState({
          loading: false,
          type: res.bg_type,
          generalSetting: {
            type: "widget",
            progress_bar_color: res.progress_bar_color,
            bot_id: _this.props.botIdURL,
            font_family: res.font_family,
            font_size: res.font_size === "" ? 0 : res.font_size,
            font_weight: res.font_weight,
            progress_bar:
              res.progress_bar === 0 || res.progress_bar === null ? 0 : 1,
            weconnect_chat_branding: res.weconnect_chat_branding,
          },
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
      let tempObj = JSON.parse(JSON.stringify(_this.state.generalSetting));
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
          //  _this.fetchDataFromServer();
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
  render() {
    let _this = this;
    const headerTextOpen = Boolean(_this.state.showProcessBarColorModal);

    return (
      <Fragment>
        <div className="main-section general-block">
          <label htmlFor="Text">Text</label>
          <div className="border-block border">
            <div className="font-controler">
              <div className="family">
                <label htmlFor="Font Family">Font Family1</label>
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
                    _this.state.generalSetting.progress_bar == 0 ? false : true
                  }
                  checked={
                    _this.state.generalSetting.progress_bar == 0 ? false : true
                  }
                  onChange={(e) => {
                    var newObj = _this.state.generalSetting;
                    newObj.progress_bar = newObj.progress_bar == 0 ? 1 : 0;
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
        </div>
        <div className="knowledge_footer">
          <div className="btn_block">
            <Button
              role="button"
              onClick={() => {
                _this.props.super_this.fetchServerDesign();
                this.props.super_this.setState({
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
              onClick={() => {
                _this.onSubmit();
              }}
              type="button"
              className="save-btn"
            >
              Save
            </Button>
          </div>
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
        </div>
      </Fragment>
    );
  }
}
