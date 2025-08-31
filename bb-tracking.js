 document.addEventListener("DOMContentLoaded", function () {
  function setInterest(category) {
    const days = 14; // Persist for 14 days
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `ad_interest=${encodeURIComponent(category)}; path=/; expires=${expires.toUTCString()}`;

    // Fire Aqua retargeting pixel so Aqua knows about this interest too
    fireRetargetingPixel(category);
  }

  function getInterest() {
    const match = document.cookie.match(/(?:^|; )ad_interest=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  function fireRetargetingPixel(category) {
    const encodedCategory = encodeURIComponent(category);
    const pixel = new Image();
    pixel.src = `http://servedby.aqua-adserver.com/fc.php?script=apRetargeting:hv-api&key=xBepEwdYAsuV&:ad_interest=${encodedCategory}`;
    document.body.appendChild(pixel);
  }

  // Detect interest from URL
  const url = new URL(window.location.href);
  const category = url.searchParams.get("category[]");
  if (category) {
    setInterest(category);
  }

  // Use interest sitewide
  const interest = getInterest();
  if (interest) {
    // TODO: Serve category-specific ads, banners, or UI tweaks
    console.log("User interest:", interest);
  } else {
    // TODO: Serve general/geo ads
    console.log("No stored interest, fallback to general ads");
  }
});

