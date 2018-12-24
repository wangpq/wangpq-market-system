<template>
    <div id="purchasePick" class="layout-content purchase-pick">
        <Card>
            <div class="search">
                <Form inline>
                    <Form-item label="收货仓库" :label-width="80" prop="supplierName" class="ivu-form-item-required">
                        <Select class="tree_combo_select" placeholder="请选择收货仓库！"
                                label-in-value filterable @on-change="warehouseSelect">
                            <Option v-for="item in supplierList" :value="item.id" :key="item.id">
                                {{ item.name }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="供应商" :label-width="60" prop="supplierName" class="ivu-form-item-required">
                        <Select class="tree_combo_select" id="supplier_product_select" placeholder="请先选择供应商！"
                                label-in-value filterable @on-change="supplierSelect" @on-open-change="openSelect">
                            <Option v-for="item in supplierList" :value="item.id" :key="item.id">
                                {{ item.name }}
                            </Option>
                        </Select>
                    </Form-item>
                    <Form-item label="商品" :label-width="100" prop="productName">
                        <Input type="text" v-model="searchForm.productOr" placeholder="商品编号、名称"/>
                    </Form-item>
                    <Form-item>
                        <Button type="primary" @click="handleSelect" icon="md-search">查询</Button>
                    </Form-item>
                </Form>

                <Table
                        ref="purProSelectTable"
                        :columns="columns"
                        :data="tableData"
                        :border="true"
                        :stripe="false"
                        :show-header="true"
                ></Table>

                <div class="submit">
                    <Button type="warning" @click="handleSave(0)">采购存稿</Button>
                    <Button type="error" @click="handleSave(1)">采购提交</Button>
                </div>
            </div>
        </Card>
        <ProductSelectDialog :initOption="initSelectProduct" :searchForm="searchForm"></ProductSelectDialog>
    </div>
</template>
<script>
  import ProductSelectDialog from '@/views/purchase/pick/ProductSelectDialog'

  import $http from '@/utils/httputils'

  export default {
    name: 'purchasePick',
    data () {
      return {
        tableData: [],
        supplierList: [],
        columns: [
          {
            title: '序号',
            type: 'selection',
            width: 80,
            align: 'center'
          },
          {
            title: '商品',
            key: 'productName',
            sortable: true,
            align: 'center'
          },
          {
            title: '条码',
            key: 'productNo',
            sortable: true,
            align: 'center'
          },
          {
            title: '规格',
            key: 'specifications',
            sortable: true,
            align: 'center'
          },
          {
            title: '单位',
            key: 'unit',
            sortable: true,
            align: 'center'
          },
          {
            title: '采购价',
            key: 'price',
            sortable: true,
            align: 'center',
            render: (h, params) => {
              let key = params.column.key
              return h('div', [
                h('InputNumber', {
                  props: {
                    value: params.row.price,
                    min: 0
                  },
                  attrs: {
                    style: "font-size: 16px;font-weight: bolder;",
                  },
                  on: {
                    input: function (val) {
                      params.row[key] = val
                    },
                    'on-blur': () => {
                      this.tableData.splice(params.index, 1, params.row)
                    }
                  },
                })
              ])
            }
          },
          {
            title: '数量',
            key: 'number',
            sortable: true,
            width: 120,
            align: 'center',
            render: (h, params) => {
              let key = params.column.key
              return h('div', [
                h('InputNumber', {
                  props: {
                    value: params.row.number,
                    min: 1
                  },
                  attrs: {
                    style: "font-size: 16px;font-weight: bolder;",
                  },
                  on: {
                    input: function (val) {
                      params.row[key] = val
                    },
                    'on-blur': () => {
                      this.tableData.splice(params.index, 1, params.row)
                    }
                  },
                })
              ])
            }
          },
          {
            title: '操作',
            key: 'action',
            className: 'actionClassName',
            sortable: true,
            width: 120,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.hanldeDelete(params.index)
                    }
                  }
                }, '删除')
              ])
            },
          }
        ],
        purchaseProForm: {
          id: null,
          productId: null,
          productName: null,
          productNo: null,
          number: null,
          specifications: null,
          unit: null,
          price: null,
        },
        searchForm: {
          supplierId: null,
          productOr: null,
        },
        warehouse: {
          id: 1,
          name: '测试',
        },
        initSelectProduct: {
          title: '',
          visible: false,
          id: ''
        },
      }
    },
    methods: {
      handleSelect () {
        if (!this.searchForm.supplierId || !this.initSelectProduct.supplierName) {
          this.$Message.warning("请选择供应商！")
          return
        }
        this.initSelectProduct.title = '商品选购'
        this.initSelectProduct.visible = true
      },
      hanldeDelete (index) {
        this.tableData.splice(index, 1)
      },

      openSelect (val) {
        //展开
        if (!val) {
          return
        }
        if (this.searchForm.supplierId && this.tableData && this.tableData.length > 0) {
          /**
           * 为了让select 的下拉消失
           */
          setTimeout(function () {
            var body = document.getElementsByTagName('body')[0];
            var evObj = document.createEvent('MouseEvents');
            evObj.initMouseEvent('click');
            body.dispatchEvent(evObj);
          }, 300)

          this.$Modal.confirm({
            okText: '清空',
            title: '切换供应商',
            content: '同批次仅可采购同一供应商商品,是否继续清空已选购的【' + this.initSelectProduct.supplierName + '】供应商的商品！',
            onOk: () => {
              this.tableData = []
              this.initSelectProduct.supplierName = ''
              this.searchForm.supplierId = ''
              document.querySelectorAll("#supplier_product_select .ivu-select-input")[0].value = '请选择供应商'
            },
          })
        }
      },
      supplierSelect (option) {
        if (option && option.value) {
          this.searchForm.supplierId = option.value
          this.initSelectProduct.supplierName = this.Trim(option.label)
        }
      },
      getSupplierList () {
        $http({
          path: this.apis.supplier.get,
          method: 'post',
          data: {},
        }).then(response => {
          let res = response.data
          if (res.success) {
            this.supplierList = res.data.list
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
          }
        })
      },

      warehouseSelect (option) {
        if (option && option.value) {
          this.warehouse.id = option.value
          this.warehouse.name = this.Trim(option.label)
        }
      },
      getWarehouseList () {
        $http({
          path: this.apis.supplier.get,
          method: 'post',
          data: {},
        }).then(response => {
          let res = response.data
          if (res.success) {
            this.supplierList = res.data.list
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
          }
        })
      },
      handleSave (status) {
        console.log("=====" + JSON.stringify(this.tableData))

        if (!this.validate()) {
          return
        }

        let saveData = {}
        saveData.supplierId = this.searchForm.supplierId
        saveData.supplierName = this.initSelectProduct.supplierName
        saveData.warehouseId = this.warehouse.id
        saveData.warehouseName = this.warehouse.name
        saveData.productNum = this.tableData.length
        saveData.productAmount = this.calculateProCount()
        saveData.productList = this.tableData

        $http({
          path: status === 1 ? this.apis.purchase.save : this.apis.purchase.draft,
          method: 'post',
          data: saveData,
        }).then(response => {
          let res = response.data
          if (res.success) {
            this.tableData = []
            this.$Notice.success({
              title: '采购',
              desc: (status === 1 ? '提交成功' : '存稿成功') + ',请移步采购列表查看！'
            })
            this.$Message.success()
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
          }
        })
      },
      validate () {
        if (!this.warehouse.id) {
          this.$Message.warning("请选择收货仓库!");
          return false
        }
        if (this.tableData.length === 0) {
          this.$Message.warning("请选择商品!");
          return false
        }

        var res = true;
        this.tableData.forEach(e => {
          if (!e.price) {
            this.$Message.warning("请填写商品【" + e.productName + "】采购价!");
            res = false
            return false
          }
          if (!e.number) {
            this.$Message.warning("请填写商品【" + e.productName + "】数量!");
            res = false
            return false
          }
          if ((e.number + "").indexOf(".") > 0) {
            this.$Message.warning("商品【" + e.productName + "】数量必须是整数!");
            res = false
            return false
          }
        })

        return res
      },
      calculateProCount () {
        let count = 0
        this.tableData.forEach(e => {
          count += e.number
        })
        return count
      }

    },
    created () {
      this.getSupplierList()
    },
    components: {
      ProductSelectDialog,
    }
  }
</script>
<style lang="scss">
    .purchase-pick {
        .submit {
            text-align: center;
            padding-top: 20px;

            button {
                margin-left: 20px;
            }
        }
    }

</style>
