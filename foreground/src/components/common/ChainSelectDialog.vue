<template>
    <CommModal
            width="60"
            v-model="initOption.visible"
            :title="initOption.title"
            @on-ok="ok"
            :loading="loading"
            :mask-closable="false">

        <DataTable
                :url="apis.chain.get"
                method="post"
                :columns="columns"
                isLoadDataNow="false"
                pageFloat="float: left"
                ref="ChainSelectDialog"
                refs="ChainSelectDialog"
                :searchForm="searchForm">
            <template slot="search">
                <Form-item label="门店名称" :label-width="60" prop="name">
                    <Input type="text" v-model="searchForm.name"></Input>
                </Form-item>
            </template>
        </DataTable>
    </CommModal>
</template>
<script>
  import DataTable from '@/components/common/DataTable'
  import CommModal from '../../../plugins/CommModal'

  export default {
    name: 'ChainSelectDialog',
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
        },
        action: {
          type: String,
          default: ''
        }
      }
    },
    data () {
      return {

        columns: [
          {
            title: '序号',
            type: 'selection',
            width: 70,
            align: 'center'
          },
          {
            title: '门店名称',
            key: 'name',
            align: 'center'
          },
          {
            title: '编码',
            key: '编码',
            align: 'center'
          },
          {
            title: '门店类型',
            key: 'shopType',
            align: 'center',
            render: (h, params) => {
              var val = params.row.shopType
              var res = ''
              switch (val) {
                case 0:
                  res = '自营型'
                  break
                case 1:
                  res = '加盟型'
                  break
              }
              return h('span', {}, res)
            }
          },
          {
            title: '联系手机',
            key: 'mobile',
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            align: 'center'
          }],
        searchForm: {
          name: null,
        },
        loading: true
      }
    },
    methods: {
      ok (callback) {
        var row = this.$refs.ChainSelectDialog.getSelectRow()
        if (row.length == 0) {
          this.$Message.info('请选择行！')
          callback(false)
          return
        }
        var ids = []
        var names = []
        row.forEach(e => {
          ids.push(e.id)
          names.push(e.name)
        })
        this.$emit('select-chain', ids, names, function (res) {
          callback(res)
        })
      }
    },
    watch: {
      'initOption.visible' (val) {
        if (val) {
          //加载数据
          this.$refs.ChainSelectDialog.loadData()
        } else {
          this.$refs.ChainSelectDialog.clear()
        }
      }
    },
    components: {
      DataTable,
      CommModal
    }
  }
</script>
<style scoped>
</style>
