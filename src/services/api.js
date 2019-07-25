const soap = require("soap");

const authWsdl = "https://www.scoresolv.com.br/Service/auth/wsdl";
const serviceWsdl = "https://www.scoresolv.com.br/Service/search/wsdl";
const responseType = "json";

const getToken = (username, password) => {
  return soap
    .createClientAsync(authWsdl)
    .then(client => {
      return client.authAsync({
        username,
        password,
        responseType
      });
    })
    .then(res => {
      return JSON.parse(res[0].return.$value).Success.Token;
    })
    .catch(err => {
      return { error: "Falha ao realizar a autenticação" };
    });
};

const getClient = () => {
  return soap.createClientAsync(serviceWsdl).then(client => client);
};

const request = async (client, token, cpf, valor, atraso) => {
  return client
    .searchByDadosAsync({
      token,
      dadosConsulta: `
         <consulta>
           <dados>
             <cpf>${cpf}</cpf>
             <valor>${valor}</valor>
             <atraso>${atraso}</atraso>
           </dados>
         </consulta>
       `,
      tipoConsulta: "score",
      responseType
    })
    .then(res => {
      const [soapReturn] = res;
      return soapReturn;
    });
};

module.exports = { getToken, request, getClient };
