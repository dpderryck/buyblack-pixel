console.log("Dom Content has not Loaded");

document.addEventListener("DOMContentLoaded", function () {
    console.log("Dom Content Loaded");

    var advertiserName = window.location.hostname.replace("www.", "");
    var trackingSent = JSON.parse(sessionStorage.getItem("trackingSent")) || {};

    function sendTrackingData(eventName, params) {
        console.log("Inside SendTracking Data");
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

        const button = document.querySelector('input[type="submit"]');
        if (button) {
            button.addEventListener("click", function () {
                var searchInput = searchForm.querySelector('input[name="q"]');
                    var locationInput = searchForm.querySelector('input[name="location_value"]');
        
                    var searchQuery = searchInput ? searchInput.value.trim() : "";
                    var locationQuery = locationInput ? locationInput.value.trim() : "";

                    var searchInput = searchForm.querySelector('input[name="q"]');
                    if (searchInput && searchQuery) {
                        sendTrackingData("search_interest", "&:search_interest=" + encodeURIComponent(searchQuery));
                    }
        
                    console.log("Search:", searchQuery);
                    console.log("Location:", locationQuery);
                
            });
        }        
    } else {
        console.warn("Search form not found.");
    }
});
