import React from "react";
import MuiAlert from "@mui/lab/Alert";
import Snackbar from "@mui/material/Snackbar";

export function successAlert(message, _this, duration) {
  _this.setState({
    alert: (
      <Snackbar
        TransitionComponent={"left"}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={true}
        autoHideDuration={duration ? duration : 5000}
        onClose={() => {
          _this.setState({ alert: null });
        }}
      >
        <MuiAlert
          onClose={() => {
            _this.setState({ alert: null });
          }}
          elevation={6}
          variant="filled"
          severity="success"
        >
          {message}
        </MuiAlert>
      </Snackbar>
    )
  });
}

export function errorAlert(message, _this, duration) {
  _this.setState({
    alert: (
      <Snackbar
        TransitionComponent={"left"}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={true}
        autoHideDuration={duration ? duration : 5000}
        onClose={() => {
          _this.setState({ alert: null });
        }}
      >
        <MuiAlert
          onClose={() => {
            _this.setState({ alert: null });
          }}
          elevation={6}
          variant="filled"
          severity="error"
        >
          {message}
        </MuiAlert>
      </Snackbar>
    )
  });
}
export function warningAlert(message, _this, duration) {
  _this.setState({
    alert: (
      <Snackbar
        TransitionComponent={"left"}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={true}
        autoHideDuration={duration ? duration : 5000}
        onClose={() => {
          _this.setState({ alert: null });
        }}
      >
        <MuiAlert
          onClose={() => {
            _this.setState({ alert: null });
          }}
          elevation={6}
          variant="filled"
          severity="warning"
        >
          {message}
        </MuiAlert>
      </Snackbar>
    )
  });
}

export function infoAlert(message, _this, duration) {
  _this.setState({
    alert: (
      <Snackbar
        TransitionComponent={"left"}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={true}
        autoHideDuration={duration ? duration : 5000}
        onClose={() => {
          _this.setState({ alert: null });
        }}
      >
        <MuiAlert
          onClose={() => {
            _this.setState({ alert: null });
          }}
          elevation={6}
          variant="filled"
          severity="info"
        >
          {message}
        </MuiAlert>
      </Snackbar>
    )
  });
}

