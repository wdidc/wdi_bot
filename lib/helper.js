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
      if(!string) return false;
      var regex = new RegExp("(<@)?" + id + ">?:?")
      return string.replace(regex, "");
    },

    seeds: function(){
      var seeds = require("../test/seeds"),
          output = [];
      for(var x = 0; x < seeds.length; x++){
        output[x] = {};
        keys = Object.keys(seeds[x]).sort();
        for(var k = 0; k < keys.length; k++){
          output[x][keys[k]] = seeds[x][keys[k]];
        }
      }
      return output;
    },

    get_time: function(string){
      string = string.match(/[0-9]{16}/);
      if(!string) return false;
      else return string[0].slice(0,10) + "." + string[0].substring(10);
    }
  }
}
