import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as formActions from '../../redux/forms'
import * as userActions from '../../redux/user'

// localStorage.setItem('cache', new Date().getTime())
// TODO change token expire timeout
// and look into refresh tokens
class FormListContainer extends Component {
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
  renderFormList() {
    console.log(this.props)
    const { forms } = this.props
    console.log()
    if (!forms) return null
    const formListItems = forms.map((form, i) => {
      console.log('form', form)
      return (
        <li key={i}>
          <Link to={`/forms/${form.formId}`}>
            {form.formId} - {form.submissionCount}
          </Link>
        </li>
      )
    })
    return <ul>{formListItems}</ul>
  }
  render() {
    const { loading, error, lastFetched } = this.props
    console.log('lastFetched', lastFetched)
    let formsList = this.renderFormList()

    if (loading) {
      formsList = (
        <div>
          Loading Homie
        </div>
      )
    }

    if (error) {
      formsList = (
        <div>
          Sorry dude {error.message}. Please login again
          <br />
          <button onClick={this.logOut}>logOut</button>
        </div>
      )
    }

    return (
      <div className="App">
        <div className="App-intro">
          <h1>Forms</h1>
          <button onClick={this.loadForms}>Refresh form list</button>
          {formsList}
        </div>
      </div>
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
