import { CoreBot } from '@botonic/core'
import React from 'react'

import { Text } from '../components';
import { RequestContext } from '../contexts';
import { routes } from "../routes";

export class ReactBot extends CoreBot {
  constructor(options) {
    super({
      defaultRoutes: [],
      routes,
      renderer: args => this.renderReactActions(args),
      plugins: []
    })
  }

  async renderReactActions(options) {
    const { request, actions } = options; 
    const renderedActions = []
    let props
    let renderedAction
    for (const Action of actions) {
      if (Action) {
        props = Action.botonicInit ? await Action.botonicInit(request) : {}
        renderedAction = (
          <RequestContext.Provider value={request}>
            <Action {...props} />
          </RequestContext.Provider>
        )
        renderedActions.push(renderedAction)
      }
    }
    return renderedActions
  }
}
