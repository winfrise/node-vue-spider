const { 
  findUserByToken,
  updateUserInfo
} = require('../db/mysql.js')

exports.getUserInfo = async ctx => {
  let token = ctx.request.header['x-token']

  if (!token) {
    return ctx.body = {
      code: 20401,
      message: ''
    }
  }

  await findUserByToken({token})
    .then(result => {
      if (!result.length) {
        return ctx.body = {
          code: 20001,
          message: ''
        }
      }
      let userInfo = result[0]
      delete userInfo.token
      return ctx.body = {
        code: 20000,
        message:'',
        data: {
          userInfo
        }
      }
    })
    .catch(err => {
      return ctx.body = {
        code: 20001,
        message: err.message
      }
    })

}

exports.updateUserInfo = async ctx => {
  const token = ctx.request.header['x-token']
  const userInfo = ctx.request.body || {}

  let hasKey = false
  for (let key in userInfo) {
    hasKey = true
    break
  }
  if (!hasKey) {
    return ctx.body = {
      code: 200003,
      message: ''
    }
  }

  await findUserByToken({token})
    .then(async result => {
      if (!result.length) {
        return ctx.body = {
          code: 20002,
          message: ''
        }
      }

      await updateUserInfo({userInfo, id: result[0].id})
        .then(() => {
          ctx.body = {
            code: 20000,
            message: 'success'
          }
        })
        .catch(err => {
          ctx.body = {
            code: 20004,
            message: err.message
          }
        })

    })
    .catch(err => {
      return ctx.body = {
        code: 20001,
        message: err.message
      }
    })
}