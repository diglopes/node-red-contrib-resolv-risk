const { getToken, getClient } = require("../services/api");

const checksFlowToken = async (flowContext, username, password, env) => {
  let token;
  if (!flowContext.get("resolvToken") || flowContext.get('environment') !== env) {
    token = await getToken(username, password, env);
    if(!token.error) {
      flowContext.set('environment', env)
      flowContext.set("resolvToken", token);
    }
  } else {
    token = flowContext.get("resolvToken");
  }
  return token;
};

const checksFlowSoapClient = async (flowContext, env) => {
  let client;
  if (!flowContext.get("resolvWsdlClient") || flowContext.get('environment') !== env) {
    client = await getClient(env);
    flowContext.set("resolvWsdlClient", client);
  } else {
    client = flowContext.get("resolvWsdlClient");
  }
  return client;
};

module.exports = { checksFlowSoapClient, checksFlowToken };
