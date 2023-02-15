import React from "react";
import styled from "styled-components";
import { WebchatContext } from "../contexts";
import arrow from "../assets/Path 46470.svg";
import RiSearchLine from "../assets/react-icons/RiSearchLine";
import IoChevronBackOutline from "../assets/react-icons/IoChevronBackOutline";
import { StyledScrollbar } from "../webchat/components/styled-scrollbar";

import { fetch } from "whatwg-fetch";
// import { searchArticleList } from "../../../src/modules/new-users/knowledge-base/server/knowledgebaseServer";
const Card = styled.div`
  background: #ffffff 0% 0% no-repeat padding-box;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 13px 28px;
  font-size: 14px;
  cursor: pointer;
  &:hover {
    background: #f1f7f7;
  }
  p {
    margin: 0;
    font-family: inherit;
    cursor: pointer;
  }
  img {
    cursor: pointer;
  }
`;

const CloseBtn = styled.div`
  color: #000;
  z-index: 9999;
  text-align: right;
  font-size: 30px;
  cursor: pointer;
  cursor: pointer;
  width: 20px;
  flex: 0 0 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0px 0px 10px #eaecf2;
  border-radius: 50%;
`;

const CardView = styled.div`
  max-height: calc(100% - 35px);
  overflow-y: auto;
  /* width */
  &::-webkit-scrollbar {
    width: 7px;
    height: 7px;
  }

  /* Track */
  &::-webkit-scrollbar-track {
    background: #fff;
  }

  /* Handle */
  &::-webkit-scrollbar-thumb {
    background: #eaecf2;
    border-radius: 10px;
  }

  /* Handle on hover */
  &::-webkit-scrollbar-thumb:hover {
    background: #eaecf2;
    border-radius: 10px;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0px;
  bottom: 0px;
  right: 0px;
  left: 0px;
  background-color: #00000082;
  z-index: 99999998;
`;

const PopupArticle = styled.div`
  position: fixed;
  top: 10px;
  bottom: 10px;
  right: 10px;
  left: 10px;
  padding: 10px;
  border-radius: 10px;
  background-color: #fff;
  transition: 1s;
  transform-origin: center;
  z-index: 99999999;
`;

let controllerGetSettings = null;
export default class SearchQuestion extends React.Component {
  static contextType = WebchatContext;

  constructor(props, context) {
    super(props);
    this.state = {
      article: [],
      noContent: {},
      Filteredarticle: [],
      articleshow: {
        modalcontent: "",
        modalshow: false,
      },
    };
  }

  componentDidMount() {
    console.log("context", this.context);
    this.fetchArticle();
  }

  fetchArticle(e) {
    const articleFetch = "signal" in new Request("") ? window.fetch : fetch;
    let searchValue = e?.target?.value ? e.target.value : "";
    if (controllerGetSettings) {
      controllerGetSettings.abort();
    }
    articleFetch(
      `${process.env.REACT_APP_ENV_API_URL}chatbot/searchknowledgebase?bot_id=${this.context.webchatState.botId}&value=${searchValue}`,
      {
        signal: controllerGetSettings,
      }
    )
      .then((response) => {
        return response.json();
      })
      .then(async (res) => {
        if (res.status === "True") {
          console.log(res);
          this.setState({
            article: res.articles,
          });
        } else if (res.status === "False") {
          this.setState({
            article: [],
            noContent: res,
          });
        } else {
          // this.fetchArticleServer();
        }
      });
  }

  handleArticlePopup(articleId) {
    const abortableFetch = "signal" in new Request("") ? window.fetch : fetch;
    if (controllerGetSettings) {
      controllerGetSettings.abort();
    }
    abortableFetch(
      `${process.env.REACT_APP_ENV_API_URL}chatbot/knowledgebase?article_id=${articleId}`,
      {
        signal: controllerGetSettings,
      }
    )
      .then((response) => {
        return response.json();
      })
      .then(async (res) => {
        console.log("res...", res);
        this.setState({
          articleshow: {
            modalcontent: res.articles[0],
            modalshow: true,
          },
        });
      })
      .catch((err) => {
        console.log("error...", err);
      });
  }

  render() {
    return (
      <StyledScrollbar
        style={{ flex: 1 }}
        ismessagescontainer="true"
        autoHide={true}
        id="welcomecard-scrollable-content"
      >
        <div
          style={{
            padding: "15px",
          }}
        >
          <style>
            {`
          .cardsection:hover{
            background:#80808021
          }
          .backarrow{
            padding:6px
          }
           .backarrow:hover{
            background: #80808021;
            cursor: pointer;
            padding: 6px;
            border-radius: 5px;
          }
        `}
          </style>
          <div className="welcome_search_section">
            <IoChevronBackOutline
              onClick={this.context.closeWebview}
              className="backarrow"
            />
          </div>
        </div>

        {this.state.article.length !== 0 ? (
          this.state.article.map((data, i) => (
            <Card
              style={{
                padding: "15px",
              }}
              className="cardsection"
              onClick={() => {
                console.log(i);
                this.handleArticlePopup(data.id);
              }}
            >
              <p>{data.title}</p>
              <img src={arrow} style={{ width: "8px" }} />
            </Card>
          ))
        ) : (
          <>
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                alignItems: "center",
                backgroundColor: "rgb(249, 249, 249)",
                borderRadius: "33px",
                padding: "12px",
              }}
            >
              <input
                type="text"
                placeholder="Search articles…"
                onChange={(e) => {
                  this.fetchArticle(e);
                }}
                style={{
                  border: "0px",
                  outline: "none",
                  backgroundColor: "rgba(255, 255, 255, 0)",
                  width: "100%",
                  font: "12px / 18px Nunito",
                  letterSpacing: "0px",
                  color: "rgb(30, 30, 30)",
                }}
              />
              <RiSearchLine
                style={{
                  color: "gray",
                }}
              />
            </div>
          </>
        )}
        {this.state.articleshow?.modalshow ? (
          <>
            <PopupArticle className="popuparticle">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  margin: "0px 0px 10px 0px",
                }}
              >
                <p
                  style={{
                    margin: "0px",
                  }}
                >
                  {this.state.articleshow.modalcontent.title}
                </p>
                <CloseBtn
                  onClick={() => {
                    this.setState({
                      articleshow: {
                        modalshow: false,
                      },
                    });
                  }}
                >
                  &times;
                </CloseBtn>
              </div>
              <CardView>
                <div
                  dangerouslySetInnerHTML={{
                    __html: this.state.articleshow.modalcontent.description,
                  }}
                ></div>
              </CardView>
            </PopupArticle>
            <Backdrop />
          </>
        ) : (
          <></>
        )}
      </StyledScrollbar>
    );
  }
}
