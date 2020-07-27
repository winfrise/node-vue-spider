const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')
const {timeout, moment, downloadImage} = require('./plugins/tools')
const methods = require('./methods')

const config = {
  savePath: path.join(__dirname, './download')
}

const headless = true

const startNum = 401
const endNum = 500

async function start (ctx) {
  console.log(ctx)

  let browser = await puppeteer.launch({headless, timeout: 0}) // 打开浏览器

  var page = await browser.newPage() // 打开一个新的页签
  page.setViewport({width: 1200, height: 800})

  // 生成图片存放目录
  if (!fs.existsSync(config.savePath)) {
    fs.mkdirSync(config.savePath)
  } 

  // 获取所有的照片页面地址
  let urls = await(async function (page) {

    for(let i = startNum; i <= endNum; i++) {
      // let searchPageUrl = `https://xhamster.com/photos/search/chinese+amateur+girl${i}#search` // 生成搜索页地址
      let searchPageUrl = `https://xhamster.com/photos/search/chinese+amateur+${i}#search`

      await methods.gotoPage(page, {url: searchPageUrl}) // 跳转到搜索页
      let photoPageUrl = await methods.getDomAttr(page, '.gallery-list .gallery-thumb__link', 'href') // 相册地址

      /**
       * 打开相册地址
       */
      await page.goto(photoPageUrl) 

      const galleryName = methods.getGalleryNameByUrl(photoPageUrl) // 相册名称
      const photoCount = await methods.getDomAttr(page, '.page-title__count', 'innerHTML')
      const totalPage = await methods.getDoms(page, '.gallery-section .xh-paginator-button:last-child', (pageItems) => {
        return pageItems.length > 0 ? pageItems[pageItems.length - 1].innerHTML : 0
      }) || 1

      // // 判断相册是否存在
      let folderPath = `${config.savePath}/${galleryName}(count${photoCount})`
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath)
      } else {
        console.log('相册已存在')
      }

      for (let j = 1; j <= totalPage; j++) {
        console.log(`第${j}页`)
        if (j != 1) {
          await methods.gotoPage(page, {url: `${photoPageUrl}/${j}`})
        }

          let imgArr = await page.evaluate(() => window.initials.photosGalleryModel.photos)
          console.log('imgArr', imgArr)
          imgArr.forEach(async item => {
            let imgSrc = item.imageURL
            console.log(`>>> 准备下载图片：${imgSrc}`);
            
            let fileNameArr = imgSrc.split('/')
            let fileName = fileNameArr[fileNameArr.length - 1]
      
      
            await downloadImage('', imgSrc,`${folderPath}/${fileName}` )
        })

      }



      // for (let j = 0; j < urls.length; j++) {
      //   let url = urls[j]
    
      //   console.log('photoPageLinkList', photoPageLinkList)
    
    
    

    
      //   for (let i = 0; i < photoPageLinkList.length; i++) {
      //     // let photoPage = await browser.newPage()
      //     // photoPage.setViewport({width: 1200, height: 800})
      //     let url = photoPageLinkList[i].href
      //     await page.goto(photoPageLinkList[i].href, {
      //       waitUntil: ['load'],
      //       timeout: 0,
      //     })
    
      //     let imgSrc = await page.evaluate(() => {
      //       return document.querySelector('.fotorama__active .fotorama__img').src
      //     })
    
      //     console.log(`>>> 准备下载图片：${imgSrc}`);
          
      //     let fileNameArr = imgSrc.split('/')
      //     let fileName = fileNameArr[fileNameArr.length - 1]
    
    
      //     downloadImage('', imgSrc,`${folderPath}/${fileName}` )
    
    
      //   }
    
      //   console.log("task finish")
      // }


    }

  })(page)

     
}
module.exports = start