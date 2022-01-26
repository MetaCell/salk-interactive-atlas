import { combineReducers } from '@reduxjs/toolkit'
import user from './reducers/user'
import error from './reducers/error';

const rootReducer = combineReducers({
  error,
  user,
})


export type RootState = ReturnType<typeof rootReducer>

export default rootReducer