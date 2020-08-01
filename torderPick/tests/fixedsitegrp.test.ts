import { FixedSiteGrpSchedule } from "../src/lib/FixedSiteGrpSchedule"
import { getOrds } from './ord.tool'
const _Mock_FixedSiteGrp = [
  {
    id: '10203',
    sites: [
      {code:'1054'}, {code:'1050'}, {code:'1048'}, {code:'1049'}
    ]
  },
  {
    id: '10201',
    sites: [
      {code:'1085'}, {code: '1452'}, {code:'1767'}, {code:'1447'}, {code:'1348'}
    ]
  }
]

var schedule = new FixedSiteGrpSchedule(_Mock_FixedSiteGrp)
schedule.orderMgr.addOrders(getOrds(`${process.cwd()}\\tests\\testdata\\orders.xls`))
test('进行组波', () => {
  schedule.refresh()
  expect(schedule.waveMgr.waves.length).toBeGreaterThan(1)
})
