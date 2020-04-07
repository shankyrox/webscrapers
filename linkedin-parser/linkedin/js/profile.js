chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log('received message in profile.js script', request);
        switch(request.message) {
            case "fetch_profile" : 
                fetchProfile(request, sendResponse);
                break;
        }
    }
);

function fetchProfile(request, sendResponse) {
    var profile = {};
    profile.name = $(".profile-topcard-person-entity__name").eq(0).text().trim();
    profile.title = $(".mt2").eq(1).text().trim();
    profile.summary = $(".profile-topcard__summary-content").eq(0).text().trim();
    profile.location = $(".profile-topcard__location-data").eq(0).text().trim();

    // Parse experience list
    profile.experience = [];
    var experience_list = $('section#profile-positions ul.profile-experience__position-list li.profile-position');
    for(var i = 0; i < experience_list.length; ++i) {
        profile.experience.push({
            title: experience_list.eq(i).find('dt.profile-position__title').text().trim(),
            company: {
                name: experience_list.eq(i).find('dd.profile-position__secondary-title span > a').text().trim(),
                href: experience_list.eq(i).find('dd.profile-position__secondary-title span > a').attr('href')
            },
            period: experience_list.eq(i).find('dd p.profile-position__dates-employed').clone().children().remove().end().text().trim(),
            location: experience_list.eq(i).find('dd.profile-position__company-location').clone().children().remove().end().text().trim()
        });
    }

    // Parse education list
    profile.education = [];
    var education_list =  $("section#profile-educations ul.profile-education__school-list li.profile-education");
    for(var i = 0; i < education_list.length; ++i) {
        profile.education.push({
            university: education_list.eq(i).find('dt.profile-education__school-name').text().trim(),
            degree: education_list.eq(i).find('dd.profile-education__degree span').eq(1).text().trim(),
            field_of_study: education_list.eq(i).find('dd.profile-education__field-of-study span').eq(1).text().trim(),
            period: education_list.eq(i).find('dd.profile-education__dates span').eq(1).text().trim()
        });
    }
    console.log('sendin response, ', profile);
    sendResponse(profile);
}

$(document).ready(function () {
    // start();
    function start() {
        console.log("started");
        $(document).ready(function () {
            var profile = {};
            profile.name = $(".profile-topcard-person-entity__name").eq(0).text();
            profile.title = $(".mt2").eq(1).text();
            profile.summary = $(".profile-topcard__summary-content").eq(0).text();
            profile.location = $(".profile-topcard__location-data").eq(0).text();
    
            html = html + "<p>" + profile.name + "</p>";
            html = html + "<p>" + profile.title + "</p>";
            html = html + "<p>" + profile.summary + "</p>";
            html = html + "<p>" + profile.location + "</p><br />";
    
            //get number of sections in profile
            var profile_section = $(".profile-section");
    
            for (var i = 0; i < profile_section.find("section").length; i++) {
                var section = profile_section.find("section").eq(i);
                var profile_header = section.find("h3").eq(0).text();
                var profile_header_items = section.find("ul").eq(0).find("li");
                html = html + "<b><p>" + profile_header + "</p></b> <br /> ";
    
                for (var j = 0; j < profile_header_items.length; j++) {
                    var item_header = profile_header_items.eq(j).find("dl").eq(0).find("dt").eq(0).text();
                    html = html + "<p>" + item_header + "</p>";
                    for (var k = 0; k < profile_header_items.eq(j).find("dl").eq(0).find("dd").length - 1; k++) {
                        var company_name = profile_header_items.eq(j).find("dl").eq(0).find("dd").eq(k).text();
                        html = html + "<p>" + company_name + "</p>";
                    }
                    html = html + "<br />";
                }
                html = html + "<br />";
            }
    
            chrome.runtime.sendMessage({
                yoo_html: html,
                type: "start_varc"
    
            });
        });
    }
});