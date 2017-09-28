import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import * as formActions from '../../redux/forms'
import { config } from '../../_config'

function getSubmissions(formId) {
  return axios.post(config.api.submissions,{
    formId: formId
  }).then((response) => {
    console.log(response)
    const forms = response.data
    return forms
  }).catch((err) => {
    console.log(err)
    return []
  })
}

class FormViewContainer extends Component {
  loadFormData = () => {
    const { dispatch, match } = this.props
    const id = match.params.id
    return dispatch(formActions.getFormData(id))
  }
  componentDidMount() {
    const { formData, match } = this.props
    const formId = match.params.id
    const submissions = formData[formId]
    // if no submissions or is past refresh timestamp
    // !submissions || pastRefreshTime
    if (!submissions) {
      this.loadFormData().then(() => {
        console.log('fetched form data from API')
      })
    }
  }
  renderSubmissions() {
    const { formData, match } = this.props
    const formId = match.params.id
    const submissions = formData[formId]
    if (!submissions) return null
    const submissionItems = submissions.map((data, i) => {
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
        if(a < b) return -1
        if(a > b) return 1
        return 0;
      }).map((label, n) => {
        const value = data[label]
        // truncate if long text

        // then
        return <div key={n}>{label}: {value}</div>
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
    const { match } = this.props
    return (
      <div>
        <Link to={`/forms/`}>
          Back to forms list
        </Link>
        <h2>Form id: {match.params.id}</h2>
        <button onClick={this.loadFormData}>Refresh form submissions</button>
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

function mapReduxStateToProps({forms}) {
  return {
    forms: forms.forms,
    formData: forms.formData,
    error: forms.error
  }
}

const FormView = connect(
  mapReduxStateToProps,
)(FormViewContainer)

export default FormView
