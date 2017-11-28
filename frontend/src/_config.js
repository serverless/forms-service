const isDev = (process.env.NODE_ENV === 'development')

export const config = {
  // cors settings
  domain: (isDev) ? 'http://localhost:3000' : 'https://serverless-forms.netlify.com/',
  // auth0 setup
  auth0: {
    domain: 'serverlessqa.auth0.com',
    clientId: '92uOHMc6ndhp4lElK1UI0AIkuw7jQIlb',
    //apiUrl: 'throwaway',
    callbackUrl: (isDev) ? 'http://localhost:3000/callback' : 'https://serverless-forms.netlify.com/callback'
  },
  // api endpoints
  api: {
    forms: 'https://d3ul21vxig.execute-api.us-west-2.amazonaws.com/prod/get-forms',
    submissions: 'https://d3ul21vxig.execute-api.us-west-2.amazonaws.com/prod/get-entries'
  }
}
