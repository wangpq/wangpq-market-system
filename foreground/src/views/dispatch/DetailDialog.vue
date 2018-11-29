<template>
  <div>
    <Modal id="DetailDialog"
      v-model="initOption.visible"
      :mask-closable="false"
      width=980
    >
      <div slot="header" class="dialog-header">
        <Icon type="information-circled"></Icon>
        <span>{{initOption.title}}</span>
      </div>
      <div class="detail-page">
        <TableForm
          ref="detialTableForm"
          :url="apis.orderManage.orderDetail"
          :ajaxParams="ajaxParams"
          method="post"
          :columns="columns"
          :form="dialogForm"
          :rules="rules"
        >
          <template slot="form">
            <FormItem label="订货单号：" prop="callNo">
                <Input class="Input" disabled v-model="dialogForm.callNo"/>
            </FormItem>
            <FormItem label="订货门店：" prop="chainName">
                <Input class="Input" disabled v-model="dialogForm.chainName"/>
            </FormItem>
            <FormItem label="接收人：" prop="applyName">
                <Input class="Input" disabled v-model="dialogForm.applyName"/>
            </FormItem>
            <FormItem label="配送日期：" prop="deliverTime">
                <Input class="Input" disabled v-model="dialogForm.deliverTime"/>
            </FormItem>
            <FormItem label="配送人：" prop="deliverName">
                <Input class="Input" v-if="initOption.page=='detail'" disabled v-model="dialogForm.deliverName"/>
                <Input class="Input" v-else placeholder="请输入配送人"  v-model="dialogForm.deliverName"/> 
            </FormItem>
            <FormItem label="配送电话：" prop="deliverPhone">
                <Input class="Input" v-if="initOption.page=='detail'" disabled v-model="dialogForm.deliverPhone"/>
                <Input class="Input" v-else placeholder="请输入配送电话" v-model="dialogForm.deliverPhone"/>   
            </FormItem>
            <FormItem label="出库单号：" prop="outNo">
                <Input class="Input" disabled v-model="dialogForm.outNo"/>
            </FormItem>
            <FormItem label="配送单号：" prop="no">
                <Input class="Input" disabled v-model="dialogForm.no"/>
            </FormItem>
          </template>
        </TableForm>
      </div>
  
      <div slot="footer">
        <div class="btn-group" style="text-align:center;">
          <Button type="default" @click="initOption.visible=false">返回</Button>
          <Button type="primary" v-if="initOption.page!='detail'" @click="onBtnDispatchTap">确认配送单</Button> 
          <Button type="primary" @click="onBtnDownloadTap">下载</Button>
          <Button type="info" @click="onBtnPrintTap">打印</Button>
        </div>
      </div>
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
        ajaxParams : {},
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
        ],

        dialogForm: {
        },
        rules : {
          deliverTime: [
            { 
              required: true, 
              message: '配送时间不能为空！', 
              trigger: 'blur' 
            }
          ],
          deliverName: [
            { 
              required: true, 
              message: '配送人不能为空！', 
              trigger: 'blur' 
            }
          ],
          deliverPhone: [
            { 
              required: true, 
              message: '配送人电话不能为空！', 
              trigger: 'blur' 
            }
          ]
        }
      }
    },

    methods: {
      init () {  
        // 初始化表单 
        this.dialogForm=this.initOption.row;
        // 初始化表格ajax参数
        this.ajaxParams.callNo=this.initOption.row.callNo;  
        this.ajaxParams.limit=6;
        this.ajaxParams.pageIndex=1;
        this.$refs.detialTableForm.loadData();
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
      reset () {
        this.clearObjData(this.dialogForm)
      },
      onBtnDispatchTap(){ 
       
        /*
        if(this.dialogForm.deliverName=="" || this.dialogForm.deliverName==null){
            this.$Notice.error({
              title: '提示',
              desc:'配送人不能为空！'
            })
            return false;
        }
        if(this.dialogForm.deliverPhone=="" || this.dialogForm.deliverPhone==null){
            this.$Notice.error({
              title: '提示',
              desc:'配送人电话不能为空！'
            })
            return false;
        }
        */
        this.$refs.detialTableForm.validateRules().then(()=> {
          $http({
            path: this.apis.dispatchManage.confirm,
            method: 'post',
            data: {
              no  : this.dialogForm.no,
              deliverPhone : this.dialogForm.deliverPhone,
              deliverName : this.dialogForm.deliverName,
              deliverId : this.dialogForm.deliverId
            }
          }).then(response => {   
            let res = response.data
            if (res.success) {
              this.$Notice.success({
                title: '提示',
                desc:'确认配送单操作成功！！'
              })
              this.$parent.$children[0].query();
              this.initOption.visible=false;
            } else { 
              this.$Notice.error({
                title: '提示',
                desc: res.message
              })
            }
          })
        })
      },
      onBtnDownloadTap(){
        alert("onBtnDownloadTap");
      },
      onBtnPrintTap(){
        alert("onBtnPrintTap");
      }
    }
  }
</script>
<style>
.dialog-header{
  color:#f60;
  text-align:center;
  font-size:14px;
  font-weight:bold;
}
</style>
