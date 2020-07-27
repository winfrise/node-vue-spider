const router = require('koa-router')()
const {puppeteer, path, fs} = require('../../tool/require')
const methods = require('../../tool/methods')

let {spiderConfig} = require('../../demo/demo1')
const searchSpiderConfig = require('../../demo/spiderConfig')

const downloadBasePath = path.join(__dirname, '../../download')

const headless = true

router.get('/', async (ctx) => {
  console.log(ctx.request.query)
  ctx.body = 'hello world'
})

router.post('/spider', async (ctx) => {
  let {start, end, url: linkTemp } = ctx.request.query

  let browser = await puppeteer.launch({headless, timeout: 0}) // 打开浏览器
  var page = await browser.newPage() // 打开一个新的页签
  page.setViewport({width: 1200, height: 800}) // 设置浏览器大小

  for (let i = start; i < end; i ++) {
    let link = linkTemp.replace(/\$\{(\S+)\}/g,($1, $2) =>{
      return i
    })

    await methods.gotoPage(page, {url: link})
    let photoLink = await methods.querySelector(page, {
      selector: '.gallery-list .gallery-thumb__link', 
      callback: (dom) => {
        return dom.href
      }
    })
    console.log(photoLink, 'photoLink')
    await spiderGallery(page, photoLink)
  }

})

router.post('/single', async (ctx) => {
  const {url} = ctx.request.query


  let browser = await puppeteer.launch({headless, timeout: 0}) // 打开浏览器
  var page = await browser.newPage() // 打开一个新的页签
  page.setViewport({width: 1200, height: 800}) // 设置浏览器大小

  await spiderGallery(page, url)

  console.log('task complete')
  ctx.body = 'hello world'

})

async function spiderGallery (page, url) {

  await methods.gotoPage(page, {url})

  let photoCount = await methods.querySelector(page, {
    selector: '.page-title__count',
    callback: (elem) => {
      return elem.innerHTML
    }
  })

  let totalPage = await methods.querySelectorAll(page, {
    selector: '.gallery-section .xh-paginator-button:last-child',
    callback: (pageItems) => {
      return pageItems.length > 0 ? pageItems[pageItems.length - 1].innerHTML : 1
    }
  })

  let galleryName = await methods.pageEvaluate(page, {
    callback: () => {
      let url = window.location.href
      let arr = url.split('/')
      let lastPath = arr[arr.length-1]
      let arr2 = lastPath.split('-')
      arr2.pop()
    
      return arr2.join(' ')
    }
  })

  // 判断相册是否存在
  let folderPath = `${downloadBasePath}/${galleryName}(count${photoCount})`

  function hasDir (folderPath) {
    return fs.existsSync(folderPath)
  }
  let indent = 1
  while (hasDir(folderPath)) {
    indent++
    folderPath = `${downloadBasePath}/${galleryName}[${indent}](count${photoCount})`
  }

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath)
  } else {
    console.log('相册已存在')
  }


  for (let j = 1; j <= totalPage; j++) {
    console.log(`第${j}页`)
    if (j != 1) {
      await methods.gotoPage(page, {url: `${url}/${j}`})
    }

      let imgArr = await methods.pageEvaluate(page, {callback: () => window.initials.photosGalleryModel.photos})
      console.log('imgArr', imgArr)
      imgArr.forEach(async item => {
        let imgSrc = item.imageURL
        console.log(`>>> 准备下载图片：${imgSrc}`);
        
        let fileNameArr = imgSrc.split('/')
        let fileName = fileNameArr[fileNameArr.length - 1]
  
  
        await methods.downloadImage(page, {
            referer: '',
            imageSrc: imgSrc,
            fileName: `${folderPath}/${fileName}` 
          })
    })

  }
}

module.exports = router