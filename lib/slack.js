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
      list: channelsList	      
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
  function channelsList(callback) {
    request(url + "channels.list?token="+token,function(e,r,b){
      callback(JSON.parse(b)) 
    })
  }
}
