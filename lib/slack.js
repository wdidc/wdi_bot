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
    console.log("***Sending request to " + api + ": " + opts);
    request(request_url + opts, function(err, response, body){
      console.log("***Received " + response.statusCode + " response from " + api + ": " + body);
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

  function refresh_users(){
    get("groups.info",
      {channel: env.private_group_id},
      function( response ){
        process.env.admin_ids = response.group.members;
        console.log(process.env.admin_ids);
      }
    )
  }

  return{
    get_username: get_username,
    get: get,
    refresh_users: refresh_users
  }

}
