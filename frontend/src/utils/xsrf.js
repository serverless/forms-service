
const XSRF_TOKEN_KEY = 'xsrf_token'

function setXsrfToken() {
  const xsrfToken = Math.random().toString(36).slice(2)
  localStorage.setItem(XSRF_TOKEN_KEY, xsrfToken)
  return xsrfToken
}

export function initializeXsrfToken() {
  const token = getXsrfToken()
  if (token) return token
  // no token found. Set token
  return setXsrfToken()
}

export function clearXsrfToken() {
  return localStorage.removeItem(XSRF_TOKEN_KEY)
}

export function getXsrfToken() {
  return localStorage.getItem(XSRF_TOKEN_KEY)
}
