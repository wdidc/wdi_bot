var request = require("request")
var h = require("./h")()
var env = require( "../env" )

module.exports = function(token){
  var base_url = "https://slack.com/api/";

  function get(api, opts, callback){
    var request_url = base_url + api + "?token=" + token;
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

  function notify( text ){
    get("chat.postMessage",
      {
        channel: env.private_group_id,
        as_user: true,
        text: text
      },
      function( response ){
        console.log( response );
      }
    )
  }

  return{
    get_username: get_username,
    get: get,
    notify: notify
  }

}
