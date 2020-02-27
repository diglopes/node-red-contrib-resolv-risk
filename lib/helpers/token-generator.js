const soapService = require('../soap-service')

module.exports = async (url, { username, password }) => {
  const responseType = 'json'
  const client = await soapService.createClient(url)
  const response = await client.authAsync({ username, password, responseType })
  return JSON.parse(response[0].return.$value).Success.Token
}
