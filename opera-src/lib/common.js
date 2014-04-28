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
  popup = firefox.popup;
  window = firefox.window;
  tab = firefox.tab;
  version = firefox.version;
}
else {
  storage = _chrome.storage;
  popup = _chrome.popup;
  tab = _chrome.tab;
  version = _chrome.version;
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