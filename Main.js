/* --- Image toggle --- */
const mainimage = document.getElementById('mainimage');
const picture1 = mainimage?.src;
const picture2 =
  "https://upload.wikimedia.org/wikipedia/commons/f/f8/View_of_Mount_Fuji_from_%C5%8Cwakudani_20211202.jpg";
const title = document.querySelector("h1");
const mainText = document.getElementById("mainText");

if (mainimage) {
  mainimage.addEventListener('click', () => {
    mainimage.src = mainimage.src === picture1 ? picture2 : picture1;
  });
}

if (title && mainText) {
  title.addEventListener("click", () => {
    mainText.textContent = "You touched the mountain...";
  });
}

document.querySelectorAll('.shop-images').forEach(gallery => {
  const images = gallery.querySelectorAll('img');
  let index = 0;

  gallery.addEventListener('click', () => {
    images[index].style.display = 'none';
    index = (index + 1) % images.length;
    images[index].style.display = 'block';
  });
});

/* --- Dropdown menu toggle (topbar hamburger button) --- */
const menuToggle = document.getElementById('menuToggle');
const dropdownMenu = document.getElementById('dropdownMenu');
const dropdownBackdrop = document.getElementById('dropdownBackdrop');
const menuToggleFeather = document.getElementById('menuToggleFeather');
const menuToggleLabel = menuToggle?.querySelector('.menu-toggle-label');
const dropdownGlow = document.getElementById('dropdownGlow');

if (menuToggle && dropdownMenu && dropdownBackdrop) {
  function closeDropdown() {
    menuToggle.classList.remove('open');
    dropdownMenu.classList.remove('open');
    dropdownBackdrop.classList.remove('open');
    dropdownGlow?.classList.remove('open');
    menuToggleFeather?.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    if (menuToggleLabel) menuToggleLabel.textContent = 'Menu';
  }

  function positionFeatherForOpen() {
    if (!menuToggleFeather) return;
    // Land the feather just below the Contact link (not on top of it, not
    // stopping short above it). Falls back to the menu's own bottom edge if
    // that section isn't found.
    const stopEl = dropdownMenu.querySelector('.sidebar-contact') || dropdownMenu;
    const stopRect = stopEl.getBoundingClientRect();
    const featherRect = menuToggleFeather.getBoundingClientRect();
    const gapBelowStop = 16;
    // Measured while still in its resting (closed) position; +12 compensates
    // for the menu's own closed-state translateY(-12px).
    const drop = (stopRect.bottom + 12 + gapBelowStop) - featherRect.top;
    menuToggleFeather.style.setProperty('--feather-drop', Math.max(drop, 0) + 'px');
  }

  function positionDropdownMenu() {
    // Line the dropdown's left edge up with the menu button's actual left
    // edge, so it always drops straight down from the button regardless of
    // topbar padding/layout.
    const btnRect = menuToggle.getBoundingClientRect();
    dropdownMenu.style.left = btnRect.left + 'px';

    // The glow element is sized *larger* than the dropdown's own box by a
    // margin, then blurred as a whole (see CSS) — the margin is where the
    // blur fades the white fill to nothing, so the edge genuinely dissolves
    // rather than being shadowed from a hard-edged shape. The margin should
    // exceed the blur radius so the center (behind the actual text) stays
    // solid. Measured while still closed, so +12 compensates for the menu's
    // closed-state translateY(-12px) — left/width/height aren't affected by
    // that transform, only the vertical position is.
    if (dropdownGlow) {
      const GLOW_MARGIN = 40;
      const menuRect = dropdownMenu.getBoundingClientRect();
      dropdownGlow.style.left = (menuRect.left - GLOW_MARGIN) + 'px';
      dropdownGlow.style.top = (menuRect.top + 12 - GLOW_MARGIN) + 'px';
      dropdownGlow.style.width = (menuRect.width + GLOW_MARGIN * 2) + 'px';
      dropdownGlow.style.height = (menuRect.height + GLOW_MARGIN * 2) + 'px';
    }
  }

  function openDropdown() {
    positionDropdownMenu();
    positionFeatherForOpen();
    menuToggle.classList.add('open');
    dropdownMenu.classList.add('open');
    dropdownBackdrop.classList.add('open');
    dropdownGlow?.classList.add('open');
    menuToggleFeather?.classList.add('open');
    menuToggle.setAttribute('aria-expanded', 'true');
    if (menuToggleLabel) menuToggleLabel.textContent = 'Close';
  }

  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (dropdownMenu.classList.contains('open')) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  dropdownBackdrop.addEventListener('click', closeDropdown);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeDropdown();
  });
}
