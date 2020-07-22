
const inputMax = document.getElementById('input-max')
const inputTimes = document.getElementById('input-times')
const log = document.getElementById('log')
const startButton = document.getElementById('start')
const stopButton = document.getElementById('stop')
const app = document.getElementById('play')
const extreme = document.getElementById('extreme')

function testBest (S2) {
  const start1 = performance.now()
  const {best, k} = getBestList(S2)
  S.best = best
  const diff1 = performance.now() - start1
  const start2 = performance.now()
  let prevChild = null
  for (let i = 0, len = S2.length; i < len; i += 1) {
    const child = S2[i]
    // 如果不在最长子列表里面，则进行移动
    if (!best[child._index]) {
      if (prevChild) {
        app.insertBefore(child, prevChild.nextSibling)
      } else {
        app.insertBefore(child, app.firstChild)
      }
    }
    prevChild = child
  }
  const diff2 = performance.now() - start2
  return {k, moveTime: diff2, bestTime: diff1}
}
function testFirst (S2) {
  const start1 = performance.now()
  let prevMaxIndex = -1
  let prevChild
  let k = 0
  for (let i = 0, len = S2.length; i < len; i += 1) {
    const child = S2[i]
    if (child._index < prevMaxIndex) {
      if (prevChild) {
        app.insertBefore(child, prevChild.nextSibling)
      } else {
        app.insertBefore(child, app.firstChild)
      }
    } else {
      prevMaxIndex = child._index
      k += 1
    }
    prevChild = child
  }
  const diff1 = performance.now() - start1
  return {k, moveTime: diff1}
}

function init (S1) {
  app.innerHTML = ''
  for (let item of S1) {
    app.appendChild(item)
  }
}

function f () {
  if (isPaused) {
    logIt()
    return
  }
  times += 1
  
  const S1 = []
  for (let i = 0; i < max; i += 1) {
    const item = document.createElement('p')
    item.style.wordBreak = 'break-all'
    item._index = i
    item.innerText = `第${i}个元素${new Array(1000).join('React')}`
    S1.push(item)
  }
  
  const S2 = [...S1]
  if (extreme.checked) {
    let last = S2.pop()
    S2.unshift(last)
  } else {
    // 随机生成S1
    for (let i = 0; i < max; i += 1) {
      let j = Math.floor(Math.random() * max)
      let temp = S2[i]
      S2[i] = S2[j]
      S2[j] = temp
    }
  }

  window.S = {
    S1,
    S2
  }
  init(S1)
  setTimeout(() => {
    const {k: k1, moveTime: moveTime1, bestTime: bestTime1} = testBest(S2)
    setTimeout(() => {
      init(S1)
      setTimeout(() => {
        const {k: k2, moveTime: moveTime2} = testFirst(S2)
        list.push([
          {k: k1, totalTime: moveTime1 + bestTime1, moveTime: moveTime1, bestTime: bestTime1},
          {k: k2, totalTime: moveTime2, moveTime: moveTime2}
        ])
        setTimeout(() => {
          inputTimes.value = times
          f()
        }, 1)
      }, 1)
    }, 1)
  }, 1)
}

let list
let times
let isPaused = true
let max
startButton.addEventListener('click', () => {
    max = Number(inputMax.value)
    if (!isPaused || max <= 0) {
      return
    }
    isPaused = false
    list = []
    times = 0
    inputTimes.value = ''
    startButton.style.visibility = 'hidden'
    stopButton.style.visibility = 'visible'
    f()
  })
stopButton.addEventListener('click', () => {
    isPaused = true
  })

stopButton.style.visibility = 'hidden'

function logIt () {
  app.innerHTML = ''
  const t1 = list.reduce((a, b) => a + b[0].totalTime, 0) / list.length
  const b1 = list.reduce((a, b) => a + b[0].bestTime, 0) / list.length
  const m1 = list.reduce((a, b) => a + b[0].moveTime, 0) / list.length
  const k1 = list.reduce((a, b) => a + b[0].k, 0) / list.length
  const t2 = list.reduce((a, b) => a + b[1].totalTime, 0) / list.length
  const k2 = list.reduce((a, b) => a + b[1].k, 0) / list.length
  const timeStr = new Date().toLocaleString()
  log.innerHTML = `\
<hr>
<h6>${timeStr}</h6>
<pre>
数量级：${Number(max).toLocaleString()}
执行次数：${times.toLocaleString()}
best:
  执行平均总时间：${t1.toLocaleString()} ms
  寻找最长子序列平均时间：${b1.toLocaleString()} ms
  移动平均总时间：${m1.toLocaleString()} ms
  最长子序列平均长度：${k1.toLocaleString()}
first:
  执行平均总时间：${t2.toLocaleString()} ms
  最长子序列平均长度：${k2.toLocaleString()}
</pre>` + log.innerHTML

  console.groupCollapsed(timeStr)
  console.log(list)
  console.groupEnd()
  
  stopButton.style.visibility = 'hidden'
  startButton.style.visibility = 'visible'
}
