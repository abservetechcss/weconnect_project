import React, { Component, Fragment } from 'react'
import {
  Button,

} from "@mui/material";
import BuilderConversationComponent from "./conversation/BuilderConversationComponent.jsx";
import BuilderDesignComponent from "./design/BuilderDesignComponent.jsx"
import BuilderSettingsComponent from "./settings/BuilderSettingsComponent.jsx";
import BuilderShareComponent from "./share/BuilderShareComponent.jsx";
import Loader from "react-js-loader";
import Backdrop from "@mui/material/Backdrop";


export class ChatBotBuildPageComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectTab: 0,
      activeSettingTab:
        parseInt(localStorage.getItem("builderMainMenu")) === 2
          ? parseInt(localStorage.getItem("builderSubMenu"))
          : 0,
      alert: null,
      loading: false,
      widget: window.WeConnect
    };
  }
  componentDidMount() {
    // if (!this.state.widget) {
    //       this.setState({
    //           widget: window.WeConnect
    //         }); 
    //     }
    
    window.scrollTo(0, 0);
  }

  render() {
    let _this = this;
    let form = (
      <Fragment>
        <div className="knowledge_section">
          <div className="submain_header subknow_header">
            <p>
              <Button
                variant="text"
                className={_this.state.selectTab === 0 ? "active" : ""}
                onClick={() => {
                  localStorage.setItem("builderMainMenu", 0);
                  _this.setState({
                    selectTab: 0,
                    activeSettingTab: 0
                  });
                }}
              >
                1. Conversation
              </Button>
            </p>
            <div></div>
            <p>
              <Button
                variant="text"
                className={_this.state.selectTab === 1 ? "active" : ""}
                onClick={() => {
                  localStorage.setItem("builderMainMenu", 1);
                  _this.setState({
                    selectTab: 1,
                    activeSettingTab: 0
                  });
                }}
              >
                2. Design
              </Button>
            </p>
            <div></div>
            <p>
              <Button
                variant="text"
                className={_this.state.selectTab === 2 ? "active" : ""}
                onClick={() => {
                  localStorage.setItem("builderMainMenu", 2);
                  _this.setState({
                    selectTab: 2,
                    activeSettingTab: 0
                  });
                }}
              >
                3. Settings
              </Button>
            </p>
            <div></div>
            <p>
              <Button
                variant="text"
                className={_this.state.selectTab === 3 ? "active" : ""}
                onClick={() => {
                  localStorage.setItem("builderMainMenu", 3);
                  _this.setState({
                    selectTab: 3,
                    activeSettingTab:0
                  });
                }}
              >
                4. Share
              </Button>
            </p>
          </div>
          {_this.state.selectTab === 0 ? (
            <>
              <BuilderConversationComponent
              widget={this.state.widget}
                {..._this.props} />
            </>
          ) : _this.state.selectTab === 1 ? (
            <>
                <BuilderDesignComponent
                widget={this.state.widget}
                  {..._this.props} />
            </>
          ) : _this.state.selectTab === 2 ? (
            <>
              <BuilderSettingsComponent
                handleLoadingShow={(value) => {
                  _this.setState({
                    loading: value
                  });
                }}
                activeSettingTab={_this.state.activeSettingTab}
                selectActiveTab={(value) => {
                  _this.setState({
                    activeSettingTab: value
                  });
                }}
                superThis={_this}
                {..._this.props}
              />
            </>
          ) : _this.state.selectTab === 3 ? (
            <>
              <BuilderShareComponent
                superThis={_this}
                handleLoadingShow={(value) => {
                  _this.setState({
                    loading: value
                  });
                }}
                {..._this.props}
              />
            </>
          ) : null}
        </div>
      </Fragment>
    );
    return (
      <Fragment>
        {this.state.alert}
        {this.state.loading && (
            <Backdrop
              sx={{
                color: "#fff",
                zIndex: (theme) => theme.zIndex.drawer + 1
              }}
              style={{ zIndex: "10000000000000000000000000000" }}
              open={true}
            >
              <div className="loader_main">
                <div className="item_loader">
                  <Loader
                    type="box-rotate-x"
                    bgColor={"#32E0A1"}
                    title={"Please wait..."}
                    color={"#fff"}
                    size={100}
                  />
                </div>
              </div>
            </Backdrop>
        )}
          {form}
      </Fragment>
    );
  }
}

export default ChatBotBuildPageComponent
