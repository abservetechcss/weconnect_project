import React, { Component, Fragment } from "react";
import {
  Button,

  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import BigCalendar from "react-big-calendar";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import copy from "../../../../assets/images/userdash/copy-1.svg";
import copy1 from "../../../../assets/images/userdash/copy-2.svg";
import downarrow from "../../../../assets/images/downarrow.svg";
import calendar from "../../../../assets/images/calendar.svg";
import YearWiseDropdown from "./components/Year";
import { getAppointmentList } from "./server/AppoinmentServer.js";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { decryptBot } from "../../../../js/encrypt";

const localizer = BigCalendar.momentLocalizer(moment); // or globalizeLocalizer
localizer.formats.yearHeaderFormat = "MMM YYYY";

export class AppointmentComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      loading: false,
      botId: null,
      botName: "",
      botItemList: [],
      appointmentDetails: {},
      future_appointments_list: [],
      appointment_list: [],
      events: [],
      copied: false,
      showAppointmentModal: false,
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
        botName: decryptedData && decryptedData.botName,
      });
      setTimeout(() => {
        _this.fetchDataFromServer();
      }, 1000);
    }
  }

  fetchDataFromServer = () => {
    let _this = this;
    _this.setState({ loading: true });
    let params = `botid=${_this.state.botId}`;
    getAppointmentList(
      params,
      (res) => {
        let tempObj = [];
        tempObj =
          res.appointment_list &&
          res.appointment_list.length > 0 &&
          res.appointment_list.map((prop) => {
            let startDate = new Date(prop.start_time);
            let endDate = new Date(prop.end_time);
            return {
              id: prop.id,
              title: prop.title,
              allDay: false,
              start: startDate,
              end: endDate,
              name: prop.name,
              date: prop.date,
              url: prop.url,
              end_time: moment(prop.end_time).format("HH:mm a"),
              start_time: moment(prop.start_time).format("HH:mm a")
            };
          });
        let newObj = [];
        newObj =
          res.future_appointments_list &&
          res.future_appointments_list.length > 0 &&
          res.future_appointments_list.map((prop) => {
            var days = 0;

            var endDate = moment(prop.date).add(1, "days");
            var today = moment();
            days = endDate.diff(today, "days");
            if (days === 0) {
              prop.showDate = "Today";
            } else if (days === 1) {
              prop.showDate = "Tomorrow";
            } else {
              prop.showDate = `${moment(prop.date).format("DD MMM yyyy")}`;
            }
            prop.value = false;
            prop.copied = false;
            return prop;
          });
        _this.setState({
          loading: false,
          future_appointments_list: newObj,
          events: tempObj && tempObj.length > 0 ? tempObj : [],
        });
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };

  render() {
    let _this = this;
    const { classes } = this.props;
    let form = (
      <div className="appointment_section">
        <div className="appointment_block">
          <div className="calendar_block">
            <BigCalendar
              events={_this.state.events}
              views={{
                day: true,
                week: true,
                month: true,
                year: YearWiseDropdown,
              }}
              selectable
              step={60}
              localizer={localizer}
              defaultDate={new Date()}
              onSelectEvent={(event) => {
                _this.setState({
                  appointmentDetails: event,
                });
                setTimeout(() => {
                  _this.setState({
                    showAppointmentModal: true,
                  });
                  // window.open(temp.url, "_blank");
                }, 1000);
              }}
              onSelectSlot={(slotInfo) => {
                // console.log(slotInfo);
              }}
              messages={{ year: "Year" }}
            />
          </div>

          <div className="appointment_visitor_block">
            <div className="visitor_header">
              <p className="visitor_header_title">Upcoming Appointments</p>
              {/* <p className="visitor_header_date">13 Monday</p> */}
            </div>
            <div className="visitor_meetings">
              {" "}
              <div className="meetings_box">
                {_this.state.future_appointments_list &&
                _this.state.future_appointments_list.length > 0 ? (
                  _this.state.future_appointments_list.map((prop, index) => {
                    if (prop.value) {
                      return (
                        <Fragment>
                          <p className="upcoming_text">{`${prop.showDate} `}</p>
                          <div className="meeting_link_box">
                            <div className="visitor_id_box ">
                              <div className="d-flex align-items-center">
                                <div className="calendar_icon">
                                  <img alt="" src={calendar} />
                                </div>
                                <div>
                                  <p className="visitor_id_text">
                                    {`${prop.name}`}
                                  </p>
                                  <p className="visitor_time">
                                    {`${prop.from_time} - ${prop.to_time}`}
                                  </p>
                                </div>
                              </div>

                              <div
                                role="button"
                                onClick={() => {
                                  let temp =
                                    _this.state.future_appointments_list;
                                  temp[index].value = false;
                                  _this.setState({
                                    future_appointments_list: temp,
                                  });
                                }}
                                className="downarrow_img"
                              >
                                <img alt="" src={downarrow} />
                              </div>
                            </div>
                            <div className="visitor_id_box meeting_border_box">
                              <div>
                                <p className="meeting_link_text">
                                  Meeting Link
                                </p>
                                <p
                                  role="button"
                                  onClick={() => {
                                    window.open(prop.meeting_link, "_blank");
                                  }}
                                  className="meeting_link_text link_underline"
                                >
                                  {`${prop.meeting_link}`}
                                </p>
                              </div>
                              <CopyToClipboard
                                text={prop.meeting_link}
                                onCopy={() => {}}
                              >
                                <div role="button" className="copycontent_img">
                                  <img src={copy} />
                                </div>
                              </CopyToClipboard>
                            </div>

                            <div className="visitor_btn_box">
                              <Button
                                type="button"
                                onClick={() => {
                                  window.open(prop.meeting_link, "_blank");
                                }}
                                className="meet_join_btn"
                              >
                                Join
                              </Button>
                            </div>
                          </div>
                        </Fragment>
                      );
                    } else {
                      return (
                        <Fragment>
                          <p className="upcoming_text">{`${prop.showDate}`}</p>
                          <div className="meeting_link_box visitor_box">
                            <div className="visitor_id_box">
                              <div className="d-flex align-items-center">
                                <div className="calendar_icon">
                                  <img src={calendar} />
                                </div>
                                <div>
                                  <p className="visitor_id_text">
                                    {`${prop.name}`}
                                  </p>
                                  <p className="visitor_time">
                                    {`${prop.from_time} - ${prop.to_time}`}
                                  </p>
                                </div>
                              </div>
                              <div
                                role="button"
                                onClick={() => {
                                  let temp =
                                    _this.state.future_appointments_list;
                                  temp[index].value = true;
                                  _this.setState({
                                    future_appointments_list: temp,
                                  });
                                }}
                                className="downarrow_img"
                              >
                                <img src={downarrow} />
                              </div>
                            </div>
                            <div className="visitor_btn_box">
                              <CopyToClipboard
                                text={prop.meeting_link}
                                onCopy={() => this.setState({ copied: true })}
                              >
                                <Button className="visitor_btn">
                                  <img role="button" src={copy} />
                                  Copy Link
                                </Button>
                              </CopyToClipboard>

                              <Button
                                type="button"
                                onClick={() => {
                                  window.open(prop.meeting_link, "_blank");
                                }}
                                className="visitor_btn join_btn"
                              >
                                Join
                              </Button>
                            </div>
                          </div>
                        </Fragment>
                      );
                    }
                  })
                ) : _this.state.loading ? 
                (
                  <div className="text-center alert alert-danger">
                    Loading...
                  </div>
                ) :
                (
                  <div className="text-center alert alert-danger">
                    No Data Found!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <Dialog
          open={_this.state.showAppointmentModal}
          onClose={() => {
            _this.setState({
              showAppointmentModal: false,
            });
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          className="knowdledge-base-edit-model-popup-block header-language-model-popup-block setting-modal-block-popup appointment_modal_popup"
        >
          <DialogTitle id="alert-dialog-title">Appointment Details</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              <div className="desc-block">
                <p>
                  Name:{" "}
                  {_this.state.appointmentDetails &&
                    _this.state.appointmentDetails.name}
                </p>
                <p>
                  Date:{" "}
                  {_this.state.appointmentDetails &&
                    _this.state.appointmentDetails.date}
                </p>
                <p>
                  Time:
                  {`${
                    _this.state.appointmentDetails &&
                    _this.state.appointmentDetails.start_time
                  } - ${
                    _this.state.appointmentDetails &&
                    _this.state.appointmentDetails.end_time
                  }`}
                </p>
                <Button
                  type="button"
                  onClick={() => {
                    setTimeout(() => {
                      _this.setState({
                        showAppointmentModal: false
                      });
                    }, 1000);
                    window.open(
                      _this.state.appointmentDetails &&
                        _this.state.appointmentDetails.url,
                      "_blank"
                    );
                  }}
                  className="meet_join_btn"
                >
                  Join Link
                </Button>
              </div>
            </DialogContentText>
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      </div>
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

export default AppointmentComponent;
