const parseYaml = require('js-yaml')
const fs = require('fs')
const path = require('path')
const serverlessYAML = path.join(__dirname, 'serverless.yml')

function postDeploy(outputs) {
  const defaults = {
    ServiceEndpoint: 'http://testingurl.com'
  }
  const data = outputs || defaults
  // Get document, or throw exception on error
  try {
    const yaml = parseYaml.safeLoad(fs.readFileSync(serverlessYAML, 'utf8'))
    if (yaml && yaml.functions) {
      const functions = yaml.functions
      const API = Object.keys(functions).reduce((obj, functionName) => {
        const functionData = functions[functionName]
        if (functionData.events) {

          if (functionData.events.length > 1) {
            throw new Error(`${functionName} function has more than one url. You will need to alter the postDeploy script logic`)
          }

          const url = functionData.events.reduce((value, event) => {
            if (event.http) {
              return `${data.ServiceEndpoint}/${event.http.path}`
            }
          }, '')
          obj[functionName] = url
        }
        return obj
      }, {})
      // set API endpoints
      data.API = API
    }
    if (yaml && yaml.custom) {
      const config = yaml.custom
      if (!config.output || !config.output.file) {
        throw new Error(`No custom.output.file value found in serverless.yml`)
      }
      // console.log(config.output.file);
      const outputPath = path.resolve(config.output.file)
      // console.log('outputPath', outputPath)

      fs.writeFile(outputPath, JSON.stringify(data, null, 2), (err) => {
        if (err) throw err;
        console.log(`${config.output.file} has been saved!`);
      });
    }
  } catch (e) {
    console.log(e)
  }
  // write to file
  // console.log(data)
}

module.exports.handler = postDeploy
