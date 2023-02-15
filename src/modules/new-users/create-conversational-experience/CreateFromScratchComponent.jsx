import React, { Component, Fragment } from "react";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import { FloatingLabel, Form } from "react-bootstrap";
import img1 from "../../../assets/images/userdash/Group 20350.svg";
import { Button, MenuItem, Select, FormControl } from "@mui/material";
import ReactCountryFlag from "react-country-flag";
import { languageFlagList } from "../../../variables/appVariables.jsx";
import { createBot } from "./createConversationExperienceServer.js";
import { successAlert, errorAlert } from "../../../js/alerts.js";
import { encryptBot, decryptBot } from "../../../js/encrypt";
import { connect } from "react-redux";
import { setInnerSideBar,
  setSelectBotDetails,
} from "../../../redux/actions/ReduxActionPage.jsx";

import { AlertContext } from "../../common/Alert";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export class CreateFromScratchComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);

    this.state = {
      select_language: "",
      name: "",
      data: [],
      alert: ""
    };
    this.createChatBot = this.createChatBot.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
  }

  onChangeName(e) {
    this.setState({
      name: e.target.value
    })
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  createChatBot() {
    console.log("createbot", this.state);
    if (this.state.name.trim() === '') {
      errorAlert("Chat Interface title is required", this);
      return;
    }

    if (this.state.select_language === '') {
      errorAlert("Language is required", this);
      return;
    }

    if (this.state.name.trim() !== '' && this.state.select_language !== '') {
      this.context.showLoading();
      createBot({ name: this.state.name.trim(), chat_type: 'hybrid_chat', languages: this.state.select_language },
        (res) => {
          if (res.Status === "True") {
            // localStorage.setItem("activeBotId", res.bot_id);
            const botId = res.bot_id;
            const encData = encryptBot(botId, this.state.name);
            const updateState = {
              "innerSideBarActive": true,
              "botName": this.state.name.trim(),
              "botId": botId
            };
            this.props.setInnerSideBarActive(updateState);
            this.props.setSelectBotDetails(updateState).then(() => {
             localStorage.removeItem("botIdDetails");
              localStorage.setItem("botIdDetails", updateState);
              this.props.history.push(`/user/chatbots/builder?botId=${encData}`);
            });
            this.context.showAlert({
              type: "success",
              message: res.Message,
            });
            // successAlert(res.Message, this);  
          } else {
            this.context.showAlert({
              type: "error",
              message: res.Message,
            });
            // errorAlert(res.Message, this);
          }
        }, (error) => {
          this.context.showLoading(false);
          console.log("error");
        });
    }
  }
  render() {
    let _this = this;
    let form = (
      <Fragment>
        <div className="createchat_section">
          <div>
            <p className="createchat_heading">
              Create New Conversational Experience
            </p>
            <p className="createchat_title">
              {/* Excepteur sint occaecat cupidatat excepteur sint occaecat
              cupidatat non proident, sunt in culpanon proident, sunt in culpa */}
            </p>
            <div className="chat_input_box">
              <FloatingLabel
                className="login_label"
                controlId="floatingPassword"
                label="Chat Interface title"
              >
                <Form.Control
                  className="login_input"
                  type="text"
                  placeholder="Chat Interface title"
                  value={ this.state.name}
                  onChange={this.onChangeName}
                  name="name"
                />
              </FloatingLabel>
              <FormControl fullWidth className="language_selector">
                <Select
                  value={_this.state.select_language}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  onChange={(e) => {
                    _this.setState({
                      select_language: e.target.value,
                    });
                  }}
                  MenuProps={MenuProps}
                >
                  <MenuItem value="">
                    <p style={{ color: "#b4b4b6", fontFamily: "nunito" }}>
                      Select language
                    </p>
                  </MenuItem>
                  {languageFlagList &&
                    languageFlagList.length > 0 &&
                    languageFlagList.map((prop, i) => {
                      return (
                        <MenuItem key={i} value={prop.value}>
                          <ReactCountryFlag
                            countryCode={prop.countryCode}
                            svg
                            style={{ marginRight: "10px" }}
                          />
                          {` ${prop.label}`}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>

              <div className="chat_btn_box">
                <Button className="cancel_btn" variant="contained" onClick={() => {
                  this.props.history.push("/user/dashboard")
                }}>
                  Cancel
                </Button>
                <Button className="create_btn" variant="contained" onClick={ this.createChatBot}>
                  Create and Next
                </Button>
              </div>
            </div>
          </div>
          <div className="chat_img">
            <img src={img1} />
          </div>
        </div>
      </Fragment>
    );
    return (
      <Fragment>
        {this.state.alert}
        {this.state.loading && (
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
              style={{ zIndex: "10000000000000000000000000000" }}
              open={true}
            >
              <div className="loader_main">
                <div className="item_loader">
                  <Loader
                    type="box-rotate-x"
                    bgColor={"#32E0A1"}
                    title={"Please wait..."}
                    color={"#fff"}
                    size={100}
                  />
                </div>
              </div>
            </Backdrop>
        )}
          {form}
      </Fragment>
    );
  }
}

function mapStateToProps(state) {
  const botId = state.getSelectBotIdDetails.selectBotList || "";
  return {botId};
}

function mapDispatchToProps(dispatch) {
  return {
    setInnerSideBarActive: (data) => {
      dispatch(setInnerSideBar(data));
    },
    setSelectBotDetails: (data) => {
      return dispatch(setSelectBotDetails(data))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CreateFromScratchComponent);
