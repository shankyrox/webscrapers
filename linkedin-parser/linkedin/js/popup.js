$(function () {
	chrome.runtime.onMessage.addListener(
		function (request, sender, sendResponse) {
			var type = request.type;
			if (type == "start_varc") {
				$("#pdf_content").html(request.yoo_html);
			}
			if (request.message == "post_results") {
				// $.ajax({
				// 	type: "POST",
				// 	url: "http://localhost:5000/profiles/",
				// 	contentType: "application/json",
				// 	data: JSON.stringify(request.results),
				// 	success: function(result, status, xhr) {
				// 		console.log(result);
				// 	},
				// 	error: function(xhr, status, error) {
				// 		console.log(error);
				// 	}
				// })
				console.log(request.results);
				$("#pdf_content").html(JSON.stringify(request.results, undefined, 2));
			}
		}
	);


	$("#ims_pdf_button").click(function () {
		chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
			var activeTab = tabs[0];
			// chrome.tabs.sendMessage(activeTab.id, { "message": "start" });
			chrome.tabs.sendMessage(activeTab.id, { "message": "search" })
		});

		// var json_data = [{ name: "Tom", url: "http://linkedin.in" }]
		// // Make a call to db to add some data
		// $.ajax({
		// 	type: "POST",
		// 	url: "http://localhost:5000/profiles/",
		// 	contentType: "application/json",
		// 	data: JSON.stringify(json_data),
		// 	success: function(result, status, xhr) {
		// 		console.log(result);
		// 	},
		// 	error: function(xhr, status, error) {
		// 		console.log(error);
		// 	}
		// })
	});

	$("#get_profile_btn").click(function() {
		console.log('sending message to fetch_profile');
		chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
			var activetab = tabs[0];
			chrome.tabs.sendMessage(activetab.id, { message: "fetch_profile" });
		});
	})
});


// $("#ims_dilr_button").click(function () {
// 	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
// 		var activeTab = tabs[0];
// 		chrome.tabs.sendMessage(activeTab.id, { "message": "DILR" });
// 	});
// });


// $("#ims_QA_button").click(function () {
// 	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
// 		var activeTab = tabs[0];
// 		chrome.tabs.sendMessage(activeTab.id, { "message": "QA" });
// 	});
// });

// $("#time_test").click(function () {
// 	localStorage.setItem("ques_num", "60");

// });


// $("#ims_next_button").click(function () {
// 	var num_ques = parseFloat(localStorage.getItem("ques_num")) + 1;
// 	var sect = localStorage.getItem("section");
// 	chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
// 		var activeTab = tabs[0];
// 		chrome.tabs.sendMessage(activeTab.id, { "message": "next", "numing": num_ques, "section": sect });
// 	});
// });


// $("#ims_get_button").click(function () {
// 	var cont = localStorage.getItem("conti");
// 	$("#pdf_content").html(cont)
// });


// $("#ims_clear_button").click(function () {
// 	localStorage.clear();
// 	$("#pdf_content").html("")
// });


// $("#cmd").click(function () {
// 	var fileName = 'mock.html';
// 	var cont = localStorage.getItem("conti");
// 	//downloadInnerHtml(fileName, cont,'text/html');
// 	downloadFile(cont, fileName);
// });


// function downloadFile(data, fileName) {
// 	var csvData = data;
// 	var blob = new Blob([csvData], {
// 		type: "text/plain;charset=utf-8;"
// 	});

// 	if (window.navigator.msSaveBlob) {
// 		// FOR IE BROWSER
// 		navigator.msSaveBlob(blob, fileName);
// 	} else {
// 		// FOR OTHER BROWSERS
// 		var link = document.createElement("a");
// 		var csvUrl = URL.createObjectURL(blob);
// 		link.href = csvUrl;
// 		link.style = "visibility:hidden";
// 		link.download = fileName;
// 		document.body.appendChild(link);
// 		link.click();
// 		document.body.removeChild(link);
// 	}
// }


// function downloadInnerHtml(filename, elId, mimeType) {
// 	var elHtml = elId;
// 	var link = document.createElement('a');
// 	mimeType = mimeType || 'text/plain';

// 	link.setAttribute('download', filename);
// 	link.setAttribute('href', 'data:' + mimeType + ';charset=utf-8,' + encodeURIComponent(elHtml));
// 	link.click();
// }