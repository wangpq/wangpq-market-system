<template>
    <div id="AreaTreeCombo" tabindex="1" class="tree-select ivu-input" v-on:dblclick="showTree" @blur="treeShow=false">
        {{nodeName}}
        <Tree :data="treeData" class="tree" :load-data="getTreeData" @on-select-change="selectNode"
              v-show="treeShow"></Tree>
    </div>
</template>
<script>
  import $http from '@/utils/httputils'

  export default {
    name: 'AreaTreeCombo',
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
        treeData: [{
          id: 0,
          title: '区划树',
          loading: false,
          children: []
        }],

        nodeName: '-双击选择-',
        treeShow: false,
        selectVal: ''
      }
    },
    methods: {
      setNodeName (val) {
        if (!val) {
          val = '-双击选择-'
        }
        this.nodeName = val
      },
      getTreeData (item, callback) {
        if (!item) {
          return
        }
        var data = {pid: item.id}
        $http({
          path: this.apis.systemRegions.tree,
          method: 'get',
          data: data
        }).then(response => {
          let res = response.data
          console.log(res)
          if (res.success) {
            if (res.data.length === 0) {
              callback([])
              delete item.loading
              return
            }
            callback(this.objToArray(res.data))
          } else {
            this.$Message.error('获取分类树信息失败，' + res.message)
          }
        })
      },
      showTree () {
        this.getTreeData()
        this.treeShow = true
      },
      selectNode (array) {
        if (array && array.length > 0) {
          if (!array[0].id) {
            this.$Notice.warning({title: '不能选择根节点'})
            return
          }
          this.nodeName = array[0].title
          this.$emit('selectAreaNode', array[0])
          this.treeShow = false
        }
      },
      reset () {
        this.nodeName = '-双击选择-'
      }

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
    },
  }
</script>
<style scoped>
    .tree-select {
        height: 100%;
        min-width: 8vw;
    }

    .ivu-tree {
        max-height: 50vh;
        overflow-y: auto;
    }

    .tree-select .tree {
        width: 100%;
        position: absolute;
        top: 28px;
        left: 0px;
        z-index: 999;
        border: 1px solid #57a3f3;
        border-radius: 4px;
        color: #495060;
        background-color: #fff;
        background-image: none;
        outline: 0;
        -webkit-box-shadow: 0 0 0 2px rgba(45, 140, 240, .2);
        box-shadow: 0 0 0 2px rgba(45, 140, 240, .2);
    }

</style>
