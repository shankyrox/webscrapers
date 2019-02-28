'use strict';

if (window.projModules === undefined) {
    window.projModules = {};
}

projModules.fbSearchM = function () {
    // Private properties

    var _extractImageIds = function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { action: "extractfbimages", tabid: tabs[0].id }, function (response) {});
        });
    };


    return {
        // Public properties

        fbSearch: function (srcimgdata) {
            _extractImageIds();
            console.log('doing fb search');
        }
    }
}();