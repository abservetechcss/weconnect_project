import { Text } from "../components";
import React from "react";
import styled from "styled-components";
import { WebchatContext } from "../contexts";
// import "../assets/css/rating.css";
import Slider from "@mui/material/Slider";
import { WEBCHAT } from "../constants";

const RatingContainer = styled.div`
  text-align: left;
  border-radius: 10px;
  max-width: 210px;
  padding: 0 15px;
  background: #fff;
`;

export default class RatingSelected extends React.Component {
  static contextType = WebchatContext;
  constructor(props, context) {
    super(props);
    this.widgetStyle = context.getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.widgetStyle,
      WEBCHAT.DEFAULTS.WIDGETSTYLE
    );
  }

  static async botonicInit(req) {
    const item = req.input.item || {}; // meesage from api
    return item;
  }

  render() {
    return (
      <>
        <Text from="user" html={false}>
          <RatingContainer>
            {this.props.type === "slider" && (
              <>
                <Slider
                  min={1}
                  max={5}
                  steps={1}
                  value={this.props.data}
                  sx={{
                    color: "#e5eced",
                    height: "15px",
                    padding: "0 0 10px 0",
                    minWidth: "160px",
                    "& .MuiSlider-track": { ...this.widgetStyle },
                    "& .MuiSlider-thumb": { ...this.widgetStyle },
                  }}
                  // valueLabelDisplay="on"
                  // valueLabelFormat={this.dataLabelFormat}
                />
              </>
            )}
            {this.props.type !== "slider" && this.props.type !== "star" && (
              <div
                className={
                  this.props.type === "star"
                    ? "weconnect_rating"
                    : this.props.type === "emoji"
                    ? "weconnect_emoji"
                    : "weconnect_emoji2"
                }
              >
                {this.props.data === 5 && (
                  <>
                    <label
                      key={5}
                      className="weConnect_rating-5"
                      htmlFor="rating-5"
                    ></label>
                  </>
                )}
                {this.props.data === 4 && (
                  <>
                    <label
                      key={4}
                      className="weConnect_rating-4"
                      htmlFor="rating-4"
                    ></label>
                  </>
                )}
                {this.props.data === 3 && (
                  <>
                    <label
                      key={3}
                      className="weConnect_rating-3"
                      htmlFor="rating-3"
                    ></label>
                  </>
                )}
                {this.props.data === 2 && (
                  <>
                    <label
                      key={2}
                      className="weConnect_rating-2"
                      htmlFor="rating-2"
                    ></label>
                  </>
                )}
                {this.props.data === 1 && (
                  <>
                    <label
                      key={1}
                      className="weConnect_rating-1"
                      htmlFor="rating-1"
                    ></label>
                  </>
                )}
              </div>
            )}
            {this.props.type === "star" && (
              <>
                <div className="weconnect_rating_select">
                  {[...Array(this.props.data)].map((x, i) => (
                    <label key={i} htmlFor={"rating-" + i}></label>
                  ))}
                </div>
              </>
            )}
          </RatingContainer>
        </Text>
      </>
    );
  }
}
