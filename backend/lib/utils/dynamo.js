const awsSDK = require('aws-sdk')
const dynamoDoc = new awsSDK.DynamoDB.DocumentClient()
const sanitizeValues = require('./sanitize')
const util = require('util')

const customValues = {
  favorite: '<script>alert("hi")</script>',
  awsome: '<h1>hi</h1>',
  size: 'large',
  price: 1,
  books: ['one', 'two', '<script>no()</script>'],
  object: {
    key: ['xxxx', 'xxxx', '<script>iiii()</script>'],
    lol: true,
    hi: '<script>alert()</script>',
    fx: {
      key: ['yyy', 'yyyy', '<script>yyyy()</script>'],
      gu: {
        foo: '<script>wwwww()</script>',
        bar: ['hi', '<script>alert(xxxx)</script>']
      }
    }
  }
}

// TODO finish dynamo helper
const update = (table, key, values, cb) => {

  if (process.env.DEBUG) {
    console.log('RAW Params')
    console.log(util.inspect(values, {showHidden: false, depth: null}))
  }

  const keys = Object.keys(values)

  let exp = 'SET '
  keys.forEach((e, i) => { exp += `#V${i} = :v${i}, ` })

  console.log('exp', exp)

  const expNames = keys
    .map((obj, i) => ({ [`#V${i}`]: obj }))
    .reduce((acc, obj) => Object.assign(acc, obj));

  console.log('expNames', expNames)

  const expValues = keys
    .map((obj, i) => ({ [`:v${i}`]: sanitizeValues(values[obj]) }))
    .reduce((acc, obj) => Object.assign(acc, obj));

  console.log('expValues', expValues)

  var params = {
    TableName: table,
    UpdateExpression: exp.replace(new RegExp(/, $/), ''),
    ExpressionAttributeNames: expNames,
    ExpressionAttributeValues: expValues,
    Key: {
      'Id': key
    },
    ReturnValues: 'ALL_NEW'
  }

  if (process.env.DEBUG) {
    console.log('Sanitized Params')
    console.log(util.inspect(params, {showHidden: false, depth: null}))
  }

  console.log('params', params)

  // todo: save in dynamodb

}

// update('table', 'id', customValues)

module.exports = dynamoDoc
