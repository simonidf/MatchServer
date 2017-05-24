/**
 * Created by simon on 2017/5/17.
 */
function S4()
{
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function NewGuid()
{
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


function SendCredentials(_credentials,cb) {
    var http = require('http');
    var querystring = require('querystring');

    var contents = querystring.stringify({
        credentials:_credentials
    });

    var options = {
        host: '127.0.0.1',
        port:30001,
        path: '/create_room_for_group',
        method: 'POST',

        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': contents.length
        }
    };

    var req = http.request(options, function(res){
        //res.setEncoding('uft8');
        res.on('data', function(data){
            console.log(data);
            cb(data);
        });
    });

    req.write(contents);
    req.end();  //不能漏掉，结束请求，否则服务器将不会收到信息。
}

function HttpPost() {
    var http = require('http');
    var querystring = require('querystring');

    var contents = querystring.stringify({
        name: 'joey',
        email: 'joey@joey.com',
        address: 'joey university'
    });

    var options = {
        host: 'www.joey.com',
        path: '/application/node/post.php',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': contents.length
        }
    };

    var req = http.request(options, function(res){
        res.setEncoding('uft8');
        res.on('data', function(data){
            console.log(data);
        });
    });

    req.write(contents);
    req.end();  //不能漏掉，结束请求，否则服务器将不会收到信息。
}

exports.NewGuid=NewGuid;
exports.SendCredentials=SendCredentials;