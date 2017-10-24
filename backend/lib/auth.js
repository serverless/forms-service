const jwt = require('jsonwebtoken')
const jwksClient = require('jwks-rsa')
const auth0Domain = process.env.AUTH0_DOMAIN
const authClient = jwksClient({
  cache: true,
  jwksUri: `https://${auth0Domain}/.well-known/jwks.json`,
})

/*
 * JWT Authorization for custom authorizers AND http events
 * TODO set cors https://github.com/awslabs/aws-apigateway-importer/issues/195#issuecomment-332957858
https://github.com/auth0-samples/jwt-rsa-aws-custom-authorizer/blob/93fdd9c1d33d591a37ee56358f600839b33ff505/lib.js#L41
 * https://medium.com/statup/statups-workaround-long-term-solution-to-an-aws-cors-issue-68d0b68555db
 */
module.exports = (event, context, callback) => {
  console.log('event', event)
  let errorMsg
  const isAuthorizer = event.authorizationToken

  const authToken = event.authorizationToken || event.headers.Authorization
  if (!authToken) {
    errorMsg = (isAuthorizer) ? 'Unauthorized' : new Error(`[401] No authorizationToken found`)
    return callback(errorMsg)
  }
  console.log('authToken', authToken)
  const tokenParts = authToken.split(' ')
  const tokenValue = tokenParts[1]
  const alg = 'RS256'
  if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
    // 401 Unauthorized
    errorMsg = (isAuthorizer) ? 'Unauthorized' : new Error(`[401] No bearer authorization token found.`)
    return callback(errorMsg)
  }
  console.log('tokenValue', tokenValue)
  var decodedToken

  try {
    decodedToken = jwt.decode(tokenValue, { complete: true })
   } catch (err) {
    console.log('Invalid token', err)
    errorMsg = (isAuthorizer) ? 'Unauthorized' : new Error(`[401] token malformed`)
    return callback(errorMsg)
  }
  // if token empty
  if (!decodedToken) {
    console.log('token empty')
    errorMsg = (isAuthorizer) ? 'Unauthorized' : new Error(`[401] token malformed`)
    return callback(errorMsg)
  }

  const kid = decodedToken.header.kid
  if (decodedToken.header.alg !== alg) {
    console.log('incorrect algorithm')
    // we are only supporting RS256 so fail if this happens.
    errorMsg = (isAuthorizer) ? 'Unauthorized' : new Error(`[401] token malformed`)
    return callback(errorMsg)
  }
  // Get Signing key
  authClient.getSigningKey(kid, (signError, key) => {
    if (signError) {
      console.log('kid mismatch', signError)
      errorMsg = (isAuthorizer) ? 'Unauthorized' : new Error(`[401] kid mismatch`)
      return callback(errorMsg)
    }
    console.log('key', key)
    const signingKey = key.publicKey || key.rsaPublicKey
    const opts = {
      // audience: process.env.AUTH0_CLIENT_ID,
      // Why RSA? http://bit.ly/2xAYygk
      algorithms: alg
    }
    console.log('opts', opts)
    try {
      jwt.verify(tokenValue, signingKey, opts, (verifyError, decoded) => {

        if (verifyError) {
          console.log('verifyError', verifyError)
          // 401 Unauthorized
          console.log(`Token invalid. ${verifyError}`)
          errorMsg = (isAuthorizer) ? 'Unauthorized' : new Error(`[401] Token invalid. ${verifyError}`)
          return callback(errorMsg)
        }
        // is custom authorizer function
        if (event.authorizationToken) {
          console.log('valid from customAuthorizer', decoded)
          return callback(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
        }
        // if (!decoded.email_verified) {
        //   return callback(verifyError)
        // }

        // is http triggered function
        console.log('valid from http-post', decoded)
        return callback(null, {
          statusCode: 200,
          body: JSON.stringify({
            decoded: decoded,
          })
        })
      })
     } catch (err) {
      console.log('catch error. Invalid token', err)
      errorMsg = (isAuthorizer) ? 'Unauthorized' : new Error(`[401] Token invalid. ${err.message}`)
      return callback(errorMsg)
    }
  })
}
// http://docs.aws.amazon.com/apigateway/latest/developerguide/use-custom-authorizer.html
// Policy helper function
function generatePolicy (principalId, effect, resource) {
  let authResponse = {}
  authResponse.principalId = principalId
  if (effect && resource) {
    let policyDocument = {}
    policyDocument.Version = '2012-10-17'
    policyDocument.Statement = []
    let statementOne = {}
    statementOne.Action = 'execute-api:Invoke'
    statementOne.Effect = effect
    statementOne.Resource = resource
    policyDocument.Statement[0] = statementOne
    authResponse.policyDocument = policyDocument
  }
  // add additional context for next function to consume
  authResponse.context = {
    "stringKey": "stringval",
    "numberKey": 123,
    "booleanKey": true
  }

  return authResponse
}

//  cookieString('myCookie', 'abc123', 60 * 60 * 24, event.headers.Host),
function cookieString(key, value, maxAge, domain, secure) {
  let cookieStr = `${key}=${value}; Max-Age=${maxAge}; Domain=${domain.split(':')[0]}; HttpOnly;`;
  if (secure) {
    cookieStr += ' Secure;';
  }
  return cookieStr;
};
