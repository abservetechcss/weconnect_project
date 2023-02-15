import { Text, Reply } from '../components';
import React from 'react'

export default class ChatEnd extends React.Component {

  static async botonicInit(req) {
    const item = req.input.item || {}; // meesage from api
    return item;
  }

  render() {
    return (
      <>
        <Text>
          {this.props.label}
        </Text>
      </>
    )
  }
}
