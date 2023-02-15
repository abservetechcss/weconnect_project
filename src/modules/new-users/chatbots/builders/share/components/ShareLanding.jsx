import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import newTab from "../../../../../../assets/images/Group 18868.svg";
import copy from "../../../../../../assets/images/userdash/copy-1.svg";
import newtab from "../../../../../../assets/images/external-link.svg";
import facebook from "../../../../../../assets/images/facebook.png";
import twitter from "../../../../../../assets/images/twitter.png";
import whatsApp from "../../../../../../assets/images/whatsApp.png";
import CopyToClipboard from "react-copy-to-clipboard";
import { AlertContext } from "../../../../../common/Alert";
import FacebookShareButton from "react-share/lib/FacebookShareButton";
import WhatsappShareButton from "react-share/lib/WhatsappShareButton";
import TwitterShareButton from "react-share/lib/TwitterShareButton";
import Button from "@mui/material/Button";

export default class ShareLanding extends Component {
  static contextType = AlertContext;
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <Fragment>
        <div className="right-block">
          <div className="header">
            <p className="heading">Share Landing Page</p>
            <p className="desc">Direct link & social media sharing</p>
          </div>
          <div className="main-block">
            <div className="size-block">
              <p className="title">Landing page</p>
              <p className="desc">
                Simply share it with your clients and audience on social media,
                contact pages or business cards.
              </p>
              <div className="new-tab-block">
                <div className="link-block">
                  <Link to="#">
                    {
                      this.props.script
                    }
                  </Link>
                </div>
                <div className="tab-block">
                  <span className="new-tab">
                    <a href={this.props.script} target="_blank" rel="noreferrer" >
                      {" "}
                      <img src={newtab} alt="" />
                      Open in New Tab
                    </a>
                  </span>
                  <span className="copy-block">
                    <CopyToClipboard text={this.props.script} onCopy={()=>{
              this.context.showAlert({ type: "success", message: "Copied successfully" });
            }}>
                      <Button className="copy-icon">
                        <img src={copy} alt="" />
                        Copy
                      </Button>
                    </CopyToClipboard>                    
                  </span>
                </div>
              </div>
              <div className="social-platform">
                <p className="title">Share on Social Media Platforms</p>
                <p className="desc">
                  Simply click on your favourite social media platform and share
                  it in your post
                </p>
                <div className="social-media-links">
                  <FacebookShareButton url={this.props.script} windowWidth={800} windowHeight={600}>
                    <img src={facebook} alt="" />
                  </FacebookShareButton>
                  <WhatsappShareButton url={this.props.script} windowWidth={800} windowHeight={600}>
                    <img src={whatsApp} alt="" />
                  </WhatsappShareButton>
                  <TwitterShareButton url={this.props.script} windowWidth={800} windowHeight={600}>
                    <img src={twitter} alt="" />
                  </TwitterShareButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}
