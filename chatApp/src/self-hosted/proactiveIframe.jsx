
import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { StyleSheetManager } from 'styled-components';
import createCache from "@emotion/cache";
import weakMemoize from '@emotion/weak-memoize'
import { CacheProvider } from "@emotion/core";
import styled from "styled-components";

const MyIframe = styled.iframe`
  position: fixed;
  display: flex;
  flex-flow: column;
  overflow: none;
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

let iframe_height = 0;

export const ProactiveIframe = ({
  children,
  title,
  ...props
}) => {
  const [contentRef, setContentRef] = useState(null);

  
  useEffect(()=>{
    if(contentRef)
    {
      const height = contentRef?.contentWindow?.document?.body.scrollHeight;
      if(height>iframe_height) {
        console.log(height, iframe_height)
        iframe_height = height + 10;
      }
      contentRef.style.height = iframe_height+"px";
    }
  },[children])

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
  if (mountNode) {
    mountNode.style = "margin: 0px"
  }
  return (
    <StyleSheetManager target={contentRef?.contentWindow?.document?.head} >
      <MyIframe title={title} {...props} ref={setContentRef} >
        {mountNode && createPortal((<EmotionProvider $head={contentRef?.contentWindow?.document?.head}>{children}</EmotionProvider>),
          mountNode)}
      </MyIframe>
    </StyleSheetManager>
  )
}
