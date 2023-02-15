import React, { Fragment } from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {
  Menu,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions
} from "@mui/material";
import Paper from "@material-ui/core/Paper";
import ReactToPrint from "react-to-print";
class TextComponent extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let _this = this;
    return (
      <Fragment>
        <Table>
          <TableHead>
            <TableRow>
              {_this.props.downloadReportColumn &&
                _this.props.downloadReportColumn.length > 0 &&
                _this.props.downloadReportColumn.map((prop) => {
                  return (
                    <TableCell>
                      <b>{prop.displayName}</b>
                    </TableCell>
                  );
                })}
            </TableRow>
          </TableHead>
          <TableBody>
            {_this.props.downloadReportList &&
              _this.props.downloadReportList.length > 0 &&
              _this.props.downloadReportList.map((row, index) => {
                return (
                  <TableRow key={index}>
                    {_this.props.downloadReportColumn.map((prop) => {
                      return (
                        <TableCell component="th" scope="row">
                          {_this.props.downloadReportList[index][prop.id]}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
          </TableBody>
        </Table>
      </Fragment>
    );
  }
}

export default class ClassComponentText extends React.PureComponent {
  componentRef = null;

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      text: "old boring text",
    };
  }

  setComponentRef = (ref) => {
    this.componentRef = ref;
  };

  reactToPrintContent = () => {
    return this.componentRef;
  };

  reactToPrintTrigger = () => {
    return (
      <p
       role="button" title="Generate Pdf">
        Preview
      </p>
    );
  };

  render() {
    let _this = this;
    return (
      <div>
        <Dialog
          open={_this.props.showPrintModal}
          onClose={() => {
            _this.props.closeDownloadModal()
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          scroll={"paper"}
          className="expand-flow-chart-model-block download-conversation-model-block"
        >
          <DialogTitle id="alert-dialog-title" className="knowledge_subheader">
            <p>Print Report</p>
            <div className="cancel_preview_btn">
              <p
            role="button"
            onClick={() => {
              _this.props.closeDownloadModal();
            }}
          >
            Cancel
          </p>
          <ReactToPrint
            content={_this.reactToPrintContent}
            documentTitle="AwesomeFileName"
            removeAfterPrint
            trigger={_this.reactToPrintTrigger}
          />
            </div>
          </DialogTitle>
          <DialogContent>
            <TextComponent {..._this.props} ref={this.setComponentRef} />
            <DialogActions>
              {this.state.isLoading && (
                <p className="indicator">onBeforeGetContent: Loading...</p>
              )}
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}
