import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import newTab from "../../../../../../assets/images/Group 18868.svg";
import copy from "../../../../../../assets/images/userdash/copy-1.svg";
import facebook from "../../../../../../assets/images/facebook.png";
import twitter from "../../../../../../assets/images/twitter.png";
import whatsApp from "../../../../../../assets/images/whatsApp.png";
import CopyToClipboard from "react-copy-to-clipboard";
import { AlertContext } from "../../../../../common/Alert";
import { Dropdown, Form, FloatingLabel } from "react-bootstrap";
import MUIDataTable from "mui-datatables";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button
} from "@mui/material";
import { MdOutlineDelete } from "react-icons/md";
import edit from "../../../../../../assets/images/edit-2.svg";
export default class EmbedWebpage extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    this.state = {
      industry: false,
      addindustry: false,
    };
  }

  handleIndustryClick = () => {
    this.setState({ industry: true });
  };

  handleIndustryClose = () => {
    this.setState({ industry: false });
  };

  handleIndustryAdd = () => {
    this.setState({ addindustry: true });
  };
  handleIndustryAddClose = () => {
    this.setState({ addindustry: false });
  };

  render() {
    const options = {
      filterType: "dropdown",
      print: false,
      download: false,
      filter: false,
      viewColumns: false,
      search: false,
      pagination: false,
      selectableRows: false,
      responsive: "scrollMaxHeight",
    };
    const data = [
      ["https://www.leocoders.com/", , "true"],
      ["https://www.leocoders.com/hire-us", "false"],
    ];

    return (
      <Fragment>
        <div className="right-block">
          <div className="header buider-setting-user-manage-header">
            <div>
              <p className="heading">Embed on a Webpage</p>
              <p className="desc">Install the widget on a webpage</p>
            </div>
            <div className="btn-block">
              <Button
                className="setup_url"
                variant="outlined"
                onClick={this.handleIndustryClick}
              >
                Setup Web URL
              </Button>
            </div>
          </div>
          <div className="main-block">
            <div className="size-block">
              <p className="title">Embed on a website page</p>
              {/* <p className="desc">
                
              </p> */}
              <div className="new-tab-block">
                <div className="link-block">
                  <Link to="#">
                    {
                      this.props.script
                    }
                  </Link>
                </div>
                <div className="tab-block embed-tab-block">
                  <span className="copy-block">
                    <CopyToClipboard
                      text={this.props.script}
                      onCopy={() => {
                        this.context.showAlert({
                          type: "success",
                          message: "Copied successfully",
                        });
                      }}
                    >
                      <Button className="copy-icon">
                        <img src={copy} alt="" />
                        Copy
                      </Button>
                    </CopyToClipboard>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Dialog
          open={this.state.industry}
          onClose={this.handleIndustryClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          scroll={"paper"}
          className="expand-flow-chart-model-block new-industry-modal-block"
        >
          <DialogTitle id="alert-dialog-title" className="knowledge_subheader">
            <p>Manage Web URL’s </p>
            <p>(Widget will be visible only on webpages added below)</p>
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <MUIDataTable
                className="user-table shadow-none chatbot_table"
                title={""}
                data={data}
                columns={[
                  {
                    name: "Webpage URL",
                    label: "Webpage URL",
                    options: {
                      filter: true,
                      sort: true,
                    },
                  },

                  {
                    name: "Action",
                    label: "Action",
                    options: {
                      filter: false,
                      sort: false,
                      customBodyRender: (value, tableMeta, updateValue) => {
                        return (
                          // <div>{tableMeta.rowData[4]} {tableMeta.rowData[5]}</div>
                          <div className="edit-option">
                            <span>
                              <img src={edit} alt="" />
                              Edit
                            </span>
                            <span>
                              <MdOutlineDelete />
                              Delete
                            </span>
                          </div>
                        );
                      },
                    },
                  },
                ]}
                options={options}
              />
              <div className="add_industry">
                {this.state.addindustry ? (
                  <div>
                    <Form.Group
                      className="input-field-block-cust"
                      controlId="formBasicEmail"
                    >
                      <Form.Control
                        type="text"
                        placeholder="Enter industry name"
                      />
                    </Form.Group>
                    <Button
                      onClick={this.handleIndustryAddClose}
                      variant="contained"
                      className="cancel_btn"
                    >
                      Cancel
                    </Button>
                    <Button variant="contained" className="add_btn">
                      Add
                    </Button>
                  </div>
                ) : (
                  <p
                    className="add_industry_text"
                    onClick={this.handleIndustryAdd}
                  >
                    + Add new Webpage
                  </p>
                )}
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" className="cancel_btn">
              Cancel
            </Button>
            <Button variant="contained" className="save_btn">
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}
