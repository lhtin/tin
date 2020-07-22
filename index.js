[...document.getElementsByTagName('img')]
  .forEach((img) => {
    img.addEventListener('click', () => {
      window.open(img.src)
    })
  })
