console.log("Dom Content has not Loaded");

document.addEventListener("DOMContentLoaded", function() {
    console.log("Dom Content Loaded");

    var advertiserName = window.location.hostname.replace("www.", "");
    var startTime = Date.now();
    var trackingSent = JSON.parse(sessionStorage.getItem("trackingSent")) || {};

    function sendTrackingData(eventName, params) {
        console.log("Inside SendTracking Data ");
        if (!trackingSent[eventName]) {
            trackingSent[eventName] = true;
            sessionStorage.setItem("trackingSent", JSON.stringify(trackingSent));

            var trackingPixel = new Image();
            trackingPixel.src = "https://servedby.aqua-adserver.com/fc.php?script=apRetargeting:hv-api&key=xBepEwdYAsuV" +
                "&:visited_advertiser=1&:visitor=" + advertiserName + params;
            trackingPixel.style.display = "none";
            document.body.appendChild(trackingPixel);
        }
    }

    var searchForm = document.querySelector('form[name="frm1"]');
    if (searchForm) {
        console.log("Inside searchform");

        searchForm.addEventListener("submit", function(event) {
            event.preventDefault(); 
            alert("Inside submit event listener");

            var searchInput = searchForm.querySelector('input[name="q"]');
            var locationInput = searchForm.querySelector('input[name="location_value"]');

            var searchQuery = searchInput ? searchInput.value : "";
            var locationQuery = locationInput ? locationInput.value : "";

            var trackingUrl = "https://example.com/track?search=" + encodeURIComponent(searchQuery) +
                              "&location=" + encodeURIComponent(locationQuery);
            navigator.sendBeacon(trackingUrl);

            setTimeout(function() {
                console.log("Form is being submitted...");
                searchForm.submit();
            }, 1000); // 1 second delay should be enough
        });
    } else {
        console.warn("Search form not found.");
    }

});
