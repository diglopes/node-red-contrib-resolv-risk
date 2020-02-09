const {
  flowHasToken,
  flowHasClient
} = require("../../helpers/contextInspector");
const { getClient, getToken, request } = require("../../services/api");

module.exports = function(RED) {
  function Obito(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on("input", async msg => {
      try {
        if (!msg.data) {
          msg.data = msg.payload;
          msg.payload = {};
        }

        const {
          username,
          password,
          cpf,
          nome,
          nm_mae,
          dt_nasc: dt_nsct,
          obito_completo
        } = msg.data;
        const tipoConsulta = obito_completo ? "completa" : "simples";
        const body = {
          cpf,
          nome,
          nm_mae,
          dt_nsct
        };
        const flowContext = node.context().flow;

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
            obito: {
              result: JSON.parse(soapReturn.return.$value),
              input: {
                ...body,
                modo: tipoConsulta
              }
            }
          };
        } else {
          msg.payload = { ...msg.payload, obito: token };
        }

        node.status({});
        node.send(msg);
      } catch (error) {
        node.error(error);
        node.send(msg);
      }
    });
  }

  RED.nodes.registerType("obito", Obito);
};
