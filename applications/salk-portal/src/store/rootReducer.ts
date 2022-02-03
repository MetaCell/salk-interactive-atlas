import user from './reducers/user'
import error from './reducers/error';

const rootReducer = {
  error,
  user,
}


// @ts-ignore
export type RootState = ReturnType<typeof rootReducer>

export default rootReducer