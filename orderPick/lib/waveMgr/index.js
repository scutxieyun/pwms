/**
 * 组波工厂，初始化时，
 * 绑定一个订单OMS实例，调用他获得订单信息，
 * 绑定策略，或者策略实例
 */
function WaveFactory(ordMgr, ordGrp, grpChecker) {
  this.ordMgr = ordMgr
  this.ordGrp = ordGrp
  this.grpChecker = grpChecker
  this.waves = [] //组波的结果 
}

/**
 * 扫描订单，更新组波情况
 */
WaveFactory.prototype.refresh = function () {

}
