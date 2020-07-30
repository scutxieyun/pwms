
function Map2Array(m) {
  const res = []
  m.forEach((i) => {
    res.push(i)
  })
  return res
}
function arrivalTime4Today() {
  const d = new Date()
  if (d.getHours() > 15) {
    // 晚上8点后，就算明天8点
    return d.getFullYear().toString() + '-' + (d.getMonth() + 1).toString() + '-' + (d.getDate() + 1).toString() + ' 08:00:00'
  }
  return d.getFullYear().toString() + '-' + (d.getMonth() + 1).toString() + '-' + d.getDate().toString() + ' ' + (d.getHours() + 8).toString() + ':00:00'
}

/* 将几个时间转换都放在一起 */
exports.getShortTimeStamp = function(_d, _level) {
  const d = _d === undefined ? new Date() : _d
  const level = _level === undefined ? 0 : _level
  if (level === 1) {
    return d.getFullYear().toString() +
    ('0' + (d.getMonth() + 1).toString()).slice(-2) +
    ('0' + d.getDate().toString()).slice(-2)
  }
  // todo, 不纠结这个小问题，这个系统数据用保存100年？
  return (d.getFullYear() - 2000).toString() +
        ('0' + (d.getMonth() + 1).toString()).slice(-2) +
        ('0' + d.getDate().toString()).slice(-2) +
        ('0' + d.getHours().toString()).slice(-2) + ('0' + d.getMinutes().toString()).slice(-2) + ('0' + d.getSeconds().toString()).slice(-2)
}

let tempLineId = 0
function tempLineidGet(dc, remark) {
  tempLineId++
  return getTempLinePrefix(dc, remark) + '_' + ('000' + tempLineId.toString()).slice(-3)
}

let wmsPickCmdNo = 0
function wmnPickCmdNoGet(prefix) {
  wmsPickCmdNo++
  return prefix + wmsPickCmdNo.toString()
}

const warehouseMap = new Map([
  ['szpszx+PAGODA', { code: 'szxgk', id: '01' }],
  ['gzpszx+PAGODA', { code: 'gzxgk', id: 'A2' }],
  ['whpszx+PAGODA', { code: 'whxgk', id: '04' }],
  ['xmpszx+PAGODA', { code: 'xmxgk', id: '17' }],
  ['kfpszx+PAGODA', { code: 'kfxgk', id: '99' }],
  ['mdcs1+PAGODA', { code: 'uuxgk', id: '99' }]
])
exports.getWarehouseAddition = function(dc, remark) {
  if (remark === undefined) {
    remark = 'PAGODA'
  }
  const res = warehouseMap.get(dc + '+' + remark)
  if (res === undefined) return { code: 'test', id: '255' }
  return res
}
function getTempLinePrefix(dc, remark) {
  const res = warehouseMap.get(dc + '+' + remark)
  if (res === undefined) return 'L255'
  let prefix = res.id
  if (prefix.indexOf('A') !== -1) {
    prefix = prefix.replace('A', '')
  }
  return 'L' + prefix
}
const warehourReverseMap = new Map([
  ['whxgk', { dccode: 'whpszx', remark: 'PAGODA' }],
  ['gzxgk', { dccode: 'gzpszx', remark: 'PAGODA' }],
  ['whggk', { dccode: 'whpszx', remark: 'FXG' }],
  ['gzggk', { dccode: 'gzpszx', remark: 'FXG' }],
  ['szxgk', { dccode: 'szpszx', remark: 'PAGODA' }],
  ['xmxgk', { dccode: 'xmpszx', remark: 'PAGODA' }],
  ['kfxgk', { dccode: 'kfpszx', remark: 'PAGODA' }],
  ['uuxgk', { dccode: 'mdcs1', remark: 'PAGODA' }]
])

exports.getWarehouseInfo = function(warehouseId) {
  const res = warehourReverseMap.get(warehouseId)
  if (res === undefined) return { dccode: 'test', remark: 'PAGODA' }
  return res
}
/*
  1.发车波次字段为排线系统固定线路表内部定义字段，不能作为WMS系统打印单据生成的波次计划，WMS所需波次计划规则为W+年份+月份+日+0001，点击推送WMS即生成一个新得波次号，日清空重置
  2.WMS系统还需接收排线系统”波次1“，”波次2“，”波次3"此固定线路得波次号信息，WMS只做存储，将此波次号接收后打印在拣货单上即可。
*/
let curWaveIndex = 0
function refineWaveNo() {
  curWaveIndex++
  const res = ('000' + curWaveIndex.toString()).slice(-4)
  return res
}
/* 判断商品是不是果汁 */
exports.isFruit =  function(code, name) {
  return (code.match(/^2.*$/) !== null && name.indexOf('汁') !== -1) ||
        (code.match(/^3.*$/) !== null)
}

function dayFormat(d) {
  if (d === undefined) d = new Date()
  return d.getFullYear().toString() + '-' +
        ('0' + (d.getMonth() + 1).toString()).slice(-2) + '-' +
        ('0' + d.getDate().toString()).slice(-2)
}
function timeFormat(d) {
  if (d === undefined) d = new Date()
  return dayFormat(d) + ' ' +
    ('0' + d.getHours().toString()).slice(-2) + ':' +
    ('0' + d.getMinutes().toString()).slice(-2) + ':' +
    ('0' + d.getSeconds().toString()).slice(-2)
}
exports.timeFormat = timeFormat

exports.now = function() {
  return timeFormat()
}
exports.zeroOfToday = function() {
  return dayFormat(undefined) + ' 00:00:00'
}
exports.today = function() {
  return dayFormat()
}
exports.dayOfTomorrow = function (_d) {
  let d = new Date()
  if (_d !== undefined) {
    if (typeof(_d) === 'string') {
      d = new Date(_d)
    }
  }
  d.setTime(d.getTime()+24*60*60*1000)
  d = dayFormat(d)
  return d
}
/**向后退一段时间 但不能跨天*/
exports.backoffSome = function (p, ms) {
  let d = new Date(p)
  let nd = new Date()
  nd.setTime(d.getTime() - ms)
  if (d.getDate() !== nd.getDate()) {
  //跨天了，就不推了
    return d.getFullYear().toString() + '-' +
      ('0' + (d.getMonth() + 1).toString()).slice(-2) + '-' +
      ('0' + (d.getDate()).toString()).slice(-2) + ' 00:00:00'
  } else {
    return nd.getFullYear().toString() + '-' +
      ('0' + (nd.getMonth() + 1).toString()).slice(-2) + '-' +
      ('0' + (nd.getDate()).toString()).slice(-2) + ' ' + 
      ('0' + nd.getHours().toString()).slice(-2) + ':' + 
      ('0' + nd.getMinutes().toString()).slice(-2) + ':' +
      ('0' + nd.getSeconds().toString()).slice(-2)
  }
}