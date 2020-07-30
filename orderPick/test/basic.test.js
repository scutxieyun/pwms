const PickOrder = require("../index.js")
test("版本检查", () => {
  console.log(PickOrder.version())
  return
})
test('追加订单', () => {
  console.log(PickOrder.orderMgr.append([{
    orderNo: "123455",
    detailId: '213232',
    status:'待分配'
  }]))
  console.log(PickOrder.orderMgr.append([{
    orderNo: "123455",
    detailId: '213232',
    status:'待分配'
  }]))
  return
})