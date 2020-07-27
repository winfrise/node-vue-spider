const path = require('path')

const config = {
  // 启动端口
  hostname: 'http://localhost:3000',
  port: 3000,
  // 数据库配置
  database: {
    DATABASE: 'nodesql',
    USERNAME: 'root',
    PASSWORD: 'root123',
    PORT: '3306',
    HOST: 'localhost'
  },
  staticPath: path.resolve(__dirname, '../public')
}

module.exports = config