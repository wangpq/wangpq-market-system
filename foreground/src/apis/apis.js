let apis = {
  dict: { 
    OR_DISCOUNT: 'test'
  },
  dictVal: {
    orDiscount: [],//是否允许折扣
    logisticsModel: [], //物流模式
    businessWay: [], //经营方式
    orMaintainStock: [],  //是否维护库存
    priceWay: [], //商品计价方式
    putawayStatus: [],  //上架状态
    checkedStatus: [],  //审核状态
    menuType: [],  //菜单类型
    menuUseType: [],  //菜单适用范围
    shopType: [],  //门店类型
    deliverPriceType: [],  //门店配送价格类型
    supplierBusinessWay: [],  //供应商经营类型
    isSuper: [],  //角色是否超级管理员
    roleUseType: [],  //角色适用范围
    orSupervision: [],  //是否为督导
    isFreeze: [],  //账户冻结标志
    payWay: [],  //支付方式
    payStatus: [],  //支付状态
    orderType: [],  //订单类型
    settlementType: [],  //结算方式
  },
    dictType: {
    //门店类型
    shopType: 'shop_type',
    //角色使用类型
    roleUseType: 'role_use_type',
    //菜单类型
    menuType: 'menu_type',
    //菜单使用类型
    menuUseType: 'menu_use_type',
    //供应商经营方式
    supplierBusinessWay: 'supplier_business_way',
    //审核状态
    checkedStatus: 'checked_status',
    //商品上下架
    putawayStatus: 'putaway_status',
    //支付方式
    payWay: 'pay_way',
    //支付状态
    payStatus: 'pay_status',
    //订单类型
    orderType: 'order_type',
    //采购是否结算
    purchaseOrSettlement: 'purchase_or_settlement',
    //采购结算方式
    purchaseSettlementType: 'purchase_settlement_type',
    //采购审核状态
    purchaseAuditStatus: 'purchase_audit_status',
    //库存差异类型
    stockDiscrepancyType:'stock_discrepancy_type'
  },
  EXTRA: {
    uploadFile: process.env.UPLOAD_FILE,
    fileLoadUrl: process.env.FILE_LOAD_URL,
  },
  product: {
    get: 'product/page',
    getRef: 'system/product/',
    getName: 'product/getNameById',
    simple: 'product/simplePage',
    view: 'product/getErpProductById',
    add: 'product/updateProduct',
    del: 'product/physicalDelete',
    checked: 'product/checked',
    putaway: 'product/updatePutaway',
  },
  productCate: {
    tree: '/product/cate/getCateByPid',
    get: 'product/cate/page',
    view: 'product/cate/getErpProductCateById',
    add: 'product/cate/updateProductCate',
    del: 'product/cate/physicalDeleteChild',
  },
  productBrand: {
    get: 'product/brand/page',
    view: 'product/brand/getById',
    add: 'product/brand/updateBrand',
    del: 'product/brand/physicalDelete',
  },
  menu: {
    get: '/system/res/roleMenuTree',
    view: '/system/res/getById',
    add: 'system/res/save',
    del: 'system/res/delete',
  },
  resource: {
    get: '/system/res/resTree',
    roleResTree: '/system/res/roleResTree',
    view: '/system/res/getById',
    add: 'system/res/save',
    del: 'system/res/delete',
    btnres: 'system/res/menuBtTree',
  },
  systemRegions: {
    districts: '/system/regions/districts',
    tree: '/system/regions/tree'
  },
  systemDict: {
    list: '/system/dict/list',
    get: '/system/dict/page',
    view: '/system/dict/getById',
    add: 'system/dict/update',
    del: 'system/dict/physicalDelete',
  },
  systemRole: {
    get: '/system/role/page',
    view: '/system/role/getById',
    add: 'system/role/add',
    update: 'system/role/update',
    del: 'system/role/delete',
    saveres: 'system/role/saveres',
    rolemenus: 'system/res/getRoleMenus',
  },
  systemUser: {
    get: '/system/user/page',
    reset: '/system/user/resetpwd',
    view: '/system/user/getById',
    update: 'system/user/update',
    del: 'system/user/delete',
    login: 'system/user/login',
    logout: 'system/user/loginout',
    pwd: 'system/user/modifypwd',
    header: 'system/user/uploadHeader',
  },
  chain: {
    get: '/chain/page',
    view: '/chain/getById',
    update: '/chain/update',
    del: '/chain/physicalDelete',
    // 分页查询门店库存
    stock: '/stock/page',
    // 门店入库记录
    storage: '/stock/put/page'
  },
  chainStock: {
    // 分页查询门店商品订货价
    page: 'chain/call/price/page',
    // 删除门店商品订货价
    delete: 'chain/call/price/physicalDelete',
    // 新增门店商品订货价
    save: 'chain/call/price/save',
    // 更新门店商品订货价
    update: '/chain/call/price/update',
    // 无关联订货价商品
    product: '/chain/call/price/product/page'
  },
  chainUser: {
    get: '/chain/user/page',
    reset: '/chain/user/resetpwd',
  },
  supplier: {
    get: '/supplier/page',
    getPro: '/supplier/product/page',
    view: '/supplier/getById',
    update: '/supplier/update',
    del: '/supplier/physicalDelete',
  },
  warehouse:{
    get: '/warehouse/page',
  },
  log: {
    get: '/system/log/page',
    view: '/system/log/getById',
    update: '/system/log/update',
    del: '/system/log/physicalDelete',
  },
  paylog: {
    get: '/chain/pay/log/page',
    getErro: '/chain/pay/log/error/page',
  },
  member: {
    get: '/member/page',
    view: '/member/getById',
    update: '/member/update',
    del: '/member/delete',
  },
  chainOrder: {
    get: '/chain/order/page',
    del: '/chain/order/delete',
    count: '/chain/order/getDWT',
    countTotal: '/chain/order/getSPT',
    salePro: '/chain/order/saleProductsPage',
  },
  chainOrderPro: {
    get: '/chain/order/product/page',
    list: '/chain/order/product/list',
  },
  // 门店调价单
  chainReadjust : {
    // 门店调价单---逻辑删除
    delete : "/chain/readjust/delete",
    // 分页查询门店调价单
    list : "/chain/readjust/page",
    // 创建门店调价单
    save : "/chain/readjust/save",
    // 创建门店调价单
    update : "/chain/readjust/update",
    // 分页查询调价单调价商品列表
    product : "/chain/readjust/product/list"
  },
  report: {
    // 生成订单报表
    order: '/chain/report/order',
    // 生成配送单报表
    deliver: '/chain/report/deliver'
  },
  // 订货管理
  orderManage: {
    // 分页查询门店订货单
    orderList: '/stock/call/page',
    // 门店订货单审核通过
    orderAudit: '/stock/call/audit',
    //逻辑删除 门店订货单
    orderDelete: '/stock/call/delete',
    // 门店订货单审驳回
    orderReject: '/stock/call/reject',
    // 分页查询订货单商品信息
    orderDetail: '/stock/call/product/page'
  },
  // 仓库管理
  storageManage: {
    // 分页查询门店商品出库单
    list: '/stock/out/page',
    // 门店出库单确认出库
    confirm: '/stock/out/confirm',
    // 逻辑删除门店商品出库单
    delete: '/stock/out/delete'
  },
  // 物流管理
  dispatchManage: {
    // 分页查询门店配送单
    list: '/stock/deliver/page',
    // 新增门店配送单
    save: '/stock/deliver/save',
    // 确认门店配送单
    confirm: '/stock/deliver/confirm'
  },
  // 财务管理
  financeManage: {
    // 分页查询门店订货结算单
    list: '/stock/account/page',
    // 门店订货结算单结算
    action: '/stock/account/confirm',
    // 结算单详情
    detail: '/stock/account/get'
  },
  //供应商管理
  provider:{
      list:"/supplier/page",
      add:"/supplier/save",
      delete:"/supplier/delete",
      update:"/supplier/update"
  },
    // 部门管理
  departmentManage: {
    // 获取部门组织架构树
    tree: '/department/tree',
    // 删除部门组织架构
    delete: '/department/delete',
    // PUT 修改部门组织架构使用标志
    enabled: '/department/enabled',
    // 新增部门组织架构
    save: '/department/save',
    // 更新部门组织架构
    update: '/department/update'
  },
  purchase: {
    get: '/purchase/page',
    view: '/purchase/getById',
    save: '/purchase/save',
    draft: '/purchase/draft',
    update: '/purchase/update',
    del: '/purchase/delete',

  },
  // 仓库管理
  warehouseManage: {
    // 分页查询仓库列表
    list: '/warehouse/page',
    //根据id查询仓库详情
    view: '/warehouse/getById',
    // 新增仓库信息
    save: '/warehouse/save',
    // 修改仓库信息
    update: '/warehouse/update',
    //删除仓库信息
    delete:'/warehouse/delete'
  },
  // 仓库差异库存管理
  discrepancyManage: {
    // 分页查询仓库差异库存列表
    list: '/stock/discrepancy/page',
    //根据id查询仓库差异库存详情
    view: '/stock/discrepancy/getById',
    // 新增仓库差异库存信息
    save: '/stock/discrepancy/save',
    // 修改仓库差异库存信息
    update: '/stock/discrepancy/update',
    //删除仓库差异库存信息
    delete:'/stock/discrepancy/delete'
  },
  //客户管理
  customer:{
    list : "/customer/page",
    add : "/customer/save",
    delete : "/customer/delete",
    update: "/customer/update"
  },
  //日期选择快捷键
  dateOptions: {
    shortcuts: [{
      text: '当日',
      value () {
        const end = new Date()
        const start = new Date()
        start.setHours(0)
        start.setMinutes(0)
        start.setSeconds(0)
        return [start, end]
      }
    }, {
      text: '昨日',
      value () {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24)
        start.setHours(0)
        start.setMinutes(0)
        start.setSeconds(0)
        end.setTime(end.getTime() - 3600 * 1000 * 24)
        end.setHours(23)
        end.setMinutes(59)
        end.setSeconds(59)
        return [start, end]
      }
    }, {
      text: '最近一周',
      value () {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
        return [start, end]
      }
    }, {
      text: '最近一个月',
      value () {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
        return [start, end]
      }
    }, {
      text: '最近三个月',
      value () {
        const end = new Date()
        const start = new Date()
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
        return [start, end]
      }
    }]
  },

}

export default apis
