console.log("Dom Content has not Loaded");

document.addEventListener("DOMContentLoaded", function () {
    console.log("Dom Content Loaded");
    
    var advertiserName = window.location.hostname.replace("www.", ""); 
     var startTime = Date.now(); // Track time spent on page
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

    function getBusinessCategory() {
            // Try to get category from breadcrumbs
            var categoryName = "";
            var breadcrumbLinks = document.querySelectorAll('.breadcrumb li a');

            if (breadcrumbLinks.length > 1) {
                categoryName = breadcrumbLinks[breadcrumbLinks.length - 2].innerText.trim(); // Second-to-last breadcrumb
            }

            // If breadcrumbs didn't work, try getting from meta tags
            if (!categoryName) {
                var metaCategory = document.querySelector('meta[property="business:category"], meta[name="business_category"]');
                if (metaCategory) {
                    categoryName = metaCategory.getAttribute("content").trim();
                }
            }

            // If still no category, try extracting from URL path (e.g., /home-services/)
            if (!categoryName) {
                var pathSegments = window.location.pathname.split("/").filter(Boolean); // Get non-empty URL segments
                if (pathSegments.length >= 3) { // Example path: /united-states/burke/home-services/affinity-contracting-llc
                    categoryName = pathSegments[pathSegments.length - 2].replace(/-/g, " "); // Get second-to-last URL segment
                }
            }

            return categoryName;
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
