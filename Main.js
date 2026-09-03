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

/* --- Tap-to-reveal for hover-term work images (no :hover on touch devices) --- */
document.querySelectorAll('.hover-term').forEach(term => {
  term.addEventListener('click', (e) => {
    const wasOpen = term.classList.contains('tapped');
    document.querySelectorAll('.hover-term.tapped').forEach(t => t.classList.remove('tapped'));
    if (!wasOpen) term.classList.add('tapped');
    e.stopPropagation();
  });
});

document.addEventListener('click', () => {
  document.querySelectorAll('.hover-term.tapped').forEach(t => t.classList.remove('tapped'));
});
