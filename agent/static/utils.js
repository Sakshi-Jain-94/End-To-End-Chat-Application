/* eslint-disable */
window.myChat = window.myChat || {};
window.myChat.utils = window.myChat.utils || {};

myChat.utils.getMainDomain = function (url) {
   url = url?url:location.origin;
   var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
   if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
   return match[2];
   }
   else {
       return null;
   }
};

myChat.utils.replaceBreakCharacter = function(str) {
    var strNew  = str.replace(/\n/g, "<br />");
    return strNew;
}

myChat.utils.replaceNewLineTabCharacter = function(str) {
    var strReplacedTab  = str.replace(/\n/g, "<br />");
    var finalString = strReplacedTab.replace(/\t/g, "\u00a0\u00a0\u00a0\u00a0");
    return finalString;
}

myChat.utils.checkNconvertTextTolink = function(text){
  var regex = /((http[s]?:\/\/(www\.)?|ftp:\/\/(www\.)?|www\.){1}[^\s]+)/g;
  var newtxt = text.replace(regex, function(match, g1, g2) {
    if(g1.indexOf("www.") == 0){
      return "<a target='_blank' rel='noopener' href='http://"+g1+"'>"+g1+"</a>" ;
    }
    return "<a target='_blank' rel='noopener' href='"+g1+"'>"+g1+"</a>"
  });

  return newtxt;
}

myChat.utils.isJson = function(item) {
    item = typeof item !== "string" ? JSON.stringify(item) : item;
    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return item;
    }
    return false;
};

myChat.utils.scrollToBottom = function () {
    var objDiv = document.getElementsByClassName("start-chat-box")[0];
    objDiv.scrollTop = objDiv.scrollHeight;
};

myChat.utils.getHeader = function () {
    var obj = {};
    obj["Accept"] = "application/json";
    obj['Content-Type'] = 'application/json';

    return obj;
};

myChat.debounce = function(func, wait, immediate){
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

myChat.utils.getTimeString = function(time){
  let timeString = "Just Now"
  let currentTime = new Date().getTime()
  let diff = parseInt((currentTime - new Date(time).getTime())/1000);
  if(diff < 60){
    return timeString
  }else if(diff < 3600){
    timeString = parseInt(diff/60) + " min ago"
  }else if(diff < 86400){
    if(diff % 3600 == 0){
      timeString = (diff / 3600) + " hr ago"
    }else{
        let minCount = diff % 3600;
        let hrCount = (diff - minCount)/3600;
        timeString =  hrCount + " hr " + parseInt(minCount/60) + " min ago"
    }
  }else{
    timeString = new Date(time).toDateString()
  }
  return timeString
}

myChat.utils.getQueryParams = function(qs) {
    qs = qs || location.href;
    var loc = qs.split("?")[1];
    if (loc) loc = loc.split("+").join(" ");
    var params = {},
        tokens, re = /[?&]?([^=]+)=([^&]*)/g;
    while (tokens = re.exec(loc)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }
    return params;
};

//Check the value is empty , not null ans not empty string
myChat.utils.isEmpty = function (value) {
    if (typeof value == "string") {
        value = value.trim();
    }
    if (typeof value == "object") {

        for (var prop in value) {
            if (value.hasOwnProperty(prop) && (value[prop] != '' && value[prop] != undefined)) {
                return false;
            }

        }
        return true;

    } else if (typeof value != "undefined" && value != '' && value != null && value != 'null') {
        return false;
    } else {
        return true;
    }
};
