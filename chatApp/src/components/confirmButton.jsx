import React, { useContext } from 'react'
import styled from "styled-components";
import { WebchatContext } from "../contexts";
import { WEBCHAT } from "../constants";
const StyledButton = styled.button`
  border-radius: 20px;
  cursor: pointer;
  padding: 7px 10px 7px 6px;
  text-align: center;
  border: none;
  font-size: 14px;
  width: 100px;
//   margin: 4px auto 20px auto;
  font-family: inherit;
  background: #32e0a1;
`;
const ButtonContainer = styled.div`
  text-align: center;
`;

export const ConfirmButton = props => {
    const { getThemeProperty } = useContext(WebchatContext)
    let widgetStyle = getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.widgetStyle)
  return (
    <ButtonContainer >
              <StyledButton onClick={props.click} style={widgetStyle}>
                Confirm
              </StyledButton>
            </ButtonContainer>
  )
}
