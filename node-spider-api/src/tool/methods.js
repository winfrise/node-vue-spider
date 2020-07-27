const { axios, fs } = require('../tool/require')

async function querySelectorAll (page, {selector, callback}) {
  return await page.$$eval(selector, callback)
}

async function gotoPage (page, {url, waitUntil = 'load'})  { // domcontentloaded
  return  await page.goto(url, {timeout: 0, waitUntil})

}

async function querySelector (page, {selector, callback}){
  return await page.$eval(selector, callback)
}

async function getAlbumAllPic ({page}) {

}

async function pageEvaluate (page, {callback}) {
  return await page.evaluate(callback)
}

async function downloadImage (page, {referer, imageSrc, fileName})  {
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
         resolve()
      });
      writer.on("error", () => {
        console.log('upload fail', fileName)
        reject()
      });
    })
  })
 
 }

 module.exports = {
  querySelector,
  querySelectorAll,
  getAlbumAllPic,
  downloadImage,
  pageEvaluate,
  gotoPage
 }