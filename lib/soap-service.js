const soap = require('soap')

module.exports = {
  async createClient (url) {
    const client = await soap.createClientAsync(url)
    return client
  },
  async sendRequest (client, token, payload, searchType) {
    const fields = Object.entries(payload)
    const requestBody = {
      token,
      dadosConsulta: `
         <consulta>
           <dados>
             ${fields.map(field => {
               return `<${field[0]}>${field[1]}</${field[0]}>`
             })}
           </dados>
         </consulta>
       `,
      tipoConsulta: searchType,
      responseType: 'json'
    }
    const [soapReturn] = await client.searchByDadosAsync(requestBody)
    return JSON.parse(soapReturn.return.$value)
  }
}
