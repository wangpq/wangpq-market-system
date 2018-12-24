<template>
    <Modal id="purchaseFormDialog"
           class="purchase-form-fialog"
           :width="80"
           v-model="initOption.visible"
           :mask-closable="false">
        <p slot="header" style="color:#f60;text-align:center;">
            <Icon type="information-circled"></Icon>
            <span>{{initOption.title}}</span>
        </p>
        <Divider orientation="left">采购订单</Divider>
        <Form ref="purchaseForm"
              :model="purchaseForm"
              :label-width="90">

            <Row :gutter="6">
                <Col span="6">
                    <FormItem label="单号" prop="no">
                        <Input v-model="purchaseForm.no"></Input>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="仓库" prop="warehouseName">
                        <Input v-model="purchaseForm.warehouseName"></Input>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="供应商" prop="supplierName">
                        <Input v-model="purchaseForm.supplierName"></Input>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="业务员" prop="counterman">
                        <Input v-model="purchaseForm.counterman"></Input>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="审核模板" prop="auditTemplatName">
                        <Input v-model="purchaseForm.auditTemplatName"></Input>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="种类数量" prop="productNum">
                        <InputNumber v-model="purchaseForm.productNum" readonly=""
                                     　placeholder=""></InputNumber>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="产品总数" prop="productAmount">
                        <InputNumber v-model="purchaseForm.productAmount" readonly　placeholder=""></InputNumber>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="申请人" prop="applyName">
                        <Input v-model="purchaseForm.applyName"></Input>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="审核状态" prop="auditStatus">
                        <div class="ivu-input">{{ this.getDictValue(this.apis.dictType.purchaseAuditStatus,
                            purchaseForm.auditStatus)}}
                        </div>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="总价" prop="amountPrice">
                        <Input v-model="purchaseForm.amountPrice"></Input>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="结算" prop="orSettlement">
                        <div class="ivu-input">
                            {{getDictValue(apis.dictType.purchaseOrSettlement,
                            purchaseForm.orSettlement)}}
                        </div>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="结算方式" prop="settlementType">
                        <div class="ivu-input">
                            {{getDictValue(apis.dictType.purchaseSettlementType,
                            purchaseForm.settlementType)}}
                        </div>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="支付方式" prop="paymentType">
                        <div class="ivu-input">{{getDictValue(apis.dictType.payWay,
                            purchaseForm.paymentType)}}
                        </div>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="结算时间" prop="settlementTime">
                        <Input v-model="purchaseForm.settlementTime"/>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="创建时间" prop="createTime">
                        <Input v-model="purchaseForm.createTime"/>
                    </FormItem>
                </Col>
                <Col span="6">
                    <FormItem label="备注信息" prop="remark">
                        <Input type="textarea" v-model="purchaseForm.remark"></Input>
                    </FormItem>
                </Col>
            </Row>

        </Form>


        <Divider orientation="left">订单商品</Divider>
        <Collapse v-model="TablePanel">
            <Panel name="1">
                <div slot="content" class="product-table">
                    <Table
                            ref="purProSelectTable"
                            :columns="columns"
                            :data="tableData"
                            :border="true"
                            :stripe="false"
                            :show-header="true"
                    ></Table>
                </div>
            </Panel>
        </Collapse>
        <div slot="footer">
            <Button type="primary" @click="$parent.purchaseFormInitOption.visible = false"
                    v-if="initOption.action === 'view'">关闭
            </Button>
            <Button type="primary" @click="handleSubmit"
                    v-if="initOption.action === 'add' || initOption.action === 'edit'">保存
            </Button>
            <Button type="error" @click="reset" v-if="initOption.action === 'add'">重置</Button>
        </div>
    </Modal>
</template>
<script>
  import $http from '@/utils/httputils'
  import Index from '../../chain/adjust/Index'

  export default {

    name: 'purchaseFormDialog',
    components: {Index},
    props: {
      initOption: {
        title: {
          type: String,
          default: '新增总部采购'
        },
        action: {
          type: String,
          default: 'add'
        },
        visible: {
          type: Boolean
        },
        id: {
          type: String,
          default: null
        }
      }
    },
    data () {
      return {
        TablePanel: 1,
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
          },
          {
            title: '数量',
            key: 'number',
            sortable: true,
            width: 120,
            align: 'center',
          },
        ],
        tableData: [],
        purchaseForm: {
          id: this.initOption.id,
          no: null,
          warehouseId: null,
          warehouseName: null,
          supplierId: null,
          supplierName: null,
          counterman: null,
          auditTemplateId: null,
          auditTemplatName: null,
          auditStatus: null,
          productNum: null,
          productAmount: null,
          applyId: null,
          applyName: null,
          amountPrice: null,
          orSettlement: null,
          settlementType: null,
          paymentType: null,
          settlementTime: null,
          remark: null,
          createTime: null,
          orDel: null,
        }
      }
    },
    methods: {

      init () {
        this.reset()
        if (this.initOption.action !== 'add') {
          this.getInfo()
        }
      },
      getInfo () {
        $http({
          path: this.apis.purchase.detail,
          method: 'get',
          data: {id: this.initOption.id}
        }).then(response => {
          var res = response.data
          if (res.success) {
            this.purchaseForm = res.data
            this.tableData = res.data.productList
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
          }
        })
      },
      handleSubmit () {
        this.$refs.purchaseForm.validate((valid) => {
          console.log('valid:' + valid)
          if (valid) {
            $http({
              path: this.apis.erpPurchase.add,
              method: 'post',
              data: this.purchaseForm
            }).then(response => {
              this.handleResult(response.data)
            })
          }
        })
      },
      handleResult (obj) {
        if (obj.success) {
          this.$Notice.success({
            title: '提示',
            desc: '保存成功！'
          })
          this.$parent.$children[0].query()
          this.$parent.purchaseFormInitOption.visible = false
        } else {
          this.$Notice.error({
            title: '提示',
            desc: obj.message
          })
        }
      },
      reset () {
        this.clearObjData(this.purchaseForm)
      },
      setDict () {
        // this.getDict('checked_status', 'checkedStatus')
      },
    },
    watch: {},
    mounted () {
      this.setDict()
    },
  }
</script>
<style lang="scss">

    .purchase-form-fialog {
        .ivu-divider-horizontal.ivu-divider-with-text-left:before {
            width: 1%;
        }
        .ivu-divider-horizontal.ivu-divider-with-text-center:after, .ivu-divider-horizontal.ivu-divider-with-text-center:before, .ivu-divider-horizontal.ivu-divider-with-text-left:after, .ivu-divider-horizontal.ivu-divider-with-text-left:before, .ivu-divider-horizontal.ivu-divider-with-text-right:after, .ivu-divider-horizontal.ivu-divider-with-text-right:before {
            border-top: 0.5px solid rgba(107, 111, 116, 0.42);
        }
        .ivu-collapse {
            border-top: 0;
        }
        .ivu-collapse > .ivu-collapse-item > .ivu-collapse-header {
            height: 0px;
            line-height: 0px;
            color: #666;
            text-align: center;
        }
    }


</style>
