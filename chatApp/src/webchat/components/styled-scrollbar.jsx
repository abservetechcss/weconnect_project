// import 'simplebar/dist/simplebar.css'
// import './styled-scrollbar.scss'
// import '../../simplebar/simplebar.css'
// import SimpleBar from 'simplebar-react'
import SimpleBar from '../../simplebar/simplebar'
import styled, { css } from 'styled-components'

// import { COLORS } from '../../constants'

export const StyledScrollbar = styled(SimpleBar)`
  ${props =>
    props.ismessagescontainer &&
    css`
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
    `}
  & .weconnect-simplebar-scrollbar::before {
    background-color: #e9ebf2;
    background-image: #e9ebf2;
    border-radius: '10px';
  }
  & .weconnect-simplebar-track .weconnect-simplebar-scrollbar.weconnect-simplebar-visible::before {
    opacity: 1;
  }
  & .weconnect-simplebar-track {
    background-color: #fff;
    background-image: #fff;
    border-radius: 20px;
  }
`
