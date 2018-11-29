<template>
    <div>
        <table class="self-table">
            <thead>
            <th>姓名</th>
            <th>生日</th>
            <th>电话</th>
            <th>地址</th>
            </thead>
            <tbody>
            <tr>
                <td>索马里</td>
                <td>2012-2-2</td>
                <td>110</td>
                <td>贵阳</td>
            </tr>
            <tr>
                <td>索马里</td>
                <td>2012-2-2</td>
                <td>110</td>
                <td>贵阳</td>
            </tr>
            </tbody>
        </table>

    </div>
</template>
<script>
  import { imgCut } from '../../plugins/vue-imgcut'

  export default {
    data () {
      return {
        imgsrc: '',
      }
    },
    components: {
      imgCut
    },
    methods: {
      clipPic (img) {
        this.imgsrc = img
        //console.log(imgss)
      }
    }
  }
</script>
<style scoped>
    .self-table {
        text-align: center;
        width: 100%;
        border-left: 1px solid #e8eaec;
    }

    tr {
        width: 100%;

    }

    th:first-child {
        border-left: 1px solid #e8eaec;
    }

    td:first-child {
        border-left: 1px solid #e8eaec;
    }

    .self-table th, td {
        border-right: 1px solid #e8eaec;
        border-bottom: 1px solid #e8eaec;
        padding: 5px;
        margin: 0;
    }
</style>
