const moment = require('moment')
const fs = require('fs')
const path = require('path')

const mkdirFolder = (dirname) => {
  if (!fs.existsSync(dirname)) {
    console.log(1)
    if (mkdirFolder(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
    return false
  } else {
    return true
  }
}

exports.moment = moment

exports.mkdirFolder = mkdirFolder