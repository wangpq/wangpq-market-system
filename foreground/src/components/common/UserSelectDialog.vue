<template>
    <Modal
            width="60"
            v-model="initOption.visible"
            :title="initOption.title"
            @on-ok="ok"
            :loading="loading"
            :mask-closable="false">

        <DataTable
                :url="apis.systemUser.get"
                method="post"
                :columns="columns"
                isLoadDataNow="false"
                isLoadHandleBtns="false"
                pageFloat="float: left"
                ref="UserSelectDialog"
                refs="UserSelectDialog"
                :searchForm="searchForm">
                <template slot="search">
                    <Form-item label="登录名" :label-width="60" prop="name">
                        <Input type="text" v-model="searchForm.name"/>
                    </Form-item>
                  <Form-item label="昵称" :label-width="60" prop="name">
                    <Input type="text" v-model="searchForm.nickname"/>
                  </Form-item>
                    <Form-item label="手机" :label-width="60" prop="tel">
                        <Input type="text" v-model="searchForm.tel"/>
                    </Form-item>
                </template>
        </DataTable>
    </Modal>
</template>
<script>
  import DataTable from '@/components/common/DataTable'

  export default {
    name: 'UserSelectDialog',
    props: {
      initOption: {
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

        columns: [
          {
            title: '序号',
            type: 'selection',
            width: 70,
            align: 'center'
          },
          {
            title: '登录名',
            key: 'name',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '昵称',
            key: 'nickname',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '手机号',
            key: 'tel',
            sortable:true,
            minWidth:70,
            align: 'center'
          },
          {
            title: '创建时间',
            key: 'createTime',
            align: 'center'
          }],
        searchForm: {
         name: null,
          tel: null,
          nickname:null
        },
        loading: true
      }
    },
    methods: {
      ok () {
        var row = this.$refs.UserSelectDialog.getSelectRow()
        if (row.length == 0 || row.length > 1) {
          this.$Message.info('只能选择一行')
          this.loading = false
          setTimeout(() => {
            this.loading = true
          }, 50)
          return false
        }
        debugger
  
    this.initOption.visible = false

    
  
        this.$parent.providerForm.countermanId = row[0].id
        this.$parent.providerForm.countermanName = row[0].nickname;
        //let data={countermanId :  row[0].id ,countermanName : row[0].nickname};
        //this.$emit("on-ywy-ok",data);



      }
    },
    watch: {
      'initOption.visible' (val) {
        if (val) {
          //加载数据
          this.$refs.UserSelectDialog.loadData()
        } else {
          this.$refs.UserSelectDialog.clear()
        }
      }
    },
    components: {
      DataTable
    }
  }
</script>
<style scoped>
</style>
