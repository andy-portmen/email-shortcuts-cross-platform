var storage, get, popup, window, Deferred, content_script, tab, version;
/*
Storage Items:
  "history"
  "from"
  "to"
  "isTextSelection"
  "isDblclick"
  "enableHistory"
  "numberHistoryItems"
*/
/********/
if (typeof require !== 'undefined') {
  var firefox = require("./firefox.js");
  storage = firefox.storage;
  get = firefox.get;
  popup = firefox.popup;
  window = firefox.window;
  content_script = firefox.content_script;
  tab = firefox.tab;
  version = firefox.version;
  Deferred = firefox.Promise.defer;
}
else {
  storage = _chrome.storage;
  get = _chrome.get;
  popup = _chrome.popup;
  content_script = _chrome.content_script;
  tab = _chrome.tab;
  version = _chrome.version;
  Deferred = task.Deferred;
}
/********/
if (storage.read("version") != version()) {
  storage.write("version", version());
  tab.open("http://add0n.com/email-shortcuts.html");
}

popup.receive('open-tab-request', function (type) {
  switch (type) {
  case 'gmail':
    tab.open('https://mail.google.com/mail/');
    break;
   case 'yahoo':
    tab.open('https://mail.yahoo.com/');
    break;
  case 'microsoft':
    tab.open('https://mail.live.com/');
    break;
  case 'aol':
    tab.open('https://mail.aol.com/');
    break;
  case 'icloud':
    tab.open('https://www.icloud.com/#mail');
    break;
  case 'mail':
    tab.open('http://www.mail.com/mail/');
    break;
  default:
    tab.open('');
    break;
}
});