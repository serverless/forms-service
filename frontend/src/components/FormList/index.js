import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import * as formActions from '../../redux/forms'
import { config } from '../../_config'

class FormListContainer extends Component {
  componentDidMount() {
    const { forms, dispatch } = this.props
    // if no forms or is past refresh timestamp
    // !forms || pastRefreshTime
    if (!forms || forms.length === 0) {
      this.loadForms()
    }
  }
  loadForms = () => {
    this.props.dispatch(formActions.getAllForms())
  }
  renderFormList() {
    console.log(this.props)
    const { forms } = this.props
    if (!forms) return null
    const formListItems = forms.map((form, i) => {
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
    const { loading, error } = this.props
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
          Sorry dude {error.message}
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
  return {
    forms: forms.forms,
    loading: forms.loading,
    error: forms.error
  }
}

const FormList = connect(
  mapReduxStateToProps,
)(FormListContainer)

export default FormList
