import React from "react";
import Tooltip from "@mui/material/Tooltip";
import styled, { css } from "styled-components";
const RatingInput = styled.input`
display:none`;

const labelStar = css`
width: 40px;
height: 40px;
background-image: url("data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' width='30.719' height='29.311' viewBox='0 0 30.719 29.311'%3E%3Cpath id='star_4_' data-name='star (4)' d='M16.359,2,20.8,10.989l9.922,1.45-7.18,6.993,1.694,9.879-8.874-4.667L7.485,29.311,9.18,19.432,2,12.439l9.922-1.45Z' transform='translate(-1 -1)' fill='%23fff' stroke='%2335d188' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'/%3E%3C/svg%3E%0A");
`;

const labelEmoji = css`
width: 35px;
 height: 40px;
`;

const Label = styled.label`
cursor: pointer;
  margin-top: auto;
  background-repeat: no-repeat;
  background-position: center;
  transition: 0.3s;
  background-size: 76%;
  ${(props) => (props.type==="star" ? labelStar : labelEmoji)}
`
const filledStar = css`
background-image: url("data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' width='30.719' height='29.311' viewBox='0 0 30.719 29.311'%3E%3Cpath id='star_4_' data-name='star (4)' d='M16.359,2,20.8,10.989l9.922,1.45-7.18,6.993,1.694,9.879-8.874-4.667L7.485,29.311,9.18,19.432,2,12.439l9.922-1.45Z' transform='translate(-1 -1)' fill='%2335d188' stroke='%2335d188' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'/%3E%3C/svg%3E%0A");
`;

const ratingStar = styled.div`
display: flex;
width: 100%;
justify-content: space-between;
overflow: hidden;
flex-direction: row-reverse;
position: relative;
&> ${RatingInput} {
    &:checked {
    & ~ label,  & ~ label ~ label {
        ${filledStar}
    }
    };
    color: red;
    &:not(:checked) ~ ${Label} {
        &:hover, &:hover ~ ${Label} {
            ${filledStar}
        }
    };
}
`;

const ratingEmoji = styled.div`

`;

const ratingEmoji2 = styled.div`

`;

const RatingComponent = (props)=> {
    let type = props.options.rating_type;
    let RatingElement = ratingStar;
    if(type==="star") {
        RatingElement = ratingStar;
    } else if(type==="emoji") {
        RatingElement = ratingEmoji;
    } else if(type==="emoji2") {
        RatingElement = ratingEmoji2;
    }

    return (<RatingElement>
        <RatingInput
          name="weconnect_radio"
          type="radio"
          id="rating-5"
          title={props.options.rating_5}
          onClick={() => props.saveRating(5)}
        />
        <Tooltip
          title={props.options.rating_5}
          placement="top"
        >
          <Label
            type={type}
            className="weConnect_rating-5"
            htmlFor="rating-5"
          ></Label>
        </Tooltip>
        <RatingInput
          type="radio"
          name="weconnect_radio"
          id="rating-4"
          title={props.options.rating_4}
          onClick={() => props.saveRating(4)}
        />
        <Tooltip
          title={props.options.rating_4}
          placement="top"
        >
          <Label
            type={type}
            className="weConnect_rating-4"
            htmlFor="rating-4"
          ></Label>
        </Tooltip>
        <RatingInput
          type="radio"
          id="rating-3"
          name="weconnect_radio"
          title={props.options.rating_3}
          onClick={() => props.saveRating(3)}
        />
        <Tooltip
          title={props.options.rating_3}
          placement="top"
        >
          <Label
            type={type}
            className="weConnect_rating-3"
            htmlFor="rating-3"
          ></Label>
        </Tooltip>
        <RatingInput
          type="radio"
          id="rating-2"
          name="weconnect_radio"
          title={props.options.rating_2}
          onClick={() => props.saveRating(2)}
        />
        <Tooltip
          title={props.options.rating_2}
          placement="top"
        >
          <Label
            type={type}
            className="weConnect_rating-2"
            htmlFor="rating-2"
          ></Label>
        </Tooltip>
        <RatingInput
          type="radio"
          id="rating-1"
          name="weconnect_radio"
          title={props.options.rating_1}
          onClick={() => props.saveRating(1)}
        />
        {/* Issue: If element is transform outside div, element did not shown */}
        <Tooltip
          title={props.options.rating_1}
          placement="top"
        >
          <Label
            type={type}
            className="weConnect_rating-1"
            htmlFor="rating-1"
          ></Label>
        </Tooltip>
      </RatingElement>);
}
export default RatingComponent;