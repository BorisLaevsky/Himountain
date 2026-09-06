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

if (menuToggle && dropdownMenu && dropdownBackdrop) {
  // On open, the gif/static crossfade (0.3s) starts immediately and finishes
  // early while the 1s slide is still running — that reads well because it's
  // a short, snappy change happening near the start of the motion. Trying to
  // mirror that as a short window near the *end* of the close slide doesn't
  // read the same way, because it's landing right as the slide's own easing
  // is already decelerating toward a stop, so the fade looks slightly
  // disconnected from the motion either way (too early/abrupt, or a
  // trailing afterthought).
  //
  // Instead, on close, fade across the *entire* slide using the exact same
  // duration and easing as the slide itself, so the two are mathematically
  // locked together frame for frame — there's no separate window to land
  // wrong, they simply finish at the same instant by construction.
  const FEATHER_SLIDE_MS = 1000;
  let featherFadeTimeout = null;

  function resetFeatherFadeStyle() {
    menuToggleFeather?.querySelectorAll('img').forEach((img) => {
      img.style.transition = '';
    });
  }

  function clearPendingFeatherHandler() {
    if (featherFadeTimeout !== null) {
      clearTimeout(featherFadeTimeout);
      featherFadeTimeout = null;
    }
  }

  function closeDropdown() {
    menuToggle.classList.remove('open');
    dropdownMenu.classList.remove('open');
    dropdownBackdrop.classList.remove('open');
    menuToggleFeather?.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    if (menuToggleLabel) menuToggleLabel.textContent = 'Menu';

    clearPendingFeatherHandler();
    if (menuToggleFeather) {
      menuToggleFeather.querySelectorAll('img').forEach((img) => {
        img.style.transition = `opacity ${FEATHER_SLIDE_MS}ms ease`;
      });
      menuToggleFeather.classList.remove('feather-live');
      featherFadeTimeout = setTimeout(() => {
        resetFeatherFadeStyle(); // back to the quick 0.3s CSS default for next open
        featherFadeTimeout = null;
      }, FEATHER_SLIDE_MS);
    }
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
  }

  function openDropdown() {
    clearPendingFeatherHandler();
    resetFeatherFadeStyle();
    positionDropdownMenu();
    positionFeatherForOpen();
    menuToggle.classList.add('open');
    dropdownMenu.classList.add('open');
    dropdownBackdrop.classList.add('open');
    menuToggleFeather?.classList.add('open');
    menuToggleFeather?.classList.add('feather-live');
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
