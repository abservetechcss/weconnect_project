// import PropTypes from 'prop-types'
import React, { Fragment } from "react";
import moment from "moment";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions
} from "@mui/material";
import dates from "react-big-calendar/lib/utils/dates";
import { navigate } from "react-big-calendar/lib/utils/constants";
import { getAppointmentList } from "../server/AppoinmentServer.js";
import { decryptBot } from "../../../../../js/encrypt";

function createCalendar(currentDate) {
  if (!currentDate) {
    currentDate = moment();
  } else {
    currentDate = moment(currentDate);
  }

  const first = currentDate.clone().startOf("month");
  const last = currentDate.clone().endOf("month");
  const weeksCount = Math.ceil((first.day() + last.date()) / 7);
  const calendar = Object.assign([], { currentDate, first, last });

  for (let weekNumber = 0; weekNumber < weeksCount; weekNumber++) {
    const week = [];
    calendar.push(week);
    calendar.year = currentDate.year();
    calendar.month = currentDate.month();

    for (let day = 7 * weekNumber; day < 7 * (weekNumber + 1); day++) {
      const date = currentDate.clone().set("date", day + 1 - first.day());
      date.calendar = calendar;
      week.push(date);
    }
  }

  return calendar;
}

function CalendarDate(props) {
  const { dateToRender, dateOfMonth } = props;
  const today =
    dateToRender.format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")
      ? "today"
      : "";

  if (dateToRender.month() < dateOfMonth.month()) {
    return (
      <button disabled={true} className="date prev-month">
        {dateToRender.date()}
      </button>
    );
  }

  if (dateToRender.month() > dateOfMonth.month()) {
    return (
      <button disabled={true} className="date next-month">
        {dateToRender.date()}
      </button>
    );
  }
  if (props.events && props.events.length > 0) {
    let temp = props.events.filter((x) => {
      return (
        moment(x.start).format("YYYY-MM-DD") ===
        moment(dateToRender).format("YYYY-MM-DD")
      );
    })[0];
    if (
      props.events.filter((x) => {
        return (
          moment(x.start).format("YYYY-MM-DD") ===
          moment(dateToRender).format("YYYY-MM-DD")
        );
      }).length > 0
    ) {
      return (
        <button
          className={`date in-month ${today}`}
          onClick={() => props.onClick(dateToRender)}
          style={{ backgroundColor: "#00434f" }}
        >
          {dateToRender.date()}
        </button>
      );
    } else {
      return (
        <button
          className={`date in-month ${today}`}
          onClick={() => props.onClick(dateToRender)}
        >
          {dateToRender.date()}
        </button>
      );
    }
  } else {
    return (
      <button
        className={`date in-month ${today}`}
        onClick={() => props.onClick(dateToRender)}
      >
        {dateToRender.date()}
      </button>
    );
  }
}

class Calendar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alert: null,
      loading: false,
      botId: null,
      botName: "",
      botItemList: [],
      future_appointments_list: [],
      appointment_list: [],
      events: [],
      calendar: undefined,
      showAppointmentModal: false,
      appointmentDetails: {}
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.date !== prevProps.date) {
      this.setState({ calendar: createCalendar(this.props.date) });
    }
  }
  componentDidMount() {
    let _this = this;
    this.setState({ calendar: createCalendar(this.props.date) });
    if (window.location.href.includes("?botId=")) {
      let data = window.location.href.split("?botId=")[1];
      var decryptedData = decryptBot(data);
      _this.setState({
        botId: decryptedData && decryptedData.botId,
        botName: decryptedData && decryptedData.botName
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
        _this.setState({
          loading: false,
          future_appointments_list: res.future_appointments_list,
          events: tempObj && tempObj.length > 0 ? tempObj : []
        });
      },
      () => {
        _this.setState({ loading: false });
      }
    );
  };
  render() {
    let _this = this;
    if (!this.state.calendar) {
      return null;
    }

    return (
      <Fragment>
        <div className="month">
          <div className="month-name">
            {this.state.calendar.currentDate.format("MMMM").toUpperCase()}
          </div>
          {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
            <span key={index} className="day">
              {day}
            </span>
          ))}
          {this.state.calendar.map((week, index) => (
            <div key={index}>
              {week.map((date) => (
                <CalendarDate
                  events={this.state.events}
                  key={date.date()}
                  dateToRender={date}
                  dateOfMonth={this.state.calendar.currentDate}
                  onClick={(date) => {
                    if (this.state.events && this.state.events.length > 0) {
                      let temp = this.state.events.filter((x) => {
                        return (
                          moment(x.start).format("YYYY-MM-DD") ===
                          moment(date).format("YYYY-MM-DD")
                        );
                      })[0];
                      if (
                        this.state.events.filter((x) => {
                          return (
                            moment(x.start).format("YYYY-MM-DD") ===
                            moment(date).format("YYYY-MM-DD")
                          );
                        }).length > 0
                      ) {
                        _this.setState({
                          appointmentDetails: temp
                        });
                        setTimeout(() => {
                          _this.setState({
                            showAppointmentModal: true
                          });
                          // window.open(temp.url, "_blank");
                        }, 1000);
                      }
                    }
                  }}
                />
              ))}
            </div>
          ))}
        </div>
        <Dialog
          open={_this.state.showAppointmentModal}
          onClose={() => {
            _this.setState({
              showAppointmentModal: false
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
      </Fragment>
    );
  }
}

class Year extends React.Component {
  render() {
    let { date, ...props } = this.props;
    let range = Year.range(date);
    const months = [];
    const firstMonth = dates.startOf(date, "year");

    for (let i = 0; i < 12; i++) {
      months.push(
        <Calendar key={i + 1} date={dates.add(firstMonth, i, "month")} />
      );
    }

    return <div className="year">{months.map((month) => month)}</div>;
  }
}

// Day.propTypes = {
//   date: PropTypes.instanceOf(Date).isRequired,
// }

Year.range = (date) => {
  return [dates.startOf(date, "year")];
};

Year.navigate = (date, action) => {
  switch (action) {
    case navigate.PREVIOUS:
      return dates.add(date, -1, "year");

    case navigate.NEXT:
      return dates.add(date, 1, "year");

    default:
      return date;
  }
};

Year.title = (date, { localizer }) =>
  localizer.format(date, "yearHeaderFormat");

export default Year;
