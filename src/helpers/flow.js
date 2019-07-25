const { getToken, getClient } = require("../services/api");

const checksFlowToken = async (flowContext, username, password) => {
  if (!flowContext.get("resolvToken")) {
    const token = await getToken(username, password);
    flowContext.set("resolvToken", token);
    return token;
  } else {
    const token = flowContext.get("resolvToken");
    return token;
  }
};

const checksFlowSoapClient = async flowContext => {
  if (!flowContext.get("resolvWsdlClient")) {
    const client = await getClient();
    flowContext.set("resolvWsdlClient", client);
    return client;
  } else {
    const client = flowContext.get("resolvWsdlClient");
    return client;
  }
};

module.exports = { checksFlowSoapClient, checksFlowToken };
