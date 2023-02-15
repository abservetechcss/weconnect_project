import { Text, CommonReply, CustomReply, ConfirmButton } from "../components";
import React from "react";
import styled from "styled-components";
import { WebchatContext } from "../contexts";
import { WEBCHAT } from "../constants";

import Slider from "@mui/material/Slider";

const RangeContainer = styled.div`
  text-align: left;
  margin: 0 0 15px 50px;
  -webkit-box-shadow: 0 7px 12px 0 rgb(62 57 107 / 16%);
  box-shadow: 0 7px 12px 0 rgb(62 57 107 / 16%);
  max-width: 200px;
  padding: 2%;
  border-radius: 15px;
  padding: 20px 20px 10px 20px;
  background: #fff;
`;

const LabelContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  paddingbottom: 15px;
  color: #a7a7a7;
  font-size: 12px;
  font-family: inherit;
  white-space: break-spaces;
`;
const RangeNumber = styled.span`
  font-size: 15px;
  color: #1e1e1e;
  font-weight: 600;
  opacity: 1;
`;

export default class Range extends React.Component {
  static contextType = WebchatContext;

  constructor(props, context) {
    super(props);
    this.state = {
      value: [
        this.props.component.minimum_digit,
        this.props.component.maximum_digit,
      ],
      reply: false,
    };
    this.widgetStyle = context.getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.widgetStyle,
      WEBCHAT.DEFAULTS.WIDGETSTYLE
    );
    this.submitRange = this.submitRange.bind(this);
  }

  static async botonicInit(req) {
    const item = req.input.item || {}; // meesage from api
    return item;
  }
  handleChange = (event, newValue) => {
    this.setState({ value: newValue });
  };
  submitRange() {
    this.setState({
      reply: true,
    });
    const text = this.state.value.join(" - ");
    this.context.sendInput({
      from: "user",
      type: "text",
      data: text,
      html: true,
    });
  }

  render() {
    return (
      <>
        <Text
          transparency={
            this.props.component ? this.props.component.transparency : 0
          }
        >
          {this.props.component.question}
        </Text>

        {this.state.reply === false && this.props.reply !== true && (
          <RangeContainer>
            <LabelContainer>
              {this.props.component.prefix}{" "}
              <RangeNumber>{this.state.value.join(" - ")} </RangeNumber>
              {this.props.component.suffix}
            </LabelContainer>
            <Slider
              min={this.props.component.minimum_digit}
              max={this.props.component.maximum_digit}
              defaultValue={[
                this.props.component.minimum_digit,
                this.props.component.maximum_digit,
              ]}
              step={
                parseInt(this.props.component.steps) > 0
                  ? this.props.component.steps
                  : 1
              }
              value={this.state.value}
              onChange={this.handleChange}
              valueLabelDisplay="auto"
              sx={{
                color: "#e5eced",
                height: "15px",
                padding: "0 0 10px 0",
                "& .MuiSlider-track": this.widgetStyle,
                "& .MuiSlider-thumb": this.widgetStyle,
                "& .MuiSlider-rail": this.widgetStyle,
              }}
            />
            <ConfirmButton click={this.submitRange} />
          </RangeContainer>
        )}
        <CustomReply>
          <CommonReply {...this.props.component} />
        </CustomReply>
      </>
    );
  }
}
