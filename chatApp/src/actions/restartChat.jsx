import { Text } from '../components';
import React from 'react'

export default class RestartChat extends React.Component {

  static async botonicInit(req) {
    const item = req.input.item || {}; // meesage from api
    return item;
  }

  render() {
    return (
      <>
        <Text>
          {this.props.message}
        </Text>
      </>
    )
  }
}
