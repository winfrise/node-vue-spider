const { findUserCountByName, insertUser } = require('../db/mysql');
const md5 = require('md5')
const moment = require('moment');


/**
 * 新用户注册接口
 */
exports.postRegister = async ctx => {
    let { username, password, repeatPwd, avator } = ctx.request.body
    console.table(ctx.request.body)

    await findUserCountByName(username)
        .then(async (result) => {
            if (result[0].count >= 1) {
                ctx.body = {
                    code: 20001,
                    message: '用户已存在',
                    data: {}
                };
                return
            } 

            if (!username || !password) {
                ctx.body = {
                    code: 20002,
                    message: '用户名或密码不能为空',
                    data: {}
                }
                return
            }
            
            if (password !== repeatPwd || password.trim() === '') {
                ctx.body = {
                    code: 20003,
                    message: '两次输入的密码不一致',
                    data: {}
                };
                return
            } 

            await insertUser({
                username, 
                password: md5(password), 
                avator: '', 
                registerTime: moment().format('YYYY-MM-DD HH:mm:ss'),
                status: 1
            })
                .then(res => {
                    console.log('注册成功', res)
                    //注册成功
                    ctx.body = {
                        code: 20000,
                        message: '注册成功'
                    };
                })

            
        })
}