const {
  flowHasToken,
  flowHasClient
} = require("../../helpers/contextInspector");
const { getClient, getToken, request } = require("../../services/api");

module.exports = function(RED) {
  function Score(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on("input", async msg => {
      try {
        if (!msg.data) {
          msg.data = msg.payload;
          msg.payload = {};
        }

        const { username, password, cpf, atraso, valor } = msg.data;
        const flowContext = node.context().flow;
        const tipoConsulta = "score";
        const body = {
          cpf,
          valor,
          atraso
        };

        flowHasClient(flowContext, node.environment)
          ? (client = flowContext.get("resolvWsdlClient"))
          : (client = await getClient(node.environment, flowContext));

        flowHasToken(flowContext, node.environment)
          ? (token = flowContext.get("resolvToken"))
          : (token = await getToken(
              username,
              password,
              node.environment,
              flowContext
            ));

        flowContext.set("environment", "production");

        if (typeof token === "string") {
          node.status({ fill: "yellow", shape: "dot", text: "requesting" });
          const soapReturn = await request(client, token, tipoConsulta, body);
          msg.payload = {
            ...msg.payload,
            score: {
              result: JSON.parse(soapReturn.return.$value),
              input: body
            }
          };
        } else {
          msg.payload = { ...msg.payload, score: token };
        }

        node.status({});
        node.send(msg);
      } catch (error) {
        node.error(error);
        node.send(msg);
      }
    });
  }

  RED.nodes.registerType("score", Score);
};
