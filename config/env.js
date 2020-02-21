module.exports = (env) => {
  if (env === 'homologation') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
  }

  const baseUrl = {
    production: 'https://www.scoresolv.com.br/Service',
    homologation: 'https://ec2-34-219-246-159.us-west-2.compute.amazonaws.com/Service'
  }

  return {
    baseUrl: baseUrl[env],
    authWsdl: '/auth/wsdl',
    searchWsdl: '/search/wsdl'
  }
}
