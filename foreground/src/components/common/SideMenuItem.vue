<template>
    <Submenu :name="parentItem.id">
        <template slot="title">
            <Icon class="menu-icon" :type="parentItem.resIcon" :size="iconSize"/>
            <span class="menu-text">{{ parentItem.title }}</span>
        </template>
        <template v-for="item in parentItem.children">
            <SideMenuItem
                    v-if="item.children&&item.children.length!==0"
                    :parent-item="item"
                    :key="item.id">
            </SideMenuItem>
            <menu-item v-else :name="item.url+'$$'+item.id" :key="item.id">
                <Icon class="menu-icon" :type="item.resIcon" :size="iconSize" />
                <span class="menu-text">{{ item.title }}</span>
            </menu-item>
        </template>
    </Submenu>
</template>

<script>
  export default {
    name: 'SideMenuItem',
    props: {
      parentItem: {
        type: Object,
        default: () => {}
      },
      iconSize:{
        type: Number,
        default:15
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
