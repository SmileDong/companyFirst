<template>
    <div class='bottomClass'>
        <div class='left'>
            <h2>{{clickItemResponse ? clickItemResponse.name : ''}} </h2>
            <img :src='clickItemResponse?clickItemResponse.path:pathName' alt="">
            <div class='bottom'>
                <ul>
                    <li>
                        <p class='deviceNum'>{{clickItemResponse ? clickItemResponse.deviceTotel : ''}}</p>
                        <p>设备数量</p>
                    </li>
                    <li>
                        <p class='runNum'>{{0}}</p>
                        <p>运行数量</p>
                    </li>
                    <li>
                        <p class='offlineNum'>{{0}}</p>
                        <p>离线数量</p>
                    </li>
                </ul>
            </div>
        </div>
        <div class='right'>
            <div class='top'>
                <button @click='clickButtonIn'>进入项目</button>
            </div>
            <div class='title el-icon-setting'>PM2.5</div>
            <div id='PMTab'></div>
            <div class='dashBoard'>
                <ul>
                    <li>
                        <p class='el-icon-message'>室内PM2.5</p>
                        <div id='dashBoardOne'></div>
                    </li>
                    <li>
                        <p class='el-icon-message'>室外PM2.5</p>
                        <div id='dashBoardTwo'></div>
                    </li>
                    <li>
                        <p class='el-icon-message'>室内温度</p>
                        <div id='dashBoardThree'></div>
                    </li>
                    <li>
                        <p class='el-icon-message'>室内湿度</p>
                        <div id='dashBoardFour'></div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
  import echarts from 'echarts'
  import {mapState} from 'vuex'
  import ECharts from 'vue-echarts/components/ECharts.vue'
  import axios from 'axios'
  import config from '../../config/index'
  export default {
    data () {
      return {
        chartData: null,
        dashBoardOne: null,
        dashBoardTwo: null,
        dashBoardThree: null,
        dashBoardFour: null,
        lineData1: null,
        lineData2: null,
        pathName: '../../../../static/img/004.jpg'
      }
    },
    component: {ECharts},
    computed: {
      ...mapState([
        'clickItemResponse',
        'imgUrlMap',
        'projectData'
      ]),
      rtvalue () {
        return this.$store.state.MqttRTValue.rtvalue
      }
    },
    methods: {
//      生成折线图数据，最多支持两条线
      generateLineChartOption (name1, data1, name2, data2) {
        return {
          title: {
            text: ''
          },
          tooltip: {
            trigger: 'axis'
          },
          legend: {
            data: [{name: name1, textStyle: {color: '#fff', borderColor: 'green'}}, {
              name: name2,
              textStyle: {color: '#fff', borderColor: 'blue'}
            }]
          },
          grid: {
            top: '20%',
            left: '3%',
            right: '4%',
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
            minInterval: 2,
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
                  color: '#2FCA67',
                  lineStyle: {
                    color: '#2FCA67'
                  }
                }
              }
            },
            {
              name: name2,
              type: 'line',
              data: data2,
              lineStyle: {
                color: 'red'
              }
            }
          ]
        }
      },
      generateDashBoardOption (maxDashBoardNum, dashBoardValue, detailName, detailValueType) {
        return {
          tooltip: {
            formatter: '{a} <br/>{b} : {c}'
          },
          series: [
            {
              name: detailName,
              type: 'gauge',
              center: ['50%', '65%'],
              radius: '60%',
              startAngle: 180,
              endAngle: 0,
              barWidth: 1,
              min: 0,
              max: maxDashBoardNum,
              splitNumber: 4,
              detail: {
                offsetCenter: [0, '40%'],
                formatter: detailValueType,
                textStyle: {
                  color: '#329CE0',
                  fontSize: 15
                }
              },
              data: [{value: dashBoardValue}],
              axisLine: {
                lineStyle: {
                  color: [[0.25, '#329CE0'], [0.5, '#2FD164'], [0.75, '#FF9A37'], [1, '#FF6D6D']],
                  width: 8
                }
              },
              pointer: {
                show: true,
                length: '78%',
                width: 4
              },
              splitLine: {
                show: false,
                width: 2,
                lineStyle: {
                  color: '#244059'
                }
              },
              axisTick: {
                splitNumber: 3,
                length: 3,
                lineStyle: {
                  color: '#4e84b1',
                  type: 'dashed'
                }
              },
              axisLabel: {
                show: true,
                distance: -48
              },
              title: {
                show: false,
                offsetCenter: [0, '-30%'],
                textStyle: {
                  color: '#hhh',
                  fontSize: 14
                }
              }
            }
          ]
        }
      },
      clickButtonIn () {
        this.$router.push('/tellHow')
        this.$store.commit('SET_floorData', this.clickItemResponse.floors)
        this.$store.commit('SET_buildData', this.clickItemResponse.objBuild)
      }
    },
    mounted () {
      setTimeout(() => {
        this.$nextTick(() => {
//          console.log(this.clickItemResponse)
//          console.log(this.rtvalue[this.clickItemResponse.topic])
          var PM25 = this.rtvalue[this.clickItemResponse.topic] && this.rtvalue[this.clickItemResponse.topic]['PM25'] ? this.rtvalue[this.clickItemResponse.topic]['PM25'].v : 0
          var TH = this.rtvalue[this.clickItemResponse.topic] && this.rtvalue[this.clickItemResponse.topic]['TH'] ? this.rtvalue[this.clickItemResponse.topic]['TH'].v : 0
          var RH = this.rtvalue[this.clickItemResponse.topic] && this.rtvalue[this.clickItemResponse.topic]['RH'] ? this.rtvalue[this.clickItemResponse.topic]['RH'].v : 0
          this.chartData = echarts.init(document.getElementById('PMTab'))
          this.dashBoardOne = echarts.init(document.getElementById('dashBoardOne'))
          this.dashBoardTwo = echarts.init(document.getElementById('dashBoardTwo'))
          this.dashBoardThree = echarts.init(document.getElementById('dashBoardThree'))
          this.dashBoardFour = echarts.init(document.getElementById('dashBoardFour'))
          if (this.chartData && this.dashBoardOne && this.dashBoardTwo && this.dashBoardThree && this.dashBoardFour) {
            this.chartData.setOption(this.generateLineChartOption('室内PM2.5', this.clickItemResponse.lineData.innerData, '室外PM2.5', this.clickItemResponse.lineData.outerData))
            this.dashBoardOne.setOption(this.generateDashBoardOption(200, PM25, '实时室内PM2.5', '{value}'))
            this.dashBoardTwo.setOption(this.generateDashBoardOption(200, this.clickItemResponse.outPmNum, '室外PM2.5', '{value}'))
            this.dashBoardThree.setOption(this.generateDashBoardOption(40, Math.floor(TH), '室内温度5', '{value}'))
            this.dashBoardFour.setOption(this.generateDashBoardOption(100, RH, '室内湿度', '{value}'))
          }
        })
      }, 1200)
    },
    watch: {
      clickItemResponse (newValue, oldValue) {
        newValue.floors.map((floorKey, floorIndex, floorArr) => {
          floorKey.assets.map((assetKey, assetIndex, assetArr) => {
            axios.get(config.serverURL + '/product?orgid=TELLHOW&page=1&rows=999999')
                .then(assetData => {
                  assetData.data.data.content.map((aDdata, aIndex, arr) => {
                    if (aDdata.productid === assetKey.productid) {
                      for (var imgKey of this.imgUrlMap) {
                        if (imgKey != null) {
                          if (Number(aDdata.docurl) === imgKey.docinfoid) {
                            assetKey.assetImgUrl = 'http://139.224.33.166:80/ecloud/' + imgKey.urlname
                          }
                        }
                      }
                    }
                  })
                })
//            请求设备表
            axios.get(config.serverURL + '/asset/spec?orgid=TELLHOW&page=1&rows=999999&assetnum=' + assetKey.assetnum)
                .then(specData => {
                  assetKey.attrs = specData.data.data.content
                })
            var topic = assetKey.orgid + '/' + assetKey.productid + '/' + assetKey.serialnum
            //  请求主设备最后时刻属性的值
            axios.get(config.lastTimeURL + '?topic=' + topic)
                .then((value) => {
                  assetKey.attrValue = value.data
                })
          })
        })
        var PM25 = this.rtvalue[newValue.topic] && this.rtvalue[this.clickItemResponse.topic]['PM25'] ? this.rtvalue[newValue.topic]['PM25'].v : 0
        var TH = this.rtvalue[newValue.topic] && this.rtvalue[this.clickItemResponse.topic]['TH'] ? this.rtvalue[newValue.topic]['TH'].v : 0
        var RH = this.rtvalue[newValue.topic] && this.rtvalue[this.clickItemResponse.topic]['RH'] ? this.rtvalue[newValue.topic]['RH'].v : 0
        if (this.chartData && this.dashBoardOne && this.dashBoardTwo && this.dashBoardThree && this.dashBoardFour) {
          this.chartData.setOption(this.generateLineChartOption('室内PM2.5', newValue.lineData.innerData, '室外PM2.5', newValue.lineData.outerData))
          this.dashBoardOne.setOption(this.generateDashBoardOption(200, PM25, '实时室内PM2.5', '{value}'))
          this.dashBoardTwo.setOption(this.generateDashBoardOption(200, newValue.outPmNum, '室外PM2.5', '{value}'))
          this.dashBoardThree.setOption(this.generateDashBoardOption(40, Math.floor(TH), '室内温度5', '{value}'))
          this.dashBoardFour.setOption(this.generateDashBoardOption(100, RH, '室内湿度', '{value}'))
        }
      }
    }
  }
</script>

<style scoped lang='scss'>
    @import '../../assets/scss/common';

    * {
        margin: 0;
        padding: 0;
    }

    .bottomClass {
        display: flex;
        background-color: #244059;
        padding-bottom: 20px;
        .left {
            width: 43%;
            padding-left: 10px;
            padding-top: 10px;
            h2 {
                color: #3197D8;
                margin-bottom: 30px;
            }
            img {
                width: 100%;
                height: 210px;
                @include HLessXS {
                    height: 150px;
                }
                @include HMoreXSLessSM {
                    height: 180px;
                }
                @include HMoreSMLessMD {
                    height: 210px;
                }
            }
            .bottom {
                ul {
                    list-style: none;
                    display: flex;
                    justify-content: space-around;
                    li {
                        p {
                            text-align: center;
                            color: #497DA8;
                        }
                        .deviceNum {
                            font-size: 40px;
                            font-weight: 700;
                            color: #FF9037;
                        }
                        .runNum {
                            font-size: 40px;
                            font-weight: 700;
                            color: #2FD164;
                        }
                        .offlineNum {
                            font-size: 40px;
                            font-weight: 700;
                            color: #A8A8A8;
                        }
                    }
                }
            }
        }
        .right {
            width: 53%;
            #PMTab {
                height: 150px;
                width: 100%;
                color: #4677A1;
                @include HLessXS {
                    height: 110px;
                }
                @include HMoreXSLessSM {
                    height: 130px;
                }
                @include HMoreSMLessMD {
                    height: 150px;
                }
            }
            .dashBoard {
                margin-top: 20px;
                ul {
                    list-style: none;
                    display: flex;
                    justify-content: space-between;
                    li {
                        height: 120px;
                        @include HLessXS {
                            height: 80px;
                        }
                        @include HMoreXSLessSM {
                            height: 100px;
                        }
                        @include HMoreSMLessMD {
                            height: 120px;
                        }
                        p {
                            padding: 2px 18px;
                            color: #4677A1;
                            font-size: 12px;
                            font-weight: 700;
                        }
                        #dashBoardOne {
                            width: 100%;
                            height: 100%;
                        }
                        #dashBoardTwo {
                            width: 100%;
                            height: 100%;
                        }
                        #dashBoardThree {
                            width: 100%;
                            height: 100%;
                        }
                        #dashBoardFour {
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
            .top {
                text-align: right;
                padding-top: 5px;
                button {
                    background-color: #329CE0;
                    border: none;
                    margin-top: 5px;
                    padding: 6px 15px 3px 15px;
                    color: #fff;
                    font-weight: 700;
                    border-radius: 2px;
                    cursor: pointer;
                }
            }
            .title {
                margin-top: 30px;
                margin-left: 8px;
                margin-bottom: 20px;
                color: #4677A1;
            }
        }
    }
</style>
