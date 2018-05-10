import {
  getForms,
  getSingleFormData,
  updateFormSettings,
  deleteEntry
} from '../utils/api'

/* Action types */
// get forms
const FETCH_FORMS_START = 'FETCH_FORMS_START'
const FETCH_FORMS_SUCCESS = 'FETCH_FORMS_SUCCESS'
const FETCH_FORMS_ERROR = 'FETCH_FORMS_ERROR'
// get entries
const FETCH_ENTRIES_START = 'FETCH_ENTRIES_START'
const FETCH_ENTRIES_SUCCESS = 'FETCH_ENTRIES_SUCCESS'
const FETCH_ENTRIES_ERROR = 'FETCH_ENTRIES_ERROR'
// delete entries
const DELETE_ENTRY_START = 'DELETE_ENTRY_START'
const DELETE_ENTRY_SUCCESS = 'DELETE_ENTRIES_SUCCESS'
const DELETE_ENTRY_ERROR = 'DELETE_ENTRIES_ERROR'
// update form settings
const UPDATE_FORM_SETTINGS_START = 'UPDATE_FORM_SETTINGS_START'
const UPDATE_FORM_SETTINGS_SUCCESS = 'UPDATE_FORM_SETTINGS_SUCCESS'
const UPDATE_FORM_SETTINGS_ERROR = 'UPDATE_FORM_SETTINGS_ERROR'

/* Action creators */
export function fetchAllFormData() {
  return (dispatch, getState) => {
    // start request
    dispatch({
      type : FETCH_FORMS_START
    })
    // make api call
    return getForms().then((response) => {
      // request success
      if (response.data.length) {
        dispatch({
          type: FETCH_FORMS_SUCCESS,
          payload: response.data,
          timestamp: Math.round(+new Date() / 1000)
        })
      } else {
        // dynamo returned empty array
        // TODO fix this in api
        dispatch({
          type: FETCH_FORMS_ERROR,
          error: {
            message: 'no forms found'
          }
        })
      }
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
      if (response.data.length) {
        dispatch({
          type: FETCH_ENTRIES_SUCCESS,
          id: formId,
          payload: response.data,
          timestamp: Math.round(+new Date() / 1000)
        })
      } else {
        // dynamo returned empty array
        // TODO fix this in api
        dispatch({
          type: FETCH_ENTRIES_ERROR,
          error: {
            message: `${formId} not found`
          }
        })
      }
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
    })
  }
}


export function deleteFormEntry(formData) {
  console.log('deleteFormEntry', formData)
  return (dispatch, getState) => {
    // start request
    dispatch({
      type: DELETE_ENTRY_START
    })
    // make api call
    return deleteEntry(formData).then((response) => {
      // request success
      if (response.data.success) {
        dispatch({
          type: DELETE_ENTRY_SUCCESS,
          formData: formData,
        })
      } else {
        // dynamo returned empty array
        // TODO fix this in api
        dispatch({
          type: DELETE_ENTRY_ERROR,
          error: {
            message: `${formData.formId} not found`
          }
        })
      }
      // return Promise.resolve();
    }).catch((error) => {

      dispatch({
        type: DELETE_ENTRY_ERROR,
        error: error
      })

      if (error.response && error.response.status === 401) {
        dispatch({
          type: DELETE_ENTRY_ERROR,
          error: error.response.data
        })
      }
      console.log(error.response)
    })
  }
}


export function updateSettings(formId, emails) {
  console.log('updateFormSettings', formId, emails)
  return (dispatch, getState) => {
    // start request
    dispatch({
      type: UPDATE_FORM_SETTINGS_START
    })
    // make api call
    return updateFormSettings(formId, emails).then((response) => {
      console.log(response)
      // request success
      if (response.data.success) {
        dispatch({
          type: UPDATE_FORM_SETTINGS_SUCCESS,
          formId: formId,
          emails: emails
        })
      }
      // return Promise.resolve();
    }).catch((error) => {
      console.log(error)
      console.log(error.response)
      dispatch({
        type: UPDATE_FORM_SETTINGS_ERROR,
        error: error,
        formId: formId
      })
    })
  }
}

/* Reducer */
const initialState = {
  loading: false,
  error: null,
  forms: [],
  entries: {},
  lastFetched: null,
  entriesError: null,
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
        entries: {
          ...state.entries,
          ...obj
        },
        lastFetched: action.timestamp,
        entriesError: null
      }
    case DELETE_ENTRY_SUCCESS:
      const { formId, timestamp } = action.formData
      const updatedEntries = state.entries[formId].filter((entry) => {
        return entry.timestamp !== timestamp
      })
      const newEntries = {}
      newEntries[`${formId}`] = updatedEntries

      const updatedForms = state.forms.map((form) => {
        if (form.formId === formId) {
          const newCount = form.submissionCount - 1
          return { ...form, ...{ submissionCount: newCount }}
        }
        return form
      })
      return {
        ...state,
        loading: false,
        entries: {
          ...state.entries,
          ...newEntries
        },
        forms: updatedForms,
      }
    // set error on ajax failure
    case FETCH_ENTRIES_ERROR:
      return {
        ...state,
        loading: false,
        entriesError: action.error
      }
    default:
      return state
  }
}
