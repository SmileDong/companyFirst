/* eslint-disable no-undef */
import Paho from 'paho-client/src/mqttws31'
import config from '../../config'
import axios from 'axios'
import Vue from 'vue'
const state = {
  mqttClient: null,
  // 实时值
  rtvalue: [], // {topic: {''PM25:{}, 'ONOFF':{}}} // this.$store.state.MqttRTValue[topic][PM25]
  assets: []
}

const mutations = {
  SET_mqttClient (state, mqtt) {
    state.mqttClient = mqtt
  },
  SET_LastRTVALUE (state, {wsTopic, datas}) {
    Vue.set(state.rtvalue, wsTopic, datas)
    // console.log(datas)
  },
  SET_MqttRTVALUE (state, {wsTopic, data}) {
    // console.log(wsTopic, data)
    // state.rtvalue[wsTopic][data.m] = data
    Vue.set(state.rtvalue[wsTopic], data.m, data)
    // if ('TELLHOW/TH-S100L/ACCF23E1C8AD' === wsTopic) {
    // console.log(wsTopic, data.m, data.v)
    // }
  },
  SET_assets (state, assets) {
    // console.log(assets)
    state.assets = assets
  }
}

// /*
//  修正值
//  */
// function fixed (data, num) {
//   if (data) {
//     switch (data.p) {
//       case 1:
//         return data.v === '1' || data.v === 'true' ? true : false
//       case 2:
//         if (data.v === '-255' || data.v === -255) {
//           return 0
//         }
//         return parseFloat(data.v).toFixed(num ? num : 0)
//       case 3:
//         if (data.v === '-255' || data.v === -255) {
//           return 0
//         }
//         return parseInt(data.v)
//       default:
//         return data.v
//     }
//   } else {
//     return 0
//   }
// }

const actions = {
  /*
   连接
   */
  connMqttOverWs ({commit, state, dispatch}) {
    var clientid = 'web@' + '未知用户' + '@' + new Date().getTime() + '@' + Math.floor(Math.random() * 10000)
    var mqttClient = new Paho.MQTT.Client(config.mqttOverWsHost, config.mqttOverWsPort, '/mqtt', clientid)// 61623是ws连接的默认端口，可以在apollo中间件中进行配置(关于apollo的配置请参考：http://activemq.apache.org/apollo/documentation/user-manual.html)
    // set callback handlers
    mqttClient.onConnectionLost = function (responseObject) { // 连接丢失后的处理
      if (responseObject.errorCode !== 0) {
        // console.log('onConnectionLost:' + responseObject.errorMessage)
        try {
          setTimeout(() => {
            dispatch('connMqttOverWs')
          }, 1000)
        } catch (e) {
        }
      }
    }
    mqttClient.onMessageArrived = function (message) { // 消息接收成功后的处理
      // console.log('onMessageArrived:' + message.payloadString)
      var SendRT = JSON.parse(message.payloadString)
      SendRT.data.map(function (data, index, arr) {
        if (message.destinationName.indexOf('/COV')) {
          var wsTopic = message.destinationName.slice(0, message.destinationName.length - 4)
          // console.log(wsTopic)
          commit('SET_MqttRTVALUE', {wsTopic, data})
        }
      })
    }
    // connect the client
    mqttClient.connect({
      userName: 'wifi',
      password: '68008232',
      onSuccess: function () { // 连接成功后的处理
        // Once a connection has been made, make a subscription and send a message.
        // console.log('onConnectSuccess')
        state.assets.map((asset, index, arr) => {
          dispatch('subscribe', asset)
        })
      },
      onFailure: function () { // 连接成功后的处理
        // Once a connection has been made, make a subscription and send a message.
        // console.log('onConnectFailure')
        try {
          setTimeout(() => {
            dispatch('connMqttOverWs')
          }, 1000)
        } catch (e) {
        }
      },
      cleanSession: true
    })
    commit('SET_mqttClient', mqttClient)
  },
  /*
   查询设备并进行订阅
   */
  getAssets ({commit, state}, {rows, page, orgid, customerid, projectid, assetnum, assettype}) {
    var url = config.serverURL + '/asset?' + 'rows=' + rows + '&page=' + page + '&orgid=' + orgid + (customerid ? '&customerid=' + customerid : '') + (projectid ? '&projectid=' + projectid : '') + (assetnum ? '&assetnum=' + assetnum : '') + (assettype ? '&assettype=' + assettype : '')
    // console.log(url)
    return new Promise((resolve, reject) => {
      axios.get(url).then(reponse => {
        if (reponse.data.success) {
          // console.log(reponse.data)
          commit('SET_assets', reponse.data.data.content)
          resolve()
        }
      })
    })
  },
  /*
   获取点位的实时值, 此接口被getAssets调用， 不对外暴露
   */
  getRtValue ({commit, state}) {
    var url = config.lastTimeURL
    return new Promise((resolve, reject) => {
      axios.get(url).then(response => {
        for (var key in response.data) {
          commit('SET_LastRTVALUE', {wsTopic: key, datas: response.data[key]})
        }
        resolve()
      }).catch(reponse => {
      })
    })
  },
  /*
   根据给定资产创建subscribe
   */
  subscribe ({commit, state}, asset) {
    var wsTopic = asset.orgid + '/' + asset.productid + '/' + asset.serialnum // 获得新值
    // console.log('subscribe', wsTopic)
    state.mqttClient.subscribe(wsTopic + '/COV') // 订阅消息的主题
  },
  /*
   发送
   data: {"m": "PM25", p: 3, v: "2"}
   */
  SendMessage ({commit, state}, {wsTopic, data}) {
    console.log(wsTopic)
    console.log(data)
    state.mqttClient.send(wsTopic + '/SET', JSON.stringify(data), 1) // 发送消息
    // console.log('发送命令到：', wsTopic, '内容是：', data)
  },
  Init ({commit, state, dispatch}, data) {
    dispatch('getAssets', data).then((ddd) => {
      dispatch('getRtValue').then(() => {
        dispatch('connMqttOverWs')
      })
    })
  }
}

export default {
  state,
  mutations,
  actions
}
