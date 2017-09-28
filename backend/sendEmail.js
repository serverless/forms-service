const sendGrid = require('sendgrid')
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY

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
  const helper = sendGrid.mail;
  const fromEmail = new helper.Email('contact@serverless.com');
  const toEmail = new helper.Email(to);
  const subject = `New submission on form ${formData.formId}`;
  const content = new helper.Content("text/html", emailContent)
  const mail = new helper.Mail(fromEmail, subject, toEmail, content);

  const sg = sendGrid(process.env.SENDGRID_API_KEY);
  const request = sg.emptyRequest({
    method: 'POST',
    path: '/v3/mail/send',
    body: mail.toJSON()
  });

  sg.API(request, function (error, response) {
    if (error) {
      console.log('Sendgrid error response received', error);
    }
    return callback(error, response);
  });
}
