var request = require("request");
var Message = require("./request");
var h = require("./helperMethods");
var WebSocket = require("ws");
var env = require( "../env" );

var base_url = "https://slack.com/api/";

function get(api, opts, callback){
  var request_url = base_url + api + "?token=" + env.token;
  if( typeof opts == "object" ){
    opts = h.serialize(opts)
  }else{
    opts = ""
  }
  console.log("***Sending request to " + api);
  request(request_url + opts, function(err, response, body){
    console.log("***Received " + response.statusCode + " response from " + api);
    body = JSON.parse(body);
    if(callback && body.ok){
      callback(body)
    }
  })
}

function getUsername(user_id, callback){
  get("users.info",
    {user: user_id},
    function( response ){
      callback(response.user.name)
    }
  )
}

module.exports = {
  get : get,

  onMessage: function(callback){
    request(
      base_url + "rtm.start?token=" + env.token,
      function(err,res,body){
        var ws = new WebSocket( JSON.parse( body ).url );
        ws.on( "message", function(m){
          var message = Message( JSON.parse(m) );
          if(!message) return;
          getUsername(message.user, function(username){
            message.username = username;
            console.log("***New message received");
            callback(message);
          });
        });
      }
    );
  },

  refresh_groups : function(){
    global.bot = {}
    get("groups.info",
      {channel: env.private_group_id},
      function( response ){
        global.bot.admin_ids = response.group.members;
        global.bot.private_group_name = response.group.name;
        global.bot.summon_admins = "<" + global.bot.admin_ids.join(">, <") + ">";
        console.log(global.bot)
      }
    );
    get("groups.info",
      {channel: env.public_group_id},
      function( response ){
        global.bot.public_group_name = response.group.name;
      }
    );
  }
}
