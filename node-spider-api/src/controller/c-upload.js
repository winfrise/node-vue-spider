const multer = require('@koa/multer');
const config = require('../config/default.js')

const { insertSource, findUserByToken } = require('../db/mysql');

const { moment, mkdirFolder } = require('../tools')
const savePath = `${config.staticPath}/uploads`

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, savePath)
  },
  filename: function (req, file, cb) {
    let today = moment().format('YYYY-MM-DD')

    mkdirFolder(`${savePath}/${today}`)

    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)

    const filename = file.originalname;
    let tempArr = filename.split('.')
    let fileType = tempArr[tempArr.length - 1]

    let fullName = `${file.fieldname}-${uniqueSuffix}.${fileType}`
    cb(null, `${today}/${fullName}`);
  }
})
const upload = multer({ storage})

exports.uploadSingleFile = upload.single('file')

exports.uploadSingleFileCallback = async (ctx) => {
    let token = ctx.request.header['x-token']
    let { path, filename, originalname} = ctx.file
    let filePath = `${config.hostname}/uploads/${filename}`

    let uid
    let err = await findUserByToken({token})
      .then(result => {
        if (!result.length) {
          return 'error'
        }
        uid = result[0].id
      })
      .catch(err => {
        return err
      })

    if (err) {
      console.log(err)
      return ctx.body = {
        code: 20004,
        message: err.message
      }
    }
    let pathSplit = path.split('/')
    filename = pathSplit[pathSplit.length - 1]

    await insertSource({
      filePath,
      title: originalname,
      uid,
      createTime: moment().format('YYYY-MM-DD HH:mm:ss')
    })
    .catch(err => {
      return err
    })
    
    ctx.body = {
      code: 20000,
      message: '图片上传成功',
      data: {
        filename: pathSplit[pathSplit.length - 1],
        path: `${config.hostname}/uploads/${filename}`
      }
    }
}

exports.uploadMultipleFiles = async (ctx) => {
  // upload.fields([
  //   {
  //     name: 'avatar',
  //     maxCount: 1
  //   },
  //   {
  //     name: 'boop',
  //     maxCount: 2
  //   }
  // ]),
  // ctx => {
  //   console.log('ctx.request.files', ctx.request.files);
  //   console.log('ctx.files', ctx.files);
  //   console.log('ctx.request.body', ctx.request.body);
  //   ctx.body = 'done';
  // }
}