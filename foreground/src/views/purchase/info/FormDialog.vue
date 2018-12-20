<template>
    <Modal id="purchaseFormDialog"
           v-model="initOption.visible"
           :mask-closable="false">
        <p slot="header" style="color:#f60;text-align:center;">
            <Icon type="information-circled"></Icon>
            <span>{{initOption.title}}</span>
        </p>
        <Form ref="purchaseForm"
              :model="purchaseForm"
              :rules="formRules"
              :label-width="90">

            <FormItem label="采购单号" prop="no">
                <Input v-model="purchaseForm.no"></Input>
            </FormItem>
            <FormItem label="关联仓库ID" prop="warehouseId">
                <InputNumber v-model="purchaseForm.warehouseId" 　placeholder=""></InputNumber>
            </FormItem>
            <FormItem label="关联仓库名称" prop="warehouseName">
                <Input v-model="purchaseForm.warehouseName"></Input>
            </FormItem>
            <FormItem label="关联供应商ID" prop="supplierId">
                <InputNumber v-model="purchaseForm.supplierId" 　placeholder=""></InputNumber>
            </FormItem>
            <FormItem label="供应商名称" prop="supplierName">
                <Input v-model="purchaseForm.supplierName"></Input>
            </FormItem>
            <FormItem label="业务员名称" prop="counterman">
                <Input v-model="purchaseForm.counterman"></Input>
            </FormItem>
            <FormItem label="审核模板ID" prop="auditTemplateId">
                <InputNumber v-model="purchaseForm.auditTemplateId" 　placeholder=""></InputNumber>
            </FormItem>
            <FormItem label="审核模板名称" prop="auditTemplatName">
                <Input v-model="purchaseForm.auditTemplatName"></Input>
            </FormItem>
            <FormItem label="审核状态:0 创建  1提交审核 2 审核中 3审核完成" prop="auditStatus">
                <InputNumber v-model="purchaseForm.auditStatus" 　placeholder=""></InputNumber>
            </FormItem>
            <FormItem label="采购产品种类数量" prop="productNum">
                <InputNumber v-model="purchaseForm.productNum" 　placeholder=""></InputNumber>
            </FormItem>
            <FormItem label="采购产品总数" prop="productAmount">
                <InputNumber v-model="purchaseForm.productAmount" 　placeholder=""></InputNumber>
            </FormItem>
            <FormItem label="申请采购单用户ID" prop="applyId">
                <InputNumber v-model="purchaseForm.applyId" 　placeholder=""></InputNumber>
            </FormItem>
            <FormItem label="申请采购单用用户名称" prop="applyName">
                <Input v-model="purchaseForm.applyName"></Input>
            </FormItem>
            <FormItem label="采购总价" prop="amountPrice">
                <Input v-model="purchaseForm.amountPrice"></Input>
            </FormItem>
            <FormItem label="是否结算0未结算 1已结算" prop="orSettlement">
                <InputNumber v-model="purchaseForm.orSettlement" 　placeholder=""></InputNumber>
            </FormItem>
            <FormItem label="结算方式" prop="settlementType">
                <InputNumber v-model="purchaseForm.settlementType" 　placeholder=""></InputNumber>
            </FormItem>
            <FormItem label="支付方式 1银行转账" prop="paymentType">
                <InputNumber v-model="purchaseForm.paymentType" 　placeholder=""></InputNumber>
            </FormItem>
            <FormItem label="结算时间" prop="settlementTime">
                <DatePicker type="date" @on-change="purchaseForm.settlementTime=$event" format="yyyy-MM-dd HH:mm:ss"
                            style="width: 100%"></DatePicker>
            </FormItem>
            <FormItem label="备注信息" prop="remark">
                <Input v-model="purchaseForm.remark"></Input>
            </FormItem>
            <FormItem label="" prop="createTime">
                <DatePicker type="date" @on-change="purchaseForm.createTime=$event" format="yyyy-MM-dd HH:mm:ss"
                            style="width: 100%"></DatePicker>
            </FormItem>
            <FormItem label="" prop="orDel">
                <InputNumber v-model="purchaseForm.orDel" 　placeholder=""></InputNumber>
            </FormItem>

        </Form>
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

  export default {

    name: 'purchaseFormDialog',
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

        formRules: {
          no: [
            {required: true, message: '采购单号不能为空！', trigger: 'blur'}
          ],
          warehouseId: [
            {type: 'number', required: true, message: '关联仓库ID不能为空！', trigger: 'blur'}
          ],
          warehouseName: [
            {required: true, message: '关联仓库名称不能为空！', trigger: 'blur'}
          ],
          supplierId: [
            {type: 'number', required: true, message: '关联供应商ID不能为空！', trigger: 'blur'}
          ],
          supplierName: [
            {required: true, message: '供应商名称不能为空！', trigger: 'blur'}
          ],
          productNum: [
            {type: 'number', required: true, message: '采购产品种类数量不能为空！', trigger: 'blur'}
          ],
          productAmount: [
            {type: 'number', required: true, message: '采购产品总数不能为空！', trigger: 'blur'}
          ],
          applyId: [
            {type: 'number', required: true, message: '申请采购单用户ID不能为空！', trigger: 'blur'}
          ],
          applyName: [
            {required: true, message: '申请采购单用用户名称不能为空！', trigger: 'blur'}
          ],
          amountPrice: [
            {required: true, message: '采购总价不能为空！', trigger: 'blur'}
          ],
          orSettlement: [
            {type: 'number', required: true, message: '是否结算0未结算 1已结算不能为空！', trigger: 'blur'}
          ],
          createTime: [
            {required: true, message: '不能为空！', trigger: 'blur'}
          ],
          orDel: [
            {type: 'number', required: true, message: '不能为空！', trigger: 'blur'}
          ],
        },
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
          path: this.apis.purchase.view,
          method: 'get',
          data: {id: this.initOption.id}
        }).then(response => {
          var res = response.data
          if (res.success) {
            this.purchaseForm = res.data
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
    mounted () {
      this.setDict()
    },
  }
</script>
<style lang="scss">
</style>
