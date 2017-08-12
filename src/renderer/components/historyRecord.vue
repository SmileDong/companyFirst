<template>
    <div class='container'>
        <div class='main'>
            <div class='title'>
                <span>{{assetName}}</span>
                <span class='el-icon-arrow-left' @click='clickButtonBack'></span>
            </div>
            <div class='historyTitle'>
                <span>历史曲线</span>
                <div class="block" style='display: inline-block;'>
                    <el-date-picker
                            v-model="value1"
                            type="datetime"
                            placeholder="选择日期时间">
                    </el-date-picker>
                </div>
            </div>
            <div class='lineChart' v-for='hisData in historyData'>
                <p>{{transData[hisData[hisData.length - 1]].description}}</p>
                <div style='height: 150px;' :id='hisData[hisData.length - 1]'></div>
            </div>
        </div>
    </div>
</template>
<script>
  import echarts from 'echarts'
  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        pickerOptions1: {
          shortcuts: [
            {
              text: '今天',
              onClick (picker) {
                picker.$emit('pick', new Date())
              }
            },
            {
              text: '昨天',
              onClick (picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24)
                picker.$emit('pick', date)
              }
            },
            {
              text: '一周前',
              onClick (picker) {
                const date = new Date()
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                picker.$emit('pick', date)
              }
            }
          ]
        },
        value1: ''
      }
    },
    computed: {
      ...mapState([
        'transData',
        'historyData',
        'assetName'
      ])
    },
    methods: {
      clickButtonBack () {
        this.$router.go(-1)
      },
      generateLineChartOption (name1, data1) {
        this.chartData.setOption({
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: [{
              name: name1, textStyle: {color: '#fff', borderColor: 'green'}
            }]
          },
          grid: {
            top: '13%',
            left: '1%',
            right: '1%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23', '24'],
            axisLine: {
              lineStyle: {
                type: 'solid',
                color: '#4677A1',
                width: '2'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#4677A1'
              }
            }
          },
          yAxis: {
            min: 0,
            splitArea: {show: false},
            axisLine: {
              show: false,
              lineStyle: {
                type: 'solid',
                color: '#244059'
              }
            },
            axisTick: {
              show: false
            },
            minInterval: 1,
            splitNumber: 4,
            splitLine: {
              lineStyle: {
                color: '#4e84b1'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#4677A1'
              }
            }
          },
          series: [
            {
              name: name1,
              type: 'line',
              data: data1,
              itemStyle: {
                normal: {
                  color: '#319BDE',
                  lineStyle: {
                    color: '#319BDE'
                  }
                }
              }
            }
          ]
        })
      }
    },
    mounted () {
      this.$nextTick(function () {
        for (var key in this.historyData) {
//          console.log(this.historyData[key])
          this.chartData = echarts.init(document.getElementById(key))
          this.generateLineChartOption(this.transData[this.historyData[key][this.historyData[key].length - 1]].description, this.historyData[key])
        }
      })
    }
  }
</script>

<style scoped lang='scss'>
    @import '../assets/scss/common';

    * {
        margin: 0;
        padding: 0;
    }
    .container {
        padding: 15px;
        background-color: #1F384F;
        min-height: 750px;
        .main {
            border: 1px solid #304B65;
            background-color: #254159;
            .title {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                height: 48px;
                line-height: 48px;
                padding: 0 10px;
                margin-top: 0;
                border-bottom: 1px solid #294864;
                color: #329ce0;
                font-size: 23px;
                .el-icon-arrow-left {
                    margin-top: 15px;
                    margin-right: 10px;
                    cursor: pointer;
                }
            }
            .historyTitle {
                span {
                    border-top: 2px solid #00B3EE;
                    display: inline-block;
                    padding: 10px 15px;
                    color: #329CE0;
                }
            }
            .lineChart {
                margin-bottom: 20px;
                /*#houseTemperature {*/
                /*height: 150px;*/
                /*}*/
                #houseTemperature1 {
                    height: 150px;
                }
                #errorStatus {
                    height: 150px;
                }
                #windSpeed {
                    height: 150px;
                }
                #hours {
                    height: 150px;
                }
                #minutes {
                    height: 150px;
                }
                p {
                    color: #49738C;
                }
            }
        }
    }

    .el-input__inner {
        height: 28px;
        background-color: #00B3EE !important;
    }
</style>