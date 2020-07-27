const { fs,  path, KoaRouter } = require('../tool/require')


/**
 * 自动生成路由
 * @param {*} app - koa 实例
 * @param {*} pathArr  - 子路径合集
 * @param {*} prefixPath 
 * @param {*} basePath - 开始路径
 */

function routeEach({app, pathArr, prefixPath, basePath} = {}) {
  basePath = basePath || path.join(__dirname, '../routes')
  pathArr = pathArr || fs.readdirSync(basePath) // 同步读取 basePath 下的文件
  prefixPath = prefixPath  || '' // 

    let i, length = pathArr.length;
    for(i = 0; i<length; i++){
        if (pathArr[i] == '.DS_Store') {
            continue
        }
        let pathStr = path.join(basePath,`${prefixPath}/${pathArr[i]}`) // 拼接完整的路由文件路径

        if(!isExists(pathStr)) {   //检查是否有该文件或者目录  没有就继续下一个循环
            continue;
        }

        if(isDir(pathStr)) {        //检查是不是文件夹
            let arr = fs.readdirSync(pathStr) // 读取文件夹下的子文件
            routeEach({
              app, 
              pathArr: arr, 
              prefixPath:`${prefixPath}/${pathArr[i]}`, 
              basePath
            })
        }else {
            let str = "";
            if(pathArr[i] == 'index.js') {
                str = `${prefixPath}`;
            } else {
                str = `${prefixPath}/${pathArr[i].substring(0, pathArr[i].length - 3)}`;
            }
            const router = new KoaRouter()
            router.use(str, require(pathStr).routes(), router.allowedMethods())
            app.use(router.routes())
        }
    }
}

function isExists(path){
    if(fs.existsSync(path)) {
        return true;
    }
    return;
}

function isDir(path) {
    if(fs.existsSync(path) && fs.statSync(path).isDirectory()) {  //先判断存在不存在  再判断文件类型，判断是不是文件夹
        return true;
    }
    return false;
}

module.exports = routeEach;