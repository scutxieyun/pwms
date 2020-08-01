const XLSX = require('xlsx')
const _ = require('lodash');

exports.getERP2Ords = function(p) {
  let res = importOrderExcel(p)
  var ords = []
  if (res.resultCode === '0') {
    ords = erp2DetailGroup(res.data)
  }
  return ords
}  
function importOrderExcel(p, version) {
  const workbook = XLSX.readFile(p)
  const firstSheetName = workbook.SheetNames[0]
  const worksheet = workbook.Sheets[firstSheetName]
  const res = parseERP2Order(worksheet)
  return res
  //  }
  //})
}
function parseERP2Order(worksheet) {
  const range = XLSX.utils.decode_range(worksheet['!ref'])
  if (range.e.r < 2 || range.e.c < 12) {
    return {
      'result': 'error',
      'msg': '工作表内容不够'
    }
  }
  const orders = []
  const cell = worksheet[XLSX.utils.encode_cell({ c: 0, r: 1 })]
  const cell2 = worksheet[XLSX.utils.encode_cell({ c: 2, r: 1 })]
  if (!(cell && cell.t && (XLSX.utils.format_cell(cell) === '订单号' || XLSX.utils.format_cell(cell) === '提货单号'))) {
    return {
      'resultCode': '500',
      'msg': '工作表格式不对，首列第一行必须为文字 订单号 或者 提货单号'
    }
  }
  if (!(cell2 && cell2.t && XLSX.utils.format_cell(cell2) === '外部订单号')) {
    return {
      'resultCode': '500',
      'msg': '工作表格式不对，首列第三列必须为文字 外部订单号'
    }
  }
  let R
  const logs = []
  const specialOrds = []
  const sitesWithFruit = new Map()
  const cdPattern = /(\d+)-(\d+)-(\d+)/
  for (R = 2; R <= range.e.r; ++R) {
    var forcePagoda = false
    const o = {
      orderNo: _getCellString(worksheet, 0, R, "0").toString(), // 将提货单当成订单号
      detailId: _getCellString(worksheet, 6, R, "0").toString(), // 详情id
      auxInfo: [_getCellString(worksheet, 1, R, "0").toString(), // 原始订单号
        _getCellString(worksheet, 9, R, "0").toString()], // 库房
      siteCode: _getCellString(worksheet, 3, R, "0").toString(),
      siteName: _getCellString(worksheet, 4, R, "错误"),
      itemCode: _getCellString(worksheet, 7, R, '0').toString(),
      itemName: _getCellString(worksheet, 8, R, '错误').trim(),
      itemQuantity: Number(_getCellString(worksheet, 12, R, 0)),
      itemUnit: _getCellString(worksheet, 11, R, 'Unknown'),
      arriveTime: _getCellString(worksheet, 5, R, 'Unknown').replace(/\//g, '-'),
      itemGWeight: Number(_getCellString(worksheet, 13, R, 0)), // 先读出来是单位重量
      remark: (_getCellString(worksheet, 15, R, '')),
      siteAddress: 'Unknown', // _getCellString(worksheet, 9, R, 'Unknown'),
      siteCord: {
        'longtitude': '0', // _getCellString(worksheet, 10, R, '0'),
        'latitude': '0' // _getCellString(worksheet, 11, R, '0')
      }
    }
    o.itemGWeight = o.itemGWeight * o.itemQuantity // 为了代码少改动
    if (o.orderNo !== '0') {
      var m = o.arriveTime.match(cdPattern)
      if (m !== null && m.length >= 4) {
        //规范期望配送时间
        o.arriveTime = ('0000' + m[1]).slice(-4) + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[3]).slice(-2)
      }
      orders.push(o)
    }
  }
  return {
    'resultCode': '0',
    'data': orders,
    'logs': logs
  }
}
function _getCellString(worksheet, c, r, _default) {
  let res = undefined
  const cell = worksheet[XLSX.utils.encode_cell({ c: c, r: r })]
  if (cell && cell.t) {
    res = cell.v // XLSX.utils.format_cell(cell)
    if (cell.t === 'n') { res = cell.w } // 为了读出时间
  }
  return res ? res : _default
}


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