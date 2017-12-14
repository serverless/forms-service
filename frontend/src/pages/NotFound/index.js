import React from 'react'
import AppLayout from '../../fragments/AppLayout'

const NoMatch = ({ location }) => {
  return (
    <AppLayout>
      <h3>No match for <code>{location.pathname}</code></h3>
    </AppLayout>
  )
}

export default NoMatch
