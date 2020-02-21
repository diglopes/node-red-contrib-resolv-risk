const flowHasToken = (flowContext, env) => {
  return (
    !!flowContext.get('resolvToken') && flowContext.get('environment') === env
  )
}

const flowHasClient = (flowContext, env) => {
  return (
    !!flowContext.get('resolvWsdlClient') &&
    flowContext.get('environment') === env
  )
}

module.exports = { flowHasToken, flowHasClient }
