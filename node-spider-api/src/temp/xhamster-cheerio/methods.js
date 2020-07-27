const config = require('./config'),
      fs = require('fs'),
      cheerio = require('cheerio'),
      axios = require('axios');
const { resolve } = require('path');

let downloadPath = ''
module.exports = {
  // 获取页面
  async getPage (url) {
    return {
      res: await axios.get(url)
    }
  },
  // 获取当前页面的相册集 list(name, url)
  getAlbumList (page) {
    let list = []
    const $ = cheerio.load(page.res.data)
    $('#pins li a').children().each((index, item) => {
      let album = {
        name: item.attribs.alt, // 相册名称
        url: item.parent.attribs.href // 相册地址
      }
      list.push(album)
    })
    return list
  },
  // 获取相册中图片总数量
  getImageTotalNum (page) {
    let $ = cheerio.load(page.res.data)
    let $span = $('.pagenavi').find('a').find('span')
    let total = $span[$span.length - 2].children[0].data;
    return total
  },
  // 获取图片页面中 图片地址
  getImageSrc (page) {
    let $ = cheerio.load(page.res.data)
    let imageSrc = $('.main-image').find('img')[0].attribs.src
    return imageSrc
  },
  // 新建保存图片的文件夹
  mkdirSaveFolder () {
    if (!fs.existsSync(config.savePath)) {
      fs.mkdirSync(config.savePath)
      console.log(`主文件夹已生成：${config.savePath}`)
    } else {
      console.log(`主文件夹已存在：${config.savePath}`)
    }
  },
  // 下载图片到本地
   async downloadImage (album, imageSrc, fileName) {
     console.log(fileName)
    let headers = {
      Referer: album.url,
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
          setTimeout(() => {
            resolve()
          }, 1000)
        });
        writer.on("error", () => {
          console.log('upload fail')
          reject()
        });
      })
    })

    console.log(fileName)
  }
}
