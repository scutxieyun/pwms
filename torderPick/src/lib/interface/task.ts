/**
 * 拣选任务，表示作业人员一次完整的动作
 */
export interface ITask {
  itemCode: String //拣取的商品代码
  itemName: String //商品名称
  itemBatchId: String //本次动作商品的批次信息
  from: {
    type: ILocType
    id: String
  },
  to: {
    type: ILocType
    id: string
  },
  quantity: number
  unit: string
  gWeight: number
  referToOrder: {
    orderNo: string,
    detailId: string,
    waveNo: string
  },
  seq: number //执行顺序
}

/**
 * 一个任务，是将某个商品进行搬运，从一个位置，移到另一个位置
 */
export enum ILocType {
  pallet = 1, //托盘
  orderContainer, //订单容器
  storeLoc, //货位
  stagingArea //中转货位
}