<template>
  <div>
    <Modal id="EditPriceDialog"
      v-model="initOption.visible"
      :mask-closable="false"
      width=440
    >
      <div slot="header" class="dialog-header">
        <Icon type="information-circled"></Icon>
        <span>{{initOption.title}}</span>
      </div>
      <div class="detail-page">
          <Form ref="dialogForm" :model="dialogForm" style="padding:0 88px;">
            <FormItem label="商品名称：">
                <Input class="Input" disabled v-model="dialogForm.productName"/>
            </FormItem>
            <FormItem label="规格：">
                <Input class="Input" disabled v-model="dialogForm.specification"/>
            </FormItem>
            <FormItem label="单位：">
                <Input class="Input" disabled v-model="dialogForm.unit"/>
            </FormItem> 
            <FormItem label="进货价：">
                <Input class="Input" v-model="dialogForm.price"/>
            </FormItem> 
          </Form>
      </div>
  
      <div slot="footer">
        <div class="btn-group" style="text-align:center;">
          <Button type="default" @click="initOption.visible=false">取消</Button>
          <Button type="primary" @click="onBtnOk">确定</Button> 
        </div>
      </div>
    </Modal>

  </div>
</template>
<script>
  import $http from '@/utils/httputils'

  export default {
    components: {
    },
    props: {
      initOption: {
        title: {
          type: String,
          default: '新增商品分类'
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
        dialogForm: {
        }
      }
    },
    methods: {
      init () {  
        // 初始化表单 
        this.dialogForm=this.initOption.row;
        this.dialogForm.price=String(this.dialogForm.price);
      },
      reset () {
        this.clearObjData(this.dialogForm)
      },
      onBtnOk(){ 
        let price=this.dialogForm.price.trim();
        if(price==""){
          this.$Message.warning('请输入商品订货价！');
          return false;
        }
        if(isNaN(price)){ 
          this.$Message.warning('请正确输入订货价！');
          return false;
        }else{
          if(parseFloat(price)<=0){
            this.$Message.warning('请正确输入订货价！');
            return false;
          }
        }

        $http({
          path: this.apis.chainStock.update,
          method: 'post',
          data: {
            "id": this.dialogForm.id,
            "isActive": this.dialogForm.isActive,
            "price": this.dialogForm.price.trim(),
            "productId": this.dialogForm.productId,
            "productName": this.dialogForm.productName,
            "productNo": this.dialogForm.productNo,
            "specification": this.dialogForm.specification,
            "unit": this.dialogForm.unit,
          }
        }).then(response => {  
          let res = response.data
          if (res.success) {
            this.$Notice.success({
              title: '提示',
              desc: "成功修改商品订货价！"
            })
            this.$parent.$children[0].query()
            this.initOption.visible=false;
          } else { 
            this.$Notice.error({
              title: '提示',
              desc: res.message
            })
          }
        })
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

.upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
}
.upload-list img{
    width: 100%;
    height: 100%;
}
.upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
}
.upload-list:hover .upload-list-cover{
    display: block;
}
.upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
}

.detail-page{
  max-height:540px;
  overflow:auto;
}
.detail-list{
  padding:0;
}
.detail-list>li{
  list-style: none;
  font-size:12px;
  line-height: 1;
  padding:10px 0;
  display: flex;
}
.detail-list>li>.cell:first-child{
  width:100px;
  display: flex;
  flex-direction: row;
  align-items:center;
  justify-content:center;
}
.detail-list>li>.cell:last-child{
  flex:1;
}
.detail-list>li>.cell:first-child>label{
  width:100%;
  text-align: right;
  display: inline-block;
}
.detail-list>li>.cell:first-child b{
  color:#f00;
  font-size:14px;
  font-weight: bold;
  margin:2px;
}
.detail-list>li>.cell:last-child>div{
  width:100%;
}
.detail-list>li>.cell:last-child>span{
  width:100%;
  padding:0 4px;
}
</style>
