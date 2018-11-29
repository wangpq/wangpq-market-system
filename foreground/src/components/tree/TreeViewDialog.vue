<template>
    <Modal v-model="initOption.visible"
            :title="initOption.title"
            :mask-closable="false">
        <Tree :data="treeData"></Tree>
    </Modal>
</template>
<script>
  import $http from '@/utils/httputils'

  export default {
    name: 'treeViewDialog',
    props: {
      initOption: {
        url: {
          type: String,
          required: true
        },
        visible: {
          type: Boolean,
          default: false
        },
        title: {
          type: String,
          default: ''
        }
      }
    },
    data () {
      return {
        treeData: []
      }
    },
    methods: {
      getTreeData () {
        $http({
          path: this.initOption.url,
          method: 'get',
          data: {id: this.initOption.id},
        }).then(response => {
          let res = response.data
          console.log(res)
          if (res.success) {
            this.treeData = res.data
          } else {
            this.$Notice.error({
              title: '提示',
              desc: res.message
            })
          }
        })
      }
    },
    watch: {
      'initOption.visible' (val) {
        if (val) {
          this.getTreeData()
        } else {
          this.treeData = []
        }
      }
    }
  }
</script>
<style scoped>
</style>
