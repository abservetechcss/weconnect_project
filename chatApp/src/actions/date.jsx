import {
  Text,
  Reply,
  CommonReply,
  CustomReply,
  ConfirmButton,
} from "../components";
import React from "react";
// import Calendar from "../calendar/Calendar";
import Calendar from "react-calendar";
import { WebchatContext } from "../contexts";
// import "../assets/css/calendar.scss";
import HiArrowLeft from "../assets/react-icons/HiArrowLeft";
import HiArrowRight from "../assets/react-icons/HiArrowRight";

function formatDate(date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

export default class DateComponent extends React.Component {
  static contextType = WebchatContext;

  constructor(props) {
    super(props);
    this.state = {
      date: "",
      reply: false,
    };
    this.submitDate = this.submitDate.bind(this);
    this.tileClassName = this.tileClassName.bind(this);
  }

  static async botonicInit(req) {
    const item = req.input.item || {};
    return item;
  }

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
      month = monthNames[d.getMonth()],
      day = "" + d.getDate(),
      year = d.getFullYear();

    // if (month.length < 2)
    //     month = '0' + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("-");
  }

  tileClassName({ activeStartDate, date, view }) {
    var today = new Date();
    if (
      date.getDate() == today.getDate() &&
      date.getMonth() == today.getMonth() &&
      date.getFullYear() == today.getFullYear()
    ) {
      return "today";
    }
  }

  setDate(date) {
    this.setState({
      date: date,
    });
  }
  submitDate() {
    if (this.state.date !== "") {
      // const mydate = time.format('yyyy-MM-DD');
      const mydate = formatDate(this.state.date);
      if (mydate) {
        this.setState({
          reply: true,
        });
        this.context.sendInput({
          type: "text",
          item: {
            btn_id: mydate,
          },
          data: mydate,
        });
      }
    }
  }

  render() {
    const props = {};
    if (this.props.options.show_past_dates === 0)
      props.minDate = new Date(new Date().setHours(0, 0, 0, 0));
    if (this.props.options.show_future_dates === 0)
      props.maxDate = new Date(new Date().setHours(0, 0, 0, 0));

    return (
      <>
        <style>
          {`
        .calendar_date_section {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0;
    flex-direction: column;
    font-size: 14px;
}
.calendar_date_section .react-calendar {
    box-shadow: 0px 6px 25px rgb(48 56 82 / 21%);
    border-radius: 10px;
    width: 285px;
    font-family: inherit;
    padding: 5px;
}
.react-calendar__navigation {
    height: 44px;
    margin-bottom: 1em;
}
.calendar_date_section .react-calendar .react-calendar__navigation button {
    font-weight: 600;
    font-size: 13px;
}
.react-calendar__month-view__weekdays {
    text-align: center;
    text-transform: uppercase;
    font-weight: bold;
    font-size: .75em;
}
.calendar_date_section .react-calendar .react-calendar__month-view__weekdays__weekday {
    color: #e5e5e5;
}
.calendar_date_section .react-calendar button {
    color: #000;
    font-size: 12px;
    font-family: inherit;
    height: 37px;
    border: unset;
    background: unset;
}
.calendar_date_section .react-calendar button.react-calendar__tile.react-calendar__tile--now.react-calendar__month-view__days__day {
    background-color: #32e0a1;
    border-radius: 50%;
    color: #fff;
}
.calendar_date_section .react-calendar .react-calendar__tile--active {
    background-color: #0fca2d !important;
    color: #fff;
    border-radius: 50%;
    max-width: 47px;
    height: 37px;
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
          <CustomReply>
            <div className="calendar_date_section">
              <Calendar
                calendarType="US"
                // disabled={this.state.reply}
                onChange={(date) => this.setDate(date)}
                // tileDisabled={this.disableDate}
                // onClickDay={this.submitDate}
                tileClassName={this.tileClassName}
                prevLabel={<HiArrowLeft />}
                nextLabel={<HiArrowRight />}
                next2Label={null}
                prev2Label={null}
                {...props}
              />
            </div>
            {this.date}
            <ConfirmButton click={this.submitDate} />
            <CommonReply {...this.props.component} />
          </CustomReply>
        )}
      </>
    );
  }
}
