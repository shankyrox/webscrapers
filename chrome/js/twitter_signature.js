
var urlLink = "https://api.twitter.com/1.1/users/search.json?q=sweatcoin"

var oauth = require('./third-party/oauth.js');

var parameters = {
    oauth_consumer_key: "4LrnYfjDGwQL7yiwAVgNX6pg8",
    oauth_nonce: "kYjzVBB8Y0ZFabxSWbWovY3uYSQ2pTgmZeNu2VS4cg",
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: "1545850564",
    oauth_token: "770358488941809665-K2jOP3cExgyEONrqc3MO6JwxnKsYboT ",
    oauth_version: "1.0",
}


var message={
    "method" : "GET",
    "action" : urlLink,
    "parameters" : parameters
}

var consumerSecret = "KKoq11lkMNT0o3XjhuABrDkRw1ryEIQ4szEC7wnxlLM9lwCzHY"
var tokenSecret = "Vhdn5keRVTJPtT6YGZ0TcnYeZ1ktOz5YsMp2T6iKghJVB"

var accessor = {
    "consumerSecret" : consumerSecret,
    "tokenSecret" : tokenSecret
};

//lets create signature
oauth.SignatureMethod.sign(message, accessor);
var normPar = oauth.SignatureMethod.normalizeParameters(message.parameters);
console.log("Normalized Parameters: " + normPar);
var baseString = oauth.SignatureMethod.getBaseString(message);
console.log("BaseString: " + baseString);
var sig = oauth.getParameter(message.parameters, "oauth_signature") + "=";
console.log("Non-Encode Signature: " + sig);
var encodedSig = oauth.percentEncode(sig); //finally you got oauth signature
console.log("Encoded Signature: " + encodedSig);