import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
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
    const { entries, forms, match } = this.props
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
      const date = formatTime(data.timestamp)
      const prettyDate = new Date(data.timestamp * 1000).toDateString()

      let header
      if (data.email) {
        header = (
          <div>{data.email} - {prettyDate} - {date}</div>
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
        // truncate if long text
        if (value && typeof value === 'object') {
          value = 'object'
        }

        if (value && Array.isArray(value)) {
          value = value.join(', ')
        }

        // then render
        return (
          <div key={n}>
            <b>{label}</b>: {value}
          </div>
        )
      })

      return (
        <div key={i} style={{borderBottom: '1px solid'}}>
          {header}
          {fields}
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
        <div>
          Sorry dude {entriesError.message}.<br/><br/>
          {backButton}
        </div>
      )
    }
    return (
      <div>
        {backButton}
        <h2>Form id: {match.params.id}</h2>
        <button onClick={this.loadFormEntries}>Refresh form submissions</button>
        <h3>Submissions</h3>
        {this.renderSubmissions()}
      </div>
    )
  }
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
