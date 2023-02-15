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
import helpIcon from "../../../assets/images/sidebar/help-circle.svg";


import {
  getSetupHumanList,
  updateSetupHuman,
  deleteSetupHuman,
} from "../server/SettingServer.js";
import SimpleReactValidator from "simple-react-validator";
import { successAlert, deleteAlert } from "../../../js/alerts";
import { getAdminChatBotList } from "../../agent/dashboard/server/DashboardServer.js";
import { Multiselect } from "multiselect-react-dropdown";

export default class SetupHumanComponent extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.validator = new SimpleReactValidator({
      messages: {
        email: "Invalid email address",
      },
    });
    this.state = {
      addUpdateUserModal: false,
      showDeleteModal: false,
      selectBotList: [],
      data: [],
      loading: true,
      botItemList: [],
      id: null,
      selectValue: null,
      setupHuman: {
        id: null,
        takeover_message: "",
        video_link_message: "",
        chatbot_id: "",
      },
    };
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    _this.fetchDataFromServer();
    getAdminChatBotList(
      _this,
      "",
      (res) => {
           let selectBot = res.selectedBot && res.selectedBot;
           let newObj =
             res.bot_list &&
             res.bot_list.length > 0 &&
             res.bot_list.map((prop) => {
               return {
                 id: prop.bot_id,
                 label: prop.bot_name,
                 value: prop.bot_id
               };
             });
           _this.setState({
             botItemList: newObj,
             botId: selectBot && selectBot.bot_id,
             botName: selectBot && selectBot.bot_name,
             loading: false
           });
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
    getSetupHumanList(
      "",
      (res) => {
        let temp = [];
        Object.keys(res.human_takeover) &&
          Object.keys(res.human_takeover).length > 0 &&
          Object.keys(res.human_takeover).map((prop) => {
            temp.push({
              id: res.human_takeover[prop].id,
              chatbot_id: res.human_takeover[prop].chatbot_id,
              takeover_message: res.human_takeover[prop].takeover_message,
              chatbot: res.human_takeover[prop].chatbot,
              video_link_message: res.human_takeover[prop].video_link_message,
              prop: res.human_takeover[prop],
            });
          });
        _this.setState({
          data: temp,
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
    let tempUser = JSON.parse(JSON.stringify(this.state.setupHuman));
    if (_this.validator.allValid()) {
      _this.props.handleLoadingShow(true);
      updateSetupHuman(
        tempUser,
        (res) => {
          _this.setState({
            addUpdateUserModal: false,
          });
          _this.props.handleLoadingShow(false);
          successAlert("Takeover Updated Successfully!", _this.props._this);
          _this.fetchDataFromServer();
          _this.props.selectActiveTab(4);
        },
        (res) => {
          _this.props.handleLoadingShow(false);
        }
      );
    } else {
      _this.validator.showMessages();
      this.forceUpdate();
    }
  };

  deleteAccount = (id) => {
    let _this = this;
    let tempObj = {};
    tempObj.id = id;
    _this.props.handleLoadingShow(true);
    deleteSetupHuman(
      tempObj,
      () => {
        successAlert("Takeover deleted successfully!", _this.props._this);
        _this.props.handleLoadingShow(false);
        _this.fetchDataFromServer();
        _this.props.selectActiveTab(4);
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };
  handleInputChange = (e) => {
    var newObj = this.state.setupHuman;
    newObj[e.target.name] = (e.target && e.target.value).trim();
    this.setState({ setupHuman: newObj });
  };
  scrollUp = () => {
    const { scrollbars } = this.refs;
    // scrollbars.scrollTo(0, 0);
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
      rowsPerPageOptions: [5, 10,25, 50],
      textLabels: {
        body: {
          noMatch: this.state.loading? "Loading...": "No data found!",
        },
      },
    };
    return (
      <Fragment>
        <div className="right-block">
          <div className="header buider-setting-user-manage-header">
            <div>
              <p className="heading">Setup human takeover</p>
              <p className="desc">
                Setup virtual assistant to enable human takeover for a chatbot
              </p>
            </div>
          </div>
          <div className="main-block user_management">
            {_this.state.addUpdateUserModal ? (
              <div className="user-manage-add-agent-block add-agent-block">
                <label htmlFor="Add agent">
                  Setup virtual assistant for human takeover
                </label>
                <div className="form-block">
                  <Form.Group className="form" controlId="formBasicEmail1">
                    <Form.Control
                      type="text"
                      placeholder="Takeover Message"
                      name="takeover_message"
                      value={
                        _this.state.setupHuman &&
                        _this.state.setupHuman.takeover_message
                      }
                      onChange={this.handleInputChange}
                    />
                    <br />
                    <div className="errorMsg">
                      {_this.validator.message(
                        "takeover message",
                        _this.state.setupHuman &&
                          _this.state.setupHuman.takeover_message,
                        "required"
                      )}
                    </div>
                  </Form.Group>
                  <Form.Group
                    className="form middle-form"
                    controlId="formBasicEmail2"
                  >
                    <Form.Control
                      type="text"
                      placeholder="Video Link Text"
                      name="video_link_message"
                      value={
                        _this.state.setupHuman &&
                        _this.state.setupHuman.video_link_message
                      }
                      onChange={this.handleInputChange}
                    />
                    <br />
                    <div className="errorMsg">
                      {_this.validator.message(
                        "video link message",
                        _this.state.setupHuman &&
                          _this.state.setupHuman.video_link_message,
                        "required"
                      )}
                    </div>
                  </Form.Group>
                  <FloatingLabel
                    controlId="floatingSelect"
                    label="Select chatbot"
                    className="chatboat-select"
                  >
                    <Form.Select
                      name="chatbot_id"
                      value={
                        _this.state.setupHuman &&
                        _this.state.setupHuman.chatbot_id
                      }
                      onChange={this.handleInputChange}
                      aria-label="Floating label select example"
                    >
                      <option value="">Select</option>
                      {_this.state.botItemList &&
                        _this.state.botItemList.length > 0 &&
                        _this.state.botItemList.map((prop) => {
                          return (
                            <option value={prop.value}>{prop.label}</option>
                          );
                        })}
                    </Form.Select>
                  </FloatingLabel>
                </div>

                <br></br>
                <div className="errorMsg">
                  {_this.validator.message(
                    "chatbot",
                    _this.state.setupHuman && _this.state.setupHuman.chatbot_id,
                    "required"
                  )}
                </div>
                <div className="btn_block">
                  <Button
                    variant="contained"
                    className="cancel-btn"
                    type="button"
                    onClick={() => {
                      _this.setState({
                        addUpdateUserModal: false,
                        id: null,
                        setupHuman: {
                          id: null,
                          takeover_message: "",
                          video_link_message: "",
                          chatbot_id: "",
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
                    Update
                  </Button>
                </div>
              </div>
            ) : null}

            <MUIDataTable
              className="user-table shadow-none chatbot_table"
              title={""}
              data={_this.state.data}
              columns={[
                {
                  name: "takeover_message",
                  label: "Takeover Message",
                  options: {
                    filter: true,
                    sort: true,
                  },
                },
                {
                  name: "video_link_message",
                  label: "Video Link Message",
                  options: {
                    filter: true,
                    sort: true,
                  },
                },
                {
                  name: "chatbot",
                  label: "Chatbot",
                  options: {
                    filter: true,
                    sort: true,
                  },
                },
                {
                  name: "prop",
                  label: "Action",
                  options: {
                    filter: false,
                    sort: false,
                    customBodyRender: (value) => {
                      return (
                        <div className="edit-option">
                          <Tooltip title="Edit">
                            <IconButton
                              type="button"
                              onClick={() => {
                                _this.setState({
                                  addUpdateUserModal: true,
                                  id: value.id,
                                  setupHuman: {
                                    id: value.id,
                                    takeover_message: value.takeover_message,
                                    video_link_message:
                                      value.video_link_message,
                                    chatbot_id: value.chatbot_id,
                                  },
                                });
                                setTimeout(() => _this.scrollUp(), 500);
                              }}
                            >
                              <span>
                                <img src={edit} alt="" />
                              </span>
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete">
                            <IconButton
                              type="button"
                              onClick={() => {
                                _this.setState({
                                  selectValue: value.id,
                                  showDeleteModal: true,
                                });
                              }}
                            >
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

          {/* <div className="footer">
            <Button variant="outlined" className="cancel-btn">
              Cancel
            </Button>
            <Button variant="outlined" className="save-btn">
              Save
            </Button>
          </div> */}
        </div>
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
                        _this.deleteAccount(_this.state.selectValue);
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
      </Fragment>
    );
  }
}
