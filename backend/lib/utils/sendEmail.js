const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = function sendEmail(to, formData, callback) {

  var render = ''
  Object.keys(formData).map((field) => {
    render += field + ": " + formData[field] + " <br/>"
  })

  const emailContent = `<html>
<body>
  <p>New Form submission</p>
  ${render}
</body>
</html>
`

  const fromEmail = 'contact@serverless.com'
  const replyTo = formData.email || 'no-reply@serverless.com'
  const subject = `New submission on form ${formData.formId}`

  console.log('to', to)

  const msg = {
    to: to,
    from: fromEmail,
    replyTo: replyTo,
    subject: subject,
    html: emailContent,
  }
  sgMail.sendMultiple(msg, function (error, response) {
    if (error) {
      console.log('Sendgrid error response received', error)
    }
    return callback(error, response)
  })
}
