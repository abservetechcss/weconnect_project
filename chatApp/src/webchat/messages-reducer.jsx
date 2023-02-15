import {
  ADD_MESSAGE,
  ADD_MESSAGE_COMPONENT,
  CLEAR_MESSAGES,
  UPDATE_LAST_MESSAGE_DATE,
  UPDATE_MESSAGE,
  UPDATE_REPLIES,
  UPDATE_MESSAGE_COMPONENT,
  UPDATE_LAST_MESSAGE_COMPONENT,
  UPDATE_READ_MESSAGE,
} from "./actions";

export const messagesReducer = (state, action) => {
  switch (action.type) {
    case ADD_MESSAGE:
      return addMessageReducer(state, action);
    case ADD_MESSAGE_COMPONENT:
      return {
        ...state,
        messagesComponents: [
          ...(state.messagesComponents || []),
          action.payload,
        ],
      };
    case UPDATE_MESSAGE_COMPONENT:
      return updateMessageComponentReducer(state, action);
    case UPDATE_LAST_MESSAGE_COMPONENT:
      return updateLastMessageReducer(state, action);
    case UPDATE_MESSAGE:
      return updateMessageReducer(state, action);
    case UPDATE_READ_MESSAGE:
      return updateMessageToRead(state, action);
    case UPDATE_REPLIES:
      return { ...state, replies: action.payload };
    case CLEAR_MESSAGES:
      return {
        ...state,
        messagesJSON: [],
        messagesComponents: [],
      };
    case UPDATE_LAST_MESSAGE_DATE:
      return {
        ...state,
        lastMessageUpdate: action.payload,
      };
    default:
      throw new Error();
  }
};

function updateMessageComponentReducer(state, action) {
  const msgIndex = action.payload.msgIndex || 0;
  const msgComponent =
    state.messagesComponents && state.messagesComponents[msgIndex];

  if (typeof msgComponent == "undefined") return state;

  let updatedMessageComponents = {};
  // msgComponent.props.value.input.item.component.question = "test";
  // msgComponent.props.children.props.component.question = "test";
  /**
   * This is defintely an anit pattern, but anyway it is working fine :)
   */

  if (msgComponent) {
    if (
      typeof msgComponent.props.children === "string" ||
      typeof msgComponent.props.children === "number"
    )
      return state;
    if (!msgComponent.props.children) {
      return state;
    }

    const updatedMsgComponent = {
      ...msgComponent,
      ...{
        props: {
          ...msgComponent.props,
          children: {
            ...msgComponent.props.children,
            ...{
              props: {
                ...msgComponent.props.children.props,
                ...action.payload,
              },
            },
          },
          // value: {
          //   ...msgComponent.props.value,
          //   input: {
          //     ...msgComponent.props.value.input,
          //     ...{
          //       item: {
          //         ...msgComponent.props.value.input.item,
          //       ...action.payload
          //       }
          //     }
          //   }
          // }
        },
      },
      key: new Date().getTime(),
    };
    updatedMessageComponents = {
      messagesComponents: [
        ...state.messagesComponents.slice(0, msgIndex),
        { ...updatedMsgComponent },
        ...state.messagesComponents.slice(msgIndex + 1),
      ],
    };
  }
  const newState = {
    ...state,
    // messagesJSON: [
    //   ...state.messagesJSON.slice(0, msgIndex),
    //   { ...action.payload },
    //   ...state.messagesJSON.slice(msgIndex + 1),
    // ],
    ...updatedMessageComponents,
  };
  return newState;
}

function updateLastMessageReducer(state, action) {
  action.payload.msgIndex =
    state.messagesComponents && state.messagesComponents.length - 1;
  return updateMessageComponentReducer(state, action);
}

function updateMessageReducer(state, action) {
  const msgIndex = state.messagesJSON
    .map((m) => m.id)
    .indexOf(action.payload.id);
  if (msgIndex > -1) {
    const msgComponent =
      state.messagesComponents && state.messagesComponents[msgIndex];
    let updatedMessageComponents = {};
    if (msgComponent) {
      const updatedMsgComponent = {
        ...msgComponent,
        ...{
          props: { ...msgComponent.props, ack: action.payload.ack },
        },
      };
      updatedMessageComponents = {
        messagesComponents: [
          ...state.messagesComponents.slice(0, msgIndex),
          { ...updatedMsgComponent },
          ...state.messagesComponents.slice(msgIndex + 1),
        ],
      };
    }
    return {
      ...state,
      messagesJSON: [
        ...state.messagesJSON.slice(0, msgIndex),
        { ...action.payload },
        ...state.messagesJSON.slice(msgIndex + 1),
      ],
      ...updatedMessageComponents,
    };
  }

  return state;
}

function addMessageReducer(state, action) {
  if (
    state.messagesJSON &&
    state.messagesJSON.find((m) => m.id === action.payload.id)
  )
    return state;
  return {
    ...state,
    messagesJSON: [...(state.messagesJSON || []), action.payload],
  };
}

function updateMessageToRead(state, action) {
  const messageJson = state.messagesJSON;
  const UnreadMessages = state.messagesJSON
    .map((item, i) => {
      item.index = i;
      return item;
    })
    .filter((m) => m.readStatus === 1);
  UnreadMessages.forEach((item) => {
    // const msgIndex = state.messagesJSON.map(m => m.id).indexOf(item.id);
    const msgIndex = item.index;
    const msgComponent = messageJson[msgIndex];

    if (msgComponent) {
      messageJson[msgIndex] = { ...msgComponent, readStatus: 2 };
    }
  });

  const newState = {
    ...state,
    ...{
      messagesJSON: messageJson,
    },
  };
  return newState;
}
