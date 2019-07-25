const { request } = require("../../services/api");
const { checksFlowToken, checksFlowSoapClient } = require("../../helpers/flow");

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

        const flow = node.context().flow;
        const client = await checksFlowSoapClient(flow);
        const token = await checksFlowToken(flow, username, password);
        const tipoConsulta = obito_completo ? "completa" : "simples";
        const body = {
          cpf,
          nome,
          nm_mae,
          dt_nsct
        };

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
        node.send(msg);
      }
    });
  }

  RED.nodes.registerType("obito", Obito);
};
