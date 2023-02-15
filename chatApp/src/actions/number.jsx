import { Text, CommonReply, CustomReply } from "../components";
import React from "react";
import { WebchatContext } from "../contexts";

export default class Number extends React.Component {
  static contextType = WebchatContext;

  constructor(props, context) {
    super(props);
    this.state = {
      reply: false,
    };
    //  context.updateReplies([<Skip {...props} />]);
  }
  static async botonicInit(req) {
      const item = req.input.item || {}
      return item;
  }

  render() {
    return (
      <>
        {this.props.error ? (
          <Text>{this.props.error}</Text>
        ) : (
          <>
            <Text>{this.props.component.question}</Text>
          </>
        )}
        <CustomReply>
          <CommonReply {...this.props.component} />
        </CustomReply>
      </>
    );
  }
}
