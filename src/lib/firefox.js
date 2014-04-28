/** version 4 **/

// Load Firefox based resources
var self          = require("sdk/self"),
    data          = self.data,
    sp            = require("sdk/simple-prefs"),
    Request       = require("sdk/request").Request,
    prefs         = sp.prefs,
    pageMod       = require("sdk/page-mod"),
    tabs          = require("sdk/tabs"),
    toolbarbutton = require("./toolbarbutton"),
    {Cc, Ci, Cu}  = require('chrome');
    
Cu.import("resource://gre/modules/Promise.jsm");
 
// Load overlay styles
require("./userstyles").load(data.url("overlay.css"));
//Install toolbar button
var button = toolbarbutton.ToolbarButton({
  id: "emailshortcuts",
  label: "Email Shortcuts",
  tooltiptext: "Shortcuts of Top Email Providers",
  insert: true,
  onCommand: function () {
    popup.show(button.object);
  },
  onClick: function () {
  }
});
if (self.loadReason == "install") {
  button.moveTo({
    toolbarID: "nav-bar", 
    insertbefore: "home-button", 
    forceMove: false
  });
}

// Load overlay styles
var workers = [], content_script_arr = [];
pageMod.PageMod({
  include: ["*"],
  contentScriptFile: data.url("./content_script/inject.js"),
  contentStyleFile : data.url("./content_script/inject.css"),
  onAttach: function(worker) {
    workers.push(worker);
    content_script_arr.forEach(function (arr) {
      worker.port.on(arr[0], arr[1]);
    })
  }
});

var popup = require("sdk/panel").Panel({
  width: 140,
  height: 140,
  contentURL: data.url("./popup/popup.html"),
  contentScriptFile: [data.url("./popup/popup.js")]
});

exports.storage = {
  read: function (id) {
    return (prefs[id] + "") || null;
  },
  write: function (id, data) {
    data = data + "";
    if (data === "true" || data === "false") {
      prefs[id] = data === "true" ? true : false;
    }
    else if (parseInt(data) === data) {
      prefs[id] = parseInt(data);
    }
    else {
      prefs[id] = data + "";
    }
  }
}

exports.popup = {
  send: function (id, data) {
    popup.port.emit(id, data);
  },
  receive: function (id, callback) {
    popup.port.on(id, callback);
  }
}

exports.tab = {
  open: function (url) {
    tabs.open(url);
  }
}

exports.version = function () {
  return self.version;
}

exports.window = require('sdk/window/utils').getMostRecentBrowserWindow();
exports.Promise = Promise;

/**************************************************************************************************/
var onCmd = function (url) {
  return function () {
    tabs.open(url);
  }
}
var onClk = function (url) {
  return function (e) {
    if (e.button == 1) {
      tabs.open({url: url, inBackground: true});
    }
  }
}

var icons = [
  {
    label: "Gmail",
    icon: "gmail",
    url: "https://mail.google.com/mail/"
  },
  {
    label: "Yahoo Mail",
    icon: "yahoo",
    url: "https://mail.yahoo.com/"
  },
  {
    label: "Live Mail",
    icon: "microsoft",
    url: "https://mail.live.com/"
  },
  {
    label: "AOL Mail",
    icon: "aol",
    url: 'https://mail.aol.com/'
  },
  {
    label: "iCloud Mail",
    icon: "icloud",
    url: 'https://www.icloud.com/#mail'
  },
  {
    label: "Mail.com",
    icon: "mail",
    url: 'http://www.mail.com/mail/'
  }
];
icons.forEach(function (obj) {
  var button;
  if (prefs[obj.icon]) {
    button = toolbarbutton.ToolbarButton({
      id: "igshortcuts-" + obj.icon,
      label: obj.label,
      image: data.url("toolbar/" + obj.icon + "-16.png"),
      onCommand: new onCmd(obj.url),
      onClick: new onClk(obj.url)
    });
  }
});
  
  
