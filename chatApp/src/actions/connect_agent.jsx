import { Text, Reply, CommonReply, CustomReply } from "../components";
import React from "react";
import { WebchatContext } from "../contexts";
import { ExternalSVG } from "../DynamicSvg";
import { RowContainer, ImageComponent, ButtonStyle } from "../styled/buttons";
import styled, { css } from "styled-components";

// const RowContainer = styled.div`
//   display: flex;
//   width: 100%;
//   position: relative;
//   padding: 0px;
// `;

const ImageContainer = css`
  min-width: 100px;
  text-align: center;
  & > button {
    ${"" /* margin: 10px auto; */}
    max-width: 91px;
  }
`;

const Anchor = styled.a`
  text-decoration: none !important;
  word-break: break-all;
  display: inline-block;
  ${(props) => (props.image ? ImageContainer : "")}
`;

export default class ConnectAgent extends React.Component {
  static contextType = WebchatContext;
  static async botonicInit(req) {
    const item = req.input.item || {};
    // item.btn_detail = item.options_type.map((item) => {
    //   item.btn_id = item.answer_id;
    //   item.btn_text = item.btn_name;
    //   return item;
    // });
    return item;
  }

  sendReply(e, item) {
    e.preventDefault();
    e.stopPropagation();

    this.context.sendInput({
      type: "text",
      data: item.btn_text,
      item,
      html: true,
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
        <CustomReply>
          <RowContainer>
            {this.props.btn_detail.map((item, i) => {
              let isImage =
                btn_type === "image" &&
                item.btn_val &&
                typeof item.btn_val === "string" &&
                item.btn_val !== "" &&
                item.btn_val.indexOf(".") !== -1;
              if (
                item.btn_val &&
                typeof item.btn_val === "string" &&
                item.btn_val.indexOf("data:image/") !== -1
              ) {
                isImage = true;
              }

              return (
                <Anchor
                  as="div"
                  image={btn_type === "image"}
                  key={i}
                  // className={btn_type==="image" && item.btn_val !== "" ? "weconnect_image_holder" : ""}
                >
                  {btn_type === "image" &&
                    (isImage ? (
                      <ImageComponent
                        onClick={(e) => this.sendReply(e, item)}
                        src={item.btn_val}
                        alt=""
                      />
                    ) : (
                      <ImageComponent as="div" placeHolder={true} />
                    ))}
                  <Reply
                    item={item}
                    text={item.btn_text}
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
      </>
    );
  }
}
