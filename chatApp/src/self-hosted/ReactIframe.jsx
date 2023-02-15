import React, { useState } from 'react'
import { createPortal } from 'react-dom'
import { StyleSheetManager } from 'styled-components';
import createCache from "@emotion/cache";
import weakMemoize from '@emotion/weak-memoize'
import { CacheProvider } from "@emotion/core";

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
function useForceUpdate(){
  const [_, setValue] = useState()
  return () => setValue(0)
}


export const IFrameComponent = ({
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
    
  const mountNode =
    contentRef?.contentWindow?.document?.body
  return (
    <StyleSheetManager target={contentRef?.contentWindow?.document?.head}>
      
        <iframe title={title} {...props} ref={setContentRef}>
        {mountNode && createPortal((<EmotionProvider $head={contentRef?.contentWindow?.document?.head}>{children}</EmotionProvider>),
            mountNode)}
        </iframe>
    </StyleSheetManager>
  )
}
