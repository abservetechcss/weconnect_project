import { INPUT, isBrowser } from "@botonic/core";
import React, { useContext, useEffect, useState } from "react";
// import Fade from "react-reveal/Fade";
// import styled from "styled-components";
import { v4 as uuidv4 } from "uuid";

import { COLORS, SENDERS, WEBCHAT } from "../constants";
import { WebchatContext } from "../contexts";
import { isDev, resolveImage } from "../util/environment";
// import merge from "lodash.merge";
import { ConditionalWrapper, renderComponent } from "../util/react";
import { Button } from "../components/button";
import { ButtonsDisabler } from "../components/buttons-disabler";
import BiCheckDouble from "../assets/react-icons/BiCheckDouble";
import BiCheck from "../assets/react-icons/BiCheck";
import styled from "styled-components";
// import {
//   getMarkdownStyle,
//   renderLinks,
//   renderMarkdown,
// } from "../components/markdown";
import { Reply } from "./reply";
import { MessageTimestamp } from "../components/timestamps";

import {
  BotMessageImageContainer,
  Blob,
  BlobText,
  MessageContainer,
  // BlobTickContainer,
  // BlobTick,
} from "../webchat/components/common";

const Tickposiion = styled.span``;
const Wrapper = styled.div`
  ${"" /* margin: 8px 8px 8px 8px; */}
`;

export const Message = (props) => {
  const { addMessage, getThemeProperty, webchatState } =
    useContext(WebchatContext);
  // const { defaultDelay } = useContext(RequestContext);
  // const defaultTyping = getThemeProperty(
  //   WEBCHAT.CUSTOM_PROPERTIES.delay,
  //   0
  // );
  // const defaultTyping = 0;
  let {
    type = "",
    blob = true,
    from = SENDERS.bot,
    // delay = defaultDelay,
    // typing = defaultTyping,
    children,
    // enabletimestamps = props.enabletimestamps || props.enableTimestamps,
    json,
    style,
    html,
    noAvatar,
    imagestyle = props.imagestyle || props.imageStyle,
    ...otherProps
  } = props;
  const isFromUser = from === SENDERS.user;
  const isFromBot = from === SENDERS.bot;
  const markdown = props.markdown;
  const [state, setState] = useState({
    id: props.id || uuidv4(),
  });

  const [disabled, setDisabled] = useState(false);
  children = ButtonsDisabler.updateChildrenButtons(children, {
    parentId: state.id,
    disabled,
    setDisabled,
  });
  const replies = React.Children.toArray(children).filter(
    (e) => e.type === Reply
  );
  const buttons = React.Children.toArray(children).filter(
    (e) => e.type === Button
  );

  let textChildren = React.Children.toArray(children).filter(
    (e) => ![Button, Reply].includes(e.type)
  );
  if (isFromUser && !html) textChildren = textChildren.map((e) => e);

  // const { timestampsEnabled, getFormattedTimestamp, timestampStyle } =
  //   resolveMessageTimestamps(getThemeProperty, enabletimestamps);

  const getEnvAck = () => {
    if (isDev) return 1;
    if (!isFromUser) return 1;
    if (props.ack !== undefined) return props.ack;
    return 0;
  };

  const ack = getEnvAck();

  if (isBrowser()) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      const decomposedChildren = json;
      // let display = delay + typing == 0;
      // if (from === "user") {
      //   display = true;
      // }
      // if (webchatState.previewMode) {
      //   display = true;
      // }
      const message = {
        id: state.id,
        type,
        data: decomposedChildren ? decomposedChildren : textChildren,
        // timestamp: props.timestamp || getFormattedTimestamp,
        markdown,
        from,
        buttons: buttons.map((b) => ({
          parentId: b.props.parentId,
          payload: b.props.payload,
          path: b.props.path,
          url: b.props.url,
          target: b.props.target,
          webview: b.props.webview && String(b.props.webview),
          title: b.props.children,
          ...ButtonsDisabler.withDisabledProps(b.props),
        })),
        // delay,
        // typing,
        replies: replies.map((r) => ({
          payload: r.props.payload,
          path: r.props.path,
          url: r.props.url,
          text:
            typeof r.props.children === "string"
              ? r.props.children
              : r.props.text,
        })),
        display: true,
        readStatus: 0, // 0 for not send, 1 for send(single tick), 2 for read status (double tick)
        customTypeName: decomposedChildren.customTypeName,
        ack: ack,
      };
      addMessage(message);
    }, []);

    // eslint-disable-next-line react-hooks/rules-of-hooks
    // useEffect(() => {
    //   const msg = webchatState.messagesJSON.find(m => m.id === state.id)
    //   if (
    //     msg &&
    //     msg.display &&
    //     webchatState.messagesJSON.filter(m => !m.display).length == 0
    //   ) {
    //     updateReplies(replies)
    //   }
    // }, [webchatState.messagesJSON])
  }

  const brandColor = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.brandColor,
    COLORS.BOTONIC_BLUE
  );

  const getBgColor = () => {
    if (!blob) return COLORS.TRANSPARENT;
    if (isFromUser) {
      return getThemeProperty(
        WEBCHAT.CUSTOM_PROPERTIES.userMessageBackground,
        brandColor
      );
    }
    return getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.botMessageBackground,
      COLORS.SEASHELL_WHITE
    );
  };

  const messageBubble = getThemeProperty(
    WEBCHAT.CUSTOM_PROPERTIES.messageBubble,
    "one-rounder"
  );
  let bubbleStyle = {};
  if (messageBubble === "one-rounder") {
    bubbleStyle = {
      borderRadius: "4px 18px 18px 18px",
    };
  } else if (messageBubble === "square") {
    bubbleStyle = {
      borderRadius: "0px",
    };
  } else if (messageBubble === "rounder") {
    bubbleStyle = {
      borderRadius: "18px",
    };
  } else if (messageBubble === "open") {
    bubbleStyle = {};
  }
  const avatarScale = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.avatarScale);

  const widgetStyle = {
    ...getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.widgetStyle,
      WEBCHAT.DEFAULTS.WIDGETSTYLE
    ),
  };

  const responseStyle = {
    ...getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.responseStyle,
      WEBCHAT.DEFAULTS.WIDGETSTYLE
    ),
  };
  const color = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.typingColor);

  if (props.transparency === 1) {
    delete widgetStyle.background;
    delete responseStyle.background;
  }
  const mystyle = isFromBot ? widgetStyle : responseStyle;

  const getMessageStyle = () =>
    messageBubble !== "open" ? { ...mystyle, ...bubbleStyle } : {};

  // const hasBlobTick = () => getThemeProperty(`message.${from}.blobTick`, true);

  const renderBrowser = () => {
    const m = webchatState.messagesJSON.find((m) => m.id === state.id);
    let readStatus = null;
    if (m) {
      if (m.readStatus === 1) {
        readStatus = (
          <Tickposiion>
            <BiCheck color={color} />
          </Tickposiion>
        );
      } else if (m.readStatus === 2) {
        readStatus = (
          <Tickposiion>
            <BiCheckDouble color={color} />
          </Tickposiion>
        );
      }
      // else {
      //   readStatus = 'not send';
      // }
    }

    // if (!m || !m.display) return <></>;

    // const getBlobTick = (pointerSize) => {
    //   // to add a border to the blobTick we need to create two triangles and overlap them
    //   // that is why the color depends on the pointerSize
    //   // https://developpaper.com/realization-code-of-css-drawing-triangle-border-method/
    //   const color =
    //     pointerSize == 5
    //       ? getBgColor()
    //       : getThemeProperty(
    //           `message.${from}.style.borderColor`,
    //           COLORS.TRANSPARENT
    //         );
    //   const containerStyle = {
    //     ...getThemeProperty(`message.${from}.blobTickStyle`),
    //   };
    //   const blobTickStyle = {};
    //   if (isFromUser) {
    //     containerStyle.right = 0;
    //     containerStyle.marginRight = -pointerSize;
    //     blobTickStyle.borderRight = 0;
    //     blobTickStyle.borderLeftColor = color;
    //   } else {
    //     containerStyle.left = 0;
    //     containerStyle.marginLeft = -pointerSize;
    //     blobTickStyle.borderLeft = 0;
    //     blobTickStyle.borderRightColor = color;
    //   }
    //   return (
    //     <BlobTickContainer style={containerStyle}>
    //       <BlobTick pointerSize={pointerSize} style={blobTickStyle} />
    //     </BlobTickContainer>
    //   );
    // };

    const BotMessageImage = getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.avatar,
      WEBCHAT.DEFAULTS.LOGO
    );
    // const animationsEnabled = getThemeProperty(
    //   WEBCHAT.CUSTOM_PROPERTIES.enableAnimations,
    //   true
    // );

    // const resolveCustomTypeName = () =>
    //   isFromBot && type === INPUT.CUSTOM ? ` ${m.customTypeName}` : "";

    // const className = `${type}-${from}${resolveCustomTypeName()}`;
    const className = `${type}-${from}`;
    /**
     * @Todo: animation need be conditionally diabled for builder & enabled for widget part
     *
     */

    return (
      <Wrapper>
        <MessageContainer
          isfromuser={isFromUser}
          style={{
            ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.messageStyle),
          }}
        >
          {isFromBot && BotMessageImage && !noAvatar && (
            <BotMessageImageContainer
              style={{
                ...getThemeProperty(
                  WEBCHAT.CUSTOM_PROPERTIES.botMessageImageStyle
                ),
                ...imagestyle,
              }}
            >
              <img
                alt=""
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: avatarScale + "%",
                }}
                src={BotMessageImage}
              />
            </BotMessageImageContainer>
          )}
          <Blob
            className={className}
            bgcolor={getBgColor()}
            color={isFromUser ? COLORS.SOLID_WHITE : COLORS.SOLID_BLACK}
            blobwidth={getThemeProperty(
              WEBCHAT.CUSTOM_PROPERTIES.botMessageBlobWidth
            )}
            blob={blob}
            style={{
              ...getMessageStyle(),
              ...style,
            }}
            {...otherProps}
          >
            {markdown || html ? (
              <BlobText
                blob={blob}
                dangerouslySetInnerHTML={{
                  __html: textChildren,
                }}
              />
            ) : (
              <BlobText blob={blob}>{textChildren}</BlobText>
            )}
            {/* {buttons}
              {Boolean(blob) && hasBlobTick() && getBlobTick(0)}
              {Boolean(blob) && hasBlobTick() && getBlobTick(0)} */}
          </Blob>
        </MessageContainer>
        {isFromUser && m && readStatus && (
          <MessageTimestamp timestamp={"test"} isfromuser={isFromUser}>
            {readStatus}
          </MessageTimestamp>
        )}
      </Wrapper>
    );
  };

  const { blob: _blob, json: _json, ...nodeProps } = props;
  const renderNode = () => {
    return type === INPUT.CUSTOM ? (
      <message
        json={JSON.stringify(_json)}
        // typing={typing}
        // delay={delay}
        {...nodeProps}
      />
    ) : (
      <message {...nodeProps}>{children}</message>
    );
  };

  return renderComponent({ renderBrowser, renderNode });
};
