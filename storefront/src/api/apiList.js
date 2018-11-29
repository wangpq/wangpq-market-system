// export const host="http://10.10.200.49:8083";//测试环境
// export const host="http://storeapi.busilinq.com/" //正式环境
// export const host="http://10.10.200.194:8083/" //开发环境
export const  host = process.env.BASE_URL
export default {
  host:`${host}`,
  // 登录
  queryLogin : `${host}/chain/user/login`,
  // 修改密码
  queryModifypwd :  `${host}/chain/user/modifypwd`,
  // 退出登录
  queryLoginout  :  `${host}/chain/user/loginout`,

  // 通过条码或者名称获取商品信息(后台)
  querySearch :  `${host}/product/search`,
  // 通过条码或者名称获取商品信息(收银)
  querySales :  `${host}/product/sales`,
  // 获取转换商品信息
  queryPrdConvert :  `${host}/product/convert`,
  // 分页获取商品
  queryPrdPage :  `${host}/product/page`,

  // 创建订单
  queryCreateOrder :  `${host}/chain/order/create`,
  // 退单
  queryChargeback :  `${host}/chain/order/refund`,
  // 创建挂单
  queryCreateEntryOrder :  `${host}/chain/order/upside`,
  // 解除挂单
  queryDownside :   `${host}/chain/order/downside`,
  // 获取订单产品列表
  queryProductLists :  `${host}/chain/order/products`,
  // 查询订单或者挂单
  queryOrder : `${host}/chain/order/search`,
  // 删除订单
  queryOrderDelete : `${host}/chain/order/delete`,
  //退单
  queryOrderRefund: `${host}/chain/order/refund`,
  // 订单抹零
  queryOrderIntegral  : `${host}/chain/order/integral`,
  // 订单去分
  queryOrderDivision  : `${host}/chain/order/division`,

  // 查看账户公钥私钥等信息
  queryChainAccount  : `${host}/chain/account`,
  // 修改保存账户公钥私钥等信息
  queryChainAccountSave  : `${host}/chain/account/save`,

  // 在线支付
  queryPayOnline : `${host}/payment/online`,
  // 现金支付
  queryPayCash : `${host}/payment/cash`,
  // 订单支付查询
  queryPaymentQuery : `${host}/payment/query`,
  // 线下扫码
  queryPaymentScan : `${host}/payment/scan`,
  // 云闪付
  queryUnionCloud : `/payment/unionpay`,

  // 门店获取销售单数
  queryIndex :  `${host}/chain/table/index`,

  // 获取会员信息(get)  添加会员(post)
  queryMember :   `${host}/member`,
  // 查询商品折扣
  queryMemberSales : `${host}/member/sales`,

  // 获取小票打印模板
  queryPrintTemplate : `${host}/system/print/template1`,
  queryPrintPrinter : `${host}/system/print/printer`,


  // 门店后台首页接口数据
  queryBackIndex : `${host}/chain/table/backIndex`,

  //预支付
  paymentAdvance:'payment/advance',

  //获取销售产品
  querySaleProduct : 'chain/order/saleProducts',
  //获取角色列表
  queryRoles : 'system/role/list',

  //添加门店用户
  queryUserSave : 'chain/user/saveOrUpdate',
  //冻结用户
  freezeUser : 'chain/user/freeze',
  //删除用户
  deleteUser: 'chain/user/delete',
  //门店信息
  queryChainInfo : 'chain/info',
  //门店信息修改
  updateChainInfo : 'chain/info/update',
  //查询会员列表
  queryMembers : 'member/page',
  //会员保存或修改
  memberSaveUpdate : 'member/saveOrUpdate',
  //获取会员折扣列表
  memberDiscounts:'member/discounts',
  //订单查询
  chainOrderSearch:'chain/order/search',
  // 查询门店商品订货价（配送价）
  chainOrderPrice : "/chain/call/price/list",

  // 分页查询订货单
  storeOrderList : "call/page", 

  // 分页获取订货单商品
  orderProduct :  "/call/products",
  // 新增订货单
  newOrder : "/call/save",
  // 更新订货单
  updateOrder : "/call/update",
  // 验证是否可新增或者编辑
  validateOrder : "/call/vaild",
  // 删除订货单
  deleteOrder :  "/call/delete",
  // 订货单提交审核
  submitAudit :  "/call/submitAudit",
  // 订货单入库
  goStorage : "/call/godown",

  // 订货单报表
  reportStoreOrderList : "/chain/report/call",

  // 门店库存管理---入库记录
  stockList : "/stock/put/page",
  // 门店库存管理---门店库存
  stockSearch : "/stock/page",


  //订单报表
  reportOrder:'chain/report/order',
  //商品报表
  reportOrderProduct: 'chain/report/saleProducts',
  //小票打印模板
  ticketTemplate1 : 'system/print/template1'


}
