var express = require('express')
var Enumerable = require('linq');
var bodyParser = require('body-parser');
var util = require('./util/util.js');
var MatchCenter = require("./MatchCenter.js");
var app = express()

// 创建 application/x-www-form-urlencoded 编码解析
var urlencodedParser = bodyParser.urlencoded({ extended: false })

var onlineTable={};
var usertable=[];

usertable.push({userid:'847975112',password:'123456'});
usertable.push({userid:'847975113',password:'123456'});
usertable.push({userid:'847975114',password:'123456'});
usertable.push({userid:'847975115',password:'123456'});

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.send('Hello World')
})

app.post('/login', urlencodedParser, function (req, res) {

    console.log(req.body);

    if(CheckUserLogined(req))
    {
        response = {
            state:200,
            credential:GetCreByUid(req.body.userid)
        };
        console.log(response);
        res.end(JSON.stringify(response));
        return;
    }

    Enumerable.from(usertable).forEach(function(u)
    {
        if(u.userid == req.body.userid && u.password == req.body.password)
        {
            var cre = util.NewGuid();

            response = {
                state:200,
                credential:cre
            };

            onlineTable[cre] = u.userid;

            console.log(response);
            res.end(JSON.stringify(response));
            return;
        }
    });

    response = {
        state:801
    };

    console.log(response);
    res.end(JSON.stringify(response));

    // 输出 JSON 格式
})

app.post('/startmatch', urlencodedParser, function (req, res) {


    for(var key in onlineTable) {
        if(onlineTable[key] == req.body.userid && key == req.body.credential)
        {
            response = {
                state:200,
                matchserveraddress:"192.168.70.6:20001"
            };
            MatchCenter.AddPlayerToMatchRoom(req.body.credential,onlineTable[key]);
            console.log(response);
            res.end(JSON.stringify(response));
            return;
        }
    }

    response = {
        state:801
    };

    console.log(response);
    res.end(JSON.stringify(response));

    // 输出 JSON 格式
});

function CheckUserLogined(req) {
    for(var key in onlineTable) {
        if(onlineTable[key] == req.body.userid)
        {
            return true;
        }
    }
    return false;
}

function GetCreByUid(userid) {
    for(var key in onlineTable) {
        if(onlineTable[key] ==userid)
        {
            return key;
        }
    }
    return "";
}



app.listen(3001);
