const router = require('koa-router')()
const db = require('../../../tool/mysql')
const { spiderGalleryPhoto } = require('../../../common')
const {puppeteer, path, fs} = require('../../../tool/require')
/**
 * 添加相册
 */
router.post('/gallery-photo', async (ctx) => {
  const { id, headless = false } = ctx.request.body

  let row = (await db.query(`select * from galleries where id=${id}`))[0]

  if (!row) {
    ctx.body = {
      code: 50001,
      message: '相册不存在',
      data: {}
    }
    return
  }

  // if (!global.browser) {
    global.browser =  await puppeteer.launch({headless, timeout: 0}) // 打开浏览器
    global.page = await global.browser.newPage() // 打开一个新的页签
    global.page.setViewport({width: 1200, height: 800}) // 设置浏览器大小
  // }

  const {page} = global

  let {galleryName, galleryNameId, photoCount, photoList, author, publishTime} = await spiderGalleryPhoto(page, row.galleryURL)

  await db.query(`update galleries set galleryName="${galleryName}", galleryNameId=${galleryNameId}, photoCount=${photoCount}, author="${author}", publishTime="${publishTime}" where id=${id}`)

  let insertSql = `INSERT INTO galleryDetails (galleryId, img) VALUES`

  photoList.forEach((item, index) => {
    insertSql += `(${id}, "${item.imageURL}"),`
  })

  insertSql = insertSql.slice(0, insertSql.length - 1);
  await db.query(`delete from galleryDetails where galleryId=${id}`)
  await db.query(insertSql);

  ctx.body = {
    code: 20000,
    message: '成功',
    data: {}
  }
  
})

module.exports = router