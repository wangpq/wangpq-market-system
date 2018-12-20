<template>
<div class="layout">
  <Layout>
    <Sider 
      collapsible 
      hide-trigger
      :collapsed-width="18" 
      v-model="isCollapsed"
      @on-collapse="onCollapse"
      :style="{'overflow-x':'hidden'}"
    >
      <Card 
        v-show="!isCollapsed"
        style="height:100%;overflow:auto;"
      >
        <p 
          class="card-head"
          slot="title" 
          v-if="treeOptions.title && treeOptions.title!==''"
        >
          <Icon :type="treeOptions.icon" v-if="treeOptions.icon"></Icon>
          <span>{{treeOptions.title}}</span>
        </p>
        <template
          class="card-head"
          slot="extra"
        >
          <Icon :type="isCollapsed ? 'ios-arrow-forward' : 'ios-arrow-back'" @click="onMenuCollapse"/>
        </template>
        <Tree 
          :data="treeOptions.data" 
          @on-select-change="onTreeSelectChange"
        >
        </Tree>
      </Card>
      <div class="menu-collapse" v-show="isCollapsed">
        <Icon type="ios-arrow-forward" @click="onMenuCollapse"/>
      </div>
    </Sider>
    <Content :style="{padding: '0 16px 16px'}">
      <slot name="body"></slot>
    </Content>
  </Layout>
</div>
</template>

<script>
export default {
  props: {
    treeOptions: {
      type: Object,
      default(){
        return {
          // 左侧树标题
          title : "",
          // 左侧树图标
          icon : "",
          // 左侧树数据
          data : []
        }
      }
    }
  },
  data () {
    return {
      // 左侧树是否折叠
      isCollapsed: false,
      // 左侧树数据
      treeData : this.treeOptions.data
    }
  },
  methods: {
    // 左侧树节点被选中事件
    onTreeSelectChange(target){  
      let txt=target[0].title;
      this.$emit("on-select-change",txt);
    },
    onCollapse(val){ 
      this.isCollapsed=val;
    },
    onMenuCollapse(){ 
      this.isCollapsed=!this.isCollapsed;
    }
  }
}
</script>


<style lang="scss" scoped>
.ivu-layout-sider{
  background-color: #f8f8f8;
}
.card-head{
  >i{
    font-size:16px;
    vertical-align: middle;
  }
  >span{
    vertical-align: middle;
    font-size:14px;
  }
}
.ivu-card-extra{
  i{
    font-size:18px;
    cursor :pointer;
  }
}

.menu-collapse{
  width:100%;
  background-color: #f8f8f8;
  border: 1px solid #dcdee2;
  border-radius: 2px;
  text-align: center;
  padding:4px 0;
  height:100%;
  display: flex;
  flex-direction: row;
  align-items:center;
  justify-content:center;
  i{
    font-size:20px;
    color:#666;
    cursor :pointer;
  }
}

.ivu-card-body{
  overflow:auto!important;
}
</style>
