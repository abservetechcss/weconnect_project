import { INPUT } from "@botonic/core";
import React from "react";
// import styled from "styled-components";
import { renderComponent } from "../util/react";
import { Message } from "./message";

// const Link = styled.a`
//   text-decoration: none;
//   font-weight: bold;
//   target: blank;
// `;
// const Message = styled.div`
//   border-radius: 10px;
//   padding: ${(props) => (props.blob ? "8px 12px" : "0px")};
//   display: flex;
//   flex-direction: column;
//   white-space: pre-line;
//   ${(props) => props.markdownstyle}
// `;
const serialize = (locationProps) => {
  return { location: { lat: locationProps.lat, long: locationProps.long } };
};

export const Location = (props) => {
  const lat = parseFloat(props.lat);
  const long = parseFloat(props.long);
  const renderBrowser = () => {
    const key = "AIzaSyCt2u_2h3LYoYZXvD-65Fccueaxo7ag234";
    // const locationUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${long}`
    return (
      <div className="location_pinned_section">
        <Message
          json={serialize(props)}
          {...props}
          type={INPUT.LOCATION}
          style={{
            background: "transparent",
            padding: "0px",
            borderRadius: "0px",
          }}
        >
          <div className="location_pinned_block">
            <iframe
              title="embedLocation"
              src={`https://www.google.com/maps/embed/v1/place?key=${key}&center=${lat},${long}&q=${lat},${long}&zoom=12`}
              width="100%"
              height="100%"
              frameBorder="0"
              allowFullScreen=""
              aria-hidden="false"
              tabIndex="0"
            ></iframe>
            <div
              style={{
                background: "white",
                color: "black",
                textAlign: "left",
                fontSize: "13px",
                fontWeight: "700",
                padding: "0 0 5px 10px",
              }}
            >
              Pinned Location
            </div>
          </div>
        </Message>
      </div>
    );
  };

  const renderNode = () => {
    return (
      <message type={INPUT.LOCATION}>
        <lat>{lat}</lat>
        <long>{long}</long>
      </message>
    );
  };

  return renderComponent({ renderBrowser, renderNode });
};

Location.serialize = serialize;
