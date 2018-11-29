<template>
<div route="/storeorderlist" id="orderManageIndex" class="layout-content">
  <div class="layout-content-main">
    <DataTable
      :url="apis.orderManage.orderList"
      method="post"
      :columns="columns"
      :searchForm="searchForm"
    >
      <template slot="search">
          <Form-item label="订货人：" :label-width="80" prop="applyNameLike">
              <Input type="text" placeholder="请输入订货人" v-model="searchForm.applyNameLike" />
          </Form-item>

          <Form-item label="审核人：" :label-width="80" prop="auditNameLike">
              <Input type="text" placeholder="请输入审核人" v-model="searchForm.auditNameLike" />
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

          <Form-item label="到货日期：" :label-width="80" prop="arriveTime">
              <DatePicker
                :clearable="false"
                type="daterange"
                v-model="arriveTime"
                @on-change="onArriveSelectRange"
                format="yyyy-MM-dd"
                placeholder="请选择日期区间"
                style="min-width: 10vw"
              >
              </DatePicker>
          </Form-item>

          <Form-item label="审核状态：" :label-width="80" prop="checkedStatus">
              <Select class="checkedStatus" v-model="searchForm.checkedStatus" clearable>
                  <Option v-for="item in apis.dictVal.checkedStatus" :value="item.value" :key="item.value">
                      {{item.label }}
                  </Option>
              </Select>
          </Form-item>
          <Form-item label="订货门店：" :label-width="80" prop="chainNameLike">
              <Input  placeholder="请输入订货门店" type="text" v-model="searchForm.chainNameLike" />
          </Form-item>
      </template>
    </DataTable>

    <DetailDialog :initOption="detailDialogOption"></DetailDialog>
    <AuditDialog :initOption="auditDialogOption"></AuditDialog>
  </div>
</div>
</template>
<script>
  import $http from '@/utils/httputils'
  import DataTable from '@/components/common/DataTable'
  import DetailDialog from '@/views/ordermanage/DetailDialog'
  import AuditDialog from '@/views/ordermanage/AuditDialog'
  export default {
    components: {
      DataTable,
      DetailDialog,
      AuditDialog
    },
    data () {
      return {
        arriveTime : "",
        orderTime : "",
        searchForm : {
          applyNameLike : null,
          startTime : null,
          endTime : null,
          startArriveTime : null,
          endArriveTime : null,
          auditNameLike : null,
          checkedStatus : null,
          chainNameLike : null
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
            title: '订货单号',
            key: 'no',
            minWidth:180,
            align: 'center'
          },
          {
            title: '订货门店',
            key: 'chainName',
            minWidth:120,
            align: 'center'
          },
          {
            title: '订货人',
            key: 'applyName',
            minWidth:80,
            align: 'center'
          },
          {
            title: '审核人',
            key: 'auditName',
            minWidth:80,
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
            title: '数量',
            key: 'sum',
            sortable: true,
            minWidth:80,
            align: 'center'
          },
          {
            title: '小计',
            key: 'totalPrice',
            sortable: true,
            minWidth:100,
            align: 'center'
          },
          {
            title: '订货日期',
            key: 'createTime',
            minWidth:150,
            align: 'center'
          },
          {
            title: '到货日期',
            key: 'arriveTime',
            minWidth:150,
            align: 'center'
          },
          {
            title: '审核状态',
            key: 'auditStatus',
            minWidth:100,
            fixed:'right',
            align: 'center',
            render: (h, params) => {
              let val = params.row.auditStatus;
              let res="";
              switch (val) {
                case 0:
                  res='初始化';
                  break;
                case 1:
                  res='待审核';
                   break;
                case 2:
                  res='已审核';
                  break;
                case 3:
                  res='驳回';
                  break;
                case 4:
                  res='待出库';
                  break;
                case 5:
                  res='待配送';
                  break;
                case 6:
                  res='配送中';
                  break;
                case 7:
                  res='已入库';
                  break;
                default :
                  res='';
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
        auditDialogOption: {
          title: '',
          visible: false,
          row: ''
        }
      }
    },
    methods: {
      resetTableSearchForm () {
        this.searchForm.startTime = '';
        this.searchForm.endTime = '';
        this.searchForm.startArriveTime = '';
        this.searchForm.endArriveTime = '';
        this.orderTime="";
        this.arriveTime="";
      },
      onOrderSelectRange (e) {
        this.searchForm.startTime = e[0] + " 00:00:00"
        this.searchForm.endTime = e[1] + " 23:59:59"
      },
      onArriveSelectRange(e) {
        this.searchForm.startArriveTime  = e[0] + " 00:00:00"
        this.searchForm.endArriveTime  = e[1] + " 23:59:59"
      },
      handleView(row){
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.detailDialogOption.title="订货单详情"
        this.detailDialogOption.row=row;
        this.$children[1].init();
        this.detailDialogOption.visible=true
      },
      handleAudit(row){
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        if(row.auditStatus==1){
          this.auditDialogOption.title="订货单审核"
          this.auditDialogOption.row=row;
          this.auditDialogOption.visible=true;
          this.$children[2].init();
        }else{
          this.$Notice.error({
            title: '提示',
            desc: "只有待审核订货单才能进行审核！"
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
      }
    }

  }
</script>
<style>
</style>
