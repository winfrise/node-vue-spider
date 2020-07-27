const methods = require('./methods')

async function invokeMethod (page, methodName, params, callback)  {
  let result =  await methods[methodName](page, params)
  return callback ? invokeMethod(page, callback.methodName, Object.assign({}, callback.params, result), callback.callback) : result
}
module.exports = {
  invokeMethod
}