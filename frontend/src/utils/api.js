import axios from 'axios'
import { config } from '../_config'

// get all form info
export function getForms() {
  return axios.post(config.api.forms).then((response) => {
    return response.data
  })
}

// get single form submissions
export function getSingleFormData(formId) {
  // alert('Make API call')
  return axios.post(config.api.submissions,{
    formId: formId
  }).then((response) => {
    return response.data
  })
}
