<template>
    <div id='main' class='fullHeghtContent1'>
        <div class='left'>
            <p>{{currentSubmen.buildName}}
            <span class="item el-icon-date"><i></i></span>
            </p>
            <!--<div>-->
                <!--<p class='el-icon-arrow-left' @click='clickTitle'>{{currentSubmen.buildName}}</p>-->
                <!--<ul>-->
                    <!--<li v-for='submenu in submenus' :class='{currentClass: currentSubmen === submenu}'-->
                        <!--@click='clickItem(submenu)'>{{submenu.description}}-->

                    <!--</li>-->
                <!--</ul>-->
            <!--</div>-->
            <div v-for='buildKey in buildData'>
                <p class='el-icon-arrow-left' @click='clickTitle'>{{buildKey}}123</p>
                <!--<ul>-->
                    <!--<li v-for='submenu in submenus' :class='{currentClass: currentSubmen === submenu}'-->
                        <!--@click='clickItem(submenu)'>{{submenu.description}}-->

                    <!--</li>-->
                <!--</ul>-->
            </div>
        </div>
        <div class='right'>
            <ul class='breadcrumb'>
                <li><span class='el-icon-arrow-left' @click='backHome'></span></li>
                <li><span class='title'>北京泰豪智能大厦</span></li>
                <li class='floor'>{{currentSubmen.description}}</li>
            </ul>
            <div class='clickOpreate'>
                <button v-for='operate in operates'
                        :class='[operate.className, {currentOperateClass: operate === currentOperate}]'
                        @click='clickOperate(operate)'>{{operate.content}}
                </button>
            </div>
            <div class='show-area fullHeghtContentWithdown'>
                <div class='showImg' v-if="currentOperate.showClassName === 'showImg'">
                    <img class='imgSize' :src='currentSubmen.floorImgPath' alt="">
                    <img :src="asset.assetImgUrl" alt=""
                         class='PMIcon'
                         v-for='asset in currentSubmen.assets'
                         :style="[{left: asset.point.left+'px'},{top: asset.point.top+'px'}]"
                         @click='clickImg(asset)'>
                </div>
                <div class='showTable' v-if="currentOperate.showClassName === 'showTable'">
                    <table class='table'>
                        <thead>
                        <tr>
                            <th>设备编码</th>
                            <th>设备名称</th>
                            <th>产品名称</th>
                            <th>产品类型</th>
                            <th>安装位置</th>
                            <th>安装时间</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr v-for='assetData in currentSubmen.assets'>
                            <td>{{assetData.assetnum}}</td>
                            <td>{{assetData.description}}</td>
                            <td>{{assetData.productid}}</td>
                            <td>{{assetData.productType}}</td>
                            <td>{{assetData.location}}</td>
                            <td>{{assetData.installdate}}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>

                <div class='controlPanel' v-if="currentOperate.isShow === 'show'">
                    <div class='title'>
                        <p>{{this.currentAssetTitle ? this.currentAssetTitle : ''}}</p>
                        <p>状态</p>
                    </div>
                    <ul>
                        <li v-for='att in currentAttrs' v-if='att.rwtype.indexOf("R") !== -1'>
                            <span>
                                {{transData[att.assetattrid] ? transData[att.assetattrid].description : ''}}
                              </span>
                            <span class='value'>
                        {{rtvalue[currentTopic] && rtvalue[currentTopic][att.assetattrid] ? (rtvalue[currentTopic][att.assetattrid].v === 'false' || rtvalue[currentTopic][att.assetattrid].v === 'true' ? rtvalue[currentTopic][att.assetattrid].v : Math.round(rtvalue[currentTopic][att.assetattrid].v)) : '0'}}
                        {{transData[att.assetattrid] ? transData[att.assetattrid].measureunitid : ''}}
                        </span>
                        </li>
                    </ul>
                    <div class='control'>
                        <p>控制</p>
                        <div v-if='execute.rwtype.indexOf("W") !== -1' v-for='execute in currentAttrs'>
                            <span>{{transData[execute.assetattrid] ? transData[execute.assetattrid].description : ''}}:</span>
                            <button @click='sendMessage(execute)'>
                                下发

                            </button>
                            <input type="text" v-model='execute.sendText'>
                        </div>
                        <p class='history'>
                            <button @click='clickButtonHis'>查看历史记录</button>
                        </p>
                    </div>
                </div>
                <div class='topic'>
                    <p>图例</p>
                    <p>彩色表示:在线</p>
                    <p>灰色表示:离线</p>
                </div>
            </div>
            <div class='row'>
                <div style='color: #FF9037;'>
                    <p class='number'>{{currentSubmen.devicesNum}}</p>
                    <p>总计数量</p>
                </div>
                <div style='color: #2FD164;'>
                    <p class='number'>0</p>
                    <p>在线数量</p>
                </div>
                <div style='color: #A8A8A8;'>
                    <p class='number'>0</p>
                    <p>离线数量</p>
                </div>
                <div style='color: #FF6D6D;'>
                    <p class='number'>0</p>
                    <p>报警数量</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
  import {mapState} from 'vuex'
  import axios from 'axios'
  import config from '../config/index'
  export default {
    data () {
      return {
        submenus: [],
        attrsData: [],
        sendData: [],
        currentAttrData: [],
        executeData: [
          {
            title: '自动模式',
            buttonText: '下发'
          },
          {
            title: '童锁开关',
            buttonText: '下发'
          },
          {
            title: '电辅热',
            buttonText: '下发'
          },
          {
            title: '',
            buttonText: '下发'
          },
          {
            title: '开关机状态',
            buttonText: '下发'
          },
          {
            title: '外循环',
            buttonText: '下发'
          },
          {
            title: '睡眠模式开启',
            buttonText: '下发'
          }
        ],
        operates: [
          {
            className: 'el-icon-menu',
            content: '',
            showClassName: 'showImg'
          },
          {
            className: 'el-icon-setting',
            content: '',
            showClassName: 'showTable'
          },
          {
            className: 'text',
            content: '控制面板',
            showClassName: '',
            isShow: ''
          }
        ],
        currentSubmen: {},
        currentOperate: {},
        currentAssetTitle: null,
        attrNameArr: [],
        hisData: {},
        currentAsset: {},
        currentAttrs: [],
        currentTopic: ''
      }
    },
    computed: {
      ...mapState([
        'floorData',
        'transData',
        'buildData'
      ]),
      rtvalue () {
        return this.$store.state.MqttRTValue.rtvalue
      }
    },
    methods: {
      clickItem (submenu) {
        this.currentAssetTitle = null
        submenu.assets.map((assetData, assetIndex, assetArr) => {
          var point = JSON.parse(assetData.coords)
          assetData.point = point
        })
        if (submenu.assets.length === 0) {
          this.attrsData = null
        } else {
          this.clickImg(submenu.assets[0])
        }
        this.currentSubmen = submenu
      },
      clickTitle () {
        this.currentSubmen = this.submenus[0]
      },
      clickOperate (operate) {
        this.currentOperate = operate
        if (operate.className === 'text') {
          if (operate.isShow === '') {
            operate.isShow = 'show'
          } else {
            operate.isShow = ''
          }
        }
      },
      backHome () {
        this.$router.go(-1)
      },
      clickButtonHis () {
        this.$router.push('/historyRecord')
        this.$store.commit('SET_historyData', this.hisData)
      },
      sendMessage (execute) {
        var obj = {}
        obj.controlForm = 'webApp'
        obj.data = [{m: execute.assetattrid, p: this.transData[execute.assetattrid].datatype, v: execute.sendText}]
        obj.tp = 21
        obj.ver = 1
        this.$store.dispatch('SendMessage', {wsTopic: this.currentTopic, data: obj})
        execute.sendText = null
      },
      clickImg (assetData) {
        this.currentAsset = assetData
        this.currentAttrs = assetData.attrs
        this.currentTopic = assetData.orgid + '/' + assetData.productid + '/' + assetData.serialnum
//        console.log(this.rtvalue[this.currentTopic])
//        console.log(this.currentAttrs)
//        console.log(this.currentAsset)
//        console.log(this.transData)
//        console.log(this.$store.dispatch)
//        var tempp = []
//        this.currentAttrs.map((att, attI, attarr) => {
//          var tem = {}
//          tem.name = this.transData[att.assetattrid] ? this.transData[att.assetattrid].description : ''
//          tem.unit = this.transData[att.assetattrid] ? this.transData[att.assetattrid].measureunitid : ''
//          tem.val = this.rtvalue[this.currentTopic] && this.rtvalue[this.currentTopic][att.assetattrid] ? this.rtvalue[this.currentTopic][att.assetattrid].v : 0
//          tempp.push(tem)
//        })
//        console.log(tempp)
//        var topic = assetData.orgid + '/' + assetData.productid + '/' + assetData.serialnum
//        var attrObj = {}
//        assetData.attrs.map((attr, attIndex, attArr) => {
//          attrObj[attr.assetattrid] = attr
//        })
//        var temp = []
//        for (var key in this.rtvalue[topic]) {
//          var tempOb = {}3
//          if (key !== '') {
//            tempOb.name = this.transData[key] ? this.transData[key].description : ''
//            tempOb.unit = this.transData[key] ? this.transData[key].measureunitid : ''
//            tempOb.val = this.rtvalue[topic][key].v
//            tempOb.rwType = attrObj[key] ? attrObj[key].rwtype : ''
//            temp.push(tempOb)
//          }
//        }
        this.currentAssetTitle = assetData.description
//        var tempArr = []
//        assetData.attrs.map((attrD, attrIndex, attrArr) => {
//          var tempobj = {}
//          tempobj.name = this.transData[attrD.assetattrid].description
//          tempobj.unit = this.transData[attrD.assetattrid].measureunitid
//          tempobj.rwType = attrD.rwtype
//          if (assetData.attrValue[attrD.assetattrid] == null) {
//            tempobj.val = 0
//          } else {
//            if (assetData.attrValue[attrD.assetattrid].v === 'false' || assetData.attrValue[attrD.assetattrid].v === 'true') {
//              tempobj.val = assetData.attrValue[attrD.assetattrid].v
//            } else {
//              tempobj.val = Math.ceil(assetData.attrValue[attrD.assetattrid].v)
//            }
//          }
//          tempArr.push(tempobj)
//        })
//        var tempAttrData = []
//        var tempSendData = []
//        temp.map((tempData, tempIndex, tempA) => {
//          if (tempData.rwType === 'R' || tempData.rwType === 'RO') {
//            tempAttrData.push(tempData)
//          } else if (tempData.rwType === 'W' || tempData.rwType === 'WO') {
//            tempSendData.push(tempData)
//          } else if (tempData.rwType === 'RW') {
//            tempAttrData.push(tempData)
//            tempSendData.push(tempData)
//          }
//        })
//        this.attrsData = tempAttrData
//        this.sendData = tempSendData
        var startTime = new Date(new Date().toLocaleDateString()).getTime()
        var endTime = new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1
        var historyObj = {}
        assetData.attrs.map((hisD, hisIndex, hisArr) => {
          axios.get(config.PMURL + '/api/query?start=' + startTime + '&end=' + endTime + '&m=sum:1h-avg-none:' + this.currentTopic + '.' + hisD.assetattrid + '{orgid=TELLHOW}')
              .then(pmArr => {
                var pmValueArr = []
                for (var key in pmArr.data[0].dps) {
                  pmValueArr.push(Math.ceil(pmArr.data[0].dps[key]))
                }
//                pmValueArr.push(assetData.description)
                pmValueArr.push(hisD.assetattrid)
                historyObj[hisD.assetattrid] = pmValueArr
//                historyObj.name = assetData.description
//                attrNameArr.push(hisD.assetattrid)
              })
        })
        setTimeout(() => {
          this.hisData = historyObj
        }, 400)
        this.$store.commit('SET_assetName', assetData.description)
      }
    },
    mounted: function () {
      this.submenus = this.floorData
//      console.log(this.buildData)
      for (var buildKey in this.buildData) {
        console.log(this.buildData[buildKey].info.description)
      }
      this.currentSubmen = this.submenus[0]
      var i = 10
      var j = 10
      this.submenus[0].assets.map((assetData, assetIndex, assetArr) => {
        if (assetData.coords == null) {
          i += 60
          j += 60
          assetData.coords = '{"top":' + j + ',"left":' + i + '}'
        }
        var point = JSON.parse(assetData.coords)
        assetData.point = point
      })
      var assetNum = 0
      this.floorData.map((asset, assetIndex, assetArr) => {
        assetNum += asset.assets.length
      })
      if (assetNum === 0) {
        this.attrsData = null
      } else {
        if (this.currentSubmen.assets.length === 0) {
          this.attrsData = null
        } else {
          this.clickImg(this.currentSubmen.assets[0])
        }
      }
      if (this.currentSubmen.assets.length === 0) {
        this.currentAssetTitle = null
      } else {
        this.currentAssetTitle = this.currentSubmen.assets[0].description
      }
      this.currentOperate = this.operates[0]
      this.clickOperate(this.operates[0])
    },
    watch: {
      currentOperate (newValue, oldValue) {
        if (newValue.showClassName === '') {
          newValue.showClassName = oldValue.showClassName
        } else {
          newValue.isShow = oldValue.isShow
        }
      }
    }
  }
</script>
<style scoped lang='scss'>
    @import '../assets/scss/common';

    * {
        margin: 0;
        padding: 0;
    }

    /* 设置滚动条的样式 */
    ::-webkit-scrollbar {
        width: 8px;
    }

    /* 滚动槽 */
    ::-webkit-scrollbar-track {
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
        border-radius: 10px;
    }

    /* 滚动条滑块 */
    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: rgba(0, 0, 0, 0.1);
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
    }

    ::-webkit-scrollbar-thumb:window-inactive {
        background: rgba(78, 132, 177, 0.4);
    }

    #main {
        display: flex;
        flex-direction: row;
        margin-top: 10px;
        background-color: #1f384f;
        .left {
            color: #2E8ECC;
            background-color: #1B3146;
            overflow-y: auto;
            & > p {
                padding: 10px 20px 10px 20px;
                margin-bottom: 50px;
                font-size: 20px;
                font-weight: 700;
                color: #F3F4F5;
                .item {
                    position: relative;
                    margin-top: -5px;
                    margin-left: 30px;
                    font-size: 18px;
                    color: #3097D9;
                }
                .item > i {
                    position: absolute;
                    width: 8px;
                    height: 8px;
                    right: -3px;
                    top: -4px;
                    background-color: red;
                    border-radius: 50%;
                }
            }
            .el-icon-arrow-left {
                margin-bottom: 15px;
                font-size: 16px;
                font-weight: 700;
                cursor: pointer;
                background: #1B3146;
            }
            ul {
                li {
                    list-style: none;
                    cursor: pointer;
                    padding: 15px 30px;
                }
                li:hover {
                    color: #fff;
                    background-color: #1E384E;
                }
                .currentClass {
                    color: #fff;
                    background-color: #204866;
                }
            }
        }
        .right {
            flex: 1;
            background-color: #1f384f;
            .breadcrumb {
                list-style: none;
                padding: 18px 15px 8px 15px;
                display: flex;
                flex-direction: row;
                justify-content: flex-start;
                border-radius: 4px;
                color: #337AB7;
                background-color: #1f384f;
                .el-icon-arrow-left {
                    font-size: 25px;
                    cursor: pointer;
                }
                span {
                    margin-top: -3px;
                }
                .title {
                    font-size: 20px;
                }
                .floor {
                    font-size: 20px;
                    color: #716B6B;
                }
                .floor::before {
                    content: '/';
                    padding: 0 5px;
                    color: #ccc;
                }
            }
            .clickOpreate {
                height: 40px;
                margin-bottom: 5px;
                padding-right: 30px;
                color: #337AB7;
                line-height: 40px;
                text-align: right;
                background-color: #1f384f;
                button {
                    margin-left: 5px;
                    padding: 4px;
                    font-size: 16px;
                    cursor: pointer;
                    border: none;
                    color: #00B3EE;
                    box-sizing: border-box;
                    background-color: #1f384f;
                }
                .currentOperateClass {
                    border: 1px solid #00B3EE;
                }
            }
            .show-area {
                position: relative;
                height: 70%;
                background-color: #1f384f;
                @include HLessXS {
                    height: 60%;
                }
                @include HMoreXSLessSM {
                    height: 65%;
                }
                @include HMoreSMLessMD {
                    height: 70%;
                }
                .showImg {
                    .imgSize {
                        width: 92%;
                        height: 100%;
                    }
                }

                .showTable {
                    padding: 15px 20px 20px 20px;
                    .table {
                        width: 100%;
                        color: #497DA8;
                        border-collapse: collapse;
                        border-spacing: 0;
                        padding: 0 0 0 10px;
                        thead {
                            tr {
                                background-color: #213B53;
                                text-align: left;
                                th {
                                    padding: 5px;
                                }
                            }
                        }
                        tbody {
                            tr {
                                text-align: left;
                                border-top: 1px solid #294864;
                                border-bottom: 1px solid #294864;
                                cursor: pointer;
                                td {
                                    padding: 5px;
                                }
                            }
                        }
                    }
                }
                .topic {
                    position: absolute;
                    left: 5px;
                    bottom: 5px;
                    color: #377DA8;
                }
                .PMIcon {
                    position: absolute;
                    width: 50px;
                    height: 50px;
                    z-index: 99999999999;
                    cursor: pointer;
                }
                .controlPanel {
                    position: absolute;
                    /*height: 500px;*/
                    min-width: 220px;
                    max-height: 500px;
                    right: 20px;
                    top: 30px;
                    z-index: 99999;
                    border: 1px solid #304B65;
                    background-color: #254159;
                    overflow-y: auto;
                    .title {
                        p {
                            font-size: 16px;
                            color: #329ce0;
                            height: 35px;
                            line-height: 35px;
                            padding-left: 15px;
                            border-bottom: 1px solid #294864;
                        }
                    }
                    ul {
                        list-style: none;
                        margin-top: 15px;
                        li {
                            list-style: none;
                            display: flex;
                            flex-direction: row;
                            justify-content: space-between;
                            padding: 5px 20px;
                            span {
                                font-size: 14px;
                                color: #fff;
                            }
                            .value {
                                margin-left: 40px;
                                color: #329CE0;
                            }
                        }
                    }
                    .control {
                        p {
                            font-size: 16px;
                            color: #329ce0;
                            height: 35px;
                            line-height: 35px;
                            padding-left: 15px;
                            border-bottom: 1px solid #294864;
                            margin-bottom: 10px;
                            button {
                                padding: 6px 15px 2px 15px;
                                color: #fff;
                                background-color: #31B0D5;
                                border: none;
                            }
                        }
                        p.history {
                            margin-bottom: 0px;
                            margin-top: 10px;
                        }
                        div {
                            padding: 1px 20px;
                            line-height: 25px;
                            font-size: 13px;
                            color: #fff;
                            span {
                                padding: 0 20px 0 0;
                            }
                            input {
                                float: right;
                                margin-right: 10px;
                                width: 50px;
                                height: 20px;
                                border: 1px solid #ffecec;
                                background-color: #254159;
                            }
                            button {
                                float: right;
                                padding: 6px 15px 2px 15px;
                                color: #fff;
                                border: none;
                                background-color: #31B0D5;
                            }
                        }
                    }
                }
            }
            .row {
                position: relative;
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                z-index: 999;
                div {
                    width: 23%;
                    padding: 30px 0 10px 0;
                    text-align: center;
                    border-bottom: 4px solid #329CE0;
                    background-color: #254159;
                    .number {
                        font-size: 60px;
                        font-family: Arial;
                    }
                }
            }
        }
    }
</style>
