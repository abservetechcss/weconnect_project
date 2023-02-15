import React, { Fragment } from "react";
import messageUser from "../../../../assets/images/download.png";
import moment from "moment";
import { getMeetChatInfo } from "../server/ConversationServer";

function ChatListMessageComponent(props) {
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
      {props.chatListDetails && props.chatListDetails.length > 0 ? (
        <Fragment>
          {props.chatListDetails.map((data, d) => {
            return (
              <Fragment key={"chatListDetails" + d}>
                {d % 2 == 0 ? (
                  <div>
                    <div className="chat_other_msg" style={{ paddingBottom }}>
                      <div className="user-icon-block" style={{ opacity }}>
                        <div>
                          <img src={messageUser} alt="" />
                        </div>
                      </div>
                      <div>
                        <div className="chat_msg" style={{ borderRadius }}>
                          <p>{data.message}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="chat_my_msg" style={{ paddingBottom }}>
                      <div>
                        <div className="chat_msg" style={{ borderRadius }}>
                          <p>{data.message}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Fragment>
            );
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

export default ChatListMessageComponent;
