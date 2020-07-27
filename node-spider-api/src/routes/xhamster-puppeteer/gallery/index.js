const router = require('koa-router')()
const db = require('../../../tool/mysql')
/**
 * 添加相册
 */
router.post('/edit', async (ctx) => {
  let {galleryURL, galleryName, id} = ctx.request.body

  if (!galleryURL) {
    ctx.body = {
      code: 40001,
      message: 'url 不能为空',
      data: {}
    }
    return
  }

  if (id) {
    await db.query(`update galleries set galleryURL="${galleryURL}", galleryName="${galleryName}" where id="${id}"`)
  } else {
    await db.query(`INSERT INTO galleries (galleryURL, galleryName) VALUES ("${galleryURL}","${galleryName}")`);
  }

  ctx.body = {
    code: 20000,
    message: '添加成功',
    data: {}
  }
})

/**
 * 删除相册
 */
router.post('/delete', async (ctx) => {
  let {id} = ctx.request.body

  if (!id) {
    ctx.body = {
      code: 40001,
      message: 'id 不能为空',
      data: {}
    }
    return
  }

  let list = await db.query(`select * from galleries where id = ${id}`)

  if (!list.length) {
    ctx.body = {
      code: 50001,
      message: '该记录不存在',
      data: {}
    }
    return
  }

  db.query(`delete from galleries where id=${id}`)
  ctx.body = {
    code: 20000,
    message: '删除成功',
    data: {}
  }

})

router.get('/list', async (ctx) => {
  let {page, limit = 20} = ctx.request.query
  let startNum = limit * (page -1)

  let list = await db.query(`select * from galleries order by id DESC limit ${startNum},${limit}`)
  let total= (await db.query(`select COUNT(*) from galleries`))[0]["COUNT(*)"];

  ctx.body = {
    code: 20000,
    message: '',
    data: {
      list,
      total: total
    }
  }
})

router.get('/detail', async (ctx) => {
  let {id} = ctx.request.query
  let photoList = await db.query(`select * from galleryDetails where galleryId = ${id}`)
  let galleryInfo = (await db.query(`select * from galleries where id = ${id}`))[0]
  ctx.body = {
    code: 20000,
    message: 'success',
    data: {
      galleryInfo,
      photoList
    }
  }
})

module.exports = router