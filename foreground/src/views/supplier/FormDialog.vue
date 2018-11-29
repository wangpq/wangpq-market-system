<template>
    <Modal id="supplierFormDialog"
           v-model="initOption.visible"
           :mask-closable="false">
        <p slot="header" style="color:#f60;text-align:center;">
            <Icon type="information-circled"></Icon>
            <span>{{initOption.title}}</span>
        </p>
        <Form ref="supplierForm"
              :model="supplierForm"
              :rules="formRules"
              :label-width="90"  style="overflow-y: auto;height: 70vh">

            <FormItem label="供应商名称" prop="name">
                <Input v-model="supplierForm.name"></Input></FormItem>

            <FormItem label="供应商编码" prop="code">
                <Input v-model="supplierForm.code"></Input></FormItem>

            <FormItem label="配送周期" prop="deliverCycle">
                <Input v-model="supplierForm.deliverCycle"></Input></FormItem>

            <FormItem label="经营方式" prop="businessWay">
                <Input v-model="supplierForm.businessWay"></Input></FormItem>

            <FormItem label="联营保底金额" prop="unionLowestPrice">
                <Input v-model="supplierForm.unionLowestPrice"></Input></FormItem>

            <FormItem label="结算门店" prop="settleChain">
                <Input v-model="supplierForm.settleChain"></Input></FormItem>

            <FormItem label="业务员" prop="countermanName">
                <Input v-model="supplierForm.countermanName"></Input></FormItem>

            <FormItem label="单据进价方式" prop="docPriceWay">
                <Input v-model="supplierForm.docPriceWay"></Input></FormItem>

            <FormItem label="结账周期（天）" prop="settleCycle">
                <Input v-model="supplierForm.settleCycle"></Input></FormItem>

            <FormItem label="月结日期" prop="monthStatementDate">
                <Input v-model="supplierForm.monthStatementDate"></Input></FormItem>

            <FormItem label="联系电话" prop="phone">
                <Input v-model="supplierForm.phone"></Input></FormItem>

            <FormItem label="地址" prop="address">
                <Input v-model="supplierForm.address"></Input></FormItem>

            <FormItem label="联系人" prop="contactName">
                <Input v-model="supplierForm.contactName"></Input></FormItem>

            <FormItem label="联系手机号" prop="contactMobile">
                <Input v-model="supplierForm.contactMobile"></Input></FormItem>

            <FormItem label="开户行" prop="bankName">
                <Input v-model="supplierForm.bankName"></Input></FormItem>

            <FormItem label="银行帐号" prop="taxRegNum">
                <Input v-model="supplierForm.taxRegNum"></Input></FormItem>

            <FormItem label="营业执照号" prop="businessLicenseNum">
                <Input v-model="supplierForm.businessLicenseNum"></Input></FormItem>

            <FormItem label="经营类型" prop="businessType">
                <Input v-model="supplierForm.businessType"></Input></FormItem>

            <FormItem label="备注" prop="remark">
                <Input v-model="supplierForm.remark" type="textarea"></Input></FormItem>

        </Form>
        <div slot="footer">
            <Button type="primary" @click="$parent.supplierFormInitOption.visible = false"
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

    name: 'supplierFormDialog',
    props: {
      initOption: {
        title: {
          type: String,
          default: '新增供应商'
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
          name: [
            {required: true, message: '供应商名称不能为空', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '供应商描述不能为空', trigger: 'blur'}
          ]
        },
        supplierForm: {
          id: this.initOption.id,
          name: null,
          code: null,
          deliverCycle: null,
          businessWay: null,
          unionLowestPrice: null,
          settleChain: null,
          countermanId: null,
          countermanName: null,
          docPriceWay: null,
          paymentWay: null,
          settleWay: null,
          settleCycle: null,
          monthStatementDate: null,
          phone: null,
          address: null,
          contactName: null,
          contactMobile: null,
          bankName: null,
          bankAccount: null,
          taxRegNum: null,
          businessLicenseNum: null,
          businessType: null,
          remark: null,
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
          path: this.apis.supplier.view,
          method: 'get',
          data: {id: this.initOption.id}
        }).then(response => {
          var res = response.data
          if (res.success) {
            this.supplierForm = res.data
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
          }
        })
      },
      handleSubmit () {
        this.$refs.supplierForm.validate((valid) => {
          console.log('valid:' + valid)
          if (valid) {
            $http({
              path: this.apis.supplier.update,
              method: 'post',
              data: this.supplierForm
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
          this.$parent.supplierFormInitOption.visible = false
        } else {
          this.$Notice.error({
            title: '提示',
            desc: obj.message
          })
        }
      },
      reset () {
        this.clearObjData(this.supplierForm)
      },
    }
  }
</script>
<style>
</style>
