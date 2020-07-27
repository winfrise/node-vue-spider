const axios = require('axios')
const fs = require('fs')
exports.timeout = (delay) => {
  return new Promise((resolve, reject) => {
      setTimeout(() => {
          try {
              resolve(1)
          } catch (e) {
              reject(0)
          }
      }, delay)
  })
}


  /**
   * [TimeTools description]
   * @param {[type]} timestamp  12312312312312
   * @param {[type]} formatStr Y年M月D日
   *
   * M: month 1~12
   * Y: year 2017
   * D: date 0 ~ 31
   */
  exports.moment = (formatStr, timestamp) => {
    let date = new Date(timestamp || new Date().getTime())

    let M = date.getMonth() + 1

    let Y = date.getFullYear()

    let D = date.getDate()

    let h = date.getHours()

    let m = date.getMinutes()

    let s = date.getSeconds()

    return formatStr.replace('M', M).replace('Y', Y).replace('D', D).replace('h', h).replace('m', m).replace('s', s)
}

exports.screenshotDOMElement = async function (page, opts = {}) {
  const padding = 'padding' in opts ? opts.padding : 0;
  const path = 'path' in opts ? opts.path : null;
  const selector = opts.selector;

  if (!selector)
      throw Error('Please provide a selector.');

  const rect = await page.evaluate(selector => {
      const element = document.querySelector(selector);
      if (!element)
          return null;
      const { x, y, width, height } = element.getBoundingClientRect();
      return { left: x, top: y, width, height, id: element.id };
  }, selector);

  if (!rect)
      throw Error(`Could not find element that matches selector: ${selector}.`);

  return await page.screenshot({
      path,
      clip: {
          x: rect.left - padding,
          y: rect.top - padding,
          width: rect.width + padding * 2,
          height: rect.height + padding * 2
      }
  });
}


exports.downloadImage  = async (referer, imageSrc, fileName) => {
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