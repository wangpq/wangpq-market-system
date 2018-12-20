<template>
    <div id="DepartTreeCombo" tabindex="1" class="tree-select ivu-input" v-on:dblclick="showTree" @blur="treeShow=false">
        <Input class="node-name" readonly v-model="nodeName" placeholder="双击获取部门名称"/>
        <div class="tree-wrap">
          <Tree :data="treeData" @on-select-change="selectNode" v-show="treeShow"></Tree>
        </div>
    </div>
</template>
<script>
  import $http from '@/utils/httputils'

  export default {
    name: 'DepartTreeCombo',
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
          path: this.apis.departmentManage.tree,
          method: 'get',
          data: {},
        }).then(response => {
          let res = response.data
          if (res.success) {
            this.treeData = this.formatTreeData(res.data);
          } else {
            this.$Modal.error({
              title: '提示',
              content: res.message
            })
          }
        })
      },
      formatTreeData(arr){
        arr.forEach(item=>{
          item.title=item.name;
          if(item.children && item.children.length>0){
            this.formatTreeData(item.children);
          }
        })
        return arr;
      },
      showTree () {
        this.getTreeData()
        this.treeShow = true
      },
      selectNode (array) { 
        if (array) {
          this.nodeName = array[0].title
          this.$emit('selectNode', { id : array[0].id, name : array[0].name })
          this.treeShow = false
        }
      },
      clear(){
        this.nodeName = ""
        this.$emit('selectNode', { id : "", name : "" })
        this.treeShow = false
      }
    },
    mounted () {  
      this.$nextTick(() => { 
        this.nodeName=this.initOption.row.name
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

<style lang="scss" scoped>
.tree-select {
    height: 32px;
    padding :0;
    border:none;
    position: relative;
    .tree-wrap{
      position:absolute;
      left:0;
      right:0;
      top:32px;
      z-index:9999;
      background-color: #fff;
    }
}
</style>
