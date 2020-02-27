module.exports = function (RED) {
  function ResolvAuth (config) {
    RED.nodes.createNode(this, config)
    this.username = config.username
  }

  RED.nodes.registerType('resolv-auth', ResolvAuth, {
    credentials: {
      password: {
        type: 'password',
        required: true
      }
    }
  })
}
