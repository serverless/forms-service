import axios from 'axios'
import { config } from '../_config'

axios.interceptors.response.use((response) => response, (error) => {
  // console.log('error', error)
  if (typeof error.response === 'undefined') {
    const msg = `A network error occurred. This could be a CORS issue or a dropped internet connection. It is not possible for us to know. =(`
    console.log(msg)
    return Promise.reject(new Error('internet_hiccup'))
  }
  return Promise.reject(error)
})

// get all form info
export function getForms() {
  return axios({
    method: 'post',
    url: config.api.forms,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('id_token')}`
    },
    // validateStatus: (status) => {
    //   return status < 500; // Reject only if the status code is greater than or equal to 500
    // }
  })
}

// deleteFormEntry
export function deleteEntry(data) {
  return axios({
    method: 'post',
    url: config.api.deleteEntry,
    data: data,
    headers: {
      Authorization: `Bearer ${localStorage.getItem('id_token')}`
    },
    // validateStatus: (status) => {
    //   return status < 500; // Reject only if the status code is greater than or equal to 500
    // }
  })
}

// get single form submissions
export function getSingleFormData(formId) {
  // alert('Make API call')
  return axios({
    method: 'post',
    url: config.api.submissions,
    data: {
      formId: formId
    },
    headers: {
      Authorization: `Bearer ${localStorage.getItem('id_token')}`
    },
    // validateStatus: (status) => {
    //   return status < 500; // Reject only if the status code is greater than or equal to 500
    // }
  })
  /*
  .then((response) => {
    console.log('response', response)
    debugger
    return response.data
  }).catch((error) => {
    if (error && error.message === 'internet_hiccup') {
      console.log('CORS FAILED from api gateway', error.message);
      // 'Unauthorized' error with an HTTP status code of 401
      console.log('DISPATCH LOGOUT ?')
    }
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log('error.response.data', error.response.data)
      console.log('typeof error.response.data', typeof error.response.data)
      console.log('error.response.status', error.response.status)
      console.log('error.response.headers', error.response.headers)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log('error.request', error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
    }
    console.log(error.config);
    return new Error(error)
  })
   */
}
