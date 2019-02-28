'use strict';


if (window.projModules === undefined) {
    window.projModules = {};
}

projModules.twitterSearchM = function () {

    var _extractTwitterIds = function () {
        chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
            console.log('sending message to insta');
            chrome.tabs.sendMessage(tabs[0].id, {action: "extracttwitterimages", tabid: tabs[0].id}, function (response) {});
        });
    };
    
    return {
        twitterSearch: function (srcimgdata) {
            console.log('doing twitter scrape and search');
            _extractTwitterIds();
        }
    };
}();