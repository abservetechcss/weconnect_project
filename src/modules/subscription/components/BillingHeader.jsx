import React, { Component } from "react";
import img1 from "../../../assets/images/userdash/Group 20438.svg";
export class BillingHeader extends Component {
  render() {
    return (
      <div className="billing_header">
        <div>WeConnect</div>
        <div className="safe_text">
          <img alt="" src={img1} />
          <p>100% SECURE</p>
        </div>
      </div>
    );
  }
}

export default BillingHeader;
