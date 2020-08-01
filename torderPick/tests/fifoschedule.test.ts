import { FIFOSchedule } from "../src/lib/FIFOSchedule"
import { getOrds } from './ord.tool'
var schedule = new FIFOSchedule()
schedule.orderMgr.addOrders(getOrds(`${process.cwd()}\\tests\\testdata\\orders.xls`))
test('进行组波', () => {
  schedule.orderMgr.printBriefInfo()
  schedule.refresh()
  expect(schedule.waveMgr.waves.length).toBeGreaterThan(1)
})
