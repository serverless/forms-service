const dynamoDoc = require('./utils/dynamo')
const corsHeaders = require('./utils/cors')
const FORMS_TABLE = process.env.FORMS_TABLE

/* Get list of forms */
module.exports = function getForms(event, context, callback) {
  let params = {
    TableName: FORMS_TABLE
  }
  // recursive lookup. TODO reformat into paginated calls via UI
  const getAllForms = (forms, offset) => {
    const formList = forms || []
    if (offset) {
      // update scan with offset
      params.ExclusiveStartKey = offset
    }
    return dynamoDoc.scan(params).promise().then((result) => {
      const allForms = formList.concat(result.Items)
      if (!result.LastEvaluatedKey) {
        return allForms
      }
      console.log('Recusive call to next page of forms')
      return getAllForms(allForms, result.LastEvaluatedKey)
    })
  }

  getAllForms().then((forms) => {
    return callback(null, {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(forms)
    })
  }).catch((e) => {
    console.log(e)
    return callback(new Error('[500] Database error', e))
  })
}
