<template>
    <Modal id="brandFormDialog"
           v-model="initOption.visible"
           :mask-closable="false">
        <p slot="header" style="color:#f60;text-align:center;">
            <Icon type="information-circled"></Icon>
            <span>{{initOption.title}}</span>
        </p>
        <Form ref="brandForm"
              :model="brandForm"
              :rules="formRules"
              :label-width="90">

            <FormItem label="品牌名称" prop="name">
                <Input v-model="brandForm.name"></Input></FormItem>
            <FormItem label="品牌描述" prop="description">
                <Input v-model="brandForm.description"></Input></FormItem>

        </Form>
        <div slot="footer">
            <Button type="primary" @click="$parent.brandFormInitOption.visible = false"
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

  export default {

    name: 'brandFormDialog',
    props: {
      initOption: {
        title: {
          type: String,
          default: '新增商品品牌'
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
            {required: true, message: '商品品牌名称不能为空', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '商品品牌描述不能为空', trigger: 'blur'}
          ]
        },
        brandForm: {
          id: this.initOption.id,
          name: null,
          description: null,
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
      getInfo () {
        $http({
          path: this.apis.productBrand.view,
          method: 'get',
          data: {id: this.initOption.id}
        }).then(response => {
          var res = response.data
          if (res.success) {
            this.brandForm = res.data
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
          }
        })
      },
      handleSubmit () {
        this.$refs.brandForm.validate((valid) => {
          console.log('valid:' + valid)
          if (valid) {
            $http({
              path: this.apis.productBrand.add,
              method: 'post',
              data: this.brandForm
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
          this.$parent.brandFormInitOption.visible = false
        } else {
          this.$Notice.error({
            title: '提示',
            desc: obj.message
          })
        }
      },
      reset () {
        this.clearObjData(this.brandForm)
      },
    }
  }
</script>
<style>
</style>
