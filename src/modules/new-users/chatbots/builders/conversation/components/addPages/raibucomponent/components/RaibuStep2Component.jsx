import React, { Component, Fragment } from "react";
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
  Button,
} from "@mui/material";
import {
  step2save,
  step2update,
  deleteUserMgt,
  getChatBotList,
  getUserManagementList,
} from "./RaibuStepComponentServer";
import { successAlert, errorAlert } from "../../../../../../../../../js/alerts";
import SimpleReactValidator from "simple-react-validator";
import helpIcon from "../../../../../../../../../assets/images/sidebar/help-circle.svg";
import UserManagementComponent from "../../../../../../../../settings/components/UserManagementComponent";

class RaibuStep2Component extends Component {
  constructor(props) {
    super(props);
    this.validator = new SimpleReactValidator({
      messages: {
        email: "Invalid email address",
      },
    });
    this.state = {
      loading: false,
      id: null,
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
      alert: "",
    };
    this.saveStep = this.saveStep.bind(this);
  }

  saveStep() {
    this.props.handleActiveStep(2);
  }

  fetchDataFromServer = () => {
    let _this = this;
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
              chatbots: res.agents_data[prop].chatbots,
              name: res.agents_data[prop].name,
              role: res.agents_data[prop].role,
              superAdmin:
                res.agents_data[prop].role === "superadmin" ? true : false,
              prop: res.agents_data[prop],
            });
          });

        _this.setState({
          agents_data: temp,
        });
        _this.setState({ loading: false });
      },
      () => {
        _this.setState({ loading: false });
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
      // _this.handleLoadingShow(true);
      if (_this.state.id === null) {
        delete tempUser.agent_id;
        step2save(
          tempUser,
          (res) => {
            if (res.status === "True") {
              _this.setState({
                addUpdateUserModal: false,
                _this,
              });
              successAlert("User Added Successfully!", _this);
              _this.fetchDataFromServer();
            } else {
              errorAlert(res.message, _this);
            }
            // _this.handleLoadingShow(false);
          },
          (res) => {
            _this.setState({ loading: false });
            // _this.handleLoadingShow(false);
          }
        );
      } else {
        step2update(
          tempUser,
          (res) => {
            _this.setState({
              addUpdateUserModal: false,
            });
            // _this.handleLoadingShow(false);
            successAlert("User Updated Successfully!", _this);
            _this.fetchDataFromServer();
            _this.selectActiveTab(3);
          },
          (res) => {
            // _this.handleLoadingShow(false);
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
    // _this.handleLoadingShow(true);
    deleteUserMgt(
      tempObj,
      () => {
        successAlert("User deleted successfully!", _this);
        // _this.handleLoadingShow(false);
        _this.setState({
          showDeleteModal: false,
        });
        _this.fetchDataFromServer();
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };

  componentDidMount() {
    let _this = this;
    // this.props.setActive(this.saveStep);
    this.fetchDataFromServer();
    getChatBotList(
      "",
      (res) => {
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
        let selectBot = newObj.find((item) => {
          return item.id === this.props.botId;
        });
        let selectBotList = [];
        if (selectBot) {
          selectBotList = [selectBot];
        }

        this.setState({
          botItemList: newObj,
          botId: selectBot.bot_id,
          botName: selectBot.bot_name,
          selectBotList: selectBotList,
        });
      },
      () => {
        this.setState({ loading: false });
      }
    );
  }

  addAgentToggle = () => {
    this.setState({
      addUpdateUserModal: !this.state.addUpdateUserModal,
    });
  };

  handleInputChange = (e) => {
    var newObj = this.state.users;
    newObj[e.target.name] = e.target.value;
    this.setState({ users: newObj });
  };

  render() {
    const _this = this;
    return (
      <Fragment>
        <UserManagementComponent
          page="reaibustep2"
          _this={_this}
          selectActiveTab={(value) => {
          }}
          handleLoadingShow={(value) => {
          }}
          {..._this.props}
        />
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
        {this.state.alert}
      </Fragment>
    );
  }
}

export default RaibuStep2Component;
