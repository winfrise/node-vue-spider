const { deleteUserTokenById, findUserByToken } = require('../db/mysql');

exports.postSignout = async (ctx) => {
  const { token } = ctx.request.header

  let userInfo
  await findUserByToken({token})
    .then(result => {

      if (result.length) {
        userInfo = result[0]
      } else {
        ctx.body = {
          code: 5021,
          message: '异常错误'
        }
      }
    })
    .catch((e) => {
      ctx.body = {
        code: 5022,
        message: '异常错误'
      }
    })

  if (!userInfo) {
    return
  }

  await deleteUserTokenById({id: userInfo.id})
    .then((result) => {
      console.log(result)
      ctx.body = {
        code: 500,
        message: '登出成功'
      }
    })
    .catch((e) => {
      ctx.body = {
        code: 500,
        message: '异常错误'
      }
    })
}