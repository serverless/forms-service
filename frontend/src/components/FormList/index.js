import React, { Component } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { config } from '../../_config'

function getForms() {
  return axios.post(config.api.forms).then((response) => {
    console.log(response)
    const forms = response.data
    return forms
  }).catch((err) => {
    console.log(err)
    return []
  })
}

export default class FormList extends Component {
  constructor (props, context) {
    super(props, context)
    this.state = {
      forms: false
    }
  }
  componentDidMount() {
    getForms().then((forms) => {
      this.setState({
        forms: forms
      })
    })
  }
  renderFormList() {
    const { forms } = this.state
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
  // https://tympanus.net/Tutorials/StickyTableHeaders/index.html
  render() {
    return (
      <div className="App">
        <div className="App-intro">
          <h1>Forms</h1>
          {this.renderFormList()}
        </div>
      </div>
    )
  }
}
