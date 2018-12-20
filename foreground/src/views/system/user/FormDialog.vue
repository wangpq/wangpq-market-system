<template>
    <div>
        <Modal id="userFormDialog"
               v-model="initOption.visible"
               :mask-closable="false">
            <p slot="header" style="color:#f60;text-align:center;">
                <Icon type="information-circled"></Icon>
                <span>{{initOption.title}}</span>
            </p>
            <Form ref="userForm"
                  :model="userForm"
                  :rules="formRules"
                  :label-width="90">

                <FormItem label="登录名" prop="name">
                    <Input v-model="userForm.name"></Input></FormItem>
              <FormItem label="昵称" prop="nickname">
                <Input v-model="userForm.nickname"></Input></FormItem>
                <FormItem label="电话" prop="tel">
                    <Input v-model="userForm.tel"></Input></FormItem>
                <FormItem label="角色" prop="rolesName">
                    <input class="ivu-input" v-model="userForm.rolesName" v-on:dblclick="initRoleOption.visible=true"
                           placeholder="双击选择角色" readonly=""></input>
                </FormItem>
                <FormItem label="是否为督导" prop="orSupervision">
                    <Select v-model="userForm.orSupervision" clearable>
                        <Option v-for="item in getDict(apis.dictType.orSupervision)" :value="item.value" :key="item.value">
                            {{item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="督导管辖门店" prop="supervisionAreaIds" :style="chainStyle">
                    <input class="ivu-input" v-model="Extra.chainNames"
                           v-on:dblclick="initChainOption.visible=true" placeholder="双击选择门店" readonly=""></input>
                </FormItem>
                <FormItem label="冻结标志" prop="isFreeze">
                    <Select v-model="userForm.isFreeze" clearable>
                        <Option v-for="item in getDict(apis.dictType.isFreeze)" :value="item.value" :key="item.value">
                            {{item.label }}
                        </Option>
                    </Select>
                </FormItem>
                <FormItem label="部门选择" prop="departmentId">
                    <DepartTreeCombo
                      :initOption="initOption"
                      @selectNode="selectNode"
                      ref="DepartTreeCombo"
                      v-model="userForm.departmentId"
                    >
                    </DepartTreeCombo>
                </FormItem>
            </Form>
            <div slot="footer">
                <Button type="primary" @click="$parent.userFormInitOption.visible = false"
                        v-if="initOption.action === 'view'">关闭
                </Button>
                <Button type="primary" @click="handleSubmit"
                        v-if="initOption.action === 'add' || initOption.action === 'edit'">保存
                </Button>
                <Button type="error" @click="reset" v-if="initOption.action === 'add'">重置</Button>
            </div>
        </Modal>
        <RoleSelectDialog :initOption="initRoleOption"></RoleSelectDialog>
        <ChainSelectDialog @select-chain="selectChain" :initOption="initChainOption"></ChainSelectDialog>
    </div>
</template>
<script>
  import $http from '@/utils/httputils'
  import ChainSelectDialog from '@/components/common/ChainSelectDialog'
  import RoleSelectDialog from '@/components/common/RoleSelectDialog'
  import DepartTreeCombo from '@/components/tree/DepartTreeCombo'

  export default {

    name: 'userFormDialog',
    props: {
      initOption: {
        title: {
          type: String,
          default: '新增用户'
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
            {required: true, message: '用户名称不能为空', trigger: 'blur'}
          ],
          nickname: [
            {required: true, message: '用户昵称不能为空', trigger: 'blur'}
          ],
          tel: [
            {required: true, message: '电话不能为空', trigger: 'blur'},
            {
              type: 'string',
              pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/,
              message: '联系手机格式不正确',
              trigger: 'change'
            },
          ],
          departmentId:[
            {required: true, message: '部门不能为空', trigger: 'blur'}
          ]
        },
        userForm: {
          id: this.initOption.id,
          nickname:null,
          name: null,
          tel: null,
          roleId: null,
          rolesName: null,
          orSupervision: null,
          supervisionAreaIds: null,
          isFreeze: null,
          departmentId:null,
          departmentName:null
        },
        Extra: {
          chainNames: null,
        },
        initRoleOption: {
          visible: false,
          title: '选择角色'
        },
        initChainOption: {
          visible: false,
          title: '选择角色'
        },
        chainStyle: 'display: none'
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
        this.getDict('or_supervision', 'orSupervision')
        this.getDict('is_freeze', 'isFreeze')
      },

      //选择门店之后回调
      selectChain (ids, names, callback) {
        this.userForm.supervisionAreaIds = ids.join(',')
        this.Extra.chainNames = names.join(',')
        callback(true)
      },
        //选择 父级菜单之后回调方法
      selectNode (data) {
        this.userForm.departmentId = data.id;
        this.userForm.departmentName = data.name;
      },
      getInfo () {
        $http({
          path: this.apis.systemUser.view,
          method: 'get',
          data: {id: this.initOption.id}
        }).then(response => {
          var res = response.data
          if (res.success) {
            this.copyValue(res.data, this.userForm)
            this.Extra.chainNames = res.data.chainNames
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
          }
        })
      },
      handleSubmit () {
        this.$refs.userForm.validate((valid) => {
          console.log('valid:' + valid)
          console.log(JSON.stringify(this.userForm))
          if (valid) {
            $http({
              path: this.apis.systemUser.update,
              method: 'post',
              data: this.userForm
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
          this.$parent.userFormInitOption.visible = false
        } else {
          this.$Notice.error({
            title: '提示',
            desc: obj.message
          })
        }
      },
      reset () {
        this.clearObjData(this.userForm)
        this.userForm.isFreeze = 1
        this.userForm.orSupervision = 0
      },
    },
    watch: {
      'userForm.orSupervision' (val) {
        if (val == 1) {
          this.chainStyle = 'display: block'
        } else {
          this.chainStyle = 'display: none'
        }
      }
    },
    mounted () {
      this.setDict()
    },
    components: {
      ChainSelectDialog,
      RoleSelectDialog,
      DepartTreeCombo
    }
  }
</script>
<style>
</style>
