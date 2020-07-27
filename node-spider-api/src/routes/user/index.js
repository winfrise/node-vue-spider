const router = require('koa-router')()
const db = require('../../tool/mysql')

let users =   {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

router.post('/login', async (ctx) => {
  let {username, password} = ctx.request.body


  ctx.body = {
    code: 20000,
    message: '登录成功',
    data: {
      token: 'admin-token'
    }
  }
})

router.get('/info', async (ctx) => {
  let {token} = ctx.request.query


  ctx.body = {
    code: 20000,
    message: '成功',
    data: users[token]
  }
})

module.exports = router