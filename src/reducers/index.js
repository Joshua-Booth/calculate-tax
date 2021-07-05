import { combineReducers } from "redux";
import { reducer as notifReducer } from "redux-notifications";

// Reducers
import { default as coreReducer } from "./core";
import { default as mainReducer } from "./main";

const appReducer = combineReducers({
  notifs: notifReducer,
  core: coreReducer,
  main: mainReducer,
});

export default appReducer;
