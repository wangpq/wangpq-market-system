<template>
  <div>
    <Modal id="ActionDialog"
      v-model="initOption.visible"
      :mask-closable="false"
      width=480
    >
      <div slot="header" class="dialog-header">
        <Icon type="information-circled"></Icon>
        <span>{{initOption.title}}</span>
      </div>
      <div class="detail-page">
          <Form ref="dialogForm" :model="dialogForm" style="padding:0 68px;">

            <ul class="detail-list">
              <li>
                <div class="cell">
                  <label for="">客户经理：</label>
                </div>
                <div class="cell">
                  <span>{{dialogForm.checkedName}}</span>
                </div> 
              </li>
              <li>
                <div class="cell">
                  <label for="">配送门店：</label>
                </div> 
                <div class="cell">
                  <span>{{dialogForm.chainName}}</span>
                </div> 
              </li>
              <li>
                <div class="cell">
                  <label for="">配送单号：</label>
                </div> 
                <div class="cell">
                  <span>{{dialogForm.deliverNo}}</span>
                </div>   
              </li>
              <li>
                <div class="cell">
                  <label for="">应结算金额：</label>
                </div> 
                <div class="cell">
                  <span>{{dialogForm.total}} 元</span>
                </div>   
              </li>
              <li>
                <div class="cell">
                  <label for="">应结算日期：</label>
                </div> 
                <div class="cell">
                  <span>{{dialogForm.expPayTime}}</span>
                </div>  
              </li>
              <li>
                <div class="cell">
                   <label for=""><b>*</b>实际结算金额：</label>
                </div> 
                <div class="cell">
                  <Input class="Input" placeholder="请输入实际结算金额" v-model="dialogForm.totalPay"/>
                </div>  
              </li>
              <li>
                <div class="cell">
                  <label for=""><b>*</b>实际结算日期：</label>
                </div> 
                <div class="cell">
                  <DatePicker 
                    :value="dialogForm.actPayTime" 
                    type="datetime" 
                    placeholder="请选择实际结算日期"
                    style="width:100%;"
                    @on-change="onActDateChange"
                  >
                  </DatePicker>
                </div> 
              </li>
              <li>
                <div class="cell">
                  <label for=""><b>*</b>结算方式：</label>
                </div> 
                <div class="cell">
                  <Select v-model="dialogForm.accountWay" @on-change="onAccountWayChange">
                    <Option v-for="item in accountWayArray" :value="item.value" :key="item.value">{{ item.name }}</Option>
                  </Select>
                </div>  
              </li>
              <li v-if="dialogForm.accountWay==1">
                <div class="cell">
                  <label for=""><b>*</b>结算银行名称：</label>
                </div> 
                <div class="cell">
                 <Input class="Input" placeholder="请输入结算银行名称" v-model="dialogForm.accountBank"/>
                </div> 
              </li>
              <li v-if="dialogForm.accountWay==1">
                <div class="cell">
                   <label for=""><b>*</b>结算银行账户：</label>
                </div> 
                <div class="cell">
                   <Input class="Input" placeholder="请输入结算账户" v-model="dialogForm.accountBankNo"/>
                </div>  
              </li>
              <li>
                <div class="cell">
                  <label for=""><b>*</b>当前操作人员：</label>
                </div> 
                <div class="cell">
                  <Input class="Input" placeholder="请输入当前操作人员" v-model="dialogForm.accounterName"/>
                </div>    
              </li>
            </ul>
            <!--
            <FormItem label="客户经理：">
                <Input class="Input" disabled v-model="dialogForm.checkedName"/>
            </FormItem>
            <FormItem label="配送门店：">
                <Input class="Input" disabled v-model="dialogForm.chainName"/>
            </FormItem>
            <FormItem label="配送单号：">
                <Input class="Input" disabled v-model="dialogForm.deliverNo"/>
            </FormItem>
            <FormItem label="应结算金额：">
                <Input class="Input" disabled v-model="dialogForm.total"/>
            </FormItem>
            <FormItem label="应结算日期：">
                <Input class="Input" disabled  v-model="dialogForm.expPayTime"/>
            </FormItem>
            <FormItem label="实际结算金额：" prop="totalPay">
                <Input class="Input" placeholder="请输入实际结算金额" v-model="dialogForm.totalPay"/>
            </FormItem>
            <FormItem label="实际结算日期：" prop="actPayTime">
                <DatePicker 
                  :value="dialogForm.actPayTime" 
                  type="datetime" 
                  placeholder="请选择实际结算日期"
                  style="width:100%;"
                  @on-change="onActDateChange"
                >
                </DatePicker>
            </FormItem>
            <FormItem label="结算方式："  prop="accountWay">
              <Select v-model="dialogForm.accountWay" @on-change="onAccountWayChange">
                <Option v-for="item in accountWayArray" :value="item.value" :key="item.value">{{ item.name }}</Option>
              </Select>
            </FormItem>
            <FormItem label="结算银行名称：" prop="accountBank" v-if="dialogForm.accountWay==1">
                <Input class="Input" placeholder="请输入结算银行名称" v-model="dialogForm.accountBank"/>
            </FormItem>
            <FormItem label="结算账户：" prop="accountBankNo" v-if="dialogForm.accountWay==1">
                <Input class="Input" placeholder="请输入结算账户" v-model="dialogForm.accountBankNo"/>
            </FormItem>
            <FormItem label="当前操作人员：" prop="accounterName">
                <Input class="Input" placeholder="请输入当前操作人员" v-model="dialogForm.accounterName"/>
            </FormItem>
            -->
          </Form>

          <div style="padding:0 80px;">
            <div>
              <Upload
                ref="upload"
                :show-upload-list="false"
                :default-file-list="defaultList"
                :on-success="handleSuccess"
                :format="['jpg','jpeg','png']"
                :max-size="2048"
                :on-format-error="handleFormatError"
                :on-exceeded-size="handleMaxSize"
                :before-upload="handleBeforeUpload"
                multiple
                type="drag"
                :action="uploadPath"
                style="display: inline-block;;"
              >
                <Button icon="ios-camera" type="info">上传凭证</Button>
              </Upload>
            </div>

            <div v-show="uploadList.length>0">
              <div>凭证列表：</div>
              <ul>
                <li class="upload-list" v-for="(item,index) in uploadList" :key="index">
                    <template v-if="item.status === 'finished'">
                        <img :src="item.fullUrl">
                        <div class="upload-list-cover">
                            <Icon type="ios-eye-outline" @click.native="handleView(item.fullUrl)"></Icon>
                            <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                        </div>
                    </template>
                    <template v-else>
                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                </li>
              </ul>
            </div>

          </div>


      </div>
  
      <div slot="footer">
        <div class="btn-group" style="text-align:center;">
          <Button type="default" @click="initOption.visible=false">取消</Button>
          <Button type="primary" @click="onBtnAccountTap">生成结算单</Button> 
        </div>
      </div>
    </Modal>

    <!--查看图片模态框-->
    <Modal title="查看图片" v-model="visible">
      <img :src="fullUrl" v-if="visible" style="width: 100%">
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
        uploadPath : this.apis.EXTRA.uploadFile,
        defaultList: [],
        fullUrl: '',
        visible: false,
        uploadList: [],
        dialogForm: {
          totalPay :"",
          actPayTime : "",
          accountWay : "",
          accountBankNo : "",
          accountBank : "",
          accounterName : ""
        },
        rules : [],
        rulesNormal : [
          { 
            name : "totalPay",
            required: true, 
            message: '实际结算金额不能为空', 
          },
          { 
            name : "actPayTime",
            required: true, 
            type: 'string',
            message: '请选择实际结算日期', 
          },
          { 
            name : "accountWay",
            required: true, 
            message: '请选择结算方式'
          },
          { 
            name : "accounterName",
            required: true, 
            message: '请输入当前操作人员',
          }
        ],
        rulesMore : [
          { 
            name : "accountBank",
            required: true, 
            message: '请输入结算银行名称', 
          },
          { 
            name : "accountBankNo", 
            required: true, 
            message: '请选择结算账户', 
          }
        ],
        accountWayArray : [
          {
            name : "转账",
            value : 1
          },
          {
            name : "现金",
            value : 2
          },
          {
            name : "支票",
            value : 3
          },
          {
            name : "电汇",
            value : 4
          },
          {
            name : "其他",
            value : 99
          }
        ],
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
    mounted () {
      this.uploadList = this.$refs.upload.fileList;
    },
    methods: {
      init () {  
        // 初始化表单 
        this.dialogForm=this.initOption.row;
        if(this.dialogForm.accountWay==1){
          let rulesNormal=this.rulesNormal;
          let rulesMore=this.rulesMore;
          this.rules= rulesNormal.concat(rulesMore);   
        }else{
          let rulesNormal=this.rulesNormal;
          this.rules= rulesNormal;   
        }
      },
      handleResult (obj) {
        if (obj.success) {
          this.$Notice.success({
            title: '提示',
            desc: '保存成功！'
          })
          this.$parent.$children[0].query()
          this.$parent.dialogFormInitOption.visible = false
        } else {
          this.$Notice.error({
            title: '提示',
            desc: obj.message
          })
        }
      },
      onAccountWayChange(val){
        if(val==1){
          let rulesNormal=this.rulesNormal;
          let rulesMore=this.rulesMore;
          this.rules= rulesNormal.concat(rulesMore);   
        }else{
          let rulesNormal=this.rulesNormal;
          this.rules= rulesNormal;   
        }
      },
      reset () {
        this.clearObjData(this.dialogForm)
      },
      onActDateChange(date_1,data_2){ 
        this.dialogForm.actPayTime=date_1;
      },
      onBtnAccountTap(){ 
        let flag=true;
        this.rules.forEach((item)=>{
          if(this.dialogForm[item.name]=="" || this.dialogForm[item.name]==null){
            this.$Message.warning(item.message);
            flag=false;
          }
        })
        if(!flag){
          return false;
        }

        let fileListStr="";
        this.$refs.upload.fileList.forEach((item,index) => {
          let temp=",";
          temp= index==0 ?  "" : ",";
          fileListStr+=temp+item.name;
        });

        $http({
          path: this.apis.financeManage.action,
          method: 'post',
          data: {
            accountBank  : this.dialogForm.accountBank,
            accountBankNo  : this.dialogForm.accountBankNo,
            accountWay   : this.dialogForm.accountWay,
            actPayTime    : this.dialogForm.actPayTime,
            id   : this.dialogForm.id,
            no   : this.dialogForm.no,
            payDoc    : fileListStr,
            remark     : "配送单"+this.dialogForm.deliverNo+"生成结算单",
            totalPay    : this.dialogForm.totalPay,
          }
        }).then(response => {  
          let res = response.data
          if (res.success) {
            this.$Notice.success({
              title: '提示',
              desc: "成功生成结算单！"
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
      },
      onBtnDownloadTap(){
        alert("onBtnDownloadTap");
      },
      onBtnPrintTap(){
        alert("onBtnPrintTap");
      },
      // 预览大图
      handleView (fullUrl) {
        this.fullUrl = fullUrl;
        this.visible = true;
      },
      // 删除选中缩略图
      handleRemove (file) {
        const fileList = this.$refs.upload.fileList;
        this.$refs.upload.fileList.splice(fileList.indexOf(file), 1);
      },
      // 
      handleSuccess (res, file) {    
        if(res.success){
          let data=res.data[0];
          file.url=this.apis.EXTRA.fileLoadUrl;
          file.name=data.shortPath;
          file.fullUrl=file.url+file.name;
        }
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '文件格式不正确',
          desc: '上传文件' + file.name + '格式不正确, 请选择jpg或者png图片。'
        });
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '上传文件大小超过限制',
          desc: '上传文件' + file.name + ' 太大, 超过了2M。'
        });
      },
      handleBeforeUpload () {
        const check = this.uploadList.length < 5;
        if (!check) {
          this.$Notice.warning({
              title: '最多只能上传5张图片.'
          });
        }
        return check;
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
