import { Text, CommonReply, CustomReply, ConfirmButton } from "../components";
import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { WebchatContext } from "../contexts";
import { WEBCHAT } from "../constants";
// import "../assets/css/rating.css";
import Tooltip from "@mui/material/Tooltip";
import Slider from "@mui/material/Slider";
// import RatingComponent from "./ratingComponent";

import face1 from "../assets/face1.png";
import face2 from "../assets/face2.png";
import face3 from "../assets/face3.png";
import face4 from "../assets/face4.png";
import face5 from "../assets/face5.png";

import sad2 from "../assets/sad2.png";
import sad1 from "../assets/sad1.png";
import neutral from "../assets/neutral.png";
import happy1 from "../assets/happy1.png";
import happy2 from "../assets/happy2.png";

const image =
  "data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' width='30.719' height='29.311' viewBox='0 0 30.719 29.311'%3E%3Cpath id='star_4_' data-name='star (4)' d='M16.359,2,20.8,10.989l9.922,1.45-7.18,6.993,1.694,9.879-8.874-4.667L7.485,29.311,9.18,19.432,2,12.439l9.922-1.45Z' transform='translate(-1 -1)' fill='%2335d188' stroke='%2335d188' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'/%3E%3C/svg%3E%0A";
const image2 =
  "data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' width='30.719' height='29.311' viewBox='0 0 30.719 29.311'%3E%3Cpath id='star_4_' data-name='star (4)' d='M16.359,2,20.8,10.989l9.922,1.45-7.18,6.993,1.694,9.879-8.874-4.667L7.485,29.311,9.18,19.432,2,12.439l9.922-1.45Z' transform='translate(-1 -1)' fill='%2335d188' stroke='%2335d188' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'/%3E%3C/svg%3E%0A";
const image3 =
  "data:image/svg+xml,%0A%3Csvg xmlns='http://www.w3.org/2000/svg' width='30.719' height='29.311' viewBox='0 0 30.719 29.311'%3E%3Cpath id='star_4_' data-name='star (4)' d='M16.359,2,20.8,10.989l9.922,1.45-7.18,6.993,1.694,9.879-8.874-4.667L7.485,29.311,9.18,19.432,2,12.439l9.922-1.45Z' transform='translate(-1 -1)' fill='%23fff' stroke='%2335d188' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'/%3E%3C/svg%3E%0A";

const RatingStyles = createGlobalStyle`
.weconnect_rating,
.weconnect_emoji,
.weconnect_emoji2,
.weconnect_rating_select {
  display: flex;
  width: 100%;
  justify-content: space-between;
  overflow: hidden;
  flex-direction: row-reverse;
  position: relative;
}

.weconnect_rating-0 {
  filter: grayscale(100%);
}

.weconnect_rating > input,
.weconnect_emoji > input,
.weconnect_emoji2 > input {
  display: none;
}

.weconnect_emoji > label,
.weconnect_emoji2 > label {
  cursor: pointer;
  width: 35px;
  height: 40px;
  margin-top: auto;
  background-repeat: no-repeat;
  background-position: center;
  transition: 0.3s;
  background-size: 76%;
}
.weconnect_emoji > label.weConnect_rating-1 {
  background-image: url("${face1}");
}
.weconnect_emoji > label {
}
.weconnect_emoji > label:hover {
  opacity: 1;
}
.weconnect_emoji > label.weConnect_rating-2 {
  background-image: url("${face2}");
}
.weconnect_emoji > label.weConnect_rating-3 {
  background-image: url("${face3}");
}
.weconnect_emoji > label.weConnect_rating-4 {
  background-image: url("${face4}");
}
.weconnect_emoji > label.weConnect_rating-5 {
  background-image: url("${face5}");
}

.weconnect_emoji2 > label.weConnect_rating-1 {
  background-image: url("${sad2}");
  width: 38px;
}

.weconnect_emoji2 > label.weConnect_rating-2 {
  background-image: url("${sad1}");
  width: 38px;
}

.weconnect_emoji2 > label.weConnect_rating-3 {
  background-image: url("${neutral}");
  width: 38px;
}

.weconnect_emoji2 > label.weConnect_rating-4 {
  background-image: url("${happy1}");
  width: 38px;
}

.weconnect_emoji2 > label.weConnect_rating-5 {
  background-image: url("${happy2}");
  width: 38px;
}

.weconnect_rating>label,
.weconnect_rating_select>label {
  cursor: pointer;
  width: 40px;
  height: 40px;
  margin-top: auto;
  background-repeat: no-repeat;
  background-position: center;
  transition: 0.3s;
  background-image: url("${image3}");
  background-size: 76%;
}

`;

const Ratingstyles2 = createGlobalStyle`
.weconnect_rating > input:checked ~ label,
.weconnect_rating > input:checked ~ label ~ label,
.weconnect_rating_select > label {
  background-image: url("${image2}");
}
`;

const Ratingstyles3 = createGlobalStyle`
.weconnect_rating > input:not(:checked) ~ label:hover,
.weconnect_rating > input:not(:checked) ~ label:hover ~ label {
  background-image: url("${image}");
}
`;

const RatingContainer = styled.div`
  text-align: left;
  border-radius: 10px;
  max-width: 210px !important;
  padding: 2% 0;
  margin-bottom: 10px;
`;

export default class Rating extends React.Component {
  static contextType = WebchatContext;

  constructor(props, context) {
    super(props);
    this.state = {
      date: "",
      sliderValue: 1,
    };
    this.saveSliderRating = this.saveSliderRating.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.widgetStyle = context.getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.widgetStyle,
      WEBCHAT.DEFAULTS.WIDGETSTYLE
    );
  }

  static async botonicInit(req) {
    const item = req.input.item || {}; // meesage from api
    return item;
  }

  setDate(date) {
    this.setState({
      date: date,
    });
  }
  saveRating(star) {
    if (star > 0) {
      this.context.sendInput({
        type: "postback",
        payload: "rating_selected",
        replace: true,
        from: "user",
        item: {
          data: star,
          type: this.props.options.rating_type,
          btn_text: this.props.options["rating_" + star],
        },
        data: star.toString(),
      });
    }
  }

  saveSliderRating() {
    this.saveRating(parseInt(this.state.sliderValue));
  }
  handleSliderChange = (event, value) => {
    this.setState({
      sliderValue: parseInt(value),
    });
  };
  valueLabelFormat = (x) => {
    return this.props.options["rating_" + x];
  };

  render() {
    console.log(this.props.component);
    return (
      <>
        <RatingStyles />
        <Ratingstyles2 />
        <Ratingstyles3 />
        <Text
          transparency={
            this.props.component ? this.props.component.transparency : 0
          }
        >
          {this.props.component.question}
        </Text>
        {this.props.reply !== true && (
          <>
            {this.props.options.rating_type === "slider" && (
              <>
                <RatingContainer style={{ maxWidth: "296px" }}>
                  <Slider
                    className="weconnect_single_range"
                    min={1}
                    max={5}
                    steps={1}
                    value={this.state.sliderValue}
                    onChange={this.handleSliderChange}
                    sx={{
                      color: "#e5eced",
                      height: "15px",
                      padding: "0 0 10px 0",
                      marginLeft: "50px",
                      maxWidth: "210px",
                      "& .MuiSlider-track": this.widgetStyle,
                      "& .MuiSlider-thumb": this.widgetStyle,
                      "& .MuiSlider-rail": this.widgetStyle,
                    }}
                    // onChange={(e, v) => {
                    //   this.setState({
                    //     sliderValue: parseInt(v),
                    //   });
                    // }}
                    valueLabelDisplay="auto"
                    valueLabelFormat={this.valueLabelFormat}
                  />
                  <ConfirmButton click={this.saveSliderRating} />
                </RatingContainer>
              </>
            )}
            <CustomReply>
              {this.props.options.rating_type !== "slider" && (
                <RatingContainer style={{ maxWidth: "210px" }}>
                  {/* <RatingComponent options={this.props.options} saveRating={this.saveRating}/> */}
                  <div
                    className={
                      this.props.options.rating_type === "star"
                        ? "weconnect_rating"
                        : this.props.options.rating_type === "emoji"
                        ? "weconnect_emoji"
                        : "weconnect_emoji2"
                    }
                  >
                    <input
                      type="radio"
                      id="rating-5"
                      title={this.props.options.rating_5}
                      onClick={() => this.saveRating(5)}
                    />
                    <Tooltip
                      title={this.props.options.rating_5}
                      placement="top"
                    >
                      <label
                        className="weConnect_rating-5"
                        htmlFor="rating-5"
                      ></label>
                    </Tooltip>
                    <input
                      type="radio"
                      id="rating-4"
                      title={this.props.options.rating_4}
                      onClick={() => this.saveRating(4)}
                    />
                    <Tooltip
                      title={this.props.options.rating_4}
                      placement="top"
                    >
                      <label
                        className="weConnect_rating-4"
                        htmlFor="rating-4"
                      ></label>
                    </Tooltip>
                    <input
                      type="radio"
                      id="rating-3"
                      title={this.props.options.rating_3}
                      onClick={() => this.saveRating(3)}
                    />
                    <Tooltip
                      title={this.props.options.rating_3}
                      placement="top"
                    >
                      <label
                        className="weConnect_rating-3"
                        htmlFor="rating-3"
                      ></label>
                    </Tooltip>
                    <input
                      type="radio"
                      id="rating-2"
                      title={this.props.options.rating_2}
                      onClick={() => this.saveRating(2)}
                    />
                    <Tooltip
                      title={this.props.options.rating_2}
                      placement="top"
                    >
                      <label
                        className="weConnect_rating-2"
                        htmlFor="rating-2"
                      ></label>
                    </Tooltip>
                    <input
                      type="radio"
                      id="rating-1"
                      title={this.props.options.rating_1}
                      onClick={() => this.saveRating(1)}
                    />
                    {/* Issue: If element is transform outside div, element did not shown */}
                    <Tooltip
                      title={this.props.options.rating_1}
                      placement="top"
                    >
                      <label
                        className="weConnect_rating-1"
                        htmlFor="rating-1"
                      ></label>
                    </Tooltip>
                  </div>
                </RatingContainer>
              )}

              <CommonReply {...this.props.component} />
            </CustomReply>
          </>
        )}
      </>
    );
  }
}
