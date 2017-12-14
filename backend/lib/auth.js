/*
  Custom Authorizer for token based requested
*/
const util = require('util')
const jwt = require('jsonwebtoken')
const jwksClient = require('jwks-rsa')
// const arnUtils = require('./utils/arnUtils')
const auth0Domain = process.env.AUTH0_DOMAIN
const authClient = jwksClient({
  cache: true,
  jwksUri: `https://${auth0Domain}/.well-known/jwks.json`,
})

module.exports = (event, context, callback) => {

  if (!event.authorizationToken) {
    console.log('event.authorizationToken missing')
    return callback('Unauthorized')
  }

  const authToken = event.authorizationToken.substring(7) // remove "bearer " word from token
  const alg = 'RS256' // algorithm is RSA http://bit.ly/2xAYygk

  if (!authToken) {
    console.log('401 Unauthorized no jwt token')
    return callback('Unauthorized')
  }

  // Validate Token is not malformed. AKA fail fail
  let decodedToken
  try {
    decodedToken = jwt.decode(authToken, { complete: true })
   } catch (err) {
    console.log('jwt token malformed', err)
    return callback('Unauthorized')
  }

  // if token empty
  if (!decodedToken) {
    console.log('null token on user exit')
    return callback('Unauthorized')
  }

  // Get Signing key from auth0
  const kid = decodedToken.header.kid
  authClient.getSigningKey(kid, (signError, key) => {
    if (signError) {
      console.log('signing key error', signError)
      return callback('Unauthorized')
    }
    const signingKey = key.publicKey || key.rsaPublicKey
    const opts = {
      algorithms: alg // algorithm is RSA http://bit.ly/2xAYygk
    }
    // Now Verify the jwt token is valid
    try {
      jwt.verify(authToken, signingKey, opts, (verifyError, decoded) => {
        if (verifyError) {
          console.log('Token signature NOT VERIFIED', verifyError)
          return callback('Unauthorized')
        }
        // output for logs
        console.log('------------------')
        console.log('decoded jwt token')
        console.log(decoded)
        console.log('------------------')

        /* if you want to allow only verified emails use this */
        // if (!decoded.email_verified) {
        //   console.log('User has not verified email yet', decoded)
        //   return callback(verifyError)
        // }

        /* Does role match? */
        const roles = decoded['https://serverless.com/roles']
        if (!roles || !roles.length || !roles.includes('admin')) {
          console.log(`User ${decoded.sub} is not an admin`)
          console.log(`User ${decoded.sub} current roles:`, roles)
          return callback('Unauthorized')
        }

        // Generate IAM policy to access function
        const IAMPolicy = generatePolicy(decoded.sub, 'Allow', event.methodArn)
        console.log('IAMPolicy:')
        console.log(util.inspect(IAMPolicy, false, null))
        console.log('------------------')
        // Return the policy
        return callback(null, IAMPolicy)

      })
     } catch (err) {
      console.log('jwt.verify exception', err)
      return callback('Unauthorized')
    }
  })
}


/*
  We need to generate an IAM policy that will allow invocation of a functionName

  The resource looks like:

  Format:

  arn:aws:execute-api:<region>:<account_id>:<restapi_id>/<stage>/<httpVerb>/<path>

  Like so:

  arn:aws:execute-api:us-west-2:31241241223:d3ul21vxig/prod/POST/get-forms

 */
function generatePolicy (principalId, effect, resource) {
  let authResponse = {}

  // set User ID
  authResponse.principalId = principalId

  // Add Allow/Deny IAM Statements
  if (effect && resource) {
    const statementOne = {
      Action: 'execute-api:Invoke',
      Effect: effect,
      Resource: resource,
    }

    const policyDocument = {
      Version: '2012-10-17',
      Statement: [
        statementOne
      ]
    }

    authResponse.policyDocument = policyDocument
  }
  // optionally add additional context for next function to consume
  authResponse.context = {
    "stringKey": "stringval",
    "numberKey": 123,
    "booleanKey": true
  }
  return authResponse
}
