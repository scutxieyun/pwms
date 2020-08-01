import * as I from './interface'
import { OrderMgr } from './POrderMgr'
import { FixedSiteGrpWaveMgr, SiteGroup } from './waveMgr/FixedSiteGrpWaveMgr'
export class FixedSiteGrpSchedule {
  orderMgr: I.OrderMgr;
  waveMgr: FixedSiteGrpWaveMgr
  constructor(siteGrps: Array<SiteGroup>) {
    this.orderMgr = new OrderMgr()
    this.waveMgr = new FixedSiteGrpWaveMgr(siteGrps)
  }
  refresh(): void{
    this.orderMgr.pollOrder(this.waveMgr)
  }
}