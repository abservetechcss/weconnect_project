import React, { Component, Fragment } from "react";
import img1 from "../../../../../../../assets/images/design/Group 20337.png";
import img2 from "../../../../../../../assets/images/design/Group 20338.png";
import img3 from "../../../../../../../assets/images/design/Group 20339.png";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { Form, FormControl, InputGroup } from "react-bootstrap";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import layout from "../../../../../../../assets/images/design/layout.svg";
import { Button, Grid, MenuItem, Menu, Tab, Box } from "@mui/material";
import arrow from "../../../../../../../assets/images/design/Path 48337.svg";
import edit from "../../../../../../../assets/images/design/edit.svg";
import book from "../../../../../../../assets/images/design/book (1).svg";
import message from "../../../../../../../assets/images/design/message-square.svg";
import comment from "../../../../../../../assets/images/design/message-circle.svg";
import LayoutComponent from "./components/LayoutComponent";
import GeneralLandingComponent from "./components/GeneralLandingComponent";
import ChatComponent from "./components/ChatComponent";
import MessageComponent from "./components/MessageComponent";

export default class LandingTabComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let _this = this;
    return (
      <Fragment>
        <div style={{ height: "100%" }}>
          {_this.props.activeLandingTab === 1 ? (
            <>
              <div
                role="button"
                className="tabpanel_blocks"
                onClick={() => {
                  _this.props.super_this.setState({
                    isHeaderTabActive: true,
                    headerMessage: "Landing Page / Layout",
                    activeLandingTab: 2,
                    landingLayout: 1,
                  });
                }}
              >
                <div>
                  <img src={layout} />
                  <div>
                    <p className="tabpanel_title">Layout</p>
                    <p className="tabpanel_text">
                      Position and Style
                    </p>
                  </div>
                </div>
                <img src={arrow} />
              </div>
              <div
                role="button"
                className="tabpanel_blocks"
                onClick={() => {
                  _this.props.super_this.setState({
                    isHeaderTabActive: true,
                    headerMessage: "Landing Page / General",
                    activeLandingTab: 3,
                    landingLayout: 1,
                  });
                }}
              >
                <div>
                  <img src={edit} />
                  <div>
                    <p className="tabpanel_title">General</p>
                    <p className="tabpanel_text">Text and Appearence</p>
                  </div>
                </div>
                <img src={arrow} />
              </div>
              <div
                role="button"
                className="tabpanel_blocks"
                onClick={() => {
                  _this.props.super_this.setState({
                    isHeaderTabActive: true,
                    headerMessage: "Landing Page / Chat",
                    activeLandingTab: 4,
                    landingLayout: 1,
                  });
                }}
              >
                <div>
                  <img src={message} />
                  <div>
                    <p className="tabpanel_title">Chat</p>
                    <p className="tabpanel_text">Avatar and Chat style</p>
                  </div>
                </div>
                <img src={arrow} />
              </div>
              <div
                role="button"
                className="tabpanel_blocks"
                onClick={() => {
                  _this.props.super_this.setState({
                    isHeaderTabActive: true,
                    headerMessage: "Landing Page / Message",
                    activeLandingTab: 5,
                    landingLayout: 1,
                  });
                }}
              >
                <div>
                  <img src={comment} />
                  <div>
                    <p className="tabpanel_title">Message</p>
                    <p className="tabpanel_text">Title and Description</p>
                  </div>
                </div>
                <img src={arrow} />
              </div>
            </>
          ) : _this.props.activeLandingTab === 2 ? (
            <>
              <LayoutComponent {..._this.props} _this={_this} />
            </>
          ) : _this.props.activeLandingTab === 3 ? (
            <>
              <GeneralLandingComponent {..._this.props} _this={_this} />
            </>
          ) : _this.props.activeLandingTab === 4 ? (
            <>
              <ChatComponent
                layoutType="landing"
                {..._this.props}
                _this={_this}
              />
            </>
          ) : _this.props.activeLandingTab === 5 ? (
            <>
              <MessageComponent {..._this.props} _this={_this} />
            </>
          ) : null}
        </div>
      </Fragment>
    );
  }
}
