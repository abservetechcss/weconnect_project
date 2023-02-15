import React, { useState } from "react";
import { Accordion, Form } from "react-bootstrap";
import moment from "moment";
import { Button, Tooltip, IconButton } from "@mui/material";
import left from "../../../../assets/images/corner-up-left.svg";
import all from "../../../../assets/images/Group 20107.svg";
import forward from "../../../../assets/images/corner-up-left-1.svg";
// import star from "../../../../assets/images/star (2).svg";
// import checkedStar from "../../../../assets/images/star (3).svg";
import EditorComponent from "./editorComponent";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { ReactMultiEmail, isEmail } from "react-multi-email";
import { uploadImageCallBack } from "../server/OfflineMessageServer.js";
import htmlToDraft from "html-to-draftjs";
import { EditorState, convertToRaw, ContentState } from "draft-js";
import { OfflineMessageContext } from "../OfflineMessageComponent";

const ThreadMessageComponent = (props) => {
  const [mode, setMode] = useState("");
  const [message, setMessage] = useState("");
  const [ccEmails, setccEmails] = useState([]);
  const [bccEmails, setbccEmails] = useState([]);
  const [toEmails, settoEmails] = useState([]);
  const [readStatus, setReadStatus] = useState(false);

  const handleCustomButtonAction = (action, data, state) => {
    let params = {};
    if (action === "reply_all") {
      params = {
        ccEmails: ccEmails.join(","),
        bccEmails: bccEmails.join(","),
        toEmails: toEmails.join(","),
      };
      setccEmails([]);
      setbccEmails([]);
      settoEmails([]);
      setMode("");
    } else if (action === "forward") {
      params = {
        ccEmails: ccEmails.join(","),
        bccEmails: bccEmails.join(","),
        toEmails: toEmails.join(","),
      };
      setccEmails([]);
      setbccEmails([]);
      settoEmails([]);
      setMode("");
    }
    props.handleCustomButtonAction(action, data, state, params);
  };

  const setHtml = () => {
    const html = props.message.messages
      ? props.message.messages
      : props.individualMessage.messages.Message
      ? props.individualMessage.messages.Message
      : "";
    let messageText = "";
    const forwardText = `<div>---------- Forwarded message ---------</div>
    <div>From: ${props.individualMessage.messages.Name}</div>
    <div>Date: ${moment(props.message.datetime).format(
      "ddd, DD MMM YYYY [at] HH:mm"
    )}</div><div></div>`;
    // <div>Date: Fri, 23 Sept 2022 at 16:10</div>
    // <div>Subject: Fix your pipelines by validating your account</div>
    // <div>To: <muthu.leocoders@gmail.com></div>
    const contentBlock = htmlToDraft("<span>" + forwardText + html + "</span>");
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      messageText = editorState;
    }
    return messageText;
  };

  return (
    <>
      {props.message.status?.toLowerCase() !== "draft" ? (
        <OfflineMessageContext.Consumer>
          {(param) => (
            <Accordion.Item eventKey={props.eventKey}>
              <Accordion.Header
                onClick={(e) => {
                  props.handleUpdateThread(
                    props.message.id,
                    props.message.readstatus
                  );
                  if (props.message.readstatus == "unread") {
                    param.updateRead(props.message.id);
                  }
                }}
                style={{
                  backgroundColor:
                    props.message.readstatus == "unread" ? "#f8f9fa" : "#fff",
                }}
              >
                <div className="reply_thread_box">
                  <div className="email_top">
                    <div className="d-flex align-items-center">
                      <div className="visitor_avtar">
                        {props.message &&
                          props.message.name &&
                          props.message.name.charAt(0)}
                      </div>
                      <div>
                        <p className="visitor_name">{`${props.message.name}`}</p>
                        <p className="visitor_subtext">
                          {props.message.from === "agent"
                            ? "to me"
                            : props.message.from}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="vistor_thread_right">
                    {" "}
                    <p className="visitor_subtext">
                      {`${moment(props.message.datetime)
                        .format("dddd")
                        .substring(0, 3)} ${moment(
                        props.message.datetime
                      ).format("MM/DD/yyyy hh:MM A")}`}
                    </p>
                    {/* <div className="chat_icons">
                        <Tooltip title="Starred">
                          <IconButton
                            color="primary"
                            component="span"
                            className="horizont-more-btn"
                            id="basic-button"
                            onClick={() =>
                              props._this.starred(this.state.star ? 0 : 1)
                            }
                            aria-controls={
                              props._this.menuOpen ? "basic-menu" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={props._this.menuOpen ? "true" : undefined}
                          >
                            {props._this.state.star ? (
                              <img
                                alt=""
                                className="nomargin"
                                src={checkedStar}
                              />
                            ) : (
                              <img alt="" className="nomargin" src={star} />
                            )}
                          </IconButton>
                        </Tooltip>
                      </div> */}
                  </div>
                </div>
              </Accordion.Header>
              <Accordion.Body>
                <p
                  dangerouslySetInnerHTML={{ __html: props.message.messages }}
                />
                <div className="msg_btn">
                  <Button
                    onClick={() => {
                      // if(mode==='reply') {
                      //   setMode('');
                      // }
                      // else {
                      //   setMode('reply');
                      // }
                      // setMessage('');
                      props.openReply();
                    }}
                    variant="outlined"
                  >
                    <img src={left} alt="" />
                    Reply
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      props.openReplyAll();
                      // if(mode==='reply_all') {
                      //   setMode('');
                      // }
                      // else {
                      //   setMode('reply_all');
                      // }
                      // setMessage('');
                      // props._this.setState({
                      //   replyAll: !props._this.state.replyAll,
                      //   reply: false,
                      //   forward: false,
                      //   messageText: "",
                      // });
                    }}
                  >
                    {" "}
                    <img src={all} alt="" />
                    Reply to all
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      const message = setHtml();
                      props.openForward(message);
                      // if(mode==='forward') {
                      //   setMode('');
                      // }
                      // else {
                      //   setMode('forward');
                      // }
                      // setMessage(message);
                      // props._this.setState({
                      //   forward: !props._this.state.forward,
                      //   messageText: "",
                      //   reply: false,
                      //   replyAll: false,
                      // });
                    }}
                  >
                    {" "}
                    <img src={forward} alt="" />
                    Forward
                  </Button>
                </div>
                {mode !== "" && (
                  <div className="offline_email_section">
                    <div className="email_top">
                      <div className="reply_message">
                        {mode === "reply" && (
                          <p className="visitor_name">
                            {" "}
                            <img src={left} alt="" />
                            {`${props.message.name}`}
                          </p>
                        )}
                        {mode === "reply_all" && (
                          <p className="visitor_name d-flex align-items-baseline">
                            {" "}
                            <img src={all} className="" alt="" />
                            <div className="w-100">
                              <ReactMultiEmail
                                placeholder="Cc"
                                emails={ccEmails}
                                onChange={(_emails) => {
                                  setccEmails(_emails);
                                }}
                                validateEmail={(email) => {
                                  return isEmail(email); // return boolean
                                }}
                                getLabel={(email, index, removeEmail) => {
                                  return (
                                    <div data-tag key={index}>
                                      {email}
                                      <span
                                        data-tag-handle
                                        onClick={() => removeEmail(index)}
                                      >
                                        ×
                                      </span>
                                    </div>
                                  );
                                }}
                              />
                              <ReactMultiEmail
                                placeholder="Bcc"
                                emails={bccEmails}
                                onChange={(_emails) => {
                                  setbccEmails(_emails);
                                }}
                                validateEmail={(email) => {
                                  return isEmail(email); // return boolean
                                }}
                                getLabel={(email, index, removeEmail) => {
                                  return (
                                    <div data-tag key={index}>
                                      {email}
                                      <span
                                        data-tag-handle
                                        onClick={() => removeEmail(index)}
                                      >
                                        ×
                                      </span>
                                    </div>
                                  );
                                }}
                              />
                            </div>
                          </p>
                        )}

                        {mode === "forward" && (
                          <p className="visitor_name d-flex align-items-baseline">
                            {" "}
                            <img src={forward} className="" alt="" />
                            <div className="w-100">
                              <ReactMultiEmail
                                placeholder="To"
                                emails={toEmails}
                                onChange={(_emails) => {
                                  settoEmails(_emails);
                                }}
                                validateEmail={(email) => {
                                  return isEmail(email); // return boolean
                                }}
                                getLabel={(email, index, removeEmail) => {
                                  return (
                                    <div data-tag key={index}>
                                      {email}
                                      <span
                                        data-tag-handle
                                        onClick={() => removeEmail(index)}
                                      >
                                        ×
                                      </span>
                                    </div>
                                  );
                                }}
                              />
                              <ReactMultiEmail
                                placeholder="Cc"
                                emails={ccEmails}
                                onChange={(_emails) => {
                                  setccEmails(_emails);
                                }}
                                validateEmail={(email) => {
                                  return isEmail(email); // return boolean
                                }}
                                getLabel={(email, index, removeEmail) => {
                                  return (
                                    <div data-tag key={index}>
                                      {email}
                                      <span
                                        data-tag-handle
                                        onClick={() => removeEmail(index)}
                                      >
                                        ×
                                      </span>
                                    </div>
                                  );
                                }}
                              />
                              <ReactMultiEmail
                                placeholder="Bcc"
                                emails={bccEmails}
                                onChange={(_emails) => {
                                  setbccEmails(_emails);
                                }}
                                validateEmail={(email) => {
                                  return isEmail(email); // return boolean
                                }}
                                getLabel={(email, index, removeEmail) => {
                                  return (
                                    <div data-tag key={index}>
                                      {email}
                                      <span
                                        data-tag-handle
                                        onClick={() => removeEmail(index)}
                                      >
                                        ×
                                      </span>
                                    </div>
                                  );
                                }}
                              />
                            </div>
                          </p>
                        )}

                        <EditorComponent
                          {...props}
                          mode={mode}
                          uploadImageCallBack={uploadImageCallBack}
                          handleCustomButtonAction={handleCustomButtonAction}
                          message={message}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Accordion.Body>
            </Accordion.Item>
          )}
        </OfflineMessageContext.Consumer>
      ) : (
        <></>
      )}
    </>
  );
};

export default ThreadMessageComponent;
