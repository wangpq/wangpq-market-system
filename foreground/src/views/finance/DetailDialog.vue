<template>
  <div>
    <Modal id="DetailDialog"
      v-model="initOption.visible"
      :mask-closable="false"
      width=560
    >
      <div slot="header" class="dialog-header">
        <Icon type="information-circled"></Icon>
        <span>{{initOption.title}}</span>
      </div>
      <div class="detail-page">
          <ul class="detail-list">
            <li>
                <label for="">客户经理：</label>
                <span>{{dialogForm.checkedName}}</span>
            </li>
            <li>
                <label for="">配送门店：</label>
                <span>{{dialogForm.chainName}}</span>
            </li>  
            <li>
                <label for="">配送单号：</label>
                <span>{{dialogForm.deliverNo}}</span>
            </li>  
            <li>
                <label for="">应结算金额：</label>
                <span>{{dialogForm.total}}</span>
            </li> 
            <li>
                <label for="">应结算日期：</label>
                <span>{{dialogForm.expPayTime}}</span>
            </li> 
            <li>
                <label for="">实际结算金额：</label>
                <span>{{dialogForm.totalPay}}</span>
            </li> 
            <li>
                <label for="">实际结算日期：</label>
                <span>{{dialogForm.actPayTime}}</span>
            </li> 
            <li>
                <label for="">结算方式：</label>
                <span>{{dialogForm.accountWay}}</span>
            </li> 
            <li>
                <label for="">结算银行名称：</label>
                <span>{{dialogForm.accountBank}}</span>
            </li> 

            <li>
                <label for="">结算账户：</label>
                <span>{{dialogForm.accountBankNo}}</span>
            </li>  
         
            <li>
                <label for="">操作人员：：</label>
                <span>{{dialogForm.accounterName}}</span>
            </li>  
            <li v-show="dialogForm.payDocArray && dialogForm.payDocArray.length>0" class="upload-wrap">
              <h4>凭证列表：</h4>
              <ul>
                <li class="upload-list" v-for="(item,index) in dialogForm.payDocArray" :key="index">
                  <img :src="item.fullUrl">
                  <div class="upload-list-cover">
                      <Icon type="ios-eye-outline" @click.native="handleView(item.fullUrl)"></Icon>
                  </div>
                </li>
              </ul>
            </li>
            <li>
              <label for="">发票打印次数：</label>
              <span>{{printCount}}</span>
            </li>  
          </ul>
      </div>
  
      <div slot="footer">
        <div class="btn-group" style="text-align:center;">
          <Button type="default" @click="initOption.visible=false">取消</Button>
          <Button type="primary" @click="onBtnPrintTap">打印发票</Button> 
        </div>
      </div>
    </Modal>

    <!--查看图片模态框-->
    <Modal title="查看图片" v-model="imgVisible">
      <img :src="fullUrl" v-if="imgVisible" style="width: 100%;max-height:480px;">
    </Modal>

  </div>
</template>
<script>
  import $http from '@/utils/httputils'
  import TableForm from '@/components/common/TableForm'

  export default {
    components: {
      TableForm
    },
    props: {
      initOption: {
        title: {
          type: String,
          default: '新增商品分类'
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
        // 大图可见
        imgVisible: false,
        // 打印次数
        printCount : 0,
        dialogForm: {
        }
      }
    },
    methods: {

      init () {   
        // 初始化表单 
        this.dialogForm=this.initOption.row; 
        this.dialogForm.accountWay=this.formatAccountWay(this.dialogForm.accountWay);
        this.dialogForm.payDocArray=this.formatPayDoc(this.dialogForm.payDoc);
      },
      formatPayDoc(payDoc){
        let arr=payDoc.split(",");
        let tempArr=[];
        arr.forEach(item => {
          tempArr.push({
            url : this.apis.EXTRA.fileLoadUrl,
            name : item,
            fullUrl : this.apis.EXTRA.fileLoadUrl+item
          })
        });
        return tempArr;
      },
      formatAccountWay(val){
        switch(val){
          case 1 :
           return  "转账";
          case 2 :
           return  "现金";
          case 3 :
           return  "支票";
          case 4 :
           return  "电汇";
          case 5 :
           return  "其他";
        }
      },
      onBtnPrintTap(){
        alert("onBtnPrintTap");
        this.initOption.visible=false;
      },
      // 预览大图
      handleView (fullUrl) {
        this.fullUrl = fullUrl;
        this.imgVisible = true;
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
  margin-bottom:6px!important;
}
.detail-list{
  padding:28px 80px 0;
}
.detail-list>li{
  list-style: none;
  font-size:14px;
  line-height: 1;
  padding:8px 0;
}
.upload-wrap h4{
  font-weight: normal;
  margin-bottom:8px;
}
.upload-list{
    display: inline-block;
    width: 48px;
    height: 48px;
    text-align: center;
    line-height: 48px;
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
    font-size: 28px;
    cursor: pointer;
    margin: 0 2px;
}
.detail-page{
  max-height:540px;
  overflow:auto;
}
</style>
