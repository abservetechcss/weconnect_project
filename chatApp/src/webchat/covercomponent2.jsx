import React from "react";
import styled from "styled-components";
import { WebchatContext } from "../contexts";
// import "../assets/css/cover.css";
import logo from "../assets/appstore.png";
import hand from "../assets/waving-hand.png";
// import cancelBtn from "../assets/AiFillCloseCircle.svg";
import cancelBtn from "../assets/AiFillCloseCircle.png";
import SearchQuestion from "./searchQuestion";
import { WEBCHAT } from "../constants";
import { ImCancelCircle } from "react-icons/im";
import IconButton from "@mui/material/IconButton";

const Container = styled.div`
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
  // padding: 0 28px;
`;

const CoverSection = styled.div`
  background: #00424f;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Nunito;
  padding: 20px 20px;
  border-radius: 20px;
  @media (max-width: 600px) {
    border-radius: 0px;
    justify-content: space-evenly;
  }
`;
const Title = styled.p`
  font-size: 25px;
  font-family: Nunito;
  font-weight: bold;
  margin: 10px 0 12px 10px !important;
  text-align: center;
`;
const SubTitle = styled.p`
    max-width: 280px;
    margin: 0 auto;
    letter-spacing:0.5px;
    font-weight: 300;
    font-family: Nunito;
    text-align: center;
    font-size: 16px !important;
}`;
const StyledButton = styled.button`
  border-radius: 20px;
  cursor: pointer;
  padding: 10px 5px;
  text-align: center;
  box-shadow: 0 0px 0px 1px #999797;
  width: 240px;
  margin: 25px auto 15px auto;
  background: #fff;
  border: none;
  height: auto;
  font-size: 17px;
  font-weight: 700;
  font-family: Nunito;
  color: #000;
`;
const cancelBtnStyle = {
  position: "absolute",
  right: "5px",
  top: "5px",
  maxWidth: "50px",
  Background: "white",
  color: "inherit",
};
const cancelBtnIcon = {
  fontSize: "25px",
  color: "inherit",
};

export default class coverComponent2 extends React.Component {
  static contextType = WebchatContext;

  constructor(props) {
    super(props);
    this.state = {
      date: "",
      reply: false,
    };
  }

  handleAction(action) {
    if (action === "chat") {
      this.props.closeComponent();
    } else {
      this.context.openWebview(SearchQuestion, { data: "myData" });
    }
  }

  render() {
    return (
      <>
        <style>
          {`
        .cover2center{
          height:calc(100% - 190px);
              display: flex;
              justify-content: space-evenly;
              align-items: center;
          }
        `}
        </style>
        <CoverSection
          style={
            this.context.getThemeProperty(
              WEBCHAT.CUSTOM_PROPERTIES.headerSameChat,
              0
            ) === 1
              ? this.context.getThemeProperty(
                  WEBCHAT.CUSTOM_PROPERTIES.widgetStyle,
                  WEBCHAT.DEFAULTS.WIDGETSTYLE
                )
              : this.context.getThemeProperty(
                  WEBCHAT.CUSTOM_PROPERTIES.headerStyle,
                  WEBCHAT.DEFAULTS.WIDGETSTYLE
                )
          }
        >
          {this.props.ismobile && (
            <>
              {/* <img src={cancelBtn}
                alt=""
                style={cancelBtnStyle}
                onClick={() => {
                  this.props.closeWebchat();
                }}
              /> */}
              <IconButton
                style={cancelBtnStyle}
                onClick={() => {
                  document.getElementsByTagName("body")[0].style.overflow =
                    "auto";
                  this.props.closeWebchat();
                }}
              >
                <ImCancelCircle style={cancelBtnIcon} />
              </IconButton>
            </>
          )}
          <div className="cover2center">
            <img
              src={this.context.getThemeProperty(
                WEBCHAT.CUSTOM_PROPERTIES.welcomeImg,
                WEBCHAT.DEFAULTS.PROFILE
              )}
              alt=""
              style={{
                maxWidth: "220px",
                height: "150px",
                objectFit: "contain",
                width: "100%",
                borderRadius: this.context.getThemeProperty(
                  WEBCHAT.CUSTOM_PROPERTIES.coverScale,
                  "50%"
                ),
              }}
            />
          </div>
          <div
            style={{
              display: "flex",
              alignItem: "center",
              flexDirection: "column",
              flexWrap: "wrap",
            }}
          >
            <Title>
              {this.context.getThemeProperty(
                WEBCHAT.CUSTOM_PROPERTIES.headerTitle,
                WEBCHAT.DEFAULTS.TITLE
              )}
            </Title>
            <SubTitle>
              {this.context.getThemeProperty(
                WEBCHAT.CUSTOM_PROPERTIES.headerSubtitle,
                ""
              )}
            </SubTitle>
            <StyledButton onClick={() => this.handleAction("chat")}>
              {this.props.chatSettings.start_a_new_conversation_value}
            </StyledButton>
          </div>
        </CoverSection>
      </>
    );
  }
}
