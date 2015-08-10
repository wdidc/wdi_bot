module.exports = function(){
  return {
    includes: function(range, key){
      for(var x = range.length; x >= 0; x--){
        if(range[x] == key){
          return true;
        }
      }
      return false;
    },

    serialize: function(object){
      var output = ""
      for( var key in object ){
        if( object.hasOwnProperty(key) ){
          output += "&" + key + "=" + object[key]
        }
      }
      return output;
    },

    capitalize: function(string){
      return string.charAt(0).toUpperCase() + string.slice(1);
    },

    sans_id: function(id, string){
      var regex = new RegExp("(<@)?" + id + ">?:?")
      return string.replace(regex, "");
    }
  }
}
