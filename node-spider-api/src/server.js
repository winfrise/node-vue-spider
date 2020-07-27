const path = require("path")
const fs = require("fs")
const app = require('./app')

const config= {
  port: 8989
}





console.log(`listening on port ${config.port}`)

function server (routes) {

    app.use(async (ctx, next) => {
        if (ctx.url == '/favicon.ico') {
            return;
        }
        await next();
    })

    app.use(routes.routes());


    app.listen(config.port)
}

module.exports = server