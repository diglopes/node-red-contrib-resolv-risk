const {
  flowHasToken,
  flowHasClient
} = require("../../helpers/contextInspector");
const { getClient, getToken, request } = require("../../services/api");

module.exports = function(RED) {
  function ConsultaReceita(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.environment = config.environment;

    node.on("input", async msg => {
      try {
        if (!msg.data) {
          msg.data = msg.payload;
          msg.payload = {};
        }

        let client;
        let token;
        const flowContext = node.context().flow;
        const { username, password, cpf, dt_nasc: data_nasc } = msg.data;
        const tipoConsulta = "consulta_situacao_cpf";
        const body = {
          cpf,
          data_nasc
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

        if (typeof token === "string") {
          node.status({ fill: "yellow", shape: "dot", text: "requesting" });
          const soapReturn = await request(client, token, tipoConsulta, body);
          msg.payload = {
            ...msg.payload,
            "consulta-receita": {
              result: JSON.parse(soapReturn.return.$value),
              input: body
            }
          };
        } else {
          msg.payload = { ...msg.payload, "consulta-receita": token };
        }

        node.status({});
        node.send(msg);
      } catch (error) {
        node.error(error);
        node.send(msg);
      }
    });
  }

  RED.nodes.registerType("consulta-receita", ConsultaReceita);
};
