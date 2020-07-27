
const moment = require('moment')

const {
    findUserByToken,
    insertArticle,
    updateArticle,
    findArticleList,
    findAllArticleCount,
    findArticleById
} = require('../db/mysql.js')

const { checkLogin } = require('../middlewares/check.js')

/**
 * 创建文章
 */
exports.postCreateArticle = async (ctx) => {
    let token = ctx.request.header['x-token']

    let {
        id,
        title,
        content,
        tags,
        publishTime = moment().format('YYYY-MM-DD HH:mm:ss'),
    } = ctx.request.body

    let [userInfo, msg] = await findUserByToken({token})
        .then(result => {
            if (result.length) {
                return [result[0], null]
            }

            return [null, '请先登录']
        })
    console.log(userInfo)
    if (msg) {
        ctx.body = {
            code: 5088,
            message: msg
        }
        return
    }

    if (!title || !title.trim()) {
        ctx.body = {
            code: '401',
            message: '标题不能为空'
        }
        return
    }

    if (!content || !content.trim()) {
        ctx.body = {
            code: '401',
            message: '内容不能为空'
        }
        return
    }

    if  (id) {
        await updateArticle({
            id,
            title,
            content,
            tags,
            createTime: publishTime,
            publishTime
        })
            .then(res => {
                return ctx.body = {
                    code:20000,
                    message:'发表修改成功'
                }
            })
            .catch(e => {
                return ctx.body = {
                    code: 20003,
                    message: '失败'
                }
            })
    } else {
        await insertArticle({
            uid: userInfo.id,
            title,
            content,
            tags,
            createTime: publishTime,
            publishTime
        })
            .then(() => {
                return ctx.body = {
                    code:20000,
                    message:'发表文章成功'
                }
            }).catch((e) => {
                console.log('发布文章失败', e)
                return ctx.body = {
                    code: 20001,
                    message: '发表文章失败'
                }
            })
    }

}

/**
 * 文章列表
 */
exports.getArticleList = async (ctx) => {
    const { pageSize = 10, pageNum=1 } = ctx.request.body
    
    let allArticleCount, totalPage, pageArticleList,
        isFirstPage, isLastPage, hasPreviousPage, hasNextPage

    await findAllArticleCount()
        .then(result => {
            allArticleCount = result[0].count
        })
        .catch(err =>  {
            ctx.body = {
                code: 20001,
                message: '异常错误'
            }
        })

    if (allArticleCount === undefined) {
        ctx.body = {
            code: 20002,
            message: '异常错误'
        }
        return
    }

    if (!pageSize) {
        pageSize = 10
    }

    totalPage = Math.ceil(allArticleCount/pageSize)

    if (pageNum < 1) {
        pageNum = 1
    } 

    if (totalPage > 0 && pageNum > totalPage) {
        pageNum = totalPage
    }
    

    await findArticleList({pageSize, pageNum})
        .then(result => {
            pageArticleList = result
        })
        .catch(err => {
            ctx.body = {
                code: 20003,
                message: '异常错误'
            }
        })
    
    if (!pageArticleList) {
        return
    }

    isFirstPage = !!(pageNum === 1)
    isLastPage =  hasPreviousPage = !!(pageNum === totalPage)

    if (isFirstPage && isLastPage) {
        hasNextPage = false
        hasPreviousPage  = false
    } else if (isFirstPage) {
        hasNextPage = true
        hasPreviousPage = false
    } else if (isLastPage) {
        hasNextPage = false
        hasPreviousPage = true
    } else {
        hasNextPage = true
        hasPreviousPage = true
    }

    ctx.body = {
        code: 20000,
        message: 'Success',
        data: {
            list: pageArticleList,
            pageSize,
            pageNum,
            isFirstPage,
            isLastPage,
            hasNextPage,
            hasPreviousPage,
            totalPage,
            totalRows: allArticleCount
        }
    }

}

exports.getArticleDetail = async (ctx) => {
    let {id} = ctx.request.query

    if (!id) {
        return ctx.body = {
            code: 20401,
            message: ''
        }
    }

    await findArticleById(id)
        .then(result => {
            return ctx.body = {
                code: 20000,
                message: '',
                data: result[0] || {}
            }
        })
        .catch(e => {
            return ctx.body = {
                code: 20050,
                message: e.message
            }
        })
}

