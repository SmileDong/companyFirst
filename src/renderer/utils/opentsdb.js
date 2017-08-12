/**
 * Created by kitty on 2017/5/23.
 */
import axios from 'axios'
export function getTransData (serverURL) {
  return new Promise((resolve, reject) => {
    axios.get(config.serverURL + '/asset/attribute?orgid=TELLHOW&page=1&rows=999999')
        .then(res => {
          console.log(res.data.data.content)
        })
  })
}

export default {
  getTransData
}
