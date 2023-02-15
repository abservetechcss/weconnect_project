import { combineReducers } from "redux";
import {
  getInnerSideBarChat,
  webchat,
  getSelectBotIdDetails,
  builder,
  getUserProfile,
  getModes,
  knowledgeBase,
  offlineForm
} from "./ReduxReducerPage";

const reducers = combineReducers({
  innerSideBar: getInnerSideBarChat,
  getUserProfile: getUserProfile,
  webchat: webchat,
  getSelectBotIdDetails: getSelectBotIdDetails,
  builder: builder,
  modes: getModes,
  knowledgeBase: knowledgeBase,
  offlineForm: offlineForm
});
export default reducers;
