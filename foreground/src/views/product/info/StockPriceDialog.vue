<template>
  <CommModal
    v-model="opt.visible"
    :title="opt.title"
    :ok-text="opt.okText"
    :cancel-text="opt.cancelText"
    @on-ok="onSave"
    @on-cancel="onCancel">

    <Row type="flex">
      <Col span="8" order="1">名称:{{opt.product.productName}}</Col>
      <Col span="8" order="2">条码:({{opt.product.productNo}})</Col>
      <Col span="8" order="3">零售价:({{opt.product.salePrice}}元)</Col>
    </Row>

    <Divider style="background: #00B83F" orientation="center"></Divider>



    <Form ref="formDynamic" :model="formDynamic" :label-width="80" style="width:36rem">
      <FormItem v-for="(item, index) in formDynamic.items"
        v-if="item.status"
        :key="index"
        :label="'规格' + (index + 1) +  ': '"
        :prop="'items.' + index + '.value'">
        <Row >
          <Col span="3" >
            <Input type="text" v-model="item.unit" placeholder="单位"></Input>
          </Col>
          <Col span="3" offset="1" >
            <Input type="text" v-model="item.specification" placeholder="规格"></Input>
          </Col>
          <Col span="3" offset="1" >
            <Input type="text" v-model="item.price" placeholder="配送价"></Input>
          </Col>
          <Col span="3" offset="1" >
            <i-switch size="large" v-model="item.active">
              <span slot="open">开启</span>
              <span slot="close">关闭</span>
            </i-switch>
          </Col>
          <Col span="3" offset="1" >
            <Button @click="removeHander(index)">删除</Button>
          </Col>
        </Row>
      </FormItem>
      <FormItem>
        <Row>
          <Col span="12">
            <Button type="dashed" long @click="addHandle" icon="md-add">添加</Button>
          </Col>
        </Row>
      </FormItem>
      <!--<FormItem>-->
      <!--<Button type="primary" @click="handleSubmit('formDynamic')">Submit</Button>-->
      <!--<Button @click="handleReset('formDynamic')" style="margin-left: 8px">Reset</Button>-->
      <!--</FormItem>-->
    </Form>

  </CommModal>

</template>

<script>
  import CommModal from '../../../../plugins/CommModal'
  import $http from '@/utils/httputils'

  export default {
    name: "StockPriceDialog",
    components: {
      CommModal
    },
    props: {
      opt: {
        visible: {
          type: Boolean
        },
        title: {
          type: String,
          default: '新增商品订货价'
        },
        okText: {
          type: String,
          default: '保存'
        },
        cancelText: {
          type: String,
          default: '取消'
        },
        product: {
          type: Object
        },
      }
    },
    data() {
      return {
        formDynamic: {
          items: []
        }
      }
    },

    methods: {
      removeHander(index){
        if (this.formDynamic.items[index].is_db) {
          this.$Modal.confirm({
            title: '温馨提示',
            content: '该数据已经保存，是否确认删除？',
            onOk: () => {
              $http({
                path: this.apis.chainStock.delete,
                method: 'delete',
                data: {ids: this.formDynamic.items[index].id}
              }).then(response => {
                if (response.data.success) {
                  this.$Notice.success({
                    title: '提示',
                    desc: '删除成功！'
                  })
                  this.formDynamic.items.splice(index,1);
                } else {
                  this.$Notice.error({
                    title: '提示',
                    desc: response.data.message
                  })
                }
              })
            }
          })
        }else{
          this.formDynamic.items.splice(index,1);
        }

      },
      addHandle(){
        this.formDynamic.items.push({
          id: 0,
          specification: null,
          price:null,
          unit: '',
          is_db:false,
          active:true,
          status:true
        });
      },
      savePrice(item) {
        $http({
          path: this.apis.chainStock.save,
          method: 'post',
          data: {
            productId: this.opt.product.id,
            productName:this.opt.product.productName,
            productNo:this.opt.product.productNo,
            specification:item.specification,
            unit:item.unit,
            price:item.price,
            isActive:item.active?1:0
          }
        }).then(response => {
          if (response.data.success) {
            // 更新父组件表格数据
            try {
              this.$parent.$children[0].query(); 
            } catch (error) { 
            }
            this.$Notice.success({
              title: '提示',
              desc: this.opt.product.productName + '产品:规格:' + item.unit + '添加成功！'
            })
          } else {
            this.$Notice.error({
              title: '提示',
              desc: response.data.message
            })
          }
        })
      },
      onSave(callback){
        this.formDynamic.items.forEach((value,index,array)=>{
          if (!value.is_db){
            if (value.specification === null || value.specification===''
               ||value.unit === null || value.unit===''
               ||value.price === null || value.price===''){
              this.$Message.info('规格:' + index + '数据不全无法保存');
              return;
            }
            this.savePrice(value);
          }
        })
        callback(true)
      },
      onCancel() {
        this.$Message.info('用户取消');
      },
      convert(list){
        if (list != null){
          list.forEach( (value,index,array) =>{
            this.formDynamic.items.push({
              id: value.id,
              specification: value.specification,
              price:value.price,
              unit: value.unit,
              is_db:true,
              active:(value.isActive == 1?true:false),
              status:true
            });
          })
        }
      },
      getStocks() {
        $http({
          path: this.apis.chainStock.page,
          method: 'post',
          data: {
            productId: this.opt.product.productId,
            productNo: this.opt.product.productNo
          }
        }).then(response => {
          if (response.data.success) {
            this.convert(response.data.data.list);
          } else {
            this.$Notice.error({
              title: '提示',
              desc: response.data.message
            })
          }
        })
      }
    },
    watch: {
      'opt.visible'(val) {
        if (val) {
          this.formDynamic.items=[];
          this.getStocks()
        }
      }
    }
  }
</script>

<style scoped>
</style>
