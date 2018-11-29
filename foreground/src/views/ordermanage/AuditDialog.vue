<template>
  <div>
    <Modal id="AuditDialog"
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
          ref="auditTableForm"
          :url="apis.orderManage.orderDetail"
          :ajaxParams="ajaxParams"
          method="post"
          :columns="columns"
          :form="dialogForm"
        >
          <template slot="form">
            <FormItem label="订货单号：" :label-width="80" >
                <Input class="Input" disabled v-model="dialogForm.no"/>
            </FormItem>
            <FormItem label="订货门店：" :label-width="80">
                <Input class="Input" disabled v-model="dialogForm.chainName"/>
            </FormItem>
            <FormItem label="订货人：" :label-width="80">
                <Input class="Input" disabled v-model="dialogForm.applyName"/>
            </FormItem>
            <FormItem label="审核人：" :label-width="80">
                <Input class="Input"  disabled v-model="dialogForm.auditName"/>
            </FormItem> 
            <FormItem label="到货日期：" :label-width="80">
                <Input class="Input"  disabled v-model="dialogForm.arriveTime"/>
            </FormItem> 
          </template>
        </TableForm>
        <NoteBook 
          :noteList="noteList" 
          :hasList="noteHasList" 
          :hasTextarea="noteHasTextarea" 
          @onChange="onNoteAreaChange"
        >
        </NoteBook>
      </div>
  
      <div slot="footer">
        <div class="btn-group" style="text-align:center;">
          <Button type="default" @click="initOption.visible=false">取消</Button>
          <Button type="primary" @click="onBtnAuditOkTap">审核通过</Button>
          <Button type="info" @click="onBtnAuditNoTap">审核驳回</Button>
        </div>
      </div>
    </Modal>
  </div>
</template>
<script>
  import $http from '@/utils/httputils'
  import TableForm from '@/components/common/TableForm'
  import NoteBook from '@/components/common/NoteBook'

  export default {
    components: {
      TableForm,
      NoteBook
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
        // 留言列表数组
        noteList : [],
        noteHasList : true,
        noteHasTextarea : true,
        // 内部沟通输入框
        textarea : "",
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
            minWidth:160,
            align: 'center'
          },
          {
            title: '商品',
            key: 'productName',
            minWidth:160,
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
            minWidth:80,
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
        }
      }
    },

    methods: {
      formatStatus(status){
        switch (status) {
          case 0:
            return '初始化';
            break;
          case 1:
            return '待审核';
            break;
          case 2:
            return '已审核';
          case 3:
            return '驳回';
          case 4:
            return '待出库';
          case 5:
            return '配送中';
          case 6:
            return '已入库';
          default:
            return '初始化';
        }
      },
      init () { 
        // 初始化表单 
        let formData=this.initOption.row;
        //formData.auditStatus=this.formatStatus(this.initOption.row.auditStatus); 
        this.dialogForm=formData;
        // 初始化表格ajax参数
        this.ajaxParams.callNo=this.initOption.row.no;  
        this.ajaxParams.limit=10;
        this.ajaxParams.pageIndex=1;
        this.$refs.auditTableForm.loadData();
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

      //选择树节点
      selectTree () {
        var $this = this
        $this.$refs.commTree.getSelectedNodes(function (node) {
          console.log(node)
          if (node && node.length > 0 && node[0].id) {
            $this.dialogForm.parentName = node[0].title
            $this.dialogForm.parentId = node[0].id
          }
        })
      },

      reset () {
        this.clearObjData(this.dialogForm)
      },
      onBtnAuditOkTap(){
        $http({
          path: this.apis.orderManage.orderAudit,
          method: 'put',
          data: {
            callNo : this.dialogForm.no
          }
        }).then(response => {  
          let res = response.data
          if (res.success) {
            this.$Notice.success({
              title: '提示',
              desc: "审核已通过！"
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
      },
      onBtnAuditNoTap(){
        $http({
          path: this.apis.orderManage.orderReject,
          method: 'put',
          data: {
            callNo : this.dialogForm.no,
            msg : this.textarea.trim()
          }
        }).then(response => { 
          let res = response.data
          if (res.success) {
            this.$Notice.success({
              title: '提示',
              desc: "成功驳回订货单！"
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
      },
      onNoteAreaChange(val){  
        this.textarea=val;
      },

      onSelectRange(e) { 
        this.dialogForm.arriveTime  = e + " 00:00:00"
      },


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
