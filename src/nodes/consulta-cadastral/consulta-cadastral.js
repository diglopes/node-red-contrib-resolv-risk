const { request } = require("../../services/api");
const { checksFlowToken, checksFlowSoapClient } = require("../../helpers/flow");

module.exports = function(RED) {
  function ConsultaCadastral(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on("input", async msg => {
      try {
        if (!msg.data) {
          msg.data = msg.payload;
          msg.payload = {};
        }
        const { username, password, cpf, dt_nasc } = msg.data;

        const flow = node.context().flow;
        const client = await checksFlowSoapClient(flow);
        const token = await checksFlowToken(flow, username, password);
        const tipoConsulta = "enriquecimento";
        const body = {
          cpf,
          dt_nasc
        };

        if (typeof token === "string") {
          node.status({ fill: "yellow", shape: "dot", text: "requesting" });
          const soapReturn = await request(client, token, tipoConsulta, body);
          msg.payload = {
            ...msg.payload,
            "consulta-cadastral": {
              result: JSON.parse(soapReturn.return.$value),
              input: { cpf }
            }
          };
        } else {
          msg.payload = { ...msg.payload, "consulta-cadastral": token };
        }

        node.status({});
        node.send(msg);
      } catch (error) {
        node.send(msg);
      }
    });
  }

  RED.nodes.registerType("consulta cadastral", ConsultaCadastral);
};
