(function () {
    if (window.aquaPixelLoaded) return;
    window.aquaPixelLoaded = true;

    var advertiserName = window.location.hostname.replace("www.", "");
    var startTime = Date.now();
    var trackingSent = JSON.parse(sessionStorage.getItem("trackingSent")) || {};

    function sendTrackingData(eventName, params) {
        if (!trackingSent[eventName]) {
            trackingSent[eventName] = true;
            sessionStorage.setItem("trackingSent", JSON.stringify(trackingSent));

            var pixelUrl = "https://servedby.aqua-adserver.com/fc.php?script=apRetargeting:hv-api&key=xBepEwdYAsuV" +
                           "&:visited_advertiser=1&:visitor=" + advertiserName + params;

            if (navigator.sendBeacon) {
                navigator.sendBeacon(pixelUrl);
            } else {
                var trackingPixel = new Image();
                trackingPixel.src = pixelUrl;
                trackingPixel.style.display = "none";

                if (document.body) {
                    document.body.appendChild(trackingPixel);
                } else {
                    document.addEventListener("DOMContentLoaded", function () {
                        document.body.appendChild(trackingPixel);
                    });
                }
            }
        }
    }

    function getBusinessCategory() {
        var categoryName = "";
        var breadcrumbLinks = document.querySelectorAll('.breadcrumb li a');

        if (breadcrumbLinks.length >= 2) {
            categoryName = breadcrumbLinks[breadcrumbLinks.length - 2].innerText.trim();
        }

        if (!categoryName) {
            var metaCategory = document.querySelector('meta[property="business:category"], meta[name="business_category"]');
            if (metaCategory) {
                categoryName = metaCategory.getAttribute("content")?.trim() || "";
            }
        }

        if (!categoryName) {
            var pathSegments = window.location.pathname.split("/").filter(Boolean);
            if (pathSegments.length >= 3) {
                categoryName = pathSegments[pathSegments.length - 2].replace(/-/g, " ");
            }
        }

        return categoryName;
    }

    function isAdRefresh() {
        return (performance.getEntriesByType("navigation")?.[0]?.type || "") !== "reload" && document.visibilityState === "visible";
    }

    if (!isAdRefresh()) {
        sendTrackingData("visited", "");

        document.addEventListener("DOMContentLoaded", function () {
            var businessCategory = getBusinessCategory();
            if (businessCategory) {
                sendTrackingData("business_category_" + businessCategory, "&:biz_category=" + encodeURIComponent(businessCategory));
            }
        });

        window.addEventListener("beforeunload", function () {
            var timeSpent = Math.round((Date.now() - startTime) / 1000);
            var engagement = timeSpent < 30 ? "short" : timeSpent < 120 ? "medium" : "long";
            sendTrackingData("engaged", "&:engaged_" + engagement + "=1");
        });

        var scrollEvents = { scroll_50: false, scroll_80: false };

        window.addEventListener("scroll", function () {
            var scrollDepth = Math.round((window.scrollY + window.innerHeight) / document.body.scrollHeight * 100);

            if (scrollDepth > 50 && !scrollEvents.scroll_50) {
                scrollEvents.scroll_50 = true;
                sendTrackingData("scroll_50", "&:scroll_depth=50");
            }
            if (scrollDepth > 80 && !scrollEvents.scroll_80) {
                scrollEvents.scroll_80 = true;
                sendTrackingData("scroll_80", "&:scroll_depth=80");
            }
        });

        document.addEventListener("mouseleave", function (event) {
            if (event.clientY < 0) sendTrackingData("exit_intent", "&:exit_intent=1");
        });

        document.addEventListener("visibilitychange", function () {
            if (document.hidden) sendTrackingData("exit_intent", "&:exit_intent=1");
        });

        document.addEventListener("submit", function (event) {
            var searchForm = event.target.closest('form[action="/sitesearch"]');
            if (searchForm) {
                var searchInput = searchForm.querySelector('input[name="q"]');
                if (searchInput && searchInput.value.trim()) {
                    sendTrackingData("search_interest", "&:search_interest=" + encodeURIComponent(searchInput.value.trim()));
                }
            }
        });
    }
})();
