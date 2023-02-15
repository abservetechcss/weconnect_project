import React, { Component, Fragment } from "react";
import { Button, Grid, MenuItem, Menu, Tab, Box } from "@mui/material";
import img1 from "../../../../../../../../assets/images/design/Group 20341.png";
import img2 from "../../../../../../../../assets/images/design/Group 20342.png";
import img3 from "../../../../../../../../assets/images/design/Group 20343.png";
import {
  createLayoutPosition,
  getLayoutPositionList,
} from "../../../server/BuilderDesignServer.js";
import { AlertContext } from "../../../../../../../common/Alert";
import SimpleReactValidator from "simple-react-validator";

export default class LayoutComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {},
    });
    this.state = {
      designLayout: {
        type: "widget",
        bot_id: props.botIdURL,
        position: "",
      },
    };
  }
  componentDidMount() {
    let _this = this;
    _this.fetchDataFromServer();
  }

  fetchDataFromServer = () => {
    let _this = this;
    let params = `type=widget&bot_id=${_this.props.botIdURL}`;
    getLayoutPositionList(
      params,
      (res) => {
        _this.setState({
          loading: false,
          designLayout: {
            type: "widget",
            bot_id: _this.props.botIdURL,
            position: res.position,
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
      let tempObj = _this.state.designLayout;
      // _this.props.handleLoadingShow(true);
      this.context.showLoading();
      createLayoutPosition(
        _this.props.super_this,
        tempObj,
        (res) => {
          // _this.props.handleLoadingShow(false);
          // successAlert("Updated Successfully!", _this.props.super_this);
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

  setPosition = (position) => {
    if (window.WeConnect && window.WeConnect.render) {
      window.WeConnect.webchatRef.current.updateChatSettings({
        position: position,
      });
      window.WeConnect.webchatRef.current.openWebchat();
    }
  };
  render() {
    let _this = this;
    return (
      <Fragment>
        <div className="main-section desing_section">
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <img
                src={img1}
                alt=""
                style={
                  _this.state.designLayout.position === "right"
                    ? {
                        border: "1px solid #019F9C",
                        borderRadius: "6px",
                      }
                    : null
                }
                role="button"
                onClick={() => {
                  let temp = _this.state.designLayout;
                  temp.position = "right";
                  _this.setState({
                    designLayout: temp,
                  });
                  this.setPosition("right");
                  _this.props.super_this.setState({
                    isHeaderTabActive: true,
                    headerMessage: "Widget / Layout",
                    activeWidgetTab: 2,
                    widgetLayout: 1,
                  });
                }}
              />
            </Grid>
            <Grid item xs={6}>
              <img
                src={img2}
                alt=""
                style={
                  _this.state.designLayout.position === "center"
                    ? {
                        border: "1px solid #019F9C",
                        borderRadius: "6px",
                      }
                    : null
                }
                role="button"
                onClick={() => {
                  let temp = _this.state.designLayout;
                  temp.position = "center";
                  _this.setState({
                    designLayout: temp,
                  });
                  this.setPosition("center");
                  _this.props.super_this.setState({
                    isHeaderTabActive: true,
                    headerMessage: "Widget / Layout",
                    activeWidgetTab: 2,
                    widgetLayout: 2,
                  });
                }}
              />
            </Grid>{" "}
            <Grid item xs={6}>
              <img
                src={img3}
                alt=""
                style={
                  _this.state.designLayout.position === "left"
                    ? {
                        border: "1px solid #019F9C",
                        borderRadius: "6px",
                      }
                    : null
                }
                role="button"
                onClick={() => {
                  let temp = _this.state.designLayout;
                  temp.position = "left";
                  _this.setState({
                    designLayout: temp,
                  });
                  this.setPosition("left");
                  _this.props.super_this.setState({
                    isHeaderTabActive: true,
                    headerMessage: "Widget / Layout",
                    activeWidgetTab: 2,
                    widgetLayout: 3,
                  });
                }}
              />
            </Grid>
            <div className="errorMsg">
              {_this.validator.message(
                "design layout",
                _this.state.designLayout.position,
                "required"
              )}
            </div>
          </Grid>
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
      </Fragment>
    );
  }
}
