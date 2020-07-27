const methods = require('../tool/methods')

async function spiderGalleryPhoto (page, url) {
  let photoCount = 0
  let totalPage = 0
  let galleryName = ''
  let galleryNameId = 0
  let photoList = []
  let author = ''
  let publishTime = ''

  await methods.gotoPage(page, {url}) // 打开页面地址

  photoCount = await methods.querySelector(page, { // 获取相册数量
    selector: '.page-title__count',
    callback: (elem) => {
      return elem.innerHTML
    }
  })

  totalPage = await methods.querySelectorAll(page, { // 获取相册总数
    selector: '.gallery-section .xh-paginator-button:last-child',
    callback: (pageItems) => {
      return pageItems.length > 0 ? pageItems[pageItems.length - 1].innerHTML : 1
    }
  })

  author = await methods.querySelector(page, {
    selector: '.entity-author-container__name span',
    callback: (elem) => {
      return elem.innerHTML
    }
  })

  publishTime = await methods.querySelectorAll(page, {
    selector: '.entity-info-container__date',
    callback: (elem) => {
      return elem.innerHTML
    }
  })

  let galleryInfo= await methods.pageEvaluate(page, { // 通过 url 获取相册名称
    callback: () => {
      let url = window.location.href
      let arr = url.split('/')
      let lastPath = arr[arr.length-1]
      let arr2 = lastPath.split('-')
      let = galleryNameId = arr2.pop()
    
      let galleryName = arr2.join(' ')
      return {
        galleryNameId,
        galleryName
      }
    }
  })

  galleryName = galleryInfo.galleryName
  galleryNameId = galleryInfo.galleryNameId


  for (let j = 1; j <= totalPage; j++) {
    console.log(`第${j}页`)
    if (j != 1) {
      await methods.gotoPage(page, {url: `${url}/${j}`}) // 打开当前页
    }

    let imgs = await methods.pageEvaluate(page, {callback: () => window.initials.photosGalleryModel.photos})
    photoList.push(...imgs)
  }
  return {
    photoCount,
    galleryName,
    galleryNameId,
    author,
    photoList,
    publishTime
  }
}

module.exports = spiderGalleryPhoto