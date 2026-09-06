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
  // The feather is only meant to look "alive" (gif) while it's actually
  // sliding — static at rest in both the closed (top) and open (bottom)
  // positions.
  //
  // On open: the crossfade to gif (0.3s, default CSS transition) starts
  // immediately and finishes early while the 1s slide is still running,
  // which reads well since it's a quick change near the start of visible
  // motion. Once the slide lands at the bottom, a timeout fades it back to
  // static using that same quick default transition — nothing else is
  // moving at that point, so a short clean fade reads as "settling" rather
  // than a lag.
  //
  // On close: mirroring the open behavior as a short window near the *end*
  // of the slide doesn't read the same way, because it lands right as the
  // slide's own easing is already decelerating toward a stop, so the fade
  // looks disconnected from the motion (too early/abrupt either way).
  // Instead, close fades across the *entire* slide using the exact same
  // duration and easing as the slide itself, so the two are mathematically
  // locked together frame for frame.
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
    dropdownGlow?.classList.remove('open');
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

    // Size/position the mobile glow element to match the dropdown's own box
    // exactly (its box-shadow does the bleeding-into-transparency beyond
    // that). Measured while still closed, so +12 compensates for the menu's
    // closed-state translateY(-12px) — left/width/height aren't affected by
    // that transform, only the vertical position is.
    if (dropdownGlow) {
      const menuRect = dropdownMenu.getBoundingClientRect();
      dropdownGlow.style.left = menuRect.left + 'px';
      dropdownGlow.style.top = (menuRect.top + 12) + 'px';
      dropdownGlow.style.width = menuRect.width + 'px';
      dropdownGlow.style.height = menuRect.height + 'px';
    }
  }

  function openDropdown() {
    clearPendingFeatherHandler();
    resetFeatherFadeStyle();
    positionDropdownMenu();
    positionFeatherForOpen();
    menuToggle.classList.add('open');
    dropdownMenu.classList.add('open');
    dropdownBackdrop.classList.add('open');
    dropdownGlow?.classList.add('open');
    menuToggleFeather?.classList.add('open');
    menuToggleFeather?.classList.add('feather-live');
    menuToggle.setAttribute('aria-expanded', 'true');
    if (menuToggleLabel) menuToggleLabel.textContent = 'Close';

    // The gif is only meant to be visible while the feather is actually in
    // motion. It fades in quickly (0.3s, default CSS transition) right as
    // the slide starts, then once the slide has landed at the bottom, fade
    // it back to static too — so it's static at rest in both the closed and
    // open positions, and gif only in between while sliding.
    if (menuToggleFeather) {
      featherFadeTimeout = setTimeout(() => {
        menuToggleFeather.classList.remove('feather-live');
        featherFadeTimeout = null;
      }, FEATHER_SLIDE_MS);
    }
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
