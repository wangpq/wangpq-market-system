<template>
    <Modal id="wareHouseFormDialog"
           v-model="initOption.visible"
           :mask-closable="false">
        <p slot="header" style="color:#f60;text-align:center;">
            <Icon type="information-circled"></Icon>
            <span>{{initOption.title}}</span>
        </p>
        <Form ref="wareHouseForm"
              :model="wareHouseForm"
              :rules="formRules"
              :label-width="90">

            <FormItem label="仓库编号" prop="code">
                <Input v-model="wareHouseForm.code"></Input></FormItem>

          <FormItem label="仓库名称" prop="name">
            <Input v-model="wareHouseForm.name"></Input></FormItem>

            <FormItem label="所属区域" >
                <AreaTreeCombo></AreaTreeCombo>
            </FormItem>

            <FormItem label="面积（m²）" prop="floorSpace">
                <InputNumber :min="0" v-model="wareHouseForm.floorSpace"></InputNumber></FormItem>

          <FormItem label="联系人" prop="contactName">
            <Input v-model="wareHouseForm.contactName"></Input></FormItem>

            <FormItem label="联系手机" prop="contactMobile">
                <Input v-model="wareHouseForm.contactMobile"></Input></FormItem>

            <FormItem label="经纬度 " prop="location">
                <Input v-model="wareHouseForm.location"></Input></FormItem>

            <FormItem label="详细地址" prop="detailAddress">
                <Input v-model="wareHouseForm.detailAddress" type="textarea"></Input></FormItem>

        </Form>
        <div slot="footer">
            <Button type="primary" @click="$parent.wareHouseFormInitOption.visible = false"
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
  import AreaTreeCombo from '@/components/common/Regions'

  //this.$refs.regions.getRegions();
  export default {

    name: 'wareHouseFormDialog',
    props: {
      initOption: {
        title: {
          type: String,
          default: '新增仓库'
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
          code: [
            {required: true, message: '仓库编码不能为空', trigger: 'blur'}
          ],
          name: [
            {required: true, message: '仓库名称不能为空', trigger: 'blur'}
          ],
          contactName:[
            {required: true, message: '联系人不能为空', trigger: 'blur'}
          ],
          contactMobile: [
            {required: true, message: '联系手机不能为空', trigger: 'blur'},
            {
              type: 'string',
              pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
              message: '联系手机格式不正确',
              trigger: 'change'
            },
          ],
          detailAddress: [
            {required: true, message: '详细地址不能为空', trigger: 'blur'}
          ]
          // country: [
          //   {required: true, message: '所属区域不能为空', trigger: 'blur'}
          // ],
        },
        wareHouseForm: {
          id: this.initOption.id,
          name: null,
          code: null,
          floorSpace: null,
          // country:this.$refs.regions.getRegions().country,
          // province:this.$refs.regions.getRegions().province,
          // city :this.$refs.regions.getRegions().city,
          // area :this.$refs.regions.getRegions().area,
          // detailAddress: this.$refs.regions.getRegions().detailAddress,
          detailAddress:null,
          contactName: null,
          contactMobile: null,
          location:null
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
        // this.getDict('shop_type', 'shopType')
        // this.getDict('deliver_price_type', 'deliverPriceType')
      },

      //选择 父级菜单之后回调方法
      selectAreaNode (opt) {
        this.wareHouseForm.ofAreaId = opt.id
        this.wareHouseForm.country = opt.title
        console.log('选择父级菜单之后回调值：' + opt.id + opt.title)
      },

      getInfo () {
        $http({
          path: this.apis.warehouseManage.view,
          method: 'get',
          data: {id: this.initOption.id}
        }).then(response => {
          var res = response.data
          if (res.success) {
            this.copyValue(res.data, this.wareHouseForm)
            // this.$refs.AreaTreeCombo.setNodeName(this.wareHouseForm.country)
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
          }
        })
      },
      handleSubmit () {
        this.$refs.wareHouseForm.validate((valid) => {
          console.log('valid:' + valid)
          if (valid) {
            let ajaxParams={};
            if(this.initOption.action == 'edit'){
              ajaxParams={
                path: this.apis.warehouseManage.update,
                method: 'put',
                data: this.wareHouseForm
              }
            }else{
              ajaxParams={
                path: this.apis.warehouseManage.save,
                method: 'post',
                data: this.wareHouseForm
              }
            }
            $http(ajaxParams).then(response => {
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
          this.$parent.wareHouseFormInitOption.visible = false
        } else {
          this.$Notice.error({
            title: '提示',
            desc: obj.message
          })
        }
      },
      reset () {
        this.clearObjData(this.wareHouseForm)
        // this.wareHouseForm.ofAreaId = null
        // this.wareHouseForm.country = null
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
