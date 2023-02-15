import { Text, CommonReply, CustomReply } from "../components";
import React from "react";
import styled from "styled-components";
import { WebchatContext } from "../contexts";
import { WEBCHAT } from "../constants";

const RangeContainer = styled.div`
  text-align: left;
  margin: 0px 15px 15px 42px;
  padding: 10px 10px 0px 10px;
  background: transparent;
  max-width: 317px;
}
`;
const OpnionBtn = styled.div`
  display: inline-block;
  border-radius: 4px;
  font-size: 14px !important;
  background: #fff;
  border: 1px solid #00424f4f;
  height: 23px;
  width: 23px;
  color: #00424f;
  text-align: center;
  line-height: 25px;
  font-family: inherit;
  font-size: 10px;
  cursor: pointer;
  &:hover {
    color: #fff;
    background: #00424f;
  }
`;
const SideLabel = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 10px 0 0px 0;
`;
export default class OpinionScale extends React.Component {
  static contextType = WebchatContext;

  constructor(props, context) {
    super(props);
    this.state = {
      value: [0, 100],
      reply: false,
    };
    this.widgetStyle = context.getThemeProperty(WEBCHAT.CUSTOM_PROPERTIES.widgetStyle, WEBCHAT.DEFAULTS.WIDGETSTYLE);
  }
  static async botonicInit(req) {
    const item = req.input.item || {}; // meesage from api
    return item;
  }
  submitOpinion(text) {
    this.setState({
      reply: true,
    });
    this.context.sendInput({
      from: "user",
      type: "text",
      data: text.toString(),
      html: true,
    });
  }

  render() {
    var rows = [];
    for (let i = 1; i < 11; i++) {
      let marginRight = "5px";
      if (i === 10) {
        marginRight = "0px";
      }
      rows.push(
        <OpnionBtn
          key={i}
          onClick={() => this.submitOpinion(i)}
          style={{ marginRight, ...this.widgetStyle }}
        >
          {i}
        </OpnionBtn>
      );
    }
    return (
      <div style={{ fontFamily: "Nunito" }}>
        <style>
          {`
        .likely_text {
            color: #1e1e1e;
            opacity: .6;
            font-size: 11px;
            font-family: Nunito;
            font-weight: 600;
        }
        `}
        </style>
        <Text>{this.props.component.question}</Text>

        {this.state.reply === false && this.props.reply !== true && (
          <RangeContainer>
            {rows}
            <SideLabel>
              <div className="likely_text">
                {this.props.component.left_label}
              </div>
              <div className="likely_text">
                {this.props.component.right_label}
              </div>
            </SideLabel>
          </RangeContainer>
        )}
        <CustomReply>
          <CommonReply {...this.props.component} />
        </CustomReply>
      </div>
    );
  }
}
