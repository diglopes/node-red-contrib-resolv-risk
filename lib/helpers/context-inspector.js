/**
 * Objetivo do context-inspector: verificar se o contexto
 * ja possui uma copia valida do item buscado de
 * acordo com o metodo utilizado e ambiente.
 *
 * @typedef context
 * @property {object} - Contexto a ser avaliado
 */

/**
  * Verifica se ja existe um token valido no contexto
  * @param {Context} flowContext - Contexto do node-red
  * @param {string} env - Ambiente a ser verificado
  * @return {bool} - Existe ou não
  */
const flowHasToken = (flowContext, env) => {
  return (
    !!flowContext.get('resolvToken') && flowContext.get('environment') === env
  )
}
/**
  * Verifica se ja existe um Cliente soap valido no contexto
  * @param {Context} flowContext - Contexto do node-red
  * @param {string} env - Ambiente a ser verificado
  * @return {bool} - Existe ou não
  */
const flowHasClient = (flowContext, env) => {
  return (
    !!flowContext.get('resolvWsdlClient') &&
    flowContext.get('environment') === env
  )
}

module.exports = { flowHasToken, flowHasClient }
