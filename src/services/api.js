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

const request = async (client, token, tipoConsulta, body) => {
  const entries = Object.entries(body);
  return client
    .searchByDadosAsync({
      token,
      dadosConsulta: `
         <consulta>
           <dados>
             ${entries.map(item => {
               return `<${item[0]}>${item[1]}</${item[0]}>`;
             })}
           </dados>
         </consulta>
       `,
      tipoConsulta,
      responseType
    })
    .then(res => {
      const [soapReturn] = res;
      return soapReturn;
    });
};

module.exports = { getToken, request, getClient };
