// Background.js

$(function(){
	chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
		console.log('background message received');
		switch(request.message) {
			case "post_results" : 
				post_search_results(request.results, 0);
				break;
			default: 
				console.log(`Unexpected message : ${request.message}`);
		}
	});

	function post_search_results(results, index) {
		if(index < results.length && results[index].link) {
			fetch_profile_data(results[index], post_search_results.bind(this, results, index+1));
		}
	}
	
	// Contains name and link to profile
	function fetch_profile_data(profile, cb) {
		chrome.tabs.create({ url: profile.link }, function (tab) {
			console.log('tab created', tab.id);
			chrome.tabs.onUpdated.addListener(function (updated_tabid, changeInfo) {
				if (updated_tabid == tab.id && changeInfo.status == 'complete') {
					setTimeout(function () {
						chrome.tabs.sendMessage(tab.id, { message: "fetch_profile", profile: profile }, function (response) {
							console.log('received response = ', response);
							chrome.tabs.remove(tab.id);
							post_profile(response);
							cb();
						});
					}, 1000);
				}
			});
		});
	}
	
	function post_profile(profile) {
		console.log('POSTing', profile);
		$.ajax({
			type: "POST",
			url: "http://localhost:5000/profiles/",
			contentType: "application/json",
			data: JSON.stringify(profile),
			success: function (result, status, xhr) {
				console.log('success');
				console.log(result);
			},
			error: function (xhr, status, error) {
				console.log(error);
			}
		});
	}
});