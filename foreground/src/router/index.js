import Vue from 'vue'
import Router from 'vue-router'
import iView from 'iview'
import store from '../store/store'

import Login from '@/views/Login'
import test from '@/views/test'
import Layout from '@/components/common/Layout'
import UnAuth from '@/views/error/401'
import NotFound from '@/views/error/404'
import product from '@/views/product/info/Index'
import brand from '@/views/product/brand/Index'
import productCate from '@/views/product/cate/Index'
import resource from '@/views/system/resource/Index'
// 系统管理---部门管理
import department from '@/views/system/department/Index'

import role from '@/views/system/role/Index'
import dict from '@/views/system/dict/Index'
import user from '@/views/system/user/Index'
import Dashboard from '@/views/report/Dashboard'
import chain from '@/views/chain/info/Index'
import payErrorLog from '@/views/chain/payerrorlog/Index'
import payLog from '@/views/chain/paylog/Index'
import saleProduct from '@/views/chain/saleproduct/Index'
import chainUser from '@/views/chain/user/Index'
import supplier from '@/views/supplier/Index'
import log from '@/views/system/log/Index'
import member from '@/views/member/Index'
import chainOrder from '@/views/chain/order/Index'
// 商品管理---门店商品订货价
import storeOrderPrice from '@/views/product/orderprice/Index'
// 商品管理---没有关联订货价的商品
import noRelateProduct from '@/views/product/norelateproduct/Index'
// 门店管理---门店库存查询
import stockList from '@/views/chain/stock/Index'
// 门店管理---门店入库查询
import storageSearch from '@/views/chain/storage/Index'
// 物流管理---配送单列表
import dispatchList from '@/views/dispatch/Index'
// 订货管理---门店订货单列表
import storeOrder from '@/views/ordermanage/Index'
// 仓库管理---仓库商品出库列表
import storageList from '@/views/storage/Index'
// 财务管理---配送单列表
import AccountList from '@/views/finance/Index'
// 门店管理---门店调价管理
import chainAdjust from '@/views/chain/adjust/Index'
// 供应商管理
import providerList from '@/views/provider/Index'
// 客户管理
import customerList from '@/views/customer/Index'
// 仓库管理---仓库列表
import warehouse from '@/views/warehouse/Index'
// 仓库管理---仓库差异库存
import stockDiscrepancy from '@/views/storage/discrepancy/Index'

import purchaseRouter from '@/router/modules/purchase'



Vue.use(Router)

export const constantRouterMap = [

  purchaseRouter,


  {
    path: '*',
    name: '404',
    component: NotFound
  },
  {
    path: '/test',
    name: '测试',
    component: test
  },
  {
    path: '/',
    name: '首页',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: '首页',
        component: Dashboard,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/401',
        name: '无权访问',
        component: UnAuth
      },
      {
        path: '/product',
        name: '商品',
        component: product,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/brand',
        name: '品牌',
        component: brand,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/product-cate',
        name: '商品分类',
        component: productCate,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/resource',
        name: '菜单资源',
        component: resource,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/role',
        name: '角色',
        component: role
      },
      {
        path: '/dict',
        name: '字典',
        component: dict,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/user',
        name: '系统用户',
        component: user,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/chain',
        name: '门店',
        component: chain,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/chain/user',
        name: '门店用户',
        component: chainUser,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/chain/order',
        name: '门店订单',
        component: chainOrder,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/chain/log',
        name: '支付日志',
        component: payLog,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/chain/log/error',
        name: '错误日志',
        component: payErrorLog,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/chain/sale/product',
        name: '销售商品',
        component: saleProduct,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/chain/stock/list',
        name: '门店库存查询',
        component: stockList,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/chain/storage',
        name: '门店入库查询',
        component: storageSearch,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/chain/adjust',
        name: '门店调价管理',
        component: chainAdjust,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/supplier',
        name: '供应商',
        component: supplier,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/log',
        name: '日志',
        component: log,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/member',
        name: '会员',
        component: member,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/orderlist',
        name: '门店订货单列表',
        component: storeOrder,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/storagelist',
        name: '仓库商品出库列表',
        component: storageList,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/warehouseList',
        name: '仓库列表',
        component: warehouse,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/stockDiscrepancy',
        name: '仓库差异库存',
        component: stockDiscrepancy,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/product/order-price',
        name: '门店商品订货价',
        component: storeOrderPrice,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/product/no-relate-product',
        name: '门店商品订货价',
        component: noRelateProduct,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/dispatchlist',
        name: '配送单列表',
        component: dispatchList,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/accountlist',
        name: '配送单列表',
        component: AccountList,
        meta: {
          requireAuth: true
        }
      },
      {
        path: '/department',
        name: '部门管理列表',
        component: department,
        meta: {
          requireAuth: true
        }
      },
        {
          path: '/supplierlist',
          name: '供应商列表',
          component: providerList,
          meta: {
            requireAuth: true
          }
        },
        {
          path: '/customerlist',
          name: '客户列表',
          component: customerList,
          meta: {
            requireAuth: true
          }
        }
    ],
    meta: {
      requireAuth: true
    }
  },
  {
    path: '/login',
    name: '登录',
    component: Login
  },
]


const router = new Router({
  routes: constantRouterMap
})

// 权限验证
router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  console.log('token==' + JSON.stringify(store.state.user))
  if (store.state.user.token) {
    if (to.path === '/login') {
      next({path: '/index'})
    } else if (to.path === '') {
      next({path: '/index'})
    } else {
      next()
    }
  } else {
    // 不需权限验证 直接跳转， 否则跳到登录页面
    if (!to.meta.requireAuth) {
      next()
    } else {
      next('/login')
      iView.LoadingBar.finish()
    }
  }
})
router.afterEach(route => {
  iView.LoadingBar.finish()
  console.log(`成功浏览到: ${route.path}`)
})

export default router
