const {
  flowHasToken,
  flowHasClient
} = require("../../helpers/contextInspector");
const { getClient, getToken, request } = require("../../services/api");

module.exports = function(RED) {
  function ConsultaCadastral(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.environment = "production";

    node.on("input", async msg => {
      try {
        if (!msg.data) {
          msg.data = msg.payload;
          msg.payload = {};
        }

        let client;
        let token;
        const flowContext = node.context().flow;
        const { username, password, cpf, dt_nasc } = msg.data;
        const tipoConsulta = "enriquecimento";
        const body = {
          cpf,
          dt_nasc
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

        flowContext.set("environment", node.environment);

        if (typeof token === "string") {
          node.status({ fill: "yellow", shape: "dot", text: "requesting" });
          const soapReturn = await request(client, token, tipoConsulta, body);
          msg.payload = {
            ...msg.payload,
            "consulta-cadastral": {
              result: JSON.parse(soapReturn.return.$value),
              input: body
            }
          };
        } else {
          msg.payload = { ...msg.payload, "consulta-cadastral": token };
        }

        node.status({});
        node.send(msg);
      } catch (error) {
        node.error(error);
        node.send(msg);
      }
    });
  }

  RED.nodes.registerType("consulta cadastral", ConsultaCadastral);
};
