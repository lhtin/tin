(() => {
  const getItem = (index) => {
    let div = document.createElement('div')
    div.innerHTML = new Array(1000).join(index)
    // for (let i = 0; i < 100; i += 1) {
    //   let p = document.createElement('p')
    //   p.innerHTML = `${index}_${i}`
    //   div.appendChild(p)
    // }
    return div
  }
  let list = []
  let div = document.createElement('div')
  for (let i = 0; i < 10000; i += 1) {
    const item = getItem(i)
    list.push(item)
    div.appendChild(item)
  }
  document.body.appendChild(div)
  window.move = (from, to) => {
    let start = Date.now()
    const children = div.childNodes
    div.insertBefore(children[from], children[to])
    console.log(`${from} > ${to}: ${Date.now() - start}`)
  }
})()
