import * as I from '../interface'
import {format} from 'date-fns'
import * as _ from 'lodash'
import { getLogger } from '../commons/logger'
var logger = getLogger()
interface SiteLoc {
  code: string
}
export interface SiteGroup {
  id: string,
  sites: Array<SiteLoc>
}
/**
 * 固定门店组波次管理
 */
export class FixedSiteGrpWaveMgr implements I.IWaveMgr {
  waves: I.IWave[];
  siteGrps: Array<SiteGroup>; 
  waveNoPrefix: string;
  /**
   * 检索每个波次，试着将订单分配下去，返回false，指示不需要再扫描
   * @param ord 未分配订单
   */
  pollNewOrder(ord: I.IWOrder): boolean {
    var res:boolean = false
    _.forEach(this.waves, w => {
      res = w.tryAdd(ord)
      return !res //如果分配成功，则停止检索
    })
    return true //即使这个订单没有加入，都需要检索剩下的订单，所以，不能返回false
  }
  constructor(grps: Array<SiteGroup>) {
    this.siteGrps = grps
    this.waves = []
    this.waveNoPrefix = format(Date.now(), 'yyLLddhhmm')
    grps.forEach(g => {
      this.waves.push(new FixedSiteWave(this.waveNoPrefix + g.id, g))
    })
  }
}

class FixedSiteWave implements I.IWave {
  id: string;
  orders: I.IWOrder[];
  siteGrp: SiteGroup;
  isFull(): boolean {
    return false // 固定位置，永远不会满
  }
  tryAdd(ord: I.IWOrder): boolean {
    var s = _.find(this.siteGrp.sites, (s) => { return s.code === ord.siteCode })
    if (s !== undefined) {
      logger.info(`${ord.orderNo} is allocated to ${this.id}`)
      this.orders.push(ord)
      ord.status = I.OrderStatus.waved
      ord.waveNo = this.id
      return true
    }
    return false
  }
  constructor(id: string, grp: SiteGroup) {
    this.id = id
    this.siteGrp = grp
    this.orders = []
  }
}
