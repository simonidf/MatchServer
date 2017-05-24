/**
 * Created by simon on 2017/5/17.
 */
require("./RuntimeData");
var util = require('./util/util.js');
const WebSocket = require('ws');

var playerTable = {};
var roomTable  = [];
var creToRoomDic = {};
var creToSessionDic = {};

var MatcheCenter = {};
MatcheCenter.ws = new WebSocket.Server({ port: 20001 });
MatcheCenter.ws.on('connection', function connection(session) {

    session.on('message', function incoming(message) {
        console.log('received: %s', message);
        var msgRoute = message.split('*')[0];
        var msgContent = message.split('*')[1];
        OnReceiveMsg(session,msgRoute,msgContent);
    });

    session.on('close',function close() {
        console.log("closed");

        var cre = GetCreBySession(session);
        if(cre!="")
        {
            room = creToRoomDic[cre];
            if(room!=null)
            {
                RoomRemoveUserBySession(room,session);
                BroadCastRoomInfo(room);
                if(room.users.length == 0)
                {
                    roomTable.remove(room);
                    console.log(roomTable.length);
                }
            }
            creToSessionDic[cre] = null;
            creToRoomDic[cre] = null;
        }
    });

    //session.send('something');
});

function OnReceiveMsg(session,route,cre) {
    if(route == "addtoroom")
    {
        if(playerTable[cre] != null)
        {
            playerTable[cre].session = session;
            playerTable[cre].cre = cre;
            var room = GetAvaliableRoom();
            room.users.push(playerTable[cre]);
            console.log("broadcast");

            creToSessionDic[cre] = session;
            creToRoomDic[cre] = room;

            for(var key in creToRoomDic) {
                console.log(creToRoomDic[key]);
            }

            BroadCastRoomInfo(room);


            if(room.users.length==1)
            {

                console.log(GetRoomCres(room))

                util.SendCredentials(GetRoomCres(room),function (data) {
                    BroadCastRoomGameServerInfo(room);
                    RemoveRoom(room);
                });
            }
        }
    }
}

function RemoveRoom(room) {
    for(var i=0;i<room.users.length;i++){
        var cre = GetCreBySession(room.users[i].session);
        if(cre!="")
        {
            creToRoomDic[cre] = null;
            creToSessionDic[cre] = null;
        }
    }
    roomTable.remove(room);
}

function AddPlayerToMatchRoom(credential,_userid) {
    playerTable[credential] = {userid:_userid};
}

function RemovePlayerFromMatchRoom(credential) {
    playerTable[credential] = null;
}

exports.AddPlayerToMatchRoom=AddPlayerToMatchRoom;
exports.RemovePlayerFromMatchRoom=RemovePlayerFromMatchRoom;

function GetCreBySession(session) {
    for(var key in creToSessionDic) {
        if(creToSessionDic[key] == session)
        {
            return key;
        }
    }
    return "";
}

function GetAvaliableRoom() {

    for(var i=0;i<roomTable.length;i++){
        console.log(roomTable[i].userNum);
        if(roomTable[i].users.length < 1)
        {
            return roomTable[i];
        }
    }

    var newRoom = {
        users:[]
    };

    roomTable.push(newRoom)

    return newRoom;
}

function BroadCastRoomInfo(room) {

    var userids = [];

    for(var i=0;i<room.users.length;i++){
        userids.push(room.users[i].userid);
    }


    var content = "matchinfo*" + JSON.stringify(userids);

    console.log(content);

    for(var i=0;i<room.users.length;i++){
        room.users[i].session.send(content);
    }
}

function BroadCastRoomGameServerInfo(room) {

    var content = "gameserverinfo*" + global.GameServerAddress;

    console.log(content);

    for(var i=0;i<room.users.length;i++){
        room.users[i].session.send(content);
    }
}

function GetRoomCres(room) {
    var cres = "";
    for(var i=0;i<room.users.length;i++){
        cres += room.users[i].cre;
        if(i<=room.users.length-1) {
            cres += ",";
        }

    }
    return cres;
}

function RoomRemoveUserBySession(room,session) {

    var indexToBeDeleted = -1;

    for(var i=0;i<room.users.length;i++){
        if(room.users[i].session == session)
        {
            indexToBeDeleted = i;
            break;
        }
    }

    if(indexToBeDeleted>=0)
    {
        room.users.remove(room.users[indexToBeDeleted]);
    }
}

Array.prototype.remove = function(b) {
    var a = this.indexOf(b);
    if (a >= 0) {
        this.splice(a, 1);
        return true;
    }
    return false;
};



