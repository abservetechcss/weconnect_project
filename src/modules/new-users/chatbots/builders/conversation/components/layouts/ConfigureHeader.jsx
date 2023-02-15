import React, { Component, Fragment } from "react";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { IconButton, Tooltip } from "@mui/material";
import undo from "../../../../../../../assets/images/userdash/rotate-ccw.svg";
import redo from "../../../../../../../assets/images/userdash/rotate-cw.svg";
import line from "../../../../../../../assets/images/userdash/Line 1134.svg";
import { chatTypes } from "../../../../../../../variables/appVariables.jsx";

export default class ConfigureHeader extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    return (
      <Fragment>
        <div className="knowledge_header">
          <div>
            <IconButton
              onClick={this.props.handleCloseChatComponent}
              className="back_icon_btn"
            >
              <ChevronLeftIcon className="icon" />
            </IconButton>
            <p>Configure Component: {chatTypes[this.props.type]?chatTypes[this.props.type]:"Unknown"}</p>
          </div>
          <div className="undo-redo">
            <Tooltip title="undo">
              <IconButton>
                <img src={undo} />
              </IconButton>
            </Tooltip>
            <img src={line} />
            <Tooltip title="redo">
              <IconButton>
                <img src={redo} />
              </IconButton>
            </Tooltip>
          </div>
        </div>
      </Fragment>
    );
  }
}
