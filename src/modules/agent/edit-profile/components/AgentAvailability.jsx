import React, { Component, Fragment } from "react";
import { Button, TextField } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {
  getAvailabilityList,
  updateAvailability,
} from "../server/EditProfileServer.js";
import SimpleReactValidator from "simple-react-validator";
import { successAlert } from "../../../../js/alerts";
export default class AgentAvailability extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {
        email: "Invalid email address",
      },
    });
    this.state = {
      time: null,
      availability: {
        agent_available_checkbox: 0,
        agent_available_time_checkbox: 0,
        agent_available_time_from: null,
        agent_available_time_to: null,
      },
    };
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    _this.fetchDataFromServer();
  }

  fetchDataFromServer = () => {
    let _this = this;
    getAvailabilityList(
      "",
      (res) => {
        let temp = res.availability;
        _this.setState({
          availability: temp,
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
    let tempObj = JSON.parse(JSON.stringify(_this.state.availability));

    if (_this.validator.allValid()) {
      _this.props.handleLoadingShow(true);
      updateAvailability(
        tempObj,
        (res) => {
          _this.props.handleLoadingShow(false);
          successAlert("Availability Updated Successfully!", _this.props._this);
          _this.fetchDataFromServer();
          _this.props.selectActiveTab(1);
        },
        (res) => {
          _this.props.handleLoadingShow(false);
        }
      );
    } else {
      _this.validator.showMessages();
      this.forceUpdate();
    }
  };
  handleInputChange = (e) => {
    var newObj = this.state.availability;
    newObj[e.target.name] = e.target && e.target.value;
    this.setState({ availability: newObj });
  };
  render() {
    let _this = this;
    return (
      <Fragment>
        <div className="right-block">
          <div className="header">
            <p className="heading">Availability</p>
            <p className="desc">Set your preferred availability</p>
          </div>
          <div className="main-block">
            <div className="basic-acc-block">
              <div className="availability_box">
                <input
                  type="checkbox"
                  value={
                    _this.state.availability.agent_available_checkbox == 0
                      ? false
                      : true
                  }
                  checked={
                    _this.state.availability.agent_available_checkbox == 0
                      ? false
                      : true
                  }
                  onChange={(e) => {
                    var newObj = _this.state.availability;
                    newObj.agent_available_checkbox =
                      newObj.agent_available_checkbox == 0 ? 1 : 0;
                    _this.setState({
                      availability: newObj,
                    });
                  }}
                ></input>
                <div>
                  <p className="availability_title">
                    Set me Available while using mobile or desktop App
                  </p>
                  {/* <p className="availability_text">
                    
                  </p> */}
                </div>
              </div>
            </div>
            <div className="basic-acc-block">
              <div className="availability_box">
                <input
                  type="checkbox"
                  value={
                    _this.state.availability.agent_available_time_checkbox == 0
                      ? false
                      : true
                  }
                  checked={
                    _this.state.availability.agent_available_time_checkbox == 0
                      ? false
                      : true
                  }
                  onChange={(e) => {
                    var newObj = _this.state.availability;
                    newObj.agent_available_time_checkbox =
                      newObj.agent_available_time_checkbox == 0 ? 1 : 0;
                    _this.setState({
                      availability: newObj,
                    });
                  }}
                ></input>
                <div>
                  <p className="availability_title">Availability time</p>
                  {/* <p className="availability_text">
                    
                  </p> */}
                  <div className="availability_time">
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        label="From"
                        value={
                          _this.state.availability &&
                          _this.state.availability.agent_available_time_from
                        }
                        onChange={(newValue) => {
                          let temp = _this.state.availability;
                          temp.agent_available_time_from = newValue;
                          this.setState({ availability: temp });
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        label="To"
                        value={
                          _this.state.availability &&
                          _this.state.availability.agent_available_time_to
                        }
                        onChange={(newValue) => {
                          let temp = _this.state.availability;
                          temp.agent_available_time_to = newValue;
                          this.setState({ availability: temp });
                        }}
                        renderInput={(params) => <TextField {...params} />}
                      />
                    </LocalizationProvider>
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
