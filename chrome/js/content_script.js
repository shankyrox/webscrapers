'use strict';

window.onload = function () {
    console.log('content script loadeddd');
}


// sender : Contains Id of the extension which sent the message 
// sendresponse : fn to called for response callback
chrome.runtime.onMessage.addListener(function (message, sender, sendresponse) {

    /* Message : uploadLogo
     * Action  : 1. Create a new dom input element of type='file' and click it automatically
     *           2. Whenever valid file chosen, read it and save info to local storage for that tab
     *           3. On info save success, send message to popup script to update ui
     */
    if (message.action === "uploadLogo") {

        /* Creates an `input[type="file]` */
        let fileChooser = document.createElement('input');
        fileChooser.type = 'file';
        fileChooser.accept = 'image/png, image/jpeg';

        fileChooser.addEventListener('change', function () {
            let file = fileChooser.files[0];
            if (file != undefined) {
                console.log("user uploaded this file. Send msg to bg script to save the file & load it as well");

                // ---- Reader start ----
                let reader = new FileReader();

                reader.onload = function () {
                    chrome.storage.local.get("logofiles", function (data) {
                        let logofiles = data.logofiles != undefined ? data.logofiles : {};
                        logofiles[message.tabid] = {
                            name: file.name,
                            imgdata: reader.result
                        };
                        console.log(logofiles);
                        chrome.storage.local.set({ "logofiles": logofiles }, function () {
                            chrome.runtime.sendMessage({ action: "updateui" });
                        });
                    });
                }

                reader.onerror = function (event) {
                    this.abort();
                    console.log("ERROR : error reading logo uploaded by user");
                }
                // ---- Reader end ----

                reader.readAsDataURL(file);
            }
        });

        fileChooser.click();
    }

    /* Message : extractfbimages
     * Action  : Scrolls to the bottom of the page & then parses javascript on the page to collect 
     *           the results
     */
    else if(message.action === "extractfbimages") {
        console.log('recieved message for fb');
        _autoscroll(0, message.tabid, _extractFbImgs);
    }

    /* Message : extractinstaimages
     * Action : Extracts profile links and image links to search results on instagram
     */
    else if(message.action === "extractinstaimages") {
        _extractInstaImages(message.tabid);
    }

    /* Message : extracttwitterimages
     * Action : Extract profile links and images from twitter
     */
    else if(message.action === "extracttwitterimages") {
        _autoscroll(0, message.tabid, _extractTwitterImages);
    }
});

function _extractTwitterImages(tabid) {
    let twitterbaseurl = "https://twitter.com";
    let profiles = [];
    let profile = {};

    $('a.ProfileCard-avatarLink').each(function () {
        let href = $(this).attr('href');
        let src = $(this).find('img.ProfileCard-avatarImage').first().attr('src');
        profile.profileLink = twitterbaseurl + href;
        profile.imgLink = src;
        profiles.push($.extend(true, {}, profile));
    });

     // Save the data to storage and send message to ui to update
     chrome.storage.local.get('twitterprofiles', function (data) {
        let twitterprofiles = data.twitterprofiles !== undefined ? data.twitterprofiles : {};
        twitterprofiles[tabid] = profiles;
        chrome.storage.local.set({'twitterprofiles': twitterprofiles}, function () {
            chrome.runtime.sendMessage({action: "updatetwitterui"});
        });
    });
}


/************************ Insta functions ****************************/
function _extractInstaImages(tabid) {
    let instabaseurl = "https://www.instagram.com";
    let profiles = [];
    let profile = {};

    $('div.fuqBx').find('a').each(function () {
        let href = $(this).attr('href');
        let src = $(this).find('img').first().attr('src');
        profile.profileLink = instabaseurl + href;
        profile.imgLink = src;
        profiles.push($.extend(true, {}, profile));
    });

     // Save the data to storage and send message to ui to update
     chrome.storage.local.get('instaprofiles', function (data) {
        let instaprofiles = data.instaprofiles !== undefined ? data.instaprofiles : {};
        instaprofiles[tabid] = profiles;
        chrome.storage.local.set({'instaprofiles': instaprofiles}, function () {
            chrome.runtime.sendMessage({action: "updateinstaui"});
        });
    });
}

/*********************** End Insta functions **************************/


/************************ FB functions ****************************/

/* This function scrolls at some interval until it reaches the bottom of page. 
 * last_scroll_ht : integer : used for mainting state
 * tabid : integer : used by function it calls once it succeeds
 */
function _autoscroll(last_scroll_ht, tabid, fn) {
    let curr_scroll_ht = document.body.scrollHeight;
    if(last_scroll_ht != curr_scroll_ht) {
        window.scrollTo(0, curr_scroll_ht);
        last_scroll_ht = curr_scroll_ht;
        window.setTimeout(_autoscroll.bind(null, last_scroll_ht, tabid, fn), 3000);
    }
    else {
        // at bottom of page
        fn(tabid);
    }
}


/* Parses fb page and extracts Facebook images and links to profile
 */
function _extractFbImgs(tabid) {
    let profiles = [];
    let profile = {};

    $('#initial_browse_result').find('a._2ial').each(function () {
        let href = $(this).attr('href');
        let src = $(this).find('img').first().attr('src');
        profile.profileLink = href;
        profile.imgLink = src;
        profiles.push($.extend(true, {}, profile));
    });

    // Save the data to storage and send message to ui to update
    chrome.storage.local.get('fbprofiles', function(data){
        let fbprofiles = data.fbprofiles != undefined ? data.fbprofiles : {};
        fbprofiles[tabid] = profiles;
        chrome.storage.local.set({'fbprofiles' : fbprofiles}, function(){;
            chrome.runtime.sendMessage({action: "updatefbui"});
        });
    });
}

/*********************** End FB functions **********************************/


/******************* Initialize FB SDK for calls ***********************/

// window.fbAsyncInit = function () {
//     FB.init({
//         appId: '347652066035953',
//         autoLogAppEvents: true,
//         xfbml: true,
//         version: 'v3.2'
//     });
// };



// (function (d, s, id) {
//     var js, fjs = d.getElementsByTagName(s)[0];
//     if (d.getElementById(id)) { return; }
//     js = d.createElement(s); js.id = id;
//     js.src = "https://connect.facebook.net/en_US/sdk.js";
//     fjs.parentNode.insertBefore(js, fjs);
// }(document, 'script', 'facebook-jssdk'));



// // FB login asking app for permission 
// var _fbLogin = function() {
//     console.log('starting fb login');
//     console.log(FB.login);
//     FB.login(function (response) {
//         if (response.authResponse) {
//             console.log('Welcome!  Fetching your information.... ');
//             FB.api('/me', function (response) {
//                 console.log('Good to see you, ' + response.name + '.');
//             });
//         } else {
//             console.log('User cancelled login or did not fully authorize.');
//         }
//     });
// }
/******************** End FB SDK init **********************************/
