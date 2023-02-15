import React, { Component, Fragment } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import { Button } from "@mui/material";
import TimezoneSelect, { allTimezones } from "react-timezone-select";
import spacetime from "spacetime";
import SimpleReactValidator from "simple-react-validator";

import {
  getGeneralSetupList,
  createGeneralSetup,
} from "../server/SettingServer.js";
import { warningAlert, successAlert } from "../../../../../../js/alerts.js";
export class GeneralSetupComponent extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {},
    });
    this.state = {
      setting: {
        botName: "",
        enableBot: false,
        enableGdpr: false,
        gdprText: "",
        metaTitle: "",
        timeZone: "",
      },
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
      datetime: spacetime.now(),
      stringCount: 0,
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
    getGeneralSetupList(
      params,
      (res) => {
        let temp = res.generalsetup;
        _this.setState({
          setting: {
            botName: temp.botname,
            enableBot: temp.enablebot === 1 ? true : false,
            enableGdpr: temp.enablegdpr === 1 ? true : false,
            gdprText: temp.gdprtext,
            metaTitle: temp.metatitle,
            timeZone: temp.timezone,
          },
        });
        _this.props._this.setState({ loading: false });
      },
      () => {
        _this.props._this.setState({ loading: false });
      }
    );
  };
  onSubmit = () => {
    let _this = this;
    let params = `botid=${_this.props.botIdURL}`;
    let newObj = _this.state.setting;
    let tempObj = {};
    tempObj.enablebot = newObj.enableBot ? 1 : 0;
    tempObj.enablegdpr = newObj.enableGdpr ? 1 : 0;
    if (typeof newObj.timeZone === "string") {
      tempObj.timezone = newObj.timeZone;
    } else {
      tempObj.timezone = newObj.timeZone && newObj.timeZone.value;
    }
    tempObj.botname = newObj.botName;
    tempObj.metatitle = newObj.metaTitle;
    tempObj.gdprtext = newObj.gdprText;

    if (_this.validator.allValid()) {
      _this.props.handleLoadingShow(true);
      createGeneralSetup(
        params,
        tempObj,
        (res) => {
          _this.props.handleLoadingShow(false);
          successAlert("Updated Successfully!", _this.props.superThis);
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
    var newObj = _this.state.setting;
    newObj[e.target.name] = e.target.value;
    _this.setState({ setting: newObj });
  };
  render() {
    let _this = this;
    return (
      <Fragment>
        <div className="right-block">
          <div className="header">
            <p className="heading">General Setup</p>
            <p className="desc">Configure basic settings</p>
          </div>
          <div className="main-block">
            <p className="general_title">Main Settings</p>
            <p className="general_text">Adjust configurations of your bot</p>
            <div className="basic-acc-block">
              <div className="availability_box">
                <input
                  type="checkbox"
                  name=""
                  value={_this.state.setting.enableBot}
                  checked={_this.state.setting.enableBot}
                  onChange={(e) => {
                    var newObj = _this.state.setting;
                    newObj.enableBot = !newObj.enableBot;
                    _this.setState({
                      setting: newObj,
                    });
                  }}
                ></input>
                <div style={{ width: "100%" }}>
                  <p className="availability_title">Enable Bot</p>
                  {/* <p className="availability_text">
                    
                  </p> */}
                  <div className="general_setup_inputs">
                    <FloatingLabel controlId="floatingSelect" label="Timezone">
                      <TimezoneSelect
                        value={_this.state.setting.timeZone}
                        onChange={(time) => {
                          var newObj = _this.state.setting;
                          newObj.timeZone = time;
                          _this.setState({
                            setting: newObj,
                          });
                        }}
                        timezones={{
                          ...allTimezones,
                          "America/Lima": "Pittsburgh",
                          "Europe/Berlin": "Frankfurt",
                        }}
                      />
                      <div className="errorMsg">
                        {_this.validator.message(
                          "Timezone",
                          _this.state.setting && _this.state.setting.timeZone,
                          "required"
                        )}
                      </div>
                    </FloatingLabel>
                    <FloatingLabel
                      controlId="floatingPassword"
                      label="Enter bot name"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Bot name"
                        label="Bot name"
                        name="botName"
                        value={
                          _this.state.setting && _this.state.setting.botName
                        }
                        onChange={this.handleInputChange}
                      />
                      <div className="errorMsg">
                        {_this.validator.message(
                          "bot name",
                          _this.state.setting && _this.state.setting.botName,
                          "required"
                        )}
                      </div>
                    </FloatingLabel>
                    <FloatingLabel
                      style={{ marginBottom: "16px" }}
                      controlId="floatingPassword"
                      label="Enter Title"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Enter Title"
                        name="metaTitle"
                        value={
                          _this.state.setting && _this.state.setting.metaTitle
                        }
                        onChange={this.handleInputChange}
                      />
                      <div className="errorMsg">
                        {_this.validator.message(
                          "title",
                          _this.state.setting && _this.state.setting.metaTitle,
                          "required"
                        )}
                      </div>
                    </FloatingLabel>
                  </div>
                </div>
              </div>
            </div>
            <p className="general_title">Data Protection</p>
            <p className="general_text">
              Setup compliance policies like GDPR, HIPAA etc.
            </p>
            <div className="basic-acc-block">
              <div className="compliance_input">
                <label>GDRP Compliance</label>
                <textarea
                  name="gdprText"
                  value={_this.state.setting && _this.state.setting.gdprText}
                  onChange={(e) => {
                    let temp = _this.state.setting;
                    let count = e.target.value && e.target.value.length;
                    if (count <= 200) {
                      temp.gdprText = e.target.value;
                      _this.setState({
                        setting: temp,
                        stringCount: count,
                      });
                    } else {
                      warningAlert(
                        "enter only 200 character in the input box",
                        _this.props._this
                      );
                    }
                  }}
                ></textarea>
                <label className="left_text">
                  {_this.state.stringCount} characters left
                </label>
              </div>
              <div className="availability_box">
                <input
                  type="checkbox"
                  value={_this.state.setting.enableGdpr}
                  checked={_this.state.setting.enableGdpr}
                  onChange={(e) => {
                    var newObj = _this.state.setting;
                    newObj.enableGdpr = !newObj.enableGdpr;
                    _this.setState({
                      setting: newObj,
                    });
                  }}
                ></input>
                <div>
                  <p className="availability_title">Enable compliance pop up</p>
                  {/* <p className="availability_text">
                    
                  </p> */}
                  <div className="availability_time"></div>
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

export default GeneralSetupComponent;
