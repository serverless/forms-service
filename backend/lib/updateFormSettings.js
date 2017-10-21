const dynamoDoc = require('./utils/dynamo')
const corsHeaders = require('./utils/cors')
const validateBody = require('./utils/validateBody')
const FORMS_TABLE = process.env.FORMS_TABLE

module.exports = function updateFormSettings(event, context, callback) {
  const body = JSON.parse(event.body)
  // validate event body
  try {
    const requiredValues = ['formId', 'emails']
    validateBody(body, requiredValues)
  } catch (err) {
    return callback(err)
  }

  const params = {
    TableName: FORMS_TABLE,
    Key: {
      formId: body.formId
    },
    // Update or create items
    UpdateExpression: 'SET #notify = :notify',
    ExpressionAttributeNames: {
      '#notify': 'notify',
    },
    ExpressionAttributeValues: {
      ':notify': body.emails,
    },
    ReturnValues: 'UPDATED_NEW'
  }

  dynamoDoc.update(params).promise().then((data) => {
    return callback(null, {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        success: true,
        data: data
      })
    })
  }).catch((e) => {
    console.log(e)
    return callback(new Error('[500] Database error', e))
  })
}
