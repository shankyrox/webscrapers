
$(document).ready(function () {
	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
			console.log('content script message received')
			switch(request.message) {
				case "start": 
					start();
					break;
				case "search":
					window.scrollTo(0, 0);
					_autoscroll(0, parse_search_results)
					break;
			}
		}
	);


	function parse_search_results() {
		var items = $("li.search-results__result-item dt.result-lockup__name a")
		var results = [];
		for(var i = 0; i < items.length; ++i) {
			results.push({
				name: items[i].text.trim(),
				link: items[i].href
			});
		}
		chrome.runtime.sendMessage({ message: "post_results", results: results })
	}


	/* This function scrolls at some interval until it reaches the bottom of page. 
 	 * last_scroll_ht : integer : used for mainting state
	 */
	 
	function _autoscroll(last_scroll_ht, fn) {
		var total_scroll_ht = document.body.scrollHeight;
		var scroll_by = window.innerHeight;
		if (last_scroll_ht < total_scroll_ht) {
			last_scroll_ht += scroll_by;
			window.scrollTo(0, last_scroll_ht);
			window.setTimeout(_autoscroll.bind(null, last_scroll_ht, fn), 300);
		}
		else {
			// at bottom of page
			fn();
		}
	}
});

