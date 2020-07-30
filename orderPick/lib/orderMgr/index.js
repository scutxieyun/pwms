const _c = require("lodash/collection")
const _a = require("lodash/array")
/**
  订单列表
订单的状态管理，学习富勒的做法，0~99， 0-9，给到未组波阶段，10-19，给到组波阶段  
**/
function OrderList() {
  this.orderList = []
  this.waveMgr = undefined
}
const myOrderList = new OrderList()
module.exports = myOrderList
/**
追加订单
**/
OrderList.prototype.registWaveMgr = function(mgr) {
  this.waveMgr = mgr
}
OrderList.prototype.append = function(ords) {
  var logs = []
  var myself = this
  var added = false
  ords.forEach(o => {
    const savedOrd = myself.findOne(o)
    o.status = 1
    if (savedOrd !== undefined) {
      if (modifyAvailable(savedOrd.status)) {
        myself.updateOne(o)
        logs.push({
          action: '更新',
          data: infoDigest(o)
        })
        added = true
      } else {
        logs.push({
          action: '拒绝',
          data: infoDigest(o)
        })
      }
    } else {
      logs.push({
          action: '追加',
          data: infoDigest(o)
      })
      added = true
      myself.addOne(o)
    }
  })
  if (added && this.waveMgr !== undefined && this.waveMgr.hasOwnProperty('check')) {
    this.waveMgr.check('ords-comming')
  }
  return logs
}
OrderList.prototype.clean = function() {
  this.orderList = []
}
OrderList.prototype.addOne = function(o) {
  this.orderList.push(o)
}
OrderList.prototype.findOne = function(o) {
  return _c.find(this.orderList, (e) => {
    return o.orderNo === e.orderNo && o.detailId === e.detailId
  })
}
OrderList.prototype.updateOne = function(o) {
  const i = _a.findIndex(this.orderList, (e) => {
    return o.orderNo === e.orderNo && o.detailId === e.detailId
  })
  if (i !== -1) {
    this.orderList[i] = o
  }
}
OrderList.prototype.addOne = function(o) {
  this.orderList.push(o)
}
/**
  过滤订单，执行选取操作
**/
OrderList.prototype.groupAWave = function() {
  var wave = []
  _.chain(this.orderList)
    .filter(o => {
      return o.status < 10
    })
    .orderBy(['orderTime', 'siteCode'], ['asc', 'asc'])
    .forEach(o => {
      if (wave.length > 16) {
        return false
      }
      wave.push(o)
    })
}
function modifyAvailable(status){
  return status < 10
}
function infoDigest(o) {
  return `${o.orderNo} - ${o.siteCode} - ${o.siteName}`
}