import React from "react";
import styled from "styled-components";
// import "../assets/css/botnic.scss";
import { WebchatContext } from "../contexts";
// import "../assets/css/appointment.css";
import FiUser from "../assets/react-icons/FiUser";
import FiMail from "../assets/react-icons/FiMail";
import FiCalendar from "../assets/react-icons/FiCalendar";
import FiLink from "../assets/react-icons/FiLink";
import FiGlobe from "../assets/react-icons/FiGlobe";
// import SelectUnstyled, {
//   selectUnstyledClasses,
// } from "@mui/base/SelectUnstyled";
// import MuiStyled from "@mui/system/styled";
// const moment = require('moment-timezone');
let moment;

const CalendarContainer = styled.div`
  text-align: left;
  margin: 0px 50px 15px 50px;
  -webkit-box-shadow: 0 7px 12px 0 rgb(62 57 107 / 16%);
  border-radius: 10px;
  padding: 10px 20px;
  background: #fff;
  max-width: 270px;
  width: 100%;
`;

// const blue = {
//   100: "#DAECFF",
//   200: "#99CCF3",
//   400: "#3399FF",
//   500: "#007FFF",
//   600: "#0072E5",
//   900: "#003A75",
// };

// const grey = {
//   100: "#E7EBF0",
//   200: "#E0E3E7",
//   300: "#CDD2D7",
//   400: "#B2BAC2",
//   500: "#A0AAB4",
//   600: "#6F7E8C",
//   700: "#3E5060",
//   800: "#2D3843",
//   900: "#1A2027",
// };

// const StyledButton = MuiStyled("button")(
//   ({ theme }) => `
//       font-size: 0.875rem;
//     box-sizing: border-box;
//     min-width: 110px;
//     background: #fff;
//     border: 1px solid #CDD2D7;
//     border-radius: 6px;
//     padding: 10px;
//     line-height: 1;
//     vertical-align: top;
//     height: 40px;
//     margin: 0px;
//     margin-right: 5px;

//   &:hover {
//     background: ${theme.palette.mode === "dark" ? "" : grey[100]};
//     border-color: ${theme.palette.mode === "dark" ? grey[700] : grey[400]};
//   }

//   &.${selectUnstyledClasses.focusVisible} {
//     outline: 3px solid ${theme.palette.mode === "dark" ? blue[600] : blue[100]};
//   }

//   &.${selectUnstyledClasses.expanded} {
//     &::after {
//       content: '▴';
//     }
//   }

//   &::after {
//     content: '▾';
//     float: right;
//   }

//   & img {
//     margin-right: 10px;
//   }
//   `
// );

export default class AppointmentConfirmed extends React.Component {
  static contextType = WebchatContext;

  static async botonicInit(req) {
    const item = req.input.item || {}; // meesage from api
    moment = (await import("moment-timezone")).default;
    const timeSlot = moment(item.time_slot, "hh:mm A");
    const serverTimeZone = req.session.bot.timezone;
    const date = moment.tz(item.answer_id, "YYYY-MM-DD", serverTimeZone);
    date.hour(timeSlot.get('hour'));
    date.minute(timeSlot.get('minute'));
    // from user time zone
    const userTimezone = item.time_zone;
    date.tz(userTimezone);

    item.time_slot = date.format("hh:mm A");
    item.answer_id = date.format("YYYY-MM-DD");

    return item;
  }

  render() {
    return (
      <CalendarContainer>
        <div>
          <p className="appointment_title_form">Appointment Details</p>
          <p style={{ fontWeight: "normal" }}>{this.props.message_confirmation}</p>
        </div>
        <div className="appointment_text_form">
          <FiUser />
          <span>{this.props.name}</span>
        </div>
        <div className="appointment_text_form">
          <FiMail />
          <span>{this.props.email}</span>
        </div>
        <div className="appointment_text_form">
          <FiCalendar />
          <span>
            {this.props.time_slot} {this.props.answer_id}
          </span>
        </div>
        <div className="appointment_text_form">
          <FiGlobe />
          <span>{this.props.time_zone}</span>
        </div>
        <div className="appointment_text_form">
          <FiLink />
          <span><a href={this.props.meeting_link} target="_blank" rel="noreferrer">{this.props.meeting_link}</a></span>
        </div>
      </CalendarContainer>
    );
  }
}
