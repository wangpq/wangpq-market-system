<template>
    <Modal id="roleFormDialog"
           v-model="initOption.visible"
           :mask-closable="false">
        <p slot="header" style="color:#f60;text-align:center;">
            <Icon type="information-circled"></Icon>
            <span>{{initOption.title}}</span>
        </p>
        <Form ref="roleForm"
              :model="roleForm"
              :rules="formRules"
              :label-width="90">

            <FormItem label="角色名称" prop="rolesName">
                <Input v-model="roleForm.rolesName"></Input></FormItem>
            <FormItem label="适用范围" prop="useType">
                <Select v-model="roleForm.useType" clearable>
                    <Option v-for="item in apis.dictVal.roleUseType" :value="item.value" :key="item.value">
                        {{item.label }}
                    </Option>
                </Select>
            </FormItem>
            <FormItem label="角色描述" prop="content">
                <Input v-model="roleForm.content"></Input></FormItem>
            <FormItem label="超级管理员" prop="isSuper">
                <Input value="普通角色" disabled=""/>
            </FormItem>

        </Form>
        <div slot="footer">
            <Button type="primary" @click="$parent.roleFormInitOption.visible = false"
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

    name: 'roleFormDialog',
    props: {
      initOption: {
        title: {
          type: String,
          default: '新增角色'
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
          rolesName: [
            {required: true, message: '角色名称不能为空', trigger: 'blur'}
          ],
          useType: [
            {type: 'number', required: true, message: '适用范围不能为空', trigger: 'blur'}
          ],
          isSuper: [
            {type: 'number', required: true, message: '是否超管不能为空', trigger: 'blur'}
          ]
        },
        roleForm: {
          id: this.initOption.id,
          rolesName: null,
          isSuper: 0,
          content: null,
          useType: null,
        },
        saveMethod: {
          path: '',
          method: 'post',
          data: {}
        }
      }
    },
    methods: {

      init () {
        this.reset()
        this.saveMethod = this.getPostM()
        if (this.initOption.action !== 'add') {
          this.saveMethod = this.getPutM()
          this.getInfo()
        }
      },

      setDict () {
        this.getDict('role_use_type', 'roleUseType')
        this.getDict('is_super', 'isSuper')
      },

      getInfo () {
        $http({
          path: this.apis.systemRole.view,
          method: 'get',
          data: {id: this.initOption.id}
        }).then(response => {
          var res = response.data
          if (res.success) {
            this.copyValue(res.data, this.roleForm)
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
          }
        })
      },
      handleSubmit () {
        var $this = this
        this.$refs.roleForm.validate((valid) => {
          console.log('valid:' + valid)
          if (valid) {
            $this.saveMethod.data = $this.roleForm
            $http($this.saveMethod).then(response => {
              $this.handleResult(response.data)
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
          this.$parent.roleFormInitOption.visible = false
        } else {
          this.$Notice.error({
            title: '提示',
            desc: obj.message
          })
        }
      },
      reset () {
        this.clearObjData(this.roleForm)
        this.roleForm.isSuper = 0
      },
      getPostM () {
        return {
          path: this.apis.systemRole.add,
          method: 'post',
          data: {}
        }
      },
      getPutM () {
        return {
          path: this.apis.systemRole.update,
          method: 'put',
          data: {}
        }
      },
    },
    mounted () {
      this.setDict()
    },
  }
</script>
<style>
</style>
