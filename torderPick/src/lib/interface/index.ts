export interface IWOrders {
  [index: number]: IWOrder
}
export interface IWOrder {
  orderNo: string;
  siteCode: string;
  siteName: string;
  status?: OrderStatus 
  waveNo?: string; //订单被分配的波次，允许加入的订单没有波次，后续加入这个字段
  orderTime: string; //订单时间
  details: IWOrdDetail[];
}
/**
 * 订单明细
 */
export interface IWOrdDetail {
  detailId: string; // 明细编码
  itemCode: string; // 商品编码
  itemName: string;
  gWeight: number;
  unit: string;
  quanitity: number;
}

export interface OrderMgr{
  printBriefInfo(): any;
  addOrders(ords: IWOrders): IOrderHandleResult[];
  delOrder(ordNo: string): IWOrder;
  pollOrder(waveMgr: IWaveMgr): void
}
/**
  订单处理结果，主要用于返回调用方，某个订单处理结果，一般用于返回错误结果
  @property {string} orderNo 订单号
  @property {number} errorCode 错误编码
  @property {string} msg 错误信息
*/
export interface IOrderHandleResult {
  /**
   * 订单号
   */
  orderNo: string;
  /**
   * 处理结果编码
   */
  errorCode: number;
  /**结果信息 */
  msg: string
}

/**
 * 订单过滤函数，检查订单能否加入波次, 如果能分配就返回波次号
 */
export interface IOrderWaveAssign {
  (ord: IWOrder): boolean
}
/**
 * 波次管理类，当OMS有变化时，调用波次更新
 */
export interface IWaveMgr {
  /**
   * 更新每个新的订单，让波次管理试图放入波次，返回false，表示不能放入
   * @param ord 新订单，注意，由上游系统保证这个订单是未分配的
   */
  pollNewOrder(ord: IWOrder): boolean
}

export interface IWave {
  id: string;
  orders: IWOrder[];
  /** 该波次已经满了  */
  isFull(): boolean;
  /** 向波次试着加入一个订单，返回false，表示添加失败 */
  tryAdd(ord: IWOrder): boolean;
}

export enum OrderStatus {
  new = 1,
  waved = 11, //编入波次
  executing = 21, //波次执行中
  packaged = 31, //执行完成，容器已经完成
  ready4trans = 41, //准备好，等待运输
  cancelled = 51, //取消
  finished = 91 //完成
}