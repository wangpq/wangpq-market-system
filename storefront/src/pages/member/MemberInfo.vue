<template>
  <div class="wrapper">
    <div class="header">

      <span class="group">

        <label class="interval">姓名:</label>
        <el-input size="small" placeholder="请输入内容" v-model="inputName" >
        </el-input>

        <label class="interval">类型:</label>
        <el-select size="small" v-model="selectType" slot="prepend" placeholder="请选择" style="width:84px;">
          <el-option label="手机号" value="1"></el-option>
          <el-option label="身份证" value="2"></el-option>
          <el-option label="其他" value="0"></el-option>
        </el-select>
        <el-input size="small" placeholder="请输入内容" v-model="inputType" >
        </el-input>

        <label class="interval">性别:</label>
        <el-select size="small" v-model="selectSex" slot="prepend" placeholder="请选择" style="width:68px;">
          <el-option label="全部" value="0"></el-option>
          <el-option label="男" value="1"></el-option>
          <el-option label="女" value="2"></el-option>
        </el-select>
      </span>

      <span class="group">
        <label class="interval">注册时间:</label>
        <DateSearch @getDateTime="onSearch"></DateSearch>
      </span>

    </div>
    <BtnMenu :pmenu = "this.$route.query"
             @add="add"
             @edit = "edit()" ></BtnMenu>
    <PageTable ref="table"
               @select = "onSelect"
               :setParams = "setParams"
               :columns = "columns"
               :httpParams="httpParams"></PageTable>
    <MemberDialog :params="digParams" @refresh = "refresh"></MemberDialog>
  </div>



</template>

<script>
  import dateformat from '@/utils/dateformat'

  import PageTable from '@/components/PageTable'
  import DateSearch from '@/components/DateSearch'
  import BtnMenu from '@/components/BtnMenu'
  import MemberDialog from '@/pages/member/MemberDialog'
  import api from '@/api/apiList'
  export default {
      name: "MemberInfo",
      components:{
        PageTable,
        DateSearch,
        BtnMenu,
        MemberDialog
      },
      methods:{
        refresh(){
          this.$refs.table.refresh();
        },
        add(){
          this.digParams.title = '新增用户';
          this.digParams.visible = true;
          this.digParams.row = null;
        },
        edit(){
          if (this.selectColumns.length <= 0){
            this.$toast("请选择一行数据");
            return;
          }else if (this.selectColumns.length > 1){
            this.$toast("编辑数据不能选择多行数据");
            return;
          }
          this.digParams.title = '编辑会员';
          this.digParams.visible = true;
          this.digParams.row = this.selectColumns[0];
        },
        onSelect(val){
          this.selectColumns = val;
        },
        onSearch(start,end){
          let params = {};
          this.inputType=this.inputType.trim();
          this.inputName= this.inputName.trim();

          params.startTime = start;
          params.endTime = end;
          params.gender = this.selectSex;
          if (this.selectSex === '0'){
            params.gender = null;
          }
          params.type = this.selectType;
          if (params.type == "0"){
            params.type = null;
          }

          params.memberCode = this.inputType;
          params.name = this.inputName;
          this.$refs.table.search(params);
        }
      },
    data(){
        return{
          selectType:"1",
          inputType:"",
          selectSex:"0",
          inputName:"",
          selectColumns:[],
          digParams:{
            title:'新增用户',
            visible:false,
            row:null
          },
          columns:[{
            type:'selection',
            width:'50'
          },{
            type:'index',
            title:'序号',
            width: 60
          },{
            prop:'name',
            title:'姓名',
            width:'120'
          },{
            prop:'memberCode',
            title:'会员号',
            width:'180'
          },{
            prop:'type',
            title:'类型',
            width:'100',
            formatter:function (row, column, cellValue, index) {
              switch (cellValue) {
                case 1:
                case "1":
                  return '手机';
                  break;
                case 2:
                case "2":
                  return '身份证';
                default:
                  return '未知';
              }
            }
          },{
            prop:'gender',
            title:'性别',
            width:'120',
            formatter:function (row, column, cellValue, index) {
              switch (cellValue) {
                case 1:
                  return '男';
                  break;
                case 2:
                  return '女';
                default:
                  return '保密';
              }
            }
          },{
            prop:'birthday',
            title:'生日',
            width:'180',
            formatter:function (row, column, cellValue, index) {
              if(cellValue && cellValue!==""){
                if(typeof(cellValue)==="string"){
                   return cellValue.substring(0,10)
                }else{
                   return dateformat.format(cellValue, 'yyyy-MM-dd');
                }
              }else{
                return cellValue;
              }
            }
          },{
            prop:'gradeName',
            title:'等级',
            width:'120'
          },{
            prop:'mobile',
            title:'电话',
            width:'120'
          },{
            prop:'integral',
            title:'积分',
            width:'120'
          },{
            prop:'registerTime',
            title:'注册时间',
            width:'180'
          },{
            prop:'remark',
            title:'备注',
            width:'120'
          }],
          setParams:{},
          httpParams:{ //列表请求参数传递到子模板
            method:'post',
            path:api.queryMembers,
            data:{
            }
          }
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
.el-select{
  width: 100px;
}

.el-input{
  width: 200px;
}
.interval{
  margin: 0 8px;
}

</style>
