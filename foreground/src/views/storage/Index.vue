<template>
<div id="storageManageIndex" class="layout-content">
  <div class="layout-content-main">
    <DataTable
      :url="apis.storageManage.list"
      method="post"
      :columns="columns"
      :searchForm="searchForm"
    >
      <template slot="search">
          <Form-item label="订货人：" :label-width="80" prop="applyNameLike">
              <Input type="text" placeholder="请输入订货人" v-model="searchForm.applyNameLike" />
          </Form-item>

          <Form-item label="审核人：" :label-width="80" prop="checkedNameLike">
              <Input type="text" placeholder="请输入审核人" v-model="searchForm.checkedNameLike" />
          </Form-item>

          <Form-item label="订货日期：" :label-width="80" prop="orderTime">
              <DatePicker
                :clearable="false"
                type="daterange"
                v-model="orderTime"
                @on-change="onOrderSelectRange"
                format="yyyy-MM-dd"
                placeholder="请选择日期区间"
                style="min-width: 10vw"
              >
              </DatePicker>
          </Form-item>

          <Form-item label="出库日期：" :label-width="80" prop="outTime">
              <DatePicker
                :clearable="false"
                type="daterange"
                v-model="outTime"
                @on-change="onOutSelectRange"
                format="yyyy-MM-dd"
                placeholder="请选择日期区间"
                style="min-width: 10vw"
              >
              </DatePicker>
          </Form-item>

          <Form-item label="出库状态：" :label-width="80" prop="outStatus">
              <Select v-model="searchForm.outStatus" clearable>
                  <Option v-for="item in outStatusArr" :value="item.value" :key="item.value">
                      {{item.name}}
                  </Option>
              </Select>
          </Form-item>
          <Form-item label="订货门店：" :label-width="80" prop="chainNameLike">
              <Input  placeholder="请输入订货门店" type="text" v-model="searchForm.chainNameLike" />
          </Form-item>
          <Form-item label="出库单号：" :label-width="80" prop="no">
              <Input  placeholder="请输入出库单号" type="text" v-model="searchForm.no" />
          </Form-item>
      </template>
    </DataTable>
    <!--出库单详情-->
    <DetailDialog :initOption="detailDialogOption"></DetailDialog>
    <!--生成出库单-->
    <CreateDialog :initOption="storageDialogOption"></CreateDialog>
  </div>
</div>
</template>
<script>
  import $http from '@/utils/httputils'
  import DataTable from '@/components/common/DataTable'
  import DetailDialog from '@/views/storage/DetailDialog'
  import CreateDialog from '@/views/storage/CreateDialog'
  export default {
    components: {
      DataTable,
      DetailDialog,
      CreateDialog
    },
    data () {
      return {
        outStatusArr :[
          {
            name : "待出库",
            value : "1"
          },
          {
            name : "已出库",
            value : "2"
          }
        ],
        outTime : "",
        orderTime : "",
        searchForm : {
          /*
          applyNameLike : null,
          startOrderTime  : null,
          endOrderTime : null,
          startOutTime : null,
          endOutTime : null,
          auditNameLike : null,
          outStatus : null,
          chainNameLike : null,
          no : null
          */
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
            title: '出库单号',
            key: 'no',
            minWidth:160,
            align: 'center'
          },
          {
            title: '订货单号',
            key: 'callNo',
            minWidth:160,
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
          {
            title: '审核人',
            key: 'checkedName',
            minWidth:80,
            align: 'center'
          },
          {
            title: '商品种类',
            key: 'cateSum',
            sortable:true,
            minWidth:120,
            align: 'center',
            render: (h, params) => {
              let res= params.row.cateSum+"种"
              return h('span', {}, res);
            }
          },
          {
            title: '数量',
            key: 'sum',
            sortable: true,
            minWidth:80,
            align: 'center'
          },
          /*
          {
            title: '小计',
            key: 'xxxxx',
            sortable: true,
            minWidth:100,
            align: 'center'
          },
          */
          {
            title: '订货日期',
            key: 'orderTime',
            minWidth:120,
            align: 'center'
          },
          {
            title: '出库日期',
            key: 'outTime',
            minWidth:120,
            align: 'center'
          },
          {
            title: '出库状态',
            key: 'outStatus',
            minWidth:100,
            fixed:'right',
            align: 'center',
            render: (h, params) => {
              let val = params.row.outStatus;
              let res="";
              switch (val) {
                case 1:
                  res='待出库';
                  break;
                case 2:
                  res='已出库';
                  break;
                default :
                  res='待出库';
              }
              return h('span', {}, res);
            }
          }
        ],
        detailDialogOption: {
          title: '',
          visible: false,
          row: ''
        },
        storageDialogOption: {
          title: '',
          visible: false,
          row: ''
        }
      }
    },
    methods: {
      resetTableSearchForm () {
        this.searchForm.startOrderTime  = '';
        this.searchForm.endOrderTime  = '';
        this.searchForm.startOutTime  = '';
        this.searchForm.endOutTime   = '';
        this.orderTime="";
        this.outTime="";
        this.outStatus="";
      },
      onOrderSelectRange (e) {
        this.searchForm.startOrderTime = e[0] + " 00:00:00"
        this.searchForm.endOrderTime  = e[1] + " 23:59:59"
      },
      onOutSelectRange(e) {
        this.searchForm.startOutTime   = e[0] + " 00:00:00"
        this.searchForm.endOutTime   = e[1] + " 23:59:59"
      },
      handleView(row){
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        if(row.outStatus==2){
          this.detailDialogOption.title="出库单详情"
          this.detailDialogOption.row=row;
          this.detailDialogOption.visible=true
          this.$children[1].init();
        }else{
          this.$Notice.error({
            title: '提示',
            desc: "未生成出库单前，不能查看出库单详情!"
          })
        }
      },
      handleNewStorageOrder(row){
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        if(row.outStatus==1){
          this.storageDialogOption.title="生成出库单"
          this.storageDialogOption.row=row;
          this.storageDialogOption.visible=true;
          this.$children[2].init();
        }else{
          this.$Notice.error({
            title: '提示',
            desc: "已是出库单,不能重复生成！"
          })
        }
      },
      // 导出报表
      handleExport(){
        alert("导出报表");
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
