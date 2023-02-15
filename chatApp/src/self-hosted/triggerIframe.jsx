
import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { StyleSheetManager } from 'styled-components';
import createCache from "@emotion/cache";
import weakMemoize from '@emotion/weak-memoize'
import { CacheProvider } from "@emotion/core";
import styled, { css, keyframes } from "styled-components";

const pulse_tada = keyframes`
  0%, 100% {
    -webkit-transform: scale3d(1,1,1);
    transform: scale3d(1,1,1);
  }
  10%, 20% {
      -webkit-transform: scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg);
      transform: scale3d(.9,.9,.9) rotate3d(0,0,1,-3deg);
  }
  30%, 50%, 70%, 90% {
      -webkit-transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg);
      transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,3deg);
  }
  40%, 60%, 80% {
      -webkit-transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg);
      transform: scale3d(1.1,1.1,1.1) rotate3d(0,0,1,-3deg);
  }
`;
const pulse_border = keyframes`
  0% {
		padding: 25px;
		opacity: 0.75;
	}
	75% {
		padding: 50px;
		opacity: 0;
	}
	100% {
		opacity: 0;
	}
`;
const MyIframe = styled.iframe`
position: fixed;
width: 76px;
border: none;
    height: 76px;
    bottom: 20px;
    padding: 0px;
    z-index: 9999;
    overflow: hidden;
    border-radius: 50%;
    margin: 0px;
     ${props => props.type === "tada" && css`
  animation: ${pulse_tada} 1.5s infinite ease-out;
  `}
  ${props => props.type === "ripple" && css`
  &:before{
    content: "";
    position: absolute;
    border-radius: 50%;
    padding: 25px;
    border: ${(props) => `5px solid ${props.color}`};
    opacity: 0.75;
    animation: ${pulse_border} 1.5s ease-out infinite;
  }
  `}
`;

// Ripple animation not workig on iframe, so extra div is created around iframe
const TadaDiv = styled.div`
position: fixed;
width: 76px;
border: none;
    height: 76px;
    bottom: 20px;
    padding: 0px;
    z-index: 9999;
    overflow: hidden;
    border-radius: 50%;
    margin: 0px;
    ${props => props.type === "ripple" && css`
    &:before{
      content: "";
      position: absolute;
      border-radius: 50%;
      padding: 25px;
      border: ${(props) => `5px solid ${props.color}`};
      opacity: 0.75;
      animation: ${pulse_border} 1.5s ease-out infinite;
    }
    `}
`;


let memoizedCreateCacheWithContainer = weakMemoize(container => {
  let newCache = createCache({ container, key: 'weconnect', });
  return newCache;
});

/* render Emotion style to iframe's head element */
function EmotionProvider({ children, $head }) {
  return (
    <CacheProvider value={memoizedCreateCacheWithContainer($head)}>
      {children}
    </CacheProvider>
  )
}

/* hack-ish: force iframe to update */
function useForceUpdate() {
  const [_, setValue] = useState()
  return () => setValue(0)
}


export const TriggerIframe = ({
  children,
  title,
  ...props
}) => {
  const [contentRef, setContentRef] = useState(null)
  //   const iFrameRef = useRef(null)
  // const [$iFrameBody, setIframeBody] = useState(null)
  //   const [$iFrameHead, setIframeHead] = useState(null)

  const forceUpdate = useForceUpdate()

  //  useEffect(function(){
  //   if (!contentRef.current) return

  //   const $iframe = contentRef.current
  //   $iframe.addEventListener('load', onLoad)

  //   function onLoad() {
  //     // TODO can probably attach these to ref itself?
  //     setIframeBody(contentRef?.contentWindow?.document?.body)
  //     setIframeHead(contentRef?.contentWindow?.document?.head)

  //     // force update, otherwise portal children won't show up
  //     forceUpdate()
  //   }

  //   return function() {
  //     // eslint-disable-next-line no-restricted-globals
  //     $iframe.removeEventListener('load', onload)
  //   }
  // })

  let mountNode =
    contentRef?.contentWindow?.document?.body;
  if (mountNode) {
    mountNode.style = "margin: 0px"
  }
  return (
    <StyleSheetManager target={contentRef?.contentWindow?.document?.head}>
      <MyIframe title={title} {...props} ref={setContentRef}>
        {mountNode && createPortal((<EmotionProvider $head={contentRef?.contentWindow?.document?.head}>{children}</EmotionProvider>),
          mountNode)}
      </MyIframe>
    </StyleSheetManager>
  )
}
