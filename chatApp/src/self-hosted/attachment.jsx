import React from 'react'
import styled from "styled-components";

import AttachmentIcon from '../assets/botonic/attachment-icon.svg'
import { ROLES } from '../constants'
// import { Icon, IconContainer } from '../webchat/components/common'
import { resolveImage } from '../util/environment'

const PointerImage = styled.img`
  cursor: pointer;
`
export const Icon = props => <PointerImage src={resolveImage(props.src)} />

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  padding-right: 15px;
`

export const Attachment = ({ onChange, accept }) => (
  <IconContainer role={ROLES.ATTACHMENT_ICON}>
    <label htmlFor='attachment' style={{ marginTop: 4 }}>
      <Icon src={AttachmentIcon} />
    </label>
    <input
      type='file'
      name='file'
      id='attachment'
      style={{ display: 'none' }}
      onChange={onChange}
      accept={accept}
    ></input>
  </IconContainer>
)
