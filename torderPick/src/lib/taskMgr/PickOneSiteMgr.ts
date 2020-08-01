import {IWave, IWOrdDetail} from '../interface'
import {IWMS} from '../interface/wms'
import {ITask, ILocType} from '../interface/task' 
import _ from 'lodash'
/**
 * 摘果法，一个店，一个店的进行摘果
 */
class PickPerSiteEng {
  wms: IWMS
  generateTask(wave: IWave): ITask[] {
    var tasks: ITask[] = []
    wave.orders.forEach(o => {
      o.details.forEach((element:IWOrdDetail) => {
        var loc = this.wms.getSuggestedStoreLoc(element.itemCode)
        if (loc !== undefined) {
          tasks.push({
            itemCode: element.itemCode,
            itemName: element.itemName,
            quantity: element.quanitity,
            unit: element.unit,
            gWeight: element.gWeight,
            from: {
              type: ILocType.pallet,
              id: loc.id
            },
            to: {
              type: ILocType.orderContainer,
              id: ""
            },
            referToOrder: {
              orderNo: o.orderNo,
              detailId: element.detailId,
              waveNo: o.waveNo
            },
            itemBatchId: loc.itemBatchs[0].batchId,
            seq: loc.seq
          })
        }
      });
    })
    return _.orderBy(tasks, ["referToOrder.orderNo", "seq"],["asc", "desc"])
  }
  constructor(wms: IWMS) {
    this.wms = wms
  }
}
