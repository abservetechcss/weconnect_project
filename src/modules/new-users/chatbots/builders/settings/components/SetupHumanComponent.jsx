import React, { Component, Fragment } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import { Button, IconButton, Tooltip } from "@mui/material";
import MUIDataTable from "mui-datatables";
import { Badge } from "react-bootstrap";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import edit from "../../../../../../assets/images/edit-2.svg";
export default class SetupHumanComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      addAgentToggle: false,
    };
  }

  addAgentToggle = () => {
    this.setState({
      addAgentToggle: !this.state.addAgentToggle,
    });
  };
  render() {
    const options = {
      filterType: "dropdown",
      print: false,
      responsive: "scrollMaxHeight",
      download: false,
      filter: false,
      viewColumns: false,
      search: false,
      pagination: false,
    };
    const data = [
      [
        "Our agent will takeover for furthere process!",
        "Click to start video chat",
        "true",
      ],
      [
        "Our agent will takeover for furthere process!",
        "Click to start video chat",
        "false",
      ],
    ];
    return (
      <Fragment>
        <div className="right-block">
          <div className="header buider-setting-user-manage-header">
            <div>
              <p className="heading">Setup human takeover</p>
              <p className="desc">
                Setup virtual assistant to enable human takeover for a Chat Interface
              </p>
            </div>
            <div className="btn-block">
              <Button variant="outlined" onClick={this.addAgentToggle}>
                Setup
              </Button>
            </div>
          </div>
          <div className="main-block user_management">
            {this.state.addAgentToggle ? (
              <div className="user-manage-add-agent-block add-agent-block">
                <label htmlFor="Add agent">
                  Setup virtual assistant for human takeover
                </label>
                <div className="form-block">
                  <Form.Group className="form" controlId="formBasicEmail1">
                    <Form.Control type="text" placeholder="Takeover Message" />
                  </Form.Group>
                  <Form.Group
                    className="form middle-form"
                    controlId="formBasicEmail2"
                  >
                    <Form.Control type="text" placeholder="Video Link Text" />
                  </Form.Group>
                </div>
                <div className="btn_block">
                  <Button
                    variant="contained"
                    className="cancel-btn"
                    onClick={this.addAgentToggle}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    className="save-btn"
                    onClick={this.addAgentToggle}
                  >
                    Create
                  </Button>
                </div>
              </div>
            ) : null}
            <MUIDataTable
              className="user-table shadow-none chatbot_table setup-human-table"
              title={""}
              data={data}
              columns={[
                {
                  name: "Message",
                  label: "Takeover Message",
                  options: {
                    filter: true,
                    sort: true,
                  },
                },
                {
                  name: "Video",
                  label: "Video Link Message",
                  options: {
                    filter: true,
                    sort: true,
                  },
                },

                {
                  name: "",
                  label: "",
                  options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                      // console.log('pending', tableMeta.rowData[4]);
                      // console.log('approve', tableMeta.rowData[5]);
                      return (
                        // <div>{tableMeta.rowData[4]} {tableMeta.rowData[5]}</div>
                        <div className="edit-option">
                          <Tooltip title="Delete">
                            <IconButton>
                              <span>
                                <img src={edit} alt="" />
                              </span>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton>
                              <DeleteOutlineIcon />
                            </IconButton>
                          </Tooltip>
                        </div>
                      );
                    },
                  },
                },
              ]}
              options={options}
            />
          </div>
          <div className="footer">
            <Button variant="outlined" className="cancel-btn">
              Cancel
            </Button>
            <Button variant="outlined" className="save-btn">
              Save
            </Button>
          </div>
        </div>
      </Fragment>
    );
  }
}
