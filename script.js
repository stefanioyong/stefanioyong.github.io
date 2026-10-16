// Shows one "page" at a time.
// The page to show comes from the end of the web address, e.g.
// stefanioyong.github.io/#journey shows the section with id="journey".

const pages = document.querySelectorAll(".page");
const tabLinks = document.querySelectorAll(".tabs a");
const tabs = document.querySelector(".tabs");

function showPage() {
  // Take the part after "#", or use "home" if there isn't one
  let id = location.hash.slice(1) || "home";
  if (!document.getElementById(id)) id = "home";

  // Hide every page except the chosen one
  pages.forEach(function (page) {
    page.hidden = page.id !== id;
  });

  // Underline the matching tab
  tabLinks.forEach(function (link) {
    link.classList.toggle("active", link.getAttribute("href") === "#" + id);
  });

  // If you've scrolled down past the tabs, go back up to just below them
  window.scrollTo(0, Math.min(window.scrollY, tabs.offsetTop));
}

// Run when a link changes the address, and once when the site first opens
window.addEventListener("hashchange", showPage);
showPage();

// ----- Journey filters -----
// Clicking a filter button shows only entries with that class
// (tl-work, tl-lead or tl-edu), or all of them.
const filterButtons = document.querySelectorAll(".filter");
const entries = document.querySelectorAll(".tl-item");

function applyFilter(filter) {
  let shown = 0;
  entries.forEach(function (entry) {
    const visible = filter === "all" || entry.classList.contains(filter);
    entry.hidden = !visible;
    // Alternate visible entries left and right for the zig-zag
    entry.classList.toggle("right", visible && shown % 2 === 1);
    if (visible) shown++;
  });
  filterButtons.forEach(function (button) {
    button.classList.toggle("active", button.dataset.filter === filter);
  });
}

filterButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    applyFilter(button.dataset.filter);
  });
});
applyFilter("all");

// When the site opens with a #tab in the address, the browser jumps down
// to that section after loading; this brings it back to the top.
window.addEventListener("load", function () {
  setTimeout(function () { window.scrollTo(0, 0); }, 0);
});
