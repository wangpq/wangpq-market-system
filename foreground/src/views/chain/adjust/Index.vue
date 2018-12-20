<template>
<div class="layout-content">
  <div class="layout-content-main">
    <DataTable
      ref="dataTable"
      :url="apis.chainReadjust.list"
      method="post"
      :columns="columns"
      :searchForm="searchForm"
    >
      <template slot="search">
          <Form-item label="审核状态：" :label-width="labelWidth" prop="auditStatus">
            <Select v-model="searchForm.auditStatus" clearable>
                <Option v-for="item in auditStatusArray" :value="item.value" :key="item.value">
                  {{item.name }}
                </Option>
            </Select>
          </Form-item>
          <Form-item label="审核人员：" :label-width="labelWidth" prop="auditUserLike">
            <Input type="text" placeholder="请输入审核人员" v-model="searchForm.auditUserLike" />
          </Form-item>
          <Form-item label="调价单发起者：" :label-width="labelWidth" prop="originatorLike">
            <Input type="text" placeholder="请输入调价单发起者" v-model="searchForm.originatorLike" />
          </Form-item>
          <Form-item label="审核生效日期：" :label-width="labelWidth" prop="effectTime">
            <DatePicker 
              :clearable="false" 
              type="daterange" 
              v-model="effectTime"         
              @on-change="onDateRange" 
              format="yyyy-MM-dd" 
              placeholder="请选择审核生效日期"
            >
            </DatePicker>
          </Form-item>
      </template>
    </DataTable>

    <ActionDialog :initOption="initOption" ref="actionDialog"></ActionDialog>
  </div>
</div>
</template>
<script>
  import $http from '@/utils/httputils'
  import DataTable from '@/components/common/DataTable'
  import ActionDialog from '@/views/chain/adjust/ActionDialog'

  export default {
    components: {
      DataTable,
      ActionDialog
    },
    data () {
      return {
        labelWidth : 100,
        // 审核状态数组
        auditStatusArray : [
          {
            name : "未提交",
            value :  0
          },
          {
            name : "审核中",
            value : 1
          },
          {
            name : "驳回",
            value : 2
          },
          {
            name : "审核通过",
            value : 3
          }
        ],
        // 审核生效日期
        effectTime : "",
        searchForm : {
        },
        //表格 columns
        columns:[
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '序号',
            type: 'index',
            minWidth:80,
            align: 'center'
          },
          {
            title: '调价单单号',
            key: 'no',
            minWidth:120,
            align: 'center'
          },
          {
            title: '门店ID列表',
            key: 'chainIds',
            minWidth:100,
            align: 'center'
          }, 
          {
            title: '审核状态',
            key: 'auditStatus',
            sortable:true,
            minWidth:110,
            align: 'center',
            render: (h, params) => {
              let val = params.row.auditStatus;
              let res="";
              switch (val) {
                case 0:
                  res='未提交';
                  break;
                case 1:
                  res='审核中';
                  break;
                case 2:
                  res='驳回';
                  break;
                case 3:
                  res='审核通过';
                  break;
                default :
                  res='未提交';
              }
              return h('span', {}, res);
            }
          },
          {
            title: '审核模板ID',
            key: 'auditTemplateId',
            sortable: true,
            minWidth:120,
            align: 'center'
          },
          {
            title: '审核模板名称',
            key: 'auditTemplateName',
            minWidth:120,
            align: 'center'
          },
          {
            title: '调整商品数量',
            key: 'productNum',
            minWidth:120,
            align: 'center'
          },
          {
            title: '发起者',
            key: 'originator',
            minWidth:100,
            align: 'center'
          },
          {
            title: '备注',
            key: 'remark',
            minWidth:120,
            align: 'center'
          },
          {
            title: '调价单生效时间',
            key: 'effectTime',
            minWidth:150,
            align: 'center'
          },
          {
            title: '是否生效',
            key: 'orEffect',
            fixed : "right",
            minWidth:100,
            align: 'center',
            render: (h, params) => {
              let val = params.row.orEffect;
              let res="";
              switch (val) {
                case 0:
                  res='未生效';
                  break;
                case 1:
                  res='已生效';
                  break;
                default :
                  res='未生效';
              }
              return h('span', {}, res);
            }
          }
        ],
        initOption: {
          title: '',
          visible: false,
          action : "",
          row: {}
        }
      }
    },
    methods: {
      // 日期选择框事件
      onDateRange(e) {
        this.searchForm.effectTimeStart   = e[0] + " 00:00:00"
        this.searchForm.effectTimeEnd   = e[1] + " 23:59:59"
      },
      handleAdd(row){
        this.initOption.title="新增调价单"
        this.initOption.row={};
        this.initOption.action="add";
        this.initOption.visible=true;
        this.$refs.actionDialog.init();
      },
      handleEdit(row){ 
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.initOption.title="修改调价单";
        this.initOption.row=row;
        this.initOption.action="edit";  
        this.$refs.actionDialog.init();
        this.initOption.visible=true;
      },
      handleDelete(row){
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.$Modal.confirm({
          title: '请确认',
          content: '确定永久删除单号为【' + row.no + '】的调价单？',
          onOk: () => {
            $http({
              path: this.apis.chainReadjust.delete,
              method: 'delete',
              data: {ids: row.id}
            }).then(response => {
              if (response.data.success) {
                this.$Notice.success({
                  title: '提示',
                  desc: '【' + row.name + '】删除成功！'
                })
                this.$refs.dataTable.refresh();
              } else {
                this.$Notice.error({
                  title: '提示',
                  desc: response.data.message
                })
              }
            })
          }
        })
      }

    }

  }
</script>
<style>
</style>
