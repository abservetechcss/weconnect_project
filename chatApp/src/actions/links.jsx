import { Text, Reply, Anchor, CommonReply, CustomReply } from "../components";
import React from "react";
import styled from "styled-components";
import BsLink45Deg from "../assets/react-icons/BsLink45Deg";
import { WebchatContext } from "../contexts";
import { WEBCHAT } from "../constants";
const RowContainer = styled.div`
  display: flex;
  width: 100%;
  position: relative;
  padding: 0px;
  flex-wrap: wrap;
`;

const LinkButton = styled.a`
  border-radius: 22px;
  color: #00424f;
  margin: 4px 7px 10px 0;
  width: auto;
  word-break: break-all;
  padding: 5px 10px;
  background: #fff;
  border: 1px solid #00424f;
  box-shadow: 0 0px 0px 1px #999797;
  font-family: inherit;
  font-weight: 600;
  text-decoration: none !important;
  display: flex;
  font-size: 14px;
  &:hover {
    color: ${(props) => props.hover.color} !important;
    background: ${(props) => props.hover.background} !important;
  }
`;

export default class Links extends React.Component {
  static contextType = WebchatContext;
  static async botonicInit(req) {
    const item = req.input.item || {}; // meesage from api
    return item;
  }

  constructor(props, context) {
    super(props);

    this.sendReply = this.sendReply.bind(this);
    this.widgetStyle = context.getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.widgetStyle,
      WEBCHAT.DEFAULTS.WIDGETSTYLE
    );
  }

  sendReply(e, item) {
    const target = e.currentTarget.getAttribute("target");
    let blockAnchor = true;
    if (e.currentTarget.getAttribute("href") !== "#") {
      if (target == "_self") {
        this.context.openWebview(e.currentTarget.getAttribute("href"));
      } else {
        blockAnchor = false;
      }
    }
    if (blockAnchor) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.context.sendInput({
      type: "text",
      data: item.btn_text,
      item,
      html: true,
    });
    this.setState({
      reply: true,
    });
  }

  render() {
    return (
      <>
        <Text>{this.props.component.question}</Text>
        {this.props.reply!== true && <CustomReply>
          <RowContainer>
            {this.props.btn_detail.map((item, i) => {
              return (
                <LinkButton
                  key={i}
                  onClick={(e) => this.sendReply(e, item)}
                  href={item.link && item.link !== "" ? item.link : "#"}
                  target={item.new_tab === 1 ? "_blank" : "_self"}
                  hover={this.widgetStyle}
                >
                  <BsLink45Deg /> {item.btn_text}
                </LinkButton>
              );
            })}
          </RowContainer>
          <CommonReply {...this.props.component} />
        </CustomReply>}
      </>
    );
  }
}
