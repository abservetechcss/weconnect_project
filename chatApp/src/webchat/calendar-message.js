import React from "react";
import Calendar from "react-calendar";
import { customMessage } from "../components";
import { WebchatContext } from "../contexts";

class CalendarMessage extends React.Component {
  static contextType = WebchatContext;

  render() {
    return (
      <>
        <Calendar
          onChange={(date) =>
            this.context.sendText(`Booked for ${date.toLocaleDateString()}`)
          }
        />
        <p>{this.props.children}</p>
      </>
    );
  }
}

export default customMessage({
  name: "calendar",
  component: CalendarMessage,
});
