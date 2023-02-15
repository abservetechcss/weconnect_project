import React from "react";

import { Reply, Text } from ".";

import styled from "styled-components";

const RowContainer = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  flex-wrap: wrap;
  padding: 0px;
`;

export const CommonReply = (props) => {
  const replyStyle = {
    cursor: "pointer",
    padding: "5px 13px",
    textAlign: "center",
    width: "auto",
    fontFamily: "inherit",
    marginRight: "8px",
    height: "30px",
    display: "flex",
    alignItems: "center",
  };
  return (
    <RowContainer>
      {props.back_button === 1 && (
        <Reply
          text="Back"
          skip={true}
          replyStyle={replyStyle}
          item={{ back: true }}
        >
          <span
            style={{
              marginRight: "5px",
              transform: "rotate(180deg)",
            }}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 16 16"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5z"
              ></path>
            </svg>
          </span>
        </Reply>
      )}
      {props.skip_button === 1 && (
        <Reply
          text="Skip"
          skip={true}
          replyStyle={replyStyle}
          item={{ skip: true }}
        >
          <span
            style={{
              marginRight: "5px",
              transform: "rotate(180deg)",
            }}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 16 16"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M14.5 1.5a.5.5 0 0 1 .5.5v4.8a2.5 2.5 0 0 1-2.5 2.5H2.707l3.347 3.346a.5.5 0 0 1-.708.708l-4.2-4.2a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 8.3H12.5A1.5 1.5 0 0 0 14 6.8V2a.5.5 0 0 1 .5-.5z"
              ></path>
            </svg>
          </span>
        </Reply>
      )}
    </RowContainer>
  );
};
