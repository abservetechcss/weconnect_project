import { Text, CommonReply, CustomReply } from "../components";
import React from "react";

export default class TextQuestion extends React.Component {
  static async botonicInit(req) {
    const item = req.input.item || {};
    return item;
  }

  render() {
    return (
      <>
        <Text
          transparency={
            this.props.component ? this.props.component.transparency : 0
          }
        >
          {this.props.component.question}
        </Text>
        <CustomReply>
          <CommonReply {...this.props.component} />
        </CustomReply>
      </>
    );
  }
}
