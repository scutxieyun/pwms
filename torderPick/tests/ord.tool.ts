import { getERP2Ords } from "../src/tools/excel2ord/index"
import { timeFormat } from "../src/tools/utils/index"
export function getOrds(p: string): Array<any> {
  let ords:Array<any> = getERP2Ords(`${process.cwd()}\\tests\\testdata\\orders.xls`)
  setFakeOrderTime(ords)
  return ords
}
function setFakeOrderTime(ords: any[]) {
  var d:any = new Date()
  d.setTime(d - 100* 60*1000)
  ords.forEach(o => {
    var f:any = new Date(d)
    f.setTime(f - Math.floor((Math.random() * 10000)))
    o.orderTime = timeFormat(f)
  })
}

