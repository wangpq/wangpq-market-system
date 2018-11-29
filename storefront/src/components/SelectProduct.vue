<template>
<div>
  <el-dialog :visible.sync="params.visible"  @open="onSearchDialogOpen" width="980px" top="0vh" :center=true>
    <div class="dialog-body">
      <h2 class="title">{{params.title}}</h2>
      <div class="search-prd-form">
      
        <el-input size="small" :placeholder="placeholder" v-model="searchKeyWord" class="input-with-select"  style="width:480px;margin-right:8px;overflow:hidden;" @keyup.enter.native="onsearchKeyWordBtnTap">
          <el-select v-model="sortTypeVal" placeholder="全部" slot="prepend"  @change="onPrdSortTypeChange" style="width:1.8rem;">
            <el-option
              v-for="item in sortTypeArr"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-button slot="append" type="success" @click="onsearchKeyWordBtnTap">查询</el-button>
        </el-input>

      </div>   
      <div class="search-prd-result">
        <PageTable 
          ref="searchProductTable"
          :pagerFixed="pagerFixed"
          :setParams = "setParams"
          :auto="tableAuto"
          :columns = "columns"
          :httpParams="httpParams"
          maxHeight=360
        >
        </PageTable>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button round type="primary" @click="onViewPrd">查看已添加商品</el-button>
      <el-button round @click="onSearchDialogBtnCancel">取消</el-button>
    </div>
  </el-dialog>

  <el-dialog :visible.sync="selectedDialogVisible"  width="980px" top="0vh" :center=true>
    <div class="dialog-body">
      <h2 class="title">已添加商品</h2>
      <div class="search-prd-result">
        <PageTable 
          ref="selectedProductTable"
          :showSummary="showSummary"
          :summaries="summaries"
          :pagerFixed="pagerFixed"
          :columns = "selectedTableColumns"
          :tableList="selectedTableList"
          maxHeight=380
        >
        </PageTable>   
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button round type="primary" @click="onBtnOk">确定</el-button>
      <el-button round @click="onBtnContinue">继续选择</el-button> 
      <el-button round @click="onSelectedDialogBtnCancel">取消</el-button>
    </div>
  </el-dialog> 

  <el-dialog :visible.sync="editPrdNumVisible"  width="360px" top="0vh" :center=true :show-close="editPrdNumCloseVarible" :close-on-click-modal="editPrdNumCloseVarible" :close-on-press-escape="editPrdNumCloseVarible">
    <div class="dialog-body">
      <h2 class="title">修改选中商品信息</h2>

      <el-form ref="form" size="small" :model="detailForm" label-width="60px" class="detail-form">

        <el-form-item label="商品:">
          <el-input :prop="detailForm.productName" disabled="disabled"  v-model="detailForm.productName" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="单位:">
          <el-input v-if="detailArray.length<2" disabled="disabled" v-model="detailForm.unit" auto-complete="off"></el-input>
          <el-select v-else-if="editPrdNumDialogType=='edit'" v-model="detailForm.unit" disabled="disabled"  placeholder="请选择" style="width:100%;">
            <el-option :label="item.unit"  :value="index" v-for="(item,index) in detailArray" :key="index"></el-option>
          </el-select>
          <el-select v-else v-model="detailForm.unit" placeholder="请选择" style="width:100%;" @change="onUnitChange" >
            <el-option :label="item.unit"  :value="index" v-for="(item,index) in detailArray" :key="index"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="规格:">
          <el-input :prop="detailForm.specification" disabled="disabled" v-model="detailForm.specification" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="配送价:">
          <el-input :prop="detailForm.price" disabled="disabled"  v-model="detailForm.price" auto-complete="off"></el-input>
        </el-form-item>
        <!--
        <el-form-item label="数量:">
          <el-input :prop="detailForm.number"  placeholder="请输入数量" v-model="detailForm.number" type="number" size="small" min=1 auto-complete="off" @change="onNumberChange"></el-input>
        </el-form-item>
        -->
        <el-form-item label="数量:">
          <el-input-number v-model="detailForm.number" :min="minNumber"  @change="onNumberChange" style="width:100%;"></el-input-number>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button round type="primary" @click="onEditPrdNumBtnOk">确定</el-button>
      <!--
      <el-button round @click="editPrdNumVisible = false">取消</el-button>
      -->
    </div>
  </el-dialog>


</div> 
</template>

<script>

import api from '@/api/apiList'
import $http from '@/utils/httputils'
import PageTable from '@/components/PageTable'

export default {
  components:{
    PageTable
  },
  props:{
    params:{
      type: Object,
      default: () => {
        return {
          title:'',
          visible:false,
          row:null
        }
      }
    }
  },
  data() {
    let self=this;
    return {
      // 表格是否自动请求
      tableAuto : false,
      // 表格是否总计
      showSummary : true,
      // 总计的字段
      summaries :["productNo","number","totalPrice"],
      // 已选中商品对话框
      selectedDialogVisible : false ,
      editPrdNumCloseVarible : false,
      // 修改数量对话框可见变量
      editPrdNumVisible : false,
      // 修改数量对话框---操作类型
      editPrdNumDialogType : "", // "add" , "edit"
      // 修改数量对话框---数量最小值
      minNumber : 0,
      // 已选中表格数据
      selectedTableList : [],
      // 商品分为"全部","已上架","已下架"("all",added","outOfStock")
      queryAjaxTag : "all", 
      pagerFixed : false,
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
      placeholder : "直接点击查询按钮",
      sortTypeVal: '全部',
      searchKeyWord : "",
      columns:[
        {
          type:'index',
          title:'序号',
          width: 60
        },
        {
          prop:'productNo',
          title:'商品货号',
          width:140
        },
        {
          prop:'productName',
          title:'商品名称',
          width:140
        },
        {
          prop:'unit',
          title:'单位',
          width:60
        },
        {
          prop:'salePrice',
          title:'零售价',
          width:100
        },
        {
          prop:'specification',
          title:'规格',
          width:60
        },
        {
          prop:'priceWay',
          title:'计价方式',
          width:90,
          formatter:function (row, column, cellValue, index) {
            switch (cellValue) {
              case 0:
                return '普通';
                break;
              case 1:
                return '计重';
              case 1:
                return '计数';
              default:
                return '普通';
            }
          } 
        },
        {
          fixed : true,
          title:'操作',
          width:90,
          btns : [
            {
              text : "添加",
              click(row){ 
                self.onEditProduct(row,"add");
              }
            }
          ]
        }
      ],
      selectedTableColumns:[
        {
          type:'index',
          title:'序号',
          width: 60
        },
        {
          prop:'productNo',
          title:'商品货号',
          width:140
        },
        {
          prop:'productName',
          title:'商品名称',
          width:140
        },
        {
          prop:'unit',
          title:'单位',
          width:60
        },
        {
          prop:'number',
          title:'数量',
          width:80
        },
        {
          prop:'specification',
          title:'规格',
          width:60
        },
        {
          prop:'price',
          title:'配送价',
          width:100
        },
        {
          prop:'totalPrice',
          title:'小计',
          width:120,
          sortable:true,
          formatter:function (row, column, cellValue, index) {
            return (row.number*row.price).toFixed(2)
          }
        },
        {
          fixed : true,
          title:'操作',
          width:140,
          btns : [
            {
              text : "修改",
              click(row){ 
                self.onEditProduct(row,"edit");
              }
            },
            {
              text : "删除",
              click(row){ 
                self.onDeleteProduct(row);
              }
            }   
          ]
        }
      ],
      setParams:{},
      httpParams:{ //列表请求参数传递到子模板
        method:'post',
        path:api.queryPrdPage,
        data:{
          limit : 10,
          pageIndex : 1
        }
      },
      detailArray : [],
      detailForm : {
        // 被选中单位索引值
        selectedUnitIndex : 0,
        // 商品名称
        productName : "",
        // 单位
        unit  : "",
        //规格
        specification  : "",
        // 配送价格
        price : "",
        // 数量
        number  : "",
        // 总价
        totalPrice : ""
      }
    }
  },
  methods : {
    onPrdSortTypeChange(val){ 
      this.tableData=[];
      if(val==="全部"){
        this.pagerVisible=false;
        this.queryAjaxTag="all";
        this.placeholder="直接点击查询按钮";
        this.searchKeyWord="";
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
      this.queryPrdInfos();
    },
    queryPrdInfos(){  
      let tag=this.queryAjaxTag;

      const params={};

      this.searchKeyWord=this.searchKeyWord.trim();

      // 全部
      if(tag==="all"){
        params.limit=10;
        params.pageIndex=1;
        params.productNo=null;
        params.productCateName=null;
        params.productName=null;   
      }
      // 商品编码(货号)
      else if(tag==="code"){
        params.limit=10;
        params.pageIndex=1;
        params.productCateName=null;
        params.productName=null;
        params.productNo=this.searchKeyWord;     
      }
       // 商品名称
      else if(tag==="name"){
        params.limit=10;
        params.pageIndex=1;
        params.productNo=null;
        params.productCateName=null;
        params.productName=this.searchKeyWord;   
      }
      // 商品分类 
      else{
        params.limit=10;
        params.pageIndex=1;
        params.productName=null;
        params.productNo=null;
        params.productCateName=this.searchKeyWord;   
      }

      this.$refs.searchProductTable.search(params);
    },
    onSearchDialogOpen(){ 
      let flag=localStorage.getItem("prdAdding");
      //alert('--prdAdding='+flag+'----selectedProductTable--length='+this.selectedTableList.length);
      if(flag && flag=="1"){
      }else{
        //alert('--prdAdding='+flag+'--前---');
        localStorage.setItem("prdAdding","1");
        //alert('--prdAdding='+localStorage.getItem("prdAdding")+'--后---');
        this.clearAllTableDatas(1);
      }
    },
    onViewPrd(){ 
      this.params.visible=false;
      this.selectedDialogVisible=true;
    },
    onSearchDialogBtnCancel(){
      this.params.visible=false;
      this.selectedDialogVisible=false;
      this.clearAllTableDatas(0);
    },
    onEditProduct(row,type){   
      this.editPrdNumDialogType=type;     
   
      let tempArr=Object.assign({
        // 被选中单位索引值
        selectedUnitIndex : 0 ,
        // 商品名称
        productName : "",
        // 单位
        unit  : "",
        //规格
        specification  : "",
        // 配送价格
        price : "",
        // 数量
        number  : 1,
        // 总价
        totalPrice : ""
      },row);

      this.detailForm= type=="add" ? tempArr : row; 


      $http({
        path: api.chainOrderPrice,
        method: 'post',
        data: {
          productNo: row.productNo
        }
      },res=>{ 

        let unitsArray=[];
        res.data.forEach((item,index)=>{
          unitsArray.push({
            // 商品名称
            productName : item.productName,
            // 单位
            unit  : item.unit,
            // 价格
            price : item.price,
            //规格
            specification :  item.specification
          })
        })
        this.detailArray=unitsArray;
        this.detailForm.specification=this.detailArray[this.detailForm.selectedUnitIndex].specification ;
        this.detailForm.price=this.detailArray[this.detailForm.selectedUnitIndex].price ;
        this.detailForm.unit=this.detailArray[this.detailForm.selectedUnitIndex].unit ;
        this.detailForm.totalPrice=this.autoTotalPrice(this.detailForm.number,this.detailForm.price);
        this.editPrdNumVisible=true;
      },err=>{},this)
    },
    onUnitChange(value){  
      this.detailForm.selectedUnitIndex=value;
      this.detailForm.specification=this.detailArray[value].specification;
      this.detailForm.price=this.detailArray[value].price;
      this.detailForm.unit=this.detailArray[value].unit;
      this.detailForm.totalPrice=this.autoTotalPrice(this.detailForm.number,this.detailForm.price);
    },
    onNumberChange(){
      this.detailForm.totalPrice=this.autoTotalPrice(this.detailForm.number,this.detailForm.price);
    },
    onDeleteProduct(row){ 
      this.selectedTableList.forEach((item,index)=>{ 
        if(item.productNo == row.productNo && item.number==row.number && item.unit==row.unit ){
          this.selectedTableList.splice(index,1)
        }   
      })
      this.tableList=this.selectedTableList;
      this.$nextTick(() => {
        this.$refs.selectedProductTable.refresh();  
      });
    },
    onBtnOk(){  
      this.$emit("onPrdSelected",this.selectedTableList);
      this.clearAllTableDatas(0);
      this.selectedDialogVisible = false;
    },
    clearAllTableDatas(tag){
      if(!tag){
        localStorage.removeItem("prdAdding");
      }
      this.$nextTick(() => {
        try {
          this.selectedTableList=[];
          //清除被选中的数据
          this.$refs.searchProductTable.clearTableRows(); 
          this.$refs.selectedProductTable.clearTableRows();
          this.searchKeyWord="";
        } catch (error) {
        }
      });
    },
    onBtnContinue(){
      this.selectedDialogVisible=false;
      this.params.visible=true;
    },
    onSelectedDialogBtnCancel(){
      this.selectedDialogVisible=false;
      this.params.visible=false;
      this.clearAllTableDatas(0);
    },
    objHasExistedInArray(obj,arr){
      let _existed=false;
      let _index=-1;
      arr.forEach((item,index)=>{
        if(item.productNo==obj.productNo && item.unit==obj.unit){
          _existed=true;
          _index=index;
          return false;
        }
      })
      return {
        exist : _existed,
        index : _index
      }
    },
    onEditPrdNumBtnOk(){  
      //console.log("------前面-------Type=="+this.editPrdNumDialogType)
      //console.log(this.selectedTableList)
      if(this.editPrdNumDialogType=="add"){
        let {exist,index}=this.objHasExistedInArray(this.detailForm,this.selectedTableList);
        if(exist){
          this.selectedTableList[index].number=this.detailForm.number;
          this.selectedTableList[index].price=this.detailForm.price;
          this.selectedTableList[index].totalPrice=this.detailForm.totalPrice; 
          this.editPrdNumVisible=false; 
        }else{
          this.selectedTableList.push(this.detailForm);
          this.editPrdNumVisible=false; 
        }
        try {
          this.$refs.selectedProductTable.refresh();  
        } catch (error) {
        }
      }else{
        this.selectedTableList.forEach(item=>{
          if(item.productNo==this.detailForm.productNo && item.unit==this.detailForm.unit){
            item.unit=this.detailForm.unit;
            item.number=this.detailForm.number;
            item.price=this.detailForm.price;
            item.totalPrice=this.detailForm.totalPrice; 
            return;
          }
        })
        this.editPrdNumVisible=false;
        try {
          this.$refs.selectedProductTable.refresh();  
        } catch (error) {
        }
      }
      //console.log("------后---------")
      //console.log(this.selectedTableList)
    },
    autoTotalPrice(number,price){
       return (number*price).toFixed(2);
    }
  }


}
</script>

<style scoped>
.dialog-body{
  padding:18px 28px 0;
}
.dialog-body>.title{
  text-align: center;
  font-weight: bold;
  font-size:16px;
  padding:18px 0 12px;
}
.dialog-body>.search-prd-form{
  padding:10px;
  overflow:hidden;
  margin:0 auto;
  text-align: center;
}
.dialog-body>.search-prd-result{
  max-height: 480px;
  overflow:auto;
  margin:0 auto;
}
.dialog-body>.search-prd-result>h2{
 font-weight: bold;
 font-size:15px;
 background-color: #f5f5f5;
 padding:10px;
}
</style>
