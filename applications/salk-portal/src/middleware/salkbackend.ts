import { Middleware, AnyAction } from "redux";
import { userLogin, userLogout, userRegister } from '../store/actions/user'
import { setError } from '../store/actions/error';


import * as UserService from '../service/UserService';
import { RootState } from "../store/rootReducer";


/**
 * @private
 */
const callAPIMiddlewareFn: Middleware = ({ getState }: { getState: () => RootState }) => next => async (action: AnyAction) => {



  switch (action.type) {

    case userLogin.toString(): {
      if (!action.payload) {
        UserService.login().then(
          (user: any) => next({ ...action, payload: user }),
          () => next(setError("UserService caused an error"))
        );
      } else {
        next(action);
      }

      break;
    }
    case userLogout.toString():
      UserService.logout();
      break;
    case userRegister.toString():
      UserService.register().then(
        (user: any) => next({ ...action, payload: user }),
        () => next(setError("UserService caused an error"))
      );
      break;

      default:
      return next(action);
    //
  }
};


export default callAPIMiddlewareFn;


