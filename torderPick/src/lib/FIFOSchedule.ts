import * as I from './interface'
import { OrderMgr } from './POrderMgr'
import { FiFOWaveMgr } from './waveMgr/FiFOWaveMgr'
export class FIFOSchedule {
  orderMgr: I.OrderMgr;
  waveMgr: FiFOWaveMgr
  constructor() {
    this.orderMgr = new OrderMgr()
    this.waveMgr = new FiFOWaveMgr({ordSum:20})
  }
  refresh(): void{
    this.orderMgr.pollOrder(this.waveMgr)
  }
}