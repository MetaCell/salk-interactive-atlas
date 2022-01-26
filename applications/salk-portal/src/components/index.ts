import { connect } from 'react-redux'

import { App as app } from '../App'
import { Banner as banner } from './header/Banner'
import { Header as header } from './header/Header'
import { ErrorDialog as errorDialog } from './error-dialog/ErrorDialog'
import { ProtectedRoute as protectedRoute } from './auth/ProtectedRouter';

import { RootState } from '../store/rootReducer'
import { userLogin, userLogout, userRegister } from '../store/actions/user';
import { setError } from '../store/actions/error';
import { AnyAction, Dispatch } from 'redux';


const mapUserStateToProps = (state: RootState) => ({
  user: state.user,
});

const dispatchUserProps = {
  login: userLogin,
  logout: userLogout,
  register: userRegister
};

const mapErrorStateToProps = (state: RootState) => ({
  error: state.error,
});

const dispatchErrorProps = {
  setError
};


export const Banner = connect(mapUserStateToProps, dispatchUserProps)(banner)
export const Header = connect(mapUserStateToProps, { ...dispatchUserProps, })(header)

export const App = connect(mapErrorStateToProps, null)(app)
export const ErrorDialog = connect(mapErrorStateToProps, dispatchErrorProps)(errorDialog)
export const ProtectedRoute = connect(mapUserStateToProps, dispatchUserProps)(protectedRoute)
