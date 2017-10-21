const isDev = (process.env.NODE_ENV === 'development')

export const config = {
  // cors settings
  domain: (isDev) ? 'http://localhost:3000' : 'http://sls-forms.surge.sh',
  // auth0 setup
  auth0: {
    domain: 'serverlessdev.auth0.com',
    clientId: 'Rj8Xz7lD9k01M046leIqk8CdmAwCCYbm',
    apiUrl: 'throwaway',
    callbackUrl: (isDev) ? 'http://localhost:3000/callback' : 'http://sls-forms.surge.sh/callback'
  },
  // api endpoints
  api: {
    forms: 'https://d3ul21vxig.execute-api.us-west-2.amazonaws.com/prod/get-forms',
    submissions: 'https://d3ul21vxig.execute-api.us-west-2.amazonaws.com/prod/get-entries'
  }
}
