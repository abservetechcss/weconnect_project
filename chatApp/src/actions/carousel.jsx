import {
  Text,
  CommonReply,
  CustomReply,
  Carousel,
  Element,
} from "../components";
import React from "react";
import styled from "styled-components";
import { WebchatContext } from "../contexts";
import { WEBCHAT } from "../constants";
import { Pic } from "../components/pic";
import { Subtitle } from "../components/subtitle";
import { Title } from "../components/title";
import BsLink45Deg from "../assets/react-icons/BsLink45Deg";

const RowContainer = styled.div`
  display: flex;
  width: 100%;
  flex-wrap: wrap;
  position: relative;
  padding: 0px;
`;

const LinkButton = styled.a`
  border-radius: 22px;
  color: #00424f;
  margin: 4px 7px 10px 0;
  width: auto;
  padding: 5px 10px;
  word-break: break-all;
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

const StyledButton = styled.button`
  border-radius: 20px;
  cursor: pointer;
  padding: 7px 10px 7px 6px;
  border-color: transparent;
  box-shadow: 0 0px 0px 1px #999797;
  width: 100px;
  margin: 4px auto;
  display: flex;
  justify-content: center;
`;

const CarouselContainer = styled.div`
  text-align: left;
  white-space: normal;
  background: #edf1f2;
  padding: 7px 2px;
  border-radius: 10px;
  width: 270px;
  margin-bottom: 20px;
`;
export default class CarouselComponent extends React.Component {
  static contextType = WebchatContext;

  constructor(props, context) {
    super(props);
    this.state = {
      reply: false,
      file: null,
      fileName: "No file chosen...",
      active: false,
    };

    this.sendReply = this.sendReply.bind(this);
    this.widgetStyle = context.getThemeProperty(
      WEBCHAT.CUSTOM_PROPERTIES.widgetStyle,
      WEBCHAT.DEFAULTS.WIDGETSTYLE
    );
  }

  static async botonicInit(req) {
    const item = req.input.item || {}; // meesage from api
    return item;

    // const item = {
    //   question_id: "D36CC2A7-DB54-408B-B6F6-9FAB58D8104D",
    //   type: "carousal",
    //   label: "What you would like to buy?",
    //   back_button: "0",
    //   skip_button: "1",
    //   chip_type: "",
    //   welcome_card_image: "",
    //   enable: "1",
    //   bg_color: "",
    //   bg_color_start: null,
    //   text_color: "",
    //   welcome_card_bg_type: "",
    //   hide: "0",
    //   jump_to: 0,
    //   chips: [
    //     {
    //       chattype: "",
    //       chip_id: "396",
    //       name: "Need Help?",
    //       link: "https://weconnect.chat/",
    //       new_tab: "0",
    //       image: "",
    //       icon: "",
    //       data_value: null,
    //     },
    //   ],
    //   options: [],
    //   carousals: [
    //     {
    //       carousal_id: "74",
    //       title: "Shoes",
    //       carousal_link: "",
    //       carousal_new_tab: "1",
    //       carousal_image:
    //         "https://wc-media-files-dev-new.s3.eu-central-1.amazonaws.com/564cb0b40155bff18203022a3d767a52",
    //       description: "Brand new shoes",
    //       price: "200.00",
    //       currency: "USD",
    //     },
    //     {
    //       carousal_id: "75",
    //       title: "Boots",
    //       carousal_link: "",
    //       carousal_new_tab: "1",
    //       carousal_image:
    //         "https://wc-media-files-dev-new.s3.eu-central-1.amazonaws.com/1261c484da862e814705d2199c9cbfc0",
    //       description: "Brand new boots",
    //       price: "100.00",
    //       currency: "USD",
    //     },
    //     {
    //       carousal_id: "76",
    //       title: "Slippers",
    //       carousal_link: "",
    //       carousal_new_tab: "1",
    //       carousal_image:
    //         "https://wc-media-files-dev-new.s3.eu-central-1.amazonaws.com/973f30629ce0f2ae776aac6320c22342",
    //       description: "Brand new slippers",
    //       price: "50.00",
    //       currency: "USD",
    //     },
    //   ],
    // };
    // return item;
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
    this.context.updateLastMessage({
      reply: true,
    });
    this.context.sendInput({
      type: "text",
      data: item.btn_text,
      item,
      html: true,
    });
  }

  setCarouselWidth(length) {
    return length == 1 ? "140px" : "270px";
  }

  render() {
    const carousel = this.props.btn_detail.filter((item) => {
      return item.link_type === "carousal";
    });
    const chips = this.props.btn_detail.filter((item) => {
      return item.link_type === "button";
    });
    return (
      <>
        <style>
          {`
          .carousel-block div {
            width: 100%;
            padding: 0;
          }
            .carousel-block > div {
              padding: 0;
              width: 122px;
              background: #fff;
            }
            .carousel-block > div div:first-child {
              height: 75px;
            }
            .carousel-block > div div:nth-child(2) {
              padding: 7px;
            }
            .carousel-block > div div:nth-child(3) {
              padding: 0 7px;
              box-sizing: border-box;
            }
            .carousel-block > div div:nth-child(4) {
              padding: 7px;
            }
            .carousel-bot {
              width: 100% !important;
              margin: 0 !important;
              max-width: unset !important;
            }
            .carousel-block{
              text-decoration:none
            }
            .carousel-block>div {
                padding: 12px;
                width: 98px;
                background:white
            }
            .carousel-block>div div:first-child {
                height: 92px;
            }
            .carousel-block>div div:nth-child(2) {
              font: normal normal 600 14px/22px Nunito;
              font-family: inherit !important;
              letter-spacing: 0px;
              color: #1e1e1e;
            }
            .carousel-block>div div:nth-child(3) {
              font: normal normal normal 12px/17px Nunito;
              font-family: inherit !important;
              font-family: inherit !important;
              letter-spacing: 0px;
              color: #1e1e1e;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              text-overflow: ellipsis;
              overflow: hidden;
              opacity: 0.7;
              word-break: break-all;
            }
            .carousel-block>div div:nth-child(4) {
              font: normal normal 600 12px/17px Nunito;
              font-family: inherit !important;
              letter-spacing: 0px;
              color: #00424f;
              opacity: 1;
            }

        `}
        </style>
        <Text
          transparency={
            this.props.component ? this.props.component.transparency : 0
          }
        >
          {this.props.component.question}
        </Text>
        {this.props.reply !== true && (
          <CustomReply>
            <CarouselContainer
              style={{ width: this.setCarouselWidth(carousel.length) }}
              className="scrollbar"
            >
              <Carousel length={carousel.length}>
                {carousel.map((e, i) => (
                  <a
                    className="carousel-block"
                    key={i}
                    href={e.link == "" ? "#" : e.link}
                    target={
                      e.new_tab === 1 && e.link !== "" ? "_blank" : "_self"
                    }
                    onClick={(ev) => this.sendReply(ev, e)}
                    rel="noreferrer"
                  >
                    <Element key={i}>
                      <Pic className="img" src={e.btn_image} />
                      <Title className="title">
                        {e.btn_text !== "" ? e.btn_text : "Title"}
                      </Title>
                      <Subtitle className="desc">
                        {e.description !== "" ? e.description : "Description"}
                      </Subtitle>
                      {e.price > 0 && (
                        <Subtitle className="price">
                          {e.currency === "USD" ? "$" : "€"}
                          {e.price}
                        </Subtitle>
                      )}
                      {/* <Button url={e.link}>Open Product</Button> */}
                    </Element>
                  </a>
                ))}
              </Carousel>
            </CarouselContainer>
            <RowContainer>
              {chips.map((item, i) => {
                return (
                  <LinkButton
                    key={i}
                    href={item.link == "" ? "#" : item.link}
                    target={item.new_tab === 1 ? "_blank" : "_self"}
                    onClick={(ev) => this.sendReply(ev, item)}
                    hover={this.widgetStyle}
                  >
                    <BsLink45Deg /> {item.btn_text}
                  </LinkButton>
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
