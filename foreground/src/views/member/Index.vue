<template>
    <div route="/member" id="memberIndex" class="layout-content">
        <div class="layout-content-main">
            <DataTable
                    :url="apis.member.get"
                    method="post"
                    :columns="columns"
                    :searchForm="searchForm">
                <template slot="search">
                    <Form-item label="会员名称" :label-width="60" prop="name">
                        <Input type="text" v-model="searchForm.name"></Input>
                    </Form-item>
                    <Form-item label="会员号" :label-width="60" prop="description">
                        <Input type="text" v-model="searchForm.memberCode"></Input>
                    </Form-item>
                </template>
                <!--<template slot="function">-->
                <!--<Button type="primary" @click="handleAdd" icon="md-add">新增</Button>-->
                <!--</template>-->
            </DataTable>
            <FormDialog :initOption="memberFormInitOption"></FormDialog>
        </div>
    </div>
</template>
<script>
  import DataTable from '@/components/common/DataTable'
  import FormDialog from '@/views/member/FormDialog'

  import $http from '@/utils/httputils'

  export default {
    name: 'memberIndex',
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
            title: '会员名称',
            key: 'name',
            sortable: true,
            minWidth: 70,
            align: 'center'
          },
          {
            title: '会员号',
            key: 'memberCode',
            sortable: true,
            minWidth: 70,
            align: 'center'
          }, {
            title: '用户头像',
            key: 'header',
            sortable: true,
            minWidth: 70,
            align: 'center',
            render: (h, params) => {
              return h('div', {
                attrs: {},
              }, [
                h('img', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  attrs: {
                    src: '/static/img/header.aec2294.jpg', style: 'width: 2vw;height: 2vw;border-radius: 10px;'
                  },
                  style: {},
                }),
              ])
            }

          }, {
            title: '会员折扣',
            key: 'gradeName',
            sortable: true,
            minWidth: 70,
            align: 'center'
          }, {
            title: '会员积分',
            key: 'integral',
            sortable: true,
            minWidth: 70,
            align: 'center'
          }, {
            title: '性别',
            key: 'gender',
            sortable: true,
            minWidth: 70,
            align: 'center',
            render: (h, params) => {
              var val = params.row.gender
              var res = ''
              switch (val) {
                case 0:
                  res = '保密'
                  break
                case 1:
                  res = '男'
                  break
                case 2:
                  res = '女'
                  break
                default:
                  res = '未知'
              }
              return h('span', {}, res)
            }
          }, {
            title: '生日',
            key: 'birthday',
            sortable: true,
            minWidth: 70,
            align: 'center'
          }, {
            title: '手机号',
            key: 'mobile',
            sortable: true,
            minWidth: 70,
            align: 'center'
          }, {
            title: '公众号ID',
            key: 'openid',
            sortable: true,
            minWidth: 70,
            align: 'center'
          },
          {
            title: '注册时间',
            key: 'registerTime',
            sortable: true,
            minWidth: 70,
            align: 'center'
          }
        ],
        searchForm: {
          name: null,
          memberCode: null
        }
        ,
        memberFormInitOption: {
          title: '',
          action:
            '',
          visible:
            false,
          id:
            ''
        }
        ,
      }
    }
    ,
    methods: {
      handleAdd () {
        this.memberFormInitOption.title = '新增会员'
        this.memberFormInitOption.action = 'add'
        this.memberFormInitOption.visible = true
        this.$children[1].init()
      }
      ,
      handleView (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.memberFormInitOption.title = '查看会员'
        this.memberFormInitOption.action = 'view'
        this.memberFormInitOption.visible = true
        this.memberFormInitOption.id = row.id
        this.$children[1].init()
      }
      ,
      handleEdit (row) {
        if (!(row = this.$children[0].isRightSelect(row))) {return}
        this.memberFormInitOption.title = '编辑会员'
        this.memberFormInitOption.action = 'edit'
        this.memberFormInitOption.visible = true
        this.memberFormInitOption.id = row.id
        this.$children[1].init()
      }
      ,
      hanldeDelete (row) {
        if (!(row = this.$children[0].isRightSelectForBatch(row))) {return}
        this.$Modal.confirm({
          title: '请确认',
          content: '确定删除【' + row.name + '】会员？',
          onOk: () => {
            $http({
              path: this.apis.member.del,
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
      }
      ,
    }
    ,
    components: {
      DataTable,
      FormDialog,
    }
  }
</script>
<style>
</style>
