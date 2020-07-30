const { importOrderExcel } = require("./tools/excel2ord.js")
const { timeFormat } = require('../lib/common/utils.js')
const { erp2DetailGroup } = require('../lib/common/orderTools.js')
const _c = require("lodash/collection")
const _a = require("lodash/array")
const _s = require("lodash/seq")
const _ = require('lodash');
const PickOrder = require("../index.js")
var res = importOrderExcel(`${process.cwd()}\\test\\testdata\\orders.xls`,1)
var ords = []
if (res.resultCode === '0') {
  ords = res.data
}
var d = new Date()
d.setTime(d - 100* 60*1000)
ords.forEach(o => {
  var f = new Date(d)
  f.setTime(f - Math.floor((Math.random() * 10000)))
  o.orderTime = timeFormat(f)
})
var erpOrds = erp2DetailGroup(ords)
console.log(erpOrds)
test('追加订单', () => {
  console.log(_.take(erpOrds, 10))
  console.log(PickOrder.orderMgr.append(erpOrds))
  return
})

test('测试lodash功能', () => {
})
