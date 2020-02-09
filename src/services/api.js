const soap = require("soap");

const baseUrl = {
  production: "https://www.scoresolv.com.br",
  homologation: "https://ec2-34-219-246-159.us-west-2.compute.amazonaws.com"
};
const authWsdl = "/Service/auth/wsdl";
const searchWsdl = "/Service/search/wsdl";

const responseType = "json";

const getToken = async (
  username,
  password,
  env = "production",
  flowContext
) => {
  try {
    const authClient = await soap.createClientAsync(
      `${baseUrl[env]}${authWsdl}`
    );
    const response = await authClient.authAsync({
      username,
      password,
      responseType
    });
    const token = JSON.parse(response[0].return.$value).Success.Token;
    flowContext.set("resolvToken", token);
    return token;
  } catch (error) {
    console.log(error);
    return { error: "Falha ao realizar a autenticação" };
  }
};

const getClient = async (env = "production", flowContext) => {
  const client = await soap.createClientAsync(`${baseUrl[env]}${searchWsdl}`);
  flowContext.set("resolvWsdlClient", client);
  flowContext.set("environment", env);
  return client;
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
