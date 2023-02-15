import React, { Component, Fragment } from "react";
import { FloatingLabel, Form } from "react-bootstrap";
import {
  Dialog,
  DialogContent,
  Menu,
  Stack,
  DialogContentText,
  DialogTitle,
  DialogActions,
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
import edit from "../../../assets/images/edit-2.svg";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import {
  getUserManagementList,
  createUserManagement,
  updateUserManagement,
  deleteUserMgt,
} from "../server/SettingServer.js";
import SimpleReactValidator from "simple-react-validator";
import { successAlert, errorAlert } from "../../../js/alerts";
import { getAdminChatBotList } from "../../agent/dashboard/server/DashboardServer.js";
import { Multiselect } from "multiselect-react-dropdown";
import helpIcon from "../../../assets/images/sidebar/help-circle.svg";

import { AlertContext } from "../../common/Alert";

export default class UserManagementComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {
        email: "Invalid email address",
      },
    });
    this.state = {
      loading: true,
      addUpdateUserModal: false,
      showDeleteModal: false,
      selectBotList: [],
      agents_data: [],
      botItemList: [],
      id: null,
      selectValue: null,
      users: {
        agent_id: null,

        email: "",
        name: "",
        chatbot_id: "",
        agent_type: "",
        max_chats: "",
      },
    };
  }
  componentDidMount() {
    let _this = this;
    document
      .getElementById("userScrollElement")
      .scrollTo({ top: 0, behavior: "smooth" });
    _this.fetchDataFromServer();
    getAdminChatBotList(
      _this,
      "",
      (res) => {
        if (res.status !== "False") {
          const botList = res.bot_list || {};
          let newObj = [];
          for (let key in botList) {
            if (Object.hasOwn(botList, key)) {
              const prop = botList[key];
              newObj.push({
                id: prop.bot_id,
                label: prop.bot_name,
                value: prop.bot_name,
              });
            }
          }
          _this.setState({
            botItemList: newObj,
            selectBotList: [],
            // botId: selectBot && selectBot.bot_id,
            // botName: selectBot&&selectBot.bot_name,
          });
        } else {
          _this.setState({
            botItemList: [],
            selectBotList: [],
          });
        }
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  }

  fetchDataFromServer = () => {
    let _this = this;
    _this.setState({
      loading: true
    })
    getUserManagementList(
      "",
      (res) => {
        let temp = [];
        Object.keys(res.agents_data) &&
          Object.keys(res.agents_data).length > 0 &&
          Object.keys(res.agents_data).map((prop) => {
            temp.push({
              id: res.agents_data[prop].agent_id,
              email: res.agents_data[prop].email,
              max_chats: res.agents_data[prop].max_chats,
              chatbots: Array.isArray(res.agents_data[prop].chatbots)
                ? res.agents_data[prop].chatbots
                : [],
              name: res.agents_data[prop].name,
              role: res.agents_data[prop].role,
              superAdmin:
                res.agents_data[prop].role === "superadmin" ? true : false,
              prop: res.agents_data[prop],
            });
          });
        _this.setState({
          agents_data: temp,
          loading: false
        });
        _this.props._this.setState({ loading: false });
      },
      () => {
        _this.props._this.setState({ loading: false });
      }
    );
  };

  onSubmit = () => {
    let _this = this;
    let tempUser = JSON.parse(JSON.stringify(this.state.users));
    tempUser.chatbot_id = "";
    if (_this.state.selectBotList && _this.state.selectBotList.length > 0) {
      _this.state.selectBotList.map((prop, key) => {
        if (key !== 0) {
          tempUser.chatbot_id += ",";
        }
        tempUser.chatbot_id += prop.id;
      });
    }
    if (_this.validator.allValid()) {
      _this.context.showLoading();
      setTimeout(() => {
        _this.context.showLoading(false);
      }, 5000);
      if (_this.state.id === null) {
        delete tempUser.agent_id;
        createUserManagement(
          tempUser,
          (res) => {
            if (res.data.status === "True") {
              _this.setState({
                addUpdateUserModal: false,
              });
              _this.context.showLoading(false);
              // successAlert("User Added Successfully!", _this.props._this);
              this.context.showAlert({
                type: "success",
                message: "User Updated Successfully",
              });
              _this.fetchDataFromServer();
              _this.props.selectActiveTab(3);
            } else {
              // errorAlert(res.message, _this.props._this);
              this.context.showAlert({
                type: "error",
                message: res.data.message || "Add User Failed",
              });
            }
          },
          (res) => {
            _this.setState({ loading: false });
            _this.context.showLoading(false);
          }
        );
      } else {
        updateUserManagement(
          tempUser,
          (res) => {
            _this.setState({
              addUpdateUserModal: false,
            });
            _this.context.showLoading(false);
            // successAlert("User Updated Successfully!", _this.props._this);
            this.context.showAlert({
              type: "success",
              message: "User Updated Successfully",
            });
            _this.fetchDataFromServer();
            _this.props.selectActiveTab(3);
          },
          (res) => {
            _this.context.showLoading(false);
          }
        );
      }
    } else {
      _this.validator.showMessages();
      this.forceUpdate();
    }
  };

  deleteUserAccount = (id) => {
    let _this = this;
    let tempObj = {};
    tempObj.agent_id = id;
    _this.setState({ showDeleteModal: false });
    _this.context.showLoading();
    deleteUserMgt(
      tempObj,
      () => {
        // successAlert("User deleted successfully!", _this.props._this);
        this.context.showAlert({
          type: "success",
          message: "User deleted successfully",
        });

        // _this.context.showLoading(false);
        _this.fetchDataFromServer();
        _this.props.selectActiveTab(3);
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };
  handleInputChange = (e) => {
    var newObj = this.state.users;
    newObj[e.target.name] = (e.target && e.target.value).trim();
    this.setState({ users: newObj });
  };
  render() {
    let _this = this;
    const options = {
      filter: false,
      download: false,
      print: false,
      viewColumns: false,
      search: true,
      responsive: "scrollMaxHeight",
      selectableRows: false,
      rowsPerPage: 5,
      rowsPerPageOptions: [5, 10, 25, 50],
      textLabels: {
        body: {
          noMatch: this.state.loading? "Loading..." :"No data found!",
        },
      },
    };
    return (
      <Fragment>
        <div
          className={
            _this.props.page !== "reaibustep2"
              ? "right-block"
              : "right-block raibu_step2_border"
          }
        >
          <div className="header buider-setting-user-manage-header raibu_step2_header">
            <div>
              {_this.props.page !== "reaibustep2" ? (
                <>
                  <p className="heading">User management</p>
                  <p className="desc"></p>
                </>
              ) : (
                <>
                  <p className="heading">
                    Add agents to enable live assistance
                  </p>
                </>
              )}
            </div>
            <div className="btn-block">
              <Button
                type="button"
                variant="outlined"
                onClick={() => {
                  // window.scrollTo(0, 0);
                  document
                    .getElementById("userScrollElement")
                    .scrollTo({ top: 0, behavior: "smooth" });
                  _this.setState({
                    addUpdateUserModal: true,
                    id: null,
                    selectBotList: [],
                    users: {
                      agent_id: null,
                      email: "",
                      name: "",
                      chatbot_id: "",
                      agent_type: "",
                      max_chats: "",
                    },
                  });
                }}
              >
                {_this.state.id === null ? " Add new user" : "Update user"}
              </Button>
            </div>
          </div>
          <div className="main-block user_management" id="userScrollElement">
            {_this.state.addUpdateUserModal ? (
              <Fragment>
                <div className="user-manage-add-agent-block add-agent-block">
                  <label htmlFor="Add agent">Add new user</label>
                  <div className="form-block">
                    <Form.Group className="form" controlId="formBasicEmail1">
                      <Form.Control
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={_this.state.users && _this.state.users.name}
                        onChange={this.handleInputChange}
                      />
                      {/* <br /> */}
                      <div className="errorMsg">
                        {_this.validator.message(
                          "Name",
                          _this.state.users && _this.state.users.name,
                          "required"
                        )}
                      </div>
                    </Form.Group>
                    <Form.Group
                      className="form middle-form"
                      controlId="formBasicEmail2"
                    >
                      {_this.state.users.agent_type === "superadmin" ? (
                        <Form.Control
                          type="email"
                          placeholder="Email ID"
                          disabled
                          name="email"
                          jsonValue
                          value={_this.state.users && _this.state.users.email}
                        />
                      ) : (
                        <Form.Control
                          type="email"
                          placeholder="Email ID"
                          name="email"
                          jsonValue
                          value={_this.state.users && _this.state.users.email}
                          onChange={this.handleInputChange}
                        />
                      )}
                      <div className="errorMsg">
                        {_this.validator.message(
                          "Email",
                          _this.state.users && _this.state.users.email,
                          "required|email"
                        )}
                      </div>
                    </Form.Group>
                    <div className="form middle-form">
                      <FloatingLabel
                        controlId="floatingSelect"
                        label="Select max chats"
                        className="chatboat-select"
                      >
                        <Form.Select
                          name="max_chats"
                          value={
                            _this.state.users && _this.state.users.max_chats
                          }
                          onChange={this.handleInputChange}
                          aria-label="Floating label select example"
                        >
                          <option value="">Select</option>
                          <option value="1">1</option>
                          <option value="2">2</option>
                          <option value="3">3</option>
                          <option value="4">4</option>
                          <option value="5">5</option>
                          <option value="6">6</option>
                        </Form.Select>
                      </FloatingLabel>

                      <div className="errorMsg">
                        {_this.validator.message(
                          "max chats",
                          _this.state.users && _this.state.users.max_chats,
                          "required"
                        )}
                      </div>
                    </div>

                    <div className="form">
                      <FloatingLabel
                        controlId="floatingSelect"
                        label="Choose Role"
                      >
                        {_this.state.users.agent_type === "superadmin" ? (
                          <Form.Select
                            disabled
                            name="agent_type"
                            value={
                              _this.state.users && _this.state.users.agent_type
                            }
                            aria-label="Floating label select example"
                          >
                            {" "}
                            <option value="superadmin">Super Admin</option>
                            <option value="agent">Agent</option>
                          </Form.Select>
                        ) : (
                          <Form.Select
                            name="agent_type"
                            value={
                              _this.state.users && _this.state.users.agent_type
                            }
                            onChange={this.handleInputChange}
                            aria-label="Floating label select example"
                          >
                            <option value="">Select</option>
                            <option value="admin">Admin</option>
                            <option value="agent">Agent</option>
                          </Form.Select>
                        )}
                      </FloatingLabel>
                      <div className="errorMsg">
                        {_this.validator.message(
                          "role",
                          _this.state.users && _this.state.users.agent_type,
                          "required"
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-block">
                    <div className="form">
                      {/* <FloatingLabel
                      controlId="floatingSelect"
                      label="Select Chat Interface"
                      className="chatboat-select"
                    >
                     
                    </FloatingLabel> */}

                      <Multiselect
                        displayValue="label"
                        showCheckbox={true}
                        selectedValues={_this.state.selectBotList}
                        onSelect={(value) => {
                          console.log(value);
                          _this.setState({
                            selectBotList: value,
                          });
                        }}
                        onRemove={(list, removedItem) => {
                          _this.setState({
                            selectBotList: list,
                          });
                        }}
                        options={_this.state.botItemList}
                      />
                      {_this.state.users.agent_type === "superadmin" ? null : (
                        <div className="errorMsg">
                          {_this.validator.message(
                            "chatbot",
                            _this.state.selectBotList &&
                              _this.state.selectBotList.length > 0
                              ? true
                              : "",
                            "required"
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="btn_block">
                    <Button
                      variant="contained"
                      className="cancel-btn"
                      type="button"
                      onClick={() => {
                        _this.setState({
                          addUpdateUserModal: false,
                          selectBotList: [],
                          id: null,
                          users: {
                            agent_id: null,
                            email: "",
                            name: "",
                            chatbot_id: "",
                            agent_type: "",
                            max_chats: "",
                          },
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      className="save-btn"
                      type="button"
                      onClick={() => {
                        _this.onSubmit();
                      }}
                    >
                      {_this.state.id === null ? "Add" : "Update"}
                    </Button>
                  </div>
                </div>
              </Fragment>
            ) : null}

            <MUIDataTable
              className="user-table shadow-none chatbot_table"
              title={""}
              data={_this.state.agents_data}
              columns={[
                {
                  name: "name",
                  label: "Name",
                  options: {
                    filter: true,
                    sort: true,
                  },
                },
                {
                  name: "email",
                  label: "Email",
                  options: {
                    filter: true,
                    sort: true,
                  },
                },
                {
                  name: "chatbots",
                  label: "Chatbot",
                  options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value) => {
                      return (
                        <>
                          {value
                            .map((item) => {
                              return item.chatbot_name;
                            })
                            .join(", ")}
                        </>
                      );
                    },
                  },
                },
                {
                  name: "max_chats",
                  label: "Max Chats",
                  options: {
                    filter: false,
                    sort: false,
                  },
                },
                {
                  name: "role",
                  label: "Role",
                  options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value) => {
                      return (
                        <>
                          {value === "superadmin" ? (
                            <Badge bg="primary admin">Super Admin</Badge>
                          ) : value === "admin" ? (
                            <Badge bg="primary admin">Admin</Badge>
                          ) : (
                            <Badge bg="primary agent">Agent</Badge>
                          )}
                        </>
                      );
                    },
                  },
                },
                {
                  name: "prop",
                  label: "Action",
                  options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value) => {
                      if (
                        value.role === "superadmin" &&
                        localStorage.getItem("admin_type") === "admin"
                      ) {
                        return null;
                      } else {
                        return (
                          <div className="edit-option">
                            <Tooltip title="Edit">
                              <IconButton
                                type="button"
                                onClick={() => {
                                  document
                                    .getElementById("userScrollElement")
                                    .scrollTo({ top: 0, behavior: "smooth" });
                                  let temp = [];
                                  if (
                                    value.chatbots &&
                                    value.chatbots.length > 0
                                  ) {
                                    value.chatbots
                                      .filter((x) => {
                                        return x.chatbot_name !== undefined;
                                      })
                                      .map((x, k) => {
                                        temp.push({
                                          label: x.chatbot_name,
                                          value: x.chatbot_id,
                                          id: x.chatbot_id,
                                        });
                                      });
                                  }
                                  console.log("edit", {
                                    addUpdateUserModal: true,
                                    id: value.agent_id,
                                    selectBotList: temp,
                                    users: {
                                      agent_id: value.agent_id,
                                      email: value.email,
                                      name: value.name,
                                      chatbot_id: "",
                                      agent_type: value.role,
                                      max_chats: value.max_chats,
                                    },
                                  });
                                  _this.setState({
                                    addUpdateUserModal: true,
                                    id: value.agent_id,
                                    selectBotList: temp,
                                    users: {
                                      agent_id: value.agent_id,
                                      email: value.email,
                                      name: value.name,
                                      chatbot_id: "",
                                      agent_type: value.role,
                                      max_chats: value.max_chats,
                                    },
                                  });
                                }}
                              >
                                <span>
                                  <img src={edit} alt="" />
                                </span>
                              </IconButton>
                            </Tooltip>
                            {value.role !== "superadmin" ? (
                              <Tooltip title="Delete">
                                <IconButton
                                  type="button"
                                  onClick={() => {
                                    _this.setState({
                                      selectValue: value.agent_id,
                                      showDeleteModal: true,
                                    });
                                  }}
                                >
                                  <DeleteOutlineIcon />
                                </IconButton>
                              </Tooltip>
                            ) : null}
                          </div>
                        );
                      }
                    },
                  },
                },
              ]}
              options={options}
            />
          </div>
          {/* <div className="footer">
            <Button variant="outlined" className="cancel-btn">
              Cancel
            </Button>
            <Button variant="outlined" className="save-btn">
              Save
            </Button>
          </div> */}
        </div>
        {/* header language model start */}
        <Dialog
          open={_this.state.showDeleteModal}
          onClose={() => {
            _this.setState({
              showDeleteModal: false,
            });
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="knowdledge-base-edit-model-popup-block header-language-model-popup-block setting-modal-block-popup"
        >
          <DialogTitle id="alert-dialog-title"></DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className="desc-block">
                <p className="title">
                  Are you sure?
                  <small>You will not be able to recover this data!</small>
                </p>
                <div className="info-btn-block">
                  <img src={helpIcon} alt="" />
                  <div className="btn-block">
                    <Button
                      className="cancel-btn"
                      variant="contained"
                      onClick={() => {
                        _this.setState({
                          showDeleteModal: false,
                        });
                      }}
                    >
                      No
                    </Button>
                    <Button
                      className="leave-btn"
                      variant="contained"
                      onClick={() => {
                        _this.deleteUserAccount(_this.state.selectValue);
                      }}
                    >
                      Yes
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
        {/* header language model end */}
      </Fragment>
    );
  }
}
