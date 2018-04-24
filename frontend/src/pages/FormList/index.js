import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import timeAgo from 'time-ago'
import AppLayout from '../../fragments/AppLayout'
import { capitalizeWords } from '../FormView'
import * as formActions from '../../redux/forms'
import * as userActions from '../../redux/user'

// localStorage.setItem('cache', new Date().getTime())
// TODO change token expire timeout
// and look into refresh tokens
class FormListContainer extends Component {
  state = {
    filterText: ''
  }
  componentDidMount() {
    const { forms, lastFetched } = this.props
    console.log('lastFetched', lastFetched)
    const lastTime = (lastFetched) ? new Date(lastFetched).getTime() : 1e30
    console.log('lastTimelastTimelastTime', lastTime)
    const refreshCacheAfter = 1 // minutes
    const shouldRefresh = Math.floor((new Date() - (lastTime * 1000)) / 60000) >= refreshCacheAfter

    if (shouldRefresh) {
      console.log('PULL FRESH DATA FROM SERVER')
    }
    // if no forms or is past refresh timestamp
    // !forms || pastRefreshTime
    if (!forms || forms.length === 0 || shouldRefresh) {
      this.loadForms()
    }
  }
  loadForms = () => {
    const { dispatch } = this.props
    return dispatch(formActions.fetchAllFormData())
  }
  logOut = () => {
    const { dispatch } = this.props
    return dispatch(userActions.logout())
  }
  handleFilterInput = (e) => {
    this.setState({
      filterText: e.target.value
    })
  }
  getForms = () => {
    const { forms } = this.props
    const { filterText } = this.state

    if (!forms || !forms.length) {
      return []
    }

    return Object.keys(forms).filter((form) => {
      const data = forms[form]
      if (data && data.formId && filterText !== '') {
        const word = capitalizeWords(data.formId.split("-").join(" "))
        return data.formId.toLowerCase().indexOf(filterText) > -1 ||
          data.formId.indexOf(filterText) > -1 ||
          word.toLowerCase().indexOf(filterText) > -1 ||
          word.indexOf(filterText) > -1
      }
      return true
    }).map((formId, i) => {
      const data = forms[formId]
      return data
    })

  }
  renderFormList() {

    const { forms } = this.props
    const { filterText } = this.state
    // filtered form data getForms
    const getForms = this.getForms()
    if (!forms) {
      return null
    }

    // No forms with filterText match found
    if (!getForms.length && filterText) {
      return (
        <div className='not-found'>
          <h2>
            Service "{filterText}" not found 🙈
          </h2>
          <div>
            Clear your search and try again
          </div>
        </div>
      )
    }

    const formListItems = getForms.map((form, i) => {
      const updatedAt = timeAgo.ago(form.updated * 1000)
      let notifications
      if (form.notify && form.notify.length) {
        const personText = (form.notify.length === 1) ? 'person' : 'people'
        const peopleList = form.notify.join(', ')
        notifications = (
          <div className='forms-list-item-metric people-notified' title={peopleList}>
            <div className='forms-list-item-label'>
              Form response sent to
            </div>
            <div className='forms-list-item-value'>
              {form.notify.length} {personText}
            </div>
          </div>
        )
      }

      return (
        <Link key={i} to={`/forms/${form.formId}`}  className='forms-list-item'>
          <div className='forms-list-item-title'>
            {capitalizeWords(form.formId.split("-").join(" "))}
          </div>
          <div className='forms-list-item-metric submission-count'>
            <div className='forms-list-item-label'>
              submissions
            </div>
            <div className='forms-list-item-value'>
              {form.submissionCount}
            </div>
          </div>
          <div className='forms-list-item-metric last-conversion'>
            <div className='forms-list-item-label'>
              last conversion
            </div>
            <div className='forms-list-item-value'>
              {updatedAt}
            </div>
          </div>
          {notifications}
        </Link>
      )
    })
    return (
      <div className='forms-list'>
        {formListItems}
      </div>
    )
  }
  render() {
    const { loading, error, lastFetched } = this.props
    console.log('lastFetched', lastFetched)
    let formsList = this.renderFormList()

    if (loading) {
      formsList = (
        <div className='forms-list'>
          Loading form data
        </div>
      )
    }

    if (error) {
      formsList = (
        <div style={{margin: 20}}>
          Sorry dude {error.message}. Please login again
          <br />
          <button onClick={this.logOut}>logOut</button>
        </div>
      )
    }

    return (
      <AppLayout>
        <div className="App-intro">
          <h1 className='page-title'>
            Forms
            <span
              role="img"
              aria-label="refresh"
              className='refresh-button'
              title='refresh form list'
              onClick={this.loadForms}>
              🔄
            </span>
            <input
              onChange={this.handleFilterInput}
              placeholder='Search Forms'
              className='search-input'
            />
          </h1>

          {formsList}
        </div>
      </AppLayout>
    )
  }
}

function mapReduxStateToProps({forms}) {
  console.log('formsformsforms', forms)
  return {
    forms: forms.forms,
    lastFetched: forms.lastFetched,
    loading: forms.loading,
    error: forms.error
  }
}

const FormList = connect(
  mapReduxStateToProps,
)(FormListContainer)

export default FormList
