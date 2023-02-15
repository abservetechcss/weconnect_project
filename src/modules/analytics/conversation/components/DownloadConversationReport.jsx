import React, { Component, Fragment } from "react";
import {
  Menu,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Pdf from "react-to-pdf";
import Paper from "@material-ui/core/Paper";

const ref = React.createRef();

export class DownloadConversationReport extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let _this = this;
    return (
      <Fragment>
        <Dialog
          open={_this.props.showDownloadModal}
          onClose={() => {
            _this.props.closeDownloadModal();
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          scroll={"paper"}
          className="expand-flow-chart-model-block download-conversation-model-block"
        >
          <DialogTitle id="alert-dialog-title" className="knowledge_subheader">
            <p>Download Report</p>
            <div className="cancel_preview_btn">
              <p
                role="button"
                onClick={() => {
                  _this.props.closeDownloadModal();
                }}
              >
                Cancel
              </p>
              <Pdf
               
               
                targetRef={ref}
                filename="conversation.pdf"
              >
                {({ toPdf }) => (
                  <p
                    type="button"
                    onClick={() => {
                      toPdf();
                    }}
                    title="Generate Pdf"
                  >
                    Download
                  </p>
                )}
              </Pdf>{" "}
              {/* <p
                role="button"
                onClick={() => {
                  _this.props.closeDownloadModal();
                }}
              >
                Download
              </p> */}
            </div>
          </DialogTitle>
          <DialogContent>
            <Paper ref={ref} className="container download-conversation-block">
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
            </Paper>
            <DialogActions></DialogActions>
          </DialogContent>
        </Dialog>
      </Fragment>
    );
  }
}

export default DownloadConversationReport;
