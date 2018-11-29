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
    tree: '/system/regions/getByPid',
    get: '/system/regions/page',
    view: '/system/regions/getById',
    add: 'system/regions/update',
    del: 'system/regions/physicalDelete',
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
    stock : '/stock/page',
    // 门店入库记录
    storage : '/stock/put/page'
  },
  chainStock:{
    // 分页查询门店商品订货价
    page:'chain/call/price/page',
    // 删除门店商品订货价
    delete:'chain/call/price/physicalDelete',
    // 新增门店商品订货价
    save:'chain/call/price/save',
    // 更新门店商品订货价
    update:'/chain/call/price/update',
    // 无关联订货价商品
    product : "/chain/call/price/product/page"
  },
  chainUser: {
    get: '/chain/user/page',
    reset: '/chain/user/resetpwd',
  },
  supplier: {
    get: '/supplier/page',
    view: '/supplier/getById',
    update: '/supplier/update',
    del: '/supplier/physicalDelete',
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
  report: {
    // 生成订单报表
    order: '/chain/report/order',
    // 生成配送单报表
    deliver : '/chain/report/deliver'
  },
  // 订货管理
  orderManage : {
    // 分页查询门店订货单
    orderList : "/stock/call/page",
    // 门店订货单审核通过
    orderAudit : "/stock/call/audit",
    //逻辑删除 门店订货单
    orderDelete : "/stock/call/delete",
    // 门店订货单审驳回
    orderReject : "/stock/call/reject",
    // 分页查询订货单商品信息
    orderDetail : "/stock/call/product/page"
  },
  // 仓库管理
  storageManage :{
    // 分页查询门店商品出库单
    list : "/stock/out/page",
    // 门店出库单确认出库
    confirm : "/stock/out/confirm",
    // 逻辑删除门店商品出库单
    delete : "/stock/out/delete"
  },
  // 物流管理
  dispatchManage : {
    // 分页查询门店配送单
    list : "/stock/deliver/page",
    // 新增门店配送单
    save : "/stock/deliver/save",
    // 确认门店配送单
    confirm : "/stock/deliver/confirm"
  },
  // 财务管理
  financeManage : {
    // 分页查询门店订货结算单
    list : "/stock/account/page",
    // 门店订货结算单结算
    action : "/stock/account/confirm",
    // 结算单详情
    detail : "/stock/account/get"
  },
  //日期选择快捷键
  dateOptions: {
    shortcuts: [{
      text: '当日',
      value () {
        const end = new Date();
        const start = new Date();
        start.setHours(0);
        start.setMinutes(0);
        start.setSeconds(0);
        return [start, end]
      }
    }, {
      text: '昨日',
      value () {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24);
        start.setHours(0);
        start.setMinutes(0);
        start.setSeconds(0);
        end.setTime(end.getTime() - 3600 * 1000 * 24);
        end.setHours(23);
        end.setMinutes(59);
        end.setSeconds(59);
        return [start, end]
      }
    }, {
      text: '最近一周',
      value () {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        return [start, end]
      }
    }, {
      text: '最近一个月',
      value () {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        return [start, end]
      }
    }, {
      text: '最近三个月',
      value () {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
        return [start, end];
      }
    }]
  },

}

export default apis
