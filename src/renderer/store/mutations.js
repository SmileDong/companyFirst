import Vue from 'vue'
export default {
  SET_clickItemResponse (state, data) {
    state.clickItemResponse = data
  },
  SET_imgUrlMap (state, data) {
    state.imgUrlMap = data
  },
  SET_floorData (state, data) {
    state.floorData = data
  },
  SET_projectData (state, data) {
    state.projectData = data
  },
  SET_transData (state, data) {
    state.transData = data
  },
  SET_historyData (state, data) {
    state.historyData = data
  },
  SET_assetName (state, data) {
    state.assetName = data
  },
  SET_buildData (state, data) {
    state.buildData = data
  },
  SET_totalvalue_totalDataOfToday (state, data) {
    Vue.set(state.totalvalue[data.point.id].totalDataOfToday, 'total', data.total)
    Vue.set(state.totalvalue[data.point.id].totalDataOfToday, 'hours', data.hours)
  },
  SET_totalvalueDescByTotalDataOfToday (state, data) {
    state.totalvalueDescByTotalDataOfToday.push({id: data.point.id, total: data.total})
  }
}
