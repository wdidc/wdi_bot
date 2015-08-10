module.exports = function(){
  return {
    includes: function(range, key){
      for(var x = range.length; x >= 0; x--){
        if(range[x] == key){
          return true
        }
      }
      return false
    },

    serialize: function(object){
      var output = ""
      for( var key in object ){
        if( object.hasOwnProperty(key) ){
          output += "&" + key + "=" + object[key]
        }
      }
      return output
    }
  }
}
