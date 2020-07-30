const orderMgr = require('./lib/orderMgr/index.js')
module.exports = {
  version: function() {
    return "1.0.0"
  },
  orderMgr: orderMgr
}