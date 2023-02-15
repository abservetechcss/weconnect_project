import styled, { css } from "styled-components";
import image from "../assets/image.svg";

export const RowContainer = styled.div`
display: flex;
text-align: left;
width: 100%;
position: relative;
flex-wrap:wrap;
padding: 0px;
`;

const imageVariant = css`
background-color: #edf1f2;
border-radius: 10px;
max-width: 100px;
padding: 10px;
display: flex;
align-items: center;
flex-direction: column;
margin-right: 10px !important;
margin-bottom: 10px;
`;

const linkVariant = css`
white-space: nowrap;
`;
export const Anchor = styled.a`
text-decoration: none !important;
display: flex;
${(props) => (props.image ? imageVariant : linkVariant)}
`;

const placeHolderVariant = css`
background: ${props => `#fdb28a url(${image}) no-repeat center`};
`;

export const ImageComponent = styled.img`
width: 82px;
height: 76px;
object-fit: cover;
border-radius: 10px;
${(props) => (props.placeHolder && placeHolderVariant)}
`;

export const ButtonStyle = styled.div`
display: flex;
  align-items: center;
  & img {
    margin-right: 5px;
    width: 16px;
  }
`