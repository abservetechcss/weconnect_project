import React, { Fragment } from "react";
import messageUser from "../../../../assets/images/download.png";
import moment from "moment";
import { getMeetChatInfo } from "../server/ConversationServer";

function ChatHistoryMessageComponent(props) {
  const { lastMessage, message, nextMessage } = props;
  const isLastMessage = !nextMessage || nextMessage.from !== message.from;
  const isFirstMessage = !lastMessage || lastMessage.from !== message.from;

  const topRightRadius = isFirstMessage ? "18px" : "4px";
  const bottomRightRadius = isLastMessage ? "18px" : "4px";
  const opacity = isLastMessage ? 1 : 0;
  const borderRadius = `18px ${topRightRadius} ${bottomRightRadius} 18px`;
  const paddingBottom = isLastMessage ? "21px" : "9px";

  return (
    <div className="analytics_chat_id_section">
      {props.chatDetails && props.chatDetails.length > 0 ? (
        <Fragment>
          {props.chatDetails.map((prop) => {
            return prop.data
              .filter((x) => {
                return x.showDateFilter === "Today";
              })
              .map((prop1, key) => {
                return (
                  <Fragment key={"chatDetails" + key}>
                    {key === 0 ? (
                      <p className="visitor_day">
                        Today {moment(prop1.datetime).format("hh:mm A")}
                      </p>
                    ) : null}
                    {prop1.questions !== undefined && prop1.questions !== "" ? (
                      <div>
                        <div
                          className="chat_other_msg"
                          style={{ paddingBottom }}
                        >
                          <div className="user-icon-block" style={{ opacity }}>
                            <div>
                              <img src={messageUser} alt="" />
                            </div>
                          </div>
                          <div>
                            <div className="chat_msg" style={{ borderRadius }}>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: prop1.questions,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    <div>
                      {prop1.answer !== undefined && prop1.answer !== "" ? (
                        <div className="chat_my_msg" style={{ paddingBottom }}>
                          <div className="chat_msg" style={{ borderRadius }}>
                            <div>{prop1.answer}</div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div>
                      {prop1.videomessage !== undefined &&
                      prop1.videomessage !== "" ? (
                        <div
                          className="chat_other_msg"
                          style={{
                            paddingBottom: paddingBottom,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            props.handleMeetDetails(props.clientId);
                          }}
                        >
                          <div className="user-icon-block" style={{ opacity }}>
                            <div>
                              <img src={messageUser} alt="" />
                            </div>
                          </div>
                          <div className="chat_msg" style={{ borderRadius }}>
                            <div>{prop1.videomessage}</div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    {/* {(prop.data && prop.data.length - 1) === key ? (
                      <hr style={{ color: "#333" }}></hr>
                    ) : null} */}
                  </Fragment>
                );
              });
          })}
          {props.chatDetails.map((prop) => {
            return prop.data
              .filter((x) => {
                return x.showDateFilter === "Yesterday";
              })
              .map((prop1, key) => {
                return (
                  <Fragment>
                    {key === 0 ? (
                      <p className="visitor_day">
                        Yesterday {moment(prop1.datetime).format("hh:mm A")}
                      </p>
                    ) : null}
                    {prop1.questions !== undefined && prop1.questions !== "" ? (
                      <div>
                        <div
                          className="chat_other_msg"
                          style={{ paddingBottom }}
                        >
                          <div className="user-icon-block" style={{ opacity }}>
                            <div>
                              <img src={messageUser} alt="" />
                            </div>
                          </div>
                          <div>
                            <div className="chat_msg" style={{ borderRadius }}>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: prop1.questions,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    <div>
                      {prop1.answer !== undefined && prop1.answer !== "" ? (
                        <div className="chat_my_msg" style={{ paddingBottom }}>
                          <div className="chat_msg" style={{ borderRadius }}>
                            <div>{prop1.answer}</div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div>
                      {prop1.videomessage !== undefined &&
                      prop1.videomessage !== "" ? (
                        <div
                          className="chat_other_msg"
                          style={{
                            paddingBottom: paddingBottom,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            props.handleMeetDetails(props.clientId);
                          }}
                        >
                          <div className="user-icon-block" style={{ opacity }}>
                            <div>
                              <img src={messageUser} alt="" />
                            </div>
                          </div>
                          <div className="chat_msg" style={{ borderRadius }}>
                            <div>{prop1.videomessage}</div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    {/* {(prop.data && prop.data.length - 1) === key ? (
                      <hr style={{ color: "#333" }}></hr>
                    ) : null} */}
                  </Fragment>
                );
              });
          })}

          {props.chatDetails.map((prop) => {
            return prop.data
              .filter((x) => {
                return x.showDateFilter === "Other";
              })
              .map((prop1, key) => {
                return (
                  <Fragment>
                    {key === 0 ? (
                      <p className="visitor_day">
                        {`${moment(prop1.datetime).format(
                          "MMM DD, yyyy hh:mm A"
                        )}`}{" "}
                      </p>
                    ) : null}
                    {prop1.questions !== undefined && prop1.questions !== "" ? (
                      <div>
                        <div
                          className="chat_other_msg"
                          style={{ paddingBottom }}
                        >
                          <div className="user-icon-block" style={{ opacity }}>
                            <div>
                              <img src={messageUser} alt="" />
                            </div>
                          </div>
                          <div>
                            <div className="chat_msg" style={{ borderRadius }}>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: prop1.questions,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : null}
                    <div>
                      {prop1.answer !== undefined && prop1.answer !== "" ? (
                        <div className="chat_my_msg" style={{ paddingBottom }}>
                          <div className="chat_msg" style={{ borderRadius }}>
                            <div>{prop1.answer}</div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    <div>
                      {prop1.videomessage !== undefined &&
                      prop1.videomessage !== "" ? (
                        <div
                          className="chat_other_msg"
                          style={{
                            paddingBottom: paddingBottom,
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            props.handleMeetDetails(props.clientId);
                          }}
                        >
                          <div className="user-icon-block" style={{ opacity }}>
                            <div>
                              <img src={messageUser} alt="" />
                            </div>
                          </div>
                          <div className="chat_msg" style={{ borderRadius }}>
                            <div>{prop1.videomessage}</div>
                          </div>
                        </div>
                      ) : (
                        ""
                      )}
                    </div>
                    {/* {(prop.data && prop.data.length - 1) === key ? (
                      <hr style={{ color: "#333" }}></hr>
                    ) : null} */}
                  </Fragment>
                );
              });
          })}
        </Fragment>
      ) : props.loading ? (
        <div className="text-center alert alert-danger">Loading...</div>
      ) : (
        <div className="text-center alert alert-danger">No Data Found!</div>
      )}
    </div>
  );
}

export default ChatHistoryMessageComponent;
