var chrono = require("chrono-node");

module.exports = function(){
  var h = {}
  h.includes = function(range, key){
    for(var x = range.length; x >= 0; x--){
      if(range[x] == key){
        return true;
      }
    }
    return false;
  }

  h.serialize = function(object){
    var output = ""
    for( var key in object ){
      if( object.hasOwnProperty(key) ){
        output += "&" + key + "=" + object[key]
      }
    }
    return output;
  }

  h.capitalize = function(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  h.seeds = function(){
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
  }

  h.get_time = function(string){
    string = string.match(/[0-9]{16}/);
    if(!string) return false;
    else return string[0].slice(0,10) + "." + string[0].substring(10);
  }

  h.backtics = function(string){
    return "\n```\n" + string + "\n```\n";
  },

  h.mean = function(nums){
    var n, sum = 0, q = nums.length;
    for(n = q - 1; n >= 0; n--){
      sum += nums[n];
    }
    return Math.round((sum / q) * 10) / 10;
  }

  h.mode = function(nums){
    var n, i, q = nums.length, counter = [], greatest = 0;
    for(n = q - 1; n >= 0; n--){
      i = nums[n];
      if(!counter[i]) counter[i] = 0;
      counter[i]++;
      if(!counter[greatest] || counter[i] > counter[greatest]) greatest = i;
    }
    return [counter, greatest];
  }

  h.median = function(nums){
    var n, half, q = nums.length, nums = nums.sort();
    var half = Math.floor(q / 2);
    if(nums.length % 2) return nums[half];
    else return (nums[half - 1] + nums[half]) / 2.0;
  }

  h.variance = function(nums, mean){
    var n, q = nums.length, sum = 0;
    for(n = q - 1; n >= 0; n--){
      sum += Math.pow(nums[n] - mean, 2);
    }
    return Math.round(sum / (q - 1) * 10) / 10;
  }

  h.standardDeviation = function(variance){
    return Math.round(Math.sqrt(variance) * 10) / 10;
  }

  h.tally = function(nums){
    var quantities, variance, output = {};
    output.data = {};
    quantities = h.mode(nums);
    output.data.mean = h.mean(nums);
    output.data.mode = quantities[1];
    output.data.median = h.median(nums);
    output.data.var = h.variance(nums, output.data.mean);
    output.data.sDev = h.standardDeviation(output.data.var);
    output.quantities = quantities[0];
    return output;
  }

  h.each = function(set, callback){
    for(i = 0; i < set.length; i++){
      callback(set[i]);
    }
  }

  h.parseTime = function(string){
    var time, cron = "", c, v, vals, unit, time = {};
    if(/_/g.test(string)) return string.replace("_", "");
    vals = chrono.parse(string);
    if(!vals || vals.length == 0) return false
    else vals = vals[0].start;
    for(v in vals){
      for(unit in vals[v]){
        if(!time[unit]) time[unit] = vals[v][unit];
      }
    }
    return [time.second, time.minute, time.hour, time.day, "*", "*"].join(" ");
  }

  return h;
}()
