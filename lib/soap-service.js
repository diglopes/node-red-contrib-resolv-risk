const soap = require('soap')

module.exports = {
  async createClient (url) {
    const client = await soap.createClientAsync(url)
    return client
  }
}
