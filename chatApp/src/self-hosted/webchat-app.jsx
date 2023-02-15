import { INPUT } from '@botonic/core'

// @Todo: study HubtypeService implementation
// import { HubtypeService } from '@botonic/core'

import { createRef } from 'react'

import { SENDERS, WEBCHAT } from '../constants'
import { msgToBotonic } from '../components/msg-to-botonic'
import { isShadowDOMSupported } from '../util/dom'
// import { isShadowDOMSupported, onDOMLoaded } from '../util/dom'

export class WebchatApp {
  constructor({
    theme = {},
    persistentMenu,
    coverComponent,
    blockInputs,
    enableEmojiPicker,
    enableAttachments,
    enableUserInput,
    enableAnimations,
    hostId,
    shadowDOM,
    defaultDelay,
    defaultTyping,
    storage,
    storageKey,
    onInit,
    onOpen,
    onClose,
    onMessage,
    onConnectionChange,
    appId,
    visibility,
    server,
  }) {
    this.theme = theme
    this.persistentMenu = persistentMenu
    this.coverComponent = coverComponent
    this.blockInputs = blockInputs
    this.enableEmojiPicker = enableEmojiPicker
    this.enableAttachments = enableAttachments
    this.enableUserInput = enableUserInput
    this.enableAnimations = enableAnimations
    this.shadowDOM = Boolean(
      typeof shadowDOM === 'function' ? shadowDOM() : shadowDOM
    )
    if (this.shadowDOM && !isShadowDOMSupported()) {
      console.warn('[botonic] ShadowDOM not supported on this browser')
      this.shadowDOM = false
    }
    this.hostId = hostId || WEBCHAT.DEFAULTS.HOST_ID
    this.defaultDelay = defaultDelay
    this.defaultTyping = defaultTyping
    this.storage = storage
    this.storageKey = storageKey
    this.onInit = onInit
    this.onOpen = onOpen
    this.onClose = onClose
    this.onMessage = onMessage
    this.onConnectionChange = onConnectionChange
    this.visibility = visibility
    this.server = server
    this.webchatRef = createRef()
    this.appId = appId
  }

  createRootElement(host) {
    // Create root element <div id='root'> if not exists
    // Create shadowDOM to root element if needed
    if (host) {
      if (host.id && this.hostId) {
        if (host.id != this.hostId) {
          console.warn(
            `[botonic] Host ID "${host.id}" don't match 'hostId' option: ${this.hostId}. Using value: ${host.id}.`
          )
          this.hostId = host.id
        }
      } else if (host.id) this.hostId = host.id
      else if (this.hostId) host.id = this.hostId
    } else {
      host = document.getElementById(this.hostId)
    }
    if (!host) {
      host = document.createElement('div')
      host.id = this.hostId
      if (document.body.firstChild)
        document.body.insertBefore(host, document.body.firstChild)
      else document.body.appendChild(host)
    }
    this.host = this.shadowDOM ? host.attachShadow({ mode: 'open' }) : host
  }

  getReactMountNode(node) {
    if (!node) node = this.host
    return node.shadowRoot ? node.shadowRoot : node
  }

  onInitWebchat(...args) {
    this.onInit && this.onInit(this, ...args)
  }

  onOpenWebchat(...args) {
    this.onOpen && this.onOpen(this, ...args)
  }

  onCloseWebchat(...args) {
    this.onClose && this.onClose(this, ...args)
  }

  async onUserInput({ user, input }) {
    this.onMessage &&
      this.onMessage(this, { from: SENDERS.user, message: input })
    return this.hubtypeService.postMessage(user, input)
  }

  updateUser(user) {
    this.webchatRef.current.updateUser(user)
  }

  addBotMessage(message) {
    this.webchatRef.current.addBotResponse({
      response: msgToBotonic(
        message,
        (this.theme.message && this.theme.message.customTypes) ||
          this.theme.customMessageTypes
      ),
    })
  }

  addBotText(text) {
    this.addBotMessage({ type: INPUT.TEXT, data: text })
  }

  addUserText(text) {
    this.webchatRef.current.addUserMessage({ type: INPUT.TEXT, data: text })
  }

  addUserPayload(payload) {
    this.webchatRef.current.addUserMessage({ type: INPUT.POSTBACK, payload })
  }

  setSocket(status) {
    this.webchatRef.current.setSocket(status)
  }

  setTyping(typing) {
    this.webchatRef.current.setTyping(typing)
  }

  open() {
    this.webchatRef.current.openWebchat()
  }

  close() {
    this.webchatRef.current.closeWebchat()
  }

  toggle() {
    this.webchatRef.current.toggleWebchat()
  }

  openCoverComponent() {
    this.webchatRef.current.openCoverComponent()
  }

  closeCoverComponent() {
    this.webchatRef.current.closeCoverComponent()
  }

  renderCustomComponent(_customComponent) {
    this.webchatRef.current.renderCustomComponent(_customComponent)
  }

  unmountCustomComponent() {
    this.webchatRef.current.unmountCustomComponent()
  }

  toggleCoverComponent() {
    this.webchatRef.current.toggleCoverComponent()
  }

  getMessages() {
    return this.webchatRef.current.getMessages()
  }

  clearMessages() {
    this.webchatRef.current.clearMessages()
  }

  getLastMessageUpdate() {
    return this.webchatRef.current.getLastMessageUpdate()
  }

  updateMessageInfo(msgId, messageInfo) {
    return this.webchatRef.current.updateMessageInfo(msgId, messageInfo)
  }

  updateWebchatSettings(settings) {
    return this.webchatRef.current.updateWebchatSettings(settings)
  }

  isOnline() {
    return this.webchatRef.current.isOnline()
  }
    
//     async isWebchatVisible({ appId }) {
//     try {
//       const { status } = await HubtypeService.getWebchatVisibility({
//         appId,
//       })
//       return status === 200
//     } catch (e) {
//       return false
//     }
//   }
    
// async getVisibility() {
//     return this.resolveWebchatVisibility({
//       appId: this.appId,
//       visibility: this.visibility,
//     })
//   }

//   async resolveWebchatVisibility(optionsAtRuntime) {
//     let { appId, visibility } = optionsAtRuntime
//     visibility = visibility || this.visibility
//     if (visibility === undefined || visibility === true) return true
//     if (typeof visibility === 'function' && visibility()) return true
//     if (visibility === 'dynamic' && (await this.isWebchatVisible({ appId })))
//       return true
//     return false
//   }
    
//     onStateChange({ session: { user }, messagesJSON }) {
//     const lastMessage = messagesJSON[messagesJSON.length - 1]
//     const lastMessageId = lastMessage && lastMessage.id
//     const lastMessageUpdateDate = this.getLastMessageUpdate()
//     if (this.hubtypeService) {
//       this.hubtypeService.lastMessageId = lastMessageId
//       this.hubtypeService.lastMessageUpdateDate = lastMessageUpdateDate
//     } else if (!this.hubtypeService && user) {
//       this.hubtypeService = new HubtypeService({
//         appId: this.appId,
//         user,
//         lastMessageId,
//         lastMessageUpdateDate,
//         onEvent: event => this.onServiceEvent(event),
//         unsentInputs: () =>
//           this.webchatRef.current
//             .getMessages()
//             .filter(msg => msg.ack === 0 && msg.unsentInput),
//         server: this.server,
//       })
//     }
//   }

//   onServiceEvent(event) {
//     if (event.action === 'connectionChange') {
//       this.onConnectionChange && this.onConnectionChange(this, event.online)
//       this.webchatRef.current.setOnline(event.online)
//     } else if (event.action === 'update_message_info')
//       this.updateMessageInfo(event.message.id, event.message)
//     else if (event.message.type === 'update_webchat_settings')
//       this.updateWebchatSettings(event.message.data)
//     else if (event.message.type === 'sender_action')
//       this.setTyping(event.message.data === 'typing_on')
//     else {
//       this.onMessage &&
//         this.onMessage(this, { from: SENDERS.bot, message: event.message })
//       this.addBotMessage(event.message)
//     }
//   }
// async onConnectionRegained() {
//     return this.hubtypeService.onConnectionRegained()
//   }

}
