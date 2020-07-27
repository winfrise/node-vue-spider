const { 
    findUserByName, 
    updateUserTokenById 
} = require('../db/mysql.js')
const md5 = require('md5')
const { signToken } = require('../lib/token')
const moment = require('moment')

exports.postLogin = async ctx => {
    let { username, password } = ctx.request.body

    await findUserByName(username)
        .then(async result => {
            if (result.length && username === result[0]['username'] && md5(password) === result[0]['password']) {
                let  time = moment().format('YYYY-MM-DD HH:mm:ss')
                let token = signToken({ username, time })

                await updateUserTokenById({
                        token, 
                        lastLoginTime: time, 
                        id: result[0].id
                    })
                    .then(res => {
                        console.log(res)
                        ctx.set('X-Token', token)
                        ctx.body = {
                            code: 20000,
                            message: '登录成功'
                        }
                    })
                    .catch(err => {
                        ctx.body = {
                            code: 200,
                            message: err.message
                        }
                    })

                return
            } 

            ctx.body = {
                code: 500,
                message: '用户名或密码错误'
            }
        }).catch(err => {
            console.log(err)
        })

}