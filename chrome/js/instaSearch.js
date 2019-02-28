'use strict';

if (window.projModules === undefined) {
    window.projModules = {};
}

projModules.instaSearchM = function() {
    var _extractInstaIds = function() {
        chrome.tabs.query({active : true, currentWindow : true}, function(tabs) {
            console.log('sending message to insta');
            chrome.tabs.sendMessage(tabs[0].id, { action: "extractinstaimages", tabid: tabs[0].id }, function (response) {});
        });
    }

    return {

        // public properties
        instaSearch : function(srcimgdata) {
            console.log('doing insta search');
            _extractInstaIds();
        }
    }
}();
