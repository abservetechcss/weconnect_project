import {
  Autocomplete,
  Button,
  ButtonGroup,
  Grid,
  TextField,
} from "@mui/material";
import React, { Component } from "react";
import VerticalBarChartComponent from "./components/VerticalBarChartComponent.jsx";
import trend from "../../../assets/images/trending-up.svg";
import clock from "../../../assets/images/clock.svg";
import mail from "../../../assets/images/mail.svg";
import arrow from "../../../assets/images/arrow.svg";
import downarrow from "../../../assets/images/downarrow.svg";
import calendar from "../../../assets/images/calendar.svg";
import { getChatBotList } from "./server/DashboardServer.js";

export class AgentDashboardComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    let _this = this;
    window.scrollTo(0, 0);
    _this.fetchDataFromServer();
  }
  fetchDataFromServer() {
    let _this = this;
    let params = ``;
    _this.setState({ loading: true });
    getChatBotList(
      params,
      (res) => {},
      () => {
        _this.setState({ loading: false, data: [] });
      }
    );
  }
  render() {
    let _this = this;
    return (
      <div className="dashboard_component">
        <div className="chat_bot_box">
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            options={["top100Films"]}
            className="chat_bot_select"
            sx={{ width: 300 }}
            // sx={{
            //   width: 300,
            //   ".MuiOutlinedInput-root": {
            //     "&:focus": {
            //       borderRadius: 50,
            //       borderColor: "yellow",
            //       borderWidth: 10
            //     }
            //   }
            // }}
            renderInput={(params) => (
              <TextField {...params} label="Select Chat Interface"  variant="outlined" />
            )}
          />
          <p>Customize dashboard</p>
        </div>
        <div className="dash_grid">
          <div className="dash_grid_left">
            <Grid container spacing={2}>
              <Grid item xs={4}>
                <div className="review_box">
                  <div className="review_icon">
                    <img src={trend} />
                  </div>
                  <p className="response_text">Total response</p>
                  <div className="review_total_box">
                    <p className="review_total">665</p>
                    <p className="review_perc">
                      66% <img src={arrow} />
                    </p>
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="review_box">
                  <div className="review_icon review_bg">
                    <img src={clock} />
                  </div>
                  <p className="response_text">Average response/day</p>
                  <div className="review_total_box">
                    <p className="review_total">665</p>
                    <p className="review_perc">
                      {" "}
                      66% <img src={arrow} />
                    </p>
                  </div>
                </div>
              </Grid>
              <Grid item xs={4}>
                <div className="review_box">
                  <div className="review_icon review_bg2">
                    <img src={mail} />
                  </div>
                  <p className="response_text">Offline messages</p>
                  <div className="review_total_box">
                    <p className="review_total">665</p>
                    <p className="review_perc">
                      {" "}
                      66% <img src={arrow} />
                    </p>
                  </div>
                </div>
              </Grid>
            </Grid>
            <div className="response_chart_section">
              <p className="chart_title">Responses</p>

              <div className="chart_box">
                <ButtonGroup
                  variant="outlined"
                  aria-label="outlined button group"
                >
                  <Button className="month_text">Month</Button>
                  <Button className="month_text">Week</Button>
                  <Button className="month_text">Day</Button>
                </ButtonGroup>
                <VerticalBarChartComponent {..._this.props} />
              </div>
            </div>
          </div>
          <div className="dash_grid_right">
            <p className="appoint_text">Appointments</p>
            <div className="meetings_box">
              <p className="upcoming_text">Upcoming meeting</p>
              <div className="meeting_link_box">
                <div className="visitor_id_box ">
                  <div className="d-flex align-items-center">
                    <div className="calendar_icon">
                      <img src={calendar} />
                    </div>
                    <div>
                      <p className="visitor_id_text">Visitor-10-070122</p>
                      <p className="visitor_time">09:45 AM - 10:00 AM</p>
                    </div>
                  </div>
                  <div className="downarrow_img">
                    <img src={downarrow} />
                  </div>
                </div>
                <div className="visitor_id_box meeting_border_box">
                  <div>
                    <p className="meeting_link_text">Meeting Link</p>
                    <p className="meeting_link_text link_underline">
                      meet.weconnect.chat/hh6kddw
                    </p>
                  </div>
                  <div className="downarrow_img">
                    <img src={downarrow} />
                  </div>
                </div>
                <div className="visitor_btn_box">
                  <Button className="meet_join_btn">Join</Button>
                </div>
              </div>
              <div className="meeting_link_box visitor_box">
                <div className="visitor_id_box">
                  <div className="d-flex align-items-center">
                    <div className="calendar_icon">
                      <img src={calendar} />
                    </div>
                    <div>
                      <p className="visitor_id_text">Visitor-10-070122</p>
                      <p className="visitor_time">09:45 AM - 10:00 AM</p>
                    </div>
                  </div>
                  <div className="downarrow_img">
                    <img src={downarrow} />
                  </div>
                </div>
                <div className="visitor_btn_box">
                  <Button className="visitor_btn">Copy Link</Button>
                  <Button className="visitor_btn join_btn">Join</Button>
                </div>
              </div>
              <div className="meeting_link_box visitor_box">
                <div className="visitor_id_box">
                  <div className="d-flex align-items-center">
                    <div className="calendar_icon">
                      <img src={calendar} />
                    </div>
                    <div>
                      <p className="visitor_id_text">Visitor-10-070122</p>
                      <p className="visitor_time">09:45 AM - 10:00 AM</p>
                    </div>
                  </div>
                  <div className="downarrow_img">
                    <img src={downarrow} />
                  </div>
                </div>
                <div className="visitor_btn_box">
                  <Button className="visitor_btn">Copy Link</Button>
                  <Button className="visitor_btn join_btn">Join</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AgentDashboardComponent;
