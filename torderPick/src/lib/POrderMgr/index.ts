import * as I from '../interface'
import * as _ from 'lodash'
import { EEXIST } from 'constants'

/**
 * Pagoda ERP订单管理器
 */
export class OrderMgr implements I.OrderMgr{
  ords: I.IWOrder[]
  constructor() {
    this.ords = new Array()
  }
  private mergeOrder(dst: I.IWOrder, src: I.IWOrder): I.IOrderHandleResult {
    return {
      orderNo: dst.orderNo,
      errorCode: 1, /*拒绝接受*/
      msg: '重复订单'
    }
  }
  printBriefInfo() {
    console.log(`ordSum: ${this.ords.length}`)
  }
  addOrders(ords: I.IWOrder[]): I.IOrderHandleResult[] {
    var err: I.IOrderHandleResult[] = []
    ords.forEach(e => {
      let duplicate = _.find(this.ords, (o) => {return e.orderNo === o.orderNo})
      if (duplicate === undefined) {
        e.status = I.OrderStatus.new
        this.ords.push(e)
      } else {
        var res = this.mergeOrder(duplicate, e)
        if (res !== null && res.errorCode !== 0) {
          err.push(res)
        } // else merge OK
      }
    })
    return err
  }
  delOrder(orderNo: String): I.IWOrder {
    let res: I.IWOrder[] = _.dropWhile(this.ords, (e) => {
      return e.orderNo = orderNo
    })
    return res.length === 0 ? null : res[0]
  }
  /** 轮询符合条件的订单，并进行处理 */
  pollOrder(waveMgr: I.IWaveMgr): void {
    var unAllocOrds = _.filter(this.ords, (e ) => {
      return e.status === I.OrderStatus.new 
    })
    _.orderBy(unAllocOrds, ['orderTime'], ['desc'])
    _.forEach(unAllocOrds, e => {
      return waveMgr.pollNewOrder(e)
    })
    /*_.chain(this.ords)
      .filter((e ) => {
        return e.status === I.OrderStatus.new 
      })
      .orderBy(['orderTime'], ['desc'])
      .forEach(e => {
        return waveMgr.pollNewOrder(e)
      })*/
  }
}