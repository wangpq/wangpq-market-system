<template>
<div>      
  <Input class="Input" :rows=1 type="textarea" placeholder="请双击选择门店" readonly v-model="storeIds" @dblclick.native="onChainIdsDblclick"  ref="textareaNode"/>
  <Modal 
    v-model="visible"
    :mask-closable="false"
    width=1280
  >
      <p slot="header" style="color:#f60;text-align:center;">
          <Icon type="information-circled"></Icon>
          <span>门店选择</span>
      </p>
      <div class="body">
        <Row>
            <Col span="12"  style="padding-right:8px;">
              <Card>
                  <p slot="title">请选择门店：</p>
                  <div>
                    <DataTable
                      ref="DataTable"
                      :url="apis.chain.get"
                      method="post"
                      :limits ="pageLimit"
                      :columns="columns"
                      :searchForm="searchForm"
                      :isLoadDataNow ="isLoadDataNow"
                      :isLoadHandleBtns="isBtnListVisible"
                    >
                        <template slot="search">
                            <Form-item label="门店名称" :label-width="60" prop="name">
                                <Input type="text" v-model="searchForm.name"></Input>
                            </Form-item>
                            <Form-item label="门店类型" :label-width="60" prop="shopType">
                                <Select v-model="searchForm.shopType" clearable style="min-width: 8vw">
                                    <Option v-for="item in apis.dictVal.shopType" :value="item.value" :key="item.value">
                                        {{item.label }}
                                    </Option>
                                </Select>
                            </Form-item>
                            <Form-item label="门店地址" :label-width="60" prop="address">
                                <Input type="text" v-model="searchForm.address"></Input>
                            </Form-item>
                        </template>
                    </DataTable>
                  </div>
              </Card>
            </Col>
            <Col span="12" style="padding-left:8px;">
              <Card>
                  <p slot="title">已选中门店：</p>
                  <div>
                    <DataTable 
                      ref="noAjaxDataTable"
                      :columns="selectedColumns" 
                      :source="selectedData"
                      :limits ="pageLimit"
                      :isLoadHandleBtns="isBtnListVisible"
                    >
                    </DataTable>  
                  </div>
              </Card>
            </Col>
        </Row>
      </div> 
      <div slot="footer" style="text-align:center;">
          <Button type="primary"  @click="onBtnOk">确定</Button>
          <Button type="error" @click="visible=false">取消</Button>
      </div>
  </Modal>
</div>
</template>

<script>
  import $http from '@/utils/httputils'
  import DataTable from '@/components/common/DataTable'  

  export default {
    components: {
      DataTable
    },
    props: {
      ids: {
        type: String,
        default:""
      },
      value: {
        type: Boolean,
        default:false
      }
    },
    watch:{
      ids(val) {
        this.storeIds = val;
      },
      value(val) {
        this.visible = val;
      },
      visible(val) {
        this.$emit('input', val);
      }
    },
    data () {
      return {
        // 对话框是否可见
        visible : false,
        isLoadDataNow : false,
        isBtnListVisible : false,
        pageLimit : 5,
        columns: [
          {
            title: '门店ID',
            key: 'id',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '门店名称',
            key: 'name',
            minWidth:70,
            align: 'center'
          },
          {
            title: '详细地址',
            key: 'address',
            minWidth:70,
            align: 'center'
          },
          {
            title: '操作',
            fixed: 'right',
            key: 'action',
            className: 'actionClassName',
            width: 80,
            minWidth:70,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  style: {
                    marginRight: '5px'
                  },
                  on: {
                    click: () => {
                      this.handleAdd(params.row)
                    }
                  }
                }, '添加')
              ])
            }
          }
     
        ],
        searchForm: {
          name: null,
          shopType: null,
          address: null,
        },
        storeIds : "",
        // 选中门店数据
        selectedData : [
        ],
        // 选中门店列字段
        selectedColumns : [
          {
            title: '门店ID',
            key: 'id',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '门店名称',
            key: 'name',
            minWidth:70,
            align: 'center'
          },
          {
            title: '详细地址',
            key: 'address',
            minWidth:70,
            align: 'center'
          },
          {
            title: '操作',
            fixed: 'right',
            key: 'action',
            className: 'actionClassName',
            width:80,
            align: 'center',
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.hanldeDelete(params.row)
                    }
                  }
                }, '删除')
              ])
            },
          }
        ]
      }
    },
    methods: {
      init(){
        this.selectedData=[];
        this.$refs.noAjaxDataTable.refresh();
      },
      onChainIdsDblclick () { 
        this.visible = true;
        this.init();
      },
      onBtnOk(){  
        let rows=this.selectedData;
        let str="";
        if(rows.length>0)
          str=this.formatData(rows)
        this.storeIds=str;
        this.visible=false;
        this.$refs.textareaNode.focus();
        this.$emit("on-select-ok",str);
      },
      formatData(arr){
        let temp=[];
        arr.forEach(item => {
          temp.push(item.id);
        });
        return temp.join(",");
      },
      isPrdExist(obj){
        let flag=false;
        this.selectedData.forEach(item=>{
          if( item.id==obj.id && item.name==obj.name){
            flag= true;
          }
        })
        return flag;
      },
      handleAdd(row){ 
        let obj={
          id : row.id,
          name : row.name
        }
        if(this.isPrdExist( obj )){
          this.$Message.warning('数据已经存在！');
        }else{
          this.selectedData.push(row);
          this.$nextTick(() => {
            this.$refs.noAjaxDataTable.refresh(); 
          })
        }
      },
      hanldeDelete(row){ 
        this.$Modal.confirm({
          title: '请确认',
          content: '确定删除【' + row.name + '】的商品？',
          onOk: () => { 
            let arr=JSON.parse(JSON.stringify(this.selectedData));
            let temp=[];
            arr.forEach(item=>{
              if( item.id==row.id && item.name==row.name  ){
              } else{
                temp.push(item);
              }
            })
            this.selectedData=temp;
            this.$nextTick(() => {
              this.$refs.noAjaxDataTable.refresh(); 
            })
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.store-select {
    height: 32px;
    padding :0;
    border:none;
    position: relative;
    .tree-wrap{
      position:absolute;
      left:0;
      right:0;
      top:32px;
      z-index:9999;
      background-color: #fff;
    }
}
</style>
