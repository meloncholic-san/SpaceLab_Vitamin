export function initLazyImages(container = document) {
  const images = container.querySelectorAll('img[data-src]');

  if (!images.length) return;

  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const img = entry.target;

        img.src = img.dataset.src;
        img.removeAttribute('data-src');

        img.addEventListener('load', () => {
          img.classList.add('is-loaded');
        }, { once: true });

        observer.unobserve(img);
      });
    },
    {
      root: null,
      rootMargin: '1000px 0px',
      threshold: 0.01
    }
  );

  images.forEach(img => observer.observe(img));
}
