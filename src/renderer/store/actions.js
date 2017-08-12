/**
 * Created by 东风过境 on 2017/7/7.
 */
import opentsdb from '../utils/opentsdb.js'
import config from '../config/index'
export default {
  getTransData ({commit, state}, config) {
    opentsdb.getTransData(config).then(tmpDatas => {
      console.log(tmpDatas)
      // commit('SET_KWSHistoryData', {value: dataArr})
    })
  }
}