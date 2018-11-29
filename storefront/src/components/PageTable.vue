<template>
  <div>
    <template v-if="setParams && setParams.report">
      <el-button   class="implement" type="info"  plain round @click="onReport">{{setParams.report.title}}</el-button>
    </template>
    <el-table class="talbe"
      ref="multipleTable"
      :data="pageList"
      style="width: 100%"
      :max-height="maxHeight"
      :show-summary="showSummary"
      :summary-method="getSummaries"
      @row-click="onRowClick"
      @selection-change="onSelect"
    >
      <template v-for = "(item,index)  in columns">
        <el-table-column v-if="item.type == 'spread'"
          type="expand"
          align="center"
          :key="index"
          :width="item.width"
          :label="item.title"
        >
          <template slot-scope="props">
            <PageDetail
              :rows="props.row"
              :type="item.rowtype">
            </PageDetail>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.fixed && item.btns"
            align="center"
            :min-width="item.width"
            :label="item.title"
          >
          <template slot-scope="scope" >
            <template v-for="(btn,index) in item.btns">
              <el-button @click="btn.click(scope.row)" type="text" size="small" :key="index">{{btn.text}}</el-button>
            </template>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.type=='index'"
          align="center"
          :key="index"
          :type="item.type"
          :render-header = "item.render"
          :formatter="item.formatter"
          :prop="item.prop"
          :sortable="item.sortable"
          :label="item.title"
          :selectable = "item.enable"
          :width="item.width"
        >
        </el-table-column>
        <el-table-column v-else
          align="center"
          :key="index"
          :type="item.type"
          :render-header = "item.render"
          :formatter="item.formatter"
          :prop="item.prop"
          :sortable="item.sortable"
          :label="item.title"
          :selectable = "item.enable"
          :min-width="item.width"
          :fixed="item.fixed"
        >
        </el-table-column>
      </template>
    </el-table>
      <el-pagination :class="pagerFixed? 'pagination' : 'pagination normal'"
        @size-change="handleSizeUpdate"
        @current-change="handleCurrentUpdate"
        background
        :current-page="currentPage"
        :page-sizes="sizeSelect"
        :page-size="pageSize"
        :total="pageCounts"
        :pager-count="pageShow"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
  </div>
</template>

<script>
  import $http from '@/utils/httputils'
  import PageDetail from '@/components/PageDetail'
    export default {
      name: "PageTable",
      components: {
        PageDetail
      },
      props:{
        // 是否自动请求数据，默认false
        auto :{
          type:Boolean,
          default: true
        },
        maxHeight :{
          type:String,
          default: () => {
            return "6800"
          }
        },
        // 是否显示总计
        showSummary:{
          type:Boolean,
          default: false
        },
        // 需要总计的列字段数组
        summaries:{
          type: Array,
          default: () => {
            return []
          }
        },
        // 不请求AJAX直接赋值表格数据
        tableList :{
          type:Array,
          default: () => {
            return null
          }
        },
        httpParams:{ //列表请求参数
          type: Object,
          default: () => {
            return {}
          }
        },
        setParams:{//列表配置参数
          type:Object,
          default:() => {
              return {}
          }
        },
        //排序
        sort:{

        },
        spreadColumn:{
          type:Array,
          required: false
        },
        columns:{ //列表头部信息
          type:Array,
          required: false
        },
        //分页是否固定于底部
        pagerFixed : { 
          type: Boolean,
          default: true
        }
      },
      data(){
        return{
          dataList : this.tableList,
          pageList:[],
          sizeSelect:[10,20,40,50,100,120,200],
          pageSize:10,
          pageCounts:0,
          currentPage:1,
          pageShow:9
        }
      },
      methods:{
        clearTableRows(){
          this.dataList=[];
          this.autoGetPageList()
        },
        clearSelection(){
          this.$refs.multipleTable.clearSelection();
        },
        renderHeader(h, { column, $index }){
          //console.log("展开事件去去去:")
        },
        //更新每页显示条数
        handleSizeUpdate(index){
          this.pageSize = index;
          this.autoGetPageList();
        },
        //更新当前页
        handleCurrentUpdate(page){
          this.currentPage = page;
          this.autoGetPageList();
        },
        search(params){ 
          this.httpParams.data = Object.assign({},this.httpParams.data,params);
          this.getPageList()
        },
        onSelect(val){
          this.$emit('select', val);
        },
        onRowClick(row, event, column){
          if (row.hasOwnProperty("primary") && row.primary == 1){
            return;
          }
          this.$refs.multipleTable.toggleRowSelection(row);
        },
        refresh(){  
          this.autoGetPageList();
        },
        autoGetPageList(){ 
          if(this.dataList){
            if(this.dataList.length>0){
              let start=(this.currentPage-1)* this.pageSize;
              let end=start+this.pageSize;
              this.pageList = this.dataList.slice(start, end);
              this.pageCounts = this.dataList.length;
            }else{
              this.pageList = [];
              this.pageCounts = 0;
            }
          }else{
            this.getPageList();
          }
        },
        getPageList(){ 
          if (this.httpParams == null){
            return;
          }
          let params = this.httpParams;
          params.data.limit = this.pageSize;
          params.data.pageIndex = this.currentPage;
          $http({
            method:params.method,
            path:params.path,
            data:params.data,
          },res=>{
            this.pageList = res.data.list;
            this.currentPage = res.data.pageIndex;
            this.pageCounts = res.data.total;
          },err => {
          },this);
        },
        onReport(){
          if (this.setParams == null || !this.setParams.hasOwnProperty("report")){
            this.$toast("参数不正确");
            return;
          }
          let params = this.setParams.report;
          let data = {
            jsbody : JSON.stringify(this.httpParams.data)
          };
          $http({
            method:params.method,
            path:params.path,
            data:data
          },res=>{
            this.$toast("生成成功");
          },err => {
          },this);
        },
        getSummaries(param) {
          if(!this.showSummary){
            return false;
          }
          const { columns, data } = param;
          const sums = [];

          const tempArr=[];
          columns.forEach((column, index) => { 
            tempArr.push(column.type);
          })
          
          let sumsIndex=tempArr.indexOf("index");
          const selectionIndex=tempArr.indexOf("selection");
          if(sumsIndex<0){
            if(selectionIndex==0){
              sumsIndex=1;
            }else if(selectionIndex!==0){
              sumsIndex=0;
            }
          }
  
          columns.forEach((column, index) => { 
  
            if( this.summaries.indexOf(column.property) >-1 ){
               // 自编码:selfCode , 条码:productNo 
              if(column.property==="selfCode" || column.property==="productNo" ){
                sums[index] = data.length+"种";
              }
              else if(column.property==="no"){
                sums[index] = data.length+"条";              
              }
              else{
                const values = data.map(item => Number(item[column.property])); 
                if (!values.every(value => isNaN(value))) {
                  sums[index] = values.reduce((prev, curr) => {
                    const value = Number(curr);
                    if (!isNaN(value)) {
                      return prev + curr;
                    } else {
                      return prev;
                    }
                  }, 0);
                  sums[index] += '';
                }
                sums[index]=parseFloat(sums[index]).toFixed(2);
              }
            }
        
          });

          sums[sumsIndex] = '总计';

          return sums;
        }
      },
      mounted(){
        this.auto ? this.autoGetPageList() : null;
        this.$nextTick(function () {
          this.$on('search', function () {
            //console.log('监听成功')
          })
        })
      },
      watch: {
        tableList(val){
          this.dataList=val;
        }
      }
    }
</script>

<style scoped>
.pagination{
  position: absolute;
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
.pagination.normal{
  position:inherit;
  left: 0;
  right: 0;
  border-top-left-radius:0;
  border-top-right-radius:0;
  border-bottom-left-radius:6px;
  border-bottom-right-radius:6px;
}
.implement{
  margin: 0.2rem 0 0 0.2rem;
}

.talbe{
  margin: 0.2rem 0 0 0.2rem;
}
</style>
