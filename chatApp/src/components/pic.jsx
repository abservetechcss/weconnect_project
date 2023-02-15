import React from 'react'
import styled from 'styled-components'
import image from "../assets/image.svg";
import { COLORS, WEBCHAT } from '../constants'
import { renderComponent } from '../util/react'

const PicStyled = styled.div`
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  width: ${WEBCHAT.DEFAULTS.ELEMENT_WIDTH}px;
  height: 140px;
  background: ${props => props.src ? `${COLORS.SOLID_WHITE} url(${props.src}) no-repeat center/cover`: `#fdb28a url(${image}) no-repeat center`};
  border-bottom: 1px solid ${COLORS.SEASHELL_WHITE};
`;


export const Pic = props => {
  const renderBrowser = () => <PicStyled src={props.src} />
  
  const renderNode = () => <pic>{props.src}</pic>
  return renderComponent({ renderBrowser, renderNode })
}

Pic.serialize = picProps => {
  return { pic: picProps.src }
}
