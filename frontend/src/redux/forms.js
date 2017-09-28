import { getForms, getSingleFormData } from '../utils/api'

/**
 * Action types
 */
const FETCH_ALL_FORMS_START = 'FETCH_ALL_FORMS_START'
const FETCH_ALL_FORMS_SUCCESS = 'FETCH_ALL_FORMS_SUCCESS'
const FETCH_ALL_FORMS_ERROR = 'FETCH_ALL_FORMS_ERROR'
const FETCH_FORM_DATA_START = 'FETCH_FORM_DATA_START'
const FETCH_FORM_DATA_SUCCESS = 'FETCH_FORM_DATA_SUCCESS'
const FETCH_FORM_DATA_ERROR = 'FETCH_FORM_DATA_ERROR'

/**
 * Action creators
 */
export function getAllForms() {
  return (dispatch, getState) => {
    // start request
    dispatch({
      type : FETCH_ALL_FORMS_START
    })
    // make api call
    return getForms().then((forms) => {
      // request success
      dispatch({
        type: FETCH_ALL_FORMS_SUCCESS,
        payload: forms,
        timestamp: Math.round(+new Date() / 1000)
      })
      return Promise.resolve();
    }).catch((error) => {
      console.log('error', error) // eslint-disable-line
      // request failed
      dispatch({
        type: FETCH_ALL_FORMS_ERROR,
        error: error
      })
      return Promise.reject(error)
    })
  }
}

export function getFormData(formId) {
  console.log('getFormData', formId)
  return (dispatch, getState) => {
    // start request
    dispatch({
      type: FETCH_FORM_DATA_START
    })
    // make api call
    return getSingleFormData(formId).then((formData) => {
      // request success
      dispatch({
        type: FETCH_FORM_DATA_SUCCESS,
        id: formId,
        payload: formData,
        timestamp: Math.round(+new Date() / 1000)
      })
      return Promise.resolve();
    }).catch((error) => {
      // request failed
      dispatch({
        type: FETCH_FORM_DATA_ERROR,
        error: error
      })
      return Promise.reject(error)
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
    case FETCH_ALL_FORMS_START:
      return {
        ...state,
        loading: true,
      }
    // set form data on ajax success
    case FETCH_ALL_FORMS_SUCCESS:
      return {
        ...state,
        loading: false,
        forms: action.payload,
        lastFetched: action.timestamp,
        error: null
      }
    // set error on ajax failure
    case FETCH_ALL_FORMS_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    // set loading state on ajax request
    case FETCH_FORM_DATA_START:
      return {
        ...state,
        loading: true,
      }
    // set form data on ajax success
    case FETCH_FORM_DATA_SUCCESS:
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
    case FETCH_FORM_DATA_ERROR:
      return {
        ...state,
        loading: false,
        error: action.error
      }
    default:
      return state
  }
}
