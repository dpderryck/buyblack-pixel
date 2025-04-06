console.log("Dom Content has not Loaded");

document.addEventListener("DOMContentLoaded", function() {
    console.log("Dom Content Loaded");

    var advertiserName = window.location.hostname.replace("www.", ""); // Removes "www." if present
    var startTime = Date.now(); // Track time spent on page
    var trackingSent = JSON.parse(sessionStorage.getItem("trackingSent")) || {}; // Use sessionStorage for one-time execution

    function sendTrackingData(eventName, params) {
        console.log("Inside SendTracking Data ");
        if (!trackingSent[eventName]) { // Prevent duplicate requests using sessionStorage
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
            event.preventDefault(); // Prevent default form submission (optional for tracking)
            alert("Inside submit event listener");
             
            var searchInput = searchForm.querySelector('input[name="q"]');
            var locationInput = searchForm.querySelector('input[name="location_value"]');
            

            var trackingUrl = "https://example.com/track?search=" + encodeURIComponent(searchQuery) + "&location=" + encodeURIComponent(locationQuery);
            navigator.sendBeacon(trackingUrl);

            // Delay form submission to ensure tracking is sent before submitting
            setTimeout(function() {
                console.log("Form is being submitted...");
                searchForm.submit(); // Allow form submission after tracking
            }, 5000); // Delay by 1 second (adjust if necessary)        

            
        });
    } else {
        console.warn("Search form not found.");
    }

});
