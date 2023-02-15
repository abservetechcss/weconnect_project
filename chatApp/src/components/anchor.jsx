/**
 * This component is made to support additional data sending between components
 */
import React, { useContext } from 'react'
import styled from 'styled-components'

import { COLORS, WEBCHAT } from '../constants'
import { WebchatContext } from "../contexts";
import { renderComponent } from '../util/react'

let StyledAnchor = styled.a`
  width: 100%;
  padding: 4px 8px;
  font-family: inherit;
  border-radius: 8px;
  cursor: pointer;
  outline: 0;
`

export const Anchor = props => {
  const { getThemeProperty } = useContext(WebchatContext)

  const renderBrowser = () => {
    let replyStyle = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.replyStyle)
    const CustomReply = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.customReply)

    if (props.replyStyle) {
      replyStyle = props.replyStyle;
    }

    return (
      <StyledAnchor
        style={{
          border: `1px solid ${getThemeProperty(
            WEBCHAT.CUSTOM_PROPERTIES.brandColor,
            COLORS.BOTONIC_BLUE
          )}`,
          color: getThemeProperty(
            WEBCHAT.CUSTOM_PROPERTIES.brandColor,
            COLORS.BOTONIC_BLUE
          ),
          ...replyStyle,
          ...props.style
            }}
            // onClick={e => handleClick(e)}
            href={props.href}
            target={props.target}
      >
        {props.children}
      </StyledAnchor>
    )
  }

  return renderComponent({ renderBrowser, renderNode:renderBrowser })
}

Anchor.serialize = replyProps => {
  let payload = replyProps.payload
  if (replyProps.path) payload = `__PATH_PAYLOAD__${replyProps.path}`
  return { reply: { title: replyProps.children, payload } }
}
