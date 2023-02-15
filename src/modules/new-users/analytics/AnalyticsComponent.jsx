import React, { Component, Fragment } from "react";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import img1 from "../../../assets/images/userdash/Group 20352.svg";
import { Autocomplete, Button, TextField } from "@mui/material";
import { connect } from "react-redux";
import {
  setInnerSideBar,
  setSelectBotDetails,
} from "../../../redux/actions/ReduxActionPage.jsx";
import { getAdminChatBotList } from "../../agent/dashboard/server/DashboardServer.js";
import { encryptBot, decryptBot } from "../../../js/encrypt";

export class AnalyticsComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      loading: false,
      botId: null,
      botName: "",
      botItemList: [],
    };
  }
  componentDidMount() {
    let _this = this;
    if (window.location.href.includes("?botId=")) {
      let data = window.location.href.split("?botId=")[1];
      var decryptedData = decryptBot(data);
      _this.setState({
        botId: decryptedData && decryptedData.botId,
        botName: decryptedData && decryptedData.botName,
      });
    }
    window.scrollTo(0, 0);
    _this.fetchChatBotData();
  }
  fetchChatBotData = () => {
    let _this = this;
    _this.setState({ loading: true });
    getAdminChatBotList(
      _this,
      "",
      (res) => {
        _this.setState({ loading: false });
        let selectBot = res.selectedBot && res.selectedBot;
        let newObj =
          res.bot_list && Array.isArray(res.bot_list) && res.bot_list.length > 0
            ? res.bot_list.map((prop) => {
                return {
                  id: prop.bot_id,
                  label: prop.bot_name,
                  value: prop.bot_id,
                };
              })
            : [];
        _this.setState({
          botItemList: newObj,
          loading: false,
        });
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };
  render() {
    let _this = this;
    let form = (
      <Fragment>
        <div className="createchat_section">
          <div>
            <p className="createchat_heading">Select Chat Interface</p>
            <p className="createchat_title">
              {/* Excepteur sint occaecat cupidatat excepteur sint occaecat
              cupidatat non proident, sunt in culpanon proident, sunt in culpa */}
            </p>
            <div className="chat_input_box">
              {" "}
              <Autocomplete
                disablePortal
                id="combo-box-demo"
                name="selectBotId"
                options={_this.state.botItemList}
                value={_this.state.botName}
                onChange={(e, option) => {
                  _this.setState({
                    botId: option.value,
                    botName: option.label,
                  });
                  if (option && option.label !== undefined) {
                  }
                }}
                className="chat_bot_select"
                sx={{ width: 300 }}
                renderInput={(params) => (
                  <TextField {...params} label="Select Chat Interface" />
                )}
              />
              <div className="chat_btn_box">
                <Button
                  className="create_btn"
                  variant="contained"
                  onClick={() => {
                    let obj = {};
                    obj.innerSideBarActive = true;
                    obj.botName = _this.state.botName;
                    obj.botId = _this.state.botId;
                    _this.props.setInnerSideBarActive(obj);
                    _this.props.setSelectBotList(obj);
                    const encData = encryptBot(
                      _this.state.botId,
                      _this.state.botName
                    );
                    setTimeout(() => {
                      this.props.history.push(
                        `/user/analytics/indicators?botId=${encData}`
                      );
                    }, 500);
                  }}
                >
                  Show Analytics
                </Button>
              </div>
            </div>
          </div>
          <div className="chat_img">
            <img src={img1} alt="" />
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
const mapDispatchToProps = (dispatch) => {
  return {
    setInnerSideBarActive: (data) => {
      dispatch(setInnerSideBar(data));
    },
    setSelectBotList: (data) => {
      dispatch(setSelectBotDetails(data));
    },
  };
};

export default connect(null, mapDispatchToProps)(AnalyticsComponent);
