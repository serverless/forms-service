console.log(process.env)
console.log('process.env.DEPLOY_URL', process.env.DEPLOY_URL)
console.log('process.env.DEPLOY_PRIME_URL', process.env.DEPLOY_PRIME_URL)
console.log('process.env.BRANCH', process.env.BRANCH)
console.log('COMMIT_REF', process.env.COMMIT_REF)
console.log('URL', process.env.URL)

console.log('run custom stuff')
const authConfig = require('../src/_config').config

console.log('auth0 config', authConfig)

if (!process.env.NETLIFY_API_KEY) {
  console.log('no NETLIFY_API_KEY found in process.env. Unable to sync auth0 client')
  return false
}

if (!process.env.AUTH0_API_KEY) {
  console.log('no AUTH0_API_KEY found in process.env. Unable to sync auth0 client')
  return false
}


// authConfig.auth0.domain: 'serverlessqa.auth0.com',
// authConfig.auth0.clientId: '92uOHMc6ndhp4lElK1UI0AIkuw7jQIlb',

/*
[ { url: 'http://test-branch.serverless-forms.netlify.com',
    ssl_url: 'https://test-branch--serverless-forms.netlify.com' },
  { url: 'http://serverless-forms.netlify.com',
    ssl_url: 'https://serverless-forms.netlify.com' } ]

  8:56:24 PM: process.env.DEPLOY_URL https://5a4c6229df9953756db64956--serverless-forms.netlify.com
  8:56:24 PM: process.env.DEPLOY_PRIME_URL https://test-branch--serverless-forms.netlify.com
 */
