
const moment = require('moment')

const {
    findSourceList,
    findSourceCount,
    updateSource,
    findSourceByIdUid
} = require('../db/mysql.js')

/**
 * 文章列表
 */
exports.getSourceList = async (ctx) => {
    // const userInfo  = ctx.userInfo
    const userInfo =  {
        id: 15
    }
    const { pageSize = 20, pageNum=1, typeId = 0 } = ctx.request.body

    if (pageNum < 1) {
      pageNum = 1
    } 

    let res
    
    let sourceCount, totalPage, sourceList,
        isFirstPage, isLastPage, hasPreviousPage, hasNextPage;

    res = await findSourceCount({uid: userInfo.id})
        .then(result => {
            if (!result.length) {
                return [0, null]
            }
            return [result[0].count, null]
        })
        .catch(err =>  {
            return [null, err]
        })

    
    if (res[1]) {
        return ctx.body = {
            code: 20001,
            message: '异常错误'
        }
    }

    sourceCount = res[0]

    if (sourceCount === 0) {
        // TODO:
    }

    totalPage = Math.ceil(sourceCount/pageSize) || 1

    if (pageNum > totalPage) {
        pageNum = totalPage
    }

    
    await findSourceList({pageSize, pageNum, uid: userInfo.id})
        .then(result => {
            sourceList = result || []
        })
        .catch(err => {
            console.log(err.message)
            return ctx.body = {
                code: 20003,
                message: err.message
            }
        })

    
    isFirstPage = !!(pageNum === 1)
    isLastPage = !!(pageNum === totalPage)

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

    return ctx.body = {
        code: 20000,
        message: 'Success',
        data: {
            list: sourceList,
            pageSize,
            pageNum,
            isFirstPage,
            isLastPage,
            hasNextPage,
            hasPreviousPage,
            totalPage,
            totalRows: sourceCount
        }
    }

}

exports.postUpdateSource = async (ctx) => {
    const userInfo = ctx.userInfo
    const {id, title } = ctx.request.body

    let res = []

    res = await findSourceByIdUid({
            uid: userInfo.id,
            id
        })
        .then(result => {

            if (!result.length) {
                return [null, true]
            }
            return [true, null]
        })
        .catch(err => {
            console.log(err)
            return [null, err]
        })

    if (res[1]) {
        return ctx.body = {
            code: 20001,
            message: '异常错误'
        }
    }

    res = await updateSource({
        id,
        title
    })
        .then(res => {
            return [true, null]
        })
        .catch(err => {
            return [null, err]
        })

    if (res[1]) {
        return ctx.body = {
            code: 20001,
            message: res[1]
        }
    }

    return ctx.body = {
        code: 20000,
        message: '更新成功'
    }
}