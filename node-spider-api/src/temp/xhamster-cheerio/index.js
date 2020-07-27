
const download = require('./start')
module.exports = {
  get: function (ctx) {
    download.start()
    // ctx.body = {
    //   code: 5022,
    //   message: '异常错误'
    // }
  }
}