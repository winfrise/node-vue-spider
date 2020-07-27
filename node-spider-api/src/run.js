const app = require('./app')
const path = require('path')
const fs = require("fs")
const router = require('koa-router')()
 
// const routeDir = fs.readdirSync(path.join(__dirname, './routes'))


// routeDir.map(routePath => {
//   if (routePath !== '.DS_Store') {
//     const controller = require(path.join(__dirname, './routes/', routePath))
//     Object.keys(controller).forEach(key => {
//       let type = key
//       let path = controller[key].path
//       let fn = controller[key].fn
//       router[type](path, fn)
//     })
//   }
// })

app.use(async (ctx, next) => { // 设置 favicon
  if (ctx.url == '/favicon.ico') {
      return;
  }
  await next();
})


/**
 * Get port from environment and store in Express.
 */

var port =process.env.PORT || '3001'

app.listen(port)
