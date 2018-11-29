<template>
<div class="layout-content">
  <div class="layout-content-main">
    <DataTable
      :url="apis.financeManage.list"
      method="post"
      :columns="columns"
      :searchForm="searchForm"
    >
      <template slot="search">
          <Form-item label="配送人：" :label-width="80" prop="deliverPersonalNameLike">
            <Input type="text" placeholder="请输入配送人" v-model="searchForm.deliverPersonalNameLike" />
          </Form-item>
          <Form-item label="出库人：" :label-width="80" prop="outerNameLike">
            <Input type="text" placeholder="请输入出库人" v-model="searchForm.outerNameLike" />
          </Form-item>
          <Form-item label="配送日期：" :label-width="80" prop="deliverTime">
            <DatePicker 
              :clearable="false" 
              type="daterange" 
              v-model="deliverTime"         
              @on-change="onDeliverDateRange" 
              format="yyyy-MM-dd" 
              placeholder="选择日期区间"
            >
            </DatePicker>
          </Form-item>
          <Form-item label="结算日期：" :label-width="80" prop="accTime">
            <DatePicker 
              :clearable="false" 
              type="daterange" 
              v-model="accTime"         
              @on-change="onAccDateRange" 
              format="yyyy-MM-dd" 
              placeholder="选择日期区间"
            >
            </DatePicker>
          </Form-item>
          <Form-item label="结算状态：" :label-width="80" prop="accountStatus">
            <Select  v-model="searchForm.accountStatus" clearable>
                <Option v-for="item in accountStatusArray" :value="item.value" :key="item.value">
                  {{item.name }}
                </Option>
            </Select>
          </Form-item>
          <Form-item label="订货门店：" :label-width="80" prop="chainNameLike">
              <Input type="text" placeholder="请输入订货门店" v-model="searchForm.chainNameLike" />
          </Form-item>
          <Form-item label="区域经理：" :label-width="80" prop="checkedNameLike">
              <Input type="text" placeholder="请输入区域经理" v-model="searchForm.checkedNameLike" />
          </Form-item>
      </template>
    </DataTable>

    <AccountDetailDialog :initOption="accountDetailDialogOption" ref="accountDetailDialog"></AccountDetailDialog>
    <ActionDialog :initOption="actionDialogOption" ref="actionDialog"></ActionDialog>
    <DispatchDetailDialog :initOption="dispatchDetailDialogOption" ref="dispatchDetailDialog"></DispatchDetailDialog>
  </div>
</div>
</template>
<script>
  import $http from '@/utils/httputils'
  import DataTable from '@/components/common/DataTable'
  import AccountDetailDialog from '@/views/finance/DetailDialog'
  import ActionDialog from '@/views/finance/ActionDialog'
  import DispatchDetailDialog from '@/views/dispatch/DetailDialog'

  export default {
    components: {
      DataTable,
      AccountDetailDialog,
      ActionDialog,
      DispatchDetailDialog
    },
    data () {
      return {
        accountStatusArray : [
          {
            name : "待结算",
            value : 1 
          },
          {
            name : "已结算",
            value : 2
          }
        ],
        deliverTime : "",
        accTime : "",
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
            title: '配送单号',
            key: 'deliverNo',
            minWidth:180,
            align: 'center'
          }, 
          {
            title: '收货门店',
            key: 'chainName',
            minWidth:120,
            align: 'center'
          },
          {
            title: '门店联系人',
            key: 'applyName',
            minWidth:100,
            align: 'center'
          },
          // 客户经理---督导人
          {
            title: '客户经理',
            key: 'checkedName',
            minWidth:100,
            align: 'center'
          },
          {
            title: '商品种类',
            key: 'cateSum',
            sortable:true,
            minWidth:110,
            align: 'center',
            render: (h, params) => {
              let res= params.row.cateSum+"种"
              return h('span', {}, res);
            }
          },
          {
            title: '小计',
            key: 'total',
            sortable: true,
            minWidth:100,
            align: 'center'
          },
          /*
          {
            title: '配送人',
            key: 'deliverPersonalName',
            minWidth:150,
            align: 'center'
          },
          */
          {
            title: '配送日期',
            key: 'deliverTime',
            minWidth:150,
            align: 'center'
          },
          {
            title: '应结算日期',
            key: 'expPayTime',
            minWidth:150,
            align: 'center'
          },
          {
            title: '实际结算日期',
            key: 'actPayTime',
            minWidth:150,
            align: 'center'
          },
          {
            fixed : "right",
            title: '结算状态',
            key: 'accountStatus',
            minWidth:100,
            align: 'center',
            render: (h, params) => { 
              let val = params.row.accountStatus;
              let res="";
              switch (val) {
                case 1:
                  res='待结算';
                  break;
                case 2:
                  res='已结算';
                  break;
                default :
                  res='待结算';
              }
              return h('span', {}, res);
            }, 
          }

        ],
        accountDetailDialogOption: {
          title: '',
          visible: false,
          row: ''
        },
        actionDialogOption: {
          title: '',
          visible: false,
          row: ''
        },
        dispatchDetailDialogOption: {
          title: '',
          visible: false,
          row: ''
        }
      }
    },
    methods: {
      onDeliverDateRange (e) {
        this.searchForm.startDeliTime  = e[0] + " 00:00:00"
        this.searchForm.endDeliTime  = e[1] + " 23:59:59"
      },
      onAccDateRange(e) {
        this.searchForm.startAccTime   = e[0] + " 00:00:00"
        this.searchForm.endAccTime   = e[1] + " 23:59:59"
      },
      handleShowDispatchDetail(row){  
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.dispatchDetailDialogOption.title="配送单详情"
        this.dispatchDetailDialogOption.row=row;
        this.dispatchDetailDialogOption.row.deliverName=this.dispatchDetailDialogOption.row.deliverPersonalName;
        this.dispatchDetailDialogOption.page="detail";
        this.$refs.dispatchDetailDialog.init();
        this.dispatchDetailDialogOption.visible=true
      },
      handleNewAccountOrder(row){
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        // 待结算
        if(row.accountStatus==1){
          this.actionDialogOption.title="生成结算单"
          this.actionDialogOption.row=row;
          this.$refs.actionDialog.init();
          this.actionDialogOption.visible=true
        }else{
          this.$Notice.error({
            title: '提示',
            desc: "只有待结算单才能进行审核！"
          })
        }
      },
      handleShowAccountDetail(row){ 
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        if(row.accountStatus==2){
          this.accountDetailDialogOption.title="结算单详情";
          this.accountDetailDialogOption.row=row;
          this.$refs.accountDetailDialog.init();
          this.accountDetailDialogOption.visible=true;
        }else{
          this.$Notice.error({
            title: '提示',
            desc: "只有已结算单才能查看详情！"
          })
        }
      },
      // 导出报表
      handleExport(){
        /*
        var url = process.env.BASE_API + this.apis.report.order + "?" + this.urlEncode(this.searchForm);
        window.open(url)
        */
      },



    }

  }
</script>
<style>
</style>
