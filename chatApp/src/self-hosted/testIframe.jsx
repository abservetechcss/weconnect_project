import React, { useState } from "react";
import { createPortal } from "react-dom";
import { StyleSheetManager } from "styled-components";
import createCache from "@emotion/cache";
import weakMemoize from "@emotion/weak-memoize";
import { CacheProvider } from "@emotion/core";
import styled from "styled-components";
import { useTheme, createTheme, ThemeProvider } from "@mui/material/styles";
import Slider from "@mui/material/Slider";
import { jssPreset, StylesProvider } from "@mui/styles";
import rtl from "jss-rtl";
import { create } from "jss";

const MyIframe = styled.iframe`
  position: fixed;
  bottom: 100px;
  border: none;
  width: 400px;
  height: 470px;
  max-height: calc(100% - 105px);
  left: auto;
  right: 22px;
`;

const theme = createTheme({
  colors: {
    text: "tomato",
  },
});

let memoizedCreateCacheWithContainer = weakMemoize((container) => {
  let newCache = createCache({
    container,
    key: "weconnect",
    prepend: true,
  });
  return newCache;
});

/* render Emotion style to iframe's head element */
function EmotionProvider({ children, $head }) {
  console.log("$head", $head);
  return (
    <CacheProvider value={memoizedCreateCacheWithContainer($head)}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </CacheProvider>
  );
}

/* hack-ish: force iframe to update */
function useForceUpdate() {
  const [_, setValue] = useState();
  return () => setValue(0);
}

function FramedDemo(props) {
  const { children, document } = props;

  // const theme = useTheme();

  const { jss, sheetsManager } = React.useMemo(() => {
    return {
      jss: create({
        plugins: [...jssPreset().plugins, rtl()],
        insertionPoint: document.head,
      }),
      sheetsManager: new Map(),
    };
  }, [document]);

  const cache = React.useMemo(
    () =>
      createCache({
        key: `weconnect-widget-frame`,
        prepend: true,
        container: document.head,
      }),
    [document]
  );

  const getWindow = React.useCallback(() => document.defaultView, [document]);
  // debugger;
  return (
    <StylesProvider jss={jss} sheetsManager={sheetsManager}>
      <StyleSheetManager target={document.head} stylisPlugins={[]}>
        <CacheProvider value={cache}>{children}</CacheProvider>
      </StyleSheetManager>
    </StylesProvider>
  );
}

export const WidgetIframe = (props) => {
  const [contentRef, setContentRef] = useState(null);
  const { children, title, ...other } = props;
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
  if (mountNode) {
    mountNode.style = "margin: 0px";
  }
  return (
    <React.Fragment>
      <MyIframe title={title} {...other} ref={setContentRef} />
      {mountNode &&
        createPortal(
          <FramedDemo document={document}>
            <Slider
              min={10}
              max={100}
              defaultValue={[15, 25]}
              step={1}
              valueLabelDisplay="auto"
              sx={{
                color: "#e5eced",
                height: "15px",
                padding: "0 0 10px 0",
              }}
            />
          </FramedDemo>,
          mountNode
        )}
    </React.Fragment>
  );
};

{
  /* <EmotionProvider $head={contentRef?.contentWindow?.document?.head}>
          <Slider
              min={10}
              max={100}
              defaultValue={[
                15,
                25,
              ]}
              step={1}
              valueLabelDisplay="auto"
              sx={{
                color: "#e5eced",
                height: "15px",
                padding: "0 0 10px 0"
              }}
            />
          </EmotionProvider> */
}
