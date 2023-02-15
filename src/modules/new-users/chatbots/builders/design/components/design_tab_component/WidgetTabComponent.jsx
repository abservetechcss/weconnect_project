import React, { Component, Fragment } from "react";
import arrow from "../../../../../../../assets/images/design/Path 48337.svg";
import layout from "../../../../../../../assets/images/design/layout.svg";
import edit from "../../../../../../../assets/images/design/edit.svg";
import book from "../../../../../../../assets/images/design/book (1).svg";
import message from "../../../../../../../assets/images/design/message-square.svg";

import GeneralDesignComponent from "./components/GeneralDesignComponent";
import ChatComponent from "./components/ChatComponent";
import LayoutComponent2 from "./components/LayoutComponent2";
import HeaderComponent from "./components/HeaderComponent";

export default class WidgetTabComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    let _this = this;
    return (
      <Fragment>
        <div style={{ height: "100%" }}>
          {_this.props.activeWidgetTab === 1 ? (
            <>
              <div
                role="button"
                className="tabpanel_blocks"
                onClick={() => {
                  _this.props.super_this.setState({
                    isHeaderTabActive: true,
                    headerMessage: "Widget / Layout",
                    activeWidgetTab: 2,
                    widgetLayout: 1,
                  });
                }}
              >
                <div>
                  <img alt="" src={layout} />
                  <div>
                    <p className="tabpanel_title">Layout</p>
                    <p className="tabpanel_text">
                      Position and Style
                    </p>
                  </div>
                </div>
                <img alt="" src={arrow} />
              </div>
              <div
                role="button"
                className="tabpanel_blocks"
                onClick={() => {
                  _this.props.super_this.setState({
                    isHeaderTabActive: true,
                    headerMessage: "Widget / General",
                    activeWidgetTab: 3,
                    widgetLayout: 1,
                  });
                }}
              >
                <div>
                  <img alt="" src={edit} />
                  <div>
                    <p className="tabpanel_title">General</p>
                    <p className="tabpanel_text">Text and Appearence</p>
                  </div>
                </div>
                <img alt="" src={arrow} />
              </div>
              <div
                role="button"
                className="tabpanel_blocks"
                onClick={() => {
                  _this.props.super_this.setState({
                    isHeaderTabActive: true,
                    headerMessage: "Widget / Header",
                    activeWidgetTab: 4,
                    widgetLayout: 1,
                  });
                }}
              >
                <div>
                  <img alt="" src={book} />
                  <div>
                    <p className="tabpanel_title">Header</p>
                    {/* <p className="tabpanel_text">
                      
                    </p> */}
                  </div>
                </div>
                <img alt="" src={arrow} />
              </div>
              <div
                role="button"
                className="tabpanel_blocks"
                onClick={() => {
                  _this.props.super_this.setState({
                    isHeaderTabActive: true,
                    headerMessage: "Widget / Chat",
                    activeWidgetTab: 5,
                    widgetLayout: 1,
                  });
                }}
              >
                <div>
                  <img alt="" src={message} />
                  <div>
                    <p className="tabpanel_title">Chat</p>
                    <p className="tabpanel_text">Avatar and Chat style</p>
                  </div>
                </div>
                <img alt="" src={arrow} />
              </div>
            </>
          ) : _this.props.activeWidgetTab === 2 ? (
            <>
              <LayoutComponent2 {..._this.props} _this={_this} />
            </>
          ) : _this.props.activeWidgetTab === 3 ? (
            <>
              <GeneralDesignComponent {..._this.props} _this={_this} />
            </>
          ) : _this.props.activeWidgetTab === 4 ? (
            <>
              <HeaderComponent {..._this.props} _this={_this} />
            </>
          ) : _this.props.activeWidgetTab === 5 ? (
            <>
              <ChatComponent
                {..._this.props}
                layoutType="widget"
                _this={_this}
              />
            </>
          ) : null}
        </div>
      </Fragment>
    );
  }
}
