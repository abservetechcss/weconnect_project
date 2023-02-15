import React from 'react'
import styled from 'styled-components'

import { resolveImage } from '../../util/environment'
import { COLORS } from "../../constants";
const PointerImage = styled.img`
  cursor: pointer;
  width: 10px;
`
export const Wrapper = styled.div`
  box-sizing: border-box;
  position: relative;
`;
export const Icon = props => <PointerImage src={resolveImage(props.src)} />

export const IconContainer = styled.div`
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
position: relative;
`
// attachment styles
export const AttachmentInner = styled.div`
width: 30px;
      height: 30px;
      border-radius: 50%;
      border: 1px solid #00424f73;
      display: flex;
      align-items: center;
      cursor: pointer;
      justify-content: center;
      &:hover {
        background-color: #00424f17;
        border: 1px solid #00424f;
      }
`
// attachment styles
export const AttachmentText = styled.p`
      font-family: inherit;
      font-size: 12px;
      margin: 7px 0 10px 0;
`
// attachment styles
export const AttachmentInput = styled.input`
opacity: 0;
position: absolute;
width: 100%;
height: 100%;
cursor: pointer;
`
// message styles
export const BotMessageImageContainer = styled.div`
width: auto;
padding: 12px 4px;
flex: none;
display: flex;
align-items: center;
justify-content: center;
`;
// message styles
export const Blob = styled.div`
  position: relative;
  border: none;
  height: fit-content;
  font-family:inherit;
  max-width: ${(props) =>
    props.blob
      ? props.blobwidth
        ? props.blobwidth
        : "60%"
      : "calc(100% - 16px)"};
`;
// message styles
export const BlobText = styled.div`
  padding: ${(props) => (props.blob ? "8px 12px" : "0px")};
  display: flex;
  flex-direction: column;
  white-space: pre-line;
  font-weight: inherit;
  text-align: left;
  p {
    margin: 0;
  }
  ${(props) => props.markdownstyle}
`;

export const BlobTickContainer = styled.div`
  position: absolute;
  box-sizing: border-box;
  height: 100%;
  padding: 18px 0px 18px 0px;
  display: flex;
  top: 0;
  align-items: center;
`;

export const BlobTick = styled.div`
  position: relative;
  margin: -${(props) => props.pointerSize}px 0px;
  border: ${(props) => props.pointerSize}px solid ${COLORS.TRANSPARENT};
`;

export const MessageContainer = styled.div`
  display: flex;
  justify-content: ${(props) => (props.isfromuser ? "flex-end" : "flex-start")};
  position: relative;
  padding: 10px 6px;
  margin-right: 10px;
  align-items: center;
`;