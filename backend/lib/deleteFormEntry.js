const dynamoDoc = require('./utils/dynamo')
const sendEmail = require('./utils/sendEmail')
const corsHeaders = require('./utils/cors')
const validateBody = require('./utils/validateBody')
const ENTRIES_TABLE = process.env.ENTRIES_TABLE
const FORMS_TABLE = process.env.FORMS_TABLE

/*
  Update forms table and form entries table on form submission
*/
module.exports = function deleteFormEntry(event, context, callback) {
  const body = JSON.parse(event.body)
  console.log('Deletion started', body)
  // for keeping lambda warm
  if (body && body.action === 'ping') {
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({
        pong: true,
      })
    })
  }

  // validate event body
  try {
    const requiredValues = ['formId', 'timestamp']
    validateBody(body, requiredValues)
  } catch (err) {
    return callback(err)
  }

  const formId = body.formId
  const timestamp = body.timestamp
  const updateTimestamp = Math.round(+new Date() / 1000)

  const entryParams = {
    TableName: ENTRIES_TABLE,
    Key: {
      formId: formId,
      timestamp: timestamp
    }
  }

  dynamoDoc.delete(entryParams).promise().then((d) => {
    const formParams = {
      TableName: FORMS_TABLE,
      Key: {
        formId: formId
      },
      UpdateExpression: 'SET #updated = :updated ADD #submissionCount :decriment',
      ExpressionAttributeNames: {
        '#updated': 'updated',
        '#submissionCount': 'submissionCount'
      },
      ExpressionAttributeValues: {
        ':decriment': -1,
        ':updated': updateTimestamp,
      },
      ReturnValues: 'ALL_NEW'
    }
    console.log('formParams', formParams)
    return dynamoDoc.update(formParams).promise().then((data) => {
      if (!data || !data.Attributes) {
        return callback(new Error('[500] Database error. No form Data'))
      }
      const formInfo = data.Attributes
      console.log('Form Submission count decrimented', formInfo.submissionCount)
      return callback(null, {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true
        })
      })
    })
  }).catch((e) => {
    console.log(e)
    return callback(new Error('[500] Database error', e))
  })
}
