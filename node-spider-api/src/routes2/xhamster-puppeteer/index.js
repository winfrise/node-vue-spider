
const postController = require('./post-controller')
let routerPath = 'xhamster-puppeteer/index'

const Vue = require('vue')
const renderer = require('vue-server-renderer').createRenderer()

module.exports = {
  post: {
    path: `/api/xhamster-puppeteer/index`,
    fn: postController
  },
  get:  {
    path: `/${routerPath}`,
    fn: async (ctx) => {
      return await ctx.render(routerPath)
    }
  }
}