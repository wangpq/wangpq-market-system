<template>
    <div class="content">
        <div class="title">
            <img src="../assets/login/title.png"></img>
        </div>
        <div class="login">
            <Form
                    class="login-form"
                    ref="loginForm"
                    :model="loginForm"
                    :rules="loginRules"
                    inline>
                <div class="contain">
                    <Form-item prop="name">
                        <input type="text" v-model="loginForm.name" placeholder="请输入用户名"></input>
                    </Form-item>

                    <Form-item prop="pwd">
                        <input type="password" v-model="loginForm.pwd" @keyup.enter="handleSubmit"
                               placeholder="请输入登录密码"></input>
                    </Form-item>

                    <Form-item>
                        <div class="submit" type="ghost" @click="handleSubmit">登录</div>
                    </Form-item>
                </div>
                <Spin fix v-if="loginLoading">
                    <Icon type="ios-loading" size=35 class="spin-icon-load"></Icon>
                    <div class="loading-text">登录中...</div>
                </Spin>
            </Form>
        </div>

        <ChangePwd :initOption="initChangePwd"></ChangePwd>
    </div>
</template>
<script>

  import $http from '@/utils/httputils'
  import ChangePwd from '@/components/common/ChangePwd'
  import store from '@/store/store'

  export default {
    name: 'loginForm',
    data () {
      return {
        initChangePwd: {
          visible: false,
        },
        loginRules: {
          name: [
            {required: true, message: '用户名不能为空！', trigger: 'blur'},
            {message: '用户名长度必须在2~50位之间！', trigger: 'blur', min: 2, max: 50}
          ],
          pwd: [
            {required: true, message: '密码不能为空！', trigger: 'blur'},
            {message: '密码长度必须在2~50位之间！', trigger: 'blur', min: 2, max: 50}
          ]
        },
        loginForm: {
          name: '',
          pwd: ''
        },
        loginLoading: false
      }
    },
    methods: {
      handleSubmit () {
        this.$refs.loginForm.validate((valid) => {
          if (valid) {
            this.loginLoading = true
            this.$store.dispatch('login', this.loginForm).then(response => {
              this.loginLoading = false
              let res = response.data
              if (res.success) {
                this.$Message.success('登录成功！')
                this.toIndex()
              } else {
                this.$Message.error(res.message)
                //判断是否为初始密码
                if (res.data === 10005) {
                  this.initChangePwd.visible = true
                  this.$Notice.warning({
                    title: '修改密码',
                    desc: '登录密码为原始密码，必须修改密码后方能登录！'
                  })
                }
                this.loginLoading = false
              }
            }).catch(err => {
              this.$Message.error({
                content: err.message
              })
              this.loginLoading = false
            })
          }
        })
      },

      toIndex () {
        setTimeout(() => {
          this.$router.push('/')
        }, 500)
      },

      // 刷新token定时器
      doRefresh (index) {
        if (!sessionStorage.getItem('Authorization')) {
          clearInterval(index)
        } else {
          this.$http.get(Apis.sys.tokens.refresh).then((response) => {
            let token = response.data.obj.tokenType + ' ' + response.data.obj.accessToken
            sessionStorage.setItem('Authorization', token)
          })
        }
      }
    },
    components: {
      ChangePwd
    }
  }
</script>
<style lang="scss" scoped>
    .content {
        display: flex;
        justify-content: center;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
        margin-top: -5vh;
    }

    .title {
        width: 100%;
        text-align: center;
    }

    .login {
        display: flex;
        justify-content: center;
        text-align: center;
        align-items: center;
        background: url(../assets/login/background.png) center repeat-x;
        width: 100vw;
        height: 46.3vh;
    }

    .contain {
        display: flex;
        flex-direction: column;
        width: 22.6vw;
        align-content: center;
    }

    input {
        border: solid 1px #ffffff;
        background-color: rgba(255, 255, 255, 0);
        color: #FFF;
        font-size: 1.5rem;
        border-radius: 50px;
        width: 100%;
        height: 6.1vh;
        margin: 0;
        padding-left: 15px;
    }

    .submit {
        display: flex;
        justify-content: center;
        align-items: Center;
        border: solid 1px #FFF;
        background-color: #FFF;
        color: #2d8cf0;
        height: 6.1vh;
        font-size: 1.5rem;
        border-radius: 50px;
        cursor: pointer;
    }

    .submit:hover {
        background-color: rgba(126, 196, 204, 0);
        color: #FFF;
    }

    input::-webkit-input-placeholder {
        /* placeholder颜色  */
        color: #fff;
    }

    input:focus {
        outline: none;
    }

    .spin-icon-load {
        animation: ani-demo-spin 1s linear infinite;
    }

    .ivu-spin-fix {
        background-color: rgba(12, 12, 12, 0.38);
    }

    .ivu-spin {
        color: #fff;
    }

    .loading-text {
        font-size: 30px;
    }

</style>
