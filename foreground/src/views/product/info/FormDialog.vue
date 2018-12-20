<template>
    <div>
        <Modal id="productFormDialog"
               v-model="initOption.visible"
               :mask-closable="false" width="50">

            <p slot="header" style="color:#f60;text-align:center;">
                <Icon type="information-circled"></Icon>
                <span>{{initOption.title}}</span>
            </p>
            <Form ref="productForm"
                  :model="productForm"
                  :rules="formRules"
                  :label-width="90" style="overflow-y: auto;height: 70vh">

                <FormItem label="产品条码" prop="productNo" >
                    <input type="number" class=" ivu-input"  v-model="productForm.productNo" placeholder="产品条码"
                           v-on:blur="queryProduct"></input>
                </FormItem>
                <FormItem label="产品名称" prop="productName">
                    <Input v-model="productForm.productName"  placeholder="产品名称"></Input></FormItem>
                <FormItem label="产品简称" prop="productDeputyName">
                    <Input v-model="productForm.productDeputyName" s placeholder="产品简称"></Input></FormItem>
                <FormItem label="分类名称" prop="productCateName">
                    <CateTreeCombo @selectNode="selectNode"  ref="CateTreeCombo"></CateTreeCombo>
                </FormItem>
                <FormItem label="零售价" prop="salePrice">
                    <InputNumber :min="0" v-model="productForm.salePrice" placeholder="" style="width: 12rem" placeholder=""></InputNumber>
                </FormItem>
                <FormItem :min="0" label="最低售价" prop="lowestPrice">
                    <InputNumber v-model="productForm.lowestPrice" 　placeholder=""></InputNumber>
                </FormItem>
                <FormItem :min="0" label="进货价" prop="stock">
                  <Button type="primary" @click="purchase">编辑</Button>
                </FormItem>
                <!--<FormItem label="毛利润百分比（50%）" prop="grossProfit" 　>-->
                    <!--<InputNumber :formatter="value => `${value}%`" :parser="value => value.replace('%', '')"-->
                                 <!--v-model="productForm.grossProfit" 　placeholder=""></InputNumber>-->
                <!--</FormItem>-->
                <FormItem label="单位" prop="unit">
                    <Input v-model="productForm.unit" 　placeholder="例如：箱"></Input>
                </FormItem>

                <FormItem label="规格" prop="specification">
                    <InputNumber v-model="productForm.specification"
                                 　placeholder="规格 如：规格为24,且‘单位’为箱，则表示每箱24个货物"></InputNumber>
                </FormItem>
                <FormItem label="子商品">
                    <input class="ivu-input" v-model="productChildName"
                           v-on:dblclick="initSelectProOption.visible=true" placeholder="双击选择子商品" readonly=""></input>
                </FormItem>
                <FormItem label="是否允许折扣" prop="orDiscount">
                    <Select v-model="productForm.orDiscount" clearable>
                        <Option v-for="item in getDict(apis.dictType.orDiscount)" :value="item.value" :key="item.value">
                            {{item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <!--<Input  v-model="productForm.orDiscount"></Input></FormItem>-->
                <!--<FormItem label="物流模式" prop="logisticsModel">-->
                    <!--<Select v-model="productForm.logisticsModel" clearable>-->
                        <!--<Option v-for="item in getDict(apis.dictType.logisticsModel)" :value="item.value" :key="item.value">-->
                            <!--{{item.label }}-->
                        <!--</Option>-->
                    <!--</Select>-->
                <!--</FormItem>-->
                <!--<Input  v-model="productForm.logisticsModel"></Input></FormItem>-->
                <!--<FormItem label="进项税" prop="inTax">-->
                    <!--<InputNumber :min="0" v-model="productForm.inTax" 　placeholder=""></InputNumber>-->
                <!--</FormItem>-->
                <!--<FormItem label="销项税" prop="outTax">-->
                    <!--<InputNumber :min="0" v-model="productForm.outTax" 　placeholder=""></InputNumber>-->
                <!--</FormItem>-->
                <FormItem label="经营方式" prop="businessWay">
                    <Select v-model="productForm.businessWay" clearable>
                        <Option v-for="item in getDict(apis.dictType.businessWay)" :value="item.value" :key="item.value">
                            {{item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <!--<Input  v-model="productForm.businessWay"></Input></FormItem>-->
                <FormItem label="是否维护库存" prop="orMaintainStock">
                    <Select v-model="productForm.orMaintainStock" clearable>
                        <Option v-for="item in getDict(apis.dictType.orMaintainStock)" :value="item.value" :key="item.value">
                            {{item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <!--<Input  v-model="productForm.orMaintainStock"></Input></FormItem>-->
                <FormItem label="保质期（天）" prop="shelfLife">
                    <InputNumber :min="0" v-model="productForm.shelfLife" 　placeholder=""></InputNumber>
                </FormItem>
                <FormItem label="计价方式" prop="priceWay">
                    <Select v-model="productForm.priceWay" clearable>
                        <Option v-for="item in getDict(apis.dictType.priceWay)" :value="item.value" :key="item.value">
                            {{item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <!--<Input  v-model="productForm.priceWay"></Input></FormItem>-->
                <!--<FormItem label="损耗率(%)" prop="damage">-->
                    <!--<InputNumber :min="0" :formatter="value => `${value}%`" :parser="value => value.replace('%', '')"-->
                                 <!--v-model="productForm.damage"></InputNumber>-->
                <!--</FormItem>-->
                <FormItem label="积分值" prop="integral">
                    <InputNumber v-model="productForm.integral" 　placeholder=""></InputNumber>
                </FormItem>
                <!--<FormItem label="停购日期" prop="stopPurchaseDate">-->
                    <!--<DatePicker type="date"-->
                                <!--@on-change="productForm.stopPurchaseDate=$event" format="yyyy-MM-dd"-->
                                <!--style="width: 100%"></DatePicker>-->
                <!--</FormItem>-->
                <!--<FormItem label="采购周期（天）" prop="purchaseCycle">-->
                    <!--<InputNumber :min="0" :max="360" v-model="productForm.purchaseCycle" 　placeholder=""></InputNumber>-->
                <!--</FormItem>-->
                <!--<FormItem label="上架状态" prop="putawayStatus">-->
                <!--<Select v-model="productForm.putawayStatus" clearable>-->
                <!--<Option v-for="item in getDict(apis.dictType.putawayStatus)" :value="item.value" :key="item.value">-->
                <!--{{item.label }}-->
                <!--</Option>-->
                <!--</Select>-->
                <!--</FormItem>-->
                <!--<Input  v-model="productForm.putawayStatus"></Input></FormItem>-->
                <FormItem label="标签" prop="label">
                    <Input v-model="productForm.label" 　placeholder="标签，比如可标注此商品为新品等"></Input></FormItem>
                <FormItem label="品牌名称" prop="brandId">
                    <Select v-model="productForm.brandId" clearable label-in-value @on-change="selectBrand">
                        <Option v-for="item in brandNameList" :value="item.id" :key="item.id">
                            {{item.name }}
                        </Option>
                    </Select>
                </FormItem>
                <!--<FormItem label="审核状态" prop="checkedStatus">-->
                <!--<Select v-model="productForm.checkedStatus" clearable>-->
                <!--<Option v-for="item in getDict(apis.dictType.checkedStatus)" :value="item.value" :key="item.value">-->
                <!--{{item.label }}-->
                <!--</Option>-->
                <!--</Select>-->
                <!--</FormItem>-->

            </Form>
            <div slot="footer">
                <Button type="primary" @click="$parent.productFormInitOption.visible = false"
                        v-if="initOption.action === 'view'">关闭
                </Button>
                <Button type="primary" @click="handleSubmit"
                        v-if="initOption.action === 'add' || initOption.action === 'edit'">保存
                </Button>
                <Button type="error" @click="reset" v-if="initOption.action === 'add'">重置</Button>
            </div>
        </Modal>
        <ProductSelectDialog :initOption="initSelectProOption"></ProductSelectDialog>
      <StockPriceDialog :opt="initStockDig"></StockPriceDialog>
    </div>
</template>
<script>
  import $http from '@/utils/httputils'
  import CateTreeCombo from '@/components/tree/CateTreeCombo'
  import ProductSelectDialog from '@/components/common/ProductSelectDialog'
  import StockPriceDialog from '@/views/product/info/StockPriceDialog'

  export default {

    name: 'productFormDialog',
    props: {
      initOption: {
        title: {
          type: String,
          default: '新增商品信息'
        },
        action: {
          type: String,
          default: 'add'
        },
        visible: {
          type: Boolean
        },
        id: {
          type: String,
          default: null
        }
      }
    },
    data () {
      return {
        formRules: {
          productNo: [
            {required: true, message: '商品编号不能为空！', trigger: 'blur'}
          ],
          productName: [
            {required: true, message: '产品主名称不能为空！', trigger: 'blur'}
          ],
          productDeputyName: [
            {required: true, message: '产品简称不能为空！', trigger: 'blur'}
          ],
          productCateName: [
            {required: true, message: '分类名称不能为空！', trigger: 'blur'}
          ],
          salePrice: [
            {type: 'number', required: true, message: '零售价不能为空！', trigger: 'blur'}
          ],
          lowestPrice: [
            {type: 'number', required: true, message: '最低售价不能为空！', trigger: 'blur'}
          ],
          unit: [
            {required: true, message: '单位不能为空！', trigger: 'blur'}
          ],
          specification: [
            {type: 'number', required: true, message: '规格不能为空！', trigger: 'blur'}
          ],
          orDiscount: [
            {type: 'number', required: true, message: '折扣不能为空！', trigger: 'blur'}
          ],
          logisticsModel: [
            {type: 'number', required: true, message: '物流模式不能为空！', trigger: 'blur'}
          ],
          orMaintainStock: [
            {type: 'number', required: true, message: '维护库存不能为空！', trigger: 'blur'}
          ],
          businessWay: [
            {type: 'number', required: true, message: '经营方式不能为空！', trigger: 'blur'}
          ],
          shelfLife: [
            {type: 'number', required: true, message: '保质期不能为空！', trigger: 'blur'}
          ],
          priceWay: [
            {type: 'number', required: true, message: '计价方式不能为空！', trigger: 'blur'}
          ],
          putawayStatus: [
            {type: 'number', required: true, message: '上架状态不能为空！', trigger: 'blur'}
          ],
          brandId: [
            {type: 'number', required: true, message: '品牌不能为空！', trigger: 'blur'}
          ],
        },
        productChildName: '',
        productForm: {
          id: this.initOption.id,
          productNo: null,
          productName: null,
          productDeputyName: null,
          productCateName: null,
          productCateId: null,
          salePrice: null,
          lowestPrice: null,
          grossProfit: null,
          unit: null,
          childId: null,
          specification: null,
          orDiscount: 1,
          logisticsModel: 1,
          inTax: null,
          outTax: null,
          businessWay: 0,
          orMaintainStock: 0,
          shelfLife: null,
          priceWay: 0,
          damage: null,
          integral: null,
          stopPurchaseDate: null,
          purchaseCycle: null,
          putawayStatus: 1,
          label: null,
          brandName: null,
          brandId: null,
          checkedStatus: 2
        },
        initSelectProOption: {
          visible: false,
          title: '选择子商品'
        },
        initStockDig:{
          visible:false,
          title:'商品订货价',
          okText:'保存',
          cancelText:'取消',
          product:null
        },
        brandNameList: [],
      }
    },
    methods: {
      init () {
        this.reset()
        this.setDefault();
        this.getBrandNameList()
        if (this.initOption.action !== 'add') {
          this.getInfo()
        }
      },

      //通过产品编码查询总库相关联商品
      queryProduct () {
        if (this.initOption.action !== 'add' || !this.productForm.productNo) {
          return
        }
        $http({
          path: this.apis.product.getRef,
          method: 'get',
          data: {code: this.productForm.productNo},
        }).then(response => {
          let res = response.data
          if (res.success) {
            this.copyValue(res.data, this.productForm)
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
          }
        })
      },
      //编辑商品进货价格
      purchase(){
        if (this.productForm.productNo == null || this.productForm.productNo == '') {
          this.$Message.warning('请先填写正确的产品条码');
          return;
        }
        if (this.productForm.productName == null || this.productForm.productName == '') {
          this.$Message.warning('请先填写正确的产品名称');
          return;
        }
        this.initStockDig.visible = true;
        this.initStockDig.product = this.productForm;
      },

      //选择 父级菜单之后回调方法
      selectNode (opt) {
        this.productForm.productCateId = opt.id
        this.productForm.productCateName = opt.title
        console.log('选择父级菜单之后回调值：' + opt.id + opt.title)
      },

      getBrandNameList () {
        if (this.brandNameList.length > 0) {
          return
        }
        let params = {}
        params.pageIndex = 1
        params.limit = 1000
        $http({
          path: this.apis.productBrand.get,
          method: 'get',
          data: params,
        }).then(response => {
          let res = response.data
          if (res.success) {
            this.brandNameList = res.data.list
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
          }
        })
      },

      getInfo () {
        $http({
          path: this.apis.product.view,
          method: 'get',
          data: {id: this.initOption.id}
        }).then(response => {
          var res = response.data
          if (res.success) {
            this.copyValue(res.data, this.productForm)
            console.log('转换后的产品对象：' + JSON.stringify(this.productForm))
            this.$refs.CateTreeCombo.setNodeName(this.productForm.productCateName)
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
          }
        })
      },

      selectBrand (opt) {
        this.productForm.brandName = opt.label.trim()
        console.log('选择的品牌是：' + opt.label.trim())
      },
      handleSubmit () {
        this.$refs.productForm.validate((valid) => {
          console.log('valid:' + valid)
          if (valid) {
            $http({
              path: this.apis.product.add,
              method: 'post',
              data: this.productForm
            }).then(response => {
              this.handleResult(response.data)
            })
          }
        })
      },
      handleResult (obj) {
        if (obj.success) {
          this.$Notice.success({
            title: '提示',
            desc: '保存成功！'
          })
          this.$parent.$children[0].query()
          this.$parent.productFormInitOption.visible = false
        } else {
          this.$Notice.error({
            title: '提示',
            desc: obj.message
          })
        }
      },
      setDict () {
        this.getDict('or_discount', 'orDiscount')
        this.getDict('logistics_model', 'logisticsModel')
        this.getDict('product_business_way', 'businessWay')
        this.getDict('or_maintain_stock', 'orMaintainStock')
        this.getDict('price_way', 'priceWay')
        this.getDict('putaway_status', 'putawayStatus')
        // this.getDict('checked_status', 'checkedStatus')
      },
      reset () {
        this.$refs.CateTreeCombo.reset();
        this.clearObjData(this.productForm)
        this.productChildName = ''
      },
      setDefault () {
        setTimeout(() => {
          this.productForm.orDiscount = 1
          this.productForm.logisticsModel = 1
          this.productForm.businessWay = 0
          this.productForm.orMaintainStock = 0
          this.productForm.priceWay = 0
          this.productForm.putawayStatus = 2
          this.productForm.checkedStatus = 2
        }, 100)
      }
    },
    mounted () {
      this.setDict()
    },
    components: {
      CateTreeCombo,
      ProductSelectDialog,
      StockPriceDialog
    }
  }
</script>
<style lang="scss">
    #productFormDialog {
        .ivu-input-number {
            width: 100% !important;
        }
    }


</style>
