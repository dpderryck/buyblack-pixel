document.addEventListener("DOMContentLoaded", function() {
        if (window.aquaPixelLoaded) return; // Prevent script from running multiple times
        window.aquaPixelLoaded = true; // Set flag to ensure script runs only once

        var advertiserName = window.location.hostname.replace("www.", ""); // Removes "www." if present
        var startTime = Date.now(); // Track time spent on page
        var trackingSent = JSON.parse(sessionStorage.getItem("trackingSent")) || {}; // Use sessionStorage for one-time execution

        function sendTrackingData(eventName, params) {
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
        searchForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent default submission (optional for tracking)

            var searchInput = searchForm.querySelector('input[name="q"]');
            var locationInput = searchForm.querySelector('input[name="location_value"]');

            var searchQuery = searchInput ? searchInput.value.trim() : "";
            var locationQuery = locationInput ? locationInput.value.trim() : "";

            console.log("Search Submitted:", searchQuery, "Location:", locationQuery);

            // Send tracking data (adjust tracking URL)
            var trackingUrl = "https://example.com/track?search=" + encodeURIComponent(searchQuery) + "&location=" + encodeURIComponent(locationQuery);
            navigator.sendBeacon(trackingUrl);

            searchForm.submit(); // Allow form submission after tracking
        });
    } else {
        console.warn("Search form not found.");
    }
        
        
       document.addEventListener("submit", function(event) {
                var searchForm = event.target.closest('form[action="/sitesearch"]'); // Adjust if needed
                console.log(searchForm);
                if (searchForm) {
                    var searchInput = searchForm.querySelector('input[name="q"]');
                    if (searchInput && searchInput.value.trim()) {
                        sendTrackingData("search_interest", "&:search_interest=" + encodeURIComponent(searchInput.value.trim()));
                    }
                }
            });

        

});    
