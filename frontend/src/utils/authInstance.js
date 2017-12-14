import auth0 from 'auth0-js'
import { initializeXsrfToken } from './xsrf'
import { config } from '../_config'

export default function WebAuth() {
  // set xsrf token
  const token = initializeXsrfToken() // eslint-disable-line

  return new auth0.WebAuth({
    domain: config.auth0.domain,
    clientID: config.auth0.clientId,
    audience: `https://${config.auth0.domain}/userinfo`,
    responseType: 'token id_token',
    scope: 'openid email'
  })
}
