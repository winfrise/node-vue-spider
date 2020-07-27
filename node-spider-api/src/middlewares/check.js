const {findUserByToken} = require('../db/mysql')

module.exports ={

  checkNotLogin: (ctx) => {
    if (ctx.session && ctx.session.user) {     
      ctx.redirect('/posts');
      return false;
    }
    return true;
  },

  checkLogin: async (ctx, next) => {
    let token = ctx.request.header['x-token']
    let res, err, userInfo

    res = await findUserByToken({token})
      .then(result => {
        if (!result.length) {
          return [null, true]
        }
        return [result[0], null]
      })
      .catch(err => {
        return [null, true]
      })

    if (err) {
      return ctx.body = {
        code: 20023,
        message: '用户信息已过期'
      }
    }

    userInfo = res[0]
    ctx.userInfo = userInfo
    
    return next()
  }
}
