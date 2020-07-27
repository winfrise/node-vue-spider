exports.getDetailPageBySearchPage = async ({searchPageUrl, page}) => {
  console.log(`>>> 正在打开search页: ${searchPageUrl}`)
  await page.goto(searchPageUrl, {timeout: 0, waitUntil: ['load']})

  return await page.evaluate(async () => {
    return document.querySelector('.gallery-list .gallery-thumb__link').href
  })

}

exports.gotoPage = async (page, {url}, waitUntil = 'load') => {
  await page.goto(url, {timeout: 0, waitUntil})
}

/**
 * 通过URL获取相册名称
 * @param {*} url 
 */
exports.getGalleryNameByUrl = (url) => {
  let arr = url.split('/')
  let lastPath = arr[arr.length-1]
  let arr2 = lastPath.split('-')
  arr2.pop()

  return arr2.join(' ')
}

exports.getDoms = async (page, selector, cb) => {
  return await page.$$eval(selector, cb)
}

exports.getDom = async (page, selector, cb) => {
  return await page.$eval(selector, cb)
}

exports.getDomAttr = async (page, selector, attr) => {
  let result = await page.evaluate(async (selector, attr) => {
    let dom = document.querySelector(selector)
    return dom[attr]
  }, selector, attr)
  return result
}