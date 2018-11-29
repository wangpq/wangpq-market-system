<template>
    <div class="header-content">
        <CommModal v-model="initOption.visible"
                   :mask-closable="false"
                   okText="上传"
                   @on-ok="upload">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>上传头像</span>
            </p>
            <div class="imgClip">
                <imgCut @clipPic="clipPic" ref="imgCut" :width="150" :height="150">
                    <div class="loadIcon">
                        <Icon type="ios-cloud-upload" size="52" style="color: #3399ff"></Icon>
                    </div>
                </imgCut>
                <div class="headerImg">
                    <img ref="headerView">
                </div>
            </div>

        </CommModal>
    </div>
</template>
<script>

  import $http from '@/utils/httputils'
  import CommModal from '../../../plugins/CommModal'
  import { imgCut } from '../../../plugins/vue-imgcut'

  export default {
    name: 'header',
    props: {
      initOption: {
        visible: {
          type: Boolean,
          default: false
        },
      }
    },
    data () {
      return {
        file: null,
        imgsrc: '',
      }
    },
    methods: {
      clipPic (img) {
        this.$refs.headerView.src = img
        this.file = img
      },

      upload (callback) {
        if (!this.file) {
          return
        }
        let file = this.base64URLtoFile(this.file, "header.png")
        let param = new FormData(); //创建form对象
        param.append('header', file);//通过append向form对象添加数据

        $http({
          path: this.apis.EXTRA.uploadFile,
          method: 'post',
          data: param
        }).then(response => {
          let res = response.data
          console.log(res)
          if (res.success) {
            this.$Message.success('头像上传成功！')
            //设置头像图片
            var user = JSON.parse(sessionStorage.getItem('user'))
            user.header = res.data[0].shortPath
            sessionStorage.setItem('user', JSON.stringify(user))
            this.$store.commit('SET_USER', user)
            this.saveHeader(user)
            callback(true)
          } else {
            this.$Message.error(res.message)
            callback(false)
          }
        })
      },
      /**
       * 保存头像到服务器
       */
      saveHeader (user) {
        $http({
          path: this.apis.systemUser.update,
          method: 'post',
          data: {id: user.id, header: user.header}
        }).then(response => {
          let res = response.data
          console.log(res)
          if (res.success) {
            this.$Message.success('头像保存成功！')
          } else {
            this.$Message.error(res.message)
          }
        })
      }

    },
    watch: {
      'initOption.visible' (val) {
        if (val) {
          this.$refs.headerView.src = ''
          window.addEventListener('mousewheel', this.$refs.imgCut.zoomImg)
        }
      }
    },
    components: {
      CommModal,
      imgCut
    }
  }
</script>
<style lang="less">

    .imgClip {

        display: flex;
        flex-direction: column;
        text-align: center;

        .loadIcon {
            text-align: center;
        }
    }


</style>
