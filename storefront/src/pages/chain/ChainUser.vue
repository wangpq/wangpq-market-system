<template>
  <div class="wrapper">
    <div class="header">
      <label>用户状态:</label>
      <el-select size="small" v-model="userSelected" clearable placeholder="请选择">
        <el-option
          v-for="item in userOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button size="small" class="interval" type="primary" icon="el-icon-search" @click="onSearch">搜索</el-button>
    </div>

    <BtnMenu :pmenu = "this.$route.query"
             @add="add"
             @edit = "edit()"
             @delete="deleted" @freeze = "freeze"></BtnMenu>

    <PageTable ref="table"
               @select = "onSelect"
               :setParams = "setParams"
               :columns = "columns"
               :httpParams="httpParams"></PageTable>

    <UserDialog :params="digParams" @refresh = "refresh"></UserDialog>

  </div>

</template>

<script>
  import PageTable from '@/components/PageTable'
  import BtnMenu from '@/components/BtnMenu'
  import UserDialog from '@/pages/chain/UserDialog'
  import $http from '@/utils/httputils'
  import api from '@/api/apiList'
  export default {
    name: "ChainUser",
    data(){
      return{
        digParams:{
          title:'新增用户',
          visible:false,
          row:null
        },
        selectColumns:[],
        inputName:"",
        setParams:{
        },
        //列表显示列，传递到table子模板
        columns:[{
          type:'selection',
          width:'50',
          enable:(row,index)=>{
            if (row.primary == 1){
              return false;
            }
            return true
          }
        },{
          type:'index',
          title:'序号',
           width: 60
        },{
          prop:'name',
          title:'用户名',
          width:'180'
        },{
          prop:'nickname',
          title:'昵称',
          width:'100'
        },{
          prop:'rolesName',
          title:'角色',
          width:'180'
        },{
          prop:'tel',
          title:'电话',
          width:'150'
        },{
          prop:'primary',
          title:'用户类型',
          width:'180',
          formatter:function (row, column, cellValue, index) {
            switch (cellValue) {
              case 1:
                return '超级管理员';
              default:
                return '普通用户';
            }
          }
        },{
          prop:'isFreeze',
          title:'冻结',
          width:'100',
          formatter:function (row, column, cellValue, index) {
            switch (cellValue) {
              case -1:
                return '冻结';
              default:
                return '正常';
            }
          }
        },{
          prop:'chainName',
          title:'门店',
          width:'150'
        }],
        httpParams:{ //列表请求参数传递到子模板
          method:'post',
          path:'chain/user/page',
          data:{}
        },
        btMenus:null,
        userSelected:0,
        userOptions:[{
          value:0,
          label:'全部'
        },{
          value:1,
          label:'正常'
        },{
          value:-1,
          label:'冻结'
        }]
      }
    },
    components: {
      PageTable,
      BtnMenu,
      UserDialog
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
        this.digParams.title = '编辑用户';
        this.digParams.visible = true;
        this.digParams.row = this.selectColumns[0];
      },
      deleted(){
        if (this.selectColumns.length <= 0){
          this.$toast("请选择一行数据");
          return;
        }
        let ids = "";
        this.selectColumns.forEach(function(value,index,array){
          ids += array[index].id + ",";
        });
        ids = ids.substring(0,ids.length - 1);
        this.$dialog({
          title:'温馨提示',
          visible:true,
          message:'是否确定删除数据?',
          yes:true,
          no:true
        },()=>{
          $http({
            method:'delete',
            path: api.deleteUser,
            data:{ ids:ids },
          },res=>{
            this.$toast('删除成功');
            this.$refs.table.refresh();
          },err => {
          },this);
        });



      },
      freeze(){
        if (this.selectColumns.length <= 0){
          this.$toast("请选择一行数据");
          return;
        }
        let ids = "";
        let haveNormal = false;
        this.selectColumns.forEach(function(value,index,array){
          ids += array[index].id + ",";
          if (array[index].isFreeze == 1){
            haveNormal = true;
          }

        });
        let freeze = haveNormal?-1:1;
        ids = ids.substring(0,ids.length - 1);
        $http({
          method:'put',
          path: api.freezeUser,
          data:{ freeze:freeze,ids:ids },
        },res=>{
          this.$toast('冻结/解冻成功');
          this.$refs.table.refresh();
        },err => {
        },this);
      },
      onSelect(val){
        this.selectColumns = val;
      },
      onSearch(){
        let params = {};
        params.isFreeze = null;
        if (this.userSelected != 0){
          params.isFreeze = this.userSelected;
        }
        this.$refs.table.search(params);
      }
    },
    mounted(){

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
}
.header>label {
  font-size: 14px;
  margin-right:8px;
}
.interval{
  margin: 0 0 0 10px;
}


</style>
