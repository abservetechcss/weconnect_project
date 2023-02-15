import React, { Component, Fragment } from "react";
import { Row, Nav, Tab, Col } from "react-bootstrap";
import rightArrow from "../../../../../assets/images/Path 46470.svg";
import share from "../../../../../assets/images/share-2.svg";
import location from "../../../../../assets/images/crosshair.svg";
import layout from "../../../../../assets/images/layout.svg";
import mail from "../../../../../assets/images/mail (2).svg";
import ShareLanding from "./components/ShareLanding";
import EmbedWebpage from "./components/EmbedWebpage";
import InstallWidget from "./components/InstallWidget";
import EmailDeveloper from "./components/EmailDeveloper";
import { Grid } from "@mui/material";
import { decryptBot } from "../../../../../js/encrypt";

export default class BuilderShareComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      widgetScript: "",
      landingScript: "",
      embedScript:""
    }
  }
  componentDidMount() {
    if (window.location.href.includes("?botId=")) {
      let data = window.location.href.split("?botId=")[1];
      var decryptedData = decryptBot(data);
      this.setState({
        widgetScript: '<script async>!function(e,a){var d=a.head||a.getElementsByTagName("head")[0],b=a.createElement("script");b.async=true,b.setAttribute("type","text/javascript"),b.setAttribute("src","'+process.env.REACT_APP_SCRIPT_BASE_URL+'webchat.WeConnect.js"),d.appendChild(b);b.onload=function(){WeConnect.render(null,{mode:"widget",botId:"' +
          window.btoa(decryptedData.botId) +
          '"})}}(window,document)</script>',
        landingScript: process.env.REACT_APP_SCRIPT_BASE_URL+"landing?botId=" +
          window.btoa(decryptedData.botId),
        embedScript:'<iframe style="border: none; width:100%; height: 600px;" src="'+process.env.REACT_APP_SCRIPT_BASE_URL+'embed/?botId=' +
          window.btoa(decryptedData.botId) +
          '"></iframe>'
      })
    }
  }
  render() {
    return (
      <Fragment>
        <section className=" builder-component-section builder-share-section">
          <Tab.Container id="left-tabs-example" defaultActiveKey="first">
            <Grid container>
              <Grid item md={12} sm={12} lg={4} xl={3} className="pr-0">
                <Nav variant="pills" className="flex-column builder-tab-block">
                  <Nav.Item>
                    <Nav.Link eventKey="first">
                      <span>
                        <img src={share} className="arrow-icon" alt="" />
                        Share landing page
                      </span>
                      <img src={rightArrow} className="arrow-icon" alt="" />
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="second">
                      <span>
                        <img src={location} className="arrow-icon" alt="" />
                        Install Widget
                      </span>
                      <img src={rightArrow} className="arrow-icon" alt="" />
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="third">
                      <span>
                        <img src={layout} className="arrow-icon" alt="" />
                        Embed on a Webpage
                      </span>
                      <img src={rightArrow} className="arrow-icon" alt="" />
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="fourth">
                      <span>
                        <img src={mail} className="arrow-icon" alt="" />
                        Email to Developer
                      </span>
                      <img src={rightArrow} className="arrow-icon" alt="" />
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Grid>
              <Grid item md={12} sm={12} lg={8} xl={9} className="pl-0">
                <Tab.Content className="right-tab-block">
                  <Tab.Pane eventKey="first">
                    <ShareLanding script={ this.state.landingScript} />
                  </Tab.Pane>
                  <Tab.Pane eventKey="second">
                    <InstallWidget script={ this.state.widgetScript}/>
                  </Tab.Pane>
                  <Tab.Pane eventKey="third">
                    <EmbedWebpage script={ this.state.embedScript}/>
                  </Tab.Pane>
                  <Tab.Pane eventKey="fourth">
                    <EmailDeveloper widgetScript={this.state.widgetScript} embedScript={this.state.embedScript}/>
                  </Tab.Pane>
                </Tab.Content>
              </Grid>
            </Grid>
          </Tab.Container>
        </section>
      </Fragment>
    );
  }
}
