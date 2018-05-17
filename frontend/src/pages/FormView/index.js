import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import AppLayout from '../../fragments/AppLayout'
import * as formActions from '../../redux/forms'

class FormViewContainer extends Component {
  state = {
    entryFilter: ''
  }
  loadFormEntries = () => {
    const { dispatch, match } = this.props
    const id = match.params.id
    return dispatch(formActions.getFormEntries(id)).catch((e) => {
      console.log('nope', e)
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
        console.log('nope', e)
      })
    }

    if (!subs) {
      this.loadFormEntries().then(() => {
        console.log('fetched form data from API')
      })
    }
  }
  deleteEntry = (formData) => {
    const { dispatch } = this.props
    if (window.confirm("Do you really want delete this?")) {
      dispatch(formActions.deleteFormEntry(formData)).then(() => {
        console.log('Deleted it!')
      })
    }
  }
  handleFilterInput = (e) => {
    this.setState({
      entryFilter: e.target.value
    })
  }
  renderSubmissions() {
    const { entryFilter } = this.state
    const { entries, forms, match } = this.props // eslint-disable-line

    const formId = match.params.id
    const subs = entries[formId]

    if (!subs || !subs.length) {
      return (
        <div>loading...</div>
      )
    }

    // Filter based off search
    const filteredEntries = subs.filter((entry) => {
      if (entry && entry.email && entryFilter !== '') {
        const { name, email, company } = entry
        const emailMatch = email && email.indexOf(entryFilter) > -1
        const nameMatch = (name && (name.toLowerCase().indexOf(entryFilter) > -1 || name.indexOf(entryFilter) > -1))
        const companyMatch = (company && (company.toLowerCase().indexOf(entryFilter) > -1 || company.indexOf(entryFilter) > -1))
        return emailMatch || nameMatch || companyMatch
      }
      return true
    })

    // No forms with filterText match found
    if (!filteredEntries.length && entryFilter) {
      return (
        <div className='not-found'>
          <h2>
            Entry "{entryFilter}" not found 🙈
          </h2>
          <div>
            Clear your search and try again
          </div>
        </div>
      )
    }

    const sortOrder = 'desc'
    const order = sortDate('timestamp', sortOrder)
    const submissionItems = filteredEntries.sort(order).map((data, i) => {
      // console.log('data', data)
      const date = formatTime(data.timestamp) // eslint-disable-line
      const prettyDate = new Date(data.timestamp * 1000).toDateString()
      const email = data.email
      // const email = 'Email hidden for demo 🙈'
      let header
      if (data.email) {
        header = (
          <div className='form-entry-header' data-time={data.timestamp}>
            <b>{email} - {prettyDate}</b>
            <span>
              <button
                className="grey-btn"
                style={{marginRight: 10}}
                onClick={this.deleteEntry.bind(null, data)}>
                Delete Entry
              </button>
            </span>
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
        const cleanLabel = label.replace(/_/g, ' ')
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
            <b>{cleanLabel}</b><span>{value}</span>
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
        {'◁ Back to forms list'}
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
        <div className='app-actions'>
          <span className='action'>
            {backButton}
          </span>
          <span className='action'>
            <Link to={`/forms/${match.params.id}/settings`}>
              {'⚙ Form Settings'}
            </Link>
          </span>
          <span
            aria-label="refresh"
            className='action'
            title='refresh form list'
            onClick={this.loadFormEntries}>
            Refresh entries
          </span>
        </div>
        <h1 className='page-title'>
          {capitalizeWords(match.params.id.split("-").join(" "))} Form Entries
        </h1>

        <div className='search-input-wrapper'>
          <input
            onChange={this.handleFilterInput}
            placeholder='🔍 Search Form Entries'
            className='search-input'
          />
        </div>

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
