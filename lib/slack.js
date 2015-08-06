var request = require("request")

module.exports = function(token){
  var url = "https://slack.com/api/"
  return {
    token: token,
    api: {
      test: apiTest
    },
    auth: {
      test: authTest	  
    },
    channels: {
      list: channelsList,
      info: channelsInfo
    }
  }
  function apiTest(callback) {
    request(url + "api.test?token="+token,function(e,r,b){
      callback(JSON.parse(b)) 
    })
  }
  function authTest(callback) {
    request(url + "auth.test?token="+token,function(e,r,b){
      callback(JSON.parse(b)) 
    })
  }
  function channelsList(callback, opts) {
    opts = opts || ""
    if( typeof opts == "object" ){
      opts = serialize(opts) 
    }
    request(url + "channels.list?token="+token + opts,function(e,r,b){
      callback(JSON.parse(b)) 
    })
  }
  function channelsInfo(callback, opts){
    opts = opts || ""
    if( typeof opts == "object" ){
      opts = serialize(opts) 
    }
    request(url + "channels.info?token="+token + opts,function(e,r,b){
      callback(JSON.parse(b)) 
    })
  }

  function serialize(o){
    var string = ""
    for( var key in o ){
      if( o.hasOwnProperty(key) ){
        string += "&" + key + "=" + o[key] 
      }
    } 
    return string
  }
}
