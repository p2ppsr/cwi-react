// exports a function returning bridgeport resolvers for current ENV.
// Resolvers are undefined in prod.

export default () => window.ENV === 'dev'
  ? ['http://localhost:3103']
  : window.ENV === 'staging'
    ? ['https://staging-bridgeport.babbage.systems']
    : undefined
