<template>
  <div>
    <Modal id="ActionDialog"
      v-model="initOption.visible"
      :mask-closable="maskClosable"
      :width="modalWidth"
      style="z-index:999;position:relative;"
    >
      <div slot="header" class="dialog-header">
        <Icon type="information-circled"></Icon>
        <span>{{initOption.title}}</span>
      </div>
      <div class="detail-page">
          <Form 
            ref="dialogForm" 
            :model="dialogForm" 
            :rules="formRules"
            style="padding:0 68px;"
          >
            <FormItem label="门店ID列表：" prop="chainIds">
              <store-select 
                :ids="chainIds"
                v-model="storeSelectVisible"
                ref="storeSelect"
                @on-select-ok="onStoreSelectOk"
              >
              </store-select >
            </FormItem>
            <FormItem label="调价单生效时间：" prop="effectTime">
                <DatePicker 
                  :value="dialogForm.effectTime" 
                  type="datetime" 
                  placeholder="请选择调价单生效时间"
                  style="width:100%;"
                  @on-change="onDateChange"
                >
                </DatePicker>
            </FormItem>
            <FormItem label="调价商品列表：" prop="productsString">
              <div class="btn-group" v-if="initOption.action=='edit'" >
                <Input class="Input" :rows=1 type="textarea" placeholder="请双击选择调价商品" v-model="productsString"  @dblclick.native="onProductAdjustPriceDblClick" ref="productsTextarea"/>
                <ButtonGroup shape="circle">
                  <Button type="primary" size="small" @click="onBtnView">详情</Button>
                  <Button type="error" size="small" @click="onBtnEdit">修改</Button> 
                </ButtonGroup>
              </div>
              <Input class="Input" :rows=1 type="textarea" v-if="initOption.action=='add'" placeholder="请双击选择调价商品" v-model="productsString"  @dblclick.native="onProductAdjustPriceDblClick" ref="productsTextarea"/>
            </FormItem>
            <FormItem label="备注：" prop="remark">
                <Input class="Input" :rows=1 type="textarea"  placeholder="请输入备注" v-model="dialogForm.remark"/>
            </FormItem>
          </Form>
      </div>
  
      <div slot="footer">
        <div class="btn-group" style="text-align:center;">
          <Button type="default" @click="initOption.visible=false">取消</Button>
          <Button type="primary" @click="onBtnSave">保存</Button> 
        </div>
      </div>
    </Modal>

    

    <!-- 查询调价商品+修改价格 -->
    <ProductAdjustPrice 
       ref="productAdjustPrice"
      :initOption="prdAdjustPriceOptions" 
      @on-ok="onSelectOk" 
      v-model="dialogForm.products"
    >
    </ProductAdjustPrice>

    <!-- 查看调价商品 -->
    <ProductAdjustList 
       ref="productAdjustList"
      :initOptions="prdAdjustListOptions" 
    >
    </ProductAdjustList>

  </div>
</template>
<script>
  import $http from '@/utils/httputils'
  import TableForm from '@/components/common/TableForm'
  import ProductAdjustPrice from '@/components/common/ProductAdjustPrice'
  import StoreSelect from '@/components/common/StoreSelect'
  import ProductAdjustList from '@/views/chain/adjust/ProductAdjustList'

  export default {
    components: {
      TableForm,
      ProductAdjustPrice,
      StoreSelect,
      ProductAdjustList
    },
    props: {
      initOption: {
        title: {
          type: String,
          default: ''
        },
        action: {
          type: String,
          default: 'add'
        },
        visible: {
          type: Boolean
        },
        row: {
          type: Object
        }
      }
    },
    data () {
      return {
        modalWidth : 480,
        maskClosable : false,
        // 门店ID选择组件内部弹框是否可见
        storeSelectVisible : false,
        prdAdjustListOptions : {
          visible : false,
          row : {},
          oldList : [],
          newList : []
        },
        prdAdjustPriceOptions : {
          visible : false
        },
        dialogForm: {
        },
        chainIds : "",
        productsString  : "",

        formRules : {
          chainIds: [
            { 
              required: true, 
              message: '门店ID不能为空', 
              trigger: 'blur' 
            }
          ],
          effectTime: [
            { 
              required: true, 
              message: '调价单生效时间不能为空！', 
              trigger: 'blur' 
            }
          ],
          productsString: [
            { 
              required: true, 
              message: '调价商品不能为空！', 
              trigger: 'blur' 
            }
          ],
          remark: [
            { 
              required: true, 
              message: '备注不能为空！', 
              trigger: 'blur' 
            }
          ]
        },
        //表格 columns
        columns:[
          {
            title: '序号',
            type: 'index',
            minWidth:80,
            align: 'center'
          },
          {
            title: '条码',
            key: 'productNo',
            minWidth:140,
            align: 'center'
          },
          {
            title: '商品',
            key: 'productName',
            minWidth:140,
            align: 'center'
          },
          {
            title: '单位',
            key: 'unit',
            minWidth:60,
            align: 'center'
          },
          {
            title: '数量',
            key: 'number',
            minWidth:60,
            align: 'center'
          },
          {
            title: '规格',
            key: 'specification',
            minWidth:80,
            align: 'center'
          },
          {
            title: '配送价',
            key: 'price',
            minWidth:80,
            align: 'center',
            sortable:true
          },
          {
            title: '小计',
            key: 'totalPrice',
            minWidth:100,
            align: 'center',
            sortable:true
          }
        ]
      }
    },
    methods: {
      init () { 
        // 初始化表单 
        this.dialogForm=this.initOption.row;
        this.chainIds=this.dialogForm.chainIds;
        if(this.initOption.action=="add"){
          this.reset();
          this.dialogForm.products=[];
          this.productsString ="";
        }else{
          this.prdAdjustListOptions.newList=[];
          this.requestTable();
        }
      },
 
      onBtnView(){
        this.prdAdjustListOptions.visible=true;
        this.prdAdjustListOptions.row=this.dialogForm;
        this.$refs.productAdjustList.init();
      },
      onBtnEdit(){
        this.prdAdjustPriceOptions.visible=true;
        this.$refs.productAdjustPrice.init(); 
      },
      onProductAdjustPriceDblClick(){
        this.prdAdjustPriceOptions.visible=true;
        this.$refs.productAdjustPrice.init();
      },
      onChainIdsDblclick () { 
        this.storeSelectOptions.visible = true;
        this.$refs.storeSelect.init();
      },
      onStoreSelectOk (data) {  
        this.dialogForm.chainIds = data;
        this.chainIds= data;
      },
      onSelectOk (data) { 
        let products=[];
        data.forEach(item=>{
          products.push({
            productId : item.productId,
            price : item.price
          });
        })

        this.prdAdjustListOptions.newList=data;

        this.dialogForm.products = products;
        this.dialogForm.productsString = JSON.stringify(products);
        this.productsString = JSON.stringify(products);
        this.$refs.productsTextarea.focus();
      },
      onDateChange(date_1,data_2){ 
        this.dialogForm.effectTime=date_1;
      },
      reset () {
        this.clearObjData(this.dialogForm)
      },
      onBtnSave(){
        this.$refs.dialogForm.validate((valid) => {  
          if(!valid){
            return false;
          }
          let path="";
          let data={
            chainIds: this.dialogForm.chainIds,
            effectTime : this.dialogForm.effectTime,
            remark : this.dialogForm.remark
          }
          if(this.initOption.action=="add"){
            path=this.apis.chainReadjust.save;
            data.products  =  this.dialogForm.products;
          }else{ 
            path=this.apis.chainReadjust.update;
            data.readjustNo  =  this.dialogForm.no;
            data.products  =  this.dialogForm.products;
          }
          
          $http({
            path: path,
            method: 'post',
            data: data
          }).then(response => {   
            let res = response.data
            this.handleResult(res);
          })
        })

      },
      handleResult (obj) {
        if (obj.success) {
          this.$Notice.success({
            title: '提示',
            desc: '保存成功！'
          })
          this.initOption.visible=false;
          this.$parent.$children[0].query()
          this.$parent.initOption.visible = false
        } else {
          this.$Notice.error({
            title: '提示',
            desc: obj.message
          })
        }
      },
      requestTable(){ 
          $http({
            path: this.apis.chainReadjust.product,
            method: 'post',
            data: {
              "readjustNo" : this.initOption.row.no
            }
          }).then(response => {    
            let res = response.data;
            if(res.success){
              let products=this.formatProducts(res.data);  
              this.dialogForm.products = products;
              this.dialogForm.productsString = JSON.stringify(products);
              this.productsString = JSON.stringify(products);
              this.prdAdjustListOptions.oldList=res.data; 
            }
          })
      },
      formatProducts(arr){
        let products=[];
        arr.forEach(item=>{
          products.push({
            productId : item.productId,
            price : item.price
          });
        })
        return products;
      }


    }
  }
</script>
<style scoped>
.dialog-header{
  color:#f60;
  text-align:center;
  font-size:16px;
  font-weight:bold;
}
.ivu-form-item{
  margin-bottom:12px!important;  
}
.detail-page{
 height: 440px;
  overflow:auto;
}
</style>
