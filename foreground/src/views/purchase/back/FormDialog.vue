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

            <FormItem label="关联采购单号" prop="purchaseNo">
                <Input v-model="purchaseForm.purchaseNo"></Input>
            </FormItem>
            <FormItem label="关联商品ID" prop="productId">
                <InputNumber v-model="purchaseForm.productId" 　placeholder=""></InputNumber>
            </FormItem>
            <FormItem label="商品名称" prop="productName">
                <Input v-model="purchaseForm.productName"></Input>
            </FormItem>
            <FormItem label="商品条码" prop="productNo">
                <Input v-model="purchaseForm.productNo"></Input>
            </FormItem>
            <FormItem label="商品采购数量" prop="number">
                <InputNumber v-model="purchaseForm.number" 　placeholder=""></InputNumber>
            </FormItem>
            <FormItem label="商品规格" prop="specifications">
                <InputNumber v-model="purchaseForm.specifications" 　placeholder=""></InputNumber>
            </FormItem>
            <FormItem label="商品单位" prop="unit">
                <Input v-model="purchaseForm.unit"></Input>
            </FormItem>
            <FormItem label="采购价格" prop="price">
                <Input v-model="purchaseForm.price"></Input>
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
          default: '新增总部采购商品表'
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
          purchaseNo: [
            {required: true, message: '关联采购单号不能为空！', trigger: 'blur'}
          ],
          productId: [
            {type: 'number', required: true, message: '关联商品ID不能为空！', trigger: 'blur'}
          ],
          productName: [
            {required: true, message: '商品名称不能为空！', trigger: 'blur'}
          ],
          productNo: [
            {required: true, message: '商品条码不能为空！', trigger: 'blur'}
          ],
          number: [
            {type: 'number', required: true, message: '商品采购数量不能为空！', trigger: 'blur'}
          ],
          specifications: [
            {type: 'number', required: true, message: '商品规格不能为空！', trigger: 'blur'}
          ],
          unit: [
            {required: true, message: '商品单位不能为空！', trigger: 'blur'}
          ],
          price: [
            {required: true, message: '采购价格不能为空！', trigger: 'blur'}
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
          purchaseNo: null,
          productId: null,
          productName: null,
          productNo: null,
          number: null,
          specifications: null,
          unit: null,
          price: null,
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
          path: this.apis.erpPurchaseProduct.view,
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
              path: this.apis.erpPurchaseProduct.add,
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
