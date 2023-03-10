import React, { useContext, useEffect } from 'react'
import Frame from 'react-frame-component'
import styled from 'styled-components'

import { COLORS, ROLES, WEBCHAT } from '../constants'
import { RequestContext, WebchatContext } from '../contexts'

const StyledWebview = styled.div`
position: ${(props) => (props.mode === "widget" ? "absolute" : "relative")};
  display: flex;
  flex-direction: column;
  bottom: 0;
  width: 100%;
  height: 100%;
  background-color: ${COLORS.SOLID_WHITE};
  z-index: 2;
  border-radius: 20px 20px 0px 0px;
`

const StyledWebviewHeader = styled.div`
  text-align: right;
  border-top: 1px solid ${COLORS.SOLID_BLACK_ALPHA_0_2};
  border-bottom: 1px solid ${COLORS.SOLID_BLACK_ALPHA_0_2};
  border-radius: 20px 20px 0px 0px;
`
const StyledCloseHeader = styled.div`
  display: inline-block;
  padding: 8px 12px;
  cursor: pointer;
`

const StyledWebviewContent = styled.div`
  flex: 1;
`

const StyledFrame = styled.iframe`
  border-style: none;
  width: 100%;
  height: 100%;
`

const WebviewMode = props => {
  /*
    Default mode is with divs.
    Setting the prop "asframe" will render the webview inside an iframe.
    Pros and Cons of this "asframe" mode are:
    Pros: OAuth2 flows can be tested locally with an iframe.
    Cons: We won't be able to visualize correctly css styles in botonic serve (although styles will work in production).
   */

  const style = {
    borderStyle: 'none',
    width: '100%',
    height: '100%',
  }
  if (props.asframe) {
    return <Frame style={style}>{props.children}</Frame>
  }
  return <div style={style}>{props.children}</div>
}

export const WebviewHeader = () => {
  const { closeWebview } = useContext(RequestContext)
  const { getThemeProperty } = useContext(WebchatContext)
  return (
    <StyledWebviewHeader
      role={ROLES.WEBVIEW_HEADER}
      style={{
        ...getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.headerStyle),
      }}
    >
      <StyledCloseHeader onClick={closeWebview}>✕</StyledCloseHeader>
    </StyledWebviewHeader>
  )
}

export const WebviewContainer = props => {
  const { webchatState, getThemeProperty } = useContext(WebchatContext)
  const { closeWebview } = useContext(RequestContext)
  const Webview = webchatState.webview
  const close = e => e.data == 'botonicCloseWebview' && closeWebview()

  useEffect(() => {
    if (window.addEventListener) {
      window.addEventListener('message', close, false)
    } else if (window.attachEvent) {
      // ie8
      window.attachEvent('onmessage', close)
    }
  }, [])

  return (
    <StyledWebview
      role={ROLES.WEBVIEW}
      mode={props.mode}
    // style={{
    //   ...props.style,
    // }}
    >
      {typeof Webview === 'string' && <WebviewHeader />}
      <StyledWebviewContent>
        {typeof Webview === 'string' ? (
          <StyledFrame src={Webview} />
        ) : (
          <WebviewMode>
            <Webview />
          </WebviewMode>
        )}
      </StyledWebviewContent>
    </StyledWebview>
  )
}
