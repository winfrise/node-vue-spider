const Koa = require('koa');
const path = require('path')
const bodyParser = require('koa-bodyparser');

const views = require('koa-views')
const serve = require('koa-static')
const staticCache = require('koa-static-cache')

const app = new Koa()



// 配置静态资源加载中间件
app.use(serve(path.join(__dirname, '/static')))
// 缓存
app.use(staticCache(path.join(__dirname, './public'), { dynamic: true }, {
  maxAge: 365 * 24 * 60 * 60
}))
app.use(staticCache(path.join(__dirname, './images'), { dynamic: true }, {
  maxAge: 365 * 24 * 60 * 60
}))

// 配置服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, './views'), {
  // extension: 'ejs'
  map: {
    html: 'ejs'
  }
}))
app.use(bodyParser({ // 通过 post 请求接口时获取参数
  formLimit: '1mb'
}))

app.use(async (ctx, next)=> {
  ctx.set('Access-Control-Allow-Origin', '*');
  ctx.set('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , X-Token');
  ctx.set('Access-Control-Expose-Headers', 'X-Token')
  ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
  if (ctx.method == 'OPTIONS') {
    ctx.body = 200; 
  } else {
    await next();
  }
});

const routeEach = require('./core/routeEach');
routeEach({app})

//捕获node异常  不允许退出
process.on('uncaughtException', function (err) {
  console.log("api异常退出被捕获了");
  console.error(err.stack);
  console.log(`捕获的异常: ${err}\n`)
  console.log(`异常的来源: ${origin}`)
  console.log("Node NOT Exiting...");
});

module.exports = app
