var WaitingHall = require("./WaitingHall.js");
var MatchCenter = require("./MatchCenter.js");


// 加载http模块和url模块
var http = require("http");
var url = require('url');

var server = http.createServer(function(request, response) {
    // url请求参数{"name":"aty","age":26}
    var args = url.parse(request.url, true).query;

    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("<html>");
    response.write("<head>");
    response.write("<title>Hello World Page</title>");
    response.write("</head>");
    response.write("<body>");
    response.write("Hello World!");
    response.write("</body>");
    response.write("</html>");
    response.end();
});

server.listen(8999);

console.log("server is listening");