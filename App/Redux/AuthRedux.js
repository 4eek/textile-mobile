import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  signUp: null,
  logIn: null,
  forgotPassword: null,
  signUpRequest: ['referralCode', 'email', 'password'],
  logInRequest: ['email', 'password'],
  forgotPasswordRequest: ['email'],
  signUpSuccess: ['token'],
  logInSuccess: ['token'],
  forgotPasswordSuccess: null,
  signUpFailure: ['error'],
  logInFailure: ['error'],
  forgotPasswordFailure: ['error']
})

export const AuthTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  currentState: 'signUp',
  processing: false,
  error: null,
  token: null
})

/* ------------- Selectors ------------- */

export const AuthSelectors = {
}

/* ------------- Reducers ------------- */

export const signUp = state =>
  state.merge({...state, currentState: 'signUp'})

export const logIn = state =>
  state.merge({...state, currentState: 'logIn'})

export const forgotPassword = state =>
  state.merge({...state, currentState: 'forgotPassword'})

export const handleRequest = state =>
  state.merge({...state, processing: true})

export const handleSuccess = (state, {token}) =>
  state.merge({...state, token})

export const handleFailure = (state, {error}) =>
  state.merge({...state, error})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.SIGN_UP]: signUp,
  [Types.LOG_IN]: logIn,
  [Types.FORGOT_PASSWORD]: forgotPassword,
  [Types.SIGN_UP_REQUEST]: handleRequest,
  [Types.LOG_IN_REQUEST]: handleRequest,
  [Types.FORGOT_PASSWORD_REQUEST]: handleRequest,
  [Types.SIGN_UP_SUCCESS]: handleSuccess,
  [Types.LOG_IN_SUCCESS]: handleSuccess,
  [Types.SIGN_UP_FAILURE]: handleFailure,
  [Types.LOG_IN_FAILURE]: handleFailure,
  [Types.FORGOT_PASSWORD_FAILURE]: handleFailure
})
