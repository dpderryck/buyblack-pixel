<script>
    (function() {
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

        // **Ensure script only runs once per full page load**
        function isAdRefresh() {
            return performance.getEntriesByType("navigation")[0]?.type !== "reload" && document.visibilityState === "visible";
        }

        if (!isAdRefresh()) {
            sendTrackingData("visited", "");

            // Wait until the DOM is fully loaded before getting the category
            document.addEventListener("DOMContentLoaded", function() {
                var businessCategory = getBusinessCategory();
                if (businessCategory) {
                    sendTrackingData("business_category_" + businessCategory, "&:biz_category=" + encodeURIComponent(businessCategory));
                }
            });

            // Track engagement based on time spent on page
            window.addEventListener("beforeunload", function() {
                var timeSpent = Math.round((Date.now() - startTime) / 1000); // Time in seconds
                var engagement = (timeSpent < 30) ? "short" : (timeSpent < 120) ? "medium" : "long";
                sendTrackingData("engaged", "&:engaged_" + engagement + "=1");
            });

            // Track scroll depth (only once per threshold)
            window.addEventListener("scroll", function() {
                var scrollDepth = Math.round((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100);
                if (scrollDepth > 50) sendTrackingData("scroll_50", "&:scroll_depth=50");
                if (scrollDepth > 80) sendTrackingData("scroll_80", "&:scroll_depth=80");
            });

            // Track exit intent via mouse leave (only once)
            document.addEventListener("mouseleave", function(event) {
                if (event.clientY < 10) sendTrackingData("exit_intent", "&:exit_intent=1");
            });

            // Track exit intent via visibility change (only once)
            document.addEventListener("visibilitychange", function() {
                if (document.hidden) sendTrackingData("exit_intent", "&:exit_intent=1");
            });

            // **Determine Interest Based on Search Input**
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
        }

    })();
</script>
