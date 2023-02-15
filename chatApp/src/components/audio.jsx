import { INPUT, isBrowser } from '@botonic/core'
import React from 'react'

import { ROLES } from '../constants'
import { Message } from './message'
// import "../assets/css/audio.css";
import AudioPlayer from "./../components/audioPlayer";

const serialize = audioProps => {
  return { audio: audioProps.src }
}

export const Audio = props => {
  <style>
    {`
    .audioplayer {
    width: 100%;
    height: 35px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #35d188;
    color: #fff;
    border-radius: 30px;
    padding: unset !important;
    margin: 0px 10px;
    }
    .audioplayer_user>svg {
        margin: 0 7px 0 10px;
        font-size: 17px;
    }
    .audioplayer_user .slider {
        width: 110px;
    }
    .audioplayer>div {
        width: 110px;
        height: 15px;
        display: flex;
        align-items: center;
        position: relative;
    }
    .audioplayer__slider {
        -webkit-appearance: none;
        -moz-appearance: none;
        appearance: none;
        height: 5px;
        width: 100%;
        background: rgba(0,0,0,.1882352941);
        border-radius: 2.5px;
        position: absolute;
        right: 0;
        z-index: 1;
    }
    .audioplayer_user .audioplayer__time {
        background: #fff;
        color: #000;
        border-radius: 12px;
        padding: 0px 2px;
        text-align: center;
        font-size: 11px !important;
    }
    .audioplayer_user .slider {
      width: 110px;
    }
    .audioplayer.audioplayer_user svg{
      padding-left:10px
    }
    div#botonic-scrollable-content {
    height: 100%;
}
    `}
  </style>
  let content = props.children
  if (isBrowser())
    content = (
      <audio style={{ maxWidth: '100%' }} id='myAudio' controls>
        <source src={props.src} type='audio/mpeg' />
        Your browser does not support this audio format.
      </audio>
    )
  return (
    <Message
      style={{ background: "transparent" }}
      role={ROLES.AUDIO_MESSAGE}
      json={serialize(props)}
      {...props}
      type={INPUT.AUDIO}
    >
      <AudioPlayer
        sender="user"
        audioUrl={props.src}
      />
    </Message>
  )
}

Audio.serialize = serialize
