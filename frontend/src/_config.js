const isDev = (process.env.NODE_ENV === 'development')

export const config = {
  // auth0 setup
  auth0: {
    domain: 'serverlessqa.auth0.com',
    clientId: '92uOHMc6ndhp4lElK1UI0AIkuw7jQIlb',
  },
  // api endpoints
  api: {
    forms: 'https://d3ul21vxig.execute-api.us-west-2.amazonaws.com/prod/get-forms',
    submissions: 'https://d3ul21vxig.execute-api.us-west-2.amazonaws.com/prod/get-entries'
  }
}
