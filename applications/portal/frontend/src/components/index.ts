import { connect } from 'react-redux'

import { App as app } from '../App'
import { Banner as banner } from './header/Banner'
import { Header as header } from './header/Header'
import { ProtectedRoute as protectedRoute } from './auth/ProtectedRouter';

import { RootState } from '../store/rootReducer'
import { userLogin, userLogout, userRegister } from '../store/actions/user';

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


export const Banner = connect(mapUserStateToProps, dispatchUserProps)(banner)
export const Header = connect(mapUserStateToProps, { ...dispatchUserProps, })(header)

export const App = connect(mapErrorStateToProps, null)(app)
export const ProtectedRoute = connect(mapUserStateToProps, dispatchUserProps)(protectedRoute)
