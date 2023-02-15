import React, { Component, Fragment } from "react";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import img1 from "../../../assets/images/userdash/Group 18957.svg";
import img2 from "../../../assets/images/userdash/Group 18954.svg";
import { Button } from "@mui/material";
import { BiImport, BiPlus } from "react-icons/bi";
import { HiOutlineTemplate } from "react-icons/hi";
import ReactPlayer from "react-player";
import { Link } from "react-router-dom";

import Dialog from "@mui/material/Dialog";
import Input from "@mui/material/Input";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { AlertContext } from "./../../common/Alert";
import { encryptBot } from "./../../../js/encrypt";

import {
  importBot,
} from "../../users/edit-profile/server/EditProfileServer.js";

import CompanyDetailsComponent from "../../users/registration/CompanyDetailsComponent.jsx";


export class NewUserDashboardComponent extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      loading: false,
      showCompanyInfoModal: false,
    };
    this.hanldeImportBot = this.hanldeImportBot.bind(this);
  }

  componentDidMount() {
    if (localStorage.getItem("timezone") === "" || localStorage.getItem("timezone") === null) {
      this.setState({ showCompanyInfoModal: true });
    } else {
      this.setState({ showCompanyInfoModal: false });
    }
  }

  hanldeImportBot(e) {
    if (e.target.files && e.target.files[0]) {
      var formData = new FormData();
      formData.append("file", e.target.files[0]);
      e.target.value = ''
      // this.context.showLoading(true);
      importBot(formData, (res) => {
        const encData = encryptBot(res.bot_id, res.bot_name);
        this.context.showAlert({ type: "success", message: res.message });
        this.props.history.push(`/user/chatbots/builder?botId=${encData}`);
      },
        (err) => {
          this.context.showAlert({ type: "error", message: err.message || "Import Bot Failed" });
        })
    }
  }

  render() {
    let _this = this;
    let form = (
      <Fragment>
        <div className="userdash_section">
          <p className="userdash_heading">Let’s create Chat Interface together!</p>
          <p className="userdash_title">
            Follow our list, step by step, to get your Chat Interface ready for launch!
            {/* excepteur sint reprehenderit in volu.. */}
          </p>
          <div className="userdash_container">
            <div className="userdash_box">
              <div className="create_chat_box">
                <img src={img1} alt=""/>
                <div>
                  <p className="welcome_text">Welcome</p>
                  <p className="chatsub_text">
                    Congratulations on setting up your uis aute irure dolor in
                    {/* reprehenderit in voluptate velit */}
                  </p>
                </div>
              </div>
              <div className="tutorial_box">
                <ReactPlayer
                  url="https://www.youtube.com/watch?v=9M2wh2mRQLY"
                  light={true}
                  // playing
                  controls
                />
                {/* <img src={window} />
                <img className="play_btn" src={play} /> */}
              </div>
            </div>
            <div className="userdash_box">
              <div className="create_chat_box">
                <img src={img2} alt="" />
                <div>
                  <p className="welcome_text">
                    Create new conversational experience
                  </p>
                  <p className="chatsub_text">
                    Create your first conversational experience or dis aute
                    {/* irure dolor in reprehenderit in voluptate velit */}
                  </p>
                  <div className="chat_btn_block">
                      <Link to="/user/create-form-scratch" className="chat_new_conv_btn">
                      <BiPlus />
                      Create from scratch
                      </Link>
                    <Link to="/user/templates" className="chat_new_conv_btn">
                      <HiOutlineTemplate />
                      Use template
                    </Link>
                    <label variant="contained" className="chat_new_conv_btn" htmlFor="chat_new_conv_import">
                    <input
                            accept="application/json"
                            id={
                              "chat_new_conv_import"
                            }
                            style={{ display: "none" }}
                            // multiple
                            type="file"
                            onChange={this.hanldeImportBot}
                          />
                      <BiImport />
                      Import Chat Interface
                    </label>
                  </div>
                </div>
              </div>
              <div className="tutorial_box">
                {/* <img src={window} />
                <img className="play_btn" src={play} /> */}
                <ReactPlayer
                  url="https://www.youtube.com/watch?v=_1weeqD9bik"
                  light={true}
                  // playing
                  controls
                />
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
    return (
      <Fragment>
        {this.state.alert}
        {/* {this.state.loading && (
          <Backdrop
            sx={{
              color: "#fff",
              zIndex: (theme) => theme.zIndex.drawer + 1
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
        )} */}
        {form}

        <Dialog
          open={this.state.showCompanyInfoModal}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="new-user-dashboard-model-block"
        >
          <DialogTitle id="alert-dialog-title">Update Details</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <CompanyDetailsComponent
                handleClosePop={() => {
                  _this.setState({
                    showCompanyInfoModal: false
                  });
                }}
                _this={_this}
                {..._this.props}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {/* <Button onClick={this.modelFirstClose}>Disagree</Button>
            <Button onClick={this.modelFirstClose} autoFocus>
              Agree
            </Button> */}
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

export default NewUserDashboardComponent;
