const dynamoDoc = require('./utils/dynamo')
const sendEmail = require('./utils/sendEmail')
const corsHeaders = require('./utils/cors')
const sanitizeValues = require('./utils/sanitize')
const validateBody = require('./utils/validateBody')
const ENTRIES_TABLE = process.env.ENTRIES_TABLE
const FORMS_TABLE = process.env.FORMS_TABLE

/*
  Update forms table and form entries table on form submission
*/
module.exports = function handleFormSubmission(event, context, callback) {
  console.log(event.headers.origin)
  console.log(context)
  const body = JSON.parse(event.body)
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
    const requiredValues = ['formId', 'fields']
    validateBody(body, requiredValues)
  } catch (err) {
    return callback(err)
  }

  const formId = body.formId
  const fields = sanitizeValues(body.fields)
  const timestamp = Math.round(+new Date() / 1000)

  const params = {
    TableName: FORMS_TABLE,
    Key: {
      formId: formId
    },
    UpdateExpression: 'SET #updated = :updated, #created = if_not_exists(#created, :created) ADD #submissionCount :incr',
    ExpressionAttributeNames: {
      '#updated': 'updated',
      '#created': 'created',
      '#submissionCount': 'submissionCount'
    },
    ExpressionAttributeValues: {
      ':incr': 1,
      ':created': timestamp,
      ':updated': timestamp,
    },
    ReturnValues: 'ALL_NEW'
  }

  dynamoDoc.update(params).promise().then((data) => {
    if (!data || !data.Attributes) {
      return callback(new Error('[500] Database error. No form Data'))
    }
    const formInfo = data.Attributes
    console.log('Form Submission count', formInfo.submissionCount)

    // Now Save data to form entries table
    const formEntry = Object.assign({}, {
      formId: formId,
      timestamp: timestamp,
    }, fields)

    console.log('formEntry', formEntry)

    const entryParams = {
      TableName: ENTRIES_TABLE,
      Item: formEntry
    }

    return dynamoDoc.put(entryParams).promise().then((d) => {
      // then send email
      if (formInfo && formInfo.notify) {
        const emails = formInfo.notify
        if (emails) {
          // TODO: split emails at comma
          sendEmail(emails, formEntry, (err, response) => {
            if (err) {
              return callback(err)
            }
            return callback(null, {
              statusCode: 200,
              headers: corsHeaders,
              body: JSON.stringify({
                success: true,
                data: d
              })
            })
          })
        }
      }
      // return and send no emails
      return callback(null, {
        statusCode: 200,
        headers: corsHeaders,
        body: JSON.stringify({
          success: true,
          data: d
        })
      })
    })
  }).catch((e) => {
    console.log(e)
    return callback(new Error('[500] Database error', e))
  })
}
