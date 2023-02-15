import React, { Component, Fragment } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import {
  Button,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from "@mui/material";
import MUIDataTable from "mui-datatables";
import { Badge } from "react-bootstrap";
import edit from "../../../../../../assets/images/edit-2.svg";
import deleteIcon from "../../../../../../assets/images/trash-2.svg";
import { AiOutlineDelete } from "react-icons/ai";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export default class UserManagementComponent extends Component {
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
      download: false,
      filter: false,
      viewColumns: false,
      search: false,
      pagination: false,
    };
    const data = [
      ["Test", "test@gmail.com", "", "ADMIN", "true"],
      ["Ocko Gesericks", "test@outlook.com", "", "AGENT", "false"],
    ];
    return (
      <Fragment>
        <div className="right-block">
          <div className="header buider-setting-user-manage-header">
            <div>
              <p className="heading">User management</p>
              {/* <p className="desc">
                
              </p> */}
            </div>
            <div className="btn-block">
              <Button variant="outlined" onClick={this.addAgentToggle}>
                Add new user
              </Button>
            </div>
          </div>
          <div className="main-block user_management">
            {this.state.addAgentToggle ? (
              <div className="user-manage-add-agent-block add-agent-block">
                <label htmlFor="Add agent">Add new user</label>
                <div className="form-block">
                  <Form.Group className="form" controlId="formBasicEmail1">
                    <Form.Control type="text" placeholder="Name" />
                  </Form.Group>
                  <Form.Group
                    className="form middle-form"
                    controlId="formBasicEmail2"
                  >
                    <Form.Control type="email" placeholder="Enter" />
                  </Form.Group>
                  <FloatingLabel
                    controlId="floatingSelect"
                    label="Select Chat Interface"
                    className="chatboat-select"
                  >
                    <Form.Select aria-label="Floating label select example">
                      <option>Hybrid conversation</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </Form.Select>
                  </FloatingLabel>
                  <FloatingLabel controlId="floatingSelect" label="Choose Role">
                    <Form.Select aria-label="Floating label select example">
                      <option>Agent</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </Form.Select>
                  </FloatingLabel>
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
                    Add
                  </Button>
                </div>
              </div>
            ) : null}

            <MUIDataTable
              className="user-table shadow-none chatbot_table"
              title={""}
              data={data}
              columns={[
                {
                  name: "Name",
                  label: "Name",
                  options: {
                    filter: true,
                    sort: true,
                  },
                },
                {
                  name: "Email",
                  label: "Email",
                  options: {
                    filter: true,
                    sort: true,
                  },
                },
                {
                  name: "Max Chats",
                  label: "Max Chats",
                  options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                      // console.log('pending', tableMeta.rowData[4]);
                      // console.log('approve', tableMeta.rowData[5]);
                      return (
                        // <div>{tableMeta.rowData[4]} {tableMeta.rowData[5]}</div>
                        <Form.Select aria-label="Default select example">
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                        </Form.Select>
                      );
                    },
                  },
                },
                {
                  name: "Role",
                  label: "Role",
                  options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value, tableMeta, updateValue) => {
                      // console.log('pending', tableMeta.rowData[4]);
                      // console.log('approve', tableMeta.rowData[5]);
                      return (
                        // <div>{tableMeta.rowData[4]} {tableMeta.rowData[5]}</div>
                        <>
                          {value == "ADMIN" ? (
                            <Badge bg="primary admin">ADMIN</Badge>
                          ) : (
                            <Badge bg="primary agent">AGENT</Badge>
                          )}
                        </>
                      );
                    },
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
