const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')
const {timeout, moment, downloadImage} = require('./plugins/tools')
const { getDetailPageBySearchPage } = require('./methods')

const config = {
  savePath: path.join(__dirname, './download')
}

const headless = false

const startNum = 300
const endNum = 305

async function start (ctx) {

  let browser = await puppeteer.launch({headless, timeout: 0}) // 打开浏览器

  var page = await browser.newPage() // 打开一个新的页签
  page.setViewport({width: 1200, height: 800})

  // 获取所有的照片页面地址
  let urls = await(async function (page) {
    let detailPageUrlArr = []

    for(let i = startNum; i <= endNum; i++) {
      let searchPageUrl = `https://xhamster.com/photos/search/chinese+amateur+girl${i}#search`
      let detailPageUrl = await getDetailPageBySearchPage({searchPageUrl, page})
      detailPageUrlArr.push(detailPageUrl)
    }

    console.log('detailPageUrlArr', detailPageUrlArr)
    return detailPageUrlArr
  })(page)


  for (let j = 0; j < urls.length; j++) {
    let url = urls[j]
    await page.goto(url)

    if (!fs.existsSync(config.savePath)) {
      fs.mkdirSync(config.savePath)
    } 


    let galleryName = (function (url) {
      let arr = url.split('/')
      let lastPath = arr[arr.length-1]
      let arr2 = lastPath.split('-')
      arr2.pop()

      return arr2.join(' ')
    })(url)

    let {photoPageLinkList, totalPage, photoCount} =  await page.evaluate(async () => {
      let thumbList = [...document.querySelectorAll('a.photo-thumb')]
      let list = thumbList.map((item) => {
        return ({
          href: item.href
        })
      })

      let photoCount = document.querySelector('.page-title__count').innerHTML

      let pageItems = document.querySelectorAll('.gallery-section .xh-paginator-button')
      let totalPage = pageItems.length > 0 ? pageItems[pageItems.length - 1].innerHTML : 0

      return {
        photoPageLinkList: list,
        totalPage,
        photoCount
      }
    })
    console.log('photoPageLinkList', photoPageLinkList)

    // 判断相册是否存在
    let folderPath = `${config.savePath}/${galleryName}(count${photoCount})`
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath)
    } 

    for (let m = 2; m <= totalPage; m++) {
      await page.goto(`${url}/${m}`, {timeout: 0})

      let {photoPageLinkList: list} =  await page.evaluate(async () => {
        let thumbList = [...document.querySelectorAll('a.photo-thumb')]
        let list = thumbList.map((item) => {
          return ({
            href: item.href
          })
        })
  
        return {
          photoPageLinkList: list
        }
      })
      photoPageLinkList.push(...list)
    }

    for (let i = 0; i < photoPageLinkList.length; i++) {
      // let photoPage = await browser.newPage()
      // photoPage.setViewport({width: 1200, height: 800})
      let url = photoPageLinkList[i].href
      await page.goto(photoPageLinkList[i].href, {
        waitUntil: ['load'],
        timeout: 0,
      })

      let imgSrc = await page.evaluate(() => {
        return document.querySelector('.fotorama__active .fotorama__img').src
      })

      console.log(`>>> 准备下载图片：${imgSrc}`);
      
      let fileNameArr = imgSrc.split('/')
      let fileName = fileNameArr[fileNameArr.length - 1]


      downloadImage('', imgSrc,`${folderPath}/${fileName}` )


    }

    console.log("task finish")
  }


     
}
module.exports = start