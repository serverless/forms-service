import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import AppLayout from '../../fragments/AppLayout'
import * as formActions from '../../redux/forms'

class FormViewContainer extends Component {
  loadFormEntries = () => {
    const { dispatch, match } = this.props
    const id = match.params.id
    return dispatch(formActions.getFormEntries(id)).catch((e) => {
      console.log('nope')
    })
  }
  componentDidMount() {
    const { entries, forms, dispatch, match } = this.props
    const formId = match.params.id
    const subs = entries[formId]
    // if no submissions or is past refresh timestamp
    // !submissions || pastRefreshTime
    if (!forms || !forms.length) {
      console.log('fetch form data')
      dispatch(formActions.fetchAllFormData()).then(() => {
        console.log('fetched form data from API')
      }).catch((e) => {

      })
    }

    if (!subs) {
      this.loadFormEntries().then(() => {
        console.log('fetched form data from API')
      })
    }
  }
  renderSubmissions() {
    const { entries, forms, match } = this.props // eslint-disable-line
    // console.log('submissions', submissions)
    // console.log('forms', forms)
    const formId = match.params.id
    const subs = entries[formId]
    if (!subs) {
      return (
        <div>loading...</div>
      )
    }
    const sortOrder = 'desc'
    const order = sortDate('timestamp', sortOrder)
    const submissionItems = subs.sort(order).map((data, i) => {
      console.log('data', data)
      const date = formatTime(data.timestamp) // eslint-disable-line
      const prettyDate = new Date(data.timestamp * 1000).toDateString()
      const email = 'Email hidden for demo 🙈' || data.email
      let header
      if (data.email) {
        header = (
          <div className='form-entry-header'>
            <b>{email}</b> completed form on {prettyDate}
          </div>
        )
      }

      const removeFields = ['formId', 'email', 'timestamp']

      const fields = Object.keys(data).filter((key) => {
        // remove fields
        return removeFields.indexOf(key) < 0
      }).sort((a, b) => {
        // sort alpha
        if (a < b) return -1
        if (a > b) return 1
        return 0;
      }).map((label, n) => {
        let value = data[label]

        if (!value) {
          return null
        }
        // truncate if long text
        if (Array.isArray(value)) {
          value = value.join(', ')
        } else if (typeof value === 'object') {
          value = Object.keys(value).map((key) => {
            return `${key}: ${value[key]}`
          }).join(', ')
        }

        // then render
        return (
          <div key={`${label}-${n}`} className='form-entry-field'>
            <b>{label}</b>: {value}
          </div>
        )
      })

      return (
        <div key={i} className='form-entry-wrapper'>
          <div className='form-entry'>
            {header}
            <div className='form-entry-content'>
              {fields}
            </div>
          </div>
        </div>
      )
    })
    return <div>{submissionItems}</div>
  }
  render () {
    const { match, entriesError } = this.props

    const backButton = (
      <Link to={`/forms/`}>
        Back to forms list
      </Link>
    )

    if (entriesError) {
      return (
        <div style={{margin: 20}}>
          Sorry dude {entriesError.message}.<br/><br/>

          Please login again.<br/><br/>

          {backButton}
        </div>
      )
    }
    return (
      <AppLayout>
        <div className='back-button-action'>
          {backButton}
        </div>
        <h1 className='page-title'>
          {capitalizeWords(match.params.id.split("-").join(" "))} Form
          <span
            role="img"
            aria-label="refresh"
            className='refresh-button'
            title='refresh form list'
            onClick={this.loadFormEntries}>
            🔄
          </span>
        </h1>

        <h3>Submissions</h3>
        <div className='card-block'>
          {this.renderSubmissions()}
        </div>
      </AppLayout>
    )
  }
}

export function capitalizeWords(str) {
 return str.replace(/\w\S*/g, (txt) => {
   return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
 })
}

function formatTime(timestamp) {
  const date = new Date(timestamp * 1000)
  // Hours part from the timestamp
  const hours = date.getHours()
  // Minutes part from the timestamp
  const minutes = "0" + date.getMinutes()
  // Seconds part from the timestamp
  const seconds = "0" + date.getSeconds()
  // Will display time in 10:30:23 format
  return hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2)
}

function sortDate(field, order) {
  return function (a, b) {
    const timeA = new Date(a[field]).getTime()
    const timeB = new Date(b[field]).getTime()
    if (order === 'asc') {
      return timeA - timeB
    }
    // default 'desc' descending order
    return timeB - timeA
  }
}

function mapReduxStateToProps({forms}) {
  return {
    forms: forms.forms,
    entries: forms.entries,
    entriesError: forms.entriesError
  }
}

const FormView = connect(
  mapReduxStateToProps,
)(FormViewContainer)

export default FormView
