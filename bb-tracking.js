document.addEventListener("DOMContentLoaded", function () {
   function setInterest(category) {
  const days = 10; // Expiry window (customize 7–14 days)
  const expires = new Date();
  expires.setTime(expires.getTime() + (days*24*60*60*1000));
  
  document.cookie = `ad_interest=${encodeURIComponent(category)}; path=/; expires=${expires.toUTCString()}`;
}

function getInterest() {
  const match = document.cookie.match(/(?:^|; )ad_interest=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// Usage example:
const url = new URL(window.location.href);
const category = url.searchParams.get("category[]");

if (category) {
  setInterest(category);
}

// Now anywhere on the site:
const interest = getInterest();
if (interest) {
  // Serve ads for `interest`
} else {
  // Serve general/geo ads
}

});
