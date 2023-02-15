import React, { Component, Fragment } from "react";
import {
  Button,
} from "@mui/material";
import SimpleReactValidator from "simple-react-validator";
import {
  getTrackersList,
  createTrackers
} from "../server/TrackersServer";
import {
  successAlert
} from "../../../../../../js/alerts.js";
export class TrackersComponent extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {}
    });
    this.state = {
      tracker: {
        tracking_google_id:"",
        tracking_facebook_id:"",
      }
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
    getTrackersList(
      params,
      (res) => {
        let temp = res.trackers;
        _this.setState({
          tracker: temp
        });
      },
      () => {
        _this.props._this.setState({ loading: false });
      }
    );
  };
  onSubmit = () => {
    let _this = this;
    let params = `botid=${_this.props.botIdURL}`;
    let tempObj = _this.state.tracker;
    if (_this.validator.allValid()) {
      _this.props.handleLoadingShow(true);
      createTrackers(
        params,
        tempObj,
        (res) => {
          _this.props.handleLoadingShow(false);
          successAlert("Updated Successfully!", _this.props.superThis);
          _this.fetchDataFromServer();
          _this.props.selectActiveTab(7);
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
    var newObj = _this.state.tracker;
    newObj[e.target.name] = e.target.value;
    _this.setState({ tracker: newObj });
  };
  render() {
    let _this = this;
    return (
      <Fragment>
        <div className="right-block">
          <div className="header">
            <p className="heading">Trackers</p>
            <p className="desc">
              Track the performance of your conversational interface on google
              analytics or the Facebook pixel
            </p>
          </div>
          <div className="main-block ">
            <div className="basic-acc-block">
              <p className="sync_title">Google analytics</p>
              <p className="sync_text">Setup google anlytics tracker</p>
              <input
                className="trackers_input"
                type="text"
                placeholder="Google Analytics ID"
                name="tracking_google_id"
                value={
                  _this.state.tracker && _this.state.tracker.tracking_google_id
                }
                onChange={this.handleInputChange}
              />
              <div className="errorMsg">
                {_this.validator.message(
                  "google analytics id",
                  _this.state.tracker && _this.state.tracker.tracking_google_id,
                  "required"
                )}
              </div>
            </div>
            <div className="basic-acc-block">
              <p className="sync_title">Facebook analytics</p>
              <p className="sync_text">Setup Facebook pixel tracker</p>
              <input
                className="trackers_input"
                type="text"
                placeholder="Facebook Pixel ID"
                name="tracking_facebook_id"
                value={
                  _this.state.tracker &&
                  _this.state.tracker.tracking_facebook_id
                }
                onChange={this.handleInputChange}
              />
              <div className="errorMsg">
                {_this.validator.message(
                  "facebook pixel id",
                  _this.state.tracker &&
                    _this.state.tracker.tracking_facebook_id,
                  "required"
                )}
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

export default TrackersComponent;
