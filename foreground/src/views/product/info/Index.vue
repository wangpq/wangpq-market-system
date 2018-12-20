<template>
    <div route="/product" id="productIndex" class="layout-content">
        <div class="layout-content-main">
            <DataTable
                    :url="apis.product.get"
                    method="post"
                    :columns="columns"
                    :searchForm="searchForm">
                <template slot="search">
                    <Form-item label="货号" :label-width="60" prop="productNo">
                        <Input type="text" v-model="searchForm.productNo"></Input>
                    </Form-item>
                    <Form-item label="商品名称" :label-width="60" prop="productName">
                        <Input type="text" v-model="searchForm.productName"></Input>
                    </Form-item>
                    <Form-item label="审核状态" :label-width="60" prop="checkedStatus">
                        <Select class="checkedStatus" v-model="searchForm.checkedStatus" clearable>
                            <Option v-for="item in getDict(apis.dictType.checkedStatus)" :value="item.value" :key="item.value">
                                {{item.label }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="上下架" :label-width="60" prop="putawayStatus">
                        <Select class="checkedStatus" v-model="searchForm.putawayStatus" clearable>
                            <Option v-for="item in getDict(apis.dictType.putawayStatus)" :value="item.value" :key="item.value">
                                {{item.label }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="商品分类" :label-width="60" prop="productCateName">
                        <CateTreeCombo @selectNode="selectNode" ref="CateTreeCombo"
                                       class="CateTreeCombo"></CateTreeCombo>
                    </Form-item>
                </template>
                <!--<template slot="function">
                <Button type="primary" @click="handleAdd" icon="md-add">新增</Button>
                </template>-->
            </DataTable>
            <FormDialog :initOption="productFormInitOption"></FormDialog>
          <StockPriceDialog :opt="initStockDig"></StockPriceDialog>
        </div>
    </div>
</template>
<script>
  import DataTable from '@/components/common/DataTable'
  import FormDialog from '@/views/product/info/FormDialog'
  import CateTreeCombo from '@/components/tree/CateTreeCombo'
  import StockPriceDialog from '@/views/product/info/StockPriceDialog'

  import $http from '@/utils/httputils'

  export default {
    name: 'productIndex',
    data () {
      return {

        columns: [
          {
            title: '序号',
            type: 'selection',
            width: 80,
            align: 'center'
          },
          {
            width: 150,
            sortable: true,
            title: '自编码',
            align: 'center',
            key: 'selfCode'
          },
          {
            width: 150,
            title: '条码',
            align: 'center',
            key: 'productNo'
          },
          {
            width: 220,
            title: '名称',
            align: 'center',
            key: 'productName'
          },
          {
            width: 220,
            title: '简称',
            align: 'center',
            key: 'productDeputyName'
          },
          {
            width: 110,
            title: '分类',
            align: 'center',
            key: 'productCateName'
          },
          {
            width: 120,
            title: '零售价(元)',
            sortable: true,
            minWidth:70,
            align: 'center',
            key: 'salePrice'
          },
          {
            width: 140,
            title: '最低售价(元)',
            sortable: true,
            minWidth:70,
            align: 'center',
            key: 'lowestPrice'
          },
          // {
          //   width: 130,
          //   title: '毛利润(%)',
          //   sortable: true,
          //   minWidth:70,
          //   align: 'center',
          //   key: 'grossProfit'
          // },
          {
            width: 80,
            title: '单位',
            sortable: true,
            minWidth:70,
            align: 'center',
            key: 'unit'
          },
          {
            width: 120,
            title: '子商品',
            align: 'center',
            key: 'childName',
          },
          {
            width: 80,
            title: '规格',
            align: 'center',
            key: 'specification'
          },
          {
            width: 110,
            title: '允许折扣',
            sortable: true,
            minWidth:70,
            align: 'center',
            key: 'orDiscount'
          },
          // {
          //   width: 110,
          //   title: '物流模式',
          //   sortable: true,
          //   minWidth:70,
          //   align: 'center',
          //   key: 'logisticsModel'
          // },
          // {
          //   width: 100,
          //   title: '进项税',
          //   sortable: true,
          //   minWidth:70,
          //   align: 'center',
          //   key: 'inTax'
          // },
          // {
          //   width: 100,
          //   title: '销项税',
          //   sortable: true,
          //   minWidth:70,
          //   align: 'center',
          //   key: 'outTax'
          // },
          // {
          //   width: 110,
          //   title: '经营方式',
          //   sortable: true,
          //   minWidth:70,
          //   align: 'center',
          //   key: 'businessWay',
          //   render: (h, params) => {
          //     var val = params.row.businessWay
          //     var res = ''
          //     switch (val) {
          //       case 0:
          //         res = '否'
          //         break
          //       case 1:
          //         res = '是'
          //         break
          //     }
          //     return h('span', {}, res)
          //   }
          // },
          // {
          //   width: 110,
          //   title: '维护库存',
          //   sortable: true,
          //   minWidth:70,
          //   align: 'center',
          //   key: 'orMaintainStock',
          //   render: (h, params) => {
          //     var val = params.row.orMaintainStock
          //     var res = ''
          //     switch (val) {
          //       case 0:
          //         res = '否'
          //         break
          //       case 1:
          //         res = '是'
          //         break
          //     }
          //     return h('span', {}, res)
          //   }
          // },
          {
            width: 140,
            title: '保质期（天）',
            sortable: true,
            minWidth:70,
            align: 'center',
            key: 'shelfLife'
          },
          {
            width: 110,
            title: '计价方式',
            sortable: true,
            minWidth:70,
            align: 'center',
            key: 'priceWay',
            render: (h, params) => {
              var val = params.row.priceWay
              var res = ''
              switch (val) {
                case 0:
                  res = '普通'
                  break
                case 1:
                  res = '计重'
                  break
                case 2:
                  res = '计数'
                  break
              }
              return h('span', {}, res)
            }
          },
          // {
          //   width: 100,
          //   title: '损耗率',
          //   sortable: true,
          //   minWidth:70,
          //   align: 'center',
          //   key: 'damage'
          // },
          {
            width: 100,
            title: '积分值',
            sortable: true,
            minWidth:70,
            key: 'integral'
          },
          // {
          //   width: 110,
          //   title: '停购日期',
          //   sortable: true,
          //   minWidth:70,
          //   align: 'center',
          //   key: 'stopPurchaseDate'
          // },
          // {
          //   width: 150,
          //   title: '采购周期（天）',
          //   sortable: true,
          //   minWidth:70,
          //   align: 'center',
          //   key: 'purchaseCycle'
          // },
          // {
          //   width: 80,
          //   title: '标签',
          //   sortable: true,
          //   minWidth:70,
          //   align: 'center',
          //   key: 'label'
          // },
          {
            width: 110,
            title: '品牌名称',
            sortable: true,
            minWidth:70,
            align: 'center',
            key: 'brandName'
          },
          {
            width: 110,
            title: '上架状态',
            sortable: true,
            minWidth:70,
            align: 'center',
            key: 'putawayStatus',
            fixed: 'right',
            render: (h, params) => {
              var val = params.row.putawayStatus
              var res = ''
              var style = {}
              switch (val) {
                case 1:
                  res = '上架'
                  style = {color: 'green'}
                  break
                case 2:
                  res = '下架'
                  style = {color: 'red'}
                  break
                default:
                  res = '下架'
                  style = {color: 'red'}
              }
              return h('span', {
                style
              }, res)
            }
          },
          {
            width: 110,
            title: '审核状态',
            sortable: true,
            minWidth:70,
            align: 'center',
            key: 'checkedStatus',
            fixed: 'right',
            render: (h, params) => {
              var val = params.row.checkedStatus
              var res = ''
              var style = {}
              switch (val) {
                case 1:
                  res = '已审核'
                  style = {color: 'green'}
                  break
                case 2:
                  res = '待审核'
                  style = {color: 'red'}
                  break
                default :
                  res = '待审核'
                  style = {color: 'red'}
              }
              return h('span', {style}, res)
            }
          },
          {
            width: 110,
            title: '创建时间',
            key: 'createTime',
            align: 'center',
            sortable: true,
            minWidth:140,
          }],
        searchForm: {
          productNo: null,
          productName: null,
          productCateId: null,
          checkedStatus: null,
          putawayStatus: null,
        },
        productFormInitOption: {
          title: '',
          action: '',
          visible: false,
          id: ''
        },
        initStockDig:{
          visible:false,
          title:'商品订货价',
          okText:'保存',
          cancelText:'取消',
          product:null
        }
      }
    },
    methods: {

      //选择 父级菜单之后回调方法
      selectNode (opt) {
        this.searchForm.productCateId = opt.id
        console.log('选择父级菜单之后回调值：' + opt.id + opt.title)
      },

      handleAdd () {
        this.productFormInitOption.title = '新增商品信息'
        this.productFormInitOption.action = 'add'
        this.productFormInitOption.visible = true
        this.$children[1].init()
      },
      handleView (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.productFormInitOption.title = '查看商品信息'
        this.productFormInitOption.action = 'view'
        this.productFormInitOption.visible = true
        this.productFormInitOption.id = row.id
        this.$children[1].init()
      },
      handleEdit (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}

        if (row.putawayStatus === 1) {
          this.$Message.info("【" + row.productName + "】已上架，请先下架后再修改！")
          return
        }

        this.productFormInitOption.title = '编辑商品信息'
        this.productFormInitOption.action = 'edit'
        this.productFormInitOption.visible = true
        this.productFormInitOption.id = row.id
        this.$children[1].init()
      },

      hanldeDelete (row) {
        if (!row || row.length === 0) {
          this.$Message.warning('请选择行！')
          return false
        }

        let next = false;
        row.forEach(e => {
          if (e.putawayStatus === 1) {
            this.$Message.info("【" + e.productName + "】已上架，不能删除！")
            next = true;
          }
        })
        if (next) {
          return;
        }

        if (!(row = this.$children[0].isRightSelectForBatch(row, 'productName'))) {return}
        this.$Modal.confirm({
          title: '请确认',
          content: '确定永久删除【' + row.name + '】商品信息？',
          onOk: () => {
            $http({
              path: this.apis.product.del,
              method: 'delete',
              data: {ids: row.id}
            }).then(response => {
              if (response.data.success) {
                this.$Notice.success({
                  title: '提示',
                  desc: '【' + row.name + '】删除成功！'
                })
                this.$children[0].query()
              } else {
                this.$Notice.error({
                  title: '提示',
                  desc: response.data.message
                })
              }
            })
          }
        })
      },
      //商品进货价
      stockPrice(row){
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.initStockDig.visible = true;
        this.initStockDig.product = row;
      },

      //审核商品
      checkProduct (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        if (row.checkedStatus === 1) {
          this.$Message.info("【" + row.productName + "】已审核，无需再审！")
          return
        }
        this.$Modal.confirm({
          title: '请确认',
          content: '确认【' + row.productName + '】信息无误，审核通过吗？',
          onOk: () => {
            $http({
              path: this.apis.product.checked,
              method: 'put',
              data: {id: row.id}
            }).then(response => {
              if (response.data.success) {
                this.$Notice.success({
                  title: '提示',
                  desc: '【' + row.productName + '】审核成功！'
                })
                this.$children[0].query()
              } else {
                this.$Notice.error({
                  title: '提示',
                  desc: response.data.message
                })
              }
            })
          }
        })
      },

      //商品上架
      putAway (row) {
        if (!row || row.length === 0) {
          this.$Message.warning('请选择行！')
          return false
        }
        let next = true
        row.forEach(e => {
          if (e.checkedStatus !== 1) {
            this.$Message.info("【" + e.productName + "】未审核，不能上架！")
            next = false
            return
          } else if (e.putawayStatus === 1) {
            this.$Message.info("【" + e.productName + "】已上架，无需上架！")
            next = false
            return
          }
        })

        if (next) {
          this.putAwayDown(row, 1);
        }

      },

      //商品下架
      putDown (row) {
        if (!row || row.length === 0) {
          this.$Message.warning('请选择行！')
          return false
        }
        let next = true
        row.forEach(e => {
          if (e.putawayStatus === 2) {
            this.$Message.info("【" + e.productName + "】已下架，无需下架！")
            next = false
            return
          }
        })

        if (next) {
          this.putAwayDown(row, 2);
        }
      },

      //商品上下架
      putAwayDown (row, status) {
        if (!(row = this.$children[0].isRightSelectForBatch(row, 'productName'))) {return}
        this.$Modal.confirm({
          title: '请确认',
          content: '确认' + (status === 1 ? '上架' : '下架') + '【' + row.name + '】商品吗？',
          onOk: () => {
            $http({
              path: this.apis.product.putaway,
              method: 'put',
              data: {ids: row.id, status: status}
            }).then(response => {
              if (response.data.success) {
                this.$Notice.success({
                  title: '提示',
                  desc: '【' + row.name + '】' + (status === 1 ? '上架' : '下架') + '成功！'
                })
                this.$children[0].query()
              } else {
                this.$Notice.error({
                  title: '提示',
                  desc: response.data.message
                })
              }
            })
          }
        })
      },

      resetTableSearchForm () {
        this.searchForm.productCateId = ''
        this.$refs.CateTreeCombo.reset()
      },

    },
    created () {

    },
    watch: {
      'searchForm.productNo' (val) {
        this.searchForm.productNo = this.Trim(val, true)
      }
    },
    components: {
      DataTable,
      FormDialog,
      CateTreeCombo,
      StockPriceDialog
    }
  }
</script>
<style scoped>

    .checkedStatus, .CateTreeCombo {
        min-width: 7vw;
    }

</style>
