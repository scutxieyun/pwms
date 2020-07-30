const _ = require('lodash');
function erp2DetailGroup(ords) {
  var i = _.groupBy(ords, 'orderNo')
  i = _.values(i)
  i = _.map(i, (s) => {
    //确保每一个逻辑订单都是一个创建时间
    if (s.length === 0) return null
    var ord = {
      orderNo: s[0].orderNo,
      siteCode: s[0].siteCode,
      siteName: s[0].siteName,
      arriveTime: s[0].arriveTime,
      orderTime: s[0].orderTime
    }
    ord.details = s.map(e => {
      return {
        itemCode: e.itemCode,
        itemName: e.itemName,
        itemQuantity: e.itemQuantity,
        itemUnit: e.itemUnit,
        itemGWeight: e.itemGWeight,
        remark: e.remark,
        detailId: e.detailId
      }
    })
    return ord
  })
  return i
}
module.exports.erp2DetailGroup = erp2DetailGroup