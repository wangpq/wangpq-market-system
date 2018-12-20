<template>
    <Modal id="discrepancyFormDialog"
           v-model="initOption.visible"
           :mask-closable="false">
        <p slot="header" style="color:#f60;text-align:center;">
            <Icon type="information-circled"></Icon>
            <span>{{initOption.title}}</span>
        </p>
        <Form ref="discrepancyForm"
              :model="discrepancyForm"
              :rules="formRules"
              :label-width="90">

          <Form-item label="差异类型"  prop="orderType">
            <Select class="selectCondition" v-model="discrepancyForm.type" clearable>
              <Option v-for="item in getDict(apis.dictType.stockDiscrepancyType)" :value="item.value" :key="item.value">
                {{item.label }}
              </Option>
            </Select>
          </Form-item>

            <FormItem label="仓库" prop="warehouseId">
                <Input v-model="discrepancyForm.warehouseId"></Input>
            </FormItem>

            <FormItem label="商品条码" prop="productNo">
            <Input v-model="discrepancyForm.productNo"></Input></FormItem>

            <FormItem label="商品名称" prop="productName">
            <Input v-model="discrepancyForm.productName"></Input></FormItem>

            <FormItem label="规格" prop="specifications">
                <Input v-model="discrepancyForm.specifications"></Input></FormItem>

            <FormItem label="单位" prop="unit">
                <Input v-model="discrepancyForm.unit"></Input></FormItem>

            <FormItem label="数量" prop="number">
                <Input v-model="discrepancyForm.number"></Input></FormItem>

            <FormItem label="生产日期" prop="produceTime">
              <Input v-model="discrepancyForm.produceTime"></Input></FormItem>

        </Form>
        <div slot="footer">
            <Button type="primary" @click="$parent.discrepancyFormInitOption.visible = false"
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
  import SelectCombo from '@/components/common/SelectCombo'

  //this.$refs.regions.getRegions();
  export default {

    name: 'discrepancyFormDialog',
    props: {
      initOption: {
        title: {
          type: String,
          default: '新增差异库存'
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
          warehouseId: [
            {required: true, message: '仓库不能为空', trigger: 'blur'}
          ],
          productNo: [
            {required: true, message: '商品条码不能为空', trigger: 'blur'}
          ],
          specifications:[
            {required: true, message: '规格不能为空', trigger: 'blur'}
          ],
          unit: [
            {required: true, message: '单位不能为空', trigger: 'blur'}
          ],
          number: [
            {required: true, message: '数量不能为空', trigger: 'blur'}
          ]
          // country: [
          //   {required: true, message: '所属区域不能为空', trigger: 'blur'}
          // ],
        },
        discrepancyForm: {
          id: this.initOption.id,
          type:null,
          warehouseId:null,
          productNo: null,
          productName: null,
          specifications:null,
          unit: null,
          number: null,
          produceTime:null
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

      setDict () {
        // this.getDict('shop_type', 'shopType')
        // this.getDict('deliver_price_type', 'deliverPriceType')
      },

      //选择 父级菜单之后回调方法
      selectAreaNode (opt) {
        this.discrepancyForm.ofAreaId = opt.id
        this.discrepancyForm.country = opt.title
        console.log('选择父级菜单之后回调值：' + opt.id + opt.title)
      },

      getInfo () {
        $http({
          path: this.apis.discrepancyManage.view,
          method: 'get',
          data: {id: this.initOption.id}
        }).then(response => {
          var res = response.data
          if (res.success) {
            this.copyValue(res.data, this.discrepancyForm)
            // this.$refs.AreaTreeCombo.setNodeName(this.discrepancyForm.country)
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
          }
        })
      },
      handleSubmit () {
        this.$refs.discrepancyForm.validate((valid) => {
          console.log('valid:' + valid)
          if (valid) {
            let ajaxParams={};
            if(this.initOption.action == 'edit'){
              ajaxParams={
                path: this.apis.discrepancyManage.update,
                method: 'put',
                data: this.discrepancyForm
              }
            }else{
              ajaxParams={
                path: this.apis.discrepancyManage.save,
                method: 'post',
                data: this.discrepancyForm
              }
            }
            $http(ajaxParams).then(response => {
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
          this.$parent.discrepancyFormInitOption.visible = false
        } else {
          this.$Notice.error({
            title: '提示',
            desc: obj.message
          })
        }
      },
      reset () {
        this.clearObjData(this.discrepancyForm)
        // this.discrepancyForm.ofAreaId = null
        // this.discrepancyForm.country = null
      },
    },
    mounted () {
      this.setDict()
    },
    components: {
      SelectCombo
    }
  }
</script>
<style>
</style>
