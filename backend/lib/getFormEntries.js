const dynamoDoc = require('./utils/dynamo')
const corsHeaders = require('./utils/cors')
const validateBody = require('./utils/validateBody')
const ENTRIES_TABLE = process.env.ENTRIES_TABLE

module.exports = function getFormEntries(event, context, callback) {
  console.log(event)
  const body = JSON.parse(event.body)

  // validate event body
  try {
    const requiredValues = ['formId']
    validateBody(body, requiredValues)
  } catch (err) {
    return callback(err)
  }

  const formId = body.formId
  const to = body.to || Math.round(+new Date() / 1000)

  const unixDay = 86400000
  let from = body.from || 'alltime'
  if (from === 'alltime') {
    from = 0
  } else if (from === 'yesterday') {
    from = Math.round(new Date(Date.now() - unixDay).getTime() / 1000)
  } else if (from === 'lastweek') {
    from = Math.round(new Date(Date.now() - (unixDay * 7)).getTime() / 1000)
  }

  let params = {
    TableName: ENTRIES_TABLE,
    KeyConditionExpression: "#formId = :formId and #timestamp BETWEEN :from AND :to",
    ExpressionAttributeNames: {
      "#formId": "formId",
      "#timestamp": "timestamp"
    },
    ExpressionAttributeValues: {
      ":formId": formId,
      ":from": from,
      ":to": to
    }
  }

  const getFormResults = (formEntries, offset) => {
    const entries = formEntries || []
    if (offset) {
      // update query with offset
      params.ExclusiveStartKey = offset;
    }
    return dynamoDoc.query(params).promise().then((result) => {
      const allFormEntries = entries.concat(result.Items);
      if (!result.LastEvaluatedKey) {
        return allFormEntries
      }
      console.log('Recusive call to next page of data')
      return getFormResults(allFormEntries, result.LastEvaluatedKey);
    })
  }

  getFormResults().then((items) => {
    return callback(null, {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(items)
    })
  }).catch((e) => {
    console.log(e)
    return callback(new Error('[500] Database error', e))
  })
}
