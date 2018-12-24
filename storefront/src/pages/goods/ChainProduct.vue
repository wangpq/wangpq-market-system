<template>
  <div class="wrapper">
    <div class="header">
      <div class="group">

        <!--<label class="interval">启用标志:</label>-->
        <!--<el-select size="small" v-model="selectedPay" clearable placeholder="请选择" style="width:100px">-->
          <!--<el-option-->
            <!--v-for="item in payOptions"-->
            <!--:key="item.value"-->
            <!--:label="item.label"-->
            <!--:value="item.value">-->
          <!--</el-option>-->
        <!--</el-select>-->
        <!--<el-input size="small" class="interval" placeholder="请输入会员信息" v-model="member" clearable style="width:5.2rem;">-->
          <!--<el-select v-model="select" slot="prepend" placeholder="请选择" style="width:100px">-->
            <!--<el-option label="会员名称" value="1"></el-option>-->
            <!--<el-option label="会员号" value="2"></el-option>-->
          <!--</el-select>-->
        <!--</el-input>-->
        <label class="interval">商品名:</label>
        <el-input size="small" class="interval" placeholder="输入商品名称" v-model="searchParams.productNameLike" clearable style="width:4rem;"/>
        <label class="interval">货号:</label>
        <el-input size="small" class="interval" placeholder="输入商品条码" v-model="searchParams.productNo" clearable style="width:4rem;"/>
        <label class="interval">分类:</label>
        <el-input size="small" class="interval" placeholder="输入商品分类" v-model="searchParams.productCateNameLike" clearable style="width:4rem;"/>
        <label class="interval">品牌:</label>
        <el-input size="small" class="interval" placeholder="输入商品品牌" v-model="searchParams.productCateNameLike" clearable style="width:4rem;"/>

        <label class="interval">是否启用:</label>
        <el-select v-model="searchParams.orUse" clearable placeholder="请选择">
          <el-option
            v-for="item in useOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>

        <el-button size="small" type="primary" icon="el-icon-search" class="interval" @click="onSearch">搜索</el-button>
      </div>
       <!--<div class="group">-->
         <!--<DateSearch class="interval" @getDateTime="onSearch"></DateSearch>-->
       <!--</div>-->
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
  import api from '@/api/apiList'
  import $http from '@/utils/httputils'
  import {print} from '@/utils/printutils'
    export default {
      name: "ChainProduct",
      data(){
        return{
          searchParams:{
            productNameLike:null, //产品名称
            productNo : null, //产品货号
            productCateNameLike:null,//产品分类名称
            brandNameLike:null,//品牌名称
            orUse:'',//使用状态
          },
          useOptions:[{
            value:"0",
            label:'禁用'
          },{
            value:'1',
            label:'启用'
          }],
          setParams:{},
          //列表显示列，传递到table子模板
          columns:[{
            type:'index',
            title:'序号',
            width: 60
          },{
               prop:'chainName',
              title:'店铺',
              width:'120'
            },{
            prop:'productSelfCode',
            title:'自编码',
            width:'100'
          },{
            prop:'productName',
              title:'商品名',
              width:'180'
            },{
            prop:'productNo',
              title:'货号',
              width:'120',
            },{
            prop:'productCateName',
              title:'分类',
              width:'120'
            },{
            prop:'salePrice',
              title:'零售价(元)',
              width:'120',
              sortable:true
            },{
            prop:'orDiscount',
              title:'是否折扣',
              width:'80',
            formatter:function (row, column, cellValue, index) {
              switch (cellValue) {
                case 0:
                  return '否';
                  break;
                case 1:
                  return '是';
                default:
                  return '否';
              }
            }
            },{
            prop:'brandName',
              title:'品牌',
              width:'120'
            },{
            prop:'integral',
              title:'积分值',
              width:'80'
            },{
            prop:'specification',
              title:'规格',
              width:'50'
            },
            {
              prop:'unit',
              title:'单位',
              width:'50'
            }, {
              prop:'orUse',
              title:'是否使用',
              width:'80',
              formatter:function (row, column, cellValue, index) {
                switch (cellValue) {
                  case 0:
                    return '禁用';
                    break;
                  case 1:
                    return '使用';
                  default:
                    return '禁用';
                }
              }
            },{
              fixed:'right',
              title:'操作',
              width:'100',
              btns:[{
                text:'启用/禁用',
                click:row =>{
                  this.$dialog({
                    title:'温馨提示',
                    visible:true,
                    message:'是否启用或禁用该商品?',
                    yes:true,
                    no:true
                  },()=>{
                    $http({
                      method:'put',
                      path:api.queryChainProductEnable,
                      data:{
                        id:  row.id
                      },
                    },res=>{
                      this.$message({
                        message: '启用成功',
                        type: 'success'
                      });
                      this.onSearch();
                    },err=>{},this)
                  });
                }
              }]
            }],
          httpParams:{ //列表请求参数传递到子模板
            method:'post',
            path: api.queryChainProductPage,
            data:{}
          },
        }
      },
      components: {
        PageTable,
      },
      methods:{
        onSearch(){
          console.log('查询数据:',this.searchParams)
          this.$refs.table.search(this.searchParams);
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
