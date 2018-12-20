<template>
    <div>
        <Modal 
          v-model="initOption.visible"
          :mask-closable="false"
          style="z-index:1000;position:relative;"
          width=1280
        >
            <p slot="header" style="color:#f60;text-align:center;">
                <Icon type="information-circled"></Icon>
                <span>调价商品</span>
            </p>
            <div class="body">

              <Row>
                  <Col span="12"  style="padding-right:8px;">
                    <Card>
                        <p slot="title">请选择调价商品：</p>
                        <div>
                          <DataTable
                            ref="ajaxDataTable"
                            :url="apis.product.get"
                            method="post"
                            :columns="columns"
                            :searchForm="searchForm"
                            :limits ="pageLimit"
                            :isLoadDataNow ="isLoadDataNow"
                            :isLoadHandleBtns="isBtnListVisible"
                          >
                              <template slot="search">
                                  <Form-item label="货号" :label-width="60" prop="productNo">
                                      <Input type="text" v-model="searchForm.productNo"></Input>
                                  </Form-item>
                                  <Form-item label="商品名称" :label-width="60" prop="productName">
                                      <Input type="text" v-model="searchForm.productName"></Input>
                                  </Form-item>
                                  <Form-item label="审核状态" :label-width="60" prop="checkedStatus">
                                      <Select class="checkedStatus" v-model="searchForm.checkedStatus" clearable>
                                          <Option v-for="item in apis.dictVal.checkedStatus" :value="item.value" :key="item.value">
                                              {{item.label }}
                                          </Option>
                                      </Select>
                                  </Form-item>
                                  <Form-item label="上下架" :label-width="60" prop="putawayStatus">
                                      <Select class="checkedStatus" v-model="searchForm.putawayStatus" clearable>
                                          <Option v-for="item in apis.dictVal.putawayStatus" :value="item.value" :key="item.value">
                                              {{item.label }}
                                          </Option>
                                      </Select>
                                  </Form-item>
                                  <Form-item label="商品分类" :label-width="60" prop="productCateName">
                                      <CateTreeCombo @selectNode="selectNode" ref="CateTreeCombo"
                                                    class="CateTreeCombo"></CateTreeCombo>
                                  </Form-item>
                              </template>
                          </DataTable>
                        </div>
                    </Card>
                  </Col>
                  <Col span="12" style="padding-left:8px;">
                    <Card>
                        <p slot="title">已选中调价商品：</p>
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
                <Button type="primary"  @click="handleSubmit">确定</Button>
                <Button type="error" @click="initOption.visible=false">取消</Button>
            </div>
        </Modal>


        <Modal 
          v-model="editPriceModalVisible"
          :mask-closable="false"
          style="z-index:1001;position:relative;"
        >
            <p slot="header" style="color:#f60;text-align:center;">
                <Icon type="information-circled"></Icon>
                <span>价格修改</span>
            </p>
            <div class="body">
                <Form 
                  ref="editPriceDialogForm" 
                  :model="editPriceDialogForm" 
                  :rules="formRules"
                  style="padding:0 68px;"
                >
                  <FormItem label="门店ID：" prop="productId">
                    <Input class="Input" placeholder="请输入门店ID" disabled v-model="editPriceDialogForm.productId" readonly v-on:dblclick.native="onChainIdsDblclick"/>
                  </FormItem>
                  <FormItem label="门店名称：" prop="productName">
                    <Input class="Input" placeholder="请输入门店名称" disabled v-model="editPriceDialogForm.productName" readonly v-on:dblclick.native="onChainIdsDblclick"/>
                  </FormItem>
                  <FormItem label="调整价格：" prop="price">
                    <Input class="Input" placeholder="请修改调整价格" v-model="editPriceDialogForm.price" />
                  </FormItem>
                </Form>
            </div> 
            <div slot="footer" style="text-align:center;">
                <Button type="primary"  @click="onEditPriceModalOk">确定</Button>
                <Button type="error" @click="editPriceModalVisible=false">取消</Button>
            </div>
        </Modal>

    </div>
</template>
<script>
import $http from '@/utils/httputils'
import DataTable from '@/components/common/DataTable'  
import CateTreeCombo from '@/components/tree/CateTreeCombo'

const validatePrice = (rule, value, callback) => { 
  if(value!==undefined){
    let price=String(value).trim();
    if (price!=="" && price.length>0) {
      setTimeout(() => {
          if (isNaN(value)) {
              callback(new Error('请正确输入一个数字！'));
          } else {
              callback();
          }
      }, 400);
    }else{
      callback(new Error('调整价格不能为空！'));
    }
  }else{
    callback();
  }
};

export default {
  components: {
    DataTable,
    CateTreeCombo
  },
  props: {
    initOption: {
      title: {
        type: String,
        default: '调价商品---'
      },
      visible: {
        type: Boolean
      },
      row: {
        type: Object
      }
    }
  },

  data () {
    return {
      isLoadDataNow : false,
      isBtnListVisible : false,
      pageLimit : 5,
      // 查询商品表格字段
      columns: [
        {
          width: 140,
          title: '名称',
          fixed: 'left',
          align: 'center',
          key: 'productName'
        },
        /*
        {
          width: 110,
          title: '分类',
          align: 'center',
          key: 'productCateName'
        },
        */
        {
          width: 120,
          title: '零售价(元)',
          sortable: true,
          minWidth:70,
          align: 'center',
          key: 'salePrice'
        },
        {
          width: 140,
          title: '最低售价(元)',
          sortable: true,
          minWidth:70,
          align: 'center',
          key: 'lowestPrice'
        },
        {
          width: 80,
          title: '单位',
          sortable: true,
          minWidth:70,
          align: 'center',
          key: 'unit'
        },
        {
          width: 80,
          title: '规格',
          align: 'center',
          key: 'specification'
        },
        {
          width: 110,
          title: '计价方式',
          sortable: true,
          minWidth:70,
          align: 'center',
          key: 'priceWay',
          render: (h, params) => {
            var val = params.row.priceWay
            var res = ''
            switch (val) {
              case 0:
                res = '普通'
                break
              case 1:
                res = '计重'
                break
              case 2:
                res = '计数'
                break
            }
            return h('span', {}, res)
          }
        },
        {
          width: 110,
          title: '审核状态',
          sortable: true,
          minWidth:70,
          align: 'center',
          key: 'checkedStatus',
          render: (h, params) => {
            var val = params.row.checkedStatus
            var res = ''
            var style = {}
            switch (val) {
              case 1:
                res = '已审核'
                style = {color: 'green'}
                break
              case 2:
                res = '待审核'
                style = {color: 'red'}
                break
              default :
                res = '待审核'
                style = {color: 'red'}
            }
            return h('span', {style}, res)
          }
        },
        {
          title: '操作',
          fixed: 'right',
          key: 'action',
          className: 'actionClassName',
          width: 80,
          sortable:true,
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
      // 查询商品表格搜索条件
      searchForm: {
      },
      // 选中调价商品列字段
      selectedColumns : [
        /*
        {
          width: 120,
          title: '商品ID',
          align: 'center',
          key: 'productId'
        },
        */
        {
          width: 140,
          title: '名称',
          align: 'center',
          key: 'productName'
        },
        /*
        {
          width: 80,
          title: '单位',
          sortable: true,
          minWidth:70,
          align: 'center',
          key: 'unit'
        },
        */
        {
          width: 120,
          title: '零售价(元)',
          sortable: true,
          minWidth:70,
          align: 'center',
          key: 'salePrice'
        },
        {
          width: 130,
          title: '最低售价(元)',
          sortable: true,
          align: 'center',
          key: 'lowestPrice'
        },
        {
          width: 120,
          fixed : "right",
          title: '价格',
          align: 'center',
          key: 'price'
        },
        {
          title: '操作',
          fixed: 'right',
          key: 'action',
          className: 'actionClassName',
          sortable:true,
          width:140,
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
                    this.handleEdit(params.row)
                  }
                }
              }, '修改'),
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
      ],
      // 选中调价商品数据
      selectedData : [
      ],
      // 修改价格弹框
      editPriceDialogForm: {
      },
      // 修改价格表单Rules
      formRules : {
        productId: [
          { 
            required: true, 
            message: '商品ID不能为空', 
            trigger: 'blur' 
          }
        ],
        price: [
          {
            required: true,
            validator: validatePrice, 
            trigger: 'blur'
          }
        ]
      },
      editPriceModalVisible : false
    }
  },
  methods: {
    init(){
      this.clear();
    },
    handleSubmit(){
      /*
      let products=[];
      this.selectedData.forEach(item=>{
        products.push({
          productId : item.productId,
          price : item.price
        });
      })
      this.$emit("on-ok",products);
      */
      this.$emit("on-ok",this.selectedData);
      this.$nextTick(() => {
        this.clear(); 
        this.initOption.visible=false;
      })
    },
    clear(){
      this.$refs.ajaxDataTable.clear(); 
      this.selectedData=[];
      this.$refs.noAjaxDataTable.refresh(); 
    },
    onEditPriceModalOk(){ 
      let prd={
        productName : this.editPriceDialogForm.productName,
        salePrice : this.editPriceDialogForm.salePrice,
        lowestPrice : this.editPriceDialogForm.lowestPrice,
        unit : this.editPriceDialogForm.unit,    
        productId : this.editPriceDialogForm.productId,
        price : this.editPriceDialogForm.price
      }; 

      if(this.editPriceDialogForm.type=="add"){
        this.selectedData.push(prd);
      }else{
        this.selectedData.forEach(item=>{
          if( item.productId==prd.productId && item.unit==prd.unit){
            item.price=prd.price;
          }
        })
      }
      this.$refs.noAjaxDataTable.refresh();
      this.editPriceModalVisible=false;
    },
    isPrdExist(obj){
      let flag=false;
      this.selectedData.forEach(item=>{
        if( item.productId==obj.productId && item.unit==obj.unit){
          flag= true;
        }
      })
      return flag;
    },
    handleAdd(row){
      let obj={
        productId : row.id,
        unit : row.unit
      }
      if(this.isPrdExist( obj )){
        this.$Message.warning('数据已经存在！');
      }else{
        this.editPriceModalVisible=true;
        this.editPriceDialogForm.type="add";
        this.editPriceDialogForm.productName=row.productName;
        this.editPriceDialogForm.salePrice=row.salePrice;
        this.editPriceDialogForm.lowestPrice=row.lowestPrice;
        this.editPriceDialogForm.unit=row.unit;
        this.editPriceDialogForm.productId=row.id;
        this.editPriceDialogForm.price=row.salePrice;
      }
    },
    handleEdit(row){ 
      this.editPriceModalVisible=true;
      this.editPriceDialogForm.type="edit";
      this.editPriceDialogForm.productName=row.productName;
      this.editPriceDialogForm.salePrice=row.salePrice;
      this.editPriceDialogForm.lowestPrice=row.lowestPrice;
      this.editPriceDialogForm.unit=row.unit;
      this.editPriceDialogForm.productId=row.productId;
      this.editPriceDialogForm.price=row.price;
    },
    hanldeDelete(row){ 
      this.$Modal.confirm({
        title: '请确认',
        content: '确定删除【' + row.productName + '】的商品？',
        onOk: () => { 
          let arr=JSON.parse(JSON.stringify(this.selectedData));
          let temp=[];
          arr.forEach(item=>{
            if( item.productId==row.productId && item.unit==row.unit  ){
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
    },
    selectNode (opt) {
      this.searchForm.productCateId = opt.id
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
