// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: { urlContains: 'facebook.com' },
        }),
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {hostEquals: 'twitter.com'},
        }),
        new chrome.declarativeContent.PageStateMatcher({
          pageUrl: {urlContains: 'instagram.com'},
        }),
      ],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});


chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "updateUILogoText") {
   
  }
});


function onFacebookLogin() {
  let successURL = 'www.facebook.com/connect/login_success.html';

  chrome.storage.local.get('fb_access_token', function(data){
    let fb_access_token = data.fb_access_token;
    if(fb_access_token === undefined) {
      chrome.tabs.query({}, function(tabs) { // get all tabs from every window
        for (var i = 0; i < tabs.length; i++) {
          if (tabs[i].url.indexOf(successURL) !== -1) {
            // below you get string like this: access_token=...&expires_in=...
            var params = tabs[i].url.split('#')[1];
            console.log(tabs[i].url);

            // Todo : try replacing these with url params extract
            // Todo : implement access token expiry logic
            var accessToken = params.split('&')[0];
            console.log(accessToken);
            accessToken = accessToken.split('=')[1];
            chrome.tabs.remove(tabs[i].id);
            chrome.storage.local.set({'fb_access_token' : accessToken}, function(){
              chrome.runtime.sendMessage({action : 'hidefbloginlink'});
            });
          }
        }
      });
    }
  });
}

chrome.tabs.onUpdated.addListener(onFacebookLogin);