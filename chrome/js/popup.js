'use strict';

var THRESHOLD_VAL = 0.15;

// adds '!' to encodeURIComponent
~function () {
  var orig = window.encodeURIComponent;
  window.encodeURIComponent = function (str) {
      // calls the original function, and adds your
      // functionality to it
      return orig.call(window, str).replace(/!/g, '%21');
  };
}();


/* On windows load :
 * 1.Check if file has been uploaded for this extension. If yes, load it
 *   else display empty placeholder
 * 2. Check if login to facebook link is needed
 * 3. Provide download link to Fb results if data set for this tab
 */
window.onload = function() {

  // update logo if set for this tab
  _updateLogoUI();

  console.log('heelow word');
  // update text according to website url
  chrome.tabs.query({active : true, currentWindow : true}, function(tabs){
    $('#span-website-name').text(_getSiteToSearch(tabs[0].url));
  });

  /* This part is used to check if login to fb is needed. Currently commenting this out as
   * this is not needed
   */
  // chrome.storage.local.get('fb_access_token', function (data) {
  //   chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
  //     let url = tabs[0].url;
  //     if (_getSiteToSearch(url)==='facebook' && data.fb_access_token === undefined) {
  //       let fbloginurl = `https://www.facebook.com/dialog/oauth?
  //                       client_id=347652066035953&
  //                       response_type=token&
  //                       scope=email&
  //                       redirect_uri=https://www.facebook.com/connect/login_success.html
  //                       `;
  //       $('#fblogininfo').attr('href', fbloginurl);
  //       $('#fblogininfo').attr('target', '_blank');
  //       $('#fblogininfo').text('Log in with Faceboook');
  //     }
  //     else {
  //       $('#fblogininfo').text("");
  //     }
  //   });
  // });

  // process 3.
  _updateTwitterUI();
  _updateFbUI();
  _updateInstaUI();
};


/* Register a click handler for "Upload logo" button. On click, this sends a mesasge to
 * content-script to invoke input type=files dialog
 */
$("#li-input-logo").click(function() {
  chrome.tabs.query({active : true, currentWindow: true}, function(tabs){
    console.log('tab id = ' + tabs[0].id);
    chrome.tabs.sendMessage(tabs[0].id, {action: "uploadLogo", tabid : tabs[0].id}, function(response){});
  });
});


/* Redirect to help page when user clicks on help link
 */
$('#a-how-it-works').click(function() {
  chrome.tabs.create({url : "https://www.google.com"});
});


chrome.runtime.onMessage.addListener(function(message, sender, sendresponse) {

  /* Message : updateui
   * Action : Update the UI with logo name and logo image snapshot
   */
  if (message.action === "updateui") {
    _updateLogoUI();
  }

  /* Message : hidefbloginlink
   * Action  : Signifies that fb access token has been set. Hide fb login link
   */
  else if(message.action === "hidefbloginlink") {
    $('#fblogininfo').text("");
  }

  /* Message : updatefbui
   * Action : Message received from fb that search complete. Compare the search results with src image
   *          & display download link
   */
  else if(message.action === "updatefbui"){
    _updateFbUI();
  }

  /* Message : updateinstaui
   * Action : Message received from insta that search complete. Compare the search results.
   */
  else if(message.action === "updateinstaui") {
    _updateInstaUI();
  }

  /* Message : updatetwitterui
   * Action : Message received from twitter. Scrape complete. 
   */
  else if(message.action === "updatetwitterui") {
    _updateTwitterUI();
  }
});


$("#startSearch").click(function () {

  //Input validation
  var inputCode = $('#li-input-code').val();

  chrome.storage.local.get("logofiles", function(data){
    let logofiles = data.logofiles != undefined ? data.logofiles : {};
    chrome.tabs.query({active : true, currentWindow : true}, function(tabs){
      let tabid = tabs[0].id;
      let url = tabs[0].url;
      let imgdata = undefined;
      if(logofiles.hasOwnProperty(tabid)) {
        imgdata = logofiles[tabid].imgdata;
      }

      if(imgdata === undefined || imgdata == "") {
        alert('Error in reading in logo. Please upload logo and then try again');
      }
      else {
        // Input validation succeeded.
        //$('.loader-with-text').show();
        $('body').addClass('loading');
        //$('#a-download-csv-link').text('');
        //$('#a-download-json-link').text('');

        // Search on required platform
        let site = _getSiteToSearch(url);
        searchMapper[site](imgdata);
      }
    });
  });
});

/* Register action for Download CSV button */
$("#btn-download-csv").click(function() {
  $("#a-download-csv-link").click();
});


/* Parameters : url -> complete url of the current tab of the extension
 * Return : string for searchMapper depending on website. 'undefined' is 
 *          returned if it is not a supported host
 */
function _getSiteToSearch(url) {
  let urlobj = new URL(url);
  switch (urlobj.hostname) {
    case "twitter.com": return 'Twitter';
    case "www.facebook.com": return 'Facebook';
    case "www.instagram.com": return "Instagram";
    default: return 'undefined';
  }
}


/* Map of functions to call dending on host website
 */
var searchMapper = {
  'Twitter' : projModules.twitterSearchM.twitterSearch, //twitterSearch,
  'Facebook' : projModules.fbSearchM.fbSearch,
  'Instagram' : projModules.instaSearchM.instaSearch,
  'undefined' : function() {
    alert('This website is not supported currently');
  }
}


/* Utility to function to check if logo is uploaded for current tab. 
 * If yes, display data corresponding to it in UI
 */
function _updateLogoUI() {
  chrome.storage.local.get('logofiles', function(data){
    var logofiles = data.logofiles != undefined ? data.logofiles : {};
    chrome.tabs.query({active : true, currentWindow : true}, function(tabs){
      let tabid = tabs[0].id;
      if(logofiles.hasOwnProperty(tabid)) {
        $('#li-button-text').text(logofiles[tabid].name);
        $('#li-button-text').css('color', 'black')
        $("#li-uploaded-logo").attr('src', logofiles[tabid].imgdata);
      }
      else {
        $('#li-button-text').text("empty");
        $('#li-button-text').css('color', 'gray')
        $("#li-uploaded-log").attr('src', "images/logo_placeholder.png");
      }
    });
  });
}

/* Populate UI with Twitter search results
 */

function _updateTwitterUI() {
  chrome.storage.local.get(['twitterprofiles', 'logofiles'], function (data) {
    let twitterprofiles = data.twitterprofiles != undefined ? data.twitterprofiles : {};
    let logofiles = data.logofiles != undefined ? data.logofiles : {};

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let tabid = tabs[0].id;
      if (twitterprofiles.hasOwnProperty(tabid) && logofiles.hasOwnProperty(tabid)) {
        _parseSearchResults(logofiles[tabid].imgdata, twitterprofiles[tabid]);
      }
    });
  });
}


/* Populate UI with insta search results
 */
function _updateInstaUI() {
  chrome.storage.local.get(['instaprofiles', 'logofiles'], function (data) {
    let instaprofiles = data.instaprofiles != undefined ? data.instaprofiles : {};
    let logofiles = data.logofiles != undefined ? data.logofiles : {};

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      let tabid = tabs[0].id;
      if (instaprofiles.hasOwnProperty(tabid) && logofiles.hasOwnProperty(tabid)) {
        _parseSearchResults(logofiles[tabid].imgdata, instaprofiles[tabid]);
      }
    });
  });
}


/** Utility method which checks if fbprofiles are set in local storage for
 * current tab. If yes, calls _parseSearchResults() for further processing
 * 
 * @returns {void}
 */
function _updateFbUI() {
  chrome.storage.local.get(['fbprofiles', 'logofiles'], function(data){
    let fbprofiles = data.fbprofiles != undefined ? data.fbprofiles : {};
    let logofiles = data.logofiles != undefined ? data.logofiles : {};

    chrome.tabs.query({active : true, currentWindow : true}, function(tabs){
      let tabid = tabs[0].id;
      if(fbprofiles.hasOwnProperty(tabid) && logofiles.hasOwnProperty(tabid)) {
        _parseSearchResults(logofiles[tabid].imgdata, fbprofiles[tabid]);
      }
    });
  });
}

/* Parameters : 
 *    srcImgData : string representing uploaded logo as base64
 *    profiles : List of objects. Each object has two keys - profileLink & imgLink
 */
function _parseSearchResults(srcImgData, profiles) {
  
  // create src image element
  let srcImg = document.createElement("img");
  srcImg.crossOrigin = 'Anonymous';
  srcImg.src = srcImgData; 

  // extract hash value of src image
  let srcImgHash = simi.hash(srcImg);

  let jsonDump = {
    srcImgData : srcImgData,
    matchImgs : [],
    otherImgs : []
  };
  let imgInfo = {};

  let csv = "Profile Link\n";

  var Parr = [];

  profiles.forEach(function (profile) {
    var P = $.Deferred();
    Parr.push(P);

    var queryImg = document.createElement("img");
    queryImg.crossOrigin = 'Anonymous';
    queryImg.srcImgHash = srcImgHash;
    queryImg.profileLink = profile.profileLink;
    queryImg.P = P;

    queryImg.onload = function () {
      // compare image with source image
      var x = simi.compare(this.srcImgHash, this);

      // append to csv
      if(x<THRESHOLD_VAL) {
       csv += this.profileLink + '\n';
      }

      // save to JSON Dump
      imgInfo.profileLink = this.profileLink;
      imgInfo.matchScore = x;
      imgInfo.imgSrc = this.src;
      if (x <= THRESHOLD_VAL)
        jsonDump.matchImgs.push($.extend(true, {}, imgInfo));
      else {
        jsonDump.otherImgs.push($.extend(true, {}, imgInfo));
      }

      // resolve promise
      this.P.resolve();
    }

    if(profile.hasOwnProperty('imgLink'))
      queryImg.src = profile.imgLink;
    else {
      P.resolve();
    }
  });

  $.when.apply($, Parr).then(function() {
    //$('.loader-with-text').hide();
    $("body").removeClass('loading');

    let downloadLink = $('#a-download-csv-link');
    downloadLink.attr("href", 'data:text/csv;charset=utf-8,' + encodeURI(csv));
    downloadLink.attr("target", '_blank');
    downloadLink.attr('download', 'people.csv');
    //downloadLink.text('Download csv');

    $("#btn-download-csv").prop('disabled', false);

    /** To enable download json link */
    //let downloadJsonLink = $('#a-download-json-link');
    //downloadJsonLink.attr('href', 'data:text/json;charset=utf-8,'+encodeURIComponent(JSON.stringify(jsonDump)));
    //downloadJsonLink.attr('target', '_blank');
    //downloadJsonLink.attr('download', 'people.json');
    //downloadJsonLink.text('Download json');
  });
}


// Currently non-functional. Function to search on twitter using api
function twitterSearch(trademarkName, srcImgData) {

  // Twitter Oauth consts
  const consumerSecret = "KKoq11lkMNT0o3XjhuABrDkRw1ryEIQ4szEC7wnxlLM9lwCzHY"
  const tokenSecret = "Vhdn5keRVTJPtT6YGZ0TcnYeZ1ktOz5YsMp2T6iKghJVB"

  let parameters = {
    oauth_consumer_key: "4LrnYfjDGwQL7yiwAVgNX6pg8",
    oauth_nonce: "",      /*Generate any random string : oauth.nonce(32); */
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: "",
    oauth_token: "770358488941809665-K2jOP3cExgyEONrqc3MO6JwxnKsYboT",
    oauth_version: "1.0",
    page : 1,
    count : 20,
    q : ""          // query to search
  }

  // Make a twitter call to search
  const twitterBaseSearchUrl = "https://api.twitter.com/1.1/users/search.json"
  const method = "GET"

  parameters.oauth_timestamp = (Math.floor(new Date().getTime() / 1000)).toString();
  parameters.oauth_nonce = parameters.oauth_timestamp;
  parameters.q = trademarkName;
  console.log(parameters);

  let oauthEncSign = oauthSignature.generate(method, twitterBaseSearchUrl, parameters, consumerSecret, tokenSecret);
  // let oauthEncSign2 = getOauthSignature(method, twitterBaseSearchUrl, parameters, consumerSecret, tokenSecret);
  // console.log(`signature mine = ${oauthEncSign2}`);

  let jqXHR = $.ajax({
    url : twitterBaseSearchUrl,
    type : "GET",
    data : {
      q : parameters.q,
      page : parameters.page,
      count : parameters.count
    },
    beforeSend : function(xhr) {
      let authHeader = 'OAuth ' +
      `oauth_consumer_key="${parameters.oauth_consumer_key}",` +
      `oauth_token="${parameters.oauth_token}",` +
      `oauth_signature_method="HMAC-SHA1",` +
      `oauth_timestamp="${parameters.oauth_timestamp}",` +
      `oauth_nonce="${parameters.oauth_nonce}",` +
      `oauth_version="1.0",` +
      `oauth_signature="${oauthEncSign}"`;
      console.log("auth header = " + authHeader);
      xhr.setRequestHeader("Authorization", authHeader);
    },

    // On success search
    success : function(response, textStatus, jqXHR) {
      console.log(response);

      const twitterHome = "https://twitter.com/";
      let profiles = [];
      let profiles_elem = {};

      // iterate over all source images
      // run similarity algorithm
      for(const profile of response) {
        profiles_elem.profileLink = twitterHome+profile.screen_name;
        profiles_elem.imgLink = profile.profile_image_url_https;
        profiles.push($.extend(true, {}, profiles_elem));
      };

      _parseSearchResults(jqXHR.srcImgData, profiles);
    },

    // On failure search
    error : function(jqXHR, textStatus, errorThrown) {
      console.log(`error : ${errorThrown}`);
    }
  });

  jqXHR.srcImgData = srcImgData;
}


/******************* Initialize twitter Oauth **************************/

function getOauthSignature(method, url, parameters, consumerSecret, tokenSecret) {
  // oauth.SignatureMethod.sign(message, accessor);
  // let normPar = oauth.SignatureMethod.normalizeParameters(message.parameters);
  // let baseString = oauth.SignatureMethod.getBaseString(message);
  // console.log("BaseString: " + baseString);
  // let sig = oauth.getParameter(message.parameters, "oauth_signature") + "=";
  // let encodedSig = oauth.percentEncode(sig); //finally you got oauth signature
  // console.log("Non-Encode Signature: " + sig);
  // console.log("Encoded Signature: " + encodedSig);
  // return encodedSig;

  let baseStr = getBaseString(method, url, parameters);
  let signKey = getSignKey(consumerSecret, tokenSecret);
  let sig = exports.b64_hmac_sha1(signKey, baseStr);
  sig = sig + "="
  let sigEnc = encodeURIComponent(sig);
  console.log(`base string = ${baseStr}`);
  console.log(`sign key = ${signKey}`);
  console.log(`non enc signature = ${sig}`);
  console.log(`encoded sign = ${sigEnc}`);
  return sigEnc;
}

/* Function to get base string.
 * parameters is a dictionary which contains all the required values
*/
function getBaseString(method, url, parameters) {
  let urlEnc = encodeURIComponent(url);
  const andEnc = encodeURIComponent("&");
  const eqEnc = encodeURIComponent("=");
  let paramsenc = {};
  for (var key in parameters) {
    if(parameters.hasOwnProperty(key)) {
      paramsenc[key] = encodeURIComponent(parameters[key]);
    }
  }

  let baseStr = method + "&" + urlEnc + "&" +
                "oauth_consumer_key" + eqEnc + paramsenc.oauth_consumer_key + andEnc +
                "oauth_nonce" + eqEnc + paramsenc.oauth_nonce + andEnc +
                "oauth_signature_method" + eqEnc + paramsenc.oauth_signature_method + andEnc +
                "oauth_timestamp" + eqEnc + paramsenc.oauth_timestamp + andEnc +
                "oauth_token" + eqEnc + paramsenc.oauth_token + andEnc +
                "oauth_version" + eqEnc + paramsenc.oauth_version + andEnc + 
                "q" + eqEnc + paramsenc.q;

  return baseStr;
}

function getSignKey(consumer_secret, oauth_token_secret) {
  let signkey = encodeURIComponent(consumer_secret)+"&"+encodeURIComponent(oauth_token_secret);
  return signkey;
}

/********************* End twitter Oauth init **************************/