import Vue from 'vue'
import Router from 'vue-router'

import Home from '@/pages/Home'
import Login from '@/pages/Login'
import ModifyPass from '@/pages/ModifyPass'
import FrontEnd from '@/pages/FrontEnd'
import BackEnd from '@/pages/BackEnd'
import SaleOrder from '@/pages/order/SaleOrder'
import SaleProduct from '@/pages/order/SaleProduct'
import BackHome from '@/pages/BackHome'
import GoodSearch from '@/pages/goods/GoodSearch'
import ChainProduct from '@/pages/goods/ChainProduct'
import ChainUser from  '@/pages/chain/ChainUser'
import ChainInfo from '@/pages/system/ChainInfo'
import BalanceAccount from '@/pages/system/BalanceAccount'
import MemberInfo from '@/pages/member/MemberInfo'
import SubScreen from '@/pages/system/SubScreen'
import ProductStorage from '@/pages/stockmanage/ProductStorage'
import StockList from '@/pages/stockmanage/StockList'
import StoreOrderList from '@/pages/ordermanage/StoreOrderList'

Vue.use(Router)

export default new Router({
  //mode : 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/frontend',
      name: 'FrontEnd',
      component: FrontEnd
    },
    {
      path: '/backend',
      name: 'BackEnd',
      component: BackEnd,
      children: [{// 后台首页
          path: '/',
          name: 'BackHome',
          component: BackHome
        }, {// 商品管理---商品查询
          path: 'product',
          name: 'GoodSearch',
          component: GoodSearch
        }, {
          path:'chain-product',
          name:'ChainProduct',
          component:ChainProduct
       },{// 会员管理---会员信息管理
          path: 'member',
          name: 'MemberInfo',
          component: MemberInfo
        }, {// 系统管理---结算账号
          path: 'pay-acount',
          name: 'BalanceAccount',
          component: BalanceAccount
        }, {
          path: 'order',
          name: 'SaleOrder',
          component: SaleOrder
        }, {
          path: 'order-product',
          name: 'SaleProduct',
          component: SaleProduct
        },{
          path: 'sys-user',
          name: 'ChainUser',
          component: ChainUser
        },{
           path:'chain-info',
           name: 'ChainInfo',
           component: ChainInfo
        }, { // 门店订货单列表
          path:'store-order-list',
          name: 'StoreOrderList',
          component: StoreOrderList
        }, {// 商品入库
          path:'product-storage',
          name: 'ProductStorage',
          component: ProductStorage
        }, {// 商品库存
          path:'stock-list',
          name: 'StockList',
          component: StockList
        }
      ]
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/modifypass',
      name: 'ModifyPass',
      component: ModifyPass
    } , {
      path:'/sub-screen',
      name:'SubScreen',
      component:SubScreen
    }

  ]
})
