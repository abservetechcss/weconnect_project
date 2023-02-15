import { Text, Reply, CommonReply, CustomReply } from "../components";
import React from "react";
import { ExternalSVG } from "../DynamicSvg";
import { WebchatContext } from "../contexts";
import {
  RowContainer,
  Anchor,
  ImageComponent,
  ButtonStyle,
} from "../styled/buttons";

export default class MultiChoice extends React.Component {
  static contextType = WebchatContext;
  static async botonicInit(req) {
    const item = req.input.item || {};
    return item;
  }

  sendReply(e, item) {
    const target = e.currentTarget.getAttribute("target");
    let blockAnchor = true;
    if (e.currentTarget.getAttribute("href") !== "#") {
      if (target === "_self") {
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
    const btn_type = this.props.component.chip_type;
    return (
      <>
        <Text
          transparency={
            this.props.component ? this.props.component.transparency : 0
          }
        >
          {this.props.component.question}
        </Text>
        {this.props.reply !== true && (
          <CustomReply>
            <RowContainer>
              {this.props.btn_detail.map((item, i) => {
                let isImage =
                  btn_type === "image" &&
                  item.btn_val &&
                  item.btn_val !== "" &&
                  item.btn_val.indexOf(".") !== -1;
                if (
                  item.btn_val &&
                  item.btn_val.indexOf("data:image/") !== -1
                ) {
                  isImage = true;
                }
                return (
                  <Anchor
                    image={btn_type === "image"}
                    key={btn_type + i}
                    href={item.link && item.link !== "" ? item.link : "#"}
                    onClick={(e) => this.sendReply(e, item)}
                    target={item.new_tab === 1 ? "_blank" : "_self"}
                  >
                    {btn_type === "image" &&
                      (isImage ? (
                        <ImageComponent src={item.btn_val} alt="" />
                      ) : (
                        <ImageComponent as="div" placeHolder={true} />
                      ))}
                    <Reply
                      item={item}
                      text={item.btn_text}
                      disable={true}
                      image={btn_type === "image"}
                    >
                      <ButtonStyle>
                        {/* {btn_type==="icon" && item.btn_val !== "" && <img src={item.btn_val} />}{" "} */}
                        {btn_type === "icon" && item.btn_val !== "" && (
                          <ExternalSVG src={item.btn_val} />
                        )}{" "}
                        {item.btn_text}
                      </ButtonStyle>
                    </Reply>
                  </Anchor>
                );
              })}
            </RowContainer>
            <CommonReply {...this.props.component} />
          </CustomReply>
        )}
      </>
    );
  }
}
