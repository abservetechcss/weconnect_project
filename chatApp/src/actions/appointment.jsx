import { Text, Reply, CommonReply, CustomReply } from "../components";
import React, { useContext } from "react";
// import Calendar from "../calendar/Calendar";
import Calendar from "react-calendar";
import styled from "styled-components";
// import "../assets/css/botnic.scss";
import { WebchatContext } from "../contexts";
// import "../assets/css/appointment.css";
// import "../assets/css/calendar.scss";
import HiArrowLeft from "../assets/react-icons/HiArrowLeft";
import HiArrowRight from "../assets/react-icons/HiArrowRight";
import BsGlobe2 from "../assets/react-icons/BsGlobe2";
import MdKeyboardArrowLeft from "../assets/react-icons/MdKeyboardArrowLeft";
import TextField from "@mui/material/TextField";
import SelectUnstyled, {
  selectUnstyledClasses,
} from "@mui/base/SelectUnstyled";
import OptionUnstyled, {
  optionUnstyledClasses,
} from "@mui/base/OptionUnstyled";
import PopperUnstyled from "@mui/base/PopperUnstyled";
import MuiStyled from "@mui/system/styled";

import flags from "../assets/flag_map.js";
import "yet-another-abortcontroller-polyfill";
import { fetch } from "whatwg-fetch";
import { WEBCHAT } from "../constants";
// const flags = import(
//    /* webpackMode: "lazy" */
//   "../assets/flag_map.js");
let moment;

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: "auto",
    },
  },
};

const ErrorContainer = styled.div`
  color: red;
`;

const Flag = styled.img`
  display: inline-block;
  width: 1em;
  height: 1em;
  vertical-align: middle;
  margin-right: 10px;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const FormGroup = styled.div`
  padding: 10px 0px;
  width: 100%;
`;
const Button = styled.button`
  height: 40px;
  border: 1px solid #32e0a1;
  background: #32e0a1;
  border-radius: 20px;
  margin-top: 5px;
  text-align: center;
  color: #1e1e1e;
  font-family: inherit;
  cursor: pointer;
  padding: 0 15px;
`;

const BackButton = styled.button`
  height: 40px;
  border-radius: 20px;
  margin-top: 5px;
  background: #fff;
  font-family: inherit;
  padding: 0 15px;
  text-align: center;
  border: 1px solid #00424f;
  margin-right: 10px;
  color: #00424f;
  cursor: pointer;
`;

const CalendarContainer = styled.div`
  text-align: left;
  -webkit-box-shadow: 0 7px 12px 0 rgb(62 57 107 / 16%);
  font-size: 14px;
  // box-shadow: 0px 6px 25px #30385236;
  border-radius: 10px;
  padding: 10px 20px;
  background: #fff;
  max-width: 270px;
  width: 100%;
  margin: ${(props) =>
    props.deviceMode === "mobile"
      ? "0 auto"
      : props.deviceMode === "tablet"
      ? "0px 50px 15px 50px"
      : "0px 50px 15px 50px"};
`;

const blue = {
  100: "#DAECFF",
  200: "#99CCF3",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  100: "#E7EBF0",
  200: "#E0E3E7",
  300: "#CDD2D7",
  400: "#B2BAC2",
  500: "#A0AAB4",
  600: "#6F7E8C",
  700: "#3E5060",
  800: "#2D3843",
  900: "#1A2027",
};

const StyledButton = MuiStyled("button")(
  ({ theme }) => `
      font-size: 0.875rem;
    box-sizing: border-box;
    min-width: 110px;
    background: #fff;
    border: 1px solid #CDD2D7;
    border-radius: 6px;
    padding: 10px;
    line-height: 1;
    vertical-align: top;
    height: 40px;
    margin: 0px;
    margin-right: 5px;

  &:hover {
    background: ${theme.palette.mode === "dark" ? "" : grey[100]};
    border-color: ${theme.palette.mode === "dark" ? grey[700] : grey[400]};
  }

  &.${selectUnstyledClasses.focusVisible} {
    outline: 3px solid ${theme.palette.mode === "dark" ? blue[600] : blue[100]};
  }

  &.${selectUnstyledClasses.expanded} {
    &::after {
      content: '▴';
    }
  }

  &::after {
    content: '▾';
    float: right;
  }

  & img {
    margin-right: 10px;
  }
  `
);

const StyledListbox = MuiStyled("ul")(
  ({ theme }) => `
  font-family: IBM Plex Sans, sans-serif;
  font-size: 0.875rem;
  box-sizing: border-box;
  padding: 5px;
  margin: 10px 0;
  max-height: 300px;
  background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
  border: 1px solid ${theme.palette.mode === "dark" ? grey[800] : grey[300]};
  border-radius: 0.75em;
  color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  overflow: auto;
  outline: 0px;
  `
);

const StyledOption = MuiStyled(OptionUnstyled)(
  ({ theme }) => `
  list-style: none;
  padding: 8px;
  border-radius: 0.45em;
  cursor: default;
  background:white !important;

  &:last-of-type {
    border-bottom: none;
  }

  &.${optionUnstyledClasses.selected} {
    background-color: ${theme.palette.mode === "dark" ? blue[900] : blue[100]};
    color: ${theme.palette.mode === "dark" ? blue[100] : blue[900]};
  }

  &.${optionUnstyledClasses.highlighted} {
    background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[100]};
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  }

  &.${optionUnstyledClasses.highlighted}.${optionUnstyledClasses.selected} {
    background-color: ${theme.palette.mode === "dark" ? blue[900] : blue[100]};
    color: ${theme.palette.mode === "dark" ? blue[100] : blue[900]};
  }

  &.${optionUnstyledClasses.disabled} {
    color: ${theme.palette.mode === "dark" ? grey[700] : grey[400]};
  }

  &:hover:not(.${optionUnstyledClasses.disabled}) {
    background-color: ${theme.palette.mode === "dark" ? grey[800] : grey[100]};
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
  }

  & img {
    margin-right: 10px;
  }
  `
);

const StyledPopper = MuiStyled(PopperUnstyled)`
  z-index: 1;
`;

const CustomSelect = React.forwardRef(function CustomSelect(props, ref) {
  const components = {
    Root: StyledButton,
    Listbox: StyledListbox,
    Popper: StyledPopper,
    ...props.components,
  };

  return <SelectUnstyled {...props} ref={ref} components={components} />;
});

// const { webchatState, getThemeProperty } = useContext(WebchatContext);

let ajaxRequest = null;
export default class Appointment extends React.Component {
  static contextType = WebchatContext;

  constructor(props, context) {
    let dialCode = "";
    const countryCode =
      context.webchatState.session && context.webchatState.session.environment
        ? context.webchatState.session.environment.country_code
        : "";
    let index = 0;
    while (index < flags.length) {
      const item = flags[index];
      if (item.isoCode === countryCode) {
        dialCode = item.dialCode;
        break;
      }
      index++;
    }
    super(props);
    this.state = {
      date: new Date(),
      reply: false,
      disableCalendar: false,
      step: 0,
      timeslot: [],
      selectedTimeSlot: null,
      phoneno: "",
      company: "",
      email: "",
      name: "",
      error: false,
      finalTime: new Date(),
      selectedDate: "",
      selectedTime: "1:00 PM Thursday, 18 October 2022",
      dialcode: dialCode,
    };
    this.disableDate = this.disableDate.bind(this);
    this.backToDate = this.backToDate.bind(this);
    this.backToTime = this.backToTime.bind(this);
    this.verifiedForm = this.verifiedForm.bind(this);
    this.submit = this.submit.bind(this);

    this.devicemode = context.getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.DEVICEMODE,
      "desktop"
    );
  }

  static async botonicInit(req, context) {
    const item = req.input.item || {}; // meesage from api
    item.timezone =
      req.session &&
      req.session.environment &&
      req.session.environment.time_zone
        ? req.session.environment.time_zone
        : "";
    moment = (await import("moment-timezone")).default;
    const workDays = item.component.available_day.split(",");
    const weekOff = ["0", "1", "2", "3", "4", "5", "6"]
      .filter((item) => {
        if (!workDays.includes(item)) return true;
      })
      .map((item) => parseInt(item));
    item.weekoff = weekOff;

    // const startDate = moment(item.component.start_date, "YYYY-MM-DD").subtract(1, "day");
    // const endDate = moment(item.component.end_date, "YYYY-MM-DD").add(1, "day");
    // if(startDate.isValid() && endDate.isValid()) {
    //   item.startDate = startDate;
    //   item.endDate = endDate;
    // } else {
    //   item.startDate = "";
    //   item.endDate = "";
    // }
    item.bot = {};
    if (req.session && req.session.bot) {
      item.bot = req.session.bot;
    }

    return item;
  }

  handleChange = (event) => {
    this.setState({ [event.target.dataset.label]: event.target.value });
  };

  fetchTimeSlot = async (date) => {
    try {
      this.setState({
        disableCalendar: true,
      });
      let selectedDate = moment(date);
      // let fromTime = currentDate.time(spacetime(this.props.component.from_time).goto(timezone).time());
      // let toTime = currentDate.time(spacetime(this.props.component.to_time).goto(timezone).time());
      // let fromTime = "10:00 AM";
      // let toTime = "12:00 PM";
      let fromTime = this.props.component.from_time;
      let toTime = this.props.component.to_time;
      var duration = this.props.component.duration;
      fromTime = moment(fromTime, "hh:mm A");
      toTime = moment(toTime, "hh:mm A");

      // get fromtime & toTime based on user timezone
      // const userTimezone= "America/New_York";
      // const clientTimezone = "Asia/kolkata";
      const userTimezone = this.props.timezone;
      const clientTimezone = this.props.botdetails.time_zone;

      // get from time & to time based on usertime & server time zone
      var clientFromTime = moment.tz(clientTimezone);
      var clientToTime = moment.tz(clientTimezone);

      clientFromTime.hour(fromTime.get("hour"));
      clientFromTime.minute(fromTime.get("minute"));

      clientToTime.hour(toTime.get("hour"));
      clientToTime.minute(toTime.get("minute"));

      //move clientfromtime to user time
      clientFromTime.tz(userTimezone);
      clientToTime.tz(userTimezone);

      clientFromTime.set("date", 1);
      clientToTime.set("date", 1);
      // if(toTime.get('hour')===0) {
      //   clientToTime.set("date", 2);
      // }

      if (!clientToTime.isAfter(clientFromTime)) {
        clientToTime.set("date", 2);
      }

      let maxTimeSlot = 0;
      const timeSlot = [];
      const isToday =
        selectedDate.format("yyyy-MM-DD") === moment().format("yyyy-MM-DD");
      let minutesofDay = 0;
      if (isToday) {
        const currentTime = moment.tz(clientTimezone);
        minutesofDay = currentTime.get("hour") * 60 + fromTime.get("minute");
      }
      // print time slots
      while (clientToTime.isAfter(clientFromTime) && maxTimeSlot < 300) {
        if (isToday) {
          const myMinutesofDay =
            clientFromTime.get("hour") * 60 + clientFromTime.get("minute");
          if (myMinutesofDay > minutesofDay)
            timeSlot.push(clientFromTime.format("hh:mm A"));
        } else {
          timeSlot.push(clientFromTime.format("hh:mm A"));
        }

        clientFromTime.add(duration, "minutes");
        ++maxTimeSlot;
      }

      if (clientFromTime.format("hh:mm A") === clientToTime.format("hh:mm A")) {
        if (isToday) {
          const myMinutesofDay =
            clientFromTime.get("hour") * 60 + clientFromTime.get("minute");
          if (myMinutesofDay > minutesofDay)
            timeSlot.push(clientFromTime.format("hh:mm A"));
        } else {
          timeSlot.push(clientFromTime.format("hh:mm A"));
        }
      }

      // filter out time slots from api

      if (this.controller) {
        this.controller.abort();
      }
      const abortableFetch = "signal" in new Request("") ? window.fetch : fetch;

      this.controller = new AbortController();

      const formatedDate = selectedDate.format("yyyy-MM-DD");
      var formData = new FormData();
      formData.append("bot_id", this.props.bot.id);
      formData.append("question_id", this.props.component.question_id);
      formData.append("date", formatedDate);

      // formData.append("client_id", this.props.bot.client_id);

      const res = await abortableFetch(
        process.env.REACT_APP_ENV_API_URL + `websocket/appointmentcheck`,
        {
          method: "post",
          signal: this.controller.signal,
          body: formData,
        }
      );

      if (!res.ok) {
        this.setState({
          disableCalendar: false,
        });
        return;
      }
      let filterTimeSlot = {};
      try {
        filterTimeSlot = await res.json();
      } catch (e) {
        this.setState({
          disableCalendar: false,
        });
        console.log("error:", e.message);
      }

      if (filterTimeSlot.slot) {
        // change all time slot to user's time
        filterTimeSlot.slot.forEach((item) => {
          let removeTime = moment.tz(
            item,
            "YYYY-MM-DD hh:mm A",
            clientTimezone
          );
          removeTime.tz(userTimezone);

          const index = timeSlot.indexOf(removeTime.format("hh:mm A"));
          if (index > -1) {
            timeSlot.splice(index, 1);
          }
        });
      }

      this.setState({
        timeslot: timeSlot,
        step: 1,
        selectedDate: formatedDate,
        finalTime: selectedDate,
        disableCalendar: false,
      });
    } catch (err) {
      this.setState({
        disableCalendar: false,
      });
    }
  };

  formatDate(date) {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    var d = new Date(date),
      month = d.getMonth(),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  setDate(date) {
    this.setState({
      date: date,
      selectedTimeSlot: null,
    });
    this.fetchTimeSlot(date);
  }
  submitDate() {
    if (this.state.selectedTimeSlot) {
      const sendData = {
        timeslot: this.state.selectedTimeSlot,
        phoneno: this.state.dialcode + "-" + this.state.phoneno,
        company: this.state.company,
        email: this.state.email,
        name: this.state.name,
      };
    }
  }
  changeTimeSlot(time) {
    const selecttime = moment(time, "hh:mm A");
    const finalTime = moment(this.state.finalTime);
    finalTime.hour(selecttime.get("hour"));
    finalTime.minute(selecttime.get("minute"));
    this.setState({
      selectedTimeSlot: time,
      step: 2,
      finalTime: finalTime,
    });
  }
  backToDate(e) {
    e.preventDefault();
    this.setState({
      step: 0,
    });
  }
  backToTime(e) {
    e.preventDefault();
    this.setState({
      step: 1,
    });
  }

  incorrectName() {
    return this.state.name.trim() == "";
  }

  incorrectEmail() {
    const emailRegex =
      /^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/;
    return !this.state.email.match(emailRegex) || this.state.email == "";
  }

  incorrectName() {
    return this.state.name.trim() == "";
  }

  verifiedForm() {
    if (!this.incorrectName() && !this.incorrectEmail()) {
      this.setState({
        error: false,
      });
      return true;
    } else {
      this.setState({
        error: true,
      });
    }
    return false;
  }

  submit(e) {
    e.preventDefault();
    if (this.verifiedForm()) {
      if (this.state.selectedTimeSlot) {
        const sendData = {
          timeslot: this.state.selectedTimeSlot,
          phoneno: this.state.dialcode + "-" + this.state.phoneno,
          company: this.state.company,
          email: this.state.email,
          name: this.state.name,
        };

        // change time slot to our time
        const timeSlot = moment(this.state.selectedTimeSlot, "hh:mm A");
        const date = moment(this.state.selectedDate, "YYYY-MM-DD");
        date.hour(timeSlot.get("hour"));
        date.minute(timeSlot.get("minute"));

        const clientTimezone = this.props.botdetails.time_zone;
        date.tz(clientTimezone);

        this.context.sendInput({
          noInput: true,
          data: this.state.selectedDate,
          item: {
            server: {
              time_slot: date.format("hh:mm A"),
              date: date.format("YYYY-MM-DD"),
            },
            time_slot: this.state.selectedTimeSlot,
            phone: this.state.dialcode + "-" + this.state.phoneno,
            company_name: this.state.company,
            email: this.state.email,
            name: this.state.name,
          },
        });

        this.setState({
          reply: true,
        });
      }
    }
  }
  disableDate({ activeStartDate, date, view }) {
    if (this.state.disableCalendar) {
      return true;
    }
    var today = new Date().setHours(0, 0, 0, 0);
    if (date.setHours(0, 0, 0, 0) < today) {
      return true;
    }
    const weekOff = this.props.weekoff.includes(date.getDay());
    if (weekOff) {
      return true;
    }
    // if(this.props.startDate!=="" && this.props.endDate!=="") {
    //   if(moment(date).isBetween(this.props.startDate, this.props.endDate)) {
    //     return false;
    //   } else {
    //     return true;
    //   }
    // };
    return false;
  }

  tileClassName({ activeStartDate, date, view }) {
    var today = new Date();
    if (
      date.getDate() == today.getDate() &&
      date.getMonth() == today.getMonth() &&
      date.getFullYear() == today.getFullYear()
    ) {
      return "weconnect_today";
    }
  }

  renderValue(option) {
    if (option == null) {
      return <span>Select an option...</span>;
    }

    return (
      <span>
        {option.name} ({option.name})
      </span>
    );
  }

  render() {
    return (
      <>
        <style>
          {`
        .weconnect_today {
          color: #000;
          background-color: #ffdb99;
          border-color: #ffb733;
        }
        .weconnect_today:hover {
          background-color: #ffcd70;
          border-color: #f59e00;
        }
        .react-calendar {
          border: none;
        }
        /* .appointment__CalendarContainer-weconnect__sc-wdnjxb-6 {
          padding: 20px 20px 60px!important;
          box-shadow: 0px 6px 25px #30385236!important;
          border-radius: 10px!important;
        } */
        .calender-block .react-calendar__navigation button svg {
          cursor: pointer;
        }
        .calender-block .react-calendar__navigation button {
          cursor: pointer;
        }
        .calender-block .react-calendar__navigation button:hover {
          background-color: #fff;
        }
        .calender-block abbr[title] {
          text-decoration: none !important;
        }

        .calender-block .react-calendar__month-view__weekdays {
          color: #d6d6d6;
        }
        .calender-block .react-calendar__month-view__weekdays__weekday abbr {
          display: block;
          visibility: hidden;
        }
        .calender-block
          .react-calendar__month-view__weekdays__weekday
          abbr:first-letter {
          visibility: visible;
          margin-left: 7px;
        }
        .calender-block .react-calendar__navigation {
          height: auto;
          display: flex;
          align-items: center;
          margin: 24px 0 12px;
        }
        .calender-block div,
        .calender-block span,
        .calender-block button,
        .calender-block p,
        .calender-block {
          font-family: inherit;
        }
        .calender-block .react-calendar__navigation__arrow {
          height: 18px;
          min-width: auto;
        }
        /* .react-calendar button{
                max-width: 11px!important;
        } */
        .react-calendar__tile {
          cursor:pointer;
        }
        .react-calendar__tile:disabled {
          background-color: #fff;
          border:unset;
          padding:.75em .5em
        }
        .calender-block div, .calender-block span, .calender-block button, .calender-block p, .calender-block{
          border:unset;
          background:unset
        }
        .weconnect_calendar_header {
            justify-content: space-between;
            padding: 0 16px;
            display: flex;
            font-size: 14px;
        }
        .weconnect_calendar_header div {
            font-family: inherit !important;
            letter-spacing: 0px;
            color: #1e1e1e;
            display: flex;
            align-items: center;
        }
        .timeLink {
            cursor: pointer;
            text-decoration: none !important;
            color: #000;
            display: flex;
            align-items: center;
        }
        .weconnect_calendar_header div svg {
            font-size: 20px;
            margin-right: 3px;
        }
        .timeslotContainer {
            white-space: normal;
            padding: 10px 0px;
        }
        .timeslotContainer {
            width: 100%;
            height: 100%;
            display: flex;
            flex-wrap: wrap;
            width: 100%;
            align-items: center;
            padding: 0 20px;
            justify-content: space-between;
        }
        .timeslotContainer .threecolumn {
            display: flex;
            align-items: center;
        }
        .timeslotContainer input[type=radio] {
            appearance: none;
            display: none;
        }
        .timeslotContainer p.apt_time {
            font-size: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: inherit;
            width: 80px;
            text-align: center;
            border-radius: 6px;
            height: 30px;
            overflow: hidden;
            border: 1px solid #00424f;
            font-family: inherit;
            transition: linear .3s;
            color: #00424f;
            margin: 6px 0 !important;
            cursor:pointer;
        }

        .weconnect_appointment_block .MuiOutlinedInput-root {
            height: 40px;
            position:relative
        }
        .weconnect_appointment_block .MuiOutlinedInput-root legend {
            display: none;
        }
        .weconnect_appointment_block .MuiOutlinedInput-root fieldset{
              text-align: left;
            position: absolute;
            bottom: 0;
            right: 0;
            top: -5px;
            left: 0;
            margin: 0;
            padding: 0 8px;
            pointer-events: none;
            border-radius: 5px;
            border-style: solid;
            border-width: 1px;
            overflow: hidden;
            min-width: 0%;
            border-color: rgba(0, 0, 0, 0.23);
        }
        .today {
          background-color: #0fca2d;
          border-radius: 50%;
          color: #fff;
        }
        .timeslotContainer {
          white-space: normal;
          padding: 10px 0px;
        }
        .react-calendar__navigation button {
            min-width: 44px;
            border: none;
            background:white
        }

        .timeLink {
          cursor: pointer;
          text-decoration: none !important;
          color: black;
        }

        .twocolumn {
          display: inline-block;
          width: 50%;
        }

        .disabled {
          opacity: 0.5;
        }

        .weconnect_calendar_header {
          justify-content: space-between;
          padding: 0 16px;
          display: flex;
          font-size: 14px;
        }
        .weconnect_calendar_header div {
          font-family: inherit !important;
          /* font: normal normal 600 13px/18px Nunito Sans; */
          letter-spacing: 0px;
          color: #1e1e1e;
          display: flex;
          align-items: center;
        }

        .weconnect_calendar_header div svg {
          font-size: 10px;
          margin-right: 3px;
        }

        .weconnect_calendar_header_form {
          font: normal normal normal 14px/24px Nunito;
          font-family: inherit !important;
          letter-spacing: 0px;
          color: #00424f;
          text-align: center;
        }
        .weconnect_appointment_block .MuiFormControl-root {
          width: 100%;
          height: 40px;
        }
        .btn_form_appointment {
          display: flex;
          align-items: center;
          justify-content: flex-end;
        }
        .weconnect_appointment_block .MuiOutlinedInput-root {
          height: 40px;
        }
        .weconnect_appointment_block .MuiOutlinedInput-root legend {
          display: none;
        }
        .weconnect_appointment_block .MuiOutlinedInput-root input {
          padding: 3.5px 14px;
          height: 40px;
          border:unset;
          margin-top: -3px;
          width:100%
        }
        .phone-no-block-chat-bot {
            display: flex;
            align-items: center;
            position:relative;
          }

        .phone-no-block-chat-bot button {
            min-width: auto;
            max-width: 80px;
            width: 100%;
            padding: 2px;
            height: 45px;
            border: 1px solid #8f8c8c96;
            background: unset;
            border-radius:5px
        }
        .phone-no-block-chat-bot button img {
            margin-right: 5px;
        }
        .phone-no-block-chat-bot .MuiTextField-root{
            margin-top: 5px;
            margin-left: 6px;
        }
        .phone-no-block-chat-bot .MuiSelect-popper.MuiPopperUnstyled-root{
          max-height: 155px;
          z-index:99999;
          background-color: #fff;
          overflow:auto;
          transform: unset!important;
          top: 55px!important;
          left: 0px!important;
          right:0px!important;
          box-shadow: 0 7px 12px 0 rgb(62 57 107 / 16%);
          border-radius: 7px;
        }
        .phone-no-block-chat-bot .MuiSelect-popper.MuiPopperUnstyled-root .MuiSelect-listbox{
          padding:10px;
        }
        .weconnect_appointment_block .MuiFormControl-root {
            width: 100%;
            height: 40px;
        }


        /* .weconnect_appointment_block .MuiOutlinedInput-root fieldset {
          height: 40px;
        } */
        .weconnect_appointment_block .MuiInputLabel-root {
          transform: translate(14px, 9px) scale(1);
        }
        .appointment_title_form {
          text-align: center;
          font-weight: 600;
          font-family: inherit;
          text-transform:capitalize
        }
        .appointment_text_form {
          font-weight: 400;
          font-family: inherit;
          font-size: 13px;
          margin-bottom: 10px;
          display: flex;
        }
        .appointment_text_form svg {
          margin-right: 10px;
        }

        .appointment_text_form span {
          white-space: pre-line;
          overflow: hidden;
          width: 100%;
        }

        .weconnect_today {
            color: #000;
            background-color: #ffdb99 !important;
            border-color: #ffb733;
        }   

        `}
        </style>
        <Text
          transparency={
            this.props.component ? this.props.component.transparency : 0
          }
        >
          {this.props.component.question}
        </Text>
        {this.state.reply === false && this.props.reply !== true && (
          <>
            {this.state.step === 0 && (
              <CalendarContainer deviceMode={this.devicemode}>
                <div className="weconnect_calendar_header">
                  <div>Pick a date</div>
                  <div>
                    <BsGlobe2 />
                    {this.props.timezone}
                  </div>
                </div>
                <Calendar
                  calendarType="US"
                  disabled={this.state.disableCalendar}
                  onChange={(date) => this.setDate(date)}
                  tileDisabled={this.disableDate}
                  tileClassName={this.tileClassName}
                  className="calender-block"
                  prevLabel={<HiArrowLeft />}
                  nextLabel={<HiArrowRight />}
                  next2Label={null}
                  prev2Label={null}
                />
                {/* <StyledButton className={this.state.selectedTimeSlot === null ? "disabled" : ""} onClick={() => this.submitDate()} >Confirm</StyledButton> */}
              </CalendarContainer>
            )}
            {this.state.step === 1 && (
              <CalendarContainer deviceMode={this.devicemode}>
                <div className="weconnect_calendar_header">
                  <div>
                    <a href="#" className="timeLink" onClick={this.backToDate}>
                      <MdKeyboardArrowLeft style={{ fontSize: "20px" }} />{" "}
                      Select Time
                    </a>
                  </div>
                  <div>{this.props.timezone}</div>
                </div>
                <div className="timeslotContainer">
                  {this.state.timeslot && this.state.timeslot.length > 0 ? (
                    this.state.timeslot.map((item, i) => {
                      return (
                        <div className="threecolumn" key={i}>
                          <label>
                            <input
                              type="radio"
                              onChange={() => this.changeTimeSlot(item)}
                              checked={this.state.selectedTimeSlot === item}
                            ></input>
                            <p className="apt_time">{item}</p>
                          </label>
                        </div>
                      );
                    })
                  ) : (
                    <ErrorContainer>
                      {this.props.component.message_unavailable}
                    </ErrorContainer>
                  )}
                </div>
              </CalendarContainer>
            )}

            {this.state.step === 2 && (
              <CalendarContainer
                className="weconnect_appointment_block"
                deviceMode={this.devicemode}
              >
                <div className="weconnect_calendar_header_form">
                  {moment(this.state.finalTime).format(
                    "h:mm A dddd,DD MMMM yyyy"
                  )}
                </div>
                <Form>
                  <p
                    style={{
                      fontSize: 12,
                      marginBottom: "5px",
                      fontFamily: "inherit",
                    }}
                  >
                    Please provide your contact details
                  </p>
                  <FormGroup>
                    <TextField
                      required={true}
                      placeholder="Name"
                      inputProps={{ "data-label": "name" }}
                      onChange={this.handleChange}
                      value={this.state.name}
                      error={this.state.error && this.incorrectName()}
                    />
                  </FormGroup>
                  <FormGroup>
                    <TextField
                      required={true}
                      placeholder="Email"
                      inputProps={{ "data-label": "email" }}
                      onChange={this.handleChange}
                      value={this.state.email}
                      error={this.state.error && this.incorrectEmail()}
                    />
                  </FormGroup>

                  <FormGroup className="phone-no-block-chat-bot">
                    <CustomSelect
                      // renderValue={this.renderValue}
                      defaultValue={this.state.dialcode}
                      onChange={(e) => {
                        console.log(e);
                        this.setState(
                          {
                            dialcode: e,
                          },
                          console.log("dialcode", e)
                        );
                      }}
                    >
                      {flags.map((prop, i) => {
                        return (
                          <StyledOption
                            key={i}
                            value={prop.dialCode}
                            label={
                              <>
                                <img
                                  loading="lazy"
                                  width="20"
                                  src={`https://flagcdn.com/w20/${prop.isoCode.toLowerCase()}.png`}
                                  srcSet={`https://flagcdn.com/w40/${prop.isoCode.toLowerCase()}.png 2x`}
                                  alt={`Flag of ${prop.name}`}
                                />{" "}
                                {prop.dialCode}
                              </>
                            }
                          >
                            <Flag
                              loading="lazy"
                              src={
                                "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/4.1.4/flags/4x3/" +
                                prop.isoCode.toLowerCase() +
                                ".svg"
                              }
                            ></Flag>
                            {` ${prop.name} (${prop.isoCode}) ${prop.dialCode}`}
                          </StyledOption>
                        );
                      })}
                    </CustomSelect>
                    <TextField
                      required={true}
                      placeholder="Phone no."
                      inputProps={{ "data-label": "phoneno" }}
                      onChange={this.handleChange}
                      value={this.state.phoneno}
                    />
                  </FormGroup>

                  <FormGroup>
                    <TextField
                      required={false}
                      placeholder="Company name"
                      label=""
                      inputProps={{ "data-label": "company" }}
                      onChange={this.handleChange}
                      value={this.state.company}
                    />
                  </FormGroup>
                  <FormGroup className="btn_form_appointment">
                    <BackButton onClick={this.backToTime}>Back</BackButton>
                    <Button onClick={this.submit}>Submit</Button>
                  </FormGroup>
                </Form>
              </CalendarContainer>
            )}
            <CustomReply>
              <CommonReply {...this.props.component} />
            </CustomReply>
          </>
        )}
      </>
    );
  }
}
