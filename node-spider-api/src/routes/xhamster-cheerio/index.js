const router = require('koa-router')()
const { cheerio } = require('../../tool/require')

router.get('/', async (ctx) => {
  console.log(ctx.request.query)
  ctx.body = 'hello world'
})

router.post('/download', async (ctx) => {
  const {urls} = ctx.request.query

  if (typeof urls === 'string') {
    urls = [urls]
  }

  for (let i = 0, l = urls.length; i < l;i++) {
    cheerio.load()
  }
  ctx.body = 'hello world'
})

module.exports = router