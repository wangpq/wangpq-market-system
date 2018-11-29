<template>
    <div route="/log" id="systemLogIndex" class="layout-content">
        <div class="layout-content-main">
            <DataTable
                    :url="apis.log.get"
                    method="post"
                    :columns="columns"
                    :searchForm="searchForm">
                <template slot="search">
                    <FormItem label="访问方法" prop="method" :label-width="60">
                        <Input v-model="searchForm.method"></Input></FormItem>
                    <FormItem label="方法描述" prop="methodDes" :label-width="60">
                        <Input v-model="searchForm.methodDes"></Input></FormItem>
                    <Form-item label="日期" :label-width="60" prop="saleTime">
                        <DatePicker :clearable="false" type="daterange" v-model="dateRange"
                                    @on-change="selectRange" format="yyyy-MM-dd" placeholder="选择日期区间"
                                    style="min-width: 10vw"></DatePicker>
                    </Form-item>
                </template>
            </DataTable>
        </div>
    </div>
</template>
<script>
  import DataTable from '@/components/common/DataTable'

  import $http from '@/utils/httputils'

  export default {
    name: 'systemLogIndex',
    data () {
      return {

        columns: [
          {
            title: '序号',
            type: 'selection',
            width: 80,
            align: 'center'
          },
          {
            title: '方法描述',
            key: 'methodDes',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '访问方法',
            key: 'method',
            sortable: true,
            minWidth:70,
            align: 'center'
          }, {
            title: 'IP地址',
            key: 'ipAddress',
            sortable: true,
            minWidth:70,
            align: 'center'
          }, {
            title: '访问路径',
            key: 'url',
            sortable: true,
            minWidth:70,
            align: 'center'
          }, {
            title: '浏览器名称',
            key: 'browseName',
            sortable: true,
            minWidth:70,
            align: 'center'
          }, {
            title: '访问参数',
            key: 'params',
            sortable: true,
            minWidth:70,
            align: 'center'
          }, {
            title: '访问者',
            key: 'userName',
            sortable: true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            sortable: true,
            minWidth:140,
            align: 'center'
          }],
        dateRange: '',
        searchForm: {
          method: null,
          methodDes: null,
          startTime: null,
          endTime: null,
        },
      }
    },
    methods: {

      selectRange (e) {
        this.searchForm.startTime = e[0] + " 00:00:00"
        this.searchForm.endTime = e[1] + " 23:59:59"
      },

      hanldeDelete (row) {
        if (!(row = this.$children[0].isRightSelectForBatch(row))) {return}

        this.$Modal.confirm({
          title: '请确认',
          content: '确定永久删除【' + row.name + '】系统日志？',
          onOk: () => {
            $http({
              path: this.apis.log.del,
              method: 'delete',
              data: {ids: row.id}
            }).then(response => {
              if (response.data.success) {
                this.$Notice.success({
                  title: '提示',
                  desc: '【' + row.name + '】删除成功！'
                })
                this.$children[0].query()
              } else {
                this.$Notice.error({
                  title: '提示',
                  desc: response.data.message
                })
              }
            })
          }
        })
      },
    },
    components: {
      DataTable,
    }
  }
</script>
<style>
</style>
