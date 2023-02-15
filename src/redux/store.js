import { createStore, applyMiddleware } from 'redux'
import masterReducer from "./reducers/index";
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';
const store = createStore(masterReducer, composeWithDevTools(applyMiddleware(thunk)));
export default store;
