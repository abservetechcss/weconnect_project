import React, { useState } from "react";
import { createPortal } from "react-dom";
import { StyleSheetManager } from "styled-components";
import styled, { css, keyframes } from "styled-components";
import { useEffect } from "react";
// import createCache from "@emotion/cache";
// import weakMemoize from '@emotion/weak-memoize'
// import { CacheProvider } from "@emotion/core";
const WebFont = require("webfontloader");
const MobileStyle = css`
  width: 100%;
  height: 100%;
  max-height: 100%;
  border-radius: 0px !important;
  right: 0px !important;
  bottom: 0px !important;
  max-width: 100% !important;
  left: 0px !important;
  top: 0 !important;
  margin-bottom: 0px !important;
`;

const showchat = keyframes`
  from {
    transform: scale(0);
    opacity: 0;
    transform-origin:bottom,
  }
`;

const MyIframe = styled.iframe`
  position: fixed;
  bottom: 100px;
  border: none;
  width: 400px;
  height: 470px;

  animation-name: ${showchat};
  animation-duration: 1s;
  transform: scale(1);
  left: auto;
  right: 22px;
  max-height: ${(props) =>
    props.position === "center" ? "100%" : "calc(100% - 105px)"};
  ${(props) => (props.mobile ? MobileStyle : {})}
`;

// let memoizedCreateCacheWithContainer = weakMemoize(container => {
//   let newCache = createCache({ container, key: 'weconnect', });
//   return newCache;
// });

// /* render Emotion style to iframe's head element */
// function EmotionProvider({ children, $head }) {
//   return (
//     <CacheProvider value={memoizedCreateCacheWithContainer($head)}>
//       {children}
//     </CacheProvider>
//   )
// }

// /* hack-ish: force iframe to update */
// function useForceUpdate(){
//   const [_, setValue] = useState()
//   return () => setValue(0)
// }

export const WidgetIframe = ({ children, title, ...props }) => {
  const [contentRef, setContentRef] = useState(null);
  const [fontLoaded, setFontLoaded] = useState(false);

  //   const iFrameRef = useRef(null)
  // const [$iFrameBody, setIframeBody] = useState(null)
  //   const [$iFrameHead, setIframeHead] = useState(null)

  // const forceUpdate = useForceUpdate()

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

  let mountNode = contentRef?.contentWindow?.document?.body;
  let mountHead = contentRef?.contentWindow?.document?.head;

  if (fontLoaded === false && mountHead) {
    setFontLoaded(true);
    // console.log("contentWindow", contentRef?.contentWindow);
    setTimeout(() => {
      WebFont.load({
        google: {
          families: [
            props.fontFamily,
            "Nunito:300,400,500,600.700,800,900,1000",
          ],
        },
        context: contentRef?.contentWindow,
      });
    }, 500);
  }

  useEffect(() => {
    if (contentRef?.contentWindow?.document?.body) {
      if (fontLoaded === false) {
        setFontLoaded(true);
      }
      WebFont.load({
        google: {
          families: [props.fontFamily],
        },
        context: contentRef?.contentWindow,
      });
    }
  }, [props.fontFamily]);

  if (mountNode) {
    mountNode.style = "margin: 0px;overflow: hidden;";
  }
  return (
    <StyleSheetManager target={contentRef?.contentWindow?.document?.head}>
      <MyIframe
        mobile={props.mobile}
        position={props.position}
        title={title}
        {...props}
        ref={setContentRef}
      >
        {mountNode && createPortal(children, mountNode)}
      </MyIframe>
    </StyleSheetManager>
  );
};
