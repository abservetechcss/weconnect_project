import React from "react";
import styled, { css }  from "styled-components";
import { WebchatContext } from "../contexts";
import { Text, Reply, CommonReply, CustomReply } from "../components";
// import grid1 from "../assets/grid.png";
// import btn_img from "../assets/intro-image.jpg";
import { ExternalSVG } from "../DynamicSvg";
import { RowContainer, ImageComponent, ButtonStyle } from "../styled/buttons";

const MessageContainer = styled.div`
  display: flex;
  position: relative;
  padding: 0px;
`;

const WelcomeImg = styled.img`
  flex: 1;
  max-width: 90px;
  height: 90px;
  width: 100%;
`;

const WelcomeSpan = styled.span`
  flex: 1;
`;

const ImageContainer = css`
min-width: 100px;
text-align: center;
&>button {
  margin: 10px auto;
  max-width: 90px;
}
`;

const Anchor = styled.a`
  text-decoration: none !important;
  word-break: break-word;
  display: inline-block;
  ${(props) => (props.image ? ImageContainer : '')}

`;

export default class WelComeCard extends React.Component {
  static contextType = WebchatContext;

  constructor(props) {
    super(props);
    this.state = {
      reply: false,
      mystate: 0,
    };
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
  }

  static async botonicInit(req) {
    const item = req.input.item || {}; // meesage from api
    return item;
  }

  render() {
    let backgroundColor = "";
    if (this.props.component.welcome_card_bg_color !== "") {
      try {
        let temp = JSON.parse(this.props.component.welcome_card_bg_color);
        backgroundColor = temp.style;
      } catch (err) {
        console.log("color error", err);
      }
    }
    if (
      this.props.component.welcome_card_bg_type === "gradient" &&
      this.props.component.welcome_card_bg_start !== ""
    ) {
      try {
        let temp = JSON.parse(this.props.component.welcome_card_bg_start);
        backgroundColor = temp.style;
      } catch (err) {
        console.log("color error", err);
      }
    }
    let textColor = {};

    if (this.props.component.welcome_card_text_color !== "") {
      try {
        let temp = JSON.parse(this.props.component.welcome_card_text_color);
        textColor = temp.style;
      } catch (err) {
        console.log("color error", err);
      }
    }

    let styleObj = {
      background: backgroundColor,
      color: textColor,
    };
    let spanStyle = {};
    if (this.props.component.welcome_card_image !== "") {
      styleObj.maxWidth = "100%";
      spanStyle.marginLeft = "10px";
    }
    const btn_type = this.props.component.chip_type;

    return (
      <>
        <Text style={styleObj} html={false}  transparency={
            this.props.component ? this.props.component.transparency : 0
          }>
          <MessageContainer style={{ flexWrap: "wrap" }}>
            {this.props.component.welcome_card_image !== "" && (
              <WelcomeImg src={this.props.component.welcome_card_image} />
            )}
            <WelcomeSpan
              dangerouslySetInnerHTML={{
                __html: this.props.component.question,
              }}
              style={spanStyle}
            ></WelcomeSpan>
          </MessageContainer>
        </Text>
        {this.props.reply!== true && <CustomReply>
          <RowContainer>
            {this.props.btn_detail.map((item, i) => {
              let isImage =
                btn_type === "image" &&
                item.btn_val &&
                item.btn_val !== "" &&
                item.btn_val.indexOf(".") !== -1;
              if (item.btn_val && item.btn_val.indexOf("data:image/") !== -1) {
                isImage = true;
              }
              return (
                <Anchor
                  image={btn_type === "image"}
                  key={i}
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
                        <ExternalSVG key={i} src={item.btn_val} />
                      )}{" "}
                      {item.btn_text}
                    </ButtonStyle>
                  </Reply>
                </Anchor>
              );
            })}
          </RowContainer>
          <CommonReply {...this.props.component} />
        </CustomReply>}
      </>
    );
  }
}
