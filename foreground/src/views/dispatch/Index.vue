<template>
<div class="layout-content">
  <div class="layout-content-main">
    <DataTable
      :url="apis.dispatchManage.list"
      method="post"
      :columns="columns"
      :searchForm="searchForm"
    >
      <template slot="search">
          <Form-item label="配送人：" :label-width="80" prop="deliverNameLike">
            <Input type="text" placeholder="请输入配送人" v-model="searchForm.deliverNameLike" />
          </Form-item>
          <Form-item label="配送单号：" :label-width="80" prop="no">
            <Input type="text" placeholder="请输入配送单号"  v-model="searchForm.no" />
          </Form-item>
          <Form-item label="订货人：" :label-width="80" prop="applyNameLike">
            <Input type="text"  placeholder="请输入订货人"  v-model="searchForm.applyNameLike" />
          </Form-item>
          <Form-item label="配送日期：" :label-width="80" prop="dispatchDate">
            <DatePicker
              :clearable="false"
              type="daterange"
              v-model="deliTime"
              @on-change="onSelectRange"
              format="yyyy-MM-dd"
              placeholder="选择日期区间"
              style="min-width: 10vw"
            >
            </DatePicker>
          </Form-item>
          <Form-item label="出库状态：" :label-width="80" prop="deliStatus">
            <Select class="checkedStatus" v-model="searchForm.deliStatus" clearable>
                <Option v-for="item in deliStatusArr" :value="item.value" :key="item.value">
                  {{item.name}}
                </Option>
            </Select>
          </Form-item>
          <Form-item label="订货门店：" :label-width="80" prop="chainNameLike">
              <Input type="text"   placeholder="请输入订货门店"  v-model="searchForm.chainNameLike" />
          </Form-item>
      </template>
    </DataTable>

    <DetailDialog :initOption="detailDialogOption"></DetailDialog>
  </div>
</div>
</template>
<script>
  import $http from '@/utils/httputils'
  import DataTable from '@/components/common/DataTable'
  import DetailDialog from '@/views/dispatch/DetailDialog'
  export default {
    components: {
      DataTable,
      DetailDialog
    },
    data () {
      return {
        // 配送状态
        deliStatusArr : [
          {
            name : "待配送",
            value : 0
          },
          {
            name : "配送中",
            value : 1
          },
          {
            name : "完成",
            value : 2
          }
        ],
        deliTime : "",
        searchForm : {
          /*
          deliverNameLike : null,
          applyNameLike : null,
          dispatchDate : null,
          endTime : null,
          startTime : null,
          deliStatus : null,
          chainNameLike : null
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
            title: '配送单号',
            key: 'no',
            minWidth:180,
            align: 'center'
          },
          {
            title: '出库单号',
            key: 'outNo',
            minWidth:180,
            align: 'center'
          },
          {
            title: '订货单号',
            key: 'callNo',
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
          {
            title: '配送人',
            key: 'deliverName',
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
            title: '出库日期',
            key: 'createTime',
            minWidth:150,
            align: 'center'
          },
          {
            title: '配送日期',
            key: 'deliverTime',
            minWidth:150,
            align: 'center'
          },
          {
            title: '配送状态',
            key: 'deliStatus',
            minWidth:90,
            fixed:'right',
            align: 'center',
            render: (h, params) => {
              let val = params.row.deliStatus;
              let res="";
              switch (val) {
                case 0:
                  res='待配送';
                  break;
                case 1:
                  res='配送中';
                  break;
                case 2:
                  res='完成';
                  break;
                default :
                  res='待配送';
              }
              return h('span', {}, res);
            }
          }
        ],
        detailDialogOption: {
          title: '',
          visible: false,
          row: ''
        }
      }
    },
    methods: {
      resetTableSearchForm () {
        this.deliTime="";
        this.searchForm.startDeliTime  = "";
        this.searchForm.endDeliTime  = "";
      },
      onSelectRange (e) {
        this.searchForm.startDeliTime  = e[0] + " 00:00:00"
        this.searchForm.endDeliTime  = e[1] + " 23:59:59"
      },
      handleView(row){ 
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.detailDialogOption.title="配送单详情";
        this.detailDialogOption.page="detail";
        this.detailDialogOption.row=row;
        this.$children[1].init();
        this.detailDialogOption.visible=true
      },
      handleSureDispatch(row){
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        // 待配送
        if(row.deliStatus==0){
          this.detailDialogOption.title="确认配送单";
          this.detailDialogOption.page="sure";
          this.detailDialogOption.row=row;
          this.$children[1].init();
          this.detailDialogOption.visible=true;
        }else{
          this.$Notice.error({
            title: '提示',
            desc: "只有待配送单才能进行确认操作！"
          })
        }
      },
      // 导出报表
      handleExport(row){
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        var url = process.env.BASE_API + this.apis.report.deliver + "?" + this.urlEncode({"deliverNo" : row.no});
        window.open(url)
      }
    }

  }
</script>
<style>
</style>
