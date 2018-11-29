<template>
    <CommModal width="360" v-model="initOption.visible"
               :title="initOption.title"
               @on-cancel="cancel"
               @on-ok="ok"
               :loading="loading"
               :mask-closable="false">
        <div id="treeResource" class="ztree"></div>
    </CommModal>
</template>
<script>
  import $http from '@/utils/httputils'
  import CommModal from '../../../plugins/CommModal'

  export default {
    name: 'ResourceTreeDialog',
    props: {
      initOption: {
        roleId: {
          type: Number,
          default: null
        },
        useType: {
          type: Number,
          default: null
        },
        title: {
          type: String,
          default: '分配资源菜单权限'
        },
        visible: {
          type: Boolean,
          default: false
        },
      }
    },
    data () {
      return {
        setting: {
          data: {
            key: {
              checked: 'checked',
              isParent: 'pid',
              name: 'title',
              url: 'urlurl',
            }
          },
          check: {
            chkboxType: {'Y': 'p', 'N': 'ps'},
            enable: true
          },
          view: {
            dblClickExpand: true
          }
        },
        treeData: [{
          id: null,
          title: '资源菜单树',
          checked: true,
          expand: true,
          children: []
        }],
        loading: true
      }
    },
    methods: {
      getTreeData () {
        $http({
          path: this.apis.resource.roleResTree,
          method: 'get',
          data: {roleId: this.initOption.roleId, useType: this.initOption.useType}
        }).then(response => {
          let res = response.data
          console.log(res)
          if (res.success) {
            if (res.data.length === 0) {
              return
            }
            this.treeData[0].children = res.data
            $.fn.zTree.init($('#treeResource'), this.setting, this.treeData)
            $.fn.zTree.getZTreeObj('treeResource').expandAll(true)
          } else {
            this.$Message.error('获取资源树信息失败，' + res.message)
          }
        })
      },
      selectNode (array) {
        if (array && array.length > 0) {
          if (!array[0].id) {
            this.$Notice.warning({title: '不能选择根节点'})
            return
          }
        }
      },

      //保存
      ok (callback) {
        var nodes = $.fn.zTree.getZTreeObj('treeResource').getCheckedNodes(true)
        console.log('选择的资源ID：' + JSON.stringify(nodes))
        if (nodes.length === 0) {
          callback(false)
          return
        }
        var ids = []
        nodes.forEach((e) => {
          if (e.id !== null) {
            ids.push(e.id)
          }
        })
        if (ids.length === 0) {
          callback(false)
          return
        }
        let params = {
          roleId: this.initOption.roleId,
          resIds: ids.join(',')
        }
        $http({
          path: this.apis.systemRole.saveres,
          method: 'get',
          data: params
        }).then(response => {
          let res = response.data
          console.log(res)
          if (res.success) {
            this.$Message.success('分配权限成功！')
            callback(true)
          } else {
            this.$Message.error('获取资源树信息失败，' + res.message)
            callback(false)
          }
        })
      },

      cancel () {
        this.treeData[0].children = []
      },

    },
    watch: {
      'initOption.visible' (val) {
        if (val) {
          this.getTreeData()
        } else {
          this.treeData[0].children = []
        }
      }
    },
    components: {
      CommModal
    }
  }
</script>
<style scoped>
    @import '../../../plugins/ztree/css/metroStyle/metroStyle.css';

    .ztree {
        margin-left: 2vw;
        overflow-y: auto;
        max-height: 70vh
    }
</style>
