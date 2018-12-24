<template>
  <div>
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

          <Form-item label="差异类型"  prop="type">
            <Select class="selectCondition" v-model="discrepancyForm.type" clearable >
              <Option v-for="item in getDict(apis.dictType.stockDiscrepancyType)" :value="item.value" :key="item.value">
                {{item.label }}
              </Option>
            </Select>
          </Form-item>

            <FormItem label="仓库" prop="warehouseId" >
                <Select class="selectCondition"  v-model="discrepancyForm.warehouseId" clearable  :label-in-value="true"  @on-change="v=>{setOption(v,'type')}" >
                  <Option v-for="item in selectList" :value="item.id" :key="item.id"  v-if="item.id == discrepancyForm.warehouseId" selected="true">
                    {{item.name }},{{item.id == discrepancyForm.warehouseId}},{{item.id}},{{discrepancyForm.warehouseId}},{{item.id - discrepancyForm.warehouseId}}
                  </Option>
                  <Option :value="item.id" :key="item.id"  v-else>
                    {{item.name }}
                  </Option>
                </Select>
            </FormItem>
            <FormItem label="商品条码" prop="productNo">
              <input class="ivu-input" v-model="discrepancyForm.productNo"
                     v-on:dblclick="initSelectProOption.visible=true" placeholder="双击选择商品" readonly></input>
            </FormItem>

            <FormItem label="商品名称" prop="productName">
            <Input v-model="discrepancyForm.productName" readonly></Input></FormItem>

            <FormItem label="规格" prop="specifications">
                <Input v-model="discrepancyForm.specifications" readonly></Input></FormItem>

            <FormItem label="单位" prop="unit">
                <Input v-model="discrepancyForm.unit" readonly></Input></FormItem>

            <FormItem label="数量" prop="number">
                <Input v-model="discrepancyForm.number"></Input></FormItem>

            <FormItem label="生产日期" prop="produceTime">
              <DatePicker type="date" v-model="discrepancyForm.produceTime"
                          format="yyyy-MM-dd" placeholder="选择生产日期"
                          style="width: 200px" @on-change="onActDateChange"></DatePicker>
            </FormItem>

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
    <ProductSpecSelectDialog :initOption="initSelectProOption"></ProductSpecSelectDialog>
  </div>
</template>
<script>
  import $http from '@/utils/httputils'
  // import SelectCombo from '@/components/common/SelectCombo'
  import ProductSpecSelectDialog from '@/components/common/ProductSpecSelectDialog'

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
            {type: 'number',required: true, message: '仓库不能为空', trigger: 'change'}
          ],
          productNo: [
            {required: true, message: '商品条码不能为空', trigger: 'blur'}
          ],
          /*specifications:[
            {required: true, message: '规格不能为空', trigger: 'blur'}
          ],
          unit: [
            {required: true, message: '单位不能为空', trigger: 'blur'}
          ],*/
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
          warehouseName:null,
          productId:null,
          productNo: null,
          productName: null,
          specifications:null,
          unit: null,
          number: null,
          produceTime:null
        },
        initSelectProOption: {
          visible: false,
          title: '选择商品'
        },
        selectList:[]
      }
    },
    // created(){
    //   //如果没有这句代码，select中初始化会是空白的，默认选中就无法实现
    //   this.discrepancyForm.warehouseId = this.selectList[0].warehouseId;
    // },
    methods: {

      init () {
        this.getWareHouseList();
        this.reset()
        if (this.initOption.action !== 'add') {
          this.getInfo();
        }

      },

      setDict () {
        // this.getDict('shop_type', 'shopType')
        // this.getDict('deliver_price_type', 'deliverPriceType')
      },
      onActDateChange(date_1){
        this.discrepancyForm.produceTime=date_1;
      },
      //选择 父级菜单之后回调方法
      setOption (value,type) {
        if(value){
          this.discrepancyForm.warehouseId = value.value
          this.discrepancyForm.warehouseName = value.label
          console.log("value.value:"+value.value)
        }
      },
      getWareHouseList(){
        $http({
          path: this.apis.warehouseManage.list,
          method: 'post',
          data: {}
        }).then(response => {
          let res = response.data
          if (res.success) {
            this.selectList=res.data.list
            console.log(this.selectList)
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
          }
        })
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
            this.discrepancyForm.warehouseId=res.data.warehouseId;
            this.discrepancyForm.warehouseName=res.data.warehouseName;
            console.log("id:"+this.discrepancyForm.warehouseId+",name:"+this.discrepancyForm.warehouseName)
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
      // SelectCombo,
      ProductSpecSelectDialog
    }
  }
</script>
<style>
</style>
