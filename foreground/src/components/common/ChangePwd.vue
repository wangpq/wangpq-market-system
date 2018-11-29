<template>
    <div>
        <CommModal v-model="initOption.visible"
                   :mask-closable="false"
                   @on-ok="ok">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>修改密码</span>
            </p>

            <Form ref="pwdForm" :model="pwdForm" :rules="rulePwd" :label-width="70">
                <FormItem label="原密码" prop="oldPwd">
                    <Input  type="password" v-model="pwdForm.oldPwd"></Input>
                </FormItem>
                <FormItem label="新密码" prop="newPwd" required="">
                    <Input type="password" v-model="pwdForm.newPwd"></Input>
                </FormItem>
                <FormItem label="确认密码" prop="pwdChecked" required="">
                    <Input type="password" v-model="pwdForm.pwdChecked"></Input>
                </FormItem>
            </Form>
        </CommModal>
    </div>
</template>
<script>

  import $http from '@/utils/httputils'
  import CommModal from '../../../plugins/CommModal'

  export default {
    name: 'ChangePwd',
    props: {
      initOption: {
        visible: {
          type: Boolean,
          default: false
        },
      }
    },
    data () {
      const validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('新密码不能为空'))
        } else if (value.length < 6) {
          callback(new Error('新密码长度必须大于6'))
        } else if (value === this.pwdForm.oldPwd) {
          callback(new Error('新密码不能跟原密码一样！'))
        } else {
          if (this.pwdForm.pwdChecked !== '') {
            // 对第二个密码框单独验证
            this.$refs.pwdForm.validateField('pwdChecked')
          }
          callback()
        }
      }
      const validatePassCheck = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请确认密码！'))
        } else if (value !== this.pwdForm.newPwd) {
          callback(new Error('两次输入的密码不一致!'))
        } else {
          callback()
        }
      }

      return {
        pwdForm: {
          oldPwd: null,
          newPwd: null,
          pwdChecked: null,
        },
        rulePwd: {
          newPwd: [
            {validator: validatePass, trigger: 'blur'}
          ],
          pwdChecked: [
            {validator: validatePassCheck, trigger: 'blur'}
          ],
          oldPwd: [
            {required: true, message: '原密码不能为空', trigger: 'blur'}
          ]
        }
      }
    },
    methods: {

      ok (callback) {

        this.$refs.pwdForm.validate((valid) => {
          if (valid) {
            var data = this.pwdForm
            $http({
              path: this.apis.systemUser.pwd,
              method: 'put',
              data: data
            }).then(response => {
              let res = response.data
              console.log(res)
              if (res.success) {
                this.$Message.success('密码修改成功,请重新登录！')
                //清除缓存
                sessionStorage.clear()
                this.$store.state.user.token = ''
                this.$router.replace('/login')

                callback(true)
              } else {
                this.$Message.error(res.message)
                callback(false)
              }
            })
          }
        })
      },
    },
    components: {
      CommModal
    }
  }
</script>
