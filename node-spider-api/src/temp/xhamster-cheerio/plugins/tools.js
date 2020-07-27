const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')

exports.mkdir = function (dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir)
    console.log(`文件夹已生成：${dir}`)
  } else {
    console.log(`文件夹已存在：${dir}`)
  }
}

exports.getPhotoList = async function (url) {
    let res = await axios.get(url)

    let list = []
    const $ = cheerio.load(res.data)

    console.log($)
    $('.gallery-list .image-thumb').each((index, item) => {
      console.log(item)
      // let photo = {
      //   name: '', // 相册名称
      //   url: item.ttribs.href // 相册地址
      // }
      // list.push(album)
    })
    return list
}

// 下载相册
exports.downloadAlbum = async album => {
  // 过滤相册名称中不符合命名规则的部分字符
  album.name = album.name.replace(/[:"\*\|]/g, '')
  // 判断相册是否存在
  let folderPath = `${config.savePath}/${album.name}`
  if (fs.existsSync(folderPath)) {
    console.log(`已存在：${album.name}`)
  } else {
    fs.mkdirSync(folderPath)
    console.log(`》》》 生成：${album.name}`)
    // 获取相册所在的页面
    let albumPage = await method.getPage(album.url)
    // 获取相册中图片总数
    let imageTotalNum = method.getImageTotalNum(albumPage)

    console.log(imageTotalNum, 'imageTotalNum')

    for (let j = 1; j <= imageTotalNum; j++) {
      // 获取图片所在页面
      console.log('j', j)
      let imagePage = await method.getPage(`${album.url}/${j}`)
      let imageSrc = method.getImageSrc(imagePage)
      await method.downloadImage(album, imageSrc, `${folderPath}/${j}.jpg`)
      console.log('j', j)
    }
  }
}

exports.getImageTotalNum = async (url) => {
  console.log(url)
  let res = await axios.get(url)
  let $ = cheerio.load(res.data)
  let $span = $('.pagenavi').find('a').find('span')
  let total = $span[$span.length - 2].children[0].data;
  return total
},

exports.getAlbumPic = async (url) => {
  let res = await axios.get(url)
  let $ = cheerio.load(res.data)
  let imgSrc = $('.main-image').find('img')[0].attribs.src
  return imgSrc
}

exports.downloadImage = async (referer, imageSrc, fileName) => {
 let headers = {
   Referer: referer,
   "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36"
 }

 await new Promise(async (resolve, reject) => {
   await axios({
     method: 'get',
     url: imageSrc,
     responseType: 'stream',
     headers
   }).then(function(response) {
     let writer = fs.createWriteStream(fileName)
     response.data.pipe(writer)
     writer.on("finish", () => {
        console.log(fileName, 'finish')
         resolve()
     });
     writer.on("error", () => {
       console.log('upload fail')
       reject()
     });
   })
 })
}