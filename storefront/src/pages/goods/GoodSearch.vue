<template>
  <div class="wrapper">
    <div class="header">

        <el-select size="small" v-model="prdTypeVal" placeholder="全部"  @change="onPrdTypeChange" style="width:1.6rem;margin-right:8px;">
          <el-option
            v-for="item in prdTypeArr"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>


        <el-input size="small" :placeholder="placeholder" v-model="searchKeyWord" class="input-with-select"  style="width:7rem;margin-right:8px;overflow:hidden;" @keyup.enter.native="onsearchKeyWordBtnTap">
          <el-select v-model="sortTypeVal" placeholder="全部" slot="prepend"  @change="onPrdSortTypeChange" style="width:1.8rem;">
            <el-option
              v-for="item in sortTypeArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button slot="append" type="success"  style="border-color: #98b53b; background: #98b53b;color:#fff;" @click="onsearchKeyWordBtnTap">确定</el-button>
        </el-input>

    </div>
    <div class="body">
      <el-table
        :data="tableData"
        style="width: 100%">
        <el-table-column
          prop="index"
          align="center"
          width=60
          label="序号">
        </el-table-column>
        <el-table-column
          prop="productName"
          align="center"
          min-width="160"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="productNo"
          align="center"
          min-width="120"
          label="商品货号">
        </el-table-column>
        <el-table-column
          prop="salePrice"
          align="center"
          label="商品零售价">
        </el-table-column>
        <el-table-column
          prop="lowestPrice"
          align="center"
          label="最低零售价">
        </el-table-column>


        <!--
        <el-table-column
          prop="ee"
          label="参考采购价">
        </el-table-column>
        <el-table-column
          prop="ff"
          label="批发价">
        </el-table-column>
        -->

        <el-table-column
          prop="unit"
          align="center"
          label="计量单位">
        </el-table-column>

        <el-table-column
          prop="specification"
          align="center"
          label="规格">
        </el-table-column>

        <!--
        <el-table-column
          prop="ii"
          label="商品重量">
        </el-table-column>
        -->

        <el-table-column
          prop="shelfLife"
          align="center"
          label="保质期">
        </el-table-column>

        <el-table-column
          prop="orDiscount"
          align="center"
          label="允许折扣">
        </el-table-column>

        <el-table-column
          prop="integral"
          align="center"
          label="积分">
        </el-table-column>

        <el-table-column
          prop="brandName"
          align="center"
          label="品牌名称">
        </el-table-column>

        <el-table-column
          prop="priceWay"
          align="center"
          label="计价方式">
        </el-table-column>

        <el-table-column
          prop="businessWay"
          align="center"
          label="经营方式">
        </el-table-column>

        <el-table-column
          prop="logisticsModel"
          align="center"
          label="物流模式">
        </el-table-column>

      </el-table>

      <div class="my-pager" v-show="pagerVisible">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageIndex"
          :page-sizes="[8,10,15,20,25,30,35,40]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableDataLenth">
        </el-pagination>
      </div>

    </div>
  </div>
</template>

<script>


import Vue from 'vue';
import api from '@/api/apiList'
import {trim,timeOutFn} from '@/utils/utils'
import { Button,Select,Table,Input} from 'element-ui';
Vue.use(Button);
Vue.use(Select);
Vue.use(Table);
Vue.use(Input);


export default {
  name: 'GoodSearch',
  data() {
    return {
      prdTypeArr: [
        {
          value: '全部',
          label: '全部'
        },
        {
          value: '已上架',
          label: '已上架'
        },
        {
          value: '已下架',
          label: '已下架'
        }
      ],
      prdTypeVal: '全部',
      sortTypeArr: [
        {
          value: '全部',
          label: '全部'
        },
        {
          value: '商品编码',
          label: '商品编码'
        },
        {
          value: '商品名称',
          label: '商品名称'
        },
        {
          value: '商品分类',
          label: '商品分类'
        }
      ],
      prdSortType : "全部",
      placeholder : "",
      sortTypeVal: '全部',
      searchKeyWord : "",
      // 表格数据（目前要渲染的商品数据）
      tableData: [],
      // 表格数据分页索引值，默认从1开始
      pageIndex : 1 ,
      // 表格数据分页数，默认0
      pageTotal : 0,
      // 表格数据条数
      tableDataLenth : 0,
      // 每页显示条数
      pageSize : 8,
      // 访问ajax的tag
      queryAjaxTag : "all",
      // 分页显示
      pagerVisible : true
    }
  },
  mounted  () {

  },
  computed : {
  },
  created (){
    this.queryAjaxTag="all";
    this.queryPrdInfos();
  },
  methods : {
    onPrdTypeChange: function(val){
      this.tableData=[];
      switch(val){
        case "全部":
          this.queryAjaxTag="all";
          break;
        case "已上架":
          this.queryAjaxTag="added";
          break;
        default:
          this.queryAjaxTag="outOfStock";
      }
      this.queryPrdInfos(this.queryAjaxTag);
    },
    onPrdSortTypeChange(val){
      this.tableData=[];
      if(val==="全部"){
        this.pagerVisible=false;
        this.queryAjaxTag="all";
        this.placeholder="";
        this.queryPrdInfos(this.queryAjaxTag);
      }

      // 商品编码(货号)
      else if(val==="商品编码"){
        this.pagerVisible=false;
        this.queryAjaxTag="code";
        this.pageIndex =1;
        this.placeholder="请输入商品编码";
      }
      // 商品名称
      else if(val==="商品名称"){
        this.pagerVisible=false;
        this.queryAjaxTag="name";
        this.pageIndex =1;
        this.placeholder="请输入商品名称";
      }
      // 商品分类
      else{
        this.pagerVisible=false;
        this.queryAjaxTag="type";
        this.pageIndex =1;
        this.placeholder="请输入商品分类";
      }
    },
    onsearchKeyWordBtnTap(){

      if(trim(this.searchKeyWord)!==""){
        this.queryPrdInfos();
      }else{
        this.searchKeyWord="";
      }
    },
    queryPrdInfos(){
      let tag=this.queryAjaxTag;

      const params={};

      this.searchKeyWord=trim(this.searchKeyWord);

      // 全部
      if(tag==="all"){
        params.limit=this.pageSize;
        params.pageIndex=this.pageIndex;
      }
      // 上架
      else if(tag==="added"){
        params.limit=this.pageSize;
        params.pageIndex=this.pageIndex;
        params.putawayStatus=1 ;
      }
      // 下架
      else if(tag==="outOfStock"){
        params.limit=this.pageSize;
        params.pageIndex=this.pageIndex;
        params.putawayStatus=2;
      }
      // 商品编码(货号)
      else if(tag==="code"){
        params.limit=this.pageSize;
        params.pageIndex=this.pageIndex;
        params.productNo=this.searchKeyWord;
      }
       // 商品名称
      else if(tag==="name"){
        params.limit=this.pageSize;
        params.pageIndex=this.pageIndex;
        params.productName=this.searchKeyWord;
      }
      // 商品分类
      else{
        params.limit=this.pageSize;
        params.pageIndex=this.pageIndex;
        params.productCateName=this.searchKeyWord;
      }

      this.$ajax.post(api.queryPrdPage, params)
      .then( (response) =>{
        timeOutFn(this,response,()=>{
          let res=response.data;
          if(res.success && res.data && res.data.list && res.data.list.length>0){
            this.tableData=this.convertTableData(res.data.list);
            this.tableDataLenth=res.data.total;
            this.pageIndex=res.data.pageIndex;
            this.pagerVisible=true;
          }
        })
      })
      .catch( (error)=> {
      });
    },
    convertTableData(arr){
      arr.forEach( (element,index) => {
        element.index=index+1;
        if(element.priceWay==0){
          element.priceWay="普通";
        }
        if(element.priceWay==1){
          element.priceWay="计重";
        }
        if(element.priceWay==2){
          element.priceWay="计数";
        }

        if(element.logisticsModel==0){
          element.logisticsModel="仓配";
        }
        if(element.logisticsModel==1){
          element.logisticsModel="直送";
        }
        if(element.logisticsModel==2){
          element.logisticsModel="不限";
        }

        if(element.businessWay==0){
          element.businessWay="购销";
        }
        if(element.businessWay==1){
          element.businessWay="代销";
        }
        if(element.businessWay==2){
          element.businessWay="联营";
        }
        if(element.businessWay==3){
          element.businessWay="扣率代销";
        }
        element.orDiscount=element.orDiscount==1 ? "是" : "否";
      });
      return arr;
    },
    handleSizeChange(val) {
      //console.log(`每页 ${val} 条`);
      this.pageSize=val;
      this.handleCurrentChange();
    },
    handleCurrentChange(val) {
      //console.log(`当前页: ${val}`);
      this.pageIndex=val;
      this.queryPrdInfos()
    }

  }


}
</script>

<style scoped>
.wrapper{
  padding:12px;
}
.header{
  display: flex;
  flex-direction: row;
  padding:14px;
  border-radius:6px;
  background-color: #fff;
  margin-bottom:6px;
}
.body{
  border-radius:0.12rem;
  background-color: #fff;
  overflow:hidden;
  position: relative;
}
.el-table td,
.el-table th.is-leaf{
  border-bottom-color: #ccc;
}
.my-pager{
  position: fixed;
  left: 34%;
  right: 32%;
  display: flex;
  flex-direction:row;
  justify-content:center;
  bottom: 20px;
  background-color: rgba(255,255,255,0.68);
  border-radius:18px;
  z-index: 99;
}
.el-pagination{
  text-align: center;
}

</style>
