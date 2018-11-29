<template>
    <div id="MenuTreeCombo" tabindex="1" class="tree-select ivu-input" v-on:dblclick="showTree" @blur="treeShow=false">
        {{nodeName}}
        <Tree :data="treeData" @on-select-change="selectNode" v-show="treeShow"></Tree>
    </div>
</template>
<script>
  import $http from '@/utils/httputils'


  export default {
    name: 'MenuTreeCombo',
    props: {
      initOption: {
        row: {
          type: Object,
          default: {}
        },
      }
    },
    data () {
      return {
        treeData: [],

        nodeName: '双击选择',
        treeShow: false,
        selectVal: ''
      }
    },
    methods: {
      getTreeData () {
        $http({
          path: this.apis.resource.get,
          method: 'get',
          data: {},
        }).then(response => {
          let res = response.data
          if (res.success) {
            this.treeData = res.data
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
          }
        })
      },
      showTree () {
        this.getTreeData()
        this.treeShow = true
      },
      selectNode (array) {
        if (array) {
          this.nodeName = array[0].title
          this.$emit('selectNode', array[0].id)
          this.treeShow = false
        }
      },

    },
    mounted () {
      this.$nextTick(() => {
      })
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
    .tree-select {
        height: 100%
    }
</style>
