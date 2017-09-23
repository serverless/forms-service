import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
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

export default class FormView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      submissions: false
    }
  }
  componentDidMount() {
    const { match } = this.props
    getSubmissions(match.params.id).then((submissions)=> {
      console.log('sub', submissions)
      this.setState({
        submissions: submissions
      })
    })
  }
  renderSubmissions() {
    const { submissions } = this.state
    if (!submissions) return null
    const submissionItems = submissions.map((data, i) => {
      const date = formatTime(data.timestamp)
      const prettyDate = new Date(data.timestamp * 1000).toDateString()
      return (
        <li key={i}>
          {data.name} - {data.email} - {prettyDate} - {date}
        </li>
      )
    })
    return <ul>{submissionItems}</ul>
  }
  render () {
    const { match } = this.props
    return (
      <div>
        <Link to={`/forms/`}>
          Back to forms list
        </Link>
        <h2>Form id: {match.params.id}</h2>
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
