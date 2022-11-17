// task: to load images by scrolling (lazy loading)

const options = {
  rootMargin: '0px',
  threshold: .5
}

const callback = async (entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const card = entry.target;

      // change card background image and image placeholder to real image
      card.style.background = 'deepskyblue'
      const img = card.querySelector('img');
      
      img.src = img.dataset.src;
      img.removeAttribute('data-src');

      observer.unobserve(card);
    }
  })
}

const observer = new IntersectionObserver(callback, options);

const fetchImg = async (url) => {
  const req = await fetch(url);
  return await req.json();
}

window.onload = async () => {
  const imgs = await fetchImg('https://picsum.photos/v2/list');
  
  const rootEl = document.querySelector('#root')
  const cardTemplate = document.querySelector('#card-template')

  for (let index = 0; index < 20; index++) {
    const clone = cardTemplate.content.cloneNode(true)

    const card = clone.querySelector('.card');
    const image = card.querySelector('img');
    image.dataset.src = imgs[index].download_url;
    image.src = './placeholder-img.png';
    // reserve initial dimentions of imare for the moment before the end of the loading of image to prevent layout flashing
    // and as a result, calling the observer callback
    image.width = '200';
    image.height = '150';
    const text = card.querySelector('.card__text');
    text.textContent = imgs[index].author;

    observer.observe(card);

    rootEl.appendChild(clone);
  }
}