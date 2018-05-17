import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import AppLayout from '../../fragments/AppLayout'
import * as formActions from '../../redux/forms'

class FormSettingsContainer extends Component {
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

    // load entries for quick back buttoning
    if (!subs) {
      this.loadFormEntries().then(() => {
        console.log('fetched form data from API')
      })
    }
  }
  saveSettings = () => {
    const { dispatch, match } = this.props
    if (!this.inputElement.value) {
      alert('Must have an email in here')
    }
    // Validate email addresses
    const emailRegex = /^([\w_\.\-\+])+@([\w\-]+\.)+([\w]{2,10})+$/ // eslint-disable-line
    const emails = this.inputElement.value.split('\n')

    let invalidEmails = []
    emails.forEach((email) => {
      if (!email.match(emailRegex)) {
        alert(`"${email}" is not valid email. Please enter valid email`)
        invalidEmails.push(email)
      }
    })

    if (invalidEmails.length) {
      console.log('Please fix emails', invalidEmails)
      return false
    }

    // All good. Make update to settings call
    const formId = match.params.id
    console.log('formId', formId)
    console.log('emailData', emails)

    dispatch(formActions.updateSettings(formId, emails)).then(() => {
      console.log('fetched form data from API')
    }).catch((e) => {
      console.log('nope', e)
    })
  }
  render () {
    const { match, forms } = this.props
    const formList = forms || []
    const formId = match.params.id


    const currentForm = formList.filter((form) => {
      return form.formId === formId
    })[0]

    let settingsRender = (
      <div>Loading settings</div>
    )
    if (currentForm) {
      const notificationEmails = currentForm.notify.join('\n')
      settingsRender = (
        <div>
          <div className='setting-label'>
            Enter emails to get notifications. One per line.
          </div>
          <div>
            <textarea
              className='notification-textarea'
              ref={(el) => this.inputElement = el}
              defaultValue={notificationEmails}
            />
          </div>
          <button
            className="grey-btn"
            style={{marginRight: 10}}
            onClick={this.saveSettings}>
            Save form settings
          </button>
        </div>
      )
    }

    const backButton = (
      <Link to={`/forms/${formId}`}>
        {'◁ Back to form entries'}
      </Link>
    )

    return (
      <AppLayout>
        <div className='app-actions'>
          <span className='action'>
            {backButton}
          </span>
        </div>
        <h1 className='page-title'>
          {capitalizeWords(match.params.id.split("-").join(" "))} Form Settings ⚙
        </h1>

        <div className='settings-block'>
          {settingsRender}
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

function mapReduxStateToProps({forms}) {
  return {
    forms: forms.forms,
    entries: forms.entries,
    entriesError: forms.entriesError
  }
}

const FormSettings = connect(
  mapReduxStateToProps,
)(FormSettingsContainer)

export default FormSettings
