
import Layout from '@/components/common/Layout'

const purchaseRouter = {
  path: '/purchase',
  component: Layout,
  redirect: 'noredirect',
  name: 'purchase',
  meta: {
    title: '采购管理',
    icon: ''
  },
  children: [
    {
      path: 'info',
      component: () => import('@/views/purchase/info/index'),
      name: '采购列表',
      meta: { title: '采购列表' }
    },{
      path: 'pick',
      component: () => import('@/views/purchase/pick/index'),
      name: '采购选购',
      meta: { title: '采购选购' }
    }
  ]
}
export default purchaseRouter
