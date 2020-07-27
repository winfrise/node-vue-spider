const fs = require('fs')
const path = require('path')
const { mkdir, getPhotoList} = require('./plugins/tools')

const urls = require('./config/urls')

const config = {
  savePath: path.join(__dirname, './upload')
}
// 初始化方法
const start = async () => {
  mkdir(config.savePath) // 创建保存文件夹

  urls.forEach(async (url, index) => {
    let photoList = await getPhotoList(url)
  })

  // for (let i = 0; i < config.maxPage; i++) {
  //   let pageNum = i + 1
    
  //   console.log(`start  当前页码：${pageNum}`)

    // 获取照片列表

  //   // 根据页码获取页面对象
  //   let pageUrl = `${config.originPath}/page/${pageNum}`
  //   let albumList = await getAlbumList(pageUrl)

  //   // 下载相册
  //   for (let j = 0; j < albumList.length; j++) {
  //     // 下载相册内的图片
  //     let album = albumList[j]

  //     // 过滤相册名称中不符合命名规则的部分字符
  //     album.name = album.name.replace(/[:"\*\|]/g, '')
  //     // 判断相册是否存在
  //     let folderPath = `${config.savePath}/${album.name}`
  //     if (fs.existsSync(folderPath)) {
  //       console.log(`已存在：${album.name}`)
  //     } else {
  //       fs.mkdirSync(folderPath)
  //       console.log(`生成：${album.name}`)
  //     }

  //     // 获取图片数量
  //     // let totalNum = await getImageTotalNum(album.url)

  //     // for (let m = 0; m < totalNum; m++) {
  //     //   let imgSrc = await getAlbumPic(`${album.url}/${m}`)

  //     //   console.log('imgSrc', imgSrc)
  //     // }


  //     // for (let m = 1; m <= imgArr; m++) {
  //     //   // 获取图片所在页面
  //     //   await downloadImage(album.url, imageSrc, `${folderPath}/${j}.jpg`)
  //     // }

  //   }
  // }
}



module.exports = {
  start
}
