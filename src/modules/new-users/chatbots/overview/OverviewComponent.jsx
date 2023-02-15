import React, { Component, Fragment } from "react";
import trend from "../../../../assets/images/trending-up.svg";
import clock from "../../../../assets/images/clock.svg";
import mail from "../../../../assets/images/mail.svg";
import arrow from "../../../../assets/images/arrow.svg";
import upArrow from "../../../../assets/images/arrow-up (1).svg";
import { Grid } from "@mui/material";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import { getOverViewList } from "../server/UserChatBotServer.js";
import { decryptBot } from "../../../../js/encrypt";


export class OverviewComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      loading: false,
      botId: null,
      botName: "",
      average_response_per_day: "",
      lead_conversion_percentage: "",
      percent_increase_in_average_response_perday: "",
      percent_increase_in_lead_conversation: "",
      percent_increase_in_total_conversations: "",
      total_conversations: ""
    };
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    if (window.location.href.includes("?botId=")) {
      let data = window.location.href.split("?botId=")[1];
      var decryptedData = decryptBot(data);
      _this.setState({
        botId: decryptedData && decryptedData.botId,
        botName: decryptedData && decryptedData.botName
      }, () => {
        _this.fetchDataFromServer();
      });
    }
  }
  fetchDataFromServer = () => {
    let _this = this;
    let params = `botid=${_this.state.botId}`;
    _this.setState({ loading: true });
    getOverViewList(
      params,
      (res) => {
        _this.setState({
          loading: false,
          average_response_per_day: res.average_response_per_day,
          lead_conversion_percentage: res.lead_conversion_percentage,
          percent_increase_in_average_response_perday:
            res.percent_increase_in_average_response_perday,
          percent_increase_in_lead_conversation:
            res.percent_increase_in_lead_conversation,
          percent_increase_in_total_conversations:
            res.percent_increase_in_total_conversations,
          total_conversations: res.total_conversations
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
        <div className="overview_section">
          <p className="overview_title">{_this.state.botName}</p>
          <p className="overview_text">
            Last 30 days
          </p>
          <Grid container spacing={2}>
            <Grid item md={3} sm={6} xs={12}>
              <div className="review_box">
                <div className="review_icon">
                  <img alt="" src={trend} />
                </div>
                <p className="response_text">
                  Total vs New conversation
                </p>
                <div className="review_total_box">
                  <p className="review_total">
                    {_this.state.total_conversations > 0
                      ? _this.state.total_conversations.toFixed(2)
                      : _this.state.total_conversations}
                  </p>
                  <Fragment>
                    <p className="review_perc review_perc_green">
                      {`${_this.state.percent_increase_in_total_conversations}%`}
                      <img src={upArrow} />
                    </p>
                  </Fragment>
                </div>
              </div>
            </Grid>
            <Grid item md={3} sm={6} xs={12}>
              <div className="review_box">
                <div className="review_icon review_bg">
                  <img alt="" src={clock} />
                </div>
                <p className="response_text">Average response/day</p>
                <div className="review_total_box">
                  <p className="review_total">
                    {_this.state.average_response_per_day > 0
                      ? _this.state.average_response_per_day.toFixed(2)
                      : _this.state.average_response_per_day}
                  </p>
                  <Fragment>
                    <p className="review_perc">
                      {`${_this.state.percent_increase_in_average_response_perday}%`}{" "}
                      <img src={arrow} />
                    </p>
                  </Fragment>
                </div>
              </div>
            </Grid>{" "}
            <Grid item md={3} sm={6} xs={12}>
              <div className="review_box">
                <div className="review_icon review_bg2">
                  <img alt="" src={mail} />
                </div>
                <p className="response_text">
                  % Conversion to Lead
                  {/* <br /> conversion */}
                </p>
                <div className="review_total_box">
                  <p className="review_total">
                    {_this.state.lead_conversion_percentage > 0
                      ? _this.state.lead_conversion_percentage.toFixed(2)
                      : _this.state.lead_conversion_percentage}
                  </p>
                  <Fragment>
                    <p className="review_perc">
                      {`${_this.state.percent_increase_in_lead_conversation}%`}{" "}
                      <img src={arrow} />
                    </p>
                  </Fragment>
                </div>
              </div>
            </Grid>{" "}
            <Grid hidden={true} item md={3} sm={6} xs={12}>
              <div className="review_box">
                <div className="review_icon review_bg2">
                  <img alt="" src={mail} />
                </div>
                <p className="response_text">
                  Top
                  <br /> sources
                </p>
                <div className="review_total_box">
                  <p className="review_total">
                    {_this.state.lead_conversion_percentage > 0
                      ? _this.state.lead_conversion_percentage.toFixed(2)
                      : ""}
                  </p>
                  <Fragment>
                    <p className="review_perc">
                      16% <img src={arrow} />
                    </p>
                  </Fragment>
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </Fragment>
    );
    return (
      <Fragment>
        {_this.state.alert}
        {this.state.loading && (
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
        )}
        {form}
      </Fragment>
    );
  }
}

export default OverviewComponent;
