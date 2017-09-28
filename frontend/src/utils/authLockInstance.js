import Auth0Lock from 'auth0-lock'
import { AUTH_CONFIG } from './auth.config.js'

export default function lockInstance(config) {
  // https://auth0.com/docs/libraries/lock/v10/customization
  const scope = 'openid profile read:messages'
  return new Auth0Lock(AUTH_CONFIG.clientId, AUTH_CONFIG.domain, {
    oidcConformant: true,
    autoclose: true,
    autofocus: true,
    // allowedConnections: ['Username-Password-Authentication'],
    auth: {
      redirectUrl: AUTH_CONFIG.callbackUrl,
      responseType: 'token id_token',
      audience: AUTH_CONFIG.apiUrl,
      params: {
        scope: scope,
      }
    }
  })
}
