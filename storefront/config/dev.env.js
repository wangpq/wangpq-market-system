var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  BASE_URL: '"http://10.10.200.49:8083"',
  UPLOAD_FILE: '"http://resapi.busilinq.com/image/file/upload"', // 图片上传地址
  FILE_LOAD_URL: '"http://resapi.busilinq.com/image/"' //图片访问地址
})



