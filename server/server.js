const http = require('http');
const url = require('url');
const path = require('path');
const page = require('./page.js');
const route = require('./routes/route.js');

//引入配置文件
const config = require('../config.json');

// 创建http服务器
const server = http.createServer((req, res) => {
  // console.log(req.method);
  // 首先获取到请求的url路径
  let pathname = url.parse(req.url).pathname;
  // 设置default文件
  pathname = pathname === '/' ? '/index.html' : pathname;
  // 拼接出实际的需要返回的路径
  let pagepath = path.join(__dirname, '../client/', pathname);
  // 获取文件的后缀  为了区分接口和路径不能直接这样设置后缀  规定带有后缀的请求 视为page的直接请求 不带路径的请求视为接口的请求

  // let extname = path.extname(pagepath) ? path.extname(pagepath).slice(1) : 'default';

  let extname = path.extname(pagepath);

  // 这里需要分两种情况进行考虑

  if(extname){
    // 如果有后缀--page请求
    extname = extname.slice(1);
    page(res,pagepath,extname);
  }else{
    // 如果无后缀--接口请求
    let pathes = pathname.slice(1);
    let method = req.method.toLocaleLowerCase();
    if(method === 'get'){
      //get方式的请求
      route.get.call(res,req, pathes);
    }else{
      //默认的就是post方式的请求
      route.post.call(res, req, pathes);
    }
  }
})

server.listen(config.server.port, () => {
  console.log(`the server is listening on the port ${config.server.port}`);
})
