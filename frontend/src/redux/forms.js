import { getForms, getSingleFormData } from '../utils/api'

/**
 * Action types
 */
const FETCH_FORMS_START = 'FETCH_FORMS_START'
const FETCH_FORMS_SUCCESS = 'FETCH_FORMS_SUCCESS'
const FETCH_FORMS_ERROR = 'FETCH_FORMS_ERROR'
const FETCH_ENTRIES_START = 'FETCH_ENTRIES_START'
const FETCH_ENTRIES_SUCCESS = 'FETCH_ENTRIES_SUCCESS'
const FETCH_ENTRIES_ERROR = 'FETCH_ENTRIES_ERROR'

/**
 * Action creators
 */
export function fetchAllFormData() {
  return (dispatch, getState) => {
    // start request
    dispatch({
      type : FETCH_FORMS_START
    })
    // make api call
    return getForms().then((response) => {
      // request success
      dispatch({
        type: FETCH_FORMS_SUCCESS,
        payload: response.data,
        timestamp: Math.round(+new Date() / 1000)
      })
      //return Promise.resolve()
    }).catch((error) => {
      // console.log('error', error) // eslint-disable-line
      // request failed
      if (error.response && error.response.status === 401) {
        dispatch({
          type: FETCH_FORMS_ERROR,
          error: error.response.data
        })
      }
      // return Promise.reject(error)
    })
  }
}

export function getFormEntries(formId) {
  console.log('getFormEntries', formId)
  return (dispatch, getState) => {
    // start request
    dispatch({
      type: FETCH_ENTRIES_START
    })
    // make api call
    return getSingleFormData(formId).then((response) => {
      // request success
      dispatch({
        type: FETCH_ENTRIES_SUCCESS,
        id: formId,
        payload: response.data,
        timestamp: Math.round(+new Date() / 1000)
      })
      // return Promise.resolve();
    }).catch((error) => {
      if (error.response && error.response.status === 401) {
        dispatch({
          type: FETCH_ENTRIES_ERROR,
          error: error.response.data
        })
      }
      console.log(error.response)
      // request failed

      // return Promise.reject(error)
    })
  }
}

/**
 * Reducer
 */
const initialState = {
  loading: false,
  error: null,
  forms: [],
  formData: {},
  lastFetched: null,
}

export default function formsReducer(state = initialState, action) {
  switch (action.type) {
    // set loading state on ajax request
    case FETCH_FORMS_START:
      return {
        ...state,
        loading: true,
      }
    // set form data on ajax success
    case FETCH_FORMS_SUCCESS:
      return {
        ...state,
        loading: false,
        forms: action.payload,
        lastFetched: action.timestamp,
        error: null
      }
    // set error on ajax failure
    case FETCH_FORMS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    // set loading state on ajax request
    case FETCH_ENTRIES_START:
      return {
        ...state,
        loading: true,
      }
    // set form data on ajax success
    case FETCH_ENTRIES_SUCCESS:
      const obj = {}
      obj[`${action.id}`] = action.payload
      return {
        ...state,
        loading: false,
        formData: {
          ...state.formData,
          ...obj
        },
        lastFetched: action.timestamp,
        error: null
      }
    // set error on ajax failure
    case FETCH_ENTRIES_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    default:
      return state
  }
}
