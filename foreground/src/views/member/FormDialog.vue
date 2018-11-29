<template>
    <Modal id="memberFormDialog"
           v-model="initOption.visible"
           :mask-closable="false">
        <p slot="header" style="color:#f60;text-align:center;">
            <Icon type="information-circled"></Icon>
            <span>{{initOption.title}}</span>
        </p>
        <Form ref="memberForm"
              :model="memberForm"
              :rules="formRules"
              :label-width="90">

            <FormItem label="会员名称" prop="name">
                <Input v-model="memberForm.name"></Input></FormItem>
            <FormItem label="会员描述" prop="description">
                <Input v-model="memberForm.description"></Input></FormItem>

        </Form>
        <div slot="footer">
            <Button type="primary" @click="$parent.memberFormInitOption.visible = false"
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

    name: 'memberFormDialog',
    props: {
      initOption: {
        title: {
          type: String,
          default: '新增商品会员'
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
            {required: true, message: '商品会员名称不能为空', trigger: 'blur'}
          ],
          description: [
            {required: true, message: '商品会员描述不能为空', trigger: 'blur'}
          ]
        },
        memberForm: {
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
            this.memberForm = res.data
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
          }
        })
      },
      handleSubmit () {
        this.$refs.memberForm.validate((valid) => {
          console.log('valid:' + valid)
          if (valid) {
            $http({
              path: this.apis.productBrand.add,
              method: 'post',
              data: this.memberForm
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
          this.$parent.memberFormInitOption.visible = false
        } else {
          this.$Notice.error({
            title: '提示',
            desc: obj.message
          })
        }
      },
      reset () {
        this.clearObjData(this.memberForm)
      },
    }
  }
</script>
<style>
</style>
