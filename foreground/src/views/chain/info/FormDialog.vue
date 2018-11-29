<template>
    <Modal id="chainFormDialog"
           v-model="initOption.visible"
           :mask-closable="false">
        <p slot="header" style="color:#f60;text-align:center;">
            <Icon type="information-circled"></Icon>
            <span>{{initOption.title}}</span>
        </p>
        <Form ref="chainForm"
              :model="chainForm"
              :rules="formRules"
              :label-width="90">

            <FormItem label="门店名称" prop="name">
                <Input v-model="chainForm.name"></Input></FormItem>

            <FormItem label="门店类型" prop="chainType">
                <Select v-model="chainForm.chainType" clearable>
                    <Option v-for="item in apis.dictVal.shopType" :value="item.value" :key="item.value">
                        {{item.label }}
                    </Option>
                </Select>
            </FormItem>

            <FormItem label="配送价格" prop="deliverPrice">
                <Select v-model="chainForm.deliverPrice" clearable>
                    <Option v-for="item in apis.dictVal.deliverPriceType" :value="item.value" :key="item.value">
                        {{item.label }}
                    </Option>
                </Select>
            </FormItem>

            <FormItem label="所属区域" prop="ofAreaName">
                <AreaTreeCombo @selectAreaNode="selectAreaNode" ref="AreaTreeCombo"
                               class="CateTreeCombo"></AreaTreeCombo>
            </FormItem>

            <FormItem label="面积（m²）" prop="floorSpace">
                <InputNumber :min="0" v-model="chainForm.floorSpace"></InputNumber></FormItem>

          <FormItem label="联系人" prop="contacts">
            <Input v-model="chainForm.contacts"></Input></FormItem>

            <FormItem label="联系手机" prop="mobile">
                <Input v-model="chainForm.mobile"></Input></FormItem>

            <FormItem label="联系电话" prop="phone">
                <Input v-model="chainForm.phone"></Input></FormItem>

            <FormItem label="详细地址" prop="address">
                <Input v-model="chainForm.address" type="textarea"></Input></FormItem>

        </Form>
        <div slot="footer">
            <Button type="primary" @click="$parent.chainFormInitOption.visible = false"
                    v-if="initOption.action === 'view'">关闭
            </Button>
            <Button type="primary" @click="handleSubmit"
                    v-if="initOption.action === 'add' || initOption.action === 'edit'">保存
            </Button>
            <Button type="error" @click="reset" v-if="initOption.action === 'add'">重置</Button>
        </div>
    </Modal>
</template>
<script>
  import $http from '@/utils/httputils'
  import AreaTreeCombo from '@/components/tree/AreaTreeCombo'

  export default {

    name: 'chainFormDialog',
    props: {
      initOption: {
        title: {
          type: String,
          default: '新增门店'
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
          name: [
            {required: true, message: '门店名称不能为空', trigger: 'blur'}
          ],
          shopType: [
            {type: 'number', required: true, message: '门店类型不能为空', trigger: 'blur'}
          ],
          deliverPrice: [
            {type: 'number', required: true, message: '配送价格不能为空', trigger: 'blur'}
          ],
          contacts:[
            {required: true, message: '联系人不能为空', trigger: 'blur'}
          ],
          mobile: [
            {required: true, message: '联系手机不能为空', trigger: 'blur'},
            {
              type: 'string',
              pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
              message: '联系手机格式不正确',
              trigger: 'change'
            },
          ],
          address: [
            {required: true, message: '详细地址不能为空', trigger: 'blur'}
          ],
          // ofAreaName: [
          //   {required: true, message: '所属区域不能为空', trigger: 'blur'}
          // ],
        },
        chainForm: {
          id: this.initOption.id,
          name: null,
          code: null,
          chainType: null,
          deliverPrice: null,
          ofAreaName: null,
          ofAreaId: null,
          floorSpace: null,
          phone: null,
          mobile: null,
          address: null,
          contacts:null
        }
      }
    },
    methods: {

      init () {
        this.reset()
        if (this.initOption.action !== 'add') {
          this.getInfo()
        }
      },

      setDict () {
        this.getDict('shop_type', 'shopType')
        this.getDict('deliver_price_type', 'deliverPriceType')
      },

      //选择 父级菜单之后回调方法
      selectAreaNode (opt) {
        this.chainForm.ofAreaId = opt.id
        this.chainForm.ofAreaName = opt.title
        console.log('选择父级菜单之后回调值：' + opt.id + opt.title)
      },

      getInfo () {
        $http({
          path: this.apis.chain.view,
          method: 'get',
          data: {id: this.initOption.id}
        }).then(response => {
          var res = response.data
          if (res.success) {
            this.copyValue(res.data, this.chainForm)
            this.$refs.AreaTreeCombo.setNodeName(this.chainForm.ofAreaName)
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
          }
        })
      },
      handleSubmit () {
        this.$refs.chainForm.validate((valid) => {
          console.log('valid:' + valid)
          if (valid) {
            $http({
              path: this.apis.chain.update,
              method: 'post',
              data: this.chainForm
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
          this.$parent.chainFormInitOption.visible = false
        } else {
          this.$Notice.error({
            title: '提示',
            desc: obj.message
          })
        }
      },
      reset () {
        this.clearObjData(this.chainForm)
        this.chainForm.ofAreaId = null
        this.chainForm.ofAreaName = null
      },
    },
    mounted () {
      this.setDict()
    },
    components: {
      AreaTreeCombo
    }
  }
</script>
<style>
</style>
