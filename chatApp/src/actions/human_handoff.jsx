import { Text, Reply, CustomReply, CountDown } from '../components';
import React from 'react'
import styled from 'styled-components'

const CounterDiv = styled.div`
  text-align: center;
`

export default class HumanHandoff extends React.Component {

    static async botonicInit(req) {
        const item = req.input.item || {};
        item.counter = req.session.counter;
    return item;
  }

  render() {
    return (
      <>
        <Text markdown={false}>
          {this.props.message}
        </Text>
        <CustomReply>
            <CounterDiv>
          <Reply text="" replyStyle={{width: "auto"}}>
                <CountDown counter={this.props.counter} />
          </Reply>
            </CounterDiv>
        </CustomReply>
      </>
    )
  }
}
