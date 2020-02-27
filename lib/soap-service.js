/**
 * Objetivo do soap-service: gerenciar os metodos com
 * contato direto com os Web Services a partir de uma lib
 * que se comunique via soap.
 */

const soap = require('soap')

module.exports = {
  /**
   * @typedef SoapClient
   * @property {object} - Metodos disponiveis no wsdl provido
   *
   * @typedef WSResponse
   * @property {object} - Resposta de uma requisicao
   */

  /**
   * Cria um client soap
   * @param {string} url - Endereco url do wsdl a ser utilizado.
   * @return {Promise<SoapClient>} - Client soap.
   */
  async createClient (url) {
    const client = await soap.createClientAsync(url)
    return client
  },
  /**
   *
   * @param {SoapClient} client - Cliente soap
   * @param {string} token - Token de acesso ao Web Service
   * @param {Object} payload - Dados de entrada da requisicao
   * @param {string} searchType - Nome do tipo de busca no Web Service
   * @return {WSResponse} - Resposta de uma pesquisa
   */
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
