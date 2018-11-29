<template>
    <Tree :data="data3" :load-data="loadData" ref="commTree"></Tree>
</template>
<script>

  import $http from '@/utils/httputils'

  export default {
    name: 'CommonTree-ajax',
    props: {
      initOption: {
        title: {
          type: String,
          default: '菜单'
        },
        treeUrl: {
          type: String,
          default: ''
        },
      }
    },
    data () {
      return {
        data3: [
          {
            id: null,
            title: this.initOption.title,
            loading: false,
            children: []
          }
        ],
      }
    },
    methods: {
      loadData (item, callback) {
        var data = {pid: item.id}
        $http({
          path: this.initOption.treeUrl,
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
            this.$Message.error('获取树信息失败，' + res.message)
          }
        })
      },
      getSelectedNodes (callback) {
        var node = this.$refs.commTree.getSelectedNodes()
        callback(node)
        this.restTree()
      },
      restTree () {
        this.data3 = [{
          id: null,
          title: this.title,
          loading: false,
          children: []
        }
        ]
      }
    }
  }
</script>
