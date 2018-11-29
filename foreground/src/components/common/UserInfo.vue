<template>
    <div id="userInfo" class="layout-content">
        <Modal v-model="initOption.visible" width="500">
            <p slot="header" style="color:#0d9cff;text-align:center">
                <Icon type="md-contact"></Icon>
                <span>个人信息</span>
            </p>
            <div class="content">
                <div class="header">
                    <img alt="image" class="h-img"
                         src="http://ozwpnu2pa.bkt.clouddn.com/a1.jpg">
                    <div class="m-t-xs font-bold">{{user.rolesName}}</div>
                </div>
                <div class="info">
                    <h3>{{user.name}}</h3>
                    <address>
                        编号：{{user.code}}
                        <br/>
                        <abbr title="Phone">Tel:</abbr>{{user.tel}}
                    </address>
                    <div class="chain-name" v-if="user.chainNames">
                        <label style="color: #000">门店：</label>
                        {{user.chainNames}}
                    </div>
                </div>
            </div>
            <div slot="footer">
                <Button type="info" size="large" @click="cancel">关闭</Button>
            </div>
        </Modal>
    </div>
</template>
<script>

  export default {
    name: 'userInfo',
    props: {
      initOption: {
        visible: {
          type: Boolean,
          default: false
        },
      }
    },
    data () {
      return {}
    },
    computed: {
      user () {
        return this.$store.state.user.user
      }
    },
    methods: {
      cancel () {
        this.initOption.visible = false
      },
    },
    components: {}
  }
</script>
<style>
    .content {
        text-align: center;
        font-size: 16px
    }

    .header {
        text-align: center;
    }

    .header .h-img {
        border-radius: 50px;
        height: 100px;
        width: 100px;
    }

    .content .info {
        margin-top: 10px;
    }

    .chain-name {
        margin: 20px 50px 0 50px;
        padding: 5px;
        color: #0d9cff;
        font-size: 16px;
        text-align: left;
        outline: 0;
        border-color: #57a3f3;
        box-shadow: 0 0 0 2px rgba(45, 140, 240, .2);
    }
</style>
