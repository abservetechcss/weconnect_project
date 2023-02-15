import React, { Component, Fragment } from "react";
import deleteIcon from "../../../../../../../assets/images/userdash/trash-2 red.svg";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import help from "../../../../../../../assets/images/help-circle.svg";
export default class ConfigureFooter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      save: false
    };
  }

  handleDialogOpen = () => {
    this.setState({
      save: true,
    });
  };

  handleDialogClose = () => {
    this.setState({
      save: false,
    });
  };

  render() {
    return (
      <Fragment>
        <div className="knowledge_footer">
          <div className="btn_block">
            <Button variant="contained" className="cancel-btn" onClick={() => {
                  this.props.handleCloseChatComponent();
                }}>
              Cancel
            </Button>
            <Button variant="contained" className="save-btn" onClick={this.handleDialogOpen}>
              Save
            </Button>
          </div>
        </div>
        <Dialog
          open={this.state.save}
          onClose={this.handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="delete_popup"
        >
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <p>Do you want to save this component?</p>
              <div className="info_box">
                <img src={help} />
                <div>
                  <Button
                    variant="contained"
                    className="no_btn"
                    onClick={this.handleDialogClose}
                  >
                    No
                  </Button>
                  <Button
                    variant="text"
                    className="yes_btn"
                    onClick={this.props.handleSave}
                  >
                    Yes
                  </Button>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}
