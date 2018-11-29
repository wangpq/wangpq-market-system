<template>
    <div class="wrapper">
      <div class="header">
        <el-input size="small" placeholder="请输入查询内容" v-model="inputValue" clearable class="input-with-select">
          <el-select v-model="selectValue" slot="prepend" placeholder="请选择" style="width:1.28rem;">
            <el-option label="货号" value="1"></el-option>
            <el-option label="名称" value="2"></el-option>
            <el-option label="分类" value="3"></el-option>
          </el-select>

        </el-input>
        <DateSearch class="interval" @getDateTime="onSearch"></DateSearch>
      </div>
      <div class="body">
        <PageTable 
          ref="table" 
          :columns = "columns"
          :setParams = "setParams"
          :httpParams="httpParams">
        </PageTable>
      </div>

    </div>
</template>

<script>
  import PageTable from '@/components/PageTable'
  import DateSearch from '@/components/DateSearch'
  import api from '@/api/apiList'
    export default {
        name: "SaleProduct",
        data(){
          return{
            inputValue:"",
            selectValue:"1",
            setParams:{
              report:{
                enable:true,
                title:'商品报表',
                method:'get',
                path:api.reportOrderProduct,
              }
            },
            columns:[{
              type:'index',
              title:'序号',
              width: 60
            }, {
                prop:'chainName',
                title:'店铺',
                width:'120'
              },{
              prop:'productNo',
              title:'货号',
              width:'160'
            },{
                prop:'productName',
                title:'产品名',
                width:'260'
              },{
              prop:'salePrice',
              title:'单价(元)',
              width:'100'
            },{
                 prop:'saleNum',
                title:'销售量',
                width:'120',
              sortable:true
              },{
                prop:'totalPrice',
                title:'总额(元)',
                width:'120',
              sortable:true
              },{
              prop:'avgRatio',
              title:'平均折扣',
              width:'120',
              sortable:true
             },{
                prop:'discountPrice',
                title:'优惠金额(元)',
                width:'160',
              sortable:true
              },{
                prop:'payPrice',
                title:'支付价格',
                width:'160',
              sortable:true
              }],
            httpParams:{ //列表请求参数传递到子模板
              method : 'post',
              path : api.querySaleProduct,
              data:{
              }
            },
          }
        },
      methods:{
        onSearch(start,end){
          this.inputValue=this.inputValue.trim();
          let params = {};
          params.startTime = start;
          params.endTime = end;
          params.productNo = null;
          params.productName = null;
          params.productCateId = null;
          params.productCateName = null;
          switch (this.selectValue) {
            case "1":
              params.productNo = this.inputValue;
              break
            case "2":
              params.productName = this.inputValue;
              break;
            case "3":
              params.productCateName = this.inputValue;
              break;
          }
          this.$refs.table.search(params);
        }
      },
        components: {
          PageTable,
          DateSearch
        }
    }
</script>

<style scoped>
.wrapper {
  padding: 12px;
}
.header{
  display: flex;
  flex-direction: row;
  align-items:center;
  justify-content:center;
  padding:14px;
  border-radius:6px;
  background-color: #fff;
  margin-bottom:6px;
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
