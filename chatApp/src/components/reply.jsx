/**
 * This component is made to support additional data sending between components
 */
import React, { useContext } from "react";
import styled, { css } from "styled-components";

import { WEBCHAT } from "../constants";
import { WebchatContext } from "../contexts";
import { renderComponent } from "../util/react";

const AnimationContainer = styled.div`
  transform: translate(0%);
  transition: 0.3s ease-out;

  ${(props) =>
    props.animated &&
    css`
      &:hover {
        position: fixed;
        transform: translate(0%, -30%);
        transition: 0.3s ease-out;
      }
    `}
`;
let StyledButton = styled.button`
  font-family: inherit;
  padding: ${(props) => (props.image ? "2px 10px" : "2px 10px")};
  box-shadow: 0 0px 0px 1px #999797;
  margin: ${(props) => (props.image ? "10px 0" : "4px")};
  display: flex;
  min-height: 32px;
  height: auto;
  align-items: center;
  cursor: pointer;
  outline: 0;
  text-deocration: none;
  color: ${(props) => props.btnStyle.color};
  background: ${(props) => props.btnStyle.background};
  border: ${(props) => props.btnStyle.border};
  border-radius: ${(props) => props.btnStyle.borderRadius};
  & svg {
    fill: ${(props) => props.btnStyle.color};
    stroke: ${(props) => props.btnStyle.color};
    & path {
      fill: ${(props) => props.btnStyle.color} !important;
      stroke: ${(props) => props.btnStyle.color} !important;
    }
  }
  &:hover {
    color: ${(props) => props.hover.color} !important;
    background: ${(props) => props.hover.background} !important;
    & svg {
      fill: ${(props) => props.hover.color} !important;
      stroke: ${(props) => props.hover.color} !important;
      & path {
        fill: ${(props) => props.hover.color} !important;
        stroke: ${(props) => props.hover.color} !important;
      }
    }
  }
`;

export const Reply = (props) => {
  const { sendText, getThemeProperty } = useContext(WebchatContext);
  const handleClick = (event) => {
    event.preventDefault();
    if (props.children) {
      let payload = props.payload;
      // Here additional data is needed to communicate between components
      let text = props.children;
      if (props.text || props.text === "") text = props.text;

      let item = props.item;
      if (props.path) payload = `__PATH_PAYLOAD__${props.path}`;
      if (text !== "") sendText(text, payload, item);
    }
  };

  const renderBrowser = () => {
    let replyStyle = {};
    // const CustomReply = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.customReply)
    let widgetStyle = getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.widgetStyle,
      WEBCHAT.DEFAULTS.WIDGETSTYLE
    );

    if (props.replyStyle) {
      replyStyle = props.replyStyle;
    }

    // if (CustomReply) {
    //   return (
    //     <div onClick={e => handleClick(e)}>
    //       <CustomReply>{props.children}</CustomReply>
    //     </div>
    //   )
    // }

    let myprops = {};
    if (props.disable !== true) {
      myprops.onClick = (e) => handleClick(e);
    }
    if (props.component) {
      if (props.component === "a") {
        myprops.href = props.href;
        myprops.target = props.target;
      }
      myprops.as = props.component;
    }
    if (props.image) {
      myprops.image = true;
    }
    let buttonStyle = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.buttonStyle);
    console.log("backSkipStyle", WEBCHAT.CUSTOM_PROPERTIES.backSkipStyle);

    if (props.skip) {
      let backSkipStyle = getThemeProperty(
        WEBCHAT.CUSTOM_PROPERTIES.backSkipStyle
      );
      buttonStyle = {
        color: backSkipStyle?.color,
        background: backSkipStyle?.background,
        border: buttonStyle?.border,
        borderRadius: buttonStyle?.borderRadius,
      };
      widgetStyle = {
        color: backSkipStyle?.color,
        background: backSkipStyle?.background,
        border: buttonStyle?.border,
        borderRadius: buttonStyle?.borderRadius,
      };
    }

    return (
      <StyledButton
        style={{
          ...replyStyle,
        }}
        btnStyle={buttonStyle}
        hover={widgetStyle}
        {...myprops}
      >
        {props.children}
      </StyledButton>
    );
  };

  const renderNode = () => {
    if (props.path) {
      const payload = `__PATH_PAYLOAD__${props.path}`;
      return <reply payload={payload}>{props.children}</reply>;
    }
    return <reply payload={props.payload}>{props.children}</reply>;
  };

  return renderComponent({ renderBrowser, renderNode });
};

Reply.serialize = (replyProps) => {
  let payload = replyProps.payload;
  if (replyProps.path) payload = `__PATH_PAYLOAD__${replyProps.path}`;
  return { reply: { title: replyProps.children, payload } };
};
