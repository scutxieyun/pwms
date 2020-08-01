import * as I from '../interface'
import * as _ from 'lodash'
import { format } from 'date-fns'
import { getLogger } from '../commons/logger'
let logger = getLogger()
interface FIFOWaveStrategy {
  ordSum: Number
}
/**
 * 基于先入先出的调度
 */
export class FiFOWaveMgr implements I.IWaveMgr {
  waves: I.IWave[]
  curWave: I.IWave
  strategy: FIFOWaveStrategy
  waveNoPrefix: string
  constructor(strategy: FIFOWaveStrategy) {
    this.waves = []
    this.curWave = null
    this.strategy = strategy
    this.waveNoPrefix = format(Date.now(), 'yyLLddhhmm')
  }
  /**
   * 将这个订单安排到波次中
   * @param ord 待分配订单
   */
  pollNewOrder(ord: I.IWOrder): boolean {
    if (this.curWave === null || this.curWave.isFull()) {
      this.curWave = this.createNewWave()
    }
    if (this.curWave.tryAdd(ord) === false) {
      this.waves.push(this.curWave)
      this.curWave = this.createNewWave()
      return this.curWave.tryAdd(ord)
    }
    return true
  }
  private createNewWave(): I.IWave {
    return new FWave(this.waveNoPrefix + (this.waves.length + 1 + '000').slice(-3), this.strategy.ordSum)
  }
}

class FWave implements I.IWave {
  id: String;
  orders: I.IWOrder[];
  maxOrdSum: Number
  isFull(): boolean {
    if (this.orders.length > this.maxOrdSum) {
      return true
    }
    return false
  }
  tryAdd(ord: I.IWOrder): boolean {
    if (this.orders.length < this.maxOrdSum) {
      this.orders.push(ord)
      ord.waveNo = this.id
      ord.status = I.OrderStatus.waved
      return true
    }
    return false
  }
  constructor(id: string, ordSum?: Number) {
    this.id = id;
    this.orders = []
    this.maxOrdSum = ordSum === null ? 16 : ordSum
    logger.info(`FIFOwave ${id} is created`)
  }

}
