import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import { Form } from "react-bootstrap";
import { Tooltip } from "@mui/material";

export class OfflineListComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      endChatAnchorEl: null,
      isShowEmojiModal: false,
      emojiShow: [],
      width: window.screen.width,
      height: 0,
      messageText: "",
    };
  }
  render() {
    // const isLastMessage = !this.props.nextMessage || this.props.nextMessage.datetime !== this.props.chat.datetime;
    const isFirstMessage =
      !this.props.lastMessage ||
      moment(this.props.lastMessage.datetime).format("YYYY-MM-DD") !==
        moment(this.props.message.datetime).format("YYYY-MM-DD");
    let date;
    if (isFirstMessage) {
      // if (this.props.lastMessage)
      //   console.log(
      //     "lastmessage",
      //     this.props.lastMessage.datetime,
      //     "chat",
      //     this.props.chat.datetime
      //   );
      // else console.log("true inital message");
      date = moment(this.props.message.datetime).calendar(null, {
        lastWeek: "dddd, MMM D, YYYY",
        lastDay: "[Yesterday]",
        sameDay: "[Today]",
        sameElse: "dddd, MMM D, YYYY",
      });
    }
    return (
      <>
        {isFirstMessage && <p className="visitor_day">{date}</p>}

        <div
          className={
            this.props.message.client_id === this.props.activeMessage.client_id
              ? "visitor_not_section visitor_not_section_active"
              : "visitor_not_section"
          }
          style={{
            backgroundColor:
              this.props.message.readstatus == "unread"
                ? "#f2f3f5"
                : "transparent",
          }}
          onClick={() => {
            this.props.selectMessage(this.props.message);
          }}
        >
          <div className="visitor_not_box">
            <div className="d-flex align-items-center">
              <Form.Group
                controlId="formBasicCheckbox"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
              >
                <Tooltip title="check box">
                  <Form.Check
                    type="checkbox"
                    value={this.props.message.value}
                    checked={this.props.message.value}
                    onChange={(e) => {
                      this.props.handleCheck(e, this.props.index);

                      // let temp =
                      //   _this.state
                      //     .offlineMessageList;
                      // let newObj = prop.data;
                      // newObj[key].value =
                      //   this.props.message.value ? false : true;
                      // temp.data = newObj;
                      // _this.setState({
                      //   offlineMessageList: temp,
                      //   selectedMsg: this.props.message.value,
                      //   activeMessage: this.props.message
                      // });
                    }}
                  />
                </Tooltip>
              </Form.Group>
              <div className="visitor_avtar">
                {this.props.message.name && this.props.message.name.charAt(0)}
              </div>
              <Link role="button" to={"#"}>
                <div>
                  <p className="visitor_name">{this.props.message.name}</p>
                  <p className="visitor_subtext">
                    {this.props.message.message}
                  </p>
                </div>
              </Link>
            </div>
            <div className="d-flex align-items-center flex-wrap">
              <div className="alert alert_new px-1 py-0 my-auto me-3 time_text">
                {this.props.message.readstatus == "unread" ? <p>New</p> : <></>}
              </div>
              <div className="d-flex align-items-center">
                <div className="time_text">
                  {`${moment(this.props.message.datetime)
                    .format("dddd")
                    .substring(0, 3)} ${moment(
                    this.props.message.datetime
                  ).format("hh:MM A")}`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
