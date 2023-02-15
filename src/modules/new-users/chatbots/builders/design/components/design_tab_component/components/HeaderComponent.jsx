import { Button, Menu } from "@mui/material";
import React, { Component, Fragment } from "react";
import { ColorPicker } from "react-color-gradient-picker";
import { Form } from "react-bootstrap";
import {
  createWidgetHeader,
  getWidgetHeaderSettingList,
} from "../../../server/BuilderDesignServer.js";
// import { successAlert } from "../../../../../../../../js/alerts.js";
import { AlertContext } from "../../../../../../../common/Alert";
import SimpleReactValidator from "simple-react-validator";

const textColor = {
  red: 159,
  green: 22,
  blue: 237,
  alpha: 1,
};

export default class HeaderComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {},
    });
    this.state = {
      showHeaderTextModal: null,
      showHeaderTextModal1: null,
      showHeaderTextModal2: null,
      headerSetting: {
        bot_id: props.botIdURL,
        bot_header_title: "",
        bot_header_subtitle: "",
        widget_online_status: "",
        widget_offline_status: "",
        isColorCheckBox: 0,
        isLineHeaderCheckBox: 0,
      },
      bg_header_color: "",
      bg_header_text_color: "",
      setHeaderColor: textColor,
      setHeaderTextColor: textColor,
      setSeparateHeaderColor: textColor,
    };
  }
  componentDidMount() {
    let _this = this;
    _this.fetchDataFromServer();
  }

  fetchDataFromServer = () => {
    let _this = this;
    let params = `bot_id=${_this.props.botIdURL}`;
    getWidgetHeaderSettingList(
      params,
      (res) => {
        _this.setState({
          loading: false,
          bg_header_color: res.header_color,
          bg_header_text_color: res.header_text_color,
          headerSetting: {
            bot_id: _this.props.botIdURL,
            bot_header_title: res.bot_header_title,
            bot_header_subtitle: res.bot_header_subtitle,
            widget_online_status: res.widget_online_status,
            widget_offline_status: res.widget_offline_status,
            isColorCheckBox: res.use_from_chatbox_checkbox,
            isLineHeaderCheckBox: 0,
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
      let tempObj = _this.state.headerSetting;
      tempObj.header_color = this.state.setHeaderColor.style
        ? this.state.setHeaderColor.style
        : this.state.bg_header_color;
      tempObj.header_text_color = this.state.setHeaderTextColor.style
        ? this.state.setHeaderTextColor.style
        : this.state.bg_header_text_color;
      tempObj.use_from_chatbox_checkbox =
        _this.state.headerSetting.isColorCheckBox;

      tempObj.header_separate_checkbox = 0;
      tempObj.header_separate_color = "rgb(0,0,0)";
      // _this.props.handleLoadingShow(true);
      this.context.showLoading();
      createWidgetHeader(
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
      // _this.setState({ loading: false });
      _this.validator.showMessages();
      this.forceUpdate();
    }
  };

  refreshHeader = () => {
    if (
      window.WeConnect &&
      window.WeConnect.webchatRef.current &&
      window.WeConnect.webchatRef.current.updateWebchatSettings
    ) {
      window.WeConnect.webchatRef.current.updateWebchatSettings({
        header: {
          title:
            this.state.headerSetting &&
            this.state.headerSetting.bot_header_title,
          subtitle:
            this.state.headerSetting &&
            this.state.headerSetting.bot_header_subtitle,
          online:
            this.state.headerSetting &&
            this.state.headerSetting.widget_online_status,
          offline:
            this.state.headerSetting &&
            this.state.headerSetting.widget_offline_status,
          style: {
            color: this.state.setHeaderTextColor.style,
            background: this.state.setHeaderColor.style,
          },
          headerSameChat: this.state.headerSetting.isColorCheckBox,
        },
      });
    }
  };

  handleHeaderTextModal = (event) => {
    this.setState({
      showHeaderTextModal: event.currentTarget,
    });
  };

  handleHeaderTextClose = () => {
    this.setState({
      showHeaderTextModal: null,
    });
  };
  onChangeHeaderText = (color) => {
    this.setState(
      {
        setHeaderColor: color,
        bg_header_color: "",
      },
      () => {
        this.refreshHeader();
      }
    );
  };
  handleHeaderTextModal1 = (event) => {
    this.setState({
      showHeaderTextModal1: event.currentTarget,
    });
  };

  handleHeaderTextClose1 = () => {
    this.setState({
      showHeaderTextModal1: null,
    });
  };
  onChangeHeaderText1 = (color) => {
    this.setState(
      {
        setHeaderTextColor: color,
        bg_header_text_color: "",
      },
      () => {
        this.refreshHeader();
      }
    );
  };
  handleHeaderTextModal2 = (event) => {
    this.setState({
      showHeaderTextModal2: event.currentTarget,
    });
  };

  handleHeaderTextClose2 = () => {
    this.setState({
      showHeaderTextModal2: null,
    });
  };
  onChangeHeaderText2 = (color) => {
    this.setState({ setSeparateHeaderColor: color }, () => {
      this.refreshHeader();
    });
  };
  handleInputChange = (e) => {
    let _this = this;
    var newObj = _this.state.headerSetting;
    newObj[e.target.name] = e.target.value;
    _this.setState({ headerSetting: newObj }, () => {
      this.refreshHeader();
    });
  };
  render() {
    const headerTextOpen = Boolean(this.state.showHeaderTextModal);
    const headerTextOpen1 = Boolean(this.state.showHeaderTextModal1);
    const headerTextOpen2 = Boolean(this.state.showHeaderTextModal2);
    let _this = this;
    return (
      <Fragment>
        <div className="main-section design_header_block">
          <div>
            <label>Title</label>
            <div className="header_inputs">
              <input
                type="text"
                placeholder="Header Title (Maximum 30 characters allowed)"
                name="bot_header_title"
                maxlength="30"
                value={
                  _this.state.headerSetting &&
                  _this.state.headerSetting.bot_header_title
                }
                onChange={this.handleInputChange}
              />
              <div className="errorMsg">
                {_this.validator.message(
                  "Header Title",
                  _this.state.headerSetting &&
                    _this.state.headerSetting.bot_header_title,
                  ""
                )}
              </div>
              <input
                type="text"
                placeholder="Header Subtitle (Maximum 78 characters allowed)"
                name="bot_header_subtitle"
                maxlength="78"
                value={
                  _this.state.headerSetting &&
                  _this.state.headerSetting.bot_header_subtitle
                }
                onChange={this.handleInputChange}
              />
              <input
                type="text"
                placeholder="Online Agent Status"
                name="widget_online_status"
                value={
                  _this.state.headerSetting &&
                  _this.state.headerSetting.widget_online_status
                }
                onChange={this.handleInputChange}
              />
              <input
                type="text"
                placeholder="Offline Agent Status"
                name="widget_offline_status"
                value={
                  _this.state.headerSetting &&
                  _this.state.headerSetting.widget_offline_status
                }
                onChange={this.handleInputChange}
              />
            </div>
          </div>

          <div className="edit-card-section">
            <label htmlFor="Edit Card">Color</label>
            <div className="edit-card-block">
              <div className="color-block">
                <Form.Group controlId="formBasicCheckbox">
                  <Form.Check
                    className="header_label"
                    type="checkbox"
                    label="USE FROM CHATBOX"
                    value={
                      _this.state.headerSetting.isColorCheckBox == 0
                        ? false
                        : true
                    }
                    checked={
                      _this.state.headerSetting.isColorCheckBox == 0
                        ? false
                        : true
                    }
                    onChange={(e) => {
                      var newObj = _this.state.headerSetting;
                      newObj.isColorCheckBox =
                        newObj.isColorCheckBox === 0 ? 1 : 0;
                      _this.setState(
                        {
                          headerSetting: newObj,
                        },
                        () => {
                          this.refreshHeader();
                        }
                      );
                    }}
                  />
                </Form.Group>
                <div>
                  <div className="simple">
                    <Button variant="text" onClick={this.handleHeaderTextModal}>
                      <div
                        className="preview-color-block header-color"
                        style={
                          this.state.bg_header_color !== ""
                            ? {
                                background: this.state.bg_header_color,
                                backgroundColor: this.state.bg_header_color,
                              }
                            : {
                                background: this.state.setHeaderColor.style,
                                backgroundColor:
                                  this.state.setHeaderColor.style,
                              }
                        }
                      ></div>
                      Header Color
                    </Button>
                  </div>

                  <div className="simple">
                    <Button
                      variant="text"
                      onClick={this.handleHeaderTextModal1}
                    >
                      <div
                        className="preview-color-block header-text"
                        style={
                          this.state.bg_header_text_color !== ""
                            ? {
                                background: this.state.bg_header_text_color,
                                backgroundColor:
                                  this.state.bg_header_text_color,
                              }
                            : {
                                background: this.state.setHeaderTextColor.style,
                                backgroundColor:
                                  this.state.setHeaderTextColor.style,
                              }
                        }
                      ></div>
                      Header Text Color
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="dates_component">
            <label htmlFor="Chat Message">Line Seperator</label>
            <div>
              <Form.Group controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  label="Header Line Separator"
                  value={
                    _this.state.headerSetting.isLineHeaderCheckBox == 0
                      ? false
                      : true
                  }
                  checked={
                    _this.state.headerSetting.isLineHeaderCheckBox == 0
                      ? false
                      : true
                  }
                  onChange={(e) => {
                    var newObj = _this.state.headerSetting;
                    newObj.isLineHeaderCheckBox =
                      newObj.isLineHeaderCheckBox == 0 ? 1 : 0;
                    _this.setState({
                      headerSetting: newObj
                    });
                  }}
                />
              </Form.Group>
              <p className="date_text">
                
                <div className="mt-3 ">
                  <div className="simple">
                    <Button
                      variant="text"
                      onClick={this.handleHeaderTextModal2}
                    >
                      <div
                        className="preview-color-block header-color"
                        style={{
                          background: this.state.setSeparateHeaderColor.style,
                          backgroundColor:
                            this.state.setSeparateHeaderColor.style
                        }}
                      ></div>
                      Header Separate Color
                    </Button>
                  </div>
                  <p className="date_text">
                    
                  </p>
                </div>
              </p>
            </div>
          </div> */}
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
          anchorEl={this.state.showHeaderTextModal}
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
              color={this.state.setHeaderColor}
            />
          </div>
        </Menu>
        {/* header text color menu end */}
        <Menu
          id="basic-menu"
          anchorEl={this.state.showHeaderTextModal1}
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
              color={this.state.setHeaderTextColor}
            />
          </div>
        </Menu>
        <Menu
          id="basic-menu"
          anchorEl={this.state.showHeaderTextModal2}
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
              color={this.state.setSeparateHeaderColor}
            />
          </div>
        </Menu>
      </Fragment>
    );
  }
}
