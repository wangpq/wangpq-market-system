<template>
<div>
  <!--新增订货单对话框-->
  <el-dialog :visible.sync="params.visible"  @open="onOpen" width="1000px" top="0vh" :center="center">
    <div class="dialog-content">
      <h2 class="title">{{params.title}}</h2>
      <div class="area-top">
        <div class="single-page">
          <el-form ref="form" size="small" :model="form" label-width="80px" class="demo-ruleForm">     
            <el-form-item label="订货人:" prop="orderer">
              <el-input :prop="form.orderer" disabled v-model="form.orderer" placeholder="订货人" auto-complete="off"></el-input>
            </el-form-item>
            
            <el-form-item label="到货日期:" prop="deliveryDate">
              <el-date-picker
                size="small"
                :prop="form.deliveryDate"
                v-model="form.deliveryDate"
                type="date"
                placeholder="选择到货日期"
              >
              </el-date-picker>
            </el-form-item>

          </el-form>
        </div>
      </div>

      <div class="area-down">
        <BtnGroup :data="btnGroup" @onAddPrd="onAddPrd" @onDeletePrd="onDeletePrd"></BtnGroup>
  
        <PageTable 
          ref="orderAddDialogTable"
          :pagerFixed="pagerFixed"
          :showSummary="showSummary"
          :summaries="summaries"
          @select = "onSelect"
          :columns = "columns"
          :tableList="tableList"
          maxHeight="250"
        >
        </PageTable>
  
        <NoteBook :noteList="noteList" :hasList="noteHasList" :hasTextarea="noteHasTextarea" @onChange="onNoteAreaChange" ref="noteBook"></NoteBook>
      </div>
 
    </div>

    <span slot="footer" class="dialog-footer">
      <el-button round type="primary" @click="onBtnOk">确定</el-button>
      <el-button round @click="params.visible = false">取消</el-button>
    </span>

  </el-dialog>

  <!--添加新商品对话框-->
  <SelectProduct :params="selectProductParams" @onPrdSelected="onPrdSelected"></SelectProduct>

</div>
</template>

<script>
  import api from '@/api/apiList'
  import $http from '@/utils/httputils'
  import dateformat from '@/utils/dateformat'
  import PageTable from '@/components/PageTable'
  import NoteBook from '@/components/NoteBook'
  import BtnGroup from '@/components/BtnGroup'
  import SelectProduct from '@/components/SelectProduct'

  export default {
    components:{
      PageTable,
      NoteBook,
      BtnGroup,
      SelectProduct
    },
    props:{
      params:{
        type: Object,
        default: () => {
          return {
            title:'新增会员',
            visible:false,
            row:null
          }
        }
      }
    },
    data(){
      return{
        center : true,
        // 新增订货单产生的no
        newOrderNo : "",
        // 表格是否总计
        showSummary : true,
        // 总计的字段
        summaries :["productNo","number","totalPrice"],
        noteList : [],
        tableList : [],
        orderAddSelectRows : [],
        // 选择商品对话框参数
        selectProductParams:{
          title:'',
          visible:false
        },
        // 新增订货单+修改被驳回订货单 页参数
        form:{
          // 订货人
          orderer:"",
          // 到货日期
          deliveryDate : "",
        },
        btnGroup:[
          {
            disabled : false,
            type : "primary",
            click : "onAddPrd",
            icon : "el-icon-circle-plus-outline",
            name : "添加"
          },
          {
            disabled : false,
            type : "danger",
            click : "onDeletePrd",
            icon : "el-icon-remove-outline",
            name : "删除"
          },
        ],

        // 分页是否固定底部
        pagerFixed : false,
      
        //内部沟通
        noteHasList : false,
        noteHasTextarea : true,
        // 内部沟通输入框
        textarea : "",
        //表格 columns
        columns:[
          {
            type:'selection',
            width:60
          },
          {
            type:'index',
            title:'序号',
            width: 80
          },
          {
            prop:'productNo',
            title:'条码',
            width:'140'
          },
          {
            prop:'productName',
            title:'商品',
            width:'140'
          },
          {
            prop:'unit',
            title:'单位',
            width:'60'
          },
          {
            prop:'number',
            title:'数量',
            width:'80'
          },
          {
            prop:'specification',
            title:'规格',
            width:'80'
          },
          {
            prop:'price',
            title:'配送价',
            width:'120',
            sortable:true
          },
          {
            prop:'totalPrice',
            title:'小计',
            width:'120',
            sortable:true
          }
        ] 
      }
    },

    methods:{
      onAddPrd(){
        this.selectProductParams.title = '添加商品';
        this.selectProductParams.visible = true;
      },
      onDeletePrd(){
        if (this.orderAddSelectRows.length <= 0){
          this.$toast("请至少选择一行数据");
          return;
        }
        let product=this.tableList
        this.orderAddSelectRows.forEach((item,index)=>{ 
          product.forEach((n,i)=>{ 
            if(n.productNo == item.productNo){
              product.splice(i,1)
            }   
          })
        })
        this.tableList=product;
        this.$nextTick(() => {
          this.$refs.orderAddDialogTable.refresh();  
        });
      },
      paramInit(){          
        let userInfo=JSON.parse(localStorage.userInfo);
        this.form.orderer=userInfo.name+'['+userInfo.nickname+']';
      },
      onOpen(){  
        // 加try catch 处理第一次记载时候未知的报错
        try {
          this.$refs.noteBook.clearTextarea();
        } catch (error) {
        }
        if (this.params.row != null){
          this.form = this.params.row;
        }else{
          this.paramInit();
        }
      },
      onNoteAreaChange(val){
        this.textarea=val;
      },

      onBtnOk(){
        if(!!this.form.deliveryDate){  
          // 这是已经格式化的
          if(typeof(this.form.deliveryDate)==="string"){
          }else{
            this.form.deliveryDate=dateformat.format(this.form.deliveryDate, 'yyyy-MM-dd hh:mm:ss');
          }
        }else{
          this.$toast("请选择到货日期！")
          return false;
        }
        if(this.tableList.length<=0){
          this.$toast("若想新增订货单，请先添加商品！")
          return false;
        }
        const params={};
        let orderProduct=[];
        this.tableList.forEach(item=>{
          orderProduct.push({
            "number": item.number,
            "productId": item.id,
            "productNo": item.productNo,
            "unit": item.unit
          });
        })

        params.arriveTime=this.form.deliveryDate;
        params.message=this.textarea.trim();
        params.remark="新建订货单";
        params.products=orderProduct;
  
        $http({
          method:'post',
          path: api.newOrder,
          data: params,
        },res=>{ 
          this.newOrderNo=res.data;
          this.$toast("新增订货单成功！");
          this.$emit('refresh');
          let timer=window.setTimeout(()=>{
            this.$dialog({
              title:'温馨提示',
              visible:true,
              message:'是否立即提交审核?',
              yes:true,
              no:true
            },()=>{
              this.onBtnAuditTaped();
            },()=>{
              this.params.visible = false;
            });
            window.clearTimeout(timer);
          },800)
        },err => { 
        },this);
      },
      onBtnAuditTaped(){ 
        $http({ 
          method:'put',
          path: api.submitAudit,
          data: {
            "callNo" : this.newOrderNo
          }
        },res=>{ 
          this.$toast("订货单提交审核操作成功！");  
          this.$emit('refresh');
          this.params.visible = false;
        },err => {
        },this);
      },
      onPrdSelected(data){ 
        this.tableList=data;
        this.$nextTick(() => {
          this.$refs.orderAddDialogTable.refresh();  
        });
      },
      onSelect(val){
        this.orderAddSelectRows = val; 
      }
    }
  }
</script>

<style scoped>
.el-select{
  width: 100px;
}
.el-input{
  width: 280px;
}
.dialog-content{
  padding:18px 28px 0;
}
.dialog-content>.title{
  text-align: center;
  font-weight: bold;
  font-size:16px;
  padding:18px 0 12px;
}
.area-top{
  padding:10px;
  position: relative;
}
.area-top>.single-page{
  overflow:auto;
  margin:0 auto;
}

.el-form-item{
  display: inline-block!important;
}

.note-wrap{
  position: absolute;
  right:10px;
  top:100px;
}
.note-wrap .note{
  display: inline-block;
  padding:6px 10px;
  color:#fff;
  background-color: #EF5AA1;
  border-radius:4px;
  font-size:14px;
  max-width:380px;
  margin-right:4px;
  text-align:left;
}
</style>
