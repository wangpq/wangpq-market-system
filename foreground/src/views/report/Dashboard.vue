<template>
    <div id="sysDashboard">
        <div class="layout-content">
            <div class="layout-content-main">
                <Card>
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        门店销售统计
                    </p>
                    <Row class="sale-content">
                        <Col span="4">
                            <Card>
                                <p slot="title">
                                    <Icon type="ios-film-outline"></Icon>
                                    今日销售量
                                </p>
                                <count-to
                                        class="sale-count"
                                        :startVal='0'
                                        :endVal='saleCount.day'
                                        :duration=4000

                                        suffix="单"></count-to>
                            </Card>
                        </Col>
                        <Col span="4">
                            <Card>
                                <p slot="title">
                                    <Icon type="ios-film-outline"></Icon>
                                    今日销售额
                                </p>
                                <count-to
                                        class="sale-count"
                                        :startVal='0'
                                        :endVal='saleCount.dayPrice'
                                        :duration=4000
                                        :decimals=2
                                        suffix="元"></count-to>
                            </Card>
                        </Col>
                        <Col span="4">
                            <Card>
                                <p slot="title">
                                    <Icon type="ios-film-outline"></Icon>
                                    周销售量
                                </p>
                                <count-to
                                        class="sale-count"
                                        :startVal='0'
                                        :endVal='saleCount.week'
                                        :duration=4000
                                        suffix="单"></count-to>
                            </Card>
                        </Col>
                        <Col span="6">
                            <Card>
                                <p slot="title">
                                    <Icon type="ios-film-outline"></Icon>
                                    总销售量
                                </p>
                                <count-to
                                        class="sale-count"
                                        :startVal='0'
                                        :endVal='saleCount.total'
                                        :duration=4000
                                        suffix="单"></count-to>
                            </Card>
                        </Col>
                        <Col span="6">
                            <Card>
                                <p slot="title">
                                    <Icon type="ios-film-outline"></Icon>
                                    总销售额
                                </p>
                                <count-to
                                        class="sale-count"
                                        :startVal='0'
                                        :endVal='saleCount.totalPrice'
                                        :duration=2000
                                        :decimals=2
                                        suffix="元"></count-to>
                            </Card>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <p slot="title">
                        <Icon type="ios-film-outline"></Icon>
                        系统信息
                    </p>
                    <Row>
                        <Col span="10">
                            <charts ref="memChart" :options="memChart" auto-resize></charts>
                        </Col>
                        <Col span="14">
                            <charts ref="logChart" :options="logChart" auto-resize></charts>
                        </Col>
                    </Row>
                </Card>
            </div>
        </div>
    </div>
</template>
<script>
  import 'echarts/theme/roma';
  import countTo from 'vue-count-to';
  import $http from '@/utils/httputils'

  export default {
    name: 'sysDashboard',
    data: function data () {
      return {
        saleCount: {
          day: null,
          dayPrice: null,
          week: null,
          total: null,
          totalPrice: null,
        },
        monitorDataIndex: '',
        memChart: {
          title: {
            text: 'JVM内存',
            bottom: '20px',
            left: '50%',
            textAlign: 'center'
          },
          series: [{
            name: '物理内存',
            type: 'gauge',
            min: 0,
            max: 100,
            axisLine: {            // 坐标轴线
              lineStyle: {       // 属性lineStyle控制线条样式
                width: 10
              }
            },
            data: [{
              value: 0,
              name: 'MB/Used'
            }]
          }]
        },
        logChart: {
          title: {
            text: '访问量',
            bottom: '10px',
            left: '50%',
            textAlign: 'center'
          },
          tooltip: {
            trigger: 'none',
            axisPointer: {
              type: 'cross'
            }
          },
          xAxis: [{
            type: 'category',
            data: ['2018-01', '2018-02', '2018-03', '2018-04', '2018-05', '2018-06']
          }],
          yAxis: [{
            type: 'value'
          }],
          series: [{
            name: '访问量',
            type: 'line',
            data: [25866, 22345, 13553, 6589, 45256, 68569]
          }]
        }
      };
    },
    mounted: function mounted () {
      this.$nextTick(function () {
        this.getSaleCount();

        this.monitorDataIndex = setInterval(() => {
          this.getMonitorData();
        }, 5000);
      });
    },
    methods: {
      calcColor: function calcColor (percent) {
        if (percent < 10) {
          return '#EE0000';
        } else if (percent < 20) {
          return '#EE5C42';
        } else if (percent < 40) {
          return '#EEB4B4';
        } else if (percent < 60) {
          return '#C1FFC1';
        } else if (percent < 70) {
          return '#ADFF2F';
        } else if (percent < 80) {
          return '#7CFC00';
        } else if (percent < 90) {
          return '#00EE00';
        }
        return '#00FF00';
      },

      getSaleCount () {
        $http({
          path: this.apis.chainOrder.count,
          method: 'get',
          data: {}
        }).then(response => {
          let res = response.data
          if (res.success) {
            this.saleCount.day = res.data.day
            this.saleCount.week = res.data.week
            this.saleCount.total = res.data.total
            this.saleCount.dayPrice = res.data.dayPrice
            this.saleCount.totalPrice = res.data.totalPrice
          } else {
            this.$Notice.error({
              title: '提示',
              desc: response.data.message
            })
          }
        })
      },

      getMonitorData () {
        let obj = {};
        this.memChart.series[0].max = (obj.mem / 1024).toFixed(0);
        let memUsed = ((obj.mem - obj['mem.free']) / 1024).toFixed(0);
        this.memChart.series[0].data[0].value = memUsed;
      }
    },
    beforeDestroy () {
      clearInterval(this.monitorDataIndex);
    },
    components: {
      countTo
    }
  };
</script>
<style lang="scss" scoped>
    .sell-charts {
        width: 100%;
        height: 200px;
    }

    .ivu-card {
        .ivu-card-body {
            text-align: center;
        }
    }

    .sale-content {
        text-align: center;
    }

    .sale-count {
        font-size: 2vw;
        color: #F6416C;
        display: block;
        text-align: center;
        font-weight: 500;
    }

</style>
