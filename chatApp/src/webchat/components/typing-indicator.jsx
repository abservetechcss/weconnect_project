// import './typing-indicator.scss'

import React, { useContext } from 'react'
// import { Text } from '../../components';

import { WEBCHAT } from '../../constants';
import { WebchatContext } from "../../contexts";
import { MessageContainer, Blob, BlobText, BlobTickContainer, BlobTick } from "./common"
// import img from '../../assets/loader/Groovy CSS Spinner.gif'
const validLoaders = {
  "loader1": true,
  "loader2": true,
  "loader3": true,
  "loader4": true,
  "loader5": true,
  "loader6": true,
  "loader7": true,
  "loader8": true,
  "loader9": true,
  "loader10": true,
  "loader11": true,
  "loader12": true,
  "loader13": true,
  "loader14": true,
  "loader15": true,
  "loader16": true,
  "loader17": true,
  "loader18": true,
  "loader19": true,
  "loader20": true,
  "loader21": true,
}


function getColor(current_color) {
  try {
    let match = /rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(,\s*\d+[\.\d+]*)*\)/g.exec(current_color);
    let color = "rgb(" + [match[1], match[2], match[3]].join(',') + ")";
    return color;
  } catch {
    return "rgb(0,0,0)";
  }
}

const images = require.context('../../assets/svg-loaders', true);
const loadImage = imageName => {
  if (validLoaders[imageName]) {
    const image = images(`./${imageName}.svg`).ReactComponent;
    return image;
  } else {
    const image = images(`./loader1.svg`).ReactComponent;
    return image;
  }
};

const DynamicImage = (props, args) => {
  return React.createElement(
    loadImage(props.typing),
    props.args);
}

export const TypingIndicator = props => {
  const { getThemeProperty } = useContext(WebchatContext);
  const typing = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.typing, "rgba(255, 255, 255)");
  const color = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.typingColor);
  // const widgetStyle = getThemeProperty(
  //   WEBCHAT.CUSTOM_PROPERTIES.widgetStyle,
  //   WEBCHAT.DEFAULTS.WIDGETSTYLE
  // );
  // const color = getColor(widgetStyle.background)

  // const messageBubble = getThemeProperty(
  //   WEBCHAT.CUSTOM_PROPERTIES.messageBubble,
  //   "one-rounder"
  // );
  // let bubbleStyle = {};
  // if(messageBubble==="one-rounder") {
  //   bubbleStyle = {
  //     borderRadius: "4px 18px 18px 18px"
  //   };
  // } else if(messageBubble==="square") {
  //   bubbleStyle = {
  //     borderRadius: "0px"
  //   };
  // } else if(messageBubble==="rounder") {
  //   bubbleStyle = {
  //     borderRadius: "18px"
  //   };
  // } else if(messageBubble==="open") {
  //   bubbleStyle = {};
  // }
  // const getMessageStyle = () =>messageBubble!=="open"?
  //   {...widgetStyle, ...bubbleStyle}:{};
  return (
    <DynamicImage typing={typing} args={{ key: 0, color: color }} />
  )
}

