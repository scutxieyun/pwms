import { OrderMgr } from '../src/lib/POrderMgr'
import { getERP2Ords } from "../src/tools/excel2ord/index"
import { getOrds } from './ord.tool' 
let orderMgr = new OrderMgr()
test('增加一个假订单', () => {
  orderMgr.addOrders([{
    orderNo: "1234",
    siteCode: "asdfsd",
    siteName: "asdfsadf",
    orderTime: '2020-03-23',
    details: []
  }])
});
test('验证重复订单检查', () => {
  orderMgr.addOrders([{
    orderNo: "123423",
    siteCode: "asdfsd2",
    siteName: "asdfsadf",
    orderTime: '2020-03-23',
    details: []
  }])
  var res = (orderMgr.addOrders([{
    orderNo: "123423",
    siteCode: "asdfsd2",
    siteName: "asdfsadf",
    orderTime: '2020-03-23',
    details: []
  }]))
  expect(res.length).toBe(1)
  expect(res[0]).toHaveProperty('errorCode', 1);
})
test('excel导入订单', () => {
  orderMgr.addOrders(getOrds(`${process.cwd()}\\tests\\testdata\\orders.xls`));
})

