var request = require("request")
var h = require("./helper")()
var env = require( "../env" )

module.exports = function(token){
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

  function get_username(user_id, callback){
    get("users.info",
      {user: user_id},
      function( response ){
        callback(response.user.name)
      }
    )
  }

  function refresh_groups(){
    global.bot = {}
    get("groups.info",
      {channel: env.private_group_id},
      function( response ){
        global.bot.admin_ids = response.group.members;
        global.bot.private_group_name = response.group.name;
        global.bot.summon_admins = "<@" + global.bot.admin_ids.join(">, <@") + ">";
        console.log(global.bot)
      }
    )
    get("groups.info",
      {channel: env.public_group_id},
      function( response ){
        global.bot.public_group_name = response.group.name;
      }
    )
  }

  return{
    get_username: get_username,
    get: get,
    refresh_groups: refresh_groups
  }

}
