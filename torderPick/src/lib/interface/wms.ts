/**
 * 标准化WMS需要提供的功能
 */
export interface IWMS {
  /**
   * 获取指定商品的库位信息
   * @param itemCode 
   */
  getSuggestedStoreLoc(itemCode: string): StoreLoc
}
/**
 * 库位
 * @property {string} id 库位标识
 * @property {number} seq 库位拣选顺序
 */
export interface StoreLoc {
  id: string
  seq: number
  itemBatchs: ItemBatch[]
}
export interface ItemBatch {
  itemCode: string // 商品编号
  batchId: string // 批次号，理论上可以从批次信息获取itemCode，不过这样匹配太负责
  priority: number // 拣选优先级
}
