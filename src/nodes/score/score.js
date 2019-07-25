const { request } = require("../../services/api");
const { checksFlowToken, checksFlowSoapClient } = require("../../helpers/flow");

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
        const flow = node.context().flow;
        let token = await checksFlowToken(flow, username, password);
        let client = await checksFlowSoapClient(flow);

        if (typeof token === "string") {
          node.status({ fill: "yellow", shape: "dot", text: "requesting" });
          const soapReturn = await request(client, token, cpf, valor, atraso);
          msg.payload = {
            ...msg.payload,
            score: {
              result: JSON.parse(soapReturn.return.$value),
              input: { cpf, valor, atraso }
            }
          };
        } else {
          msg.payload = { ...msg.payload, score: token };
        }

        node.status({});
        node.send(msg);
      } catch (error) {
        node.send(msg);
      }
    });
  }

  RED.nodes.registerType("score", Score);
};
