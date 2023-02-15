import React, { Component, Fragment } from 'react'
import {
  createLayoutMessage,
  getChartMessageList
} from "../../../server/BuilderDesignServer.js";
import {
  successAlert,
  warningAlert
} from "../../../../../../../../js/alerts.js";
import { AlertContext } from "../../../../../../../common/Alert";
import SimpleReactValidator from "simple-react-validator";
import { Button } from "@mui/material";

export default class MessageComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {}
    });
    this.state = {
      messages: {
        bot_id: props.botIdURL,
        title: "",
        sub_title: "",
        meta_title: "",
        meta_description: ""
      }
    };
  }

  componentDidMount() {
    let _this = this;
    _this.fetchDataFromServer();
  }

  fetchDataFromServer = () => {
    let _this = this;
    let params = `bot_id=${_this.props.botIdURL}`;
    getChartMessageList(
      params,
      (res) => {
        _this.setState({
          loading: false,
          messages: {
            bot_id: _this.props.botIdURL,
            title: res.title,
            sub_title: res.sub_title,
            meta_title: res.meta_title,
            meta_description: res.meta_description
          }
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
      let tempObj = _this.state.messages;
      // _this.props.handleLoadingShow(true);
      this.context.showLoading();
      createLayoutMessage(
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
            activeEmbedTab: 1
          });
          //  setTimeout(() => {
          //  }, 3000);
        },
        (res) => {
          this.context.showAlert({
            type: "error",
            message: res.message
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

  setTitle = ()=>{
    if (window.WeConnect && window.WeConnect.render) {
      window.WeConnect.webchatRef.current.setSettingsChat({
        title: this.state.messages.title,
        sub_title: this.state.messages.sub_title,
        // following parameters have no effect on design preview
        // meta_title,
        // meta_description
      });
    }
  }

  handleInputChange = (e) => {
    let _this = this;
    var newObj = _this.state.messages;
    newObj[e.target.name] = e.target.value;
    _this.setState({ messages: newObj },()=>{
      this.setTitle();
    });
  };
  render() {
    let _this = this;
    return (
      <Fragment>
        <div className="main-section design_header_block">
          <div>
            <label>Content</label>
            <div className="header_inputs">
              <input
                type="text"
                placeholder="Title"
                name="title"
                value={_this.state.messages && _this.state.messages.title}
                onChange={this.handleInputChange}
              />
              <div className="errorMsg">
                {_this.validator.message(
                  "title",
                  _this.state.messages && _this.state.messages.title,
                  "required"
                )}
              </div>
              <input
                type="text"
                placeholder="Subtitle"
                name="sub_title"
                value={_this.state.messages && _this.state.messages.sub_title}
                onChange={this.handleInputChange}
              />
              <div className="errorMsg">
                {_this.validator.message(
                  "Subtitle",
                  _this.state.messages && _this.state.messages.sub_title,
                  "required"
                )}
              </div>
              <input
                type="text"
                placeholder="Meta Title"
                name="meta_title"
                value={_this.state.messages && _this.state.messages.meta_title}
                onChange={this.handleInputChange}
              />
              <input
                type="text"
                placeholder="Meta Description"
                name="meta_description"
                value={
                  _this.state.messages && _this.state.messages.meta_description
                }
                onChange={this.handleInputChange}
              />
              <div className="errorMsg">
                {_this.validator.message(
                  "Meta Description",
                  _this.state.messages && _this.state.messages.meta_description,
                  "required"
                )}
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
                  activeEmbedTab: 1
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
      </Fragment>
    );
  }
}
