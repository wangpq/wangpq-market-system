<template>
  <div class="wrapper">
    <div class="header">

      <div class="group">
        <label>订单类型:</label>
        <el-cascader
          size="small"
          :options="typeOptions"
          change-on-select
          v-model="selectedOptions"
        ></el-cascader>

        <label class="interval">支付方式:</label>
        <el-select size="small" v-model="selectedPay" clearable placeholder="请选择" style="width:100px">
          <el-option
            v-for="item in payOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <el-input size="small" class="interval" placeholder="请输入会员信息" v-model="member" clearable style="width:5.2rem;">
          <el-select v-model="select" slot="prepend" placeholder="请选择" style="width:100px">
            <el-option label="会员名称" value="1"></el-option>
            <el-option label="会员号" value="2"></el-option>
          </el-select>
        </el-input>
        <label class="interval">收银员:</label>
        <el-input size="small" class="interval" placeholder="输入收银员名称" v-model="cashierName" clearable style="width:4rem;">

        </el-input>
      </div>
       <div class="group">
         <DateSearch class="interval" @getDateTime="onSearch"></DateSearch>
       </div>
    </div>

    <div class="body">
      <PageTable
        ref="table"
        :setParams = "setParams"
        :columns = "columns"
        :httpParams="httpParams">
      </PageTable>
    </div>

  </div>

</template>

<script>
  import PageTable from '@/components/PageTable'
  import DateSearch from '@/components/DateSearch'
  import ProductDetail from '@/components/ProductDetail'
  import api from '@/api/apiList'
  import $http from '@/utils/httputils'
  import {print} from '@/utils/printutils'
    export default {
      name: "SaleOrder",
      data(){
        return{
          setParams:{
            report:{
              enable:true,
              title:'订单报表',
              method:'get',
              path:api.reportOrder,
            }
          },
          //列表显示列，传递到table子模板
          columns:[{
            type:'index',
            title:'序号',
            width: 60
          },{
            type:'spread',
            title:'商品',
            width: 60,
            rowtype:'product'
          },{
               prop:'chainName',
              title:'店铺',
              width:'120'
            },{
            prop:'cashierName',
            title:'收银员',
            width:'100'
          },{
            prop:'orderNo',
              title:'订单号',
              width:'260'
            },{
            prop:'salePrice',
              title:'总额(元)',
              width:'120',
              sortable:true
            },{
            prop:'discountPrice',
              title:'优惠(元)',
              width:'100'
            },{
            prop:'payPrice',
              title:'支付(元)',
              width:'120',
            sortable:true
            },{
            prop:'saleTime',
              title:'下单时间',
              width:'220',
            sortable:true
            },{
            prop:'orderType',
              title:'类型',
              width:'100',
              formatter:function (row, column, cellValue, index) {
                switch (cellValue) {
                  case 0:
                    return '销售单';
                    break;
                  case 1:
                    return '挂单';
                  case 2:
                    return '退单';
                  default:
                    return '未知';
                }
              }
            },{
            prop:'payStatus',
              title:'支付状态',
              width:'100',
              formatter:function (row, column, cellValue, index) {
                switch (cellValue) {
                  case 0:
                    return '未支付';
                    break;
                  case 1:
                    return '已支付';
                  default:
                    return '未支付';
                }
              }
            },{
            prop:'payWay',
              title:'支付方式',
              width:'100',
              formatter:function (row, column, cellValue, index) {
                switch (cellValue) {
                  case 1:
                    return '微信';
                  case 2:
                    return '支付宝';
                  case 3:
                    return '银联';
                  case 4:
                    return '现金';
                  case 5:
                    return 'qq钱包';
                  case 6:
                    return '京东支付';
                  case 7:
                    return '线下扫码'
                  case 8:
                    return '预付款'
                  case 9:
                    return '云闪付'
                  default:
                    return '未知';
                }
              }
            },{
            prop:'payTime',
              title:'支付时间',
              width:'220',
              sortable:true
            },
            {
              prop:'memberName',
              title:'会员',
              width:'100'
            },
            {
              prop:'orderStatus',
              title:'订单状态',
              width:'100',
              formatter:function (row, column, cellValue, index) {
                switch (cellValue) {
                  case 0:
                    return '创建';
                  case 1:
                    return '已完成';
                  default:
                    return '创建';
                }
              }
            }, {
              prop:'parentOrderNo',
              title:'原单号',
              width:'260'
            },{
              fixed:'right',
              title:'操作',
              width:'100',
              btns:[{
                text:'小票打印',
                click:row =>{
                  if (row.payStatus == null || row.payStatus == 2){
                    this.$message({
                      message: '未支付订单不能打印小票',
                      type: 'warning'
                    });
                    return;
                  }
                  this.$dialog({
                    title:'温馨提示',
                    visible:true,
                    message:'是否确认重新打印小票?',
                    yes:true,
                    no:true
                  },()=>{
                    $http({
                      method:'get',
                      path:api.ticketTemplate1,
                      data:{
                        orderNo:  row.orderNo
                      },
                    },res=>{
                      this.$message({
                        message: '获取模板成功',
                        type: 'success'
                      });
                      print(false,res);
                    },err=>{},this)
                  });
                }
              }]
            }],
          httpParams:{ //列表请求参数传递到子模板
            method:'post',
            path: api.chainOrderSearch,
            data:{
              orderType:0,
              orderStatus:1
            }
          },
          selectedOptions:[0,1],
          typeOptions:[{
            value:0,
            label:'销售单',
            children:[{
              value:0,
              label:'初始单'
            },{
              value:1,
              label:'完成单'
            }]
          },{
            value:1,
            label:'挂单订单',
            children:[{
              value:0,
              label:'挂起单'
            },{
              value:1,
              label:'解挂单'
            }]
          },{
            value:2,
            label:'退单订单',
            children:[{
              value:0,
              label:'退单失败'
            },{
              value:1,
              label:'成功退单'
            }]
          }],
          selectedPay:0,
          payOptions:[{
            value:0,
            label:'全部'
          },{
            value:1,
            label:'微信支付'
          },{
            value:2,
            label:'支付宝'
          },{
            value:3,
            label:'银联'
          },{
            value:4,
            label:'现金'
          },{
            value:5,
            label:'qq钱包'
          },{
            value:6,
            label:'京东支付'
          },{
            value:7,
            label:'线下扫码'
          },{
            value:8,
            label:'预付款'
          },{
            value:99,
            label:'其他支付'
          }],
          member:"",
          select:"1",
          cashierName:null
        }
      },
      components: {
        PageTable,
        DateSearch,
        ProductDetail
      },
      methods:{
        onSearch(start,end){
          this.member=this.member.trim();
          let params = {};
          params.startTime = start;
          params.endTime = end;
          if (this.selectedOptions != null){
            params.orderType = this.selectedOptions[0];
            params.orderStatus = this.selectedOptions[1];
          }
          if (this.selectedPay == null || this.selectedPay == 0){
            params.payWay = null;
          }else{
            params.payWay = this.selectedPay;
          }

          if (this.select == "1" && this.member != null && this.member != ""){
            params.memberName = this.member;
            params.memberCode = null;
          }else if (this.select == "2" && this.member != null && this.member != "") {
            params.memberName = null;
            params.memberCode = this.member;
          }else{
            params.memberName = null;
            params.memberCode = null;
          }
          params.cashierName = this.cashierName;
          this.$refs.table.search(params);
        }
      }
    }
</script>

<style scoped>
.wrapper{
  padding:12px;
}
.header{
  padding:14px 14px 6px;
  border-radius:6px;
  background-color: #fff;
  margin-bottom:6px;
}
.header>.group{
  display: inline-block;
  margin-bottom:4px;
}
.header>.group>label{
  font-size:14px;
}
.body{
  border-radius: 0.12rem;
  background-color: #fff;
  overflow: hidden;
}
.interval{
  margin: 0 0 0 10px;
}
.el-select{
  width: 120px;
}

.el-input{
  width: 280px;
}
</style>
