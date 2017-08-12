/* eslint-disable no-undef */

<template>
    <div class='child_right'>
        <ul>
            <li v-for='submenu in submenus' :class='{currentClass: submenu === currentItem}'
                @click='clickItem(submenu)'>
                <div class='left'>
                    <img :src="submenu.path" alt="">
                </div>
                <div class='middle'>
                    <p class='title'>{{submenu.name}}</p>
                    <p class='outPmNum'>{{submenu.outPmNum}}</p>
                    <p class='outPm'>室外PM2.5</p>
                </div>
                <div class='right'>
                    <p class='emptyP'></p>
                    <p class='innerPmNum'>
                        <!--{{submenu.topic}}-->
                        {{submenu.topic && rtvalue[submenu.topic] ? rtvalue[submenu.topic]['PM25'].v : 0}}
                    </p>
                    <p class='innerPm'>室内PM2.5</p>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
  import axios from 'axios'
  import config from '../../config/index'
  import pinyin from 'pinyin'
  //  import {mapState} from 'vuex'
  export default {
    data () {
      return {
        submenus: [],
        currentItem: {}
      }
    },
    methods: {
      clickItem (submenu) {
        this.currentItem = submenu
        // console.log(this.currentItem)
//        console.log(this.rtvalue[this.currentItem.topic])
//        console.log(submenu.objBuild)
        this.$store.commit('SET_clickItemResponse', submenu)
      }
    },
    computed: {
      rtvalue: function () {
        return this.$store.state.MqttRTValue.rtvalue
      }
    },
    mounted () {
      //  请求项目
      axios.get(config.serverURL + '/project?orgid=TELLHOW&page=1&rows=999999')
          .then(response => {
            response.data.data.content.map((mainData, index, arr) => {
              if (mainData.name !== '个人工程' && mainData.name !== '私人工程') {
                //  请求主设备
                axios.get(config.serverURL + '/asset?orgid=TELLHOW&page=1&rows=999999&assetnum=' + mainData.mainasset)
                    .then((asset) => {
                      var assetData = asset.data.data.content[0]
                      if (assetData != null) {
                        var topic = assetData.orgid + '/' + assetData.productid + '/' + assetData.serialnum
                      }
                      //  请求主设备最后时刻PM2.5的值
                      mainData.topic = topic
                      axios.get(config.lastTimeURL + '?topic=' + topic)
                          .then((value) => {
                            mainData.attrData = value.data
                            mainData.TH = value.data && value.data.TH ? value.data.TH.v : 0
                            mainData.RH = value.data && value.data.TH ? value.data.RH.v : 0
                          })
//                      请求室内PM2.5
                      var startTime = new Date(new Date().toLocaleDateString()).getTime()
                      var endTime = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
                      mainData.lineData = {}
//                      请求折线图数据室内PM2.5
                      if (topic != null) {
                        axios.get(config.PMURL + '/api/query?start=' + startTime + '&end=' + endTime + '&m=sum:1h-avg-none:' + topic + '.PM25' + '{orgid=TELLHOW}')
                            .then(pmArr => {
                              var pmValueArr = []
                              for (var key in pmArr.data[0].dps) {
                                pmValueArr.push(pmArr.data[0].dps[key])
                              }
                              mainData.lineData.innerData = pmValueArr
                              mainData.innerPmNum = pmValueArr[pmValueArr.length - 1]
                            })
                      }
                      var cityPinYin = pinyin(mainData.city, {
                        style: pinyin.STYLE_NORMAL,
                        heteronym: true
                      })
                      var cityName = ''
                      for (var i = 0; i < cityPinYin.length; i++) {
                        cityName += cityPinYin[i][0]
                      }
//                      請求折线图室外PM2.5
                      axios.get(config.PMURL + '/api/query?start=' + startTime + '&end=' + endTime + '&m=sum:1h-avg-none:' + cityName + '.PM25' + '{orgid=TELLHOW}')
                          .then(pmArr1 => {
                            var pmValueArr1 = []
                            for (var key in pmArr1.data[0].dps) {
                              pmValueArr1.push(pmArr1.data[0].dps[key])
                            }
                            mainData.lineData.outerData = pmValueArr1
                            mainData.outPmNum = pmValueArr1[pmValueArr1.length - 1]
                          })
                    })
                //  请求项目楼层数据
                axios.get(config.serverURL + '/locations?orgid=TELLHOW&page=1&rows=999999&projectid=' + mainData.projectid)
                    .then(floorData => {
                      var floorArr = []
//                      console.log(floorData.data.data.content)
                      var locations = floorData.data.data.content
                      var objBuild = []
                      locations.map(data => {
                        if (data.hasparent === false) {
                          objBuild[data.location] = {
                            info: data,
                            items: []
                          }
                        }
                      })
                      locations.map(data => {
                        if (data.hasparent === true) {
                          objBuild[data.parent].items.push(data)
                        }
                      })
//                      console.log(objBuild)
//                      for (var objKey in objBuild) {
//                        objBuild[objKey].items.map((objData, objInd, objArr) => {
//                          objData.assets = []
//                          axios.get(config.serverURL + '/asset?orgid=TELLHOW&page=1&rows=999999&projectid=' + mainData.projectid)
//                              .then(assetData => {
//                                mainData.deviceTotel = assetData.data.data.content.length
//                                assetData.data.data.content.map((asset, index, arr) => {
//                                  if (objData.location === asset.location) {
//                                    objData.assets.push(asset)
//                                  }
//                                })
//                                objData.devicesNum = objData.assets.length
//                              })
//                          axios.get(config.serverURL + '/docs/info?orgid=TELLHOW&page=1&rows=999999')
//                              .then(response => {
//                                response.data.entities.map((data, index, arr) => {
//                                  if (data.docinfoid === Number(objData.imageurl)) {
//                                    objData.floorImgPath = 'http://139.224.33.166:80/ecloud/' + data.urlname
//                                  }
//                                })
//                              })
//                        })
//                      }
                      floorData.data.data.content.map((fdata, index, arr) => {
                        if (fdata.parent !== null) {
                          //  请求每个项目中的设备
                          fdata.assets = []
                          axios.get(config.serverURL + '/asset?orgid=TELLHOW&page=1&rows=999999&projectid=' + mainData.projectid)
                              .then(assetData => {
                                mainData.deviceTotel = assetData.data.data.content.length
                                assetData.data.data.content.map((asset, index, arr) => {
                                  if (fdata.location === asset.location) {
                                    fdata.assets.push(asset)
                                  }
                                })
                                fdata.devicesNum = fdata.assets.length
                              })
                          axios.get(config.serverURL + '/docs/info?orgid=TELLHOW&page=1&rows=999999')
                              .then(response => {
                                response.data.entities.map((data, index, arr) => {
                                  if (data.docinfoid === Number(fdata.imageurl)) {
                                    fdata.floorImgPath = 'http://139.224.33.166:80/ecloud/' + data.urlname
                                  }
                                })
                              })
                          fdata.buildName = mainData.name
                          floorArr.push(fdata)
                        }
                      })
//                      console.log(floorArr)
                      mainData.objBuild = objBuild
                      mainData.floors = floorArr
                    })
//                请求图片数据
                axios.get(config.serverURL + '/docs/info?orgid=TELLHOW&page=1&rows=999999')
                    .then(response => {
                      response.data.entities.map((data, index, arr) => {
                        if (data.docinfoid === Number(mainData.imageurl)) {
                          mainData.imgData = data
                          mainData.path = 'http://139.224.33.166:80/ecloud/' + data.urlname
                        }
                      })
                    })
                this.submenus.push(mainData)
              }
            })
            setTimeout(() => {
              this.clickItem(this.submenus[0])
            }, 500)
          })
    }
  }
</script>

<style scoped lang='scss'>
    @import '../../assets/scss/common';

    * {
        margin: 0;
        padding: 0;
    }

    .child_right {
        background-color: #244059;
        margin-left: 15px;
        height: 100%;
        overflow-y: scroll;
        ul {
            list-style: none;
            li {
                display: flex;
                flex-direction: row;
                padding: 20px;
                color: #487BA6;
                cursor: pointer;
                box-sizing: border-box;
                .left {
                    img {
                        width: 75px;
                        height: 75px;
                    }
                }
                .middle {
                    /*margin: 0 10px;*/
                    margin-left: 10px;
                    flex: 1;
                    .title {
                        font-size: 18px;
                        font-weight: 700;
                    }
                    .outPmNum {
                        padding: 5px 0;
                        font-size: 28px;
                        font-family: Arial;
                        font-weight: 700;
                        color: #329CE0;
                        text-align: left;
                        padding-left: 20%;
                    }
                    .outPm {
                        font-size: 12px;
                        text-align: left;
                        padding-left: 10%;
                    }
                }
                .right {
                    .emptyP {
                        height: 20px;
                    }
                    .innerPmNum {
                        padding: 5px 0;
                        font-size: 28px;
                        font-family: Arial;
                        font-weight: 700;
                        color: #2FD164;
                        text-align: center;
                    }
                    .innerPm {
                        font-size: 12px;
                        text-align: right;
                    }
                }
            }
            li:hover {
                background-color: #254967;
            }
        }
    }

    .currentClass {
        background-color: #254967;
        border-left: 2px solid #329CE0;
    }
</style>
