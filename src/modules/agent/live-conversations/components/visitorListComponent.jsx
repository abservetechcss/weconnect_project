import React, { Component, Fragment } from "react";
import { Badge } from "react-bootstrap";
import copy from "../../../../assets/images/file.svg";
import { Link } from "react-router-dom";
import more from "../../../../assets/images/more-horizontal.svg";
import info from "../../../../assets/images/info.svg";
import { IconButton, Tooltip, Button } from "@mui/material";
import moment from "moment";

export class VisitorListComponent extends Component {
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
        moment(this.props.chat.datetime).format("YYYY-MM-DD");
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
      date = moment(this.props.chat.datetime).calendar(null, {
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
            this.props.activeVisitorId === this.props.chat.vistor_id
              ? "visitor_not_section visitor_not_section_active"
              : "visitor_not_section"
          }
        >
          <div className="visitor_not_box" style={{ width: "100%" }}>
            <div className="d-flex align-items-center">
              <div className="visitor_avtar">
                {this.props.chat.vistor_name &&
                  this.props.chat.vistor_name.charAt(0).toUpperCase()}
                {this.props.chat.leads === 1 ? (
                  <Badge bg="secondary">Lead</Badge>
                ) : null}
                {this.props.chat.status === "closed" ||
                this.props.chat.status === "endchat" ||
                this.props.chat.status === "endchatrefresh" ||
                this.props.chat.status === "reject" ? (
                  <span className="offline-circle"></span>
                ) : (
                  <span className="online-circle"></span>
                )}
              </div>
              <Link
                role="button"
                to={"#"}
                onClick={() => {
                  this.props.onSelectChat(this.props.chat);
                  // _this.props._this.setState({
                  //     selectedVisitor: true,
                  //     activeVisitor: this.props.chat
                  // });
                  // setTimeout(() => {
                  //     _this.props._this.fetchSingleVisitorInfo();
                  // }, 1000);
                }}
              >
                <div>
                  <p className="visitor_name">
                    {this.props.chat.vistor_name}
                    {typeof this.props.unReadCount[
                      this.props.chat.vistor_id
                    ] !== "undefined" ? (
                      this.props.unReadCount[this.props.chat.vistor_id] > 0 && (
                        <div className="notify_text">
                          {this.props.unReadCount[this.props.chat.vistor_id]}
                        </div>
                      )
                    ) : this.props.chat.total_unread > 0 ? (
                      <div className="notify_text">
                        {this.props.chat.total_unread}
                      </div>
                    ) : null}
                  </p>
                  <p className="visitor_subtext">
                    {this.props.chat.bot_name}
                  </p>
                  <p className="visitor_subtext">
                    {this.props.chat.latestChat}
                  </p>
                </div>
              </Link>
            </div>
            <div className="d-flex align-items-center">
              {this.props.chat.note !== "" && (
                <Tooltip title={this.props.chat.note}>
                  <div className="copy_text">
                    <img alt="" src={copy} />
                  </div>
                </Tooltip>
              )}
              <div
                hidden={this.props.chat.assigned == "no"}
                className="assigned_text"
              >
                Assigned
              </div>

              {this.props.chat.chat_type === "video_chat" ? (
                <div className="video_text">Video</div>
              ) : (
                <div className="chat_text">Chat</div>
              )}
              {(!this.props.chat.accept ||
                this.props.chat.accept !== "ongoing") && (
                <a
                  role="button"
                  onClick={(event) => {
                    this.props.onSelectMore(event, this.props.chat);
                    // _this.setState({
                    //     showVisitorModal: true,
                    //     visitorAnchorEl: event.currentTarget
                    // });
                    // this.props._this.setState({
                    //     activeVisitor: this.props.chat
                    // });
                  }}
                  id="basic-button"
                  aria-controls={
                    this.props.openVisitor ? "basic-menu" : undefined
                  }
                  aria-haspopup="true"
                  aria-expanded={this.props.openVisitor ? "true" : undefined}
                >
                  <div className="more_box">
                    <Tooltip title="option">
                      <IconButton
                        color="primary"
                        component="span"
                        className="horizont-more-btn"
                      >
                        <img alt="" src={more} />
                      </IconButton>
                    </Tooltip>
                  </div>
                </a>
              )}
            </div>
          </div>
          {this.props.chat.accept === "ongoing" && (
            <div className="visitor_not_box visitor_info">
              <div className="d-flex align-items-center">
                <p
                  onClick={() => {
                    if (this.props.onChatVisitorAction)
                      this.props.onChatVisitorAction("info", this.props.chat);
                  }}
                >
                  <img src={info} alt="" />
                  Info
                </p>
                <Button
                  className="visitor_bot_btn"
                  variant="contained"
                  onClick={() => {
                    if (this.props.onChatVisitorAction)
                      this.props.onChatVisitorAction("hybrid", this.props.chat);
                  }}
                >
                  <span> {this.props.chat.bot_name}</span>
                </Button>
              </div>
              <div className="reject_assign_block">
                {" "}
                <Button
                  className="reject_btn"
                  variant="contained"
                  onClick={() => {
                    if (this.props.onChatVisitorAction)
                      this.props.onChatVisitorAction("reject", this.props.chat);
                  }}
                >
                  Reject
                </Button>{" "}
                <Button
                  className="accept_btn"
                  variant="contained"
                  onClick={() => {
                    if (this.props.onChatVisitorAction)
                      this.props.onChatVisitorAction("accept", this.props.chat);
                  }}
                >
                  Accept
                </Button>
              </div>
            </div>
          )}
          {this.props.chat.accept === "assign_to_me" && (
            <div className="visitor_not_box visitor_info">
              <div className="d-flex align-items-center">
                <p
                  onClick={() => {
                    if (this.props.onChatVisitorAction)
                      this.props.onChatVisitorAction("info", this.props.chat);
                  }}
                >
                  <img src={info} />
                  Info
                </p>
                <Button
                  className="visitor_bot_btn"
                  variant="contained"
                  onClick={() => {
                    if (this.props.onChatVisitorAction)
                      this.props.onChatVisitorAction("hybrid", this.props.chat);
                  }}
                >
                  <span> {this.props.chat.bot_name}</span>
                </Button>
              </div>
              <div className="reject_assign_block">
                {" "}
                <Button
                  className="reject_btn"
                  variant="contained"
                  onClick={() => {
                    if (this.props.onChatVisitorAction)
                      this.props.onChatVisitorAction(
                        "assign_to_reject",
                        this.props.chat
                      );
                  }}
                >
                  Reject
                </Button>{" "}
                <Button
                  className="accept_btn"
                  variant="contained"
                  onClick={() => {
                    if (this.props.onChatVisitorAction)
                      this.props.onChatVisitorAction(
                        "assign_to_me",
                        this.props.chat
                      );
                  }}
                >
                  Assign To me
                </Button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }
}
