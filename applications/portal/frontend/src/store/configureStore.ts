import loggerMiddleware from "redux-logger";
// @ts-ignore
import {createStore} from '@metacell/geppetto-meta-client/common';
import salkMiddleware from "../middleware/salkbackend";
import baseLayout from '../components/layout/defaultLayout';
import componentMap from '../components/layout/componentMap';
import rootReducer from "./rootReducer";
import {UserInfo} from "../types/user";

interface STATE {
  user: UserInfo;
  error: string;
}

export default function configureStore() {
  const middlewares = [loggerMiddleware, salkMiddleware];
  const INIT_STATE : STATE = {
    user: null,
    error: null
  };

  return createStore(
      rootReducer,
      INIT_STATE,
      middlewares,
      { baseLayout, componentMap },

  );
}