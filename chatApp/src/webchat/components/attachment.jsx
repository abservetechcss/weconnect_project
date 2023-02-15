import React from 'react'

// import AttachmentIcon from '../../assets/attachment-icon.svg'
// import { ROLES } from '../../constants'
import { Icon, IconContainer, AttachmentText, AttachmentInner, AttachmentInput } from './common'

export const Attachment = ({ onChange, accept, icon, text, attachment }) => (
  <IconContainer>
    <AttachmentInner>
      <Icon src={icon} />
    </AttachmentInner>
    <AttachmentText>{text}</AttachmentText>
{attachment ? <AttachmentInput
      type='file'
      name='file'
      id='attachment'
      onChange={onChange}
      accept={accept}
    />: <AttachmentInput as="span" onClick={onChange} />}
    
  </IconContainer>
)
