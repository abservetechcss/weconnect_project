import React, { Component, Fragment } from "react";
import edit from "../../../../../../../assets/images/design/edit.svg";
import arrow from "../../../../../../../assets/images/design/Path 48337.svg";
import message from "../../../../../../../assets/images/design/message-square.svg";
import GeneralEmbedComponent from "./components/GeneralEmbedComponent";
import ChatComponent from "./components/ChatComponent";

export default class EmbedTabComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }
  render() {
    let _this = this;
    return (
      <Fragment>
        <div style={{ height: "100%" }} >
          {_this.props.activeEmbedTab === 1 ? (
            <>
              <div
                role="button"
                className="tabpanel_blocks"
                onClick={() => {
                  _this.props.super_this.setState({
                    isHeaderTabActive: true,
                    headerMessage: "Embed / General",
                    activeEmbedTab: 2,
                    EmbedLayout: 1,
                  });
                }}
              >
                <div>
                  <img src={edit} alt=""/>
                  <div>
                    <p className="tabpanel_title">General</p>
                    <p className="tabpanel_text">Text and Appearence</p>
                  </div>
                </div>
                <img src={arrow} alt=""/>
              </div>
              <div
                role="button"
                className="tabpanel_blocks"
                onClick={() => {
                  _this.props.super_this.setState({
                    isHeaderTabActive: true,
                    headerMessage: "Embed / Chat",
                    activeEmbedTab: 3,
                    EmbedLayout: 1,
                  });
                }}
              >
                <div>
                  <img src={message} alt=""/>
                  <div>
                    <p className="tabpanel_title">Chat</p>
                    <p className="tabpanel_text">Avatar and Chat style</p>
                  </div>
                </div>
                <img src={arrow} alt=""/>
              </div>
            </>
          ) : _this.props.activeEmbedTab === 2 ? (
            <>
              <GeneralEmbedComponent {...this.props} />
            </>
          ) : _this.props.activeEmbedTab === 3 ? (
            <>
              <ChatComponent layoutType="embed" {...this.props} />
            </>
          ) : null}
        </div>
      </Fragment>
    );
  }
}
