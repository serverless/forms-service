import Auth from '../utils/auth'


export const auth = new Auth()

const isClient = typeof window !== 'undefined'

/* Constants */
const LOGIN_STARTED = 'LOGIN_STARTED'
const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
const LOGIN_ERROR = 'LOGIN_ERROR'
const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS'

/* Actions */
function loginStarted() {
  return {
    type: LOGIN_STARTED,
  }
}

export function loginSuccess(profile) {
  return {
    type: LOGIN_SUCCESS,
    profile
  }
}

export function loginError(error) {
  return {
    type: LOGIN_ERROR,
    error
  }
}

export function login() {
  return dispatch => {
    if (isClient) {
      // collect data and then lock
      auth.login()
    }
    return dispatch(loginStarted())
    // login finishes via custom middleware user-middleware.js
  }
}

function logoutSuccess() {
  return {
    type: LOGOUT_SUCCESS
  }
}

export function logout() {
  return dispatch => {
    // remove auth0 localStorage items
    auth.logout()
    return dispatch(logoutSuccess())
  }
}

export const initialAuthState = {
  isAuthenticated: auth.isAuthed(),
  profile: localStorage.getItem('profile'),
  loading: false,
  error: ''
}

/* Reducer */
export default function authReducer(state = initialAuthState, action) {
  switch (action.type) {
    case LOGIN_STARTED:
      return {
        ...state,
        loading: true,
      }
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        profile: action.profile,
        loading: false,
        error: ''
      }
    case LOGIN_ERROR:
      return {
        ...state,
        isAuthenticated: false,
        profile: null,
        loading: false,
        error: action.error
      }
    case LOGOUT_SUCCESS:
      return {
        ...state,
        isAuthenticated: false,
        loading: false,
        profile: null
      }
    default:
      return state
  }
}
