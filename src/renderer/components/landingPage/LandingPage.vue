<template>
    <div id="wrapper" class='fullHeghtContent'>
        <div class='left'>
            <div class='top'>
                <landTop></landTop>
            </div>
            <div class='bottom'>
                <landBottom></landBottom>
            </div>
        </div>
        <div class='right'>
            <landRight></landRight>
        </div>
    </div>
</template>

<script>
    import landRight from './landRight'
    import landTop from './landTop'
    import landBottom from './landBottom'
    import axios from 'axios'
    import config from '../../config/index'
    export default {
      components: {landRight, landTop, landBottom},
      mounted () {
        axios.get(config.serverURL + '/docs/info?orgid=TELLHOW&page=1&rows=999999')
            .then(response => {
              var imgUrl = []
              response.data.entities.map((data, index, arr) => {
                imgUrl[data.docinfoid] = data
              })
              this.$store.commit('SET_imgUrlMap', imgUrl)
            })
        axios.get(config.serverURL + '/project?orgid=TELLHOW&page=1&rows=999999')
            .then(response => {
              response.data.data.content.map((mainData, index, arr) => {
                if (mainData.name !== '个人工程' && mainData.name !== '私人工程') {
                  this.$store.commit('SET_projectData', mainData)
                }
              })
            })
        axios.get(config.serverURL + '/asset/attribute?orgid=TELLHOW&page=1&rows=999999')
            .then(trans => {
              var attrids = []
              trans.data.data.content.map((transD, transI, arr) => {
                attrids[transD.assetattrid] = transD
              })
              this.$store.commit('SET_transData', attrids)
            })
      }
    }
</script>

<style scoped lang='scss'>
    @import '../../assets/scss/common';
    /* 设置滚动条的样式 */
    ::-webkit-scrollbar {
        width: 10px;
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
    #wrapper {
        display: flex;
        background-color: #1F384F;
        padding: 10px;
        .left {
            flex: 1;
            display: flex;
            flex-direction: column;
            height: 100%;
            .top {
                /*height: 100%;*/
            }
            .bottom {
                /*height: 100%;*/
                flex: 1;
            }
        }
        .right {
            height: 100%;
        }
    }
</style>
