import { Text, CustomReply } from '../components';
import React from 'react'
import { WebchatContext } from "../contexts";

export default class Connected extends React.Component {
static contextType = WebchatContext

    static async botonicInit(req) {
        const item = req.input.item || {};
      return item;
  }

  render() {
    return (
      <>
        <Text>
          {this.props.message}
        </Text>
        <CustomReply></CustomReply>
      </>
    )
  }
}
