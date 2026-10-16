// Shows one "page" at a time.
// The page to show comes from the end of the web address, e.g.
// stefanioyong.github.io/#journey shows the section with id="journey".

const pages = document.querySelectorAll(".page");
const navLinks = document.querySelectorAll(".nav nav a");

function showPage() {
  // Take the part after "#", or use "home" if there isn't one
  let id = location.hash.slice(1) || "home";
  if (!document.getElementById(id)) id = "home";

  // Hide every page except the chosen one
  pages.forEach(function (page) {
    page.hidden = page.id !== id;
  });

  // Underline the matching menu link
  navLinks.forEach(function (link) {
    link.classList.toggle("active", link.getAttribute("href") === "#" + id);
  });

  window.scrollTo(0, 0);
}

// Run when a link changes the address, and once when the site first opens
window.addEventListener("hashchange", showPage);
showPage();
