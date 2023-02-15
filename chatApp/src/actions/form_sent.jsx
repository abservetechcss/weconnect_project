import { Text, Reply } from '../components';
import React from 'react'

export default class extends React.Component {

    static async botonicInit(req) {
      const bot = req.session.user.bot;
      let data = req.input.item || {};
      data = {
        ...data,
        client_id: bot.client_id,
        bot_id: bot.bot_id
      };
      return { message: "Thankyou, We will contact you soon!", myData: "test"}
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
