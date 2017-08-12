<template>
    <div class='topClass'>
        <ul>
            <li v-for='submenu in submenus'>
                <div class='li_top'>
                    <span :class='[submenu.className]'></span>
                    <div>
                        <p class='title'>{{submenu.title}}</p>
                        <p class='unit'>(单位：{{submenu.unit}})</p>
                    </div>
                </div>
                <p class='number'>{{submenu.number}}</p>
                <div class='li_bottom'>
                    <div class='circle' :class='[submenu.classColor]'>
                        <p>{{submenu.num}}</p>
                        <p>{{submenu.numType}}</p>
                    </div>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
  export default {
    data () {
      return {
        submenus: [
          {
            className: 'el-icon-upload',
            classColor: 'oneCircle',
            title: '平台上线',
            unit: '天',
            number: 285,
            num: 98,
            numType: '设备总数'
          },
          {
            className: 'el-icon-date',
            classColor: 'twoCircle',
            title: '网路延迟',
            unit: 'MS',
            number: 50,
            num: 65,
            numType: '在线总数'
          },
          {
            className: 'el-icon-menu',
            classColor: 'threeCircle',
            title: '服务项目',
            unit: '位',
            number: 8,
            num: 33,
            numType: '离线数量'
          },
          {
            className: 'el-icon-information',
            classColor: 'fourCircle',
            title: '维护提醒',
            unit: '个',
            number: 0,
            num: 33,
            numType: '报警统计'
          }
        ]
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

    .topClass {
        background-color: #244059;
        color: #329CE0;
        margin-bottom: 15px;
        padding: 15px 0 50px 0;
        ul {
            display: flex;
            justify-content: space-around;
            list-style: none;
            li {
                p {
                    text-align: center;
                }
                p.number {
                    text-align: right;
                    padding-right: 30px;
                    font-size: 30px;
                    font-weight: 700;
                }
                .li_top {
                    display: flex;
                    span {
                        color: #329CE0;
                        font-size: 30px;
                        margin-right: 6px;
                    }
                    .title {
                        font-weight: 700;
                    }
                    .unit {
                        font-size: 12px;
                        text-align: center;
                    }
                }
                .li_bottom {
                    .circle {
                        margin-top: 20px;
                        text-align: center;
                        border: 8px solid #2FD164;
                        border-radius: 50%;
                        padding: 30px 18px;
                        @include HLessXS{
                            padding: 22px 0px;
                        }
                        @include HMoreXSLessSM{
                            padding: 25px 12px;
                        }
                        @include HMoreSMLessMD{
                            padding: 30px 18px;
                        }
                    }
                    .oneCircle{
                        border-color: #FF9A37;
                    }
                    .twoCircle{
                        border-color: #2FD164;
                    }
                    .threeCircle{
                        border-color: #A8A8A8;
                    }
                    .fourCircle{
                        border-color: #FF6D6D;
                    }
                }
            }
        }
    }
</style>
