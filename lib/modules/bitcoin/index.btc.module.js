( () => {
  module.exports = {
    generate_address : require('./generate_address'),
    forward_btc : require('./forward_btc'),
    blockcypher_forward_btc : require('./forward_btc_blockcypher'),
    validate_address : require('./validate_address')
  }
})();