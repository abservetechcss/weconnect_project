import React, { Component, Fragment } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField
} from "@mui/material";
import "react-multi-email/style.css";
import SimpleReactValidator from "simple-react-validator";

import {
  getDataManagementList,
  createDataManagement
} from "../server/DataManagementServer";
import {
  successAlert
} from "../../../../../../js/alerts.js";

export class DataManagementComponent extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {}
    });
    this.state = {
      emails: [],
      dataManagement: {
        key_for_ipaddress: "",
        key_for_pageaddress: "",
        method: "",
        savedata_on_other_server: false,
        savedata_on_our_server: false,
        webhook_url: ""
      },
      questions:[],
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
    getDataManagementList(
      params,
      (res) => {
        let temp = res.datemanagement;
        temp.savedata_on_other_server = (temp.savedata_on_other_server === 1 ? true : false);
            temp.savedata_on_our_server =
          temp.savedata_on_our_server === 1 ? true : false;
        let newObj = [];
        newObj = res.questions && res.questions.length > 0 && res.questions.map(prop => {
          var parser = new DOMParser();
          prop.key = parser.parseFromString(`${prop.key}`, "text/html");
          return prop;
        })
        _this.setState({
          dataManagement: temp,
          questions: newObj
        });

      },
      () => {
      
      }
    );
  };
  onSubmit = () => {
    let _this = this;
    let params = `botid=${_this.props.botIdURL}`;
    let newObj = {};
    let temp = _this.state.dataManagement;
    newObj.savedataonotherserver = temp.savedata_on_other_server ? 1 : 0;
    newObj.savedataonourserver = temp.savedata_on_our_server ? 1 : 0;
    newObj.webhookurl = temp.webhook_url;
    newObj.webhookmethod = temp.method;
    newObj.webhookipkey = temp.key_for_ipaddress;
    newObj.webhookpagekey = temp.key_for_pageaddress;
    if (_this.state.questions && _this.state.questions.length > 0) {
      _this.state.questions.map((prop, key) => {
        newObj[prop.name] = prop.value;
      })
    }
      newObj.questions = _this.state.questions;
    if (_this.validator.allValid()) {
      _this.props.handleLoadingShow(true);
      createDataManagement(
        params,
        newObj,
        (res) => {
          _this.props.handleLoadingShow(false);
          successAlert("Updated Successfully!", _this.props.superThis);
          _this.fetchDataFromServer();
          _this.props.selectActiveTab(6);
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
    var newObj = _this.state.dataManagement;
    newObj[e.target.name] = e.target.value;
    _this.setState({ dataManagement: newObj });
  };
  render() {
    let _this = this;
    return (
      <Fragment>
        <div className="right-block">
          <div className="header">
            <p className="heading">Data management</p>
            <p className="desc">
              On which server do you want to store the responses
            </p>
          </div>
          <div className="main-block data_block">
            <div className="basic-acc-block">
              <div className="availability_box data_server_box">
                <Form.Check
                  type="radio"
                  aria-label="radio 1"
                  value={_this.state.dataManagement.savedata_on_our_server}
                  checked={_this.state.dataManagement.savedata_on_our_server}
                  id="savedata_on_other_server"
                  onChange={(e) => {
                    var newObj = _this.state.dataManagement;
                    newObj.savedata_on_our_server = true;
                    newObj.savedata_on_other_server = false;
                    _this.setState({
                      dataManagement: newObj
                    });
                  }}
                />
                <div className="avail_box">
                  <p className="availability_title">Save data on our server</p>
                  <p className="availability_text">
                    You can save responses on Weconnect server
                  </p>
                </div>
              </div>
              <div className="availability_box">
                <Form.Check
                  type="radio"
                  aria-label="radio 1"
                  id="savedata_on_other_server"
                  value={_this.state.dataManagement.savedata_on_other_server}
                  checked={_this.state.dataManagement.savedata_on_other_server}
                  onChange={(e) => {
                    var newObj = _this.state.dataManagement;
                    newObj.savedata_on_our_server = false;
                    newObj.savedata_on_other_server = true;
                    _this.setState({
                      dataManagement: newObj
                    });
                  }}
                />
                <div className="avail_box">
                  <p className="availability_title">
                    Save data on other server
                  </p>
                  <p className="availability_text">
                    You can save responses on other server
                  </p>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <input
                        type="text"
                        placeholder="Web hook URL"
                        className="data_inputs"
                        name="webhook_url"
                        value={
                          _this.state.dataManagement &&
                          _this.state.dataManagement.webhook_url
                        }
                        onChange={this.handleInputChange}
                      />
                      <div className="errorMsg">
                        {_this.validator.message(
                          "Web hook URL",
                          _this.state.dataManagement &&
                            _this.state.dataManagement.webhook_url,
                          "required|url"
                        )}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <input
                        type="text"
                        placeholder="Method"
                        className="data_inputs"
                        name="method"
                        value={
                          _this.state.dataManagement &&
                          _this.state.dataManagement.method
                        }
                        onChange={this.handleInputChange}
                      />
                      <div className="errorMsg">
                        {_this.validator.message(
                          "method",
                          _this.state.dataManagement &&
                            _this.state.dataManagement.method,
                          "required"
                        )}
                      </div>
                    </Grid>
                    <Grid item xs={6}>
                      <input
                        type="text"
                        placeholder="Key for IP address"
                        className="data_inputs"
                        name="key_for_ipaddress"
                        value={
                          _this.state.dataManagement &&
                          _this.state.dataManagement.key_for_ipaddress
                        }
                        onChange={this.handleInputChange}
                      />
                      <div className="errorMsg">
                        {_this.validator.message(
                          "IP address",
                          _this.state.dataManagement &&
                            _this.state.dataManagement.key_for_ipaddress,
                          "required"
                        )}
                      </div>
                    </Grid>{" "}
                    <Grid item xs={6}>
                      <input
                        type="text"
                        placeholder="Key for page address"
                        className="data_inputs"
                        name="key_for_pageaddress"
                        value={
                          _this.state.dataManagement &&
                          _this.state.dataManagement.key_for_pageaddress
                        }
                        onChange={this.handleInputChange}
                      />
                      <div className="errorMsg">
                        {_this.validator.message(
                          "page address",
                          _this.state.dataManagement &&
                            _this.state.dataManagement.key_for_pageaddress,
                          "required"
                        )}
                      </div>
                    </Grid>
                    {_this.state.questions &&
                      _this.state.questions.length > 0 &&
                      _this.state.questions.map((prop, index) => {
                        return (
                          <Grid item xs={6}>
                            <input
                              type="text"
                              placeholder={`${prop.key}`}
                              className="data_inputs"
                              value={prop.value}
                              onChange={(e) => {
                                let temp = _this.state.questions;
                                temp[index].value = e.target.value;
                                _this.setState({
                                  questions:temp
                                })
                              }}
                            />
                          </Grid>
                        );
                      })}
                  
                  </Grid>
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

export default DataManagementComponent;
